-- Fix security definer issue - remove SECURITY DEFINER from function
DROP FUNCTION IF EXISTS public.get_public_jobs_safe();

-- Create simple function without SECURITY DEFINER - uses caller's permissions
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
STABLE
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

-- Grant execute permissions to public
GRANT EXECUTE ON FUNCTION public.get_public_jobs_safe() TO anon, authenticated;

-- Alternative: Update app to use the view directly instead of function
-- The jobs_public view is already safe and accessible

-- Log security fix completion
INSERT INTO public.events (event_type, payload) VALUES 
('security_update', '{"fix": "removed_security_definer", "description": "Fixed SECURITY DEFINER view warning"}');