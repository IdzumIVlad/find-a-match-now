import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { trackViewJob } from '@/lib/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, DollarSign, Building } from 'lucide-react';
import Header from '@/components/Header';
import { ApplicationForm } from '@/components/ApplicationForm';
import SEOHead from '@/components/SEOHead';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Job {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  salary_min: number;
  salary_max: number;
  created_at: string;
  companies: {
    id?: string;
    name: string;
    logo_url?: string;
  };
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationFormOpen, setApplicationFormOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            companies (
              id,
              name,
              logo_url
            )
          `)
          .eq('id', id)
          .eq('status', 'published')
          .maybeSingle();

        if (error) {
          console.error('Error fetching job:', error);
          toast.error('Ошибка при загрузке вакансии');
          navigate('/');
          return;
        }

        if (!data) {
          toast.error('Вакансия не найдена');
          navigate('/');
          return;
        }

        setJob(data as Job);
        
        // Track job view
        trackViewJob({
          job_id: data.id,
          company_id: data.companies?.id,
          location: data.location || '',
          is_remote: data.employment_type?.toLowerCase().includes('remote') || data.employment_type?.toLowerCase().includes('удален'),
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Ошибка при загрузке вакансии');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'По договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ₽`;
    if (min) return `от ${min.toLocaleString()} ₽`;
    if (max) return `до ${max.toLocaleString()} ₽`;
    return 'По договоренности';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Вакансия не найдена
            </h1>
            <Button onClick={() => navigate('/')}>
              Вернуться к списку вакансий
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const truncateDescription = (text: string | null, maxLength: number = 155) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${job.title} en ${job.companies?.name || 'compañía'}`}
        description={truncateDescription(job.description) || `${job.title} en ${job.companies?.name}. ${job.location || 'Argentina'}. ${formatSalary(job.salary_min, job.salary_max)}. Aplica ahora.`}
        type="job_posting"
        keywords={`trabajo, empleo, ${job.title}, ${job.companies?.name}, ${job.location || 'Argentina'}, ${job.employment_type || 'tiempo completo'}`}
        jobTitle={job.title}
        companyName={job.companies?.name}
        location={job.location || undefined}
        salaryMin={job.salary_min}
        salaryMax={job.salary_max}
        isRemote={job.employment_type?.toLowerCase().includes('remot') || job.employment_type?.toLowerCase().includes('удален')}
        datePosted={job.created_at}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              ← Назад к списку вакансий
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {job.title}
                  </CardTitle>
                  
                  <CardDescription className="text-lg flex items-center gap-2 mb-4">
                    <Building className="h-5 w-5" />
                    {job.companies?.name || 'Компания'}
                  </CardDescription>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(job.salary_min, job.salary_max)}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(job.created_at), 'dd.MM.yyyy')}
                    </div>
                  </div>

                  {job.employment_type && (
                    <div className="mt-3">
                      <Badge variant="secondary">
                        {job.employment_type}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="lg:ml-6">
                  <Button 
                    size="lg"
                    onClick={() => setApplicationFormOpen(true)}
                    className="w-full lg:w-auto"
                  >
                    Откликнуться
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {job.description && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Описание вакансии
                  </h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </div>
              )}

              {job.requirements && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      Требования
                    </h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p className="whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />
              
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Готовы подать заявку?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Отправьте свою заявку прямо сейчас и получите ответ от работодателя
                </p>
                <Button 
                  size="lg"
                  onClick={() => setApplicationFormOpen(true)}
                >
                  Откликнуться на вакансию
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <ApplicationForm
        open={applicationFormOpen}
        onOpenChange={setApplicationFormOpen}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.companies?.name || 'Компания'}
        companyId={job.companies?.id}
      />
    </div>
  );
};

export default JobDetail;