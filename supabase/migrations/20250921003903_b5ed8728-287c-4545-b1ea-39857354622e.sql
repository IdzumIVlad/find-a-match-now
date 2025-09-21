-- Fix security issues for guest applications without exposing data

-- 1. Restrict service role access to profiles table
DROP POLICY IF EXISTS "Service role can view all profiles" ON public.profiles;

CREATE POLICY "Service role limited profile access" 
ON public.profiles 
FOR SELECT 
TO service_role
USING (
  -- Only allow access to specific user when needed for operations
  id = current_setting('app.current_user_id', true)::uuid
);

-- 2. Restrict service role access to applications table  
DROP POLICY IF EXISTS "Service role can view all applications" ON public.applications;

CREATE POLICY "Service role limited application access"
ON public.applications
FOR SELECT
TO service_role
USING (
  -- Only allow access when processing specific application
  id = current_setting('app.current_application_id', true)::uuid
);

-- 3. Create secure function for getting employer email without exposing data
CREATE OR REPLACE FUNCTION public.get_employer_email_for_application(job_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    employer_email text;
BEGIN
    -- Only callable by service role
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Access denied: Service role required';
    END IF;
    
    SELECT j.employer_email INTO employer_email
    FROM jobs j
    WHERE j.id = job_id_param;
    
    RETURN employer_email;
END;
$$;

-- 4. Create secure function for guest applications
CREATE OR REPLACE FUNCTION public.create_guest_application(
    p_job_id uuid,
    p_name text,
    p_email text,
    p_phone text DEFAULT NULL,
    p_message text DEFAULT NULL,
    p_resume_link text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    application_id uuid;
    job_exists boolean;
BEGIN
    -- Validate job exists
    SELECT EXISTS(SELECT 1 FROM jobs WHERE id = p_job_id) INTO job_exists;
    IF NOT job_exists THEN
        RAISE EXCEPTION 'Job not found';
    END IF;
    
    -- Validate required fields
    IF p_name IS NULL OR p_name = '' OR p_email IS NULL OR p_email = '' THEN
        RAISE EXCEPTION 'Name and email are required';
    END IF;
    
    -- Insert application
    INSERT INTO applications (
        vacancy_id,
        applied_by,
        guest_name,
        guest_email,
        guest_phone,
        message,
        resume_link
    ) VALUES (
        p_job_id,
        'guest',
        p_name,
        p_email,
        p_phone,
        p_message,
        p_resume_link
    ) RETURNING id INTO application_id;
    
    RETURN application_id;
END;
$$;

-- 5. Add RLS to view tables
ALTER TABLE public.applications_employer_safe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications_for_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications_for_employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes_public_safe ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for view tables
CREATE POLICY "Employers can view safe application data"
ON public.applications_employer_safe
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM vacancies v 
        WHERE v.id = vacancy_id 
        AND v.employer_id = auth.uid()
    )
);

CREATE POLICY "Candidates can view their applications"
ON public.applications_for_candidates
FOR SELECT
USING (candidate_id = auth.uid());

CREATE POLICY "Employers can view applications to their jobs"
ON public.applications_for_employers  
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM vacancies v
        WHERE v.id = vacancy_id
        AND v.employer_id = auth.uid()
    )
);

CREATE POLICY "Public can view safe resume data"
ON public.resumes_public_safe
FOR SELECT
USING (true);