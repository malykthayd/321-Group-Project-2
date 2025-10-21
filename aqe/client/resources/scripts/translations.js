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
      adminPanel: "Admin Panel"
    },
    
    // Hero Section
    hero: {
      languagesBadge: "Now Available in 6 Languages",
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
      languagesBadge: "Ahora Disponible en 6 Idiomas",
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
      languagesBadge: "Maintenant Disponible en 6 Langues",
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
      languagesBadge: "Jetzt in 6 Sprachen verfügbar",
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
      languagesBadge: "现已支持6种语言",
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
      aqeDescription: "无障碍优质教育是您通往个性化学习体验的门户。在"开始使用"选项卡中选择您的角色，开始您的教育之旅。"
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
      languagesBadge: "متاح الآن بـ 6 لغات",
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
    }
  }
};

// Translation Manager Class
class TranslationManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('aqe_language') || 'en';
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
      localStorage.setItem('aqe_language', languageCode);
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
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update specific elements by ID
    this.updateSpecificElements();
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
    const selector = document.querySelector('.language-selector select');
    if (selector) {
      selector.value = this.currentLanguage;
      selector.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }
  }
}

// Initialize translation manager
window.translationManager = new TranslationManager();

// Global function for language change
function changeLanguage(languageCode) {
  if (window.translationManager) {
    window.translationManager.changeLanguage(languageCode);
  }
}
