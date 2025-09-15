import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
const resources = {
  en: {
    common: {
      // Navigation
      home: "Home",
      resumes: "Resume Database",
      login: "Sign In",
      logout: "Sign Out",
      dashboard: "Dashboard",
      profile: "Profile",
      
      // Roles
      employer: "Employer",
      candidate: "Job Seeker",
      myVacancies: "My Vacancies",
      myResumes: "My Resumes",
      
      // Actions
      search: "Search",
      save: "Save",
      cancel: "Cancel",
      apply: "Apply",
      close: "Close",
      edit: "Edit",
      delete: "Delete",
      
      // Status
      loading: "Loading...",
      error: "Error",
      success: "Success",
      
      // Time
      today: "today",
      yesterday: "yesterday",
      daysAgo: "{{count}} days ago",
    },
    home: {
      title: "Find your dream job or perfect employee",
      subtitle: "Simple platform for job search and talent",
      searchPlaceholder: "Search jobs...",
      postJob: "Post Job",
      simplePosting: "Simple Posting",
      simplePostingDesc: "Post a job in minutes",
      fastResponses: "Fast Responses",
      fastResponsesDesc: "Get responses directly to your email",
      efficient: "Efficient",
      efficientDesc: "No unnecessary complications",
      activeJobs: "Active Jobs",
      noJobs: "No jobs posted yet",
      noJobsFound: "No jobs found",
      postFirstJob: "Post first job",
      loadingJobs: "Loading jobs..."
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      dontHaveAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      signInWithEmail: "Sign in with email",
      signUpWithEmail: "Sign up with email"
    },
    footer: {
      copyright: "© 2024 LaburoGO. Simple platform for job search.",
      terms: "Terms of Use",
      privacy: "Privacy Policy"
    }
  },
  es: {
    common: {
      // Navigation
      home: "Inicio",
      resumes: "Base de Currículums",
      login: "Iniciar Sesión",
      logout: "Cerrar Sesión",
      dashboard: "Panel",
      profile: "Perfil",
      
      // Roles
      employer: "Empleador",
      candidate: "Candidato",
      myVacancies: "Mis Vacantes",
      myResumes: "Mis Currículums",
      
      // Actions
      search: "Buscar",
      save: "Guardar",
      cancel: "Cancelar",
      apply: "Aplicar",
      close: "Cerrar",
      edit: "Editar",
      delete: "Eliminar",
      
      // Status
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      
      // Time
      today: "hoy",
      yesterday: "ayer",
      daysAgo: "hace {{count}} días",
    },
    home: {
      title: "Encuentra el trabajo de tus sueños o el empleado perfecto",
      subtitle: "Plataforma simple para búsqueda de trabajo y talento",
      searchPlaceholder: "Buscar trabajos...",
      postJob: "Publicar Trabajo",
      simplePosting: "Publicación Simple",
      simplePostingDesc: "Publica un trabajo en minutos",
      fastResponses: "Respuestas Rápidas",
      fastResponsesDesc: "Recibe respuestas directo en tu email",
      efficient: "Eficiente",
      efficientDesc: "Sin complicaciones innecesarias",
      activeJobs: "Trabajos Activos",
      noJobs: "Aún no hay trabajos publicados",
      noJobsFound: "No se encontraron trabajos",
      postFirstJob: "Publicar primer trabajo",
      loadingJobs: "Cargando trabajos..."
    },
    auth: {
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      email: "Email",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      dontHaveAccount: "¿No tienes una cuenta?",
      haveAccount: "¿Ya tienes una cuenta?",
      signInWithEmail: "Iniciar sesión con email",
      signUpWithEmail: "Registrarse con email"
    },
    footer: {
      copyright: "© 2024 LaburoGO. Plataforma simple para búsqueda de trabajo.",
      terms: "Términos de Uso",
      privacy: "Política de Privacidad"
    }
  },
  pt: {
    common: {
      // Navigation
      home: "Início",
      resumes: "Base de Currículos",
      login: "Entrar",
      logout: "Sair",
      dashboard: "Painel",
      profile: "Perfil",
      
      // Roles
      employer: "Empregador",
      candidate: "Candidato",
      myVacancies: "Minhas Vagas",
      myResumes: "Meus Currículos",
      
      // Actions
      search: "Buscar",
      save: "Salvar",
      cancel: "Cancelar",
      apply: "Candidatar",
      close: "Fechar",
      edit: "Editar",
      delete: "Excluir",
      
      // Status
      loading: "Carregando...",
      error: "Erro",
      success: "Sucesso",
      
      // Time
      today: "hoje",
      yesterday: "ontem",
      daysAgo: "há {{count}} dias",
    },
    home: {
      title: "Encontre o emprego dos seus sonhos ou o funcionário perfeito",
      subtitle: "Plataforma simples para busca de emprego e talentos",
      searchPlaceholder: "Buscar empregos...",
      postJob: "Publicar Vaga",
      simplePosting: "Publicação Simples",
      simplePostingDesc: "Publique uma vaga em minutos",
      fastResponses: "Respostas Rápidas",
      fastResponsesDesc: "Receba respostas direto no seu email",
      efficient: "Eficiente",
      efficientDesc: "Sem complicações desnecessárias",
      activeJobs: "Vagas Ativas",
      noJobs: "Ainda não há vagas publicadas",
      noJobsFound: "Nenhuma vaga encontrada",
      postFirstJob: "Publicar primeira vaga",
      loadingJobs: "Carregando vagas..."
    },
    auth: {
      signIn: "Entrar",
      signUp: "Registrar",
      email: "Email",
      password: "Senha",
      confirmPassword: "Confirmar Senha",
      forgotPassword: "Esqueceu a senha?",
      dontHaveAccount: "Não tem uma conta?",
      haveAccount: "Já tem uma conta?",
      signInWithEmail: "Entrar com email",
      signUpWithEmail: "Registrar com email"
    },
    footer: {
      copyright: "© 2024 LaburoGO. Plataforma simples para busca de emprego.",
      terms: "Termos de Uso",
      privacy: "Política de Privacidade"
    }
  },
  ru: {
    common: {
      // Navigation
      home: "Главная",
      resumes: "База резюме",
      login: "Войти",
      logout: "Выйти",
      dashboard: "Личный кабинет",
      profile: "Профиль",
      
      // Roles
      employer: "Работодатель",
      candidate: "Соискатель",
      myVacancies: "Мои вакансии",
      myResumes: "Мои резюме",
      
      // Actions
      search: "Поиск",
      save: "Сохранить",
      cancel: "Отмена",
      apply: "Откликнуться",
      close: "Закрыть",
      edit: "Редактировать",
      delete: "Удалить",
      
      // Status
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
      
      // Time
      today: "сегодня",
      yesterday: "вчера",
      daysAgo: "{{count}} дня назад",
    },
    home: {
      title: "Найдите работу мечты или идеального сотрудника",
      subtitle: "Простая платформа для поиска работы и талантов",
      searchPlaceholder: "Поиск вакансий...",
      postJob: "Разместить вакансию",
      simplePosting: "Простое размещение",
      simplePostingDesc: "Разместите вакансию за несколько минут",
      fastResponses: "Быстрые отклики",
      fastResponsesDesc: "Получайте отклики прямо на почту",
      efficient: "Эффективно",
      efficientDesc: "Никаких лишних сложностей",
      activeJobs: "Актуальные вакансии",
      noJobs: "Пока нет размещенных вакансий",
      noJobsFound: "Вакансии не найдены",
      postFirstJob: "Разместить первую вакансию",
      loadingJobs: "Загрузка вакансий..."
    },
    auth: {
      signIn: "Войти",
      signUp: "Регистрация",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      forgotPassword: "Забыли пароль?",
      dontHaveAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      signInWithEmail: "Войти через email",
      signUpWithEmail: "Зарегистрироваться через email"
    },
    footer: {
      copyright: "© 2024 LaburoGO. Простая платформа для поиска работы.",
      terms: "Условия использования",
      privacy: "Политика конфиденциальности"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    ns: ['common', 'home', 'auth', 'footer'],
    defaultNS: 'common',
  });

export default i18n;