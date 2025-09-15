-- Create vacancies table
CREATE TABLE public.vacancies (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    location text,
    employment_type text,
    salary_min integer,
    salary_max integer,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    views integer NOT NULL DEFAULT 0
);

-- Create resumes table
CREATE TABLE public.resumes (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    summary text,
    skills text[],
    experience jsonb,
    education jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    views integer NOT NULL DEFAULT 0
);

-- Create applications table
CREATE TABLE public.applications (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id uuid NOT NULL REFERENCES public.vacancies(id) ON DELETE CASCADE,
    candidate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create resume_access table
CREATE TABLE public.resume_access (
    user_id uuid NOT NULL PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    has_access boolean NOT NULL DEFAULT false,
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_access ENABLE ROW LEVEL SECURITY;

-- Policies for vacancies table
-- Everyone can view vacancies
CREATE POLICY "Anyone can view vacancies" 
ON public.vacancies 
FOR SELECT 
USING (true);

-- Only employers can create vacancies for themselves
CREATE POLICY "Employers can create vacancies" 
ON public.vacancies 
FOR INSERT 
WITH CHECK (employer_id = auth.uid());

-- Only employers can update their own vacancies
CREATE POLICY "Employers can update their vacancies" 
ON public.vacancies 
FOR UPDATE 
USING (employer_id = auth.uid());

-- Only employers can delete their own vacancies
CREATE POLICY "Employers can delete their vacancies" 
ON public.vacancies 
FOR DELETE 
USING (employer_id = auth.uid());

-- Policies for resumes table
-- Everyone can view resumes
CREATE POLICY "Anyone can view resumes" 
ON public.resumes 
FOR SELECT 
USING (true);

-- Only candidates can create resumes for themselves
CREATE POLICY "Candidates can create resumes" 
ON public.resumes 
FOR INSERT 
WITH CHECK (candidate_id = auth.uid());

-- Only candidates can update their own resumes
CREATE POLICY "Candidates can update their resumes" 
ON public.resumes 
FOR UPDATE 
USING (candidate_id = auth.uid());

-- Only candidates can delete their own resumes
CREATE POLICY "Candidates can delete their resumes" 
ON public.resumes 
FOR DELETE 
USING (candidate_id = auth.uid());

-- Policies for applications table
-- Candidates can create applications for themselves
CREATE POLICY "Candidates can create applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (candidate_id = auth.uid());

-- Candidates can view their own applications
CREATE POLICY "Candidates can view their applications" 
ON public.applications 
FOR SELECT 
USING (candidate_id = auth.uid());

-- Employers can view applications for their vacancies
CREATE POLICY "Employers can view applications for their vacancies" 
ON public.applications 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.vacancies v 
        WHERE v.id = applications.vacancy_id 
        AND v.employer_id = auth.uid()
    )
);

-- Policies for resume_access table
-- Users can view their own access status
CREATE POLICY "Users can view their resume access" 
ON public.resume_access 
FOR SELECT 
USING (user_id = auth.uid());

-- Only service role can update resume access
CREATE POLICY "Service role can update resume access" 
ON public.resume_access 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create triggers for updated_at columns
CREATE TRIGGER update_resume_access_updated_at
BEFORE UPDATE ON public.resume_access
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_vacancies_employer_id ON public.vacancies(employer_id);
CREATE INDEX idx_vacancies_created_at ON public.vacancies(created_at DESC);
CREATE INDEX idx_resumes_candidate_id ON public.resumes(candidate_id);
CREATE INDEX idx_resumes_created_at ON public.resumes(created_at DESC);
CREATE INDEX idx_applications_vacancy_id ON public.applications(vacancy_id);
CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);