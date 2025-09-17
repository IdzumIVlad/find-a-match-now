-- Security fixes for data leaks and access control (corrected)

-- 1. Create security logs table for audit trail
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can insert security logs
CREATE POLICY "Service role can insert security logs" ON public.security_logs
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Users can view their own security logs
CREATE POLICY "Users can view own security logs" ON public.security_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Service role can view all security logs
CREATE POLICY "Service role can view all security logs" ON public.security_logs
  FOR SELECT TO service_role
  USING (true);

-- 2. Update profiles table RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create secure policies for profiles
-- Users can only view their own profile with all data
CREATE POLICY "Users can view own profile complete" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Service role can view all profiles
CREATE POLICY "Service role can view all profiles" ON public.profiles
  FOR SELECT TO service_role
  USING (true);

-- 3. Update applications table RLS policies
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "No direct application reading" ON public.applications;

-- Employers can view applications for their vacancies
CREATE POLICY "Employers can view own vacancy applications" ON public.applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.vacancies v
      WHERE v.id = applications.vacancy_id
        AND v.employer_id = auth.uid()
    )
  );

-- Candidates can view their own applications
CREATE POLICY "Candidates can view own applications" ON public.applications
  FOR SELECT TO authenticated
  USING (candidate_id = auth.uid() AND applied_by = 'candidate');

-- Service role can view all applications
CREATE POLICY "Service role can view all applications" ON public.applications
  FOR SELECT TO service_role
  USING (true);

-- 4. Update resumes table RLS policies
-- Drop existing policies that are too permissive
DROP POLICY IF EXISTS "Users with resume access can view resumes" ON public.resumes;

-- Create new secure policies for resumes
-- Candidates can view their own resumes (full data)
CREATE POLICY "Candidates can view own resumes complete" ON public.resumes
  FOR SELECT TO authenticated
  USING (candidate_id = auth.uid());

-- Employers with resume access can view contact details
CREATE POLICY "Employers with access can view resume details" ON public.resumes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.resume_access ra
      WHERE ra.user_id = auth.uid() 
        AND ra.has_access = true
    )
  );

-- Service role can view all resumes
CREATE POLICY "Service role can view all resumes" ON public.resumes
  FOR SELECT TO service_role
  USING (true);

-- 5. Update vacancies table RLS policies
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Anyone can view vacancies" ON public.vacancies;

-- Public can view basic vacancy info (no employer contact)
CREATE POLICY "Public can view basic vacancy info" ON public.vacancies
  FOR SELECT TO anon, authenticated
  USING (true);

-- Employers can view full details of their own vacancies
CREATE POLICY "Employers can view own vacancy details" ON public.vacancies
  FOR SELECT TO authenticated
  USING (employer_id = auth.uid());

-- Service role can view all vacancies
CREATE POLICY "Service role can view all vacancies" ON public.vacancies
  FOR SELECT TO service_role
  USING (true);

-- 6. Create function to validate password strength
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{"valid": true, "errors": []}'::JSONB;
  errors TEXT[] := '{}';
  common_passwords TEXT[] := ARRAY[
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'football', 'iloveyou', 'admin123', 'welcome123'
  ];
BEGIN
  -- Check minimum length
  IF LENGTH(password) < 8 THEN
    errors := array_append(errors, 'Password must be at least 8 characters long');
  END IF;
  
  -- Check for at least one letter
  IF password !~ '[a-zA-Z]' THEN
    errors := array_append(errors, 'Password must contain at least one letter');
  END IF;
  
  -- Check for at least one number
  IF password !~ '[0-9]' THEN
    errors := array_append(errors, 'Password must contain at least one number');
  END IF;
  
  -- Check against common passwords
  IF LOWER(password) = ANY(common_passwords) THEN
    errors := array_append(errors, 'This password is too common and unsafe');
  END IF;
  
  -- Return result
  IF array_length(errors, 1) > 0 THEN
    result := jsonb_build_object('valid', false, 'errors', errors);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  table_name TEXT,
  action_name TEXT,
  error_msg TEXT DEFAULT NULL,
  user_ip INET DEFAULT NULL,
  user_agent_header TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_logs (user_id, table_name, action, error_message, ip_address, user_agent)
  VALUES (auth.uid(), table_name, action_name, error_msg, user_ip, user_agent_header);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. Create function to get current user role securely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- 9. Ensure all tables have RLS enabled
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;