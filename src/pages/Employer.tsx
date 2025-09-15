import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import VacancyForm from '@/components/VacancyForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, MapPin, DollarSign, Mail, Phone, User, Edit, Trash2 } from 'lucide-react';

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
  resume_id?: string;
  resume_file_url?: string;
  resume_link?: string;
  vacancy_id: string;
  profiles?: {
    email: string;
    phone: string;
  } | null;
  vacancies: {
    title: string;
    employer_id: string;
  };
}

const Employer = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVacancyForm, setShowVacancyForm] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
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

      // Fetch applications using secure view
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications_for_employers')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      // Fetch vacancy details separately for applications
      const applicationPromises = (applicationsData || []).map(async (app) => {
        const { data: vacancyData } = await supabase
          .from('vacancies')
          .select('title, employer_id')
          .eq('id', app.vacancy_id)
          .single();
        
        return {
          ...app,
          vacancies: vacancyData
        };
      });

      const applicationsWithVacancies = await Promise.all(applicationPromises);

      setVacancies(vacanciesData || []);
      setApplications((applicationsWithVacancies || []).map(app => ({
        ...app,
        applied_by: app.applied_by as 'candidate' | 'guest'
      })));
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

  const handleEditVacancy = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setShowVacancyForm(true);
  };

  const handleDeleteVacancy = async (vacancyId: string) => {
    try {
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', vacancyId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Вакансия удалена",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить вакансию",
        variant: "destructive",
      });
    }
  };

  const handleVacancyFormClose = () => {
    setShowVacancyForm(false);
    setEditingVacancy(null);
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
          <Button onClick={() => setShowVacancyForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Новая вакансия
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
                  <Button onClick={() => setShowVacancyForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первую вакансию
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Список вакансий</CardTitle>
                  <CardDescription>
                    Управляйте своими вакансиями
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead>Просмотры</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vacancies.map((vacancy) => (
                        <TableRow key={vacancy.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vacancy.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {vacancy.location && (
                                  <span className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {vacancy.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(vacancy.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {vacancy.views}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Активна</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditVacancy(vacancy)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Это действие нельзя отменить. Вакансия будет удалена навсегда.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteVacancy(vacancy.id)}
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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
              <Card>
                <CardHeader>
                  <CardTitle>Отклики на вакансии</CardTitle>
                  <CardDescription>
                    Список всех откликов на ваши вакансии
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Вакансия</TableHead>
                        <TableHead>Кандидат</TableHead>
                        <TableHead>Контакты</TableHead>
                        <TableHead>Резюме</TableHead>
                        <TableHead>Дата отклика</TableHead>
                        <TableHead>Тип</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium">
                              {application.vacancies.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>
                                {application.applied_by === 'candidate' 
                                  ? 'Зарегистрированный пользователь'
                                  : application.guest_name
                                }
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3" />
                                <span>
                                  {application.applied_by === 'candidate' 
                                    ? application.profiles?.email
                                    : application.guest_email
                                  }
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3" />
                                <span>
                                  {application.applied_by === 'candidate' 
                                    ? application.profiles?.phone
                                    : application.guest_phone
                                  }
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {application.resume_id && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/resumes/${application.resume_id}`}>
                                    Открыть резюме
                                  </Link>
                                </Button>
                              )}
                              {application.resume_file_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={application.resume_file_url} target="_blank" rel="noopener noreferrer">
                                    Скачать файл
                                  </a>
                                </Button>
                              )}
                              {application.resume_link && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={application.resume_link} target="_blank" rel="noopener noreferrer">
                                    Открыть ссылку
                                  </a>
                                </Button>
                              )}
                              {!application.resume_id && !application.resume_file_url && !application.resume_link && (
                                <span className="text-sm text-muted-foreground">Резюме не приложено</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(application.created_at)}</TableCell>
                          <TableCell>
                            <Badge variant={application.applied_by === 'candidate' ? 'default' : 'secondary'}>
                              {application.applied_by === 'candidate' ? 'Кандидат' : 'Гость'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <VacancyForm
        open={showVacancyForm}
        onOpenChange={handleVacancyFormClose}
        onSubmit={fetchData}
        vacancy={editingVacancy}
      />
    </div>
  );
};

export default Employer;