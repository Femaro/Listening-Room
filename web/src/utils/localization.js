// Comprehensive localization system for CLAEVA INTERNATIONAL LLC

export const SUPPORTED_LANGUAGES = {
  en: { name: "English", nativeName: "English", flag: "🇺🇸" },
  es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  fr: { name: "French", nativeName: "Français", flag: "🇫🇷" },
  de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  pt: { name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  ar: { name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  zh: { name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  sw: { name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  yo: { name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
  ha: { name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  ig: { name: "Igbo", nativeName: "Igbo", flag: "🇳🇬" },
  af: { name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
  am: { name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
};

export const COUNTRY_LANGUAGES = {
  US: ["en", "es"],
  GB: ["en"],
  CA: ["en", "fr"],
  AU: ["en"],
  NG: ["en", "yo", "ha", "ig"],
  KE: ["en", "sw"],
  GH: ["en"],
  ZA: ["en", "af"],
  ET: ["am", "en"],
  DE: ["de"],
  FR: ["fr"],
  ES: ["es"],
  PT: ["pt"],
  SA: ["ar"],
  CN: ["zh"],
  IN: ["hi", "en"],
  BR: ["pt"],
  MX: ["es"],
  AR: ["es"],
  EG: ["ar"],
  MA: ["ar", "fr"],
};

export const TRANSLATIONS = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.volunteer": "Volunteer",
    "nav.donate": "Donate",
    "nav.training": "Training",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.signIn": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.signOut": "Sign Out",
    "nav.backToHome": "Back to Home",

    // Company
    "company.name": "CLAEVA INTERNATIONAL LLC",
    "company.tagline": "Global Mental Health Support",
    "company.description":
      "Supporting mental wellness across all communities worldwide",

    // Homepage
    "hero.title": "Connect Instantly with Trained Mental Health Volunteers",
    "hero.subtitle":
      "Free, anonymous support available 24/7 across 40+ countries. No judgment, complete privacy.",
    "hero.startChat": "Start Free Chat",
    "hero.findVolunteer": "Finding volunteer...",
    "hero.selectLocation": "Select your location",
    "hero.globalAccess": "Global Access",

    // Features
    "features.title": "Global Access to Mental Health",
    "features.subtitle":
      "Connecting people across continents with culturally-aware support",
    "features.countries": "40+ Countries",
    "features.languages": "25+ Languages",
    "features.specialized": "Specialized Support",
    "features.coverage": "24/7 Coverage",
    "features.volunteers": "volunteers available",

    // Volunteer Categories
    "categories.motivationalSpeaker": "Motivational Speaker",
    "categories.corporateExperience": "Corporate Experience",
    "categories.maritalAdvisor": "Marital Advisor",
    "categories.lifeCoach": "Life and Career Coach",
    "categories.sexCoach": "Sex and Intimacy Coach",
    "categories.voicePal": "Voice Pal",
    "categories.businessStrategies": "Business Strategies Advisor",
    "categories.abuseTherapist": "Physical and Emotional Abuse Therapist",
    "categories.lawAdvisor": "Law and Arbitrator Advisor",
    "categories.conflictResolution": "Conflict and Resolution Specialist",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.seekerTitle": "Dashboard",
    "dashboard.volunteerTitle": "Volunteer Dashboard",
    "dashboard.quickConnect": "Quick Connect",
    "dashboard.startFreeChat": "Start Free Chat",
    "dashboard.settings": "Settings",
    "dashboard.preferences": "Preferences & Settings",
    "dashboard.specializations": "Your Specializations",
    "dashboard.chooseSupport": "Choose Your Support Type",

    // Session
    "session.active": "Active Session",
    "session.voiceCall": "Voice Call",
    "session.continueChat": "Continue Chat",
    "session.endSession": "End Session",
    "session.freeMinutes": "First 5 minutes are completely free",

    // Donation
    "donate.title": "Support Global Mental Health Conversations",
    "donate.subtitle":
      "Your donation helps provide free, anonymous mental health support to those who need it most.",
    "donate.selectCurrency": "Select Currency",
    "donate.selectAmount": "Select Amount",
    "donate.customAmount": "Enter custom amount",
    "donate.anonymous": "Donate anonymously",
    "donate.yourName": "Your Name",
    "donate.email": "Email Address",
    "donate.message": "Message (Optional)",
    "donate.impact": "Your Impact",

    // Crisis
    "crisis.title": "Crisis Resources",
    "crisis.emergency":
      "If you are in immediate danger, please contact emergency services",
    "crisis.support": "Crisis Support Available 24/7",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.continue": "Continue",
    "common.back": "Back",
    "common.next": "Next",
    "common.location": "Location",
    "common.language": "Language",
    "common.currency": "Currency",
  },

  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.dashboard": "Panel",
    "nav.volunteer": "Voluntario",
    "nav.donate": "Donar",
    "nav.training": "Capacitación",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    "nav.signIn": "Iniciar Sesión",
    "nav.signUp": "Registrarse",
    "nav.signOut": "Cerrar Sesión",
    "nav.backToHome": "Volver al Inicio",

    // Company
    "company.name": "CLAEVA INTERNATIONAL LLC",
    "company.tagline": "Apoyo Global de Salud Mental",
    "company.description":
      "Apoyando el bienestar mental en todas las comunidades del mundo",

    // Homepage
    "hero.title":
      "Conéctate Instantáneamente con Voluntarios de Salud Mental Capacitados",
    "hero.subtitle":
      "Apoyo gratuito y anónimo disponible 24/7 en más de 40 países. Sin juicios, privacidad completa.",
    "hero.startChat": "Iniciar Chat Gratis",
    "hero.findVolunteer": "Buscando voluntario...",
    "hero.selectLocation": "Selecciona tu ubicación",
    "hero.globalAccess": "Acceso Global",

    // Features
    "features.title": "Acceso Global a la Salud Mental",
    "features.subtitle":
      "Conectando personas a través de continentes con apoyo culturalmente consciente",
    "features.countries": "Más de 40 Países",
    "features.languages": "Más de 25 Idiomas",
    "features.specialized": "Apoyo Especializado",
    "features.coverage": "Cobertura 24/7",
    "features.volunteers": "voluntarios disponibles",

    // Dashboard
    "dashboard.welcome": "Bienvenido de vuelta",
    "dashboard.seekerTitle": "Panel de Control",
    "dashboard.volunteerTitle": "Panel del Voluntario",
    "dashboard.quickConnect": "Conexión Rápida",
    "dashboard.startFreeChat": "Iniciar Chat Gratis",
    "dashboard.settings": "Configuración",
    "dashboard.preferences": "Preferencias y Configuración",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.continue": "Continuar",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.location": "Ubicación",
    "common.language": "Idioma",
    "common.currency": "Moneda",
  },

  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.dashboard": "Tableau de bord",
    "nav.volunteer": "Bénévole",
    "nav.donate": "Faire un don",
    "nav.training": "Formation",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.signIn": "Se connecter",
    "nav.signUp": "S'inscrire",
    "nav.signOut": "Se déconnecter",
    "nav.backToHome": "Retour à l'accueil",

    // Company
    "company.name": "CLAEVA INTERNATIONAL LLC",
    "company.tagline": "Soutien Global de Santé Mentale",
    "company.description":
      "Soutenir le bien-être mental dans toutes les communautés du monde",

    // Homepage
    "hero.title":
      "Connectez-vous Instantanément avec des Bénévoles de Santé Mentale Formés",
    "hero.subtitle":
      "Soutien gratuit et anonyme disponible 24h/24 et 7j/7 dans plus de 40 pays. Aucun jugement, confidentialité totale.",
    "hero.startChat": "Commencer un Chat Gratuit",
    "hero.findVolunteer": "Recherche de bénévole...",
    "hero.selectLocation": "Sélectionnez votre emplacement",
    "hero.globalAccess": "Accès Mondial",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.cancel": "Annuler",
    "common.save": "Sauvegarder",
    "common.continue": "Continuer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.location": "Emplacement",
    "common.language": "Langue",
    "common.currency": "Devise",
  },

  // Add more languages as needed...
  sw: {
    // Swahili translations
    "nav.home": "Nyumbani",
    "nav.dashboard": "Dashibodi",
    "nav.volunteer": "Kujitolea",
    "nav.donate": "Changia",
    "company.name": "CLAEVA INTERNATIONAL LLC",
    "company.tagline": "Msaada wa Afya ya Akili Duniani",
    "hero.title": "Unganishwa Mara Moja na Wataalam wa Afya ya Akili",
    "hero.subtitle":
      "Msaada wa bure, wa siri unapatikana saa 24/7 katika nchi zaidi ya 40.",
    "hero.startChat": "Anza Mazungumzo ya Bure",
    "common.loading": "Inapakia...",
    "common.language": "Lugha",
    "common.location": "Mahali",
  },

  ar: {
    // Arabic translations (RTL)
    "nav.home": "الرئيسية",
    "nav.dashboard": "لوحة التحكم",
    "nav.volunteer": "متطوع",
    "nav.donate": "تبرع",
    "company.name": "CLAEVA INTERNATIONAL LLC",
    "company.tagline": "الدعم العالمي للصحة النفسية",
    "hero.title": "تواصل فوراً مع متطوعين مدربين للصحة النفسية",
    "hero.subtitle":
      "دعم مجاني ومجهول متاح على مدار الساعة في أكثر من 40 دولة.",
    "hero.startChat": "ابدأ محادثة مجانية",
    "common.loading": "جاري التحميل...",
    "common.language": "اللغة",
    "common.location": "الموقع",
  },

  yo: {
    // Yoruba translations
    "nav.home": "Ile",
    "nav.dashboard": "Pẹpẹ",
    "nav.volunteer": "Atilẹyin",
    "nav.donate": "Funni",
    "company.name": "CLAEVA INTERNATIONAL LLC",
    "company.tagline": "Atilẹyin Ilera Ọpọlọ Agbaye",
    "hero.title": "Sopọ Lẹsẹkẹsẹ Pẹlu Awọn Atilẹyin Ilera Ọpọlọ Ti A Kọ",
    "hero.subtitle":
      "Atilẹyin ọfẹ ati aladani wa ni wakati 24/7 ni awọn orilẹ-ede to ju 40 lọ.",
    "hero.startChat": "Bẹrẹ Ibaraẹnisọrọ Ọfẹ",
    "common.loading": "N gbe...",
    "common.language": "Ede",
    "common.location": "Ipo",
  },
};

export function getLanguageFromCountry(countryCode) {
  const languages = COUNTRY_LANGUAGES[countryCode];
  return languages ? languages[0] : "en";
}

export function getAvailableLanguagesForCountry(countryCode) {
  return COUNTRY_LANGUAGES[countryCode] || ["en"];
}

export function translateText(key, language = "en", fallback = key) {
  const translations = TRANSLATIONS[language];
  if (!translations) {
    return TRANSLATIONS["en"][key] || fallback;
  }
  return translations[key] || TRANSLATIONS["en"][key] || fallback;
}

export function isRTLLanguage(language) {
  return ["ar"].includes(language);
}

export function getLanguageDirection(language) {
  return isRTLLanguage(language) ? "rtl" : "ltr";
}

// Content moderation - blacklisted words in multiple languages
export const BLACKLISTED_WORDS = {
  en: [
    "kill",
    "murder",
    "suicide",
    "harm yourself",
    "hurt yourself",
    "die",
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "damn",
    "hell",
    "drugs",
    "cocaine",
    "heroin",
    "meth",
    "weed",
    "violence",
    "weapon",
    "gun",
    "knife",
    "bomb",
    "rape",
    "abuse",
    "molest",
    "assault",
    "terrorist",
    "extremist",
    "radical",
  ],
  es: [
    "matar",
    "asesinar",
    "suicidio",
    "hacerte daño",
    "lastimarte",
    "morir",
    "joder",
    "mierda",
    "puta",
    "cabrón",
    "maldito",
    "drogas",
    "cocaína",
    "heroína",
    "marihuana",
    "violencia",
    "arma",
    "pistola",
    "cuchillo",
    "bomba",
    "violación",
    "abuso",
    "agredir",
    "terrorista",
    "extremista",
    "radical",
  ],
  fr: [
    "tuer",
    "assassiner",
    "suicide",
    "te faire du mal",
    "te blesser",
    "mourir",
    "putain",
    "merde",
    "salope",
    "connard",
    "foutu",
    "drogues",
    "cocaïne",
    "héroïne",
    "cannabis",
    "violence",
    "arme",
    "pistolet",
    "couteau",
    "bombe",
    "viol",
    "abus",
    "agresser",
    "terroriste",
    "extrémiste",
    "radical",
  ],
  yo: [
    "pa",
    "pana",
    "ku",
    "gbe ara e",
    "se ara e nii",
    "ogun",
    "ibon",
    "ọbe",
    "bombu",
    "ipani",
    "ibanilopo",
    "abirun",
    "onijagidijagan",
    "elewon",
  ],
  ar: [
    "قتل",
    "قاتل",
    "انتحار",
    "إيذاء النفس",
    "تضر نفسك",
    "موت",
    "عنف",
    "سلاح",
    "مسدس",
    "سكين",
    "قنبلة",
    "اغتصاب",
    "إساءة",
    "اعتداء",
    "إرهابي",
    "متطرف",
  ],
  sw: [
    "ua",
    "uaji",
    "kujisaidia",
    "kujidhuru",
    "kujidhuru",
    "kufa",
    "jenga",
    "bunduki",
    "kisu",
    "bomu",
    "ubakaji",
    "ukatili",
    "shambulio",
    "mgaidi",
    "mkali",
  ],
};

export function moderateContent(text, language = "en") {
  const blacklistedWords =
    BLACKLISTED_WORDS[language] || BLACKLISTED_WORDS["en"];
  const lowerText = text.toLowerCase();

  for (const word of blacklistedWords) {
    if (lowerText.includes(word.toLowerCase())) {
      return {
        flagged: true,
        reason: "contains_inappropriate_content",
        word: word,
        message: translateText(
          "moderation.flagged",
          language,
          "This message contains inappropriate content and has been flagged for review.",
        ),
      };
    }
  }

  return { flagged: false };
}

export default {
  SUPPORTED_LANGUAGES,
  COUNTRY_LANGUAGES,
  TRANSLATIONS,
  getLanguageFromCountry,
  getAvailableLanguagesForCountry,
  translateText,
  isRTLLanguage,
  getLanguageDirection,
  BLACKLISTED_WORDS,
  moderateContent,
};
