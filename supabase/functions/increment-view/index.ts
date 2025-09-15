import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface IncrementViewRequest {
  resourceType: 'vacancy' | 'resume';
  id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resourceType, id }: IncrementViewRequest = await req.json();

    if (!resourceType || !id) {
      return new Response(
        JSON.stringify({ error: "Missing resourceType or id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (resourceType !== 'vacancy' && resourceType !== 'resume') {
      return new Response(
        JSON.stringify({ error: "Invalid resourceType. Must be 'vacancy' or 'resume'" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Determine table name based on resource type
    const tableName = resourceType === 'vacancy' ? 'vacancies' : 'resumes';

    // Increment views in the database
    const { data, error } = await supabase
      .from(tableName)
      .update({ views: supabase.raw('views + 1') })
      .eq('id', id)
      .select('views')
      .single();

    if (error) {
      console.error(`Error incrementing ${resourceType} views:`, error);
      return new Response(
        JSON.stringify({ error: `Failed to increment views: ${error.message}` }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Successfully incremented views for ${resourceType} ${id}. New view count: ${data?.views}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        newViewCount: data?.views || 0,
        resourceType,
        id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in increment-view function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);