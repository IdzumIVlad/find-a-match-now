import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApplicationNotificationRequest {
  type: string;
  vacancy_id: string;
  vacancy_title: string;
  employer_email: string;
  application_id: string;
  applied_by: 'candidate' | 'guest';
  message?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  resume_id?: string;
  resume_file_url?: string;
  resume_link?: string;
  resume_data?: {
    full_name: string;
    email: string;
    phone: string;
    summary: string;
    skills: string[];
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ApplicationNotificationRequest = await req.json();
    
    console.log("Processing application notification:", { 
      type: data.type, 
      vacancy_id: data.vacancy_id,
      applied_by: data.applied_by,
      employer_email: data.employer_email 
    });

    // Build candidate info section
    let candidateInfo = '';
    let candidateName = '';
    
    if (data.applied_by === 'candidate' && data.resume_data) {
      candidateName = data.resume_data.full_name;
      candidateInfo = `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937;">Информация о кандидате:</h3>
          <p style="margin: 5px 0;"><strong>Имя:</strong> ${data.resume_data.full_name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.resume_data.email}" style="color: #3b82f6;">${data.resume_data.email}</a></p>
          ${data.resume_data.phone ? `<p style="margin: 5px 0;"><strong>Телефон:</strong> <a href="tel:${data.resume_data.phone}" style="color: #3b82f6;">${data.resume_data.phone}</a></p>` : ''}
          ${data.resume_id ? `
            <p style="margin: 10px 0;">
              <a href="https://usmwwkltvjyjzaxsdyhz.supabase.co/resumes/${data.resume_id}" 
                 style="display: inline-block; background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                📋 Открыть резюме
              </a>
            </p>
          ` : ''}
        </div>
      `;
    } else if (data.applied_by === 'guest') {
      candidateName = data.guest_name || 'Гость';
      candidateInfo = `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937;">Информация о кандидате:</h3>
          <p style="margin: 5px 0;"><strong>Имя:</strong> ${data.guest_name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.guest_email}" style="color: #3b82f6;">${data.guest_email}</a></p>
          ${data.guest_phone ? `<p style="margin: 5px 0;"><strong>Телефон:</strong> <a href="tel:${data.guest_phone}" style="color: #3b82f6;">${data.guest_phone}</a></p>` : ''}
        </div>
      `;
    }

    // Resume attachments section
    let resumeSection = '';
    if (data.resume_file_url || data.resume_link) {
      resumeSection = `
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">📎 Приложенные материалы:</h4>
          ${data.resume_file_url ? `<p style="margin: 5px 0;"><strong>Файл резюме:</strong> <a href="${data.resume_file_url}" style="color: #3b82f6;" target="_blank">Скачать резюме</a></p>` : ''}
          ${data.resume_link ? `<p style="margin: 5px 0;"><strong>Ссылка на резюме:</strong> <a href="${data.resume_link}" style="color: #3b82f6;" target="_blank">${data.resume_link}</a></p>` : ''}
        </div>
      `;
    }

    // Message section
    const messageSection = data.message ? `
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0369a1;">💬 Сопроводительное письмо:</h4>
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
    ` : '';

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin: 0;">🎯 Новый отклик на вакансию!</h1>
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;">
          <div style="border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin: 0; font-size: 24px;">📋 ${data.vacancy_title}</h2>
          </div>
          
          ${candidateInfo}
          
          ${resumeSection}
          
          ${messageSection}
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Отклик получен через платформу <strong>laburoGO</strong>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "laburoGO <noreply@laburogo.com>",
      to: [data.employer_email],
      subject: `Новый отклик на вакансию «${data.vacancy_title}»`,
      html: emailBody,
    });

    console.log("Application notification email sent successfully:", emailResponse);

    // Send confirmation email to candidate/guest (optional)
    if (data.applied_by === 'candidate' && data.resume_data?.email) {
      const confirmationBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0;">✅ Отклик отправлен!</h1>
          </div>
          
          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;">
            <p style="font-size: 16px; line-height: 1.6;">Здравствуйте, ${data.resume_data.full_name}!</p>
            
            <p style="line-height: 1.6;">Ваш отклик на вакансию <strong>«${data.vacancy_title}»</strong> был успешно отправлен работодателю.</p>
            
            ${data.message ? `
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h4 style="margin: 0 0 10px 0; color: #0369a1;">Ваше сопроводительное письмо:</h4>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
              </div>
            ` : ''}
            
            <p style="line-height: 1.6; margin-top: 20px;">Работодатель получит ваши контактные данные и сможет связаться с вами в ближайшее время.</p>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Удачи в поиске работы! 🍀
              </p>
            </div>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: "laburoGO <noreply@laburogo.com>",
        to: [data.resume_data.email],
        subject: `Ваш отклик на вакансию «${data.vacancy_title}» отправлен`,
        html: confirmationBody,
      });
    } else if (data.applied_by === 'guest' && data.guest_email) {
      const confirmationBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0;">✅ Отклик отправлен!</h1>
          </div>
          
          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px;">
            <p style="font-size: 16px; line-height: 1.6;">Здравствуйте, ${data.guest_name}!</p>
            
            <p style="line-height: 1.6;">Ваш отклик на вакансию <strong>«${data.vacancy_title}»</strong> был успешно отправлен работодателю.</p>
            
            ${data.message ? `
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h4 style="margin: 0 0 10px 0; color: #0369a1;">Ваше сопроводительное письмо:</h4>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
              </div>
            ` : ''}
            
            <p style="line-height: 1.6; margin-top: 20px;">Работодатель получит ваши контактные данные и сможет связаться с вами в ближайшее время.</p>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Удачи в поиске работы! 🍀
              </p>
            </div>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: "laburoGO <noreply@laburogo.com>",
        to: [data.guest_email],
        subject: `Ваш отклик на вакансию «${data.vacancy_title}» отправлен`,
        html: confirmationBody,
      });
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application-notification function:", error);
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