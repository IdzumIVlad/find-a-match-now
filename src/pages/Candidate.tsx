import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, MapPin, DollarSign, Clock } from 'lucide-react';

interface Application {
  id: string;
  message: string;
  created_at: string;
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
  full_name: string;
  summary: string;
  skills: string[];
  created_at: string;
  views: number;
}

const Candidate = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          vacancies!applications_vacancy_id_fkey (
            id, title, location, salary_min, salary_max, employment_type
          )
        `)
        .eq('candidate_id', user?.id)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      // Fetch resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('*')
        .eq('candidate_id', user?.id)
        .order('created_at', { ascending: false });

      if (resumesError) throw resumesError;

      setApplications(applicationsData || []);
      setResumes(resumesData || []);
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
            <h1 className="text-3xl font-bold">Кабинет соискателя</h1>
            <p className="text-muted-foreground">Управляйте резюме и отслеживайте отклики</p>
          </div>
          <Button>
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
                        <Badge variant="secondary">
                          {application.vacancies.employment_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    {application.message && (
                      <CardContent>
                        <div>
                          <h4 className="font-medium mb-2">Ваше сопроводительное письмо:</h4>
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {application.message}
                          </p>
                        </div>
                      </CardContent>
                    )}
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
                  <Button>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Candidate;