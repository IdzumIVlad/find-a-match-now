-- Fix applications table to allow guest applications
-- Make candidate_id nullable to support guest applications
ALTER TABLE public.applications ALTER COLUMN candidate_id DROP NOT NULL;