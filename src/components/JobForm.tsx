import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export const JobForm = ({ open, onOpenChange, onSubmit }: JobFormProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    salary: "",
    employment_type: "",
    description: "",
    requirements: "",
    employer_email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company_name || !formData.employer_email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('jobs')
        .insert([formData]);

      if (error) {
        throw error;
      }

      setFormData({
        title: "",
        company_name: "",
        location: "",
        salary: "",
        employment_type: "",
        description: "",
        requirements: "",
        employer_email: "",
      });
      onOpenChange(false);
      onSubmit(); // Уведомляем родительский компонент о создании вакансии
      
      toast({
        title: "Успешно!",
        description: "Вакансия успешно размещена",
      });
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось разместить вакансию. Попробуйте еще раз.",
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Разместить вакансию
          </DialogTitle>
          <DialogDescription>
            Заполните информацию о вакансии. Поля отмеченные * обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Должность *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Frontend разработчик"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Компания *</Label>
              <Input
                id="company"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                placeholder="ООО Технологии"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Местоположение</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder={t('form.locationPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Зарплата</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder={t('form.salaryPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Тип занятости</Label>
            <Select value={formData.employment_type} onValueChange={(value) => handleInputChange("employment_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип занятости" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Полная занятость">{t('employment.fullTime')}</SelectItem>
                <SelectItem value="Частичная занятость">{t('employment.partTime')}</SelectItem>
                <SelectItem value="Стажировка">{t('employment.internship')}</SelectItem>
                <SelectItem value="Проектная работа">{t('employment.project')}</SelectItem>
                <SelectItem value="Удаленная работа">{t('employment.remote')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email для откликов *</Label>
            <Input
              id="email"
              type="email"
              value={formData.employer_email}
              onChange={(e) => handleInputChange("employer_email", e.target.value)}
              placeholder="hr@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание вакансии</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Опишите требования, обязанности и условия работы..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Требования</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="Перечислите основные требования к кандидату..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Размещается..." : "Разместить вакансию"}
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