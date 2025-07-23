import { createContext, useContext, useState, useEffect } from "react";

type Language = "fr" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.providers": "Prestataires",
    "nav.club_pro": "Club Pro",
    "nav.project": "Projets",
    "nav.support": "Support",
    "nav.login": "Connexion",
    "nav.register": "Inscription",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    
    // Hero section
    "hero.title": "Trouvez le bon",
    "hero.title_highlight": "prestataire",
    "hero.subtitle": "La première plateforme marocaine qui connecte clients et prestataires de services professionnels",
    "hero.search_placeholder": "Que recherchez-vous ? (ex: plombier, électricien...)",
    "hero.search_button": "Rechercher",
    "hero.location": "Casablanca",
    
    // Services
    "services.title": "Nos Services Populaires",
    "services.subtitle": "Découvrez notre large gamme de services professionnels disponibles partout au Maroc",
    "services.explore": "Explorer",
    
    // Providers
    "providers.title": "Prestataires Vérifiés",
    "providers.subtitle": "Découvrez nos prestataires Club Pro vérifiés et hautement qualifiés",
    "providers.club_pro_badge": "Club Pro Vérifié",
    "providers.online": "En ligne",
    "providers.contact": "Contacter",
    "providers.reviews": "avis",
    
    // Chat
    "chat.title": "Messagerie Instantanée",
    "chat.subtitle": "Communiquez directement avec vos prestataires grâce à notre système de messagerie temps réel avec appels audio et vidéo intégrés.",
    "chat.features.realtime": "Messages en temps réel",
    "chat.features.calls": "Appels audio et vidéo",
    "chat.features.files": "Partage de fichiers sécurisé",
    "chat.input_placeholder": "Tapez votre message...",
    
    // Club Pro
    "club_pro.title": "Rejoignez l'Élite des Prestataires",
    "club_pro.subtitle": "Accédez à des fonctionnalités premium et augmentez votre visibilité avec notre programme Club Pro vérifié",
    "club_pro.cta": "Devenir Club Pro",
    "club_pro.verification.title": "Vérification Complète",
    "club_pro.verification.desc": "Documents professionnels vérifiés : patente, RC, assurance et reconnaissance faciale",
    "club_pro.visibility.title": "Visibilité Premium",
    "club_pro.visibility.desc": "Apparaissez en tête des résultats de recherche avec un badge Club Pro distinctif",
    "club_pro.trust.title": "Confiance Renforcée",
    "club_pro.trust.desc": "Gagnez la confiance des clients avec votre statut vérifié et vos garanties étendues",
    
    // SOS
    "sos.title": "Service SOS 24/7",
    "sos.subtitle": "Urgences ? Nous Sommes Là !",
    "sos.description": "Accès direct aux numéros d'urgence officiels avec géolocalisation automatique",
    "sos.police": "Police",
    "sos.fire": "Pompiers/SAMU",
    "sos.gendarmerie": "Gendarmerie",
    "sos.call_now": "Appeler Maintenant",
    
    // Newsletter
    "newsletter.title": "Restez Informé des Nouveautés",
    "newsletter.subtitle": "Recevez nos dernières actualités, conseils et offres spéciales directement dans votre boîte mail",
    "newsletter.placeholder": "Votre adresse email",
    "newsletter.subscribe": "S'abonner",
    "newsletter.privacy": "Vos données sont protégées et ne seront jamais partagées",
    
    // Footer
    "footer.tagline": "La plateforme qui connecte les clients aux meilleurs prestataires de services du Maroc.",
    "footer.services": "Services",
    "footer.company": "Entreprise",
    "footer.support": "Support",
    "footer.careers": "Carrières",
    "footer.press": "Presse",
    "footer.partners": "Partenaires",
    "footer.help": "Centre d'aide",
    "footer.faq": "FAQ",
    "footer.terms": "Conditions d'utilisation",
    "footer.privacy": "Politique de confidentialité",
    "footer.rights": "Tous droits réservés.",
    "footer.made_in": "Développé avec ❤️ au Maroc",
    "footer.secure": "Paiements Sécurisés",
    
    // Mobile navigation
    "mobile.home": "Accueil",
    "mobile.search": "Recherche",
    "mobile.post": "Publier",
    "mobile.messages": "Messages",
    "mobile.profile": "Profil",
    
    // Common
    "common.join": "Rejoindre Khadamat",
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
    "common.retry": "Réessayer",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات",
    "nav.providers": "مقدمو الخدمات",
    "nav.club_pro": "نادي المحترفين",
    "nav.project": "المشاريع",
    "nav.support": "الدعم",
    "nav.login": "تسجيل الدخول",
    "nav.register": "التسجيل",
    "nav.about": "حول",
    "nav.contact": "اتصل بنا",
    
    // Hero section
    "hero.title": "ابحث عن",
    "hero.title_highlight": "مقدم الخدمة المناسب",
    "hero.subtitle": "أول منصة مغربية تربط العملاء بمقدمي الخدمات المهنية",
    "hero.search_placeholder": "ماذا تبحث عن؟ (مثل: سباك، كهربائي...)",
    "hero.search_button": "بحث",
    "hero.location": "الدار البيضاء",
    
    // Services
    "services.title": "خدماتنا الشائعة",
    "services.subtitle": "اكتشف مجموعتنا الواسعة من الخدمات المهنية المتاحة في جميع أنحاء المغرب",
    "services.explore": "استكشف",
    
    // Providers
    "providers.title": "مقدمو خدمات معتمدون",
    "providers.subtitle": "اكتشف مقدمي خدمات نادي المحترفين المعتمدين وذوي المؤهلات العالية",
    "providers.club_pro_badge": "نادي المحترفين معتمد",
    "providers.online": "متصل",
    "providers.contact": "اتصل",
    "providers.reviews": "مراجعة",
    
    // Chat
    "chat.title": "المراسلة الفورية",
    "chat.subtitle": "تواصل مباشرة مع مقدمي الخدمات من خلال نظام المراسلة الفورية مع المكالمات الصوتية والمرئية المدمجة.",
    "chat.features.realtime": "رسائل في الوقت الفعلي",
    "chat.features.calls": "مكالمات صوتية ومرئية",
    "chat.features.files": "مشاركة ملفات آمنة",
    "chat.input_placeholder": "اكتب رسالتك...",
    
    // Club Pro
    "club_pro.title": "انضم إلى نخبة مقدمي الخدمات",
    "club_pro.subtitle": "احصل على ميزات مميزة وزد من ظهورك مع برنامج نادي المحترفين المعتمد",
    "club_pro.cta": "أصبح محترف نادي",
    "club_pro.verification.title": "التحقق الكامل",
    "club_pro.verification.desc": "المستندات المهنية المعتمدة: البراءة، السجل التجاري، التأمين والتعرف على الوجه",
    "club_pro.visibility.title": "ظهور مميز",
    "club_pro.visibility.desc": "ظهر في أعلى نتائج البحث مع شارة نادي المحترفين المميزة",
    "club_pro.trust.title": "ثقة معززة",
    "club_pro.trust.desc": "اكسب ثقة العملاء مع حالتك المعتمدة والضمانات الممتدة",
    
    // SOS
    "sos.title": "خدمة الطوارئ 24/7",
    "sos.subtitle": "طوارئ؟ نحن هنا!",
    "sos.description": "الوصول المباشر لأرقام الطوارئ الرسمية مع تحديد الموقع الجغرافي التلقائي",
    "sos.police": "الشرطة",
    "sos.fire": "الإطفاء/الإسعاف",
    "sos.gendarmerie": "الدرك الملكي",
    "sos.call_now": "اتصل الآن",
    
    // Newsletter
    "newsletter.title": "ابق على اطلاع بالأخبار",
    "newsletter.subtitle": "احصل على آخر أخبارنا ونصائحنا وعروضنا الخاصة مباشرة في بريدك الإلكتروني",
    "newsletter.placeholder": "عنوان بريدك الإلكتروني",
    "newsletter.subscribe": "اشترك",
    "newsletter.privacy": "بياناتك محمية ولن يتم مشاركتها أبداً",
    
    // Footer
    "footer.tagline": "المنصة التي تربط العملاء بأفضل مقدمي الخدمات في المغرب.",
    "footer.services": "الخدمات",
    "footer.company": "الشركة",
    "footer.support": "الدعم",
    "footer.careers": "الوظائف",
    "footer.press": "الصحافة",
    "footer.partners": "الشركاء",
    "footer.help": "مركز المساعدة",
    "footer.faq": "الأسئلة الشائعة",
    "footer.terms": "شروط الاستخدام",
    "footer.privacy": "سياسة الخصوصية",
    "footer.rights": "جميع الحقوق محفوظة.",
    "footer.made_in": "مطور بـ ❤️ في المغرب",
    "footer.secure": "مدفوعات آمنة",
    
    // Mobile navigation
    "mobile.home": "الرئيسية",
    "mobile.search": "بحث",
    "mobile.post": "نشر",
    "mobile.messages": "الرسائل",
    "mobile.profile": "الملف الشخصي",
    
    // Common
    "common.join": "انضم إلى خدمات",
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.retry": "أعد المحاولة",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("khadamat-language") as Language;
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "ar")) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("khadamat-language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    
    if (language === "ar") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "fr" ? "ar" : "fr");
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
