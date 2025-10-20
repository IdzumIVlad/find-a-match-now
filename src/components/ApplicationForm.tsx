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
import { useTranslation } from "react-i18next";
import { trackApplyJob } from "@/lib/analytics";

interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyId?: string;
}

export const ApplicationForm = ({ open, onOpenChange, jobId, jobTitle, companyName, companyId }: ApplicationFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { logEvent } = useEventLogger();
  const { checkRateLimit, recordApplication, isBlocked } = useRateLimit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
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
    
    if (honeypot) {
      console.log('Spam detected via honeypot');
      return;
    }
    
    if (!formData.name || !formData.email) {
      toast({
        title: t("common.error"),
        description: t("application.fieldsRequired"),
        variant: "destructive",
      });
      return;
    }

    const rateLimited = await checkRateLimit(jobId);
    if (rateLimited) {
      toast({
        title: t("application.tooManyApplications"),
        description: t("application.rateLimitDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 10000);

    try {
      const { data, error } = await supabase.functions.invoke('send-application', {
        body: {
          jobId: jobId,
          jobTitle,
          companyName,
          applicantName: formData.name,
          applicantEmail: formData.email,
          applicantPhone: formData.phone,
          coverLetter: formData.coverLetter,
          resumeLink: formData.resume,
        },
      });

      if (error) {
        throw error;
      }

      const { error: dbError } = await supabase.from('applications').insert({
        vacancy_id: jobId,
        candidate_id: null,
        applied_by: 'guest',
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        message: formData.coverLetter,
        resume_link: formData.resume
      });

      if (dbError) {
        console.error('Database error:', dbError);
      }

      await logEvent('application_created', {
        job_id: jobId,
        job_title: jobTitle,
        company_name: companyName,
        applicant_email: formData.email
      });

      // Track application in GA4
      trackApplyJob({
        job_id: jobId,
        company_id: companyId,
      });

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
        title: t("application.success"),
        description: t("application.successDesc", { title: jobTitle, company: companyName }),
      });
    } catch (error) {
      console.error("Error sending application:", error);
      toast({
        title: t("application.error"),
        description: t("application.errorDesc"),
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
            {t("application.title")}
          </DialogTitle>
          <DialogDescription>
            <strong>{jobTitle}</strong> {t("application.companyAt", { company: companyName })}
            <br />
            {t("application.fillForm")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("application.fullName")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={t("application.fullNamePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")} *</Label>
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
            <Label htmlFor="phone">{t("application.phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder={t("application.phonePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">{t("application.resumeLink")}</Label>
            <Input
              id="resume"
              type="text"
              value={formData.resume}
              onChange={(e) => handleInputChange("resume", e.target.value)}
              placeholder={t("application.resumeLinkPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">{t("application.coverLetter")}</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) => handleInputChange("coverLetter", e.target.value)}
              placeholder={t("application.coverLetterPlaceholder")}
              rows={4}
            />
          </div>

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
              {isSubmitting ? t("application.submitting") : 
               buttonDisabled ? t("application.wait") :
               isBlocked ? t("application.blocked") : 
               t("application.submit")}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("application.cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};