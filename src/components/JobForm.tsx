import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { trackPostJob } from "@/lib/analytics";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  employment_type: string;
  salary_min: number;
  salary_max: number;
  company_id: string;
  status: string;
}

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  job?: Job | null;
}

const JobForm = ({ open, onOpenChange, onSubmit, job }: JobFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    company_id: "",
    location: "",
    salary_min: "",
    salary_max: "",
    employment_type: "",
    description: "",
    requirements: "",
    status: "published",
  });

  useEffect(() => {
    if (open) {
      fetchCompanies();
      if (job) {
        setFormData({
          title: job.title || "",
          company_id: job.company_id || "",
          location: job.location || "",
          salary_min: job.salary_min?.toString() || "",
          salary_max: job.salary_max?.toString() || "",
          employment_type: job.employment_type || "",
          description: job.description || "",
          requirements: job.requirements || "",
          status: job.status || "published",
        });
      } else {
        setFormData({
          title: "",
          company_id: "",
          location: "",
          salary_min: "",
          salary_max: "",
          employment_type: "",
          description: "",
          requirements: "",
          status: "published",
        });
      }
    }
  }, [open, job]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company_id) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        title: formData.title,
        company_id: formData.company_id,
        location: formData.location || null,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        employment_type: formData.employment_type || null,
        description: formData.description || null,
        requirements: formData.requirements || null,
        status: formData.status,
      };

      let error, insertedJob;
      if (job) {
        // Update existing job
        const result = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', job.id);
        error = result.error;
      } else {
        // Create new job
        const result = await supabase
          .from('jobs')
          .insert([jobData])
          .select()
          .single();
        error = result.error;
        insertedJob = result.data;
        
        // Track job posting in GA4
        if (!error && insertedJob) {
          trackPostJob({
            job_id: insertedJob.id,
            paid: false, // Update based on your payment logic
          });
        }
      }

      if (error) {
        throw error;
      }

      onOpenChange(false);
      onSubmit();
      
      toast({
        title: "Успешно!",
        description: job ? "Вакансия обновлена" : "Вакансия успешно размещена",
      });
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить вакансию. Попробуйте еще раз.",
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
            {job ? "Редактировать вакансию" : "Разместить вакансию"}
          </DialogTitle>
          <DialogDescription>
            Заполните информацию о вакансии. Поля отмеченные * обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Select value={formData.company_id} onValueChange={(value) => handleInputChange("company_id", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите компанию" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {companies.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Сначала создайте компанию в настройках профиля
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Местоположение</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder={t('form.locationPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">{t('form.salaryFrom')}</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => handleInputChange("salary_min", e.target.value)}
                placeholder="50000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary_max">{t('form.salaryTo')}</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => handleInputChange("salary_max", e.target.value)}
                placeholder="150000"
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

          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Опубликована</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting || companies.length === 0}>
              {isSubmitting ? "Сохраняется..." : (job ? "Обновить вакансию" : "Разместить вакансию")}
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

export default JobForm;