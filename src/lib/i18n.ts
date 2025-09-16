import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
const resources = {
  en: {
    translation: {
      // Navigation
      "common.home": "Home",
      "common.resumes": "Resume Database",
      "common.login": "Sign In",
      "common.logout": "Sign Out",
      "common.dashboard": "Dashboard",
      "common.profile": "Profile",
      
      // Roles
      "common.employer": "Employer",
      "common.candidate": "Job Seeker",
      "common.myVacancies": "My Vacancies",
      "common.myResumes": "My Resumes",
      
      // Actions
      "common.search": "Search",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.apply": "Apply",
      "common.close": "Close",
      "common.edit": "Edit",
      "common.delete": "Delete",
      
      // Status
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      
      // Time
      "common.today": "today",
      "common.yesterday": "yesterday",
      "common.daysAgo": "{{count}} days ago",

      // Home page
      "home.title": "Find your dream job or perfect employee",
      "home.subtitle": "Simple platform for job search and talent",
      "home.searchPlaceholder": "Search jobs...",
      "home.postJob": "Post Job",
      "home.simplePosting": "Simple Posting",
      "home.simplePostingDesc": "Post a job in minutes",
      "home.fastResponses": "Fast Responses",
      "home.fastResponsesDesc": "Get responses directly to your email",
      "home.efficient": "Efficient",
      "home.efficientDesc": "No unnecessary complications",
      "home.activeJobs": "Active Jobs",
      "home.noJobs": "No jobs posted yet",
      "home.noJobsFound": "No jobs found",
      "home.postFirstJob": "Post first job",
      "home.loadingJobs": "Loading jobs...",

      // Auth
      "auth.signIn": "Sign In",
      "auth.signUp": "Sign Up",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.forgotPassword": "Forgot Password?",
      "auth.dontHaveAccount": "Don't have an account?",
      "auth.haveAccount": "Already have an account?",
      "auth.signInWithEmail": "Sign in with email",
      "auth.signUpWithEmail": "Sign up with email",

      // Footer
      "footer.copyright": "© 2024 LaburoGO. Simple platform for job search.",
      "footer.terms": "Terms of Use",
      "footer.privacy": "Privacy Policy",

      // Vacancy
      "vacancy.salaryNegotiable": "Negotiable",
      "vacancy.salaryFrom": "from",
      "vacancy.salaryTo": "up to",
      
      // Employment types
      "employment.fullTime": "Full-time",
      "employment.partTime": "Part-time", 
      "employment.internship": "Internship",
      "employment.project": "Project work",
      "employment.remote": "Remote work",
      "employment.freelance": "Freelance",
      
      // Form placeholders
      "form.locationPlaceholder": "Moscow, remote...",
      "form.salaryPlaceholder": "from 100,000",
      "form.salaryFrom": "Salary from",
      "form.salaryTo": "Salary to",
      "form.phone": "Phone",
      "vacancy.noDescription": "No description provided",
      "vacancy.apply": "Apply",
      "vacancy.views": "views",
      "vacancy.published": "Published",
      "vacancy.jobDescription": "Job Description",
      "vacancy.employerContacts": "Employer Contacts",
      "vacancy.email": "Email:",
      "vacancy.phone": "Phone:",
      "vacancy.sendApplication": "Send Application",
      "vacancy.orLogin": "Or",
      "vacancy.loginText": "sign in",
      "vacancy.forQuickApply": "for quick application",
      "vacancy.notFound": "Vacancy not found",
      "vacancy.backToList": "Back to list",
      "vacancy.backToVacancies": "Back to vacancies",
      "vacancy.loadingError": "Failed to load vacancy"
    }
  },
  es: {
    translation: {
      // Navigation
      "common.home": "Inicio",
      "common.resumes": "Base de Currículums",
      "common.login": "Iniciar Sesión",
      "common.logout": "Cerrar Sesión",
      "common.dashboard": "Panel",
      "common.profile": "Perfil",
      
      // Roles
      "common.employer": "Empleador",
      "common.candidate": "Candidato",
      "common.myVacancies": "Mis Vacantes",
      "common.myResumes": "Mis Currículums",
      
      // Actions
      "common.search": "Buscar",
      "common.save": "Guardar",
      "common.cancel": "Cancelar",
      "common.apply": "Aplicar",
      "common.close": "Cerrar",
      "common.edit": "Editar",
      "common.delete": "Eliminar",
      
      // Status
      "common.loading": "Cargando...",
      "common.error": "Error",
      "common.success": "Éxito",
      
      // Time
      "common.today": "hoy",
      "common.yesterday": "ayer",
      "common.daysAgo": "hace {{count}} días",

      // Home page
      "home.title": "Encuentra el trabajo de tus sueños o el empleado perfecto",
      "home.subtitle": "Plataforma simple para búsqueda de trabajo y talento",
      "home.searchPlaceholder": "Buscar trabajos...",
      "home.postJob": "Publicar Trabajo",
      "home.simplePosting": "Publicación Simple",
      "home.simplePostingDesc": "Publica un trabajo en minutos",
      "home.fastResponses": "Respuestas Rápidas",
      "home.fastResponsesDesc": "Recibe respuestas directo en tu email",
      "home.efficient": "Eficiente",
      "home.efficientDesc": "Sin complicaciones innecesarias",
      "home.activeJobs": "Trabajos Activos",
      "home.noJobs": "Aún no hay trabajos publicados",
      "home.noJobsFound": "No se encontraron trabajos",
      "home.postFirstJob": "Publicar primer trabajo",
      "home.loadingJobs": "Cargando trabajos...",

      // Auth
      "auth.signIn": "Iniciar Sesión",
      "auth.signUp": "Registrarse",
      "auth.email": "Email",
      "auth.password": "Contraseña",
      "auth.confirmPassword": "Confirmar Contraseña",
      "auth.forgotPassword": "¿Olvidaste tu contraseña?",
      "auth.dontHaveAccount": "¿No tienes una cuenta?",
      "auth.haveAccount": "¿Ya tienes una cuenta?",
      "auth.signInWithEmail": "Iniciar sesión con email",
      "auth.signUpWithEmail": "Registrarse con email",

      // Footer
      "footer.copyright": "© 2024 LaburoGO. Plataforma simple para búsqueda de trabajo.",
      "footer.terms": "Términos de Uso",
      "footer.privacy": "Política de Privacidad",

      // Vacancy
      "vacancy.salaryNegotiable": "Negociable",
      "vacancy.salaryFrom": "desde",
      "vacancy.salaryTo": "hasta",
      
      // Employment types
      "employment.fullTime": "Tiempo completo",
      "employment.partTime": "Tiempo parcial",
      "employment.internship": "Prácticas",
      "employment.project": "Trabajo por proyecto",
      "employment.remote": "Trabajo remoto",
      "employment.freelance": "Freelance",
      
      // Form placeholders
      "form.locationPlaceholder": "Madrid, remoto...",
      "form.salaryPlaceholder": "desde 30,000",
      "form.salaryFrom": "Salario desde",
      "form.salaryTo": "Salario hasta",
      "form.phone": "Teléfono",
      "vacancy.noDescription": "Sin descripción",
      "vacancy.apply": "Aplicar",
      "vacancy.views": "visualizaciones",
      "vacancy.published": "Publicado",
      "vacancy.jobDescription": "Descripción del Trabajo",
      "vacancy.employerContacts": "Contactos del Empleador",
      "vacancy.email": "Email:",
      "vacancy.phone": "Teléfono:",
      "vacancy.sendApplication": "Enviar Aplicación",
      "vacancy.orLogin": "O",
      "vacancy.loginText": "iniciar sesión",
      "vacancy.forQuickApply": "para aplicación rápida",
      "vacancy.notFound": "Vacante no encontrada",
      "vacancy.backToList": "Volver a la lista",
      "vacancy.backToVacancies": "Volver a vacantes",
      "vacancy.loadingError": "Error al cargar vacante"
    }
  },
  pt: {
    translation: {
      // Navigation
      "common.home": "Início",
      "common.resumes": "Base de Currículos",
      "common.login": "Entrar",
      "common.logout": "Sair",
      "common.dashboard": "Painel",
      "common.profile": "Perfil",
      
      // Roles
      "common.employer": "Empregador",
      "common.candidate": "Candidato",
      "common.myVacancies": "Minhas Vagas",
      "common.myResumes": "Meus Currículos",
      
      // Actions
      "common.search": "Buscar",
      "common.save": "Salvar",
      "common.cancel": "Cancelar",
      "common.apply": "Candidatar",
      "common.close": "Fechar",
      "common.edit": "Editar",
      "common.delete": "Excluir",
      
      // Status
      "common.loading": "Carregando...",
      "common.error": "Erro",
      "common.success": "Sucesso",
      
      // Time
      "common.today": "hoje",
      "common.yesterday": "ontem",
      "common.daysAgo": "há {{count}} dias",

      // Home page
      "home.title": "Encontre o emprego dos seus sonhos ou o funcionário perfeito",
      "home.subtitle": "Plataforma simples para busca de emprego e talentos",
      "home.searchPlaceholder": "Buscar empregos...",
      "home.postJob": "Publicar Vaga",
      "home.simplePosting": "Publicação Simples",
      "home.simplePostingDesc": "Publique uma vaga em minutos",
      "home.fastResponses": "Respostas Rápidas",
      "home.fastResponsesDesc": "Receba respostas direto no seu email",
      "home.efficient": "Eficiente",
      "home.efficientDesc": "Sem complicações desnecessárias",
      "home.activeJobs": "Vagas Ativas",
      "home.noJobs": "Ainda não há vagas publicadas",
      "home.noJobsFound": "Nenhuma vaga encontrada",
      "home.postFirstJob": "Publicar primeira vaga",
      "home.loadingJobs": "Carregando vagas...",

      // Auth
      "auth.signIn": "Entrar",
      "auth.signUp": "Registrar",
      "auth.email": "Email",
      "auth.password": "Senha",
      "auth.confirmPassword": "Confirmar Senha",
      "auth.forgotPassword": "Esqueceu a senha?",
      "auth.dontHaveAccount": "Não tem uma conta?",
      "auth.haveAccount": "Já tem uma conta?",
      "auth.signInWithEmail": "Entrar com email",
      "auth.signUpWithEmail": "Registrar com email",

      // Footer
      "footer.copyright": "© 2024 LaburoGO. Plataforma simples para busca de emprego.",
      "footer.terms": "Termos de Uso",
      "footer.privacy": "Política de Privacidade",

      // Vacancy
      "vacancy.salaryNegotiable": "Negociável",
      "vacancy.salaryFrom": "a partir de",
      "vacancy.salaryTo": "até",
      
      // Employment types
      "employment.fullTime": "Tempo integral",
      "employment.partTime": "Tempo parcial",
      "employment.internship": "Estágio",
      "employment.project": "Trabalho de projeto",
      "employment.remote": "Trabalho remoto",
      "employment.freelance": "Freelancer",
      
      // Form placeholders
      "form.locationPlaceholder": "São Paulo, remoto...",
      "form.salaryPlaceholder": "a partir de R$ 5.000",
      "form.salaryFrom": "Salário de",
      "form.salaryTo": "Salário até",
      "form.phone": "Telefone",
      "vacancy.noDescription": "Sem descrição",
      "vacancy.apply": "Candidatar",
      "vacancy.views": "visualizações",
      "vacancy.published": "Publicado",
      "vacancy.jobDescription": "Descrição da Vaga",
      "vacancy.employerContacts": "Contatos do Empregador",
      "vacancy.email": "Email:",
      "vacancy.phone": "Telefone:",
      "vacancy.sendApplication": "Enviar Candidatura",
      "vacancy.orLogin": "Ou",
      "vacancy.loginText": "entrar",
      "vacancy.forQuickApply": "para candidatura rápida",
      "vacancy.notFound": "Vaga não encontrada",
      "vacancy.backToList": "Voltar à lista",
      "vacancy.backToVacancies": "Voltar às vagas",
      "vacancy.loadingError": "Erro ao carregar vaga"
    }
  },
  ru: {
    translation: {
      // Navigation
      "common.home": "Главная",
      "common.resumes": "База резюме",
      "common.login": "Войти",
      "common.logout": "Выйти",
      "common.dashboard": "Личный кабинет",
      "common.profile": "Профиль",
      
      // Roles
      "common.employer": "Работодатель",
      "common.candidate": "Соискатель",
      "common.myVacancies": "Мои вакансии",
      "common.myResumes": "Мои резюме",
      
      // Actions
      "common.search": "Поиск",
      "common.save": "Сохранить",
      "common.cancel": "Отмена",
      "common.apply": "Откликнуться",
      "common.close": "Закрыть",
      "common.edit": "Редактировать",
      "common.delete": "Удалить",
      
      // Status
      "common.loading": "Загрузка...",
      "common.error": "Ошибка",
      "common.success": "Успешно",
      
      // Time
      "common.today": "сегодня",
      "common.yesterday": "вчера",
      "common.daysAgo": "{{count}} дня назад",

      // Home page
      "home.title": "Найдите работу мечты или идеального сотрудника",
      "home.subtitle": "Простая платформа для поиска работы и талантов",
      "home.searchPlaceholder": "Поиск вакансий...",
      "home.postJob": "Разместить вакансию",
      "home.simplePosting": "Простое размещение",
      "home.simplePostingDesc": "Разместите вакансию за несколько минут",
      "home.fastResponses": "Быстрые отклики",
      "home.fastResponsesDesc": "Получайте отклики прямо на почту",
      "home.efficient": "Эффективно",
      "home.efficientDesc": "Никаких лишних сложностей",
      "home.activeJobs": "Актуальные вакансии",
      "home.noJobs": "Пока нет размещенных вакансий",
      "home.noJobsFound": "Вакансии не найдены",
      "home.postFirstJob": "Разместить первую вакансию",
      "home.loadingJobs": "Загрузка вакансий...",

      // Auth
      "auth.signIn": "Войти",
      "auth.signUp": "Регистрация",
      "auth.email": "Email",
      "auth.password": "Пароль",
      "auth.confirmPassword": "Подтвердите пароль",
      "auth.forgotPassword": "Забыли пароль?",
      "auth.dontHaveAccount": "Нет аккаунта?",
      "auth.haveAccount": "Уже есть аккаунт?",
      "auth.signInWithEmail": "Войти через email",
      "auth.signUpWithEmail": "Зарегистрироваться через email",

      // Footer
      "footer.copyright": "© 2024 LaburoGO. Простая платформа для поиска работы.",
      "footer.terms": "Условия использования",
      "footer.privacy": "Политика конфиденциальности",

      // Vacancy
      "vacancy.salaryNegotiable": "По договоренности",
      "vacancy.salaryFrom": "от",
      "vacancy.salaryTo": "до",
      
      // Employment types
      "employment.fullTime": "Полная занятость",
      "employment.partTime": "Частичная занятость",
      "employment.internship": "Стажировка",
      "employment.project": "Проектная работа", 
      "employment.remote": "Удаленная работа",
      "employment.freelance": "Фриланс",
      
      // Form placeholders
      "form.locationPlaceholder": "Москва, удаленно...",
      "form.salaryPlaceholder": "от 100 000",
      "form.salaryFrom": "Зарплата от",
      "form.salaryTo": "Зарплата до",
      "form.phone": "Телефон",
      "vacancy.noDescription": "Описание не указано",
      "vacancy.apply": "Откликнуться",
      "vacancy.views": "просмотров",
      "vacancy.published": "Опубликовано",
      "vacancy.jobDescription": "Описание вакансии",
      "vacancy.employerContacts": "Контакты работодателя",
      "vacancy.email": "Email:",
      "vacancy.phone": "Телефон:",
      "vacancy.sendApplication": "Отправить отклик",
      "vacancy.orLogin": "Или",
      "vacancy.loginText": "войдите",
      "vacancy.forQuickApply": "для быстрого отклика",
      "vacancy.notFound": "Вакансия не найдена",
      "vacancy.backToList": "Вернуться к списку",
      "vacancy.backToVacancies": "Назад к вакансиям",
      "vacancy.loadingError": "Не удалось загрузить вакансию"
    }
  }
};

// Get saved language from localStorage or use default
const savedLanguage = localStorage.getItem('i18nextLng') || 'ru';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false, // Disable suspense to avoid loading issues
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    }
  });

// Save language to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;