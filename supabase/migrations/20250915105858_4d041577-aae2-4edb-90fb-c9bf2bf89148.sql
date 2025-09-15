-- Add columns for guest applications
ALTER TABLE public.applications 
ADD COLUMN guest_name text,
ADD COLUMN guest_email text,
ADD COLUMN guest_phone text,
ADD COLUMN applied_by text CHECK (applied_by IN ('candidate', 'guest')) DEFAULT 'guest';

-- Create unique constraints
-- One application per candidate per vacancy
CREATE UNIQUE INDEX idx_applications_candidate_vacancy 
ON public.applications(vacancy_id, candidate_id) 
WHERE candidate_id IS NOT NULL;

-- One application per guest email per vacancy
CREATE UNIQUE INDEX idx_applications_guest_vacancy 
ON public.applications(vacancy_id, lower(guest_email)) 
WHERE guest_email IS NOT NULL;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Candidates can create applications" ON public.applications;
DROP POLICY IF EXISTS "Candidates can view their applications" ON public.applications;
DROP POLICY IF EXISTS "Employers can view applications for their vacancies" ON public.applications;

-- New INSERT policy: anonymous users can insert guest applications, candidates can insert their own
CREATE POLICY "Anyone can create applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (
  (applied_by = 'guest' AND guest_email IS NOT NULL AND guest_name IS NOT NULL AND guest_phone IS NOT NULL) 
  OR 
  (applied_by = 'candidate' AND candidate_id = auth.uid() AND auth.uid() IS NOT NULL)
);

-- SELECT policy: candidates can view their applications, employers can view applications for their vacancies
CREATE POLICY "Users can view relevant applications" 
ON public.applications 
FOR SELECT 
USING (
  -- Candidates can see their own applications
  (candidate_id = auth.uid()) 
  OR 
  -- Employers can see applications for their vacancies
  EXISTS (
    SELECT 1 FROM public.vacancies v 
    WHERE v.id = applications.vacancy_id 
    AND v.employer_id = auth.uid()
  )
);