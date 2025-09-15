import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VacancyCard from "@/components/VacancyCard";
import { JobForm } from "@/components/JobForm";
import Header from "@/components/Header";
import CompleteProfileModal from "@/components/CompleteProfileModal";
import { Plus, Search, Briefcase, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from '@/components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user needs to complete profile
  useEffect(() => {
    if (!authLoading && user && !profile) {
      setShowCompleteProfile(true);
    }
    // Remove automatic redirect to dashboard - let guests view vacancies
  }, [user, profile, authLoading]);

  // Загрузка вакансий из Supabase (безопасно, без скрытых данных)
  const fetchVacancies = async () => {
    try {
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVacancies(data || []);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить вакансии",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const filteredVacancies = vacancies.filter(vacancy =>
    vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vacancy.location && vacancy.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddJob = () => {
    fetchVacancies(); // Перезагружаем вакансии после добавления
  };

  const handleApply = (vacancyId: string) => {
    navigate(`/vacancies/${vacancyId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "сегодня";
    if (diffDays === 2) return "вчера";
    if (diffDays <= 7) return `${diffDays - 1} дня назад`;
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Поиск работы и вакансий"
          description="Найдите работу мечты или идеального сотрудника на laburoGO. Простая платформа для поиска работы и талантов с быстрыми откликами."
          keywords="работа, вакансии, поиск работы, трудоустройство, резюме, кандидаты"
        />
        <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Найдите работу мечты или идеального сотрудника
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Простая платформа для поиска работы и талантов
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск вакансий..."
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
              Разместить вакансию
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Простое размещение</h3>
              <p className="opacity-90">Разместите вакансию за несколько минут</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрые отклики</h3>
              <p className="opacity-90">Получайте отклики прямо на почту</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Эффективно</h3>
              <p className="opacity-90">Никаких лишних сложностей</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Актуальные вакансии
              <span className="text-muted-foreground text-lg ml-2">
                ({filteredVacancies.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">
                Загрузка вакансий...
              </div>
            </div>
          ) : filteredVacancies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">
                {searchTerm ? "Вакансии не найдены" : "Пока нет размещенных вакансий"}
              </div>
              <Button onClick={() => setShowJobForm(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Разместить первую вакансию
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filteredVacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  id={vacancy.id}
                  title={vacancy.title}
                  location={vacancy.location}
                  salary_min={vacancy.salary_min}
                  salary_max={vacancy.salary_max}
                  employment_type={vacancy.employment_type}
                  description={vacancy.description}
                  views={vacancy.views}
                  postedDate={formatDate(vacancy.created_at)}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 laburoGO. Простая платформа для поиска работы.
          </p>
        </div>
      </footer>

      {/* Modals */}
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