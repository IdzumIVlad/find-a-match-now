-- ============================================================================
-- RLS Policies for Job Board (Fixed)
-- ============================================================================

-- Create app_role enum if not exists
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('candidate', 'employer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for secure role management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::app_role)
$$;

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  website text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Drop dependent views CASCADE before modifying applications table
DROP VIEW IF EXISTS public.applications_employer_safe CASCADE;
DROP VIEW IF EXISTS public.applications_for_employers CASCADE;
DROP VIEW IF EXISTS public.applications_for_candidates CASCADE;
DROP VIEW IF EXISTS public.jobs_public CASCADE;

-- Drop existing RLS policies on applications that reference vacancy_id
DROP POLICY IF EXISTS "Employers can view own vacancy applications" ON public.applications;
DROP POLICY IF EXISTS "Candidates can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Candidates can create their applications" ON public.applications;
DROP POLICY IF EXISTS "Guests can create guest applications" ON public.applications;
DROP POLICY IF EXISTS "Service role can view all applications" ON public.applications;

-- Now safe to drop the column
ALTER TABLE public.applications DROP COLUMN IF EXISTS vacancy_id;

-- Add new columns to applications
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS job_id uuid;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS status text DEFAULT 'new';

-- Drop and recreate jobs table
DROP TABLE IF EXISTS public.jobs CASCADE;
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  requirements text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_remote boolean DEFAULT false,
  salary_min integer,
  salary_max integer,
  location text,
  employment_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraint to applications.job_id
ALTER TABLE public.applications 
  ADD CONSTRAINT applications_job_id_fkey 
  FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

-- Add check constraint to applications.status
ALTER TABLE public.applications 
  DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE public.applications 
  ADD CONSTRAINT applications_status_check 
  CHECK (status IN ('new', 'in_review', 'rejected', 'accepted'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.applications(candidate_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: user_roles
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- ============================================================================
-- RLS POLICIES: profiles
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile complete" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin(auth.uid()));

-- ============================================================================
-- RLS POLICIES: companies
-- ============================================================================

CREATE POLICY "Public can view companies"
  ON public.companies FOR SELECT
  USING (true);

CREATE POLICY "Owners and admins can create companies"
  ON public.companies FOR INSERT
  WITH CHECK (owner_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Owners and admins can update companies"
  ON public.companies FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Owners and admins can delete companies"
  ON public.companies FOR DELETE
  USING (owner_id = auth.uid() OR public.is_admin(auth.uid()));

-- ============================================================================
-- RLS POLICIES: jobs
-- ============================================================================

CREATE POLICY "Public can view published jobs"
  ON public.jobs FOR SELECT
  USING (
    status = 'published' 
    OR EXISTS (
      SELECT 1 FROM public.companies c 
      WHERE c.id = jobs.company_id 
      AND c.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Company owners and admins can create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies c 
      WHERE c.id = jobs.company_id 
      AND c.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Company owners and admins can update jobs"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c 
      WHERE c.id = jobs.company_id 
      AND c.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Company owners and admins can delete jobs"
  ON public.jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.companies c 
      WHERE c.id = jobs.company_id 
      AND c.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- ============================================================================
-- RLS POLICIES: applications
-- ============================================================================

CREATE POLICY "Candidates can apply to published jobs"
  ON public.applications FOR INSERT
  WITH CHECK (
    candidate_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.jobs j 
      WHERE j.id = applications.job_id 
      AND j.status = 'published'
    )
  );

CREATE POLICY "Users can view relevant applications"
  ON public.applications FOR SELECT
  USING (
    candidate_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.companies c ON c.id = j.company_id
      WHERE j.id = applications.job_id
      AND c.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Users can update applications"
  ON public.applications FOR UPDATE
  USING (
    candidate_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.companies c ON c.id = j.company_id
      WHERE j.id = applications.job_id
      AND c.owner_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- Create trigger functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS set_companies_updated_at ON public.companies;
CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();