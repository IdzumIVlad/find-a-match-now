-- Fix the overly restrictive RLS policy that blocks all job access
-- Drop the current restrictive policy
DROP POLICY IF EXISTS "Restricted job access" ON public.jobs;

-- Create a new policy that allows public SELECT access to jobs
-- but the get_public_jobs() function will handle filtering out employer_email
CREATE POLICY "Public can view job listings" ON public.jobs
FOR SELECT
USING (true);