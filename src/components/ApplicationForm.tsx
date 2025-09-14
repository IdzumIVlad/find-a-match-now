import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  companyName: string;
  employerEmail: string;
}

export const ApplicationForm = ({ open, onOpenChange, jobTitle, companyName, employerEmail }: ApplicationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-application', {
        body: {
          ...formData,
          jobTitle,
          companyName,
          employerEmail,
        },
      });

      if (error) {
        throw error;
      }

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

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Отправляется..." : "Отправить отклик"}
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