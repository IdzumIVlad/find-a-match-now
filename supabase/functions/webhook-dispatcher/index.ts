import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookRecord {
  id: string;
  event_type: string;
  payload: any;
  status: string;
  try_count: number;
  last_error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log("Webhook dispatcher started");

    // Получаем pending вебхуки
    const { data: webhooks, error: fetchError } = await supabase
      .from('outbox_webhooks')
      .select('*')
      .eq('status', 'pending')
      .lt('try_count', 3) // Максимум 3 попытки
      .order('created_at', { ascending: true })
      .limit(10); // Обрабатываем по 10 за раз

    if (fetchError) {
      console.error("Error fetching webhooks:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${webhooks?.length || 0} pending webhooks`);

    if (!webhooks || webhooks.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending webhooks found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const results = [];

    for (const webhook of webhooks as WebhookRecord[]) {
      try {
        console.log(`Processing webhook ${webhook.id} of type ${webhook.event_type}`);

        // TODO: Здесь будет реальная отправка в Slack/Telegram
        // Пока просто логируем и помечаем как отправленное
        console.log("Webhook payload:", webhook.payload);

        // Имитируем успешную отправку
        const success = true; // В реальности проверяем ответ API

        if (success) {
          const { error: updateError } = await supabase
            .from('outbox_webhooks')
            .update({
              status: 'sent',
              updated_at: new Date().toISOString()
            })
            .eq('id', webhook.id);

          if (updateError) {
            console.error(`Error updating webhook ${webhook.id}:`, updateError);
          } else {
            console.log(`Webhook ${webhook.id} marked as sent`);
            results.push({ id: webhook.id, status: 'sent' });
          }
        } else {
          throw new Error('Webhook delivery failed');
        }

      } catch (error) {
        console.error(`Error processing webhook ${webhook.id}:`, error);
        
        // Увеличиваем счетчик попыток и записываем ошибку
        const { error: updateError } = await supabase
          .from('outbox_webhooks')
          .update({
            status: webhook.try_count >= 2 ? 'failed' : 'pending',
            try_count: webhook.try_count + 1,
            last_error: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', webhook.id);

        if (updateError) {
          console.error(`Error updating failed webhook ${webhook.id}:`, updateError);
        }

        results.push({ 
          id: webhook.id, 
          status: 'error', 
          error: error.message 
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${results.length} webhooks`,
        results 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error("Error in webhook dispatcher:", error);
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