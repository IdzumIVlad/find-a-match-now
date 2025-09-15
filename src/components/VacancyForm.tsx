import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VacancyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  vacancy?: {
    id: string;
    title: string;
    description: string;
    location: string;
    employment_type: string;
    salary_min: number;
    salary_max: number;
  } | null;
}

const VacancyForm = ({ open, onOpenChange, onSubmit, vacancy }: VacancyFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: '',
    salary_min: '',
    salary_max: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (vacancy) {
      setFormData({
        title: vacancy.title,
        description: vacancy.description || '',
        location: vacancy.location || '',
        employment_type: vacancy.employment_type || '',
        salary_min: vacancy.salary_min?.toString() || '',
        salary_max: vacancy.salary_max?.toString() || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        employment_type: '',
        salary_min: '',
        salary_max: ''
      });
    }
  }, [vacancy, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Ошибка валидации",
        description: "Название вакансии обязательно для заполнения",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Ошибка валидации", 
        description: "Описание вакансии обязательно для заполнения",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const vacancyData = {
        title: formData.title,
        description: formData.description || null,
        location: formData.location || null,
        employment_type: formData.employment_type || null,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        employer_id: user.id
      };

      let error;
      if (vacancy) {
        // Update existing vacancy
        const result = await supabase
          .from('vacancies')
          .update(vacancyData)
          .eq('id', vacancy.id);
        error = result.error;
      } else {
        // Create new vacancy
        const result = await supabase
          .from('vacancies')
          .insert(vacancyData);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Успешно",
        description: vacancy ? "Вакансия обновлена" : "Вакансия создана",
      });
      
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить вакансию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vacancy ? 'Редактировать вакансию' : 'Создать новую вакансию'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название вакансии *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Например: Frontend Developer"
            />
          </div>

          <div>
            <Label htmlFor="description">Описание вакансии *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Подробное описание вакансии, требования к кандидату..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Местоположение</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Москва, удаленно..."
              />
            </div>

            <div>
              <Label htmlFor="employment_type">Тип занятости</Label>
              <Select 
                value={formData.employment_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Полная занятость">Полная занятость</SelectItem>
                  <SelectItem value="Частичная занятость">Частичная занятость</SelectItem>
                  <SelectItem value="Удаленная работа">Удаленная работа</SelectItem>
                  <SelectItem value="Фриланс">Фриланс</SelectItem>
                  <SelectItem value="Стажировка">Стажировка</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary_min">Зарплата от (₽)</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                placeholder="50000"
              />
            </div>

            <div>
              <Label htmlFor="salary_max">Зарплата до (₽)</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                placeholder="150000"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Сохраняем...' : (vacancy ? 'Обновить' : 'Создать')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VacancyForm;