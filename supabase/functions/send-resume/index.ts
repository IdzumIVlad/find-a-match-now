import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResumeRequest {
  employerEmail: string;
  message: string;
  resumeData: {
    full_name: string;
    email: string;
    phone: string;
    summary: string;
    skills: string[];
    experience: any[];
    education: any[];
  };
  resumeUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { employerEmail, message, resumeData, resumeUrl }: ResumeRequest = await req.json();

    const formatExperience = (experience: any[]) => {
      if (!experience || experience.length === 0) return '';
      
      return experience.map(exp => `
        <div style="margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #3b82f6;">
          <h4 style="margin: 0; font-size: 16px; font-weight: 600;">${exp.position || ''}</h4>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">${exp.company || ''}</p>
          ${exp.startDate || exp.endDate ? `<p style="margin: 5px 0; color: #666; font-size: 12px;">
            ${exp.startDate ? new Date(exp.startDate).toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' }) : ''} - 
            ${exp.endDate ? new Date(exp.endDate).toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' }) : 'Настоящее время'}
          </p>` : ''}
          ${exp.responsibilities ? `<p style="margin: 10px 0; font-size: 14px;">${exp.responsibilities}</p>` : ''}
        </div>
      `).join('');
    };

    const formatEducation = (education: any[]) => {
      if (!education || education.length === 0) return '';
      
      return education.map(edu => `
        <div style="margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #10b981;">
          <h4 style="margin: 0; font-size: 16px; font-weight: 600;">${edu.degree || ''}</h4>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">${edu.institution || ''}</p>
          ${edu.startYear || edu.endYear ? `<p style="margin: 5px 0; color: #666; font-size: 12px;">
            ${edu.startYear || ''} - ${edu.endYear || 'Настоящее время'}
          </p>` : ''}
        </div>
      `).join('');
    };

    const formatSkills = (skills: string[]) => {
      if (!skills || skills.length === 0) return '';
      
      return skills.map(skill => 
        `<span style="display: inline-block; background-color: #f3f4f6; color: #374151; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px;">${skill}</span>`
      ).join('');
    };

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Новое резюме от кандидата</h2>
        
        ${message ? `
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Сопроводительное письмо:</h3>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        ` : ''}

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <div style="margin-bottom: 25px;">
            <h1 style="margin: 0 0 10px 0; color: #1f2937; font-size: 28px;">${resumeData.full_name}</h1>
            <div style="margin-bottom: 15px;">
              <a href="mailto:${resumeData.email}" style="color: #3b82f6; text-decoration: none; margin-right: 20px;">📧 ${resumeData.email}</a>
              ${resumeData.phone ? `<a href="tel:${resumeData.phone}" style="color: #3b82f6; text-decoration: none;">📞 ${resumeData.phone}</a>` : ''}
            </div>
          </div>

          ${resumeData.summary ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">О себе</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${resumeData.summary}</p>
            </div>
          ` : ''}

          ${resumeData.skills && resumeData.skills.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Навыки</h3>
              <div style="margin-top: 10px;">
                ${formatSkills(resumeData.skills)}
              </div>
            </div>
          ` : ''}

          ${resumeData.experience && resumeData.experience.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Опыт работы</h3>
              <div style="margin-top: 15px;">
                ${formatExperience(resumeData.experience)}
              </div>
            </div>
          ` : ''}

          ${resumeData.education && resumeData.education.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Образование</h3>
              <div style="margin-top: 15px;">
                ${formatEducation(resumeData.education)}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <a href="${resumeUrl}" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              Посмотреть полное резюме
            </a>
          </div>
        </div>

        <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Это письмо отправлено через платформу поиска работы</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Job Platform <onboarding@resend.dev>",
      to: [employerEmail],
      subject: `Новое резюме от ${resumeData.full_name}`,
      html: emailBody,
    });

    console.log("Resume email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-resume function:", error);
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