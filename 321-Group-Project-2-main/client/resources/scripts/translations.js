// Translation system for AQE Platform
// Supports all languages in the dropdown menu

const translations = {
  en: {
    // Header
    header: {
      welcome: "Accessible Quality Education",
      welcomeSubtitle: "Empowering learners worldwide",
      searchPlaceholder: "Search lessons, books, and more..."
    },
    
    // User
    user: {
      guest: "Guest User",
      role: "guest"
    },
    
    // Navigation
    nav: {
      dashboard: "Dashboard",
      lessons: "Lessons",
      library: "Library",
      adminPanel: "Practice Materials"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "Now Available in 9 Languages",
      title: "Learn better with a platform designed for every learner",
      subtitle: "Accessible Quality Education provides personalized learning experiences for students, teachers, and parents.",
      adaptiveLessons: "Adaptive Lessons",
      adaptiveLessonsDesc: "Tailored to your level",
      offlineReady: "Offline Ready",
      offlineReadyDesc: "Keep learning anywhere",
      parentInsights: "Parent Insights",
      parentInsightsDesc: "Track your child's progress",
      progressTracking: "Progress Tracking",
      progressTrackingDesc: "Monitor your achievements"
    },
    
    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back!",
      lessonsCompleted: "Lessons Completed",
      booksRead: "Books Read",
      currentStreak: "Current Streak",
      totalPoints: "Total Points",
      recentActivity: "Recent Activity",
      upcomingLessons: "Upcoming Lessons",
      achievements: "Achievements",
      platformFeatures: "Platform Features",
      adaptiveLearning: "Adaptive Learning",
      adaptiveLearningDesc: "Personalized difficulty adjustment",
      offlineSupport: "Offline Support",
      offlineSupportDesc: "Learn without internet connection",
      smsLearning: "SMS Learning",
      smsLearningDesc: "Learn via text messages",
      aqeTitle: "Accessible Quality Education",
      aqeDescription: "Accessible Quality Education is your gateway to personalized learning experiences. Choose your role in the 'Getting Started' tab to begin your educational journey."
    },
    
    // Getting Started
    gettingStarted: {
      title: "Getting Started",
      step1: "Choose Your Role & Login",
      step1Desc: "Select your role and login with demo credentials to access your personalized dashboard",
      step2: "Access Content",
      step2Desc: "Browse lessons, books, and practice materials",
      step3: "Track Progress",
      step3Desc: "Monitor your learning journey and achievements",
      login: "Login",
      changeAccount: "Change Account",
      logout: "Logout"
    },
    
    // Login Modal
    login: {
      title: "Choose Your Role & Login",
      selectRole: "Select Your Role",
      loginCredentials: "Login Credentials",
      email: "Email",
      password: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      passwordRequirement: "Password must be at least 8 characters long",
      loginButton: "Login",
      cancel: "Cancel",
      demoCredentials: "Demo Account Credentials",
      student: "Student",
      teacher: "Teacher",
      parent: "Parent",
      admin: "Admin",
      studentDesc: "Access lessons & track progress",
      teacherDesc: "Create assignments & monitor students",
      parentDesc: "Support your child's learning",
      adminDesc: "Manage content & system settings"
    },
    
    // User Menu
    userMenu: {
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      switchAccount: "Switch Account"
    },
    
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      close: "Close"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "For Students",
      forStudentsDesc: "Access lessons, track progress, and earn badges as you learn.",
      forTeachers: "For Teachers",
      forTeachersDesc: "Create assignments and monitor student progress effectively.",
      forParents: "For Parents",
      forParentsDesc: "Support your child's learning journey with progress insights.",
      forAdmins: "For Admins",
      forAdminsDesc: "Manage content, users, and system settings."
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Accessible Quality Education",
      privacy: "Privacy",
      terms: "Terms",
      support: "Support"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "Login",
      registerTab: "Register",
      loginButton: "Login",
      registerButton: "Register",
      loginAndRegistration: "Login & Registration",
      selectRoleToRegister: "Select Role to Register",
      loginCredentials: "Login Credentials"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "Back to Home",
      languageNotice: "This page is currently available in English. Use the language selector above to change the site interface language. Full page translation coming soon for all 9 languages.",
      languageLabel: "Language:",
      darkModeToggle: "Toggle Dark Mode"
    },
    
    // Support Page
    supportPage: {
      supportCenter: "Support Center",
      howCanWeHelp: "How Can We Help You?",
      supportTeamDescription: "Our support team is here to assist you with any questions or issues.",
      emailSupport: "Email Support",
      emailSupportDesc: "Get help via email",
      phoneSupport: "Phone Support", 
      phoneSupportDesc: "Call us for urgent issues",
      responseTime: "Response Time",
      responseTimeDesc: "We respond quickly",
      within24Hours: "Within 24 Hours",
      supportByRole: "Support by Role",
      forStudents: "For Students",
      forTeachers: "For Teachers",
      forParents: "For Parents",
      forAdministrators: "For Administrators",
      commonStudentQuestions: "Common Student Questions:",
      studentQ1: "How do I access my lessons? - Log in and click the \"Lessons\" tab in your dashboard",
      studentQ2: "How do I track my progress? - Visit your dashboard to see completed lessons, earned badges, and statistics",
      studentQ3: "Can I use AQE offline? - Yes! The app works offline after you've loaded content while online",
      studentQ4: "How do I earn badges? - Complete lessons and achieve high scores to unlock achievements",
      studentQ5: "What if I forget my password? - Click \"Forgot Password\" on the login screen or contact your teacher",
      studentSupportEmail: "Student Support Email: students@aqeducation.org",
      technicalSupport: "Technical Support",
      troubleshooting: "Troubleshooting",
      trouble1: "App won't load? Clear your browser cache and cookies",
      trouble2: "Offline mode not working? Ensure you've accessed content online first",
      trouble3: "Dark mode issues? Try refreshing the page or clearing cache",
      trouble4: "Translation not working? Select your language from the language dropdown",
      trouble5: "Videos not playing? Check your internet connection and browser settings",
      systemRequirements: "System Requirements",
      browsers: "Browsers: Chrome, Firefox, Safari, Edge (latest versions)",
      internet: "Internet: Required for initial load; offline access available after",
      mobile: "Mobile: iOS 12+, Android 8+",
      screen: "Screen: Minimum 320px width (mobile-friendly)",
      javascript: "JavaScript: Must be enabled",
      needMoreHelp: "Need More Help?",
      techSupportDesc: "For technical issues, email our tech team at tech@aqeducation.org with:",
      techSupportList1: "Your browser and device information",
      techSupportList2: "A description of the problem",
      techSupportList3: "Screenshots if applicable",
      techSupportList4: "Steps to reproduce the issue",
      contactUs: "Contact Us",
      contactUsDesc: "Have a question? Send us a message and we'll respond within 24 hours.",
      yourName: "Your Name",
      namePlaceholder: "John Doe",
      emailAddress: "Email Address",
      emailPlaceholder: "you@example.com",
      yourRole: "Your Role",
      rolePlaceholder: "Select your role...",
      subject: "Subject",
      subjectPlaceholder: "Select a topic...",
      message: "Message",
      messagePlaceholder: "Describe your question or issue in detail...",
      additionalResources: "Additional Resources",
      privacyPolicy: "Privacy Policy",
      privacyPolicyDesc: "Learn how we protect your data",
      termsOfService: "Terms of Service",
      termsDesc: "Read our terms and conditions",
      gettingStarted: "Getting Started",
      gettingStartedDesc: "Begin your learning journey",
      emergencyContact: "Emergency Contact",
      emergencyDesc: "For urgent security issues, data breaches, or child safety concerns, contact us immediately:",
      emergencyEmail: "Emergency Email: emergency@aqeducation.org",
      emergencyPhone: "Emergency Phone: +1 (555) 999-9999 (24/7 Hotline)",
      viewTermsOfService: "View Terms of Service",
      getSupport: "Get Support"
    },
    
    // Privacy Page
    privacyPage: {
      privacyPolicy: "Privacy Policy",
      lastUpdated: "Last Updated: October 21, 2025",
      introduction: "1. Introduction",
      introText1: "Welcome to Accessible Quality Education (AQE). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform.",
      introText2: "By using AQE, you agree to the collection and use of information in accordance with this policy.",
      informationWeCollect: "2. Information We Collect",
      personalInformation: "2.1 Personal Information",
      personalInfoDesc: "We collect information that you provide directly to us, including:",
      accountInfo: "Account Information: Name, email address, password, and role (student, teacher, parent, or admin)",
      profileInfo: "Profile Information: Grade level, subjects of interest, learning preferences",
      educationalData: "Educational Data: Lesson progress, quiz scores, badges earned, practice material completion",
      communicationData: "Communication Data: Messages sent through the platform, support inquiries",
      automaticallyCollected: "2.2 Automatically Collected Information",
      usageData: "Usage Data: Pages visited, time spent on lessons, features used",
      deviceInfo: "Device Information: Browser type, operating system, device identifiers",
      logData: "Log Data: IP address, access times, error logs",
      offlineData: "Offline Data: Content cached locally for offline access via our PWA functionality",
      howWeUse: "3. How We Use Your Information",
      howWeUseDesc: "We use the collected information for the following purposes:",
      educationalServices: "Educational Services: Provide personalized learning experiences, track progress, and award achievements",
      accountManagement: "Account Management: Create and manage user accounts, authenticate users",
      communication: "Communication: Send updates, notifications, and respond to inquiries",
      improvement: "Improvement: Analyze usage patterns to improve our platform and content",
      safetySecurity: "Safety & Security: Detect and prevent fraud, abuse, and security threats",
      compliance: "Compliance: Meet legal obligations and enforce our Terms of Service",
      childrensPrivacy: "4. Children's Privacy (COPPA Compliance)",
      childrensPrivacyDesc: "We take children's privacy seriously. Our platform is designed to be safe for students of all ages, including children under 13.",
      childrensPrivacyList1: "We do not knowingly collect personal information from children under 13 without parental consent",
      childrensPrivacyList2: "Student accounts created by teachers or parents are covered under school or parental consent",
      childrensPrivacyList3: "We do not display targeted advertising to children",
      childrensPrivacyList4: "Student data is used solely for educational purposes",
      childrensPrivacyList5: "Parents have the right to review and delete their child's information",
      childrensPrivacyContact: "If you believe we have collected information from a child under 13 without proper consent, please contact us immediately at privacy@aqeducation.org.",
      dataSharing: "5. Data Sharing and Disclosure",
      dataSharingDesc: "We do not sell your personal information. We may share information in the following circumstances:",
      dataSharingList1: "With Teachers & Parents: Student progress data is shared with assigned teachers and linked parents",
      dataSharingList2: "Educational Institutions: Schools may access data for students in their programs",
      dataSharingList3: "Service Providers: Third-party vendors who assist in operating our platform (all bound by confidentiality agreements)",
      dataSharingList4: "Legal Requirements: When required by law, court order, or to protect rights and safety",
      dataSharingList5: "With Your Consent: Any other disclosure will be made only with your explicit permission",
      dataSecurity: "6. Data Security",
      dataSecurityDesc: "We implement industry-standard security measures to protect your information:",
      dataSecurityList1: "Password encryption using BCrypt hashing",
      dataSecurityList2: "Secure HTTPS connections for data transmission",
      dataSecurityList3: "Regular security audits and updates",
      dataSecurityList4: "Access controls limiting who can view personal information",
      dataSecurityList5: "Offline data stored securely in your browser's IndexedDB",
      dataSecurityWarning: "However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.",
      yourRights: "7. Your Rights and Choices",
      yourRightsDesc: "You have the following rights regarding your personal information:",
      yourRightsList1: "Access: Request a copy of the personal data we hold about you",
      yourRightsList2: "Correction: Update or correct inaccurate information",
      yourRightsList3: "Deletion: Request deletion of your account and associated data",
      yourRightsList4: "Data Portability: Receive your data in a structured, machine-readable format",
      yourRightsList5: "Opt-Out: Unsubscribe from marketing communications (educational notifications may continue)",
      yourRightsList6: "Parental Access: Parents can review, modify, or delete their child's information",
      yourRightsContact: "To exercise these rights, contact us at privacy@aqeducation.org.",
      smsUssdPrivacy: "8. SMS/USSD Privacy",
      smsUssdDesc: "If you use our SMS or USSD learning features:",
      smsUssdList1: "We collect your phone number and message content for educational delivery",
      smsUssdList2: "You can opt-out at any time by texting \"STOP\"",
      smsUssdList3: "Standard message and data rates may apply",
      smsUssdList4: "We do not share your phone number with third parties for marketing",
      smsUssdList5: "SMS/USSD data is subject to the same privacy protections as web data",
      cookiesTracking: "9. Cookies and Tracking",
      cookiesDesc: "We use cookies and similar technologies to:",
      cookiesList1: "Remember your login session and preferences",
      cookiesList2: "Enable offline functionality (Service Workers, IndexedDB)",
      cookiesList3: "Analyze platform usage and performance",
      cookiesList4: "Personalize your learning experience",
      cookiesWarning: "You can control cookie preferences through your browser settings. Note that disabling cookies may limit platform functionality.",
      dataRetention: "10. Data Retention",
      activeAccounts: "Active Accounts: Data is retained while your account is active",
      inactiveAccounts: "Inactive Accounts: After 3 years of inactivity, we may delete your data",
      deletedAccounts: "Deleted Accounts: Data is permanently deleted within 30 days of account deletion request",
      legalRequirements: "Legal Requirements: Some data may be retained longer to comply with legal obligations",
      internationalUsers: "11. International Users",
      internationalDesc: "AQE is designed for a global audience. If you access our platform from outside the United States, your information may be transferred to, stored, and processed in the U.S. By using AQE, you consent to this transfer.",
      changesToPolicy: "12. Changes to This Policy",
      changesDesc: "We may update this Privacy Policy from time to time. We will notify you of significant changes by:",
      changesList1: "Posting the new policy on this page",
      changesList2: "Updating the \"Last Updated\" date",
      changesList3: "Sending an email notification for material changes",
      changesWarning: "Your continued use of AQE after changes constitutes acceptance of the updated policy.",
      contactUs: "13. Contact Us",
      contactUsDesc: "If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:",
      privacyTeam: "Privacy Team",
      privacyEmail: "Email: privacy@aqeducation.org",
      privacyPhone: "Phone: +1 (555) 123-4567",
      privacyResponseTime: "Response Time: Within 48 hours"
    }
  },
  
  es: {
    // Header
    header: {
      welcome: "Educación de Calidad Accesible",
      welcomeSubtitle: "Empoderando a estudiantes en todo el mundo",
      searchPlaceholder: "Buscar lecciones, libros y más..."
    },
    
    // User
    user: {
      guest: "Usuario Invitado",
      role: "invitado"
    },
    
    // Navigation
    nav: {
      dashboard: "Panel de Control",
      lessons: "Lecciones",
      library: "Biblioteca",
      adminPanel: "Panel de Administración"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "Ahora Disponible en 9 Idiomas",
      title: "Aprende mejor con una plataforma diseñada para cada estudiante",
      subtitle: "Educación de Calidad Accesible proporciona experiencias de aprendizaje personalizadas para estudiantes, maestros y padres.",
      adaptiveLessons: "Lecciones Adaptativas",
      adaptiveLessonsDesc: "Adaptadas a tu nivel",
      offlineReady: "Listo Sin Conexión",
      offlineReadyDesc: "Sigue aprendiendo en cualquier lugar",
      parentInsights: "Perspectivas para Padres",
      parentInsightsDesc: "Rastrea el progreso de tu hijo",
      progressTracking: "Seguimiento de Progreso",
      progressTrackingDesc: "Monitorea tus logros"
    },
    
    // Dashboard
    dashboard: {
      title: "Panel de Control",
      welcome: "¡Bienvenido de vuelta!",
      lessonsCompleted: "Lecciones Completadas",
      booksRead: "Libros Leídos",
      currentStreak: "Racha Actual",
      totalPoints: "Puntos Totales",
      recentActivity: "Actividad Reciente",
      upcomingLessons: "Próximas Lecciones",
      achievements: "Logros",
      platformFeatures: "Características de la Plataforma",
      adaptiveLearning: "Aprendizaje Adaptativo",
      adaptiveLearningDesc: "Ajuste personalizado de dificultad",
      offlineSupport: "Soporte Sin Conexión",
      offlineSupportDesc: "Aprende sin conexión a internet",
      smsLearning: "Aprendizaje por SMS",
      smsLearningDesc: "Aprende a través de mensajes de texto",
      aqeTitle: "Educación de Calidad Accesible",
      aqeDescription: "Educación de Calidad Accesible es tu puerta de entrada a experiencias de aprendizaje personalizadas. Elige tu rol en la pestaña 'Comenzar' para comenzar tu viaje educativo."
    },
    
    // Getting Started
    gettingStarted: {
      title: "Comenzar",
      step1: "Elige Tu Rol e Inicia Sesión",
      step1Desc: "Selecciona tu rol e inicia sesión con credenciales de demostración para acceder a tu panel personalizado",
      step2: "Accede al Contenido",
      step2Desc: "Explora lecciones, libros y materiales de práctica",
      step3: "Rastrea el Progreso",
      step3Desc: "Monitorea tu viaje de aprendizaje y logros",
      login: "Iniciar Sesión",
      changeAccount: "Cambiar Cuenta",
      logout: "Cerrar Sesión"
    },
    
    // Login Modal
    login: {
      title: "Elige Tu Rol e Inicia Sesión",
      selectRole: "Selecciona Tu Rol",
      loginCredentials: "Credenciales de Inicio de Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      emailPlaceholder: "Ingresa tu correo electrónico",
      passwordPlaceholder: "Ingresa tu contraseña",
      passwordRequirement: "La contraseña debe tener al menos 8 caracteres",
      loginButton: "Iniciar Sesión",
      cancel: "Cancelar",
      demoCredentials: "Credenciales de Cuenta de Demostración",
      student: "Estudiante",
      teacher: "Maestro",
      parent: "Padre",
      admin: "Administrador",
      studentDesc: "Accede a lecciones y rastrea el progreso",
      teacherDesc: "Crea asignaciones y monitorea estudiantes",
      parentDesc: "Apoya el aprendizaje de tu hijo",
      adminDesc: "Gestiona contenido y configuración del sistema"
    },
    
    // User Menu
    userMenu: {
      profile: "Perfil",
      settings: "Configuración",
      logout: "Cerrar Sesión",
      switchAccount: "Cambiar Cuenta"
    },
    
    // Common
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
      close: "Cerrar"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "Para Estudiantes",
      forStudentsDesc: "Accede a lecciones, rastrea el progreso y gana insignias mientras aprendes.",
      forTeachers: "Para Maestros",
      forTeachersDesc: "Crea asignaciones y monitorea el progreso de los estudiantes de manera efectiva.",
      forParents: "Para Padres",
      forParentsDesc: "Apoya el viaje de aprendizaje de tu hijo con información sobre el progreso.",
      forAdmins: "Para Administradores",
      forAdminsDesc: "Gestiona contenido, usuarios y configuración del sistema."
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Educación de Calidad Accesible",
      privacy: "Privacidad",
      terms: "Términos",
      support: "Soporte"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "Iniciar Sesión",
      registerTab: "Registrarse",
      loginButton: "Iniciar Sesión",
      registerButton: "Registrarse",
      loginAndRegistration: "Inicio de Sesión y Registro",
      selectRoleToRegister: "Selecciona Rol para Registrarse",
      loginCredentials: "Credenciales de Inicio de Sesión"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "Volver al Inicio",
      languageNotice: "Esta página está actualmente disponible en inglés. Usa el selector de idioma arriba para cambiar el idioma de la interfaz del sitio. La traducción completa de la página estará disponible pronto en los 9 idiomas.",
      languageLabel: "Idioma:",
      darkModeToggle: "Alternar Modo Oscuro"
    },
    
    // Support Page
    supportPage: {
      supportCenter: "Centro de Soporte",
      howCanWeHelp: "¿Cómo Podemos Ayudarte?",
      supportTeamDescription: "Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta o problema.",
      emailSupport: "Soporte por Email",
      emailSupportDesc: "Obtén ayuda por correo electrónico",
      phoneSupport: "Soporte Telefónico",
      phoneSupportDesc: "Llámanos para problemas urgentes",
      responseTime: "Tiempo de Respuesta",
      responseTimeDesc: "Respondemos rápidamente",
      within24Hours: "Dentro de 24 Horas",
      supportByRole: "Soporte por Rol",
      forStudents: "Para Estudiantes",
      forTeachers: "Para Maestros",
      forParents: "Para Padres",
      forAdministrators: "Para Administradores",
      commonStudentQuestions: "Preguntas Comunes de Estudiantes:",
      studentQ1: "¿Cómo accedo a mis lecciones? - Inicia sesión y haz clic en la pestaña \"Lecciones\" en tu panel",
      studentQ2: "¿Cómo rastreamos mi progreso? - Visita tu panel para ver lecciones completadas, insignias ganadas y estadísticas",
      studentQ3: "¿Puedo usar AQE sin conexión? - ¡Sí! La aplicación funciona sin conexión después de cargar contenido en línea",
      studentQ4: "¿Cómo gano insignias? - Completa lecciones y logra altas puntuaciones para desbloquear logros",
      studentQ5: "¿Qué pasa si olvido mi contraseña? - Haz clic en \"Olvidé mi Contraseña\" en la pantalla de inicio de sesión o contacta a tu maestro",
      studentSupportEmail: "Email de Soporte Estudiantil: students@aqeducation.org",
      technicalSupport: "Soporte Técnico",
      troubleshooting: "Solución de Problemas",
      trouble1: "¿La aplicación no carga? Limpia la caché y cookies de tu navegador",
      trouble2: "¿El modo sin conexión no funciona? Asegúrate de haber accedido al contenido en línea primero",
      trouble3: "¿Problemas con el modo oscuro? Intenta actualizar la página o limpiar la caché",
      trouble4: "¿La traducción no funciona? Selecciona tu idioma del menú desplegable de idiomas",
      trouble5: "¿Los videos no se reproducen? Verifica tu conexión a internet y configuración del navegador",
      systemRequirements: "Requisitos del Sistema",
      browsers: "Navegadores: Chrome, Firefox, Safari, Edge (versiones más recientes)",
      internet: "Internet: Requerido para carga inicial; acceso sin conexión disponible después",
      mobile: "Móvil: iOS 12+, Android 8+",
      screen: "Pantalla: Mínimo 320px de ancho (compatible con móviles)",
      javascript: "JavaScript: Debe estar habilitado",
      needMoreHelp: "¿Necesitas Más Ayuda?",
      techSupportDesc: "Para problemas técnicos, envía un email a nuestro equipo técnico en tech@aqeducation.org con:",
      techSupportList1: "Información de tu navegador y dispositivo",
      techSupportList2: "Una descripción del problema",
      techSupportList3: "Capturas de pantalla si aplica",
      techSupportList4: "Pasos para reproducir el problema",
      contactUs: "Contáctanos",
      contactUsDesc: "¿Tienes una pregunta? Envíanos un mensaje y responderemos dentro de 24 horas.",
      yourName: "Tu Nombre",
      namePlaceholder: "Juan Pérez",
      emailAddress: "Dirección de Email",
      emailPlaceholder: "tu@ejemplo.com",
      yourRole: "Tu Rol",
      rolePlaceholder: "Selecciona tu rol...",
      subject: "Asunto",
      subjectPlaceholder: "Selecciona un tema...",
      message: "Mensaje",
      messagePlaceholder: "Describe tu pregunta o problema en detalle...",
      additionalResources: "Recursos Adicionales",
      privacyPolicy: "Política de Privacidad",
      privacyPolicyDesc: "Aprende cómo protegemos tus datos",
      termsOfService: "Términos de Servicio",
      termsDesc: "Lee nuestros términos y condiciones",
      gettingStarted: "Comenzar",
      gettingStartedDesc: "Comienza tu viaje de aprendizaje",
      emergencyContact: "Contacto de Emergencia",
      emergencyDesc: "Para problemas urgentes de seguridad, violaciones de datos o preocupaciones de seguridad infantil, contáctanos inmediatamente:",
      emergencyEmail: "Email de Emergencia: emergency@aqeducation.org",
      emergencyPhone: "Teléfono de Emergencia: +1 (555) 999-9999 (Línea 24/7)",
      viewTermsOfService: "Ver Términos de Servicio",
      getSupport: "Obtener Soporte"
    },
    
    // Privacy Page
    privacyPage: {
      privacyPolicy: "Política de Privacidad",
      lastUpdated: "Última Actualización: 21 de Octubre de 2025",
      introduction: "1. Introducción",
      introText1: "Bienvenido a Educación de Calidad Accesible (AQE). Estamos comprometidos a proteger tu privacidad y asegurar la seguridad de tu información personal. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando usas nuestra plataforma educativa.",
      introText2: "Al usar AQE, aceptas la recopilación y uso de información de acuerdo con esta política.",
      informationWeCollect: "2. Información que Recopilamos",
      personalInformation: "2.1 Información Personal",
      personalInfoDesc: "Recopilamos información que nos proporcionas directamente, incluyendo:",
      accountInfo: "Información de Cuenta: Nombre, dirección de email, contraseña y rol (estudiante, maestro, padre o administrador)",
      profileInfo: "Información de Perfil: Nivel de grado, materias de interés, preferencias de aprendizaje",
      educationalData: "Datos Educativos: Progreso de lecciones, puntuaciones de exámenes, insignias ganadas, finalización de material de práctica",
      communicationData: "Datos de Comunicación: Mensajes enviados a través de la plataforma, consultas de soporte",
      automaticallyCollected: "2.2 Información Recopilada Automáticamente",
      usageData: "Datos de Uso: Páginas visitadas, tiempo dedicado a lecciones, características utilizadas",
      deviceInfo: "Información del Dispositivo: Tipo de navegador, sistema operativo, identificadores del dispositivo",
      logData: "Datos de Registro: Dirección IP, horarios de acceso, registros de errores",
      offlineData: "Datos Sin Conexión: Contenido almacenado localmente para acceso sin conexión a través de nuestra funcionalidad PWA",
      howWeUse: "3. Cómo Usamos Tu Información",
      howWeUseDesc: "Usamos la información recopilada para los siguientes propósitos:",
      educationalServices: "Servicios Educativos: Proporcionar experiencias de aprendizaje personalizadas, rastrear progreso y otorgar logros",
      accountManagement: "Gestión de Cuentas: Crear y gestionar cuentas de usuario, autenticar usuarios",
      communication: "Comunicación: Enviar actualizaciones, notificaciones y responder a consultas",
      improvement: "Mejora: Analizar patrones de uso para mejorar nuestra plataforma y contenido",
      safetySecurity: "Seguridad y Protección: Detectar y prevenir fraude, abuso y amenazas de seguridad",
      compliance: "Cumplimiento: Cumplir obligaciones legales y hacer cumplir nuestros Términos de Servicio",
      childrensPrivacy: "4. Privacidad de Menores (Cumplimiento COPPA)",
      childrensPrivacyDesc: "Nos tomamos en serio la privacidad de los menores. Nuestra plataforma está diseñada para ser segura para estudiantes de todas las edades, incluyendo niños menores de 13 años.",
      childrensPrivacyList1: "No recopilamos conscientemente información personal de niños menores de 13 años sin consentimiento parental",
      childrensPrivacyList2: "Las cuentas de estudiantes creadas por maestros o padres están cubiertas bajo consentimiento escolar o parental",
      childrensPrivacyList3: "No mostramos publicidad dirigida a niños",
      childrensPrivacyList4: "Los datos de estudiantes se usan únicamente para propósitos educativos",
      childrensPrivacyList5: "Los padres tienen el derecho de revisar y eliminar la información de su hijo",
      childrensPrivacyContact: "Si crees que hemos recopilado información de un niño menor de 13 años sin el consentimiento apropiado, contáctanos inmediatamente en privacy@aqeducation.org.",
      dataSharing: "5. Compartir y Divulgación de Datos",
      dataSharingDesc: "No vendemos tu información personal. Podemos compartir información en las siguientes circunstancias:",
      dataSharingList1: "Con Maestros y Padres: Los datos de progreso de estudiantes se comparten con maestros asignados y padres vinculados",
      dataSharingList2: "Instituciones Educativas: Las escuelas pueden acceder a datos para estudiantes en sus programas",
      dataSharingList3: "Proveedores de Servicios: Vendedores de terceros que ayudan a operar nuestra plataforma (todos sujetos a acuerdos de confidencialidad)",
      dataSharingList4: "Requisitos Legales: Cuando sea requerido por ley, orden judicial o para proteger derechos y seguridad",
      dataSharingList5: "Con Tu Consentimiento: Cualquier otra divulgación se hará solo con tu permiso explícito",
      dataSecurity: "6. Seguridad de Datos",
      dataSecurityDesc: "Implementamos medidas de seguridad estándar de la industria para proteger tu información:",
      dataSecurityList1: "Encriptación de contraseñas usando hash BCrypt",
      dataSecurityList2: "Conexiones HTTPS seguras para transmisión de datos",
      dataSecurityList3: "Auditorías de seguridad regulares y actualizaciones",
      dataSecurityList4: "Controles de acceso limitando quién puede ver información personal",
      dataSecurityList5: "Datos sin conexión almacenados de forma segura en IndexedDB de tu navegador",
      dataSecurityWarning: "Sin embargo, ningún método de transmisión por internet es 100% seguro. Aunque nos esforzamos por proteger tus datos, no podemos garantizar seguridad absoluta.",
      yourRights: "7. Tus Derechos y Opciones",
      yourRightsDesc: "Tienes los siguientes derechos respecto a tu información personal:",
      yourRightsList1: "Acceso: Solicitar una copia de los datos personales que tenemos sobre ti",
      yourRightsList2: "Corrección: Actualizar o corregir información inexacta",
      yourRightsList3: "Eliminación: Solicitar eliminación de tu cuenta y datos asociados",
      yourRightsList4: "Portabilidad de Datos: Recibir tus datos en un formato estructurado y legible por máquina",
      yourRightsList5: "Optar por No Participar: Cancelar suscripción a comunicaciones de marketing (las notificaciones educativas pueden continuar)",
      yourRightsList6: "Acceso Parental: Los padres pueden revisar, modificar o eliminar la información de su hijo",
      yourRightsContact: "Para ejercer estos derechos, contáctanos en privacy@aqeducation.org.",
      smsUssdPrivacy: "8. Privacidad SMS/USSD",
      smsUssdDesc: "Si usas nuestras características de aprendizaje SMS o USSD:",
      smsUssdList1: "Recopilamos tu número de teléfono y contenido de mensaje para entrega educativa",
      smsUssdList2: "Puedes optar por no participar en cualquier momento enviando \"STOP\"",
      smsUssdList3: "Pueden aplicar tarifas estándar de mensaje y datos",
      smsUssdList4: "No compartimos tu número de teléfono con terceros para marketing",
      smsUssdList5: "Los datos SMS/USSD están sujetos a las mismas protecciones de privacidad que los datos web",
      cookiesTracking: "9. Cookies y Seguimiento",
      cookiesDesc: "Usamos cookies y tecnologías similares para:",
      cookiesList1: "Recordar tu sesión de inicio de sesión y preferencias",
      cookiesList2: "Habilitar funcionalidad sin conexión (Service Workers, IndexedDB)",
      cookiesList3: "Analizar uso de la plataforma y rendimiento",
      cookiesList4: "Personalizar tu experiencia de aprendizaje",
      cookiesWarning: "Puedes controlar las preferencias de cookies a través de la configuración de tu navegador. Nota que deshabilitar cookies puede limitar la funcionalidad de la plataforma.",
      dataRetention: "10. Retención de Datos",
      activeAccounts: "Cuentas Activas: Los datos se retienen mientras tu cuenta esté activa",
      inactiveAccounts: "Cuentas Inactivas: Después de 3 años de inactividad, podemos eliminar tus datos",
      deletedAccounts: "Cuentas Eliminadas: Los datos se eliminan permanentemente dentro de 30 días de la solicitud de eliminación de cuenta",
      legalRequirements: "Requisitos Legales: Algunos datos pueden retenerse más tiempo para cumplir obligaciones legales",
      internationalUsers: "11. Usuarios Internacionales",
      internationalDesc: "AQE está diseñado para una audiencia global. Si accedes a nuestra plataforma desde fuera de los Estados Unidos, tu información puede transferirse, almacenarse y procesarse en los EE.UU. Al usar AQE, consientes a esta transferencia.",
      changesToPolicy: "12. Cambios a Esta Política",
      changesDesc: "Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos de cambios significativos por:",
      changesList1: "Publicar la nueva política en esta página",
      changesList2: "Actualizar la fecha de \"Última Actualización\"",
      changesList3: "Enviar una notificación por email para cambios materiales",
      changesWarning: "Tu uso continuo de AQE después de los cambios constituye aceptación de la política actualizada.",
      contactUs: "13. Contáctanos",
      contactUsDesc: "Si tienes preguntas, preocupaciones o solicitudes respecto a esta Política de Privacidad o tu información personal, contáctanos:",
      privacyTeam: "Equipo de Privacidad",
      privacyEmail: "Email: privacy@aqeducation.org",
      privacyPhone: "Teléfono: +1 (555) 123-4567",
      privacyResponseTime: "Tiempo de Respuesta: Dentro de 48 horas"
    }
  },
  
  fr: {
    // Header
    header: {
      welcome: "Éducation de Qualité Accessible",
      welcomeSubtitle: "Autonomiser les apprenants du monde entier",
      searchPlaceholder: "Rechercher des leçons, livres et plus..."
    },
    
    // User
    user: {
      guest: "Utilisateur Invité",
      role: "invité"
    },
    
    // Navigation
    nav: {
      dashboard: "Tableau de Bord",
      lessons: "Leçons",
      library: "Bibliothèque",
      adminPanel: "Panneau d'Administration"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "Maintenant Disponible en 9 Langues",
      title: "Apprenez mieux avec une plateforme conçue pour chaque apprenant",
      subtitle: "Éducation de Qualité Accessible fournit des expériences d'apprentissage personnalisées pour les étudiants, enseignants et parents.",
      adaptiveLessons: "Leçons Adaptatives",
      adaptiveLessonsDesc: "Adaptées à votre niveau",
      offlineReady: "Prêt Hors Ligne",
      offlineReadyDesc: "Continuez à apprendre partout",
      parentInsights: "Aperçus pour Parents",
      parentInsightsDesc: "Suivez les progrès de votre enfant",
      progressTracking: "Suivi des Progrès",
      progressTrackingDesc: "Surveillez vos réalisations"
    },
    
    // Dashboard
    dashboard: {
      title: "Tableau de Bord",
      welcome: "Bon retour !",
      lessonsCompleted: "Leçons Terminées",
      booksRead: "Livres Lus",
      currentStreak: "Série Actuelle",
      totalPoints: "Points Totaux",
      recentActivity: "Activité Récente",
      upcomingLessons: "Prochaines Leçons",
      achievements: "Réalisations",
      platformFeatures: "Fonctionnalités de la Plateforme",
      adaptiveLearning: "Apprentissage Adaptatif",
      adaptiveLearningDesc: "Ajustement personnalisé de la difficulté",
      offlineSupport: "Support Hors Ligne",
      offlineSupportDesc: "Apprenez sans connexion internet",
      smsLearning: "Apprentissage par SMS",
      smsLearningDesc: "Apprenez via des messages texte",
      aqeTitle: "Éducation de Qualité Accessible",
      aqeDescription: "Éducation de Qualité Accessible est votre passerelle vers des expériences d'apprentissage personnalisées. Choisissez votre rôle dans l'onglet 'Commencer' pour commencer votre parcours éducatif."
    },
    
    // Getting Started
    gettingStarted: {
      title: "Commencer",
      step1: "Choisissez Votre Rôle et Connectez-vous",
      step1Desc: "Sélectionnez votre rôle et connectez-vous avec les identifiants de démonstration pour accéder à votre tableau de bord personnalisé",
      step2: "Accédez au Contenu",
      step2Desc: "Parcourez les leçons, livres et matériaux de pratique",
      step3: "Suivez les Progrès",
      step3Desc: "Surveillez votre parcours d'apprentissage et vos réalisations",
      login: "Se Connecter",
      changeAccount: "Changer de Compte",
      logout: "Se Déconnecter"
    },
    
    // Login Modal
    login: {
      title: "Choisissez Votre Rôle et Connectez-vous",
      selectRole: "Sélectionnez Votre Rôle",
      loginCredentials: "Identifiants de Connexion",
      email: "E-mail",
      password: "Mot de Passe",
      emailPlaceholder: "Entrez votre e-mail",
      passwordPlaceholder: "Entrez votre mot de passe",
      passwordRequirement: "Le mot de passe doit contenir au moins 8 caractères",
      loginButton: "Se Connecter",
      cancel: "Annuler",
      demoCredentials: "Identifiants de Compte de Démonstration",
      student: "Étudiant",
      teacher: "Enseignant",
      parent: "Parent",
      admin: "Administrateur",
      studentDesc: "Accédez aux leçons et suivez les progrès",
      teacherDesc: "Créez des devoirs et surveillez les étudiants",
      parentDesc: "Soutenez l'apprentissage de votre enfant",
      adminDesc: "Gérez le contenu et les paramètres du système"
    },
    
    // User Menu
    userMenu: {
      profile: "Profil",
      settings: "Paramètres",
      logout: "Se Déconnecter",
      switchAccount: "Changer de Compte"
    },
    
    // Common
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      save: "Enregistrer",
      edit: "Modifier",
      delete: "Supprimer",
      close: "Fermer"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "Pour les Étudiants",
      forStudentsDesc: "Accédez aux leçons, suivez les progrès et gagnez des badges en apprenant.",
      forTeachers: "Pour les Enseignants",
      forTeachersDesc: "Créez des devoirs et surveillez efficacement les progrès des étudiants.",
      forParents: "Pour les Parents",
      forParentsDesc: "Soutenez le parcours d'apprentissage de votre enfant avec des informations sur les progrès.",
      forAdmins: "Pour les Administrateurs",
      forAdminsDesc: "Gérez le contenu, les utilisateurs et les paramètres du système."
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Éducation de Qualité Accessible",
      privacy: "Confidentialité",
      terms: "Conditions",
      support: "Assistance"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "Se Connecter",
      registerTab: "S'inscrire",
      loginButton: "Se Connecter",
      registerButton: "S'inscrire",
      loginAndRegistration: "Connexion et Inscription",
      selectRoleToRegister: "Sélectionnez le Rôle pour S'inscrire",
      loginCredentials: "Identifiants de Connexion"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "Retour à l'Accueil",
      languageNotice: "Cette page est actuellement disponible en anglais. Utilisez le sélecteur de langue ci-dessus pour changer la langue de l'interface du site. La traduction complète de la page sera bientôt disponible dans les 9 langues.",
      languageLabel: "Langue:",
      darkModeToggle: "Basculer le Mode Sombre"
    }
  },
  
  de: {
    // Header
    header: {
      welcome: "Zugängliche Qualitätsbildung",
      welcomeSubtitle: "Lernende weltweit stärken",
      searchPlaceholder: "Lektionen, Bücher und mehr suchen..."
    },
    
    // User
    user: {
      guest: "Gastbenutzer",
      role: "gast"
    },
    
    // Navigation
    nav: {
      dashboard: "Dashboard",
      lessons: "Lektionen",
      library: "Bibliothek",
      adminPanel: "Administrationspanel"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "Jetzt in 9 Sprachen verfügbar",
      title: "Lernen Sie besser mit einer Plattform, die für jeden Lernenden entwickelt wurde",
      subtitle: "Zugängliche Qualitätsbildung bietet personalisierte Lernerfahrungen für Schüler, Lehrer und Eltern.",
      adaptiveLessons: "Adaptive Lektionen",
      adaptiveLessonsDesc: "An Ihr Niveau angepasst",
      offlineReady: "Offline Bereit",
      offlineReadyDesc: "Überall weiterlernen",
      parentInsights: "Eltern-Einblicke",
      parentInsightsDesc: "Verfolgen Sie den Fortschritt Ihres Kindes",
      progressTracking: "Fortschrittsverfolgung",
      progressTrackingDesc: "Überwachen Sie Ihre Erfolge"
    },
    
    // Dashboard
    dashboard: {
      title: "Dashboard",
      welcome: "Willkommen zurück!",
      lessonsCompleted: "Abgeschlossene Lektionen",
      booksRead: "Gelesene Bücher",
      currentStreak: "Aktuelle Serie",
      totalPoints: "Gesamtpunkte",
      recentActivity: "Letzte Aktivität",
      upcomingLessons: "Kommende Lektionen",
      achievements: "Erfolge",
      platformFeatures: "Plattform-Funktionen",
      adaptiveLearning: "Adaptives Lernen",
      adaptiveLearningDesc: "Personalisierte Schwierigkeitsanpassung",
      offlineSupport: "Offline-Unterstützung",
      offlineSupportDesc: "Lernen ohne Internetverbindung",
      smsLearning: "SMS-Lernen",
      smsLearningDesc: "Lernen über Textnachrichten",
      aqeTitle: "Zugängliche Qualitätsbildung",
      aqeDescription: "Zugängliche Qualitätsbildung ist Ihr Tor zu personalisierten Lernerfahrungen. Wählen Sie Ihre Rolle im 'Erste Schritte'-Tab, um Ihre Bildungsreise zu beginnen."
    },
    
    // Getting Started
    gettingStarted: {
      title: "Erste Schritte",
      step1: "Wählen Sie Ihre Rolle und melden Sie sich an",
      step1Desc: "Wählen Sie Ihre Rolle und melden Sie sich mit Demo-Anmeldedaten an, um auf Ihr personalisiertes Dashboard zuzugreifen",
      step2: "Auf Inhalte zugreifen",
      step2Desc: "Durchsuchen Sie Lektionen, Bücher und Übungsmaterialien",
      step3: "Fortschritt verfolgen",
      step3Desc: "Überwachen Sie Ihre Lernreise und Erfolge",
      login: "Anmelden",
      changeAccount: "Konto wechseln",
      logout: "Abmelden"
    },
    
    // Login Modal
    login: {
      title: "Wählen Sie Ihre Rolle und melden Sie sich an",
      selectRole: "Wählen Sie Ihre Rolle",
      loginCredentials: "Anmeldedaten",
      email: "E-Mail",
      password: "Passwort",
      emailPlaceholder: "Geben Sie Ihre E-Mail ein",
      passwordPlaceholder: "Geben Sie Ihr Passwort ein",
      passwordRequirement: "Das Passwort muss mindestens 8 Zeichen lang sein",
      loginButton: "Anmelden",
      cancel: "Abbrechen",
      demoCredentials: "Demo-Konto-Anmeldedaten",
      student: "Schüler",
      teacher: "Lehrer",
      parent: "Elternteil",
      admin: "Administrator",
      studentDesc: "Auf Lektionen zugreifen und Fortschritt verfolgen",
      teacherDesc: "Aufgaben erstellen und Schüler überwachen",
      parentDesc: "Unterstützen Sie das Lernen Ihres Kindes",
      adminDesc: "Inhalte und Systemeinstellungen verwalten"
    },
    
    // User Menu
    userMenu: {
      profile: "Profil",
      settings: "Einstellungen",
      logout: "Abmelden",
      switchAccount: "Konto wechseln"
    },
    
    // Common
    common: {
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      cancel: "Abbrechen",
      save: "Speichern",
      edit: "Bearbeiten",
      delete: "Löschen",
      close: "Schließen"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "Für Schüler",
      forStudentsDesc: "Greifen Sie auf Lektionen zu, verfolgen Sie den Fortschritt und verdienen Sie Abzeichen beim Lernen.",
      forTeachers: "Für Lehrer",
      forTeachersDesc: "Erstellen Sie Aufgaben und überwachen Sie effektiv den Fortschritt der Schüler.",
      forParents: "Für Eltern",
      forParentsDesc: "Unterstützen Sie die Lernreise Ihres Kindes mit Fortschrittsinformationen.",
      forAdmins: "Für Administratoren",
      forAdminsDesc: "Verwalten Sie Inhalte, Benutzer und Systemeinstellungen."
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Zugängliche Qualitätsbildung",
      privacy: "Datenschutz",
      terms: "Bedingungen",
      support: "Unterstützung"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "Anmelden",
      registerTab: "Registrieren",
      loginButton: "Anmelden",
      registerButton: "Registrieren",
      loginAndRegistration: "Anmeldung und Registrierung",
      selectRoleToRegister: "Rolle zum Registrieren Auswählen",
      loginCredentials: "Anmeldedaten"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "Zurück zur Startseite",
      languageNotice: "Diese Seite ist derzeit auf Englisch verfügbar. Verwenden Sie die Sprachauswahl oben, um die Sprache der Site-Oberfläche zu ändern. Die vollständige Seitenübersetzung wird bald in allen 9 Sprachen verfügbar sein.",
      languageLabel: "Sprache:",
      darkModeToggle: "Dunkelmodus Umschalten"
    }
  },
  
  zh: {
    // Header
    header: {
      welcome: "无障碍优质教育",
      welcomeSubtitle: "赋能全球学习者",
      searchPlaceholder: "搜索课程、书籍等..."
    },
    
    // User
    user: {
      guest: "访客用户",
      role: "访客"
    },
    
    // Navigation
    nav: {
      dashboard: "仪表板",
      lessons: "课程",
      library: "图书馆",
      adminPanel: "管理面板"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "现已支持9种语言",
      title: "通过为每个学习者设计的平台更好地学习",
      subtitle: "无障碍优质教育为学生、教师和家长提供个性化学习体验。",
      adaptiveLessons: "自适应课程",
      adaptiveLessonsDesc: "根据您的水平定制",
      offlineReady: "离线就绪",
      offlineReadyDesc: "随时随地学习",
      parentInsights: "家长洞察",
      parentInsightsDesc: "跟踪您孩子的进度",
      progressTracking: "进度跟踪",
      progressTrackingDesc: "监控您的成就"
    },
    
    // Dashboard
    dashboard: {
      title: "仪表板",
      welcome: "欢迎回来！",
      lessonsCompleted: "已完成课程",
      booksRead: "已读书籍",
      currentStreak: "当前连胜",
      totalPoints: "总积分",
      recentActivity: "最近活动",
      upcomingLessons: "即将到来的课程",
      achievements: "成就",
      platformFeatures: "平台功能",
      adaptiveLearning: "自适应学习",
      adaptiveLearningDesc: "个性化难度调整",
      offlineSupport: "离线支持",
      offlineSupportDesc: "无需网络连接即可学习",
      smsLearning: "短信学习",
      smsLearningDesc: "通过短信学习",
      aqeTitle: "无障碍优质教育",
      aqeDescription: "无障碍优质教育是您通往个性化学习体验的门户。在'开始使用'选项卡中选择您的角色，开始您的教育之旅。"
    },
    
    // Getting Started
    gettingStarted: {
      title: "开始使用",
      step1: "选择您的角色并登录",
      step1Desc: "选择您的角色并使用演示凭据登录以访问您的个性化仪表板",
      step2: "访问内容",
      step2Desc: "浏览课程、书籍和练习材料",
      step3: "跟踪进度",
      step3Desc: "监控您的学习之旅和成就",
      login: "登录",
      changeAccount: "切换账户",
      logout: "退出登录"
    },
    
    // Login Modal
    login: {
      title: "选择您的角色并登录",
      selectRole: "选择您的角色",
      loginCredentials: "登录凭据",
      email: "电子邮件",
      password: "密码",
      emailPlaceholder: "输入您的电子邮件",
      passwordPlaceholder: "输入您的密码",
      passwordRequirement: "密码必须至少8个字符",
      loginButton: "登录",
      cancel: "取消",
      demoCredentials: "演示账户凭据",
      student: "学生",
      teacher: "教师",
      parent: "家长",
      admin: "管理员",
      studentDesc: "访问课程并跟踪进度",
      teacherDesc: "创建作业并监控学生",
      parentDesc: "支持您孩子的学习",
      adminDesc: "管理内容和系统设置"
    },
    
    // User Menu
    userMenu: {
      profile: "个人资料",
      settings: "设置",
      logout: "退出登录",
      switchAccount: "切换账户"
    },
    
    // Common
    common: {
      loading: "加载中...",
      error: "错误",
      success: "成功",
      cancel: "取消",
      save: "保存",
      edit: "编辑",
      delete: "删除",
      close: "关闭"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "为学生",
      forStudentsDesc: "访问课程、跟踪进度并在学习过程中获得徽章。",
      forTeachers: "为教师",
      forTeachersDesc: "创建作业并有效监控学生进度。",
      forParents: "为家长",
      forParentsDesc: "通过进度信息支持您孩子的学习之旅。",
      forAdmins: "为管理员",
      forAdminsDesc: "管理内容、用户和系统设置。"
    },
    
    // Footer
    footer: {
      copyright: "© 2025 无障碍优质教育",
      privacy: "隐私",
      terms: "条款",
      support: "支持"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "登录",
      registerTab: "注册",
      loginButton: "登录",
      registerButton: "注册",
      loginAndRegistration: "登录和注册",
      selectRoleToRegister: "选择角色进行注册",
      loginCredentials: "登录凭据"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "返回首页",
      languageNotice: "此页面目前仅提供英文版本。使用上面的语言选择器更改网站界面语言。完整的页面翻译将很快提供所有9种语言。",
      languageLabel: "语言：",
      darkModeToggle: "切换深色模式"
    }
  },
  
  ar: {
    // Header
    header: {
      welcome: "التعليم الجيد المتاح",
      welcomeSubtitle: "تمكين المتعلمين في جميع أنحاء العالم",
      searchPlaceholder: "البحث عن الدروس والكتب والمزيد..."
    },
    
    // User
    user: {
      guest: "مستخدم ضيف",
      role: "ضيف"
    },
    
    // Navigation
    nav: {
      dashboard: "لوحة التحكم",
      lessons: "الدروس",
      library: "المكتبة",
      adminPanel: "لوحة الإدارة"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "متاح الآن بـ 9 لغات",
      title: "تعلم بشكل أفضل مع منصة مصممة لكل متعلم",
      subtitle: "التعليم الجيد المتاح يوفر تجارب تعلم مخصصة للطلاب والمعلمين وأولياء الأمور.",
      adaptiveLessons: "دروس تكيفية",
      adaptiveLessonsDesc: "مخصصة لمستواك",
      offlineReady: "جاهز للعمل دون اتصال",
      offlineReadyDesc: "استمر في التعلم في أي مكان",
      parentInsights: "رؤى الوالدين",
      parentInsightsDesc: "تتبع تقدم طفلك",
      progressTracking: "تتبع التقدم",
      progressTrackingDesc: "راقب إنجازاتك"
    },
    
    // Dashboard
    dashboard: {
      title: "لوحة التحكم",
      welcome: "مرحباً بعودتك!",
      lessonsCompleted: "الدروس المكتملة",
      booksRead: "الكتب المقروءة",
      currentStreak: "السلسلة الحالية",
      totalPoints: "إجمالي النقاط",
      recentActivity: "النشاط الأخير",
      upcomingLessons: "الدروس القادمة",
      achievements: "الإنجازات",
      platformFeatures: "ميزات المنصة",
      adaptiveLearning: "التعلم التكيفي",
      adaptiveLearningDesc: "تعديل صعوبة مخصص",
      offlineSupport: "الدعم دون اتصال",
      offlineSupportDesc: "تعلم بدون اتصال بالإنترنت",
      smsLearning: "التعلم عبر الرسائل النصية",
      smsLearningDesc: "تعلم عبر الرسائل النصية",
      aqeTitle: "التعليم الجيد المتاح",
      aqeDescription: "التعليم الجيد المتاح هو بوابتك لتجارب التعلم المخصصة. اختر دورك في علامة التبويب 'البدء' لبدء رحلتك التعليمية."
    },
    
    // Getting Started
    gettingStarted: {
      title: "البدء",
      step1: "اختر دورك وقم بتسجيل الدخول",
      step1Desc: "اختر دورك وقم بتسجيل الدخول باستخدام بيانات الاعتماد التجريبية للوصول إلى لوحة التحكم المخصصة",
      step2: "الوصول إلى المحتوى",
      step2Desc: "تصفح الدروس والكتب ومواد الممارسة",
      step3: "تتبع التقدم",
      step3Desc: "راقب رحلة التعلم وإنجازاتك",
      login: "تسجيل الدخول",
      changeAccount: "تغيير الحساب",
      logout: "تسجيل الخروج"
    },
    
    // Login Modal
    login: {
      title: "اختر دورك وقم بتسجيل الدخول",
      selectRole: "اختر دورك",
      loginCredentials: "بيانات تسجيل الدخول",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordPlaceholder: "أدخل كلمة المرور",
      passwordRequirement: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
      loginButton: "تسجيل الدخول",
      cancel: "إلغاء",
      demoCredentials: "بيانات حساب تجريبي",
      student: "طالب",
      teacher: "معلم",
      parent: "والد",
      admin: "مدير",
      studentDesc: "الوصول إلى الدروس وتتبع التقدم",
      teacherDesc: "إنشاء المهام ومراقبة الطلاب",
      parentDesc: "دعم تعلم طفلك",
      adminDesc: "إدارة المحتوى وإعدادات النظام"
    },
    
    // User Menu
    userMenu: {
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      switchAccount: "تغيير الحساب"
    },
    
    // Common
    common: {
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تحرير",
      delete: "حذف",
      close: "إغلاق"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "للطلاب",
      forStudentsDesc: "الوصول إلى الدروس وتتبع التقدم واكتساب الشارات أثناء التعلم.",
      forTeachers: "للمعلمين",
      forTeachersDesc: "إنشاء المهام ومراقبة تقدم الطلاب بفعالية.",
      forParents: "للآباء",
      forParentsDesc: "ادعم رحلة التعلم لطفلك من خلال رؤى التقدم.",
      forAdmins: "للمديرين",
      forAdminsDesc: "إدارة المحتوى والمستخدمين وإعدادات النظام."
    },
    
    // Footer
    footer: {
      copyright: "© 2025 التعليم الجيد المتاح",
      privacy: "الخصوصية",
      terms: "الشروط",
      support: "الدعم"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "تسجيل الدخول",
      registerTab: "التسجيل",
      loginButton: "تسجيل الدخول",
      registerButton: "التسجيل",
      loginAndRegistration: "تسجيل الدخول والتسجيل",
      selectRoleToRegister: "اختر الدور للتسجيل",
      loginCredentials: "بيانات تسجيل الدخول"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "العودة إلى الصفحة الرئيسية",
      languageNotice: "هذه الصفحة متاحة حاليًا باللغة الإنجليزية. استخدم محدد اللغة أعلاه لتغيير لغة واجهة الموقع. سيتوفر ترجمة الصفحة الكاملة قريبًا في جميع اللغات التسع.",
      languageLabel: "اللغة:",
      darkModeToggle: "تبديل الوضع الداكن"
    }
  },
  
  sw: {
    // Header
    header: {
      welcome: "Elimu Bora Inayopatikana",
      welcomeSubtitle: "Kuwawezesha wanafunzi ulimwenguni kote",
      searchPlaceholder: "Tafuta masomo, vitabu na zaidi..."
    },
    
    // User
    user: {
      guest: "Mtumiaji Mgeni",
      role: "mgeni"
    },
    
    // Navigation
    nav: {
      dashboard: "Dashibodi",
      lessons: "Masomo",
      library: "Maktaba",
      adminPanel: "Paneli ya Msimamizi"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "Sasa Inapatikana kwa Lugha 9",
      title: "Jifunze vizuri zaidi na jukwaa lililoundwa kwa kila mwanafunzi",
      subtitle: "Elimu Bora Inayopatikana inatoa uzoefu wa kujifunza unaobinafsishwa kwa wanafunzi, walimu na wazazi.",
      adaptiveLessons: "Masomo Yanayobadilika",
      adaptiveLessonsDesc: "Yaliyoratibiwa kwa kiwango chako",
      offlineReady: "Tayari Bila Mtandao",
      offlineReadyDesc: "Endelea kujifunza popote",
      parentInsights: "Maarifa ya Wazazi",
      parentInsightsDesc: "Fuatilia maendeleo ya mtoto wako",
      progressTracking: "Ufuatiliaji wa Maendeleo",
      progressTrackingDesc: "Angalia mafanikio yako"
    },
    
    // Dashboard
    dashboard: {
      title: "Dashibodi",
      welcome: "Karibu tena!",
      lessonsCompleted: "Masomo Yaliyokamilika",
      booksRead: "Vitabu Vilivyosomwa",
      currentStreak: "Mfululizo wa Sasa",
      totalPoints: "Jumla ya Pointi",
      recentActivity: "Shughuli za Hivi Karibuni",
      upcomingLessons: "Masomo Yanayokuja",
      achievements: "Mafanikio",
      platformFeatures: "Vipengele vya Jukwaa",
      adaptiveLearning: "Ujifunzaji Unaobadilika",
      adaptiveLearningDesc: "Urekebishaji wa ugumu unaobinafsishwa",
      offlineSupport: "Msaada Bila Mtandao",
      offlineSupportDesc: "Jifunze bila muunganisho wa mtandao",
      smsLearning: "Ujifunzaji wa SMS",
      smsLearningDesc: "Jifunze kupitia ujumbe wa maandishi",
      aqeTitle: "Elimu Bora Inayopatikana",
      aqeDescription: "Elimu Bora Inayopatikana ni mlango wako wa uzoefu wa kujifunza unaobinafsishwa. Chagua jukumu lako katika kichupo cha 'Kuanza' ili kuanza safari yako ya elimu."
    },
    
    // Getting Started
    gettingStarted: {
      title: "Kuanza",
      step1: "Chagua Jukumu Lako & Ingia",
      step1Desc: "Chagua jukumu lako na ingia kwa kutumia mikono ya onyesho ili kufikia dashibodi yako binafsi",
      step2: "Fikia Maudhui",
      step2Desc: "Vinjari masomo, vitabu na nyenzo za mazoezi",
      step3: "Fuatilia Maendeleo",
      step3Desc: "Angalia safari yako ya kujifunza na mafanikio",
      login: "Ingia",
      changeAccount: "Badilisha Akaunti",
      logout: "Toka"
    },
    
    // Login Modal
    login: {
      title: "Chagua Jukumu Lako & Ingia",
      selectRole: "Chagua Jukumu Lako",
      loginCredentials: "Mikono ya Kuingia",
      email: "Barua Pepe",
      password: "Nywila",
      emailPlaceholder: "Ingiza barua pepe yako",
      passwordPlaceholder: "Ingiza nywila yako",
      passwordRequirement: "Nywila lazima iwe na angalau herufi 8",
      loginButton: "Ingia",
      cancel: "Ghairi",
      demoCredentials: "Mikono ya Akaunti ya Onyesho",
      student: "Mwanafunzi",
      teacher: "Mwalimu",
      parent: "Mzazi",
      admin: "Msimamizi",
      studentDesc: "Fikia masomo na fuatilia maendeleo",
      teacherDesc: "Unda kazi na usimamie wanafunzi",
      parentDesc: "Msaada ujifunzaji wa mtoto wako",
      adminDesc: "Simamia maudhui na mipangilio ya mfumo"
    },
    
    // User Menu
    userMenu: {
      profile: "Wasifu",
      settings: "Mipangilio",
      logout: "Toka",
      switchAccount: "Badilisha Akaunti"
    },
    
    // Common
    common: {
      loading: "Inapakia...",
      error: "Kosa",
      success: "Mafanikio",
      cancel: "Ghairi",
      save: "Hifadhi",
      edit: "Hariri",
      delete: "Futa",
      close: "Funga"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "Kwa Wanafunzi",
      forStudentsDesc: "Fikia masomo, fuatilia maendeleo na pata alama wakati wa kujifunza.",
      forTeachers: "Kwa Walimu",
      forTeachersDesc: "Unda kazi na usimamie maendeleo ya wanafunzi kwa ufanisi.",
      forParents: "Kwa Wazazi",
      forParentsDesc: "Saidia safari ya kujifunza ya mtoto wako kwa maarifa ya maendeleo.",
      forAdmins: "Kwa Wasimamizi",
      forAdminsDesc: "Simamia maudhui, watumiaji na mipangilio ya mfumo."
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Elimu Bora Inayopatikana",
      privacy: "Faragha",
      terms: "Masharti",
      support: "Msaada"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "Ingia",
      registerTab: "Jisajili",
      loginButton: "Ingia",
      registerButton: "Jisajili",
      loginAndRegistration: "Kuingia na Usajili",
      selectRoleToRegister: "Chagua Jukumu la Kujisajili",
      loginCredentials: "Mikono ya Kuingia"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "Rudi Mwanzoni",
      languageNotice: "Ukurasa huu kwa sasa unapatikana kwa Kiingereza. Tumia kichaguzi cha lugha hapo juu kubadilisha lugha ya kiolesura cha tovuti. Tafsiri kamili ya ukurasa itapatikana hivi karibuni katika lugha zote 9.",
      languageLabel: "Lugha:",
      darkModeToggle: "Badilisha Hali ya Giza"
    }
  },
  
  am: {
    // Header
    header: {
      welcome: "ተደራሽ ጥራት ያለው ትምህርት",
      welcomeSubtitle: "በዓለም ዙሪያ ተማሪዎችን ማብቃት",
      searchPlaceholder: "ትምህርቶችን፣ መጽሐፍትን እና ሌሎችንም ይፈልጉ..."
    },
    
    // User
    user: {
      guest: "እንግዳ ተጠቃሚ",
      role: "እንግዳ"
    },
    
    // Navigation
    nav: {
      dashboard: "ዳሽቦርድ",
      lessons: "ትምህርቶች",
      library: "ቤተ መጻሕፍት",
      adminPanel: "የአስተዳደር ፓነል"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "አሁን በ9 ቋንቋዎች ይገኛል",
      title: "ለእያንዳንዱ ተማሪ የተነደፈ መድረክ ጋር በተሻለ ሁኔታ ይማሩ",
      subtitle: "ተደራሽ ጥራት ያለው ትምህርት ለተማሪዎች፣ ለመምህራን እና ለወላጆች የተበጀ የመማሪያ ልምድ ይሰጣል።",
      adaptiveLessons: "መላመድ የሚችሉ ትምህርቶች",
      adaptiveLessonsDesc: "ለእርስዎ ደረጃ የተበጁ",
      offlineReady: "ከመስመር ውጭ ዝግጁ",
      offlineReadyDesc: "በየትኛውም ቦታ መማርን ይቀጥሉ",
      parentInsights: "የወላጅ ግንዛቤዎች",
      parentInsightsDesc: "የልጅዎን እድገት ይከታተሉ",
      progressTracking: "የእድገት ክትትል",
      progressTrackingDesc: "ስኬቶችዎን ይቆጣጠሩ"
    },
    
    // Dashboard
    dashboard: {
      title: "ዳሽቦርድ",
      welcome: "እንኳን ደህና መጡ!",
      lessonsCompleted: "የተጠናቀቁ ትምህርቶች",
      booksRead: "የተነበቡ መጽሐፍት",
      currentStreak: "የአሁኑ ተከታታይነት",
      totalPoints: "ጠቅላላ ነጥቦች",
      recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
      upcomingLessons: "የሚመጡ ትምህርቶች",
      achievements: "ስኬቶች",
      platformFeatures: "የመድረክ ባህሪያት",
      adaptiveLearning: "መላመድ የሚችል ትምህርት",
      adaptiveLearningDesc: "የተበጀ የችግር ማስተካከያ",
      offlineSupport: "ከመስመር ውጭ ድጋፍ",
      offlineSupportDesc: "ያለ የበይነመረብ ግንኙነት ይማሩ",
      smsLearning: "የኤስኤምኤስ ትምህርት",
      smsLearningDesc: "በጽሑፍ መልእክቶች በኩል ይማሩ",
      aqeTitle: "ተደራሽ ጥራት ያለው ትምህርት",
      aqeDescription: "ተደራሽ ጥራት ያለው ትምህርት ወደ የተበጀ የመማሪያ ልምድ የሚወስድዎ መግቢያ ነው። የትምህርት ጉዞዎን ለመጀመር በ'መጀመር' ትር ውስጥ ሚናዎን ይምረጡ።"
    },
    
    // Getting Started
    gettingStarted: {
      title: "መጀመር",
      step1: "ሚናዎን ይምረጡ እና ይግቡ",
      step1Desc: "ሚናዎን ይምረጡ እና ወደ የተበጀ ዳሽቦርድዎ ለመድረስ የማሳያ ማረጋገጫዎችን በመጠቀም ይግቡ",
      step2: "ይዘት ይድረሱ",
      step2Desc: "ትምህርቶችን፣ መጽሐፍትን እና የልምምድ ቁሳቁሶችን ያስሱ",
      step3: "እድገትን ይከታተሉ",
      step3Desc: "የመማሪያ ጉዞዎን እና ስኬቶችዎን ይቆጣጠሩ",
      login: "ግባ",
      changeAccount: "መለያ ቀይር",
      logout: "ውጣ"
    },
    
    // Login Modal
    login: {
      title: "ሚናዎን ይምረጡ እና ይግቡ",
      selectRole: "ሚናዎን ይምረጡ",
      loginCredentials: "የመግቢያ ማረጋገጫዎች",
      email: "ኢሜል",
      password: "የይለፍ ቃል",
      emailPlaceholder: "ኢሜልዎን ያስገቡ",
      passwordPlaceholder: "የይለፍ ቃልዎን ያስገቡ",
      passwordRequirement: "የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት",
      loginButton: "ግባ",
      cancel: "ሰርዝ",
      demoCredentials: "የማሳያ መለያ ማረጋገጫዎች",
      student: "ተማሪ",
      teacher: "መምህር",
      parent: "ወላጅ",
      admin: "አስተዳዳሪ",
      studentDesc: "ትምህርቶችን ይድረሱ እና እድገትን ይከታተሉ",
      teacherDesc: "ተግባራትን ይፍጠሩ እና ተማሪዎችን ይቆጣጠሩ",
      parentDesc: "የልጅዎን ትምህርት ይደግፉ",
      adminDesc: "ይዘትን እና የስርዓት ቅንብሮችን ያስተዳድሩ"
    },
    
    // User Menu
    userMenu: {
      profile: "መገለጫ",
      settings: "ቅንብሮች",
      logout: "ውጣ",
      switchAccount: "መለያ ቀይር"
    },
    
    // Common
    common: {
      loading: "በመጫን ላይ...",
      error: "ስህተት",
      success: "ስኬት",
      cancel: "ሰርዝ",
      save: "አስቀምጥ",
      edit: "አርትዕ",
      delete: "ሰርዝ",
      close: "ዝጋ"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "ለተማሪዎች",
      forStudentsDesc: "ትምህርቶችን ይድረሱ፣ እድገትን ይከታተሉ እና በሚማሩበት ጊዜ ባጆችን ያግኙ።",
      forTeachers: "ለመምህራን",
      forTeachersDesc: "ተግባራትን ይፍጠሩ እና የተማሪዎችን እድገት በብቃት ይቆጣጠሩ።",
      forParents: "ለወላጆች",
      forParentsDesc: "የልጅዎን የመማሪያ ጉዞ በእድገት ግንዛቤዎች ይደግፉ።",
      forAdmins: "ለአስተዳዳሪዎች",
      forAdminsDesc: "ይዘትን፣ ተጠቃሚዎችን እና የስርዓት ቅንብሮችን ያስተዳድሩ።"
    },
    
    // Footer
    footer: {
      copyright: "© 2025 ተደራሽ ጥራት ያለው ትምህርት",
      privacy: "ግላዊነት",
      terms: "ውሎች",
      support: "ድጋፍ"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "ግባ",
      registerTab: "ተመዝገብ",
      loginButton: "ግባ",
      registerButton: "ተመዝገብ",
      loginAndRegistration: "መግባት እና ምዝገባ",
      selectRoleToRegister: "ለመመዝገብ ሚና ይምረጡ",
      loginCredentials: "የመግቢያ ማረጋገጫዎች"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "ወደ መነሻ ይመለሱ",
      languageNotice: "ይህ ገጽ በአሁኑ ጊዜ በእንግሊዝኛ ይገኛል። የጣቢያውን በይነገጽ ቋንቋ ለመቀየር ከላይ ያለውን የቋንቋ መራጭ ይጠቀሙ። ሙሉ የገጽ ትርጉም በቅርቡ በሁሉም 9 ቋንቋዎች ይገኛል።",
      languageLabel: "ቋንቋ:",
      darkModeToggle: "ጨለማ ሁነታን ቀይር"
    }
  },
  
  zu: {
    // Header
    header: {
      welcome: "Imfundo Efinyelelekayo Esezingeni Eliphezulu",
      welcomeSubtitle: "Ukwandisa amandla abafundi emhlabeni wonke",
      searchPlaceholder: "Sesha izifundo, izincwadi nokunye..."
    },
    
    // User
    user: {
      guest: "Umsebenzisi Oyisivakashi",
      role: "isivakashi"
    },
    
    // Navigation
    nav: {
      dashboard: "Ideshibhodi",
      lessons: "Izifundo",
      library: "Umtapo Wezincwadi",
      adminPanel: "Iphaneli Yokuphatha"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "Manje Iyatholakala Ngezilimi Ezingu-9",
      title: "Funda kangcono ngenkundla eyenzelwe umfundi ngamunye",
      subtitle: "Imfundo Efinyelelekayo Esezingeni Eliphezulu inikeza ulwazi lokufunda olwenzelwe wena kubafundi, othisha nabazali.",
      adaptiveLessons: "Izifundo Eziguquguqukayo",
      adaptiveLessonsDesc: "Zilungiselelwe izinga lakho",
      offlineReady: "Kulungele Ukusebenza Ngaphandle Kwe-intanethi",
      offlineReadyDesc: "Qhubeka ufunda noma ngabe ukuphi",
      parentInsights: "Ukuqonda Kwabazali",
      parentInsightsDesc: "Landelela intuthuko yengane yakho",
      progressTracking: "Ukulandelela Intuthuko",
      progressTrackingDesc: "Buka impumelelo zakho"
    },
    
    // Dashboard
    dashboard: {
      title: "Ideshibhodi",
      welcome: "Sawubona futhi!",
      lessonsCompleted: "Izifundo Eziqediwe",
      booksRead: "Izincwadi Ezifundiwe",
      currentStreak: "Uchungechunge Lwamanje",
      totalPoints: "Amaphuzu Onke",
      recentActivity: "Umsebenzi Wakamuva",
      upcomingLessons: "Izifundo Ezizayo",
      achievements: "Impumelelo",
      platformFeatures: "Izici Zenkundla",
      adaptiveLearning: "Ukufunda Okuguquguqukayo",
      adaptiveLearningDesc: "Ukulungiswa kobunzima okwenzelwe wena",
      offlineSupport: "Ukusekela Ngaphandle Kwe-intanethi",
      offlineSupportDesc: "Funda ngaphandle koxhumo lwe-intanethi",
      smsLearning: "Ukufunda Nge-SMS",
      smsLearningDesc: "Funda ngemilayezo yombhalo",
      aqeTitle: "Imfundo Efinyelelekayo Esezingeni Eliphezulu",
      aqeDescription: "Imfundo Efinyelelekayo Esezingeni Eliphezulu iyisango lakho lokuya kulwazi lokufunda olwenzelwe wena. Khetha indima yakho ethebhini elithi 'Ukuqala' ukuze uqale uhambo lwakho lwemfundo."
    },
    
    // Getting Started
    gettingStarted: {
      title: "Ukuqala",
      step1: "Khetha Indima Yakho & Ngena Ngemvume",
      step1Desc: "Khetha indima yakho bese ungena ngemvume ngokusebenzisa iziqu zokubonisa ukuze ufinyelele ideshibhodi yakho",
      step2: "Finyelela Okuqukethwe",
      step2Desc: "Bheka izifundo, izincwadi nezinto zokuzilolonga",
      step3: "Landelela Intuthuko",
      step3Desc: "Buka uhambo lwakho lokufunda nempumelelo",
      login: "Ngena Ngemvume",
      changeAccount: "Shintsha I-akhawunti",
      logout: "Phuma"
    },
    
    // Login Modal
    login: {
      title: "Khetha Indima Yakho & Ngena Ngemvume",
      selectRole: "Khetha Indima Yakho",
      loginCredentials: "Iziqu Zokungenisa",
      email: "I-imeyili",
      password: "Iphasiwedi",
      emailPlaceholder: "Faka i-imeyili yakho",
      passwordPlaceholder: "Faka iphasiwedi yakho",
      passwordRequirement: "Iphasiwedi kufanele ibe nezinhlamvu okungenani ezingu-8",
      loginButton: "Ngena Ngemvume",
      cancel: "Khansela",
      demoCredentials: "Iziqu Ze-akhawunti Yokubonisa",
      student: "Umfundi",
      teacher: "Uthisha",
      parent: "Umzali",
      admin: "Umphathi",
      studentDesc: "Finyelela izifundo bese ulandelela intuthuko",
      teacherDesc: "Dala izabelo bese ubuka abafundi",
      parentDesc: "Sekela ukufunda kwengane yakho",
      adminDesc: "Phatha okuqukethwe nezilungiselelo zohlelo"
    },
    
    // User Menu
    userMenu: {
      profile: "Iphrofayili",
      settings: "Izilungiselelo",
      logout: "Phuma",
      switchAccount: "Shintsha I-akhawunti"
    },
    
    // Common
    common: {
      loading: "Iyalayisha...",
      error: "Iphutha",
      success: "Impumelelo",
      cancel: "Khansela",
      save: "Gcina",
      edit: "Hlela",
      delete: "Susa",
      close: "Vala"
    },
    
    // Role Cards
    roleCards: {
      forStudents: "Kubafundi",
      forStudentsDesc: "Finyelela izifundo, landelela intuthuko futhi uzuze izitembu njengoba ufunda.",
      forTeachers: "Kothisha",
      forTeachersDesc: "Dala izabelo bese ulandelela intuthuko yabafundi ngempumelelo.",
      forParents: "Kubazali",
      forParentsDesc: "Sekela uhambo lokufunda lwengane yakho ngolwazi lweqophelo.",
      forAdmins: "Kubaphathi",
      forAdminsDesc: "Phatha okuqukethwe, abasebenzisi nezilungiselelo zohlelo."
    },
    
    // Footer
    footer: {
      copyright: "© 2025 Imfundo Efinyelelekayo Esezingeni Eliphezulu",
      privacy: "Ubumfihlo",
      terms: "Imibandela",
      support: "Ukusekela"
    },
    
    // Auth Modal
    authModal: {
      loginTab: "Ngena Ngemvume",
      registerTab: "Bhalisa",
      loginButton: "Ngena Ngemvume",
      registerButton: "Bhalisa",
      loginAndRegistration: "Ukungena Ngemvume Nokubhalisa",
      selectRoleToRegister: "Khetha Indima Yokubhalisa",
      loginCredentials: "Imininingwane Yokungena"
    },
    
    // Policy Pages
    policyPages: {
      backToHome: "Buyela Ekhaya",
      languageNotice: "Leli khasi manje litholakala ngesiNgisi. Sebenzisa isikhetheli solimi esiphezulu ukuze ushintshe ulimi lwesixhumi sewebhusayithi. Ukuhunyushwa kwekhas eliphelele kuzotholakala maduze ezilimini zonke ezi-9.",
      languageLabel: "Ulimi:",
      darkModeToggle: "Guqula Imodi Emnyama"
    }
  }
};

// Translation Manager Class
class TranslationManager {
  constructor() {
    // Check multiple localStorage keys for backwards compatibility
    this.currentLanguage = localStorage.getItem('aqe_language') || 
                          localStorage.getItem('preferredLanguage') || 
                          localStorage.getItem('language') || 
                          'en';
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLanguage);
    this.setupLanguageSelector();
  }

  // Get translation for a key
  t(key, fallback = '') {
    const keys = key.split('.');
    let value = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return value || fallback || key;
  }

  // Change language
  changeLanguage(languageCode) {
    if (translations[languageCode]) {
      this.currentLanguage = languageCode;
      // Store in multiple keys for compatibility with different parts of the app
      localStorage.setItem('aqe_language', languageCode);
      localStorage.setItem('preferredLanguage', languageCode);
      localStorage.setItem('language', languageCode);
      this.applyLanguage(languageCode);
      
      // Update language selector
      const selector = document.querySelector('.language-selector select');
      if (selector) {
        selector.value = languageCode;
      }
      
      // Notify other components
      document.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: languageCode } 
      }));
    }
  }

  // Apply language to all elements
  applyLanguage(languageCode) {
    this.currentLanguage = languageCode;
    
    // Update all elements with data-translate attributes
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      const category = element.getAttribute('data-translate');
      
      if (key && category) {
        const translation = this.t(`${category}.${key}`);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          if (element.type === 'text' || element.type === 'email' || element.type === 'password' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
          }
        } else if (element.tagName === 'BUTTON') {
          // Preserve icons in buttons
          const icons = element.querySelectorAll('i');
          element.textContent = translation;
          icons.forEach(icon => element.prepend(icon));
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update specific elements by ID
    this.updateSpecificElements();
    
    // Force update of dynamic content
    this.updateAllDynamicContent();
  }
  
  // Update all dynamic content that may have been added after page load
  updateAllDynamicContent() {
    // This will be called after any dynamic content is loaded
    // Ensures translations apply to modals, alerts, and dynamically generated elements
    setTimeout(() => {
      this.updateSpecificElements();
    }, 100);
  }

  // Update specific elements that need special handling
  updateSpecificElements() {
    // Update hero badge
    const heroBadge = document.querySelector('.hero-badge .badge');
    if (heroBadge) {
      const textNode = heroBadge.childNodes[1]; // Get text node after status indicator
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = this.t('hero.languagesBadge');
      }
    }

    // Update hero title and subtitle
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.textContent = this.t('hero.title');
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      heroSubtitle.textContent = this.t('hero.subtitle');
    }

    // Update feature cards
    this.updateFeatureCards();

    // Update getting started section
    this.updateGettingStarted();

    // Update login modal
    this.updateLoginModal();

    // Update navigation
    this.updateNavigation();

    // Update user menu
    this.updateUserMenu();

    // Update dashboard elements
    this.updateDashboardElements();
    
    // Update role cards
    this.updateRoleCardsAtBottom();
    
    // Update footer
    this.updateFooter();
    
    // Update auth modal
    this.updateAuthModal();
  }

  // Update role cards at bottom of page
  updateRoleCardsAtBottom() {
    // These will be updated automatically by data-translate attributes
    // But we can force update if needed
  }
  
  // Update footer
  updateFooter() {
    // These will be updated automatically by data-translate attributes
  }
  
  // Update auth modal
  updateAuthModal() {
    // These will be updated automatically by data-translate attributes
  }

  // Update feature cards
  updateFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    const features = [
      { title: 'hero.adaptiveLessons', desc: 'hero.adaptiveLessonsDesc' },
      { title: 'hero.offlineReady', desc: 'hero.offlineReadyDesc' },
      { title: 'hero.parentInsights', desc: 'hero.parentInsightsDesc' },
      { title: 'hero.progressTracking', desc: 'hero.progressTrackingDesc' }
    ];

    featureCards.forEach((card, index) => {
      if (features[index]) {
        const title = card.querySelector('h6');
        const desc = card.querySelector('p');
        
        if (title) title.textContent = this.t(features[index].title);
        if (desc) desc.textContent = this.t(features[index].desc);
      }
    });
  }

  // Update getting started section
  updateGettingStarted() {
    const gettingStartedTitle = document.querySelector('.card-title-modern');
    if (gettingStartedTitle) {
      gettingStartedTitle.textContent = this.t('gettingStarted.title');
    }

    const stepItems = document.querySelectorAll('.step-item');
    const steps = [
      { title: 'gettingStarted.step1', desc: 'gettingStarted.step1Desc' },
      { title: 'gettingStarted.step2', desc: 'gettingStarted.step2Desc' },
      { title: 'gettingStarted.step3', desc: 'gettingStarted.step3Desc' }
    ];

    stepItems.forEach((item, index) => {
      if (steps[index]) {
        const title = item.querySelector('h6');
        const desc = item.querySelector('p');
        
        if (title) title.textContent = this.t(steps[index].title);
        if (desc) desc.textContent = this.t(steps[index].desc);
      }
    });
  }

  // Update login modal
  updateLoginModal() {
    const loginModalTitle = document.querySelector('#loginModalLabel');
    if (loginModalTitle) {
      loginModalTitle.innerHTML = `<i class="bi bi-person-plus me-2"></i>${this.t('login.title')}`;
    }

    const selectRoleTitle = document.querySelector('#loginModal h6');
    if (selectRoleTitle) {
      selectRoleTitle.textContent = this.t('login.selectRole');
    }

    const loginCredentialsTitle = document.querySelector('#loginModal .col-md-6:last-child h6');
    if (loginCredentialsTitle) {
      loginCredentialsTitle.textContent = this.t('login.loginCredentials');
    }

    // Update form labels and placeholders
    const emailLabel = document.querySelector('label[for="loginEmail"]');
    if (emailLabel) emailLabel.textContent = this.t('login.email');

    const passwordLabel = document.querySelector('label[for="loginPassword"]');
    if (passwordLabel) passwordLabel.textContent = this.t('login.password');

    const emailInput = document.querySelector('#loginEmail');
    if (emailInput) emailInput.placeholder = this.t('login.emailPlaceholder');

    const passwordInput = document.querySelector('#loginPassword');
    if (passwordInput) passwordInput.placeholder = this.t('login.passwordPlaceholder');

    const passwordHelp = document.querySelector('#loginPassword + .form-text');
    if (passwordHelp) passwordHelp.textContent = this.t('login.passwordRequirement');

    const loginButton = document.querySelector('#loginBtn');
    if (loginButton) {
      loginButton.innerHTML = `<i class="bi bi-box-arrow-in-right me-2"></i>${this.t('login.loginButton')}`;
    }

    const cancelButton = document.querySelector('#loginModal .btn-secondary');
    if (cancelButton) cancelButton.textContent = this.t('login.cancel');

    const demoCredentialsTitle = document.querySelector('.demo-credentials h6');
    if (demoCredentialsTitle) demoCredentialsTitle.textContent = this.t('login.demoCredentials');

    // Update role cards
    this.updateRoleCards();
  }

  // Update role cards
  updateRoleCards() {
    const roleCards = document.querySelectorAll('.role-option-card-small');
    const roles = [
      { title: 'login.student', desc: 'login.studentDesc' },
      { title: 'login.teacher', desc: 'login.teacherDesc' },
      { title: 'login.parent', desc: 'login.parentDesc' },
      { title: 'login.admin', desc: 'login.adminDesc' }
    ];

    roleCards.forEach((card, index) => {
      if (roles[index]) {
        const title = card.querySelector('h6');
        const desc = card.querySelector('p');
        
        if (title) title.textContent = this.t(roles[index].title);
        if (desc) desc.textContent = this.t(roles[index].desc);
      }
    });
  }

  // Update navigation
  updateNavigation() {
    const navItems = document.querySelectorAll('.nav-link');
    const navTexts = ['nav.dashboard', 'nav.lessons', 'nav.library', 'nav.adminPanel'];

    navItems.forEach((item, index) => {
      if (navTexts[index]) {
        item.textContent = this.t(navTexts[index]);
      }
    });

    // Update mobile navigation
    const mobileNavItems = document.querySelectorAll('.mobile-nav-btn');
    mobileNavItems.forEach((item, index) => {
      if (navTexts[index]) {
        const textNode = item.childNodes[1]; // Get text node after icon
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          textNode.textContent = this.t(navTexts[index]);
        }
      }
    });
  }

  // Update user menu
  updateUserMenu() {
    const userMenuItems = document.querySelectorAll('.user-menu .dropdown-item');
    const menuTexts = ['userMenu.profile', 'userMenu.settings', 'userMenu.logout'];

    userMenuItems.forEach((item, index) => {
      if (menuTexts[index]) {
        const textNode = item.childNodes[1]; // Get text node after icon
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          textNode.textContent = this.t(menuTexts[index]);
        }
      }
    });
  }

  // Update dashboard elements
  updateDashboardElements() {
    // Update platform features section
    const platformFeaturesTitle = document.querySelector('[data-translate-key="platformFeatures"]');
    if (platformFeaturesTitle) {
      platformFeaturesTitle.textContent = this.t('dashboard.platformFeatures');
    }

    // Update AQE section
    const aqeTitle = document.querySelector('[data-translate-key="aqeTitle"]');
    if (aqeTitle) {
      aqeTitle.textContent = this.t('dashboard.aqeTitle');
    }

    const aqeDescription = document.querySelector('[data-translate-key="aqeDescription"]');
    if (aqeDescription) {
      aqeDescription.textContent = this.t('dashboard.aqeDescription');
    }
  }

  // Setup language selector
  setupLanguageSelector() {
    // Setup both desktop and mobile selectors
    const desktopSelector = document.getElementById('languageSelect');
    const mobileSelector = document.getElementById('mobileLanguageSelect');
    
    if (desktopSelector) {
      desktopSelector.value = this.currentLanguage;
      desktopSelector.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }
    
    if (mobileSelector) {
      mobileSelector.value = this.currentLanguage;
      mobileSelector.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }
    
    // Fallback for any other language selector with class
    const otherSelectors = document.querySelectorAll('.language-selector select:not(#languageSelect):not(#mobileLanguageSelect)');
    otherSelectors.forEach(selector => {
      selector.value = this.currentLanguage;
      selector.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    });
  }
}

// Initialize translation manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTranslations);
} else {
  // DOM is already loaded
  initTranslations();
}

function initTranslations() {
  if (!window.translationManager) {
    window.translationManager = new TranslationManager();
    window.AQETranslations = window.translationManager; // Expose as AQETranslations for compatibility
    
    // Expose setLanguage method globally
    window.AQETranslations.setLanguage = function(lang) {
      this.changeLanguage(lang);
    };
  }
}

// Global function for language change
function changeLanguage(languageCode) {
  if (window.translationManager) {
    window.translationManager.changeLanguage(languageCode);
  } else if (window.AQETranslations) {
    window.AQETranslations.changeLanguage(languageCode);
  }
}
