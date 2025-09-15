import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEventLogger } from "@/hooks/useEventLogger";
import { useRateLimit } from "@/hooks/useRateLimit";

interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export const ApplicationForm = ({ open, onOpenChange, jobId, jobTitle, companyName }: ApplicationFormProps) => {
  const { toast } = useToast();
  const { logEvent } = useEventLogger();
  const { checkRateLimit, recordApplication, isBlocked } = useRateLimit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Антиспам honeypot
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка honeypot
    if (honeypot) {
      console.log('Spam detected via honeypot');
      return;
    }
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    // Проверка rate limiting с использованием серверной функции
    const rateLimited = await checkRateLimit(jobId);
    if (rateLimited) {
      toast({
        title: "Слишком много заявок",
        description: "Повторная заявка будет доступна через 10 минут",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Блокируем кнопку на 10 секунд
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 10000);

    try {
      // Получаем email работодателя через безопасную серверную функцию
      // Эта функция требует service_role и вызывается только из edge function
      
      const { data, error } = await supabase.functions.invoke('send-application', {
        body: {
          jobId: jobId,
          jobTitle,
          companyName,
          applicantName: formData.name,
          applicantEmail: formData.email,
          applicantPhone: formData.phone,
          coverLetter: formData.coverLetter,
          resumeLink: formData.resume, // Используем resume как resumeLink
        },
      });

      if (error) {
        throw error;
      }

      // Записываем в базу данных заявку  
      const { error: dbError } = await supabase.from('applications').insert({
        vacancy_id: jobId,
        candidate_id: null, // Guest application
        applied_by: 'guest',
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        message: formData.coverLetter,
        resume_link: formData.resume
      });

      if (dbError) {
        console.error('Database error:', dbError);
        // Don't throw - email was sent successfully
      }

      // Rate limit recording is now handled server-side automatically
      // await recordApplication(jobId); - deprecated

      // Логируем событие
      await logEvent('application_created', {
        job_id: jobId,
        job_title: jobTitle,
        company_name: companyName,
        applicant_email: formData.email
      });

      // Создаем запись в outbox для вебхука
      await supabase
        .from('outbox_webhooks')
        .insert({
          event_type: 'application_created',
          payload: {
            job_id: jobId,
            job_title: jobTitle,
            company_name: companyName,
            applicant_name: formData.name,
            applicant_email: formData.email,
            created_at: new Date().toISOString()
          }
        });

      setFormData({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: "",
      });
      onOpenChange(false);
      
      toast({
        title: "Отклик отправлен!",
        description: `Ваш отклик на вакансию "${jobTitle}" успешно отправлен в ${companyName}`,
      });
    } catch (error) {
      console.error("Error sending application:", error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить отклик. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Отклик на вакансию
          </DialogTitle>
          <DialogDescription>
            <strong>{jobTitle}</strong> в компании {companyName}
            <br />
            Заполните форму для отправки отклика. Поля отмеченные * обязательны.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Полное имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="ivan@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Ссылка на резюме</Label>
            <Input
              id="resume"
              type="url"
              value={formData.resume}
              onChange={(e) => handleInputChange("resume", e.target.value)}
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Сопроводительное письмо</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) => handleInputChange("coverLetter", e.target.value)}
              placeholder="Расскажите, почему вы подходите для этой позиции..."
              rows={4}
            />
          </div>

          {/* Honeypot field - скрытое поле для ботов */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isSubmitting || buttonDisabled || isBlocked}
            >
              {isSubmitting ? "Отправляется..." : 
               buttonDisabled ? "Подождите..." :
               isBlocked ? "Заблокировано" : 
               "Отправить отклик"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};