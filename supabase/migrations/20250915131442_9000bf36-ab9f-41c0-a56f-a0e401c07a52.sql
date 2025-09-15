-- Fix Security Definer View issue on the new applications_employer_safe view
-- Ensure the view uses SECURITY INVOKER to use caller's permissions

DROP VIEW IF EXISTS public.applications_employer_safe;

-- Recreate the view with explicit SECURITY INVOKER
CREATE VIEW public.applications_employer_safe
WITH (security_invoker = true) AS
SELECT 
  id,
  vacancy_id,
  applied_by,
  message,
  resume_id,
  resume_file_url,
  resume_link,
  created_at,
  -- Include minimal contact info only when necessary
  CASE 
    WHEN applied_by = 'guest' THEN guest_name
    ELSE NULL
  END as applicant_name,
  CASE 
    WHEN applied_by = 'guest' THEN guest_email  
    ELSE NULL
  END as contact_email,
  -- Hide phone numbers to reduce spam risk
  candidate_id
FROM public.applications;

-- Grant access to the safe view
GRANT SELECT ON public.applications_employer_safe TO authenticated;

-- Add security comment
COMMENT ON VIEW public.applications_employer_safe IS 'Employer-safe view with SECURITY INVOKER - minimal personal data exposure using caller permissions';

-- Log the security fix
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "applications_view_security_invoker", "description": "Applied SECURITY INVOKER to applications employer view"}');