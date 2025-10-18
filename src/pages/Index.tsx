import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCard from "@/components/JobCard";
import JobForm from "@/components/JobForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompleteProfileModal from "@/components/CompleteProfileModal";
import { Plus, Search, Briefcase, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from '@/components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const { toast } = useToast();
  const { user, profile, loading: authLoading, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authLoading) {
      if (user && !profile) {
        setShowCompleteProfile(true);
      } else {
        setShowCompleteProfile(false);
      }
    }
  }, [user, profile, authLoading]);

  const fetchJobs = async () => {
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
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: t('common.error'),
        description: "Не удалось загрузить вакансии",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.companies?.name && job.companies.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddJob = () => {
    fetchJobs();
  };

  const handleApply = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('common.today');
    if (diffDays === 2) return t('common.yesterday');
    if (diffDays <= 7) return t('common.daysAgo', { count: diffDays - 1 });
    return date.toLocaleDateString("ru-RU");
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t('vacancy.salaryNegotiable');
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ₽`;
    if (min) return `${t('vacancy.salaryFrom')} ${min.toLocaleString()} ₽`;
    if (max) return `${t('vacancy.salaryTo')} ${max.toLocaleString()} ₽`;
    return t('vacancy.salaryNegotiable');
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEOHead 
          title={t('home.title')}
          description="Найдите работу мечты или идеального сотрудника на laburoGO. Простая платформа для поиска работы и талантов с быстрыми откликами."
          keywords="работа, вакансии, поиск работы, трудоустройство, резюме, кандидаты"
        />
        <Header />
      
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('home.title')}
          </h1>
          <p className="text-xl mb-8 opacity-90">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('home.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-foreground"
              />
            </div>
            <Button 
              onClick={() => setShowJobForm(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('home.postJob')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.simplePosting')}</h3>
              <p className="opacity-90">{t('home.simplePostingDesc')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.fastResponses')}</h3>
              <p className="opacity-90">{t('home.fastResponsesDesc')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.efficient')}</h3>
              <p className="opacity-90">{t('home.efficientDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {t('home.activeJobs')}
              <span className="text-muted-foreground text-lg ml-2">
                ({filteredJobs.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">
                {t('home.loadingJobs')}
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">
                {searchTerm ? t('home.noJobsFound') : t('home.noJobs')}
              </div>
              <Button onClick={() => setShowJobForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {t('home.postFirstJob')}
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  companyName={job.companies?.name || 'Компания'}
                  location={job.location}
                  salary={formatSalary(job.salary_min, job.salary_max)}
                  type={job.employment_type}
                  description={job.description}
                  postedDate={formatDate(job.created_at)}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <JobForm
        open={showJobForm}
        onOpenChange={setShowJobForm}
        onSubmit={handleAddJob}
      />

      <CompleteProfileModal
        open={showCompleteProfile}
        onClose={() => setShowCompleteProfile(false)}
      />
      </div>
    </HelmetProvider>
  );
};

export default Index;