import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, MapPin, DollarSign, Mail, Phone, User } from 'lucide-react';

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
}

interface Application {
  id: string;
  message: string;
  applied_by: 'candidate' | 'guest';
  created_at: string;
  candidate_id?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  vacancy_id: string;
  profiles?: {
    email: string;
    phone: string;
  } | null;
  vacancies: {
    title: string;
  };
}

const Employer = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch vacancies
      const { data: vacanciesData, error: vacanciesError } = await supabase
        .from('vacancies')
        .select('*')
        .eq('employer_id', user?.id)
        .order('created_at', { ascending: false });

      if (vacanciesError) throw vacanciesError;

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_candidate_id_fkey (email, phone),
          vacancies!applications_vacancy_id_fkey (title)
        `)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setVacancies(vacanciesData || []);
      setApplications((applicationsData as Application[]) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Кабинет работодателя</h1>
            <p className="text-muted-foreground">Управляйте вакансиями и просматривайте отклики</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить вакансию
          </Button>
        </div>

        <Tabs defaultValue="vacancies" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vacancies">
              Мои вакансии ({vacancies.length})
            </TabsTrigger>
            <TabsTrigger value="applications">
              Отклики ({applications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vacancies" className="space-y-6">
            {vacancies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground mb-4">
                    У вас пока нет размещенных вакансий
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первую вакансию
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {vacancies.map((vacancy) => (
                  <Card key={vacancy.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{vacancy.title}</CardTitle>
                          <CardDescription className="flex flex-wrap gap-4 mt-2">
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
                              <Eye className="w-4 h-4 mr-1" />
                              {vacancy.views} просмотров
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">{vacancy.employment_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(vacancy.created_at)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">
                        {vacancy.description}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Редактировать
                        </Button>
                        <Button variant="outline" size="sm">
                          Просмотреть
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground">
                    Пока нет откликов на ваши вакансии
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Отклик на "{application.vacancies.title}"
                          </CardTitle>
                          <CardDescription>
                            {formatDate(application.created_at)}
                          </CardDescription>
                        </div>
                        <Badge variant={application.applied_by === 'candidate' ? 'default' : 'secondary'}>
                          {application.applied_by === 'candidate' ? 'Кандидат' : 'Гость'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            {application.applied_by === 'candidate' 
                              ? 'Зарегистрированный пользователь'
                              : application.guest_name
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>
                            {application.applied_by === 'candidate' 
                              ? application.profiles?.email
                              : application.guest_email
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>
                            {application.applied_by === 'candidate' 
                              ? application.profiles?.phone
                              : application.guest_phone
                            }
                          </span>
                        </div>
                      </div>
                      {application.message && (
                        <div>
                          <h4 className="font-medium mb-2">Сопроводительное письмо:</h4>
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {application.message}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Employer;