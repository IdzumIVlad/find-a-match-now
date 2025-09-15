-- Fix Security Definer View issue - change view ownership to avoid implicit security definer
-- Views created by superusers can have implicit SECURITY DEFINER behavior
-- We need to ensure the view doesn't have elevated privileges

-- Drop and recreate the view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.jobs_public;

-- Create the view with explicit SECURITY INVOKER to ensure it uses the caller's permissions
CREATE VIEW public.jobs_public
WITH (security_invoker = true) AS
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

-- Grant appropriate permissions
GRANT SELECT ON public.jobs_public TO anon, authenticated;

-- Add comment explaining the security setting
COMMENT ON VIEW public.jobs_public IS 'Public view of jobs with SECURITY INVOKER - uses caller permissions, not view creator permissions';

-- Log the security fix
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "security_invoker_view", "description": "Fixed Security Definer View by explicitly setting SECURITY INVOKER"}');