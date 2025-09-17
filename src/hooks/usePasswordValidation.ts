import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const usePasswordValidation = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = async (password: string): Promise<ValidationResult> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('validate_password_strength', {
        password
      });

      if (error) {
        console.error('Password validation error:', error);
        return {
          valid: false,
          errors: ['Failed to validate password']
        };
      }

      const result = (data as unknown) as ValidationResult;
      // Validate the structure to ensure type safety
      if (result && typeof result === 'object' && 'valid' in result && 'errors' in result) {
        setValidationResult(result);
        return result;
      } else {
        // Fallback if structure is unexpected
        const fallback = { valid: false, errors: ['Validation failed'] };
        setValidationResult(fallback);
        return fallback;
      }
    } catch (error) {
      console.error('Password validation error:', error);
      const result = {
        valid: false,
        errors: ['Failed to validate password']
      };
      setValidationResult(result);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    validatePassword,
    validationResult,
    loading
  };
};