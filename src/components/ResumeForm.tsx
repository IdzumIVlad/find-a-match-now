import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Trash2 } from 'lucide-react';
import { DatePickerDemo } from '@/components/DatePicker';

interface ResumeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  resume?: any;
}

interface ExperienceItem {
  company: string;
  position: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  responsibilities: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  startYear: number | undefined;
  endYear: number | undefined;
}

const ResumeForm = ({ open, onOpenChange, onSubmit, resume }: ResumeFormProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    summary: '',
    skills: [] as string[],
    experience: [] as ExperienceItem[],
    education: [] as EducationItem[]
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (resume) {
      setFormData({
        full_name: resume.full_name || '',
        email: resume.email || '',
        phone: resume.phone || '',
        summary: resume.summary || '',
        skills: resume.skills || [],
        experience: resume.experience || [],
        education: resume.education || []
      });
    } else {
      // Prefill with user data
      setFormData(prev => ({
        ...prev,
        email: user?.email || '',
        phone: profile?.phone || ''
      }));
    }
  }, [resume, user, profile, open]);

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: user?.email || '',
      phone: profile?.phone || '',
      summary: '',
      skills: [],
      experience: [],
      education: []
    });
    setNewSkill('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Необходимо авторизоваться",
        variant: "destructive",
      });
      return;
    }

    if (!formData.full_name.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const resumeData = {
        candidate_id: user.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        summary: formData.summary.trim(),
        skills: formData.skills,
        experience: formData.experience as any,
        education: formData.education as any
      };

      if (resume) {
        const { error } = await supabase
          .from('resumes')
          .update(resumeData)
          .eq('id', resume.id);
        
        if (error) throw error;
        
        toast({
          title: "Успешно",
          description: "Резюме обновлено",
        });
      } else {
        const { error } = await supabase
          .from('resumes')
          .insert([resumeData]);
        
        if (error) throw error;
        
        toast({
          title: "Успешно",
          description: "Резюме создано",
        });
      }

      onSubmit();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить резюме",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: undefined,
        endDate: undefined,
        responsibilities: ''
      }]
    }));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        startYear: undefined,
        endYear: undefined
      }]
    }));
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resume ? 'Редактировать резюме' : 'Создать резюме'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Полное имя *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Иван Иванов"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="ivan@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <Label htmlFor="summary">О себе</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Кратко расскажите о себе и своих профессиональных качествах"
              rows={4}
            />
          </div>

          {/* Skills */}
          <div>
            <Label>Навыки</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Добавить навык"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Опыт работы</Label>
              <Button type="button" onClick={addExperience} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
            <div className="space-y-4">
              {formData.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Место работы {index + 1}</CardTitle>
                      <Button
                        type="button"
                        onClick={() => removeExperience(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Компания</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="Название компании"
                        />
                      </div>
                      <div>
                        <Label>Должность</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(index, 'position', e.target.value)}
                          placeholder="Ваша должность"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Дата начала</Label>
                        <DatePickerDemo
                          date={exp.startDate}
                          onDateChange={(date) => updateExperience(index, 'startDate', date)}
                        />
                      </div>
                      <div>
                        <Label>Дата окончания</Label>
                        <DatePickerDemo
                          date={exp.endDate}
                          onDateChange={(date) => updateExperience(index, 'endDate', date)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Обязанности</Label>
                      <Textarea
                        value={exp.responsibilities}
                        onChange={(e) => updateExperience(index, 'responsibilities', e.target.value)}
                        placeholder="Опишите ваши обязанности и достижения"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Образование</Label>
              <Button type="button" onClick={addEducation} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Образование {index + 1}</CardTitle>
                      <Button
                        type="button"
                        onClick={() => removeEducation(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Учебное заведение</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          placeholder="Название ВУЗа"
                        />
                      </div>
                      <div>
                        <Label>Степень/Специальность</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="Бакалавр, Магистр, Специалист"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Год поступления</Label>
                        <Input
                          type="number"
                          value={edu.startYear || ''}
                          onChange={(e) => updateEducation(index, 'startYear', parseInt(e.target.value) || undefined)}
                          placeholder="2018"
                          min="1950"
                          max={new Date().getFullYear()}
                        />
                      </div>
                      <div>
                        <Label>Год окончания</Label>
                        <Input
                          type="number"
                          value={edu.endYear || ''}
                          onChange={(e) => updateEducation(index, 'endYear', parseInt(e.target.value) || undefined)}
                          placeholder="2022"
                          min="1950"
                          max={new Date().getFullYear() + 10}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : resume ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeForm;