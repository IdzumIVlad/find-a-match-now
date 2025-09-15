import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, DollarSign, Clock, Eye, ArrowLeft } from 'lucide-react';

interface Vacancy {
  id: string;
  title: string;
  description: string;
  location: string;
  employment_type: string;
  salary_min: number;
  salary_max: number;
  views: number;
  created_at: string;
  employer_id: string;
  profiles: {
    email: string;
    phone: string;
  };
}

const VacancyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    guest_name: '',
    guest_email: '',
    guest_phone: ''
  });
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchVacancy();
      incrementViews();
    }
  }, [id]);

  const fetchVacancy = async () => {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          *,
          profiles!vacancies_employer_id_fkey (email, phone)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setVacancy(data);
    } catch (error) {
      console.error('Error fetching vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить вакансию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase
        .from('vacancies')
        .update({ views: vacancy?.views || 0 + 1 })
        .eq('id', id);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setApplicationLoading(true);
    
    try {
      const applicationData = user && profile?.role === 'candidate' 
        ? {
            vacancy_id: id,
            candidate_id: user.id,
            message: formData.message || null,
            applied_by: 'candidate' as const
          }
        : {
            vacancy_id: id,
            candidate_id: null,
            message: formData.message || null,
            guest_name: formData.guest_name,
            guest_email: formData.guest_email,  
            guest_phone: formData.guest_phone,
            applied_by: 'guest' as const
          };

      const { error } = await supabase
        .from('applications')
        .insert(applicationData);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Внимание",
            description: "Вы уже откликались на эту вакансию",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Успешно",
          description: "Отклик отправлен",
        });
        setShowApplicationForm(false);
        setFormData({ message: '', guest_name: '', guest_email: '', guest_phone: '' });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отклик",
        variant: "destructive",
      });
    } finally {
      setApplicationLoading(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'По договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ₽`;
    if (min) return `от ${min.toLocaleString()} ₽`;
    if (max) return `до ${max.toLocaleString()} ₽`;
    return 'По договоренности';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Вакансия не найдена</h1>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к списку
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к вакансиям
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{vacancy.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <Eye className="w-4 h-4 mr-1" />
                    {vacancy.views}
                  </div>
                </div>
                <CardDescription className="flex flex-wrap gap-4 text-base">
                  {vacancy.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {vacancy.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatSalary(vacancy.salary_min, vacancy.salary_max)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(vacancy.created_at)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vacancy.employment_type && (
                  <div>
                    <Badge variant="secondary">{vacancy.employment_type}</Badge>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-2">Описание вакансии</h3>
                  <div className="whitespace-pre-wrap text-muted-foreground">
                    {vacancy.description || 'Описание не указано'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Контакты работодателя</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Email:</Label>
                  <p className="text-muted-foreground">{vacancy.profiles?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Телефон:</Label>
                  <p className="text-muted-foreground">{vacancy.profiles?.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Откликнуться</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => setShowApplicationForm(true)}
                >
                  Отправить отклик
                </Button>
                {!user && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Или <Link to="/auth" className="text-primary hover:underline">войдите</Link> для быстрого отклика
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Откликнуться на вакансию</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApply} className="space-y-4">
            {(!user || profile?.role !== 'candidate') && (
              <>
                <div>
                  <Label htmlFor="guest_name">Имя *</Label>
                  <Input
                    id="guest_name"
                    value={formData.guest_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guest_email">Email *</Label>
                  <Input
                    id="guest_email"
                    type="email"
                    value={formData.guest_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guest_phone">Телефон *</Label>
                  <Input
                    id="guest_phone"
                    type="tel"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, guest_phone: e.target.value }))}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="message">Сопроводительное письмо</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Расскажите о себе и почему вас интересует эта позиция"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={applicationLoading} className="flex-1">
                {applicationLoading ? 'Отправляем...' : 'Отправить отклик'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowApplicationForm(false)}>
                Отмена
              </Button>
            </div>
            {!user && (
              <p className="text-sm text-muted-foreground text-center">
                После отправки отклика рекомендуем <Link to="/auth" className="text-primary hover:underline">создать аккаунт</Link>
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VacancyDetail;