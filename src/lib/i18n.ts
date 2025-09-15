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
      "footer.privacy": "Privacy Policy"
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
      "footer.privacy": "Política de Privacidad"
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
      "footer.privacy": "Política de Privacidade"
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
      "footer.privacy": "Политика конфиденциальности"
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