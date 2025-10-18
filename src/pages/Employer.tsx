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
import JobForm from '@/components/JobForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, MapPin, Mail, Phone, User, Edit, Trash2, Building } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  employment_type: string;
  salary_min: number;
  salary_max: number;
  status: string;
  created_at: string;
  company_id: string;
  companies: {
    name: string;
  };
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
  job_id: string;
  profiles?: {
    email: string;
    phone: string;
  } | null;
  jobs: {
    title: string;
    company_id: string;
  };
}

const Employer = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // First get companies owned by the user
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user?.id);

      if (companiesError) throw companiesError;

      const companyIds = companies?.map(c => c.id) || [];

      if (companyIds.length === 0) {
        setJobs([]);
        setApplications([]);
        setLoading(false);
        return;
      }

      // Fetch jobs for these companies
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name
          )
        `)
        .in('company_id', companyIds)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch applications for these jobs
      const jobIds = jobsData?.map(j => j.id) || [];
      
      if (jobIds.length > 0) {
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            profiles (email, phone),
            jobs!inner (title, company_id)
          `)
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });

        if (applicationsError) throw applicationsError;
        
        setApplications((applicationsData || []).map(app => ({
          ...app,
          applied_by: app.applied_by as 'candidate' | 'guest'
        })));
      }

      setJobs(jobsData || []);
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

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Вакансия удалена",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить вакансию",
        variant: "destructive",
      });
    }
  };

  const handleJobFormClose = () => {
    setShowJobForm(false);
    setEditingJob(null);
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
          <Button onClick={() => setShowJobForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Новая вакансия
          </Button>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">
              Мои вакансии ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="applications">
              Отклики ({applications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {jobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground mb-4">
                    У вас пока нет размещенных вакансий
                  </div>
                  <Button onClick={() => setShowJobForm(true)}>
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
                        <TableHead>Компания</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{job.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {job.location && (
                                  <span className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {job.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {job.companies?.name}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(job.created_at)}</TableCell>
                          <TableCell>
                            <Badge variant={job.status === 'published' ? 'default' : 'secondary'}>
                              {job.status === 'published' ? 'Опубликована' : 'Черновик'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditJob(job)}
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
                                      onClick={() => handleDeleteJob(job.id)}
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
                              {application.jobs.title}
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

      <JobForm
        open={showJobForm}
        onOpenChange={handleJobFormClose}
        onSubmit={fetchData}
        job={editingJob}
      />
    </div>
  );
};

export default Employer;