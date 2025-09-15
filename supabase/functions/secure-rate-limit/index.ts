import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RateLimitRequest {
  vacancyId: string;
  userAgent?: string;
  sessionId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { vacancyId, userAgent, sessionId }: RateLimitRequest = await req.json();

    // Get real IP address from headers
    const realIP = req.headers.get('cf-connecting-ip') || 
                   req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   '127.0.0.1';

    // Create secure hash with proper salt
    const salt = Deno.env.get('RATE_LIMIT_SALT') || 'default_salt_change_in_production';
    const encoder = new TextEncoder();
    const data = encoder.encode(realIP + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Check rate limit - no more than 1 application per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: existingApplications, error: checkError } = await supabase
      .from('apply_audit')
      .select('id')
      .eq('vacancy_id', vacancyId)
      .eq('ip_hash', ipHash)
      .gte('created_at', tenMinutesAgo)
      .limit(1);

    if (checkError) {
      console.error('Rate limit check failed:', checkError);
      return new Response(
        JSON.stringify({ blocked: false, error: 'Rate limit check failed' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const blocked = existingApplications && existingApplications.length > 0;

    // If not blocked, record the application attempt
    if (!blocked) {
      const { error: insertError } = await supabase
        .from('apply_audit')
        .insert({
          vacancy_id: vacancyId,
          ip_hash: ipHash,
          user_agent: userAgent || null,
          session_id: sessionId || null
        });

      if (insertError) {
        console.error('Failed to record application audit:', insertError);
      }

      // Log security event
      const { error: eventError } = await supabase
        .from('events')
        .insert({
          event_type: 'security_update',
          payload: { 
            action: 'rate_limit_check', 
            vacancyId, 
            blocked: false,
            ipHash: ipHash.substring(0, 8) + '...' // Log only partial hash
          }
        });

      if (eventError) {
        console.error('Failed to log rate limit event:', eventError);
      }
    }

    return new Response(
      JSON.stringify({ blocked }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in secure-rate-limit function:', error);
    return new Response(
      JSON.stringify({ blocked: false, error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});