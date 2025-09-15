-- Create jobs table for storing job postings
CREATE TABLE public.jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    employment_type TEXT,
    description TEXT,
    requirements TEXT,
    employer_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (jobs should be visible to everyone)
CREATE POLICY "Anyone can view jobs" 
ON public.jobs 
FOR SELECT 
USING (true);

-- For now, anyone can create jobs (you can restrict this later)
CREATE POLICY "Anyone can create jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();