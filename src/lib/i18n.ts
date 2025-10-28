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
      
      // Accessibility
      "common.skipToContent": "Skip to main content",
      "common.homeLink": "Go to home page",
      "common.mainNavigation": "Main navigation",
      "common.resumesLink": "Browse resumes",
      "common.userActions": "User actions",
      "common.userMenu": "User menu",
      
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
      "home.searchAriaLabel": "Search for jobs by title, location or company",
      "home.postJobAriaLabel": "Post a new job",
      "home.jobsFound": "jobs found",

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
      "footer.contact": "Contact",

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
      "vacancy.loadingError": "Failed to load vacancy",

      // Auth additional
      "auth.welcomeMessage": "Sign in or register to continue",
      "auth.signInSuccess": "You have successfully signed in",
      "auth.signUpSuccess": "Registration successful",
      "auth.checkEmail": "Check your email to confirm your account",
      "auth.googleSignInError": "Google sign-in error",

      // Job card
      "jobCard.apply": "Apply for Position",

      // Application form
      "application.title": "Apply for Position",
      "application.companyAt": "at {{company}}",
      "application.fillForm": "Fill out the form to apply. Fields marked with * are required.",
      "application.fullName": "Full Name *",
      "application.fullNamePlaceholder": "John Doe",
      "application.phone": "Phone",
      "application.phonePlaceholder": "+1 (555) 123-4567",
      "application.resumeLink": "Resume Link",
      "application.resumeLinkPlaceholder": "example.com/resume.pdf or https://example.com/resume.pdf",
      "application.coverLetter": "Cover Letter",
      "application.coverLetterPlaceholder": "Tell us why you're perfect for this position...",
      "application.submit": "Send Application",
      "application.submitting": "Sending...",
      "application.wait": "Please wait...",
      "application.blocked": "Blocked",
      "application.cancel": "Cancel",
      "application.success": "Application Sent!",
      "application.successDesc": "Your application for \"{{title}}\" has been successfully sent to {{company}}",
      "application.error": "Sending Error",
      "application.errorDesc": "Failed to send application. Please try again.",
      "application.fieldsRequired": "Please fill in all required fields",
      "application.tooManyApplications": "Too Many Applications",
      "application.rateLimitDesc": "You can submit another application in 10 minutes",

      // Application modal
      "applicationModal.title": "Apply for Position",
      "applicationModal.contactData": "Your Contact Information",
      "applicationModal.name": "Name *",
      "applicationModal.namePlaceholder": "John Doe",
      "applicationModal.phonePlaceholder": "+1 (555) 123-4567",
      "applicationModal.resume": "Resume",
      "applicationModal.selectExisting": "Select from my resumes",
      "applicationModal.uploadFile": "Upload file",
      "applicationModal.provideLink": "Provide link",
      "applicationModal.selectResume": "Select resume",
      "applicationModal.resumeFile": "Resume file (PDF, DOCX, up to 10MB)",
      "applicationModal.resumeLinkLabel": "Resume link",
      "applicationModal.resumeLinkPlaceholder": "https://example.com/my-resume.pdf",
      "applicationModal.coverLetterLabel": "Cover Letter",
      "applicationModal.coverLetterPlaceholder": "Tell us about yourself and why you're interested in this position",
      "applicationModal.sending": "Sending...",
      "applicationModal.sendApplication": "Send Application",
      "applicationModal.error": "Error",
      "applicationModal.fillRequired": "Fill in all required fields",
      "applicationModal.selectResumeError": "Select a resume from the list",
      "applicationModal.selectFileError": "Select a resume file",
      "applicationModal.provideLinkError": "Provide a resume link",
      "applicationModal.invalidLinkError": "Provide a valid resume link",
      "applicationModal.fileSizeError": "File size must not exceed 10MB",
      "applicationModal.fileTypeError": "Only PDF and DOCX files are supported",
      "applicationModal.alreadyApplied": "Notice",
      "applicationModal.alreadyAppliedDesc": "You have already applied for this position",
      "applicationModal.sent": "Success",
      "applicationModal.sentDesc": "Application sent",
      "applicationModal.sendError": "Failed to send application",

      // Dashboard
      "dashboard.welcome": "Welcome",
      "dashboard.profile": "Profile",
      "dashboard.myVacancies": "My Vacancies",
      "dashboard.myApplications": "My Applications",
      "dashboard.myResumes": "My Resumes",
      "dashboard.createVacancy": "Create Vacancy",
      "dashboard.createResume": "Create Resume",

      // Forms
      "form.title": "Title",
      "form.company": "Company",
      "form.location": "Location",
      "form.salary": "Salary",
      "form.employmentType": "Employment Type",
      "form.description": "Description",
      "form.requirements": "Requirements",
      "form.save": "Save",
      "form.cancel": "Cancel",
      "form.delete": "Delete",
      "form.edit": "Edit",

      // Resume
      "resume.title": "Resume",
      "resume.summary": "Summary",
      "resume.skills": "Skills",
      "resume.experience": "Experience",
      "resume.education": "Education",
      "resume.contact": "Contact Information",
      "resume.views": "Views",

      // Security
      "security.passwordStrength": "Password Strength",
      "security.weakPassword": "Weak password",
      "security.mediumPassword": "Medium password",
      "security.strongPassword": "Strong password",
      "security.passwordRequirements": "Password must contain at least 8 characters, including letters and numbers",

      // Time
      "time.today": "today",
      "time.yesterday": "yesterday",
      "time.daysAgo": "{{count}} days ago",
      "time.created": "Created {{date}}",
      "time.updated": "Updated {{date}}"
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
      
      // Accessibility
      "common.skipToContent": "Saltar al contenido principal",
      "common.homeLink": "Ir a la página principal",
      "common.mainNavigation": "Navegación principal",
      "common.resumesLink": "Explorar currículums",
      "common.userActions": "Acciones de usuario",
      "common.userMenu": "Menú de usuario",
      
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
      "home.searchAriaLabel": "Buscar trabajos por título, ubicación o empresa",
      "home.postJobAriaLabel": "Publicar un nuevo trabajo",
      "home.jobsFound": "trabajos encontrados",

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
      "footer.contact": "Contacto",

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
      "vacancy.loadingError": "Error al cargar vacante",

      // Auth additional
      "auth.welcomeMessage": "Inicia sesión o regístrate para continuar",
      "auth.signInSuccess": "Has iniciado sesión exitosamente",
      "auth.signUpSuccess": "Registro exitoso",
      "auth.checkEmail": "Revisa tu email para confirmar tu cuenta",
      "auth.googleSignInError": "Error al iniciar sesión con Google",

      // Job card
      "jobCard.apply": "Aplicar para el Puesto",

      // Application form
      "application.title": "Aplicar para el Puesto",
      "application.companyAt": "en {{company}}",
      "application.fillForm": "Llena el formulario para aplicar. Los campos marcados con * son obligatorios.",
      "application.fullName": "Nombre Completo *",
      "application.fullNamePlaceholder": "Juan Pérez",
      "application.phone": "Teléfono",
      "application.phonePlaceholder": "+34 123 456 789",
      "application.resumeLink": "Enlace del Currículum",
      "application.resumeLinkPlaceholder": "ejemplo.com/curriculum.pdf o https://ejemplo.com/curriculum.pdf",
      "application.coverLetter": "Carta de Presentación",
      "application.coverLetterPlaceholder": "Cuéntanos por qué eres perfecto para este puesto...",
      "application.submit": "Enviar Aplicación",
      "application.submitting": "Enviando...",
      "application.wait": "Por favor espera...",
      "application.blocked": "Bloqueado",
      "application.cancel": "Cancelar",
      "application.success": "¡Aplicación Enviada!",
      "application.successDesc": "Tu aplicación para \"{{title}}\" ha sido exitosamente enviada a {{company}}",
      "application.error": "Error de Envío",
      "application.errorDesc": "No se pudo enviar la aplicación. Inténtalo de nuevo.",
      "application.fieldsRequired": "Por favor llena todos los campos obligatorios",
      "application.tooManyApplications": "Demasiadas Aplicaciones",
      "application.rateLimitDesc": "Puedes enviar otra aplicación en 10 minutos",

      // Application modal
      "applicationModal.title": "Aplicar para el Puesto",
      "applicationModal.contactData": "Tu Información de Contacto",
      "applicationModal.name": "Nombre *",
      "applicationModal.namePlaceholder": "Juan Pérez",
      "applicationModal.phonePlaceholder": "+34 123 456 789",
      "applicationModal.resume": "Currículum",
      "applicationModal.selectExisting": "Seleccionar de mis currículums",
      "applicationModal.uploadFile": "Subir archivo",
      "applicationModal.provideLink": "Proporcionar enlace",
      "applicationModal.selectResume": "Seleccionar currículum",
      "applicationModal.resumeFile": "Archivo de currículum (PDF, DOCX, hasta 10MB)",
      "applicationModal.resumeLinkLabel": "Enlace del currículum",
      "applicationModal.resumeLinkPlaceholder": "https://ejemplo.com/mi-curriculum.pdf",
      "applicationModal.coverLetterLabel": "Carta de Presentación",
      "applicationModal.coverLetterPlaceholder": "Cuéntanos sobre ti y por qué te interesa este puesto",
      "applicationModal.sending": "Enviando...",
      "applicationModal.sendApplication": "Enviar Aplicación",
      "applicationModal.error": "Error",
      "applicationModal.fillRequired": "Llena todos los campos obligatorios",
      "applicationModal.selectResumeError": "Selecciona un currículum de la lista",
      "applicationModal.selectFileError": "Selecciona un archivo de currículum",
      "applicationModal.provideLinkError": "Proporciona un enlace de currículum",
      "applicationModal.invalidLinkError": "Proporciona un enlace válido de currículum",
      "applicationModal.fileSizeError": "El tamaño del archivo no debe exceder 10MB",
      "applicationModal.fileTypeError": "Solo se admiten archivos PDF y DOCX",
      "applicationModal.alreadyApplied": "Aviso",
      "applicationModal.alreadyAppliedDesc": "Ya has aplicado para este puesto",
      "applicationModal.sent": "Éxito",
      "applicationModal.sentDesc": "Aplicación enviada",
      "applicationModal.sendError": "No se pudo enviar la aplicación",

      // Dashboard
      "dashboard.welcome": "Bienvenido",
      "dashboard.profile": "Perfil",
      "dashboard.myVacancies": "Mis Vacantes",
      "dashboard.myApplications": "Mis Aplicaciones",
      "dashboard.myResumes": "Mis Currículums",
      "dashboard.createVacancy": "Crear Vacante",
      "dashboard.createResume": "Crear Currículum",

      // Forms
      "form.title": "Título",
      "form.company": "Empresa",
      "form.location": "Ubicación",
      "form.salary": "Salario",
      "form.employmentType": "Tipo de Empleo",
      "form.description": "Descripción",
      "form.requirements": "Requisitos",
      "form.save": "Guardar",
      "form.cancel": "Cancelar",
      "form.delete": "Eliminar",
      "form.edit": "Editar",

      // Resume
      "resume.title": "Currículum",
      "resume.summary": "Resumen",
      "resume.skills": "Habilidades",
      "resume.experience": "Experiencia",
      "resume.education": "Educación",
      "resume.contact": "Información de Contacto",
      "resume.views": "Visualizaciones",

      // Security
      "security.passwordStrength": "Fortaleza de la Contraseña",
      "security.weakPassword": "Contraseña débil",
      "security.mediumPassword": "Contraseña media",
      "security.strongPassword": "Contraseña fuerte",
      "security.passwordRequirements": "La contraseña debe contener al menos 8 caracteres, incluyendo letras y números",

      // Time
      "time.today": "hoy",
      "time.yesterday": "ayer",
      "time.daysAgo": "hace {{count}} días",
      "time.created": "Creado {{date}}",
      "time.updated": "Actualizado {{date}}"
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
      
      // Accessibility
      "common.skipToContent": "Pular para o conteúdo principal",
      "common.homeLink": "Ir para a página inicial",
      "common.mainNavigation": "Navegação principal",
      "common.resumesLink": "Explorar currículos",
      "common.userActions": "Ações do usuário",
      "common.userMenu": "Menu do usuário",
      
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
      "home.searchAriaLabel": "Buscar vagas por título, localização ou empresa",
      "home.postJobAriaLabel": "Publicar uma nova vaga",
      "home.jobsFound": "vagas encontradas",

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
      "footer.contact": "Contato",

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
      "vacancy.loadingError": "Erro ao carregar vaga",

      // Auth additional
      "auth.welcomeMessage": "Entre ou registre-se para continuar",
      "auth.signInSuccess": "Você entrou com sucesso",
      "auth.signUpSuccess": "Registro bem-sucedido",
      "auth.checkEmail": "Verifique seu email para confirmar sua conta",
      "auth.googleSignInError": "Erro ao entrar com Google",

      // Job card
      "jobCard.apply": "Candidatar-se à Vaga",

      // Application form
      "application.title": "Candidatar-se à Vaga",
      "application.companyAt": "na {{company}}",
      "application.fillForm": "Preencha o formulário para se candidatar. Campos marcados com * são obrigatórios.",
      "application.fullName": "Nome Completo *",
      "application.fullNamePlaceholder": "João Silva",
      "application.phone": "Telefone",
      "application.phonePlaceholder": "+55 11 99999-9999",
      "application.resumeLink": "Link do Currículo",
      "application.resumeLinkPlaceholder": "exemplo.com/curriculo.pdf ou https://exemplo.com/curriculo.pdf",
      "application.coverLetter": "Carta de Apresentação",
      "application.coverLetterPlaceholder": "Conte por que você é perfeito para esta posição...",
      "application.submit": "Enviar Candidatura",
      "application.submitting": "Enviando...",
      "application.wait": "Aguarde...",
      "application.blocked": "Bloqueado",
      "application.cancel": "Cancelar",
      "application.success": "Candidatura Enviada!",
      "application.successDesc": "Sua candidatura para \"{{title}}\" foi enviada com sucesso para {{company}}",
      "application.error": "Erro no Envio",
      "application.errorDesc": "Não foi possível enviar a candidatura. Tente novamente.",
      "application.fieldsRequired": "Por favor, preencha todos os campos obrigatórios",
      "application.tooManyApplications": "Muitas Candidaturas",
      "application.rateLimitDesc": "Você pode enviar outra candidatura em 10 minutos",

      // Application modal
      "applicationModal.title": "Candidatar-se à Vaga",
      "applicationModal.contactData": "Suas Informações de Contato",
      "applicationModal.name": "Nome *",
      "applicationModal.namePlaceholder": "João Silva",
      "applicationModal.phonePlaceholder": "+55 11 99999-9999",
      "applicationModal.resume": "Currículo",
      "applicationModal.selectExisting": "Selecionar dos meus currículos",
      "applicationModal.uploadFile": "Enviar arquivo",
      "applicationModal.provideLink": "Fornecer link",
      "applicationModal.selectResume": "Selecionar currículo",
      "applicationModal.resumeFile": "Arquivo de currículo (PDF, DOCX, até 10MB)",
      "applicationModal.resumeLinkLabel": "Link do currículo",
      "applicationModal.resumeLinkPlaceholder": "https://exemplo.com/meu-curriculo.pdf",
      "applicationModal.coverLetterLabel": "Carta de Apresentação",
      "applicationModal.coverLetterPlaceholder": "Conte sobre você e por que tem interesse nesta posição",
      "applicationModal.sending": "Enviando...",
      "applicationModal.sendApplication": "Enviar Candidatura",
      "applicationModal.error": "Erro",
      "applicationModal.fillRequired": "Preencha todos os campos obrigatórios",
      "applicationModal.selectResumeError": "Selecione um currículo da lista",
      "applicationModal.selectFileError": "Selecione um arquivo de currículo",
      "applicationModal.provideLinkError": "Forneça um link de currículo",
      "applicationModal.invalidLinkError": "Forneça um link válido de currículo",
      "applicationModal.fileSizeError": "O tamanho do arquivo não deve exceder 10MB",
      "applicationModal.fileTypeError": "Apenas arquivos PDF e DOCX são suportados",
      "applicationModal.alreadyApplied": "Aviso",
      "applicationModal.alreadyAppliedDesc": "Você já se candidatou para esta vaga",
      "applicationModal.sent": "Sucesso",
      "applicationModal.sentDesc": "Candidatura enviada",
      "applicationModal.sendError": "Não foi possível enviar a candidatura",

      // Dashboard
      "dashboard.welcome": "Bem-vindo",
      "dashboard.profile": "Perfil",
      "dashboard.myVacancies": "Minhas Vagas",
      "dashboard.myApplications": "Minhas Candidaturas",
      "dashboard.myResumes": "Meus Currículos",
      "dashboard.createVacancy": "Criar Vaga",
      "dashboard.createResume": "Criar Currículo",

      // Forms
      "form.title": "Título",
      "form.company": "Empresa",
      "form.location": "Localização",
      "form.salary": "Salário",
      "form.employmentType": "Tipo de Emprego",
      "form.description": "Descrição",
      "form.requirements": "Requisitos",
      "form.save": "Salvar",
      "form.cancel": "Cancelar",
      "form.delete": "Excluir",
      "form.edit": "Editar",

      // Resume
      "resume.title": "Currículo",
      "resume.summary": "Resumo",
      "resume.skills": "Habilidades",
      "resume.experience": "Experiência",
      "resume.education": "Educação",
      "resume.contact": "Informações de Contato",
      "resume.views": "Visualizações",

      // Security
      "security.passwordStrength": "Força da Senha",
      "security.weakPassword": "Senha fraca",
      "security.mediumPassword": "Senha média",
      "security.strongPassword": "Senha forte",
      "security.passwordRequirements": "A senha deve conter pelo menos 8 caracteres, incluindo letras e números",

      // Time
      "time.today": "hoje",
      "time.yesterday": "ontem",
      "time.daysAgo": "há {{count}} dias",
      "time.created": "Criado {{date}}",
      "time.updated": "Atualizado {{date}}"
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
      
      // Accessibility
      "common.skipToContent": "Перейти к содержимому",
      "common.homeLink": "На главную",
      "common.mainNavigation": "Основная навигация",
      "common.resumesLink": "База резюме",
      "common.userActions": "Действия пользователя",
      "common.userMenu": "Меню пользователя",
      
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
      "home.searchAriaLabel": "Поиск вакансий по названию, городу или компании",
      "home.postJobAriaLabel": "Опубликовать новую вакансию",
      "home.jobsFound": "вакансий найдено",

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
      "footer.contact": "Контакты",

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
      "vacancy.loadingError": "Не удалось загрузить вакансию",

      // Auth additional
      "auth.welcomeMessage": "Войдите или зарегистрируйтесь для продолжения",
      "auth.signInSuccess": "Вы успешно вошли в систему",
      "auth.signUpSuccess": "Регистрация успешна",
      "auth.checkEmail": "Проверьте вашу почту для подтверждения аккаунта",
      "auth.googleSignInError": "Ошибка входа через Google",

      // Job card
      "jobCard.apply": "Откликнуться на вакансию",

      // Application form
      "application.title": "Отклик на вакансию",
      "application.companyAt": "в компании {{company}}",
      "application.fillForm": "Заполните форму для отправки отклика. Поля отмеченные * обязательны.",
      "application.fullName": "Полное имя *",
      "application.fullNamePlaceholder": "Иван Иванов",
      "application.phone": "Телефон",
      "application.phonePlaceholder": "+7 (999) 123-45-67",
      "application.resumeLink": "Ссылка на резюме",
      "application.resumeLinkPlaceholder": "example.com/resume.pdf или https://example.com/resume.pdf",
      "application.coverLetter": "Сопроводительное письмо",
      "application.coverLetterPlaceholder": "Расскажите, почему вы подходите для этой позиции...",
      "application.submit": "Отправить отклик",
      "application.submitting": "Отправляется...",
      "application.wait": "Подождите...",
      "application.blocked": "Заблокировано",
      "application.cancel": "Отмена",
      "application.success": "Отклик отправлен!",
      "application.successDesc": "Ваш отклик на вакансию \"{{title}}\" успешно отправлен в {{company}}",
      "application.error": "Ошибка отправки",
      "application.errorDesc": "Не удалось отправить отклик. Попробуйте еще раз.",
      "application.fieldsRequired": "Пожалуйста, заполните все обязательные поля",
      "application.tooManyApplications": "Слишком много заявок",
      "application.rateLimitDesc": "Повторная заявка будет доступна через 10 минут",

      // Application modal
      "applicationModal.title": "Откликнуться на вакансию",
      "applicationModal.contactData": "Ваши контактные данные",
      "applicationModal.name": "Имя *",
      "applicationModal.namePlaceholder": "Иван Иванов",
      "applicationModal.phonePlaceholder": "+7 (999) 123-45-67",
      "applicationModal.resume": "Резюме",
      "applicationModal.selectExisting": "Выбрать из моих резюме",
      "applicationModal.uploadFile": "Загрузить файл",
      "applicationModal.provideLink": "Указать ссылку",
      "applicationModal.selectResume": "Выберите резюме",
      "applicationModal.resumeFile": "Файл резюме (PDF, DOCX, до 10MB)",
      "applicationModal.resumeLinkLabel": "Ссылка на резюме",
      "applicationModal.resumeLinkPlaceholder": "example.com/my-resume.pdf",
      "applicationModal.coverLetterLabel": "Сопроводительное письмо",
      "applicationModal.coverLetterPlaceholder": "Расскажите о себе и почему вас интересует эта позиция",
      "applicationModal.sending": "Отправляем...",
      "applicationModal.sendApplication": "Отправить отклик",
      "applicationModal.error": "Ошибка",
      "applicationModal.fillRequired": "Заполните все обязательные поля",
      "applicationModal.selectResumeError": "Выберите резюме из списка",
      "applicationModal.selectFileError": "Выберите файл резюме",
      "applicationModal.provideLinkError": "Укажите ссылку на резюме",
      "applicationModal.invalidLinkError": "Укажите корректную ссылку на резюме",
      "applicationModal.fileSizeError": "Размер файла не должен превышать 10MB",
      "applicationModal.fileTypeError": "Поддерживаются только файлы PDF и DOCX",
      "applicationModal.alreadyApplied": "Внимание",
      "applicationModal.alreadyAppliedDesc": "Вы уже откликались на эту вакансию",
      "applicationModal.sent": "Успешно",
      "applicationModal.sentDesc": "Отклик отправлен",
      "applicationModal.sendError": "Не удалось отправить отклик",

      // Dashboard
      "dashboard.welcome": "Добро пожаловать",
      "dashboard.profile": "Профиль",
      "dashboard.myVacancies": "Мои вакансии",
      "dashboard.myApplications": "Мои отклики",
      "dashboard.myResumes": "Мои резюме",
      "dashboard.createVacancy": "Создать вакансию",
      "dashboard.createResume": "Создать резюме",

      // Forms
      "form.title": "Название",
      "form.company": "Компания",
      "form.location": "Местоположение",
      "form.salary": "Зарплата",
      "form.employmentType": "Тип занятости",
      "form.description": "Описание",
      "form.requirements": "Требования",
      "form.save": "Сохранить",
      "form.cancel": "Отмена",
      "form.delete": "Удалить",
      "form.edit": "Редактировать",

      // Resume
      "resume.title": "Резюме",
      "resume.summary": "Описание",
      "resume.skills": "Навыки",
      "resume.experience": "Опыт работы",
      "resume.education": "Образование",
      "resume.contact": "Контактная информация",
      "resume.views": "Просмотры",

      // Security
      "security.passwordStrength": "Надежность пароля",
      "security.weakPassword": "Слабый пароль",
      "security.mediumPassword": "Средний пароль",
      "security.strongPassword": "Надежный пароль",
      "security.passwordRequirements": "Пароль должен содержать минимум 8 символов, включая буквы и цифры",

      // Time
      "time.today": "сегодня",
      "time.yesterday": "вчера",
      "time.daysAgo": "{{count}} дня назад",
      "time.created": "Создано {{date}}",
      "time.updated": "Обновлено {{date}}"
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