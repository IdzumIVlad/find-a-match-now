-- URGENT SECURITY FIX: Block public access to jobs table completely
DROP POLICY IF EXISTS "Public can view job listings without email" ON public.jobs;

-- Block all direct public access to jobs table
CREATE POLICY "Block public access to jobs" 
ON public.jobs 
FOR SELECT 
USING (false);

-- Allow authenticated users to view jobs (but they should use safe functions)
CREATE POLICY "Authenticated users can view jobs safely" 
ON public.jobs 
FOR SELECT 
TO authenticated
USING (true);

-- Create public view that excludes sensitive data
CREATE OR REPLACE VIEW public.jobs_public AS 
SELECT 
  id,
  title,
  company_name,
  location,
  salary,
  employment_type,
  description,
  requirements,
  created_at,
  updated_at
FROM public.jobs;

-- Allow public to read from the safe view
GRANT SELECT ON public.jobs_public TO anon, authenticated;

-- Update the safe function to use proper security
DROP FUNCTION IF EXISTS public.get_public_jobs_safe();
CREATE OR REPLACE FUNCTION public.get_public_jobs_safe()
RETURNS TABLE(
  id uuid,
  title text,
  company_name text,
  location text,
  salary text,
  employment_type text,
  description text,
  requirements text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    id,
    title,
    company_name,
    location,
    salary,
    employment_type,
    description,
    requirements,
    created_at,
    updated_at
  FROM jobs_public
  ORDER BY created_at DESC;
$$;

-- Log security fix
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "blocked_public_jobs_access", "severity": "critical", "description": "Removed public access to jobs table employer emails"}');