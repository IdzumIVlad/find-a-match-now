import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/JobCard";
import { JobForm } from "@/components/JobForm";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Plus, Search, Briefcase, Users, TrendingUp } from "lucide-react";

// Mock данные для демонстрации
const mockJobs = [
  {
    id: "1",
    title: "Frontend разработчик",
    company: "ТехноСтарт",
    location: "Москва",
    salary: "от 120 000 ₽",
    type: "Полная занятость",
    description: "Ищем опытного Frontend разработчика для работы над инновационными проектами. Требуется знание React, TypeScript, современных инструментов разработки.",
    postedDate: "2 дня назад",
    email: "hr@technostart.ru"
  },
  {
    id: "2", 
    title: "UX/UI дизайнер",
    company: "Креативные решения",
    location: "Санкт-Петербург",
    salary: "от 80 000 ₽",
    type: "Удаленная работа",
    description: "Требуется творческий UX/UI дизайнер для создания пользовательских интерфейсов мобильных и веб-приложений. Опыт работы с Figma обязателен.",
    postedDate: "1 день назад",
    email: "design@creative.ru"
  },
  {
    id: "3",
    title: "Python разработчик",
    company: "DataTech",
    location: "Новосибирск",
    salary: "от 100 000 ₽",
    type: "Полная занятость",
    description: "Разработка backend сервисов на Python/Django. Опыт работы с базами данных, API, знание Docker приветствуется.",
    postedDate: "3 дня назад",
    email: "hr@datatech.com"
  }
];

const Index = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJob = (newJob: any) => {
    setJobs([newJob, ...jobs]);
  };

  const handleApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setShowApplicationForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                ({filteredJobs.length})
              </span>
            </h2>
          </div>

          {filteredJobs.length === 0 ? (
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
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
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
            © 2024 JobBoard MVP. Простая платформа для поиска работы.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <JobForm
        open={showJobForm}
        onOpenChange={setShowJobForm}
        onSubmit={handleAddJob}
      />

      {selectedJob && (
        <ApplicationForm
          open={showApplicationForm}
          onOpenChange={setShowApplicationForm}
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
        />
      )}
    </div>
  );
};

export default Index;