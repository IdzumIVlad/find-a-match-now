import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseViewTrackerParams {
  resourceType: 'vacancy' | 'resume';
  id: string;
  enabled?: boolean;
}

export const useViewTracker = ({ resourceType, id, enabled = true }: UseViewTrackerParams) => {
  useEffect(() => {
    if (!enabled || !id) return;

    const incrementView = async () => {
      const storageKey = `view::${resourceType}::${id}`;
      const lastViewTime = localStorage.getItem(storageKey);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      // Check if we've already viewed this resource in the last 24 hours
      if (lastViewTime && (now - parseInt(lastViewTime)) < twentyFourHours) {
        console.log(`View already tracked for ${resourceType} ${id} within 24 hours`);
        return;
      }

      try {
        // Call the edge function to increment the view
        const { data, error } = await supabase.functions.invoke('increment-view', {
          body: {
            resourceType,
            id
          }
        });

        if (error) {
          console.error('Error calling increment-view function:', error);
          return;
        }

        if (data?.success) {
          // Store the current timestamp to prevent duplicate increments
          localStorage.setItem(storageKey, now.toString());
          console.log(`View incremented for ${resourceType} ${id}. New count: ${data.newViewCount}`);
        }
      } catch (error) {
        console.error('Error incrementing view:', error);
      }
    };

    // Increment view after a short delay to ensure the page has loaded
    const timeoutId = setTimeout(incrementView, 1000);

    return () => clearTimeout(timeoutId);
  }, [resourceType, id, enabled]);
};