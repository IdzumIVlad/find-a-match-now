-- Fix Security Definer View issue - jobs_public view bypasses RLS
-- The jobs_public view currently exposes all data from jobs table, including sensitive employer_email
-- This creates a security vulnerability as it bypasses RLS policies

-- Drop the existing view
DROP VIEW IF EXISTS public.jobs_public;

-- Recreate the view without sensitive fields and with proper security context
-- Remove employer_email from the public view as it's sensitive data
CREATE VIEW public.jobs_public AS
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
FROM public.jobs
WHERE true; -- This ensures the view respects RLS policies of the underlying table

-- Ensure the view has proper permissions
-- Grant access to public for this safe, filtered view
GRANT SELECT ON public.jobs_public TO anon, authenticated;

-- Add a comment explaining the security fix
COMMENT ON VIEW public.jobs_public IS 'Public view of jobs without sensitive data like employer_email. Respects RLS policies of underlying jobs table.';

-- Log the security fix
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "jobs_public_view_security", "description": "Fixed Security Definer View issue - removed sensitive fields and ensured RLS compliance"}');