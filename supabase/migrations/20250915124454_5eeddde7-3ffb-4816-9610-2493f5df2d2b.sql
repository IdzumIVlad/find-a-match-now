-- Fix critical security vulnerability: Remove public access to sensitive personal data in resumes table
-- Currently anyone can access full names, emails, phone numbers without authentication

-- 1. Remove the overly permissive policy that allows public access to all resume data
DROP POLICY IF EXISTS "Public can view resume summary only" ON public.resumes;

-- 2. Create a safe public view that excludes all personally identifiable information (PII)
-- This view will only show non-sensitive data for public resume browsing
CREATE OR REPLACE VIEW public.resumes_public_safe AS
SELECT 
  id,
  -- Remove PII: full_name, email, phone are excluded
  summary,
  skills,
  views,
  created_at,
  education,
  experience
FROM public.resumes;

-- 3. Allow public access to the safe view only
GRANT SELECT ON public.resumes_public_safe TO anon, authenticated;

-- 4. Create RLS policy for candidates to access their own full resume data
CREATE POLICY "Candidates can view their own resumes" 
ON public.resumes 
FOR SELECT 
USING (candidate_id = auth.uid());

-- 5. Update the get_public_resumes_safe function to use the new secure view
DROP FUNCTION IF EXISTS public.get_public_resumes_safe();
CREATE OR REPLACE FUNCTION public.get_public_resumes_safe()
RETURNS TABLE(
  id uuid,
  summary text,
  skills text[],
  views integer,
  created_at timestamp with time zone,
  education jsonb,
  experience jsonb
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    id,
    summary,
    skills,
    views,
    created_at,
    education,
    experience
  FROM resumes_public_safe
  ORDER BY created_at DESC;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_public_resumes_safe() TO anon, authenticated;

-- 6. Add comment explaining the security fix
COMMENT ON VIEW public.resumes_public_safe IS 'Secure public view of resumes - excludes all PII (names, emails, phones)';

-- 7. Log the critical security fix
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "resumes_pii_protection", "severity": "critical", "description": "Removed public access to PII in resumes table - created secure public view"}');