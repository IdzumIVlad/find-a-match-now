import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRateLimit = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback(async (vacancyId: string): Promise<boolean> => {
    try {
      // Generate a session ID for tracking
      const sessionId = sessionStorage.getItem('session_id') || 
        (() => {
          const id = Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('session_id', id);
          return id;
        })();

      // Call secure server-side rate limiting
      const { data, error } = await supabase.functions.invoke('secure-rate-limit', {
        body: {
          vacancyId,
          userAgent: navigator.userAgent,
          sessionId
        }
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return false; // Allow application on error to avoid blocking legitimate users
      }

      const blocked = data?.blocked || false;
      setIsBlocked(blocked);
      
      return blocked;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return false;
    }
  }, []);

  // Deprecated - recording is now handled server-side
  const recordApplication = useCallback(async (vacancyId: string, userId?: string) => {
    // This function is now handled automatically by the server
    console.log('Application recording is now handled server-side');
  }, []);

  return { checkRateLimit, recordApplication, isBlocked };
};