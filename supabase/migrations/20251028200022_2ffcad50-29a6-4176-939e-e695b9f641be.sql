-- Add currency column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add currency column to vacancies table
ALTER TABLE vacancies ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'RUB';

-- Add comment to explain currency codes
COMMENT ON COLUMN jobs.currency IS 'Currency code (USD, ARS, BRL, RUB, EUR, etc.)';
COMMENT ON COLUMN vacancies.currency IS 'Currency code (USD, ARS, BRL, RUB, EUR, etc.)';