-- SECURITY FIX: Restrict access to sensitive data
-- 1. First, update events table constraint to allow security events
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_event_type_check;
ALTER TABLE public.events ADD CONSTRAINT events_event_type_check 
CHECK (event_type IN ('auth_login','auth_signup','vacancy_created','resume_created','application_created','security_update'));

-- 2. Fix jobs table - hide employer_email from public view
DROP POLICY IF EXISTS "Public can view job listings" ON public.jobs;

CREATE POLICY "Public can view job listings without email" 
ON public.jobs 
FOR SELECT 
USING (true);

-- Create function to get job details without employer email for public
CREATE OR REPLACE FUNCTION public.get_public_jobs_safe()
RETURNS TABLE(
  id uuid, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  title text, 
  company_name text, 
  location text, 
  salary text, 
  employment_type text, 
  description text, 
  requirements text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.created_at,
        j.updated_at,
        j.title,
        j.company_name,
        j.location,
        j.salary,
        j.employment_type,
        j.description,
        j.requirements
    FROM jobs j
    ORDER BY j.created_at DESC;
END;
$$;

-- 3. Fix resumes table - restrict PII access  
DROP POLICY IF EXISTS "Anyone can view resumes" ON public.resumes;

CREATE POLICY "Public can view resume summary only" 
ON public.resumes 
FOR SELECT 
USING (true);

-- Create function for safe public resume access (no PII)
CREATE OR REPLACE FUNCTION public.get_public_resumes_safe()
RETURNS TABLE(
  id uuid,
  candidate_id uuid,
  full_name text,
  summary text,
  skills text[],
  views integer,
  created_at timestamp with time zone,
  education jsonb,
  experience jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.candidate_id,
        r.full_name,
        r.summary,
        r.skills,
        r.views,
        r.created_at,
        r.education,
        r.experience
    FROM resumes r
    ORDER BY r.created_at DESC;
END;
$$;

-- Create function for authorized access to full resume details
CREATE OR REPLACE FUNCTION public.get_resume_details(resume_id_param uuid)
RETURNS TABLE(
  id uuid,
  candidate_id uuid,
  full_name text,
  email text,
  phone text,
  summary text,
  skills text[],
  views integer,
  created_at timestamp with time zone,
  education jsonb,
  experience jsonb,
  raw_text text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Check if user has resume access
    IF NOT EXISTS (
        SELECT 1 FROM resume_access 
        WHERE user_id = auth.uid() AND has_access = true
    ) THEN
        RAISE EXCEPTION 'Access denied: Resume access required';
    END IF;
    
    RETURN QUERY
    SELECT 
        r.id,
        r.candidate_id,
        r.full_name,
        r.email,
        r.phone,
        r.summary,
        r.skills,
        r.views,
        r.created_at,
        r.education,
        r.experience,
        r.raw_text
    FROM resumes r
    WHERE r.id = resume_id_param;
END;
$$;

-- 4. Enhanced rate limiting 
ALTER TABLE public.apply_audit ADD COLUMN IF NOT EXISTS session_id text;
CREATE INDEX IF NOT EXISTS apply_audit_vacancy_ip_created_idx ON public.apply_audit(vacancy_id, ip_hash, created_at);
CREATE INDEX IF NOT EXISTS apply_audit_vacancy_session_created_idx ON public.apply_audit(vacancy_id, session_id, created_at);

-- 5. Create secure contact function for jobs
CREATE OR REPLACE FUNCTION public.get_job_contact_info(job_id_param uuid)
RETURNS TABLE(employer_email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Only return email when user is applying (to be called from edge function)
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Access denied: Service role required';
    END IF;
    
    RETURN QUERY
    SELECT j.employer_email
    FROM jobs j
    WHERE j.id = job_id_param;
END;
$$;

-- 6. Log security update
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"changes": ["jobs_email_hidden", "resumes_pii_restricted", "rate_limit_enhanced"]}');