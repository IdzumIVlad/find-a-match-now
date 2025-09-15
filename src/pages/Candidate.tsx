import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import ResumeForm from '@/components/ResumeForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, MapPin, DollarSign, Clock, Edit, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Application {
  id: string;
  message: string;
  created_at: string;
  applied_by: 'candidate' | 'guest';
  resume_id?: string;
  resume_file_url?: string;
  resume_link?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  vacancies: {
    id: string;
    title: string;
    location: string;
    salary_min: number;
    salary_max: number;
    employment_type: string;
  };
}

interface Resume {
  id: string;
  candidate_id: string;
  full_name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: any[];
  education: any[];
  views: number;
  created_at: string;
}

const Candidate = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeFormOpen, setResumeFormOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch applications using secure view
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications_for_candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      // Fetch vacancy details separately for applications
      const applicationPromises = (applicationsData || []).map(async (app) => {
        const { data: vacancyData } = await supabase
          .from('vacancies')
          .select('id, title, location, salary_min, salary_max, employment_type')
          .eq('id', app.vacancy_id)
          .single();
        
        return {
          ...app,
          vacancies: vacancyData
        };
      });

      const applicationsWithVacancies = await Promise.all(applicationPromises);

      // Fetch resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('*')
        .eq('candidate_id', user?.id)
        .order('created_at', { ascending: false });

      if (resumesError) throw resumesError;

      setApplications((applicationsWithVacancies || []).map(app => ({
        ...app,
        applied_by: app.applied_by as 'candidate' | 'guest'
      })));
      setResumes((resumesData || []).map(resume => ({
        ...resume,
        experience: resume.experience as any[],
        education: resume.education as any[]
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

  const handleCreateResume = () => {
    setEditingResume(null);
    setResumeFormOpen(true);
  };

  const handleEditResume = (resume: Resume) => {
    setEditingResume(resume);
    setResumeFormOpen(true);
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Резюме удалено",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить резюме",
        variant: "destructive",
      });
    }
  };

  const handleResumeFormSubmit = () => {
    fetchData();
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
            <h1 className="text-3xl font-bold">Кабинет соискателя</h1>
            <p className="text-muted-foreground">Управляйте резюме и отслеживайте отклики</p>
          </div>
          <Button onClick={handleCreateResume}>
            <Plus className="w-4 h-4 mr-2" />
            Создать резюме
          </Button>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">
              Мои отклики ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="resumes">
              Мои резюме ({resumes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground mb-4">
                    Вы пока не откликались на вакансии
                  </div>
                  <Button variant="outline" asChild>
                    <a href="/">Посмотреть вакансии</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            {application.vacancies.title}
                          </CardTitle>
                          <CardDescription className="flex flex-wrap gap-4 mt-2">
                            {application.vacancies.location && (
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {application.vacancies.location}
                              </span>
                            )}
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatSalary(application.vacancies.salary_min, application.vacancies.salary_max)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Откликнулись {formatDate(application.created_at)}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">
                            {application.vacancies.employment_type}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {application.applied_by === 'candidate' ? 'Авторизованный' : 'Гость'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Resume info */}
                      {(application.resume_id || application.resume_file_url || application.resume_link) && (
                        <div>
                          <h4 className="font-medium mb-2">Резюме:</h4>
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
                        </div>
                      )}
                      
                      {/* Message */}
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

          <TabsContent value="resumes" className="space-y-6">
            {resumes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground mb-4">
                    У вас пока нет созданных резюме
                  </div>
                  <Button onClick={handleCreateResume}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первое резюме
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {resumes.map((resume) => (
                  <Card key={resume.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{resume.full_name}</CardTitle>
                          <CardDescription>
                            Создано {formatDate(resume.created_at)} • {resume.views} просмотров
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-muted-foreground line-clamp-3">
                          {resume.summary}
                        </p>
                      </div>
                      {resume.skills && resume.skills.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Навыки:</h4>
                          <div className="flex flex-wrap gap-2">
                            {resume.skills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline">{skill}</Badge>
                            ))}
                            {resume.skills.length > 5 && (
                              <Badge variant="outline">+{resume.skills.length - 5} ещё</Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditResume(resume)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Редактировать
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/resumes/${resume.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Просмотреть
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Удалить
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить резюме?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие нельзя отменить. Резюме будет удалено навсегда.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteResume(resume.id)}>
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ResumeForm
        open={resumeFormOpen}
        onOpenChange={setResumeFormOpen}
        onSubmit={handleResumeFormSubmit}
        resume={editingResume}
      />
    </div>
  );
};

export default Candidate;