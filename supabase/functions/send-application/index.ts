import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApplicationRequest {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: string;
  jobTitle: string;
  companyName: string;
  employerEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      coverLetter, 
      resume, 
      jobTitle, 
      companyName, 
      employerEmail 
    }: ApplicationRequest = await req.json();

    console.log("Sending application email:", { name, email, jobTitle, companyName, employerEmail });

    const emailResponse = await resend.emails.send({
      from: "Отклики <onboarding@resend.dev>",
      to: [employerEmail],
      subject: `Новый отклик на вакансию: ${jobTitle}`,
      html: `
        <h1>Новый отклик на вакансию</h1>
        <h2>Вакансия: ${jobTitle}</h2>
        <h3>Компания: ${companyName}</h3>
        
        <hr>
        
        <h3>Информация о кандидате:</h3>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Телефон:</strong> ${phone}</p>` : ''}
        ${resume ? `<p><strong>Резюме:</strong> <a href="${resume}" target="_blank">${resume}</a></p>` : ''}
        
        ${coverLetter ? `
        <h3>Сопроводительное письмо:</h3>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${coverLetter}</p>
        ` : ''}
        
        <hr>
        <p style="color: #666; font-size: 14px;">
          Этот отклик был отправлен через JobBoard MVP
        </p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application function:", error);
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