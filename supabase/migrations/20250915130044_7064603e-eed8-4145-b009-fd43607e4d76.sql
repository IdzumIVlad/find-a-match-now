-- Fix Security Definer View issue on the new resumes_public_safe view
-- Ensure the view uses SECURITY INVOKER to use caller's permissions

DROP VIEW IF EXISTS public.resumes_public_safe;

-- Recreate the view with explicit SECURITY INVOKER
CREATE VIEW public.resumes_public_safe
WITH (security_invoker = true) AS
SELECT 
  id,
  -- Remove PII: full_name, email, phone are excluded for security
  summary,
  skills,
  views,
  created_at,
  education,
  experience
FROM public.resumes;

-- Grant public access to the safe view
GRANT SELECT ON public.resumes_public_safe TO anon, authenticated;

-- Add comment explaining the security settings
COMMENT ON VIEW public.resumes_public_safe IS 'Secure public view with SECURITY INVOKER - excludes all PII (names, emails, phones) and uses caller permissions';

-- Log the additional security fix
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "resumes_view_security_invoker", "description": "Applied SECURITY INVOKER to resumes public view"}');