-- Create a secure function to get public job listings without employer emails
CREATE OR REPLACE FUNCTION public.get_public_jobs()
RETURNS TABLE (
    id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    title text,
    company_name text,
    location text,
    salary text,
    employment_type text,
    description text,
    requirements text
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to get employer email for application purposes only
CREATE OR REPLACE FUNCTION public.get_job_employer_email(job_id uuid)
RETURNS text AS $$
DECLARE
    employer_email text;
BEGIN
    SELECT j.employer_email INTO employer_email
    FROM jobs j
    WHERE j.id = job_id;
    
    RETURN employer_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update RLS policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can view jobs" ON public.jobs;

-- Create more restrictive policy that blocks direct access to employer_email
CREATE POLICY "Restricted job access" ON public.jobs
FOR SELECT USING (false);

-- Allow INSERT as before
-- The "Anyone can create jobs" policy remains the same