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
import SEOHead from '@/components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';
import ApplicationModal from '@/components/ApplicationModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useViewTracker } from '@/hooks/useViewTracker';
import { MapPin, DollarSign, Clock, Eye, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Track views for this vacancy
  useViewTracker({
    resourceType: 'vacancy',
    id: id || '',
    enabled: !!id
  });

  useEffect(() => {
    if (id) {
      fetchVacancy();
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
        title: t('common.error'),
        description: t('vacancy.loadingError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t('vacancy.salaryNegotiable');
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ₽`;
    if (min) return `${t('vacancy.salaryFrom')} ${min.toLocaleString()} ₽`;
    if (max) return `${t('vacancy.salaryTo')} ${max.toLocaleString()} ₽`;
    return t('vacancy.salaryNegotiable');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">{t('common.loading')}</div>
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
            <h1 className="text-2xl font-bold mb-4">{t('vacancy.notFound')}</h1>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('vacancy.backToList')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEOHead 
          title={vacancy.title}
          description={`${vacancy.title} в ${vacancy.location || 'разных городах'}. ${vacancy.description?.slice(0, 150)}...`}
          type="article"
          keywords={`вакансия, работа, ${vacancy.title}, ${vacancy.location}, трудоустройство`}
        />
        <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('vacancy.backToVacancies')}
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
                    {vacancy.views} {t('vacancy.views')}
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
                    {t('vacancy.published')} {formatDate(vacancy.created_at)}
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
                  <h3 className="font-semibold mb-2">{t('vacancy.jobDescription')}</h3>
                  <div className="whitespace-pre-wrap text-muted-foreground">
                    {vacancy.description || t('vacancy.noDescription')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('vacancy.employerContacts')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">{t('vacancy.email')}</Label>
                  <p className="text-muted-foreground">{vacancy.profiles?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('vacancy.phone')}</Label>
                  <p className="text-muted-foreground">{vacancy.profiles?.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('vacancy.apply')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => setShowApplicationModal(true)}
                >
                  {t('vacancy.sendApplication')}
                </Button>
                {!user && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {t('vacancy.orLogin')} <Link to="/auth" className="text-primary hover:underline">{t('vacancy.loginText')}</Link> {t('vacancy.forQuickApply')}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        open={showApplicationModal}
        onOpenChange={setShowApplicationModal}
        vacancyId={id || ''}
        vacancyTitle={vacancy?.title || ''}
      />
      </div>
    </HelmetProvider>
  );
};

export default VacancyDetail;