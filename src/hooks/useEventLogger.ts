import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type EventType = 'auth_login' | 'auth_signup' | 'vacancy_created' | 'resume_created' | 'application_created';

interface EventPayload {
  [key: string]: any;
}

export const useEventLogger = () => {
  const { user } = useAuth();

  const logEvent = useCallback(async (eventType: EventType, payload?: EventPayload) => {
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          user_id: user?.id || null,
          event_type: eventType,
          payload: payload || null
        });

      if (error) {
        console.error('Failed to log event:', error);
      } else {
        console.log(`Event logged: ${eventType}`, payload);
      }
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }, [user?.id]);

  return { logEvent };
};