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
    "hero.city_placeholder": "Ville (ex: Casablanca, Rabat...)",
    "hero.provider_placeholder": "Rechercher un prestataire spécifique (optionnel)",
    
    // Services
    "services.title": "Nos services populaires",
    "services.subtitle": "Découvrez notre large gamme de services professionnels disponibles dans tout le Maroc",
    "services.explore": "Explorer",
    "services.popular_in": "Services populaires à",
    
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
    "club_pro.home_subtitle": "Accédez aux projets de grandes ampleurs et bénéficiez d'avantages exclusifs pour seulement 50 DH/mois.",
    "club_pro.cta": "Devenir Club Pro",
    "club_pro.join_cta": "Devenir Club Pro - 50 DH/mois",
    "club_pro.badge_benefit": "Badge Club Pro pour se démarquer",
    "club_pro.priority_benefit": "Priorité dans les résultats de recherche",
    "club_pro.support_benefit": "Support dédié aux prestataires Club Pro",
    "club_pro.exclusive_access": "🏆 ACCÈS EXCLUSIF",
    "club_pro.large_projects": "Projets de grandes ampleurs réservés aux Club Pro",
    "club_pro.verification.title": "Vérification Complète",
    "club_pro.verification.desc": "Documents professionnels vérifiés : patente, RC, assurance et reconnaissance faciale",
    "club_pro.visibility.title": "Visibilité Premium",
    "club_pro.visibility.desc": "Apparaissez en tête des résultats de recherche avec un badge Club Pro distinctif",
    "club_pro.trust.title": "Confiance Renforcée",
    "club_pro.trust.desc": "Gagnez la confiance des clients avec votre statut vérifié et vos garanties étendues",
    "club_pro.verification_24h": "Vérification en 24h",
    "club_pro.priority_support": "Support prioritaire",
    "club_pro.premium_badge": "Badge premium",
    "club_pro.why_choose": "Pourquoi Choisir Club Pro ?",
    "club_pro.join_elite": "Rejoignez l'élite des prestataires et multipliez vos opportunités",
    "club_pro.benefit_badge_title": "Badge Club Pro Distinctif",
    "club_pro.benefit_badge_desc": "Votre profil sera marqué d'un badge premium visible par tous les clients",
    "club_pro.benefit_ranking_title": "Classement Prioritaire",
    "club_pro.benefit_ranking_desc": "Apparaissez en premier dans les résultats de recherche",
    "club_pro.benefit_projects_title": "Accès aux Projets Premium",
    "club_pro.benefit_projects_desc": "Recevez les demandes de projets les plus valorisés",
    "club_pro.benefit_support_title": "Support Client Prioritaire",
    "club_pro.benefit_support_desc": "Assistance dédiée et temps de réponse accéléré",
    "club_pro.pricing_title": "Un seul abonnement, tous les avantages",
    "club_pro.pricing_subtitle": "Rejoignez le Club Pro et accédez aux plus grands projets",
    "club_pro.per_month": "par mois",
    "club_pro.commitment_1_year": "Engagement 1 an",
    "club_pro.join_button": "Rejoindre le Club Pro",
    "club_pro.payment_methods": "Moyens de paiement acceptés",
    
    // SOS
    "sos.title": "Service SOS 24/7",
    "sos.subtitle": "Urgences ? Nous Sommes Là !",
    "sos.description": "Accès direct aux numéros d'urgence officiels avec géolocalisation automatique",
    "sos.police": "Police",
    "sos.fire": "Pompiers/SAMU",
    "sos.gendarmerie": "Gendarmerie",
    "sos.call_now": "Appeler Maintenant",
    
    // Testimonials
    "testimonials.title": "Ce que disent nos utilisateurs",
    "testimonials.subtitle": "Des milliers de clients satisfaits nous font confiance",
    
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
    
    // Common
    "common.currency": "DH",
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
    "hero.city_placeholder": "المدينة (مثل: الدار البيضاء، الرباط...)",
    "hero.provider_placeholder": "البحث عن مقدم خدمة محدد (اختياري)",
    
    // Services
    "services.title": "خدماتنا الشائعة",
    "services.subtitle": "اكتشف مجموعتنا الواسعة من الخدمات المهنية المتاحة في جميع أنحاء المغرب",
    "services.explore": "استكشف جميع الخدمات",
    "services.popular_in": "الخدمات الشائعة في",
    
    // Testimonials
    "testimonials.title": "ماذا يقول عملاؤنا",
    "testimonials.subtitle": "آلاف العملاء الراضين يثقون بنا",
    
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
    "club_pro.home_subtitle": "احصل على المشاريع الكبيرة واستفد من المزايا الحصرية مقابل 50 درهم فقط شهرياً.",
    "club_pro.cta": "أصبح محترف نادي",
    "club_pro.join_cta": "انضم لنادي المحترفين - 50 درهم/شهر",
    "club_pro.badge_benefit": "شارة نادي المحترفين للتميز",
    "club_pro.priority_benefit": "الأولوية في نتائج البحث",
    "club_pro.support_benefit": "دعم مخصص لمقدمي خدمات نادي المحترفين",
    "club_pro.exclusive_access": "🏆 وصول حصري",
    "club_pro.large_projects": "المشاريع الكبيرة حصرية لنادي المحترفين",
    "club_pro.verification.title": "التحقق الكامل",
    "club_pro.verification.desc": "المستندات المهنية المعتمدة: البراءة، السجل التجاري، التأمين والتعرف على الوجه",
    "club_pro.visibility.title": "ظهور مميز",
    "club_pro.visibility.desc": "ظهر في أعلى نتائج البحث مع شارة نادي المحترفين المميزة",
    "club_pro.trust.title": "ثقة معززة",
    "club_pro.trust.desc": "اكسب ثقة العملاء مع حالتك المعتمدة والضمانات الممتدة",
    "club_pro.verification_24h": "التحقق خلال 24 ساعة",
    "club_pro.priority_support": "دعم أولوي",
    "club_pro.premium_badge": "شارة مميزة",
    "club_pro.why_choose": "لماذا تختار نادي المحترفين؟",
    "club_pro.join_elite": "انضم إلى نخبة مقدمي الخدمات وضاعف فرصك",
    "club_pro.benefit_badge_title": "شارة نادي المحترفين المميزة",
    "club_pro.benefit_badge_desc": "سيتم وضع علامة على ملفك الشخصي بشارة مميزة مرئية لجميع العملاء",
    "club_pro.benefit_ranking_title": "ترتيب أولوي",
    "club_pro.benefit_ranking_desc": "تظهر أولاً في نتائج البحث",
    "club_pro.benefit_projects_title": "الوصول إلى المشاريع المميزة",
    "club_pro.benefit_projects_desc": "احصل على طلبات المشاريع الأكثر قيمة",
    "club_pro.benefit_support_title": "دعم العملاء الأولوي",
    "club_pro.benefit_support_desc": "مساعدة مخصصة ووقت استجابة متسارع",
    "club_pro.pricing_title": "اشتراك واحد، جميع المزايا",
    "club_pro.pricing_subtitle": "انضم إلى نادي المحترفين واحصل على أكبر المشاريع",
    "club_pro.per_month": "شهرياً",
    "club_pro.commitment_1_year": "التزام لسنة واحدة",
    "club_pro.join_button": "انضم إلى نادي المحترفين",
    "club_pro.payment_methods": "وسائل الدفع المقبولة",
    
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
    
    // Common
    "common.currency": "درهم",
    
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
