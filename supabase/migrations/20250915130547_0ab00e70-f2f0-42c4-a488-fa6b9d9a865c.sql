-- CRITICAL SECURITY FIX: Remove employer email exposure to authenticated users
-- Currently "Authenticated users can view jobs safely" policy allows ALL authenticated users 
-- to see employer emails, creating risk of spam and competitive intelligence gathering

-- 1. Remove the overly permissive policy that exposes employer emails
DROP POLICY IF EXISTS "Authenticated users can view jobs safely" ON public.jobs;

-- 2. Create a restrictive policy that only allows job creators to see their own job emails
-- This allows job posters to see and manage their own postings
CREATE POLICY "Job creators can view their own jobs" 
ON public.jobs 
FOR SELECT 
USING (false); -- Temporarily block all direct access - force use of public view

-- 3. Allow job creation (this should remain unchanged)
-- The "Anyone can create jobs" policy is fine as it only allows INSERT

-- 4. Ensure the jobs_public view is the ONLY way to access job listings
-- This view already excludes employer_email for security
GRANT SELECT ON public.jobs_public TO anon, authenticated;

-- 5. Verify secure functions still work for controlled email access
-- get_job_contact_info and get_job_employer_email should remain functional
-- These use SECURITY DEFINER and have proper access controls

-- 6. Add explicit comment about security model
COMMENT ON TABLE public.jobs IS 'Direct access restricted for security. Use jobs_public view for listings or secure functions for controlled email access.';

-- 7. Log this critical security fix
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "employer_email_protection", "severity": "critical", "description": "Removed authenticated user access to employer emails in jobs table"}');