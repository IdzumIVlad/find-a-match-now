-- Add missing columns to applications table
ALTER TABLE public.applications 
  ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS resume_file_url TEXT,
  ADD COLUMN IF NOT EXISTS resume_link TEXT;

-- Update applied_by column to have proper check constraint
ALTER TABLE public.applications 
  ALTER COLUMN applied_by SET DEFAULT 'guest',
  DROP CONSTRAINT IF EXISTS applications_applied_by_check,
  ADD CONSTRAINT applications_applied_by_check CHECK (applied_by IN ('candidate', 'guest'));

-- Create unique indexes for preventing duplicate applications
CREATE UNIQUE INDEX IF NOT EXISTS applications_candidate_unique
  ON public.applications (vacancy_id, candidate_id)
  WHERE candidate_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS applications_guest_unique
  ON public.applications (vacancy_id, LOWER(guest_email))
  WHERE guest_email IS NOT NULL;

-- Create storage bucket for application files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('application-files', 'application-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for application files
CREATE POLICY "Anyone can upload application files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'application-files');

CREATE POLICY "Anyone can view application files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'application-files');

-- Update RLS policies for applications
DROP POLICY IF EXISTS "Anyone can create applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view relevant applications" ON public.applications;

-- Policy for inserting applications
CREATE POLICY "Guests can create guest applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (
  applied_by = 'guest' 
  AND guest_email IS NOT NULL 
  AND guest_name IS NOT NULL 
  AND candidate_id IS NULL
);

CREATE POLICY "Candidates can create their applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (
  applied_by = 'candidate' 
  AND candidate_id = auth.uid() 
  AND auth.uid() IS NOT NULL
);

-- Policy for selecting applications  
CREATE POLICY "Employers can view applications for their vacancies" 
ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM vacancies v 
    WHERE v.id = applications.vacancy_id 
    AND v.employer_id = auth.uid()
  )
);

CREATE POLICY "Candidates can view their own applications" 
ON public.applications 
FOR SELECT 
USING (candidate_id = auth.uid());