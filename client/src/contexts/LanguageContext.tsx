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
    "nav.messages": "Messages",
    "nav.project": "Projets",
    "nav.support": "Support",
    "nav.login": "Connexion",
    "nav.register": "Inscription",
    "nav.contact": "Contact",
    "nav.about": "À propos",
    "nav.profile": "Profil",
    
    // User Profile Menu
    "profile.menu.profile": "Profil",
    "profile.menu.orders": "Mes commandes",
    "profile.menu.reservations": "Mes réservations",
    "profile.menu.favorites": "Mes favoris",
    "profile.menu.missions": "Mes missions",
    "profile.menu.club_pro": "Club Pro",
    "profile.menu.messages": "Messages",
    "profile.menu.settings": "Réglages",
    "profile.menu.logout": "Se déconnecter",
    "profile.role.client": "Client",
    "profile.role.provider": "Prestataire",
    
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
    "services.popular": "Services Populaires",
    "services.popular_in": "Services populaires à",
    "services.plumbing": "Plomberie",
    "services.electricity": "Électricité",
    "services.cleaning": "Ménage",
    "services.gardening": "Jardinage",
    "services.painting": "Peinture",
    "services.repair": "Réparation",
    "services.installation": "Installation",
    "services.deep_cleaning": "Nettoyage approfondi",
    "services.moving": "Déménagement",
    
    // How it works
    "how_it_works.title": "Comment ça marche ?",
    "how_it_works.subtitle": "Trouvez le bon prestataire en 3 étapes simples",
    "how_it_works.step1": "1. Recherchez",
    "how_it_works.step1_desc": "Décrivez votre besoin et votre localisation",
    "how_it_works.step2": "2. Comparez",
    "how_it_works.step2_desc": "Consultez les profils et avis des prestataires",
    "how_it_works.step3": "3. Contactez",
    "how_it_works.step3_desc": "Échangez directement et planifiez votre service",
    
    // Providers
    "providers.title": "Prestataires Vérifiés",
    "providers.subtitle": "Découvrez nos prestataires Club Pro vérifiés et hautement qualifiés",
    "providers.club_pro_badge": "Club Pro Vérifié",
    "providers.online": "En ligne",
    "providers.contact": "Contacter",
    "providers.reviews": "avis",
    "providers.view_profile": "Profil",
    
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
    
    // Project page
    "project.hero.badge": "Publier un Projet",
    "project.hero.find_the": "Trouvez le",
    "project.hero.ideal_provider": "Prestataire Idéal",
    "project.hero.description": "Décrivez votre projet et recevez des propositions de prestataires qualifiés. Comparez les offres et choisissez le meilleur professionnel pour vos besoins.",
    "project.form.title": "Publier un Nouveau Projet",
    "project.form.project_title": "Titre du Projet",
    "project.form.title_placeholder": "Ex: Installation électrique dans salon",
    "project.form.category": "Catégorie",
    "project.form.category_placeholder": "Choisir une catégorie",
    "project.form.budget": "Budget",
    "project.form.budget_placeholder": "Sélectionner le budget",
    "project.form.location": "Localisation",
    "project.form.location_placeholder": "Ex: Casablanca, Maarif",
    "project.form.deadline": "Délai souhaité",
    "project.form.deadline_placeholder": "Ex: Dans la semaine, Urgent",
    "project.form.description": "Description détaillée",
    "project.form.description_placeholder": "Décrivez votre projet en détail : travaux à effectuer, contraintes, matériel fourni ou non...",
    "project.form.skills": "Compétences recherchées",
    "project.form.skills_placeholder": "Ex: Électricien certifié, expérience domotique",
    "project.form.publishing": "Publication...",
    "project.form.publish_button": "Publier le Projet",
    "project.form.other": "Autre",
    "project.budget.under_500": "Moins de 500 DH",
    "project.budget.500_1000": "500 - 1000 DH",
    "project.budget.1000_2000": "1000 - 2000 DH",
    "project.budget.2000_5000": "2000 - 5000 DH",
    "project.budget.over_5000": "Plus de 5000 DH",
    "project.budget.negotiable": "À négocier",
    "project.toast.success_title": "Projet publié !",
    "project.toast.success_description": "Votre projet a été publié avec succès. Les prestataires vont recevoir des notifications.",
    "project.toast.error_title": "Erreur de publication",
    "project.toast.error_description": "Une erreur s'est produite lors de la publication.",
    "project.how_it_works.title": "Comment ça marche ?",
    "project.how_it_works.step1_title": "Publiez votre projet",
    
    // Search and filters
    "search.suggestions": "Suggestions",
    "search.clear_filters": "Effacer les filtres",
    "search.active_filters": "Filtres actifs",
    "search.search_term": "Recherche",
    "search.service": "Service",
    "search.city": "Ville",
    "search.price": "Prix",
    "search.available": "Disponible",
    "search.club_pro": "Club Pro",
    "search.date": "Date",
    "calendar.available": "Disponible",
    "calendar.unavailable": "Indisponible",
    "calendar.selected": "Sélectionné",
    "calendar.legend": "Légende",
    "project.how_it_works.step1_desc": "Décrivez vos besoins en détail",
    "project.how_it_works.step2_title": "Recevez des propositions",
    "project.how_it_works.step2_desc": "Les prestataires vous contactent",
    "project.how_it_works.step3_title": "Choisissez le meilleur",
    "project.how_it_works.step3_desc": "Comparez et sélectionnez",
    "project.recent.title": "Projets Récents",
    "project.status.completed": "Terminé",
    "project.status.active": "Actif",
    "project.proposals": "propositions",
    "project.examples.ac_installation": "Installation climatisation",
    "project.examples.bathroom_renovation": "Rénovation salle de bain", 
    "project.examples.gardening": "Jardinage et entretien",
    "project.tips.title": "Conseils pour réussir",
    "project.tips.tip1": "Soyez précis dans votre description",
    "project.tips.tip2": "Mentionnez votre budget réaliste",
    "project.tips.tip3": "Ajoutez des photos si nécessaire",
    "project.tips.tip4": "Répondez rapidement aux prestataires",
    
    // Cities
    "cities.casablanca": "Casablanca",
    "cities.rabat": "Rabat",
    "cities.marrakech": "Marrakech",
    
    // Header
    "header.register": "Inscription",
    "header.login": "Connexion",
    "header.language": "Langue",
    "header.sos": "SOS",
    "header.sos_alert": "Service SOS activé - Aide d'urgence en cours",
    
    // Messages page
    "messages.badge": "Messages",
    "messages.title": "Mes Conversations",
    "messages.description": "Communiquez directement avec les prestataires",
    "messages.conversations": "Conversations",
    "messages.no_conversations": "Aucune conversation",
    "messages.start_conversation": "Commencez une conversation",
    "messages.last_message_1": "Le devis sera prêt demain",
    "messages.last_message_2": "Parfait, je confirme pour jeudi",
    "messages.last_message_3": "Photos envoyées",
    
    // Profile page
    "profile.stats.projects": "Projets",
    "profile.stats.rating": "Note",
    "profile.stats.favorites": "Favoris",
    "profile.verified": "Vérifié",
    "profile.member_since": "Membre depuis",
    "profile.account_settings": "Paramètres du compte",
    "profile.menu.edit_profile": "Modifier le profil",
    "profile.menu.edit_profile_desc": "Informations personnelles et photo",
    "profile.menu.verification": "Vérification",
    "profile.menu.verification_desc": "Vérifiez votre identité",
    "profile.menu.payments": "Paiements",
    "profile.menu.payments_desc": "Moyens de paiement et facturation",
    
    // Common
    "common.configure": "Configurer",
    "common.search": "Rechercher",
    
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
    "newsletter.title": "Restez informé avec notre newsletter",
    "newsletter.subtitle": "Inscrivez-vous gratuitement et ne manquez aucune actualité de Khadamat",
    "newsletter.placeholder": "Votre email",
    "newsletter.subscribe": "S'inscrire",
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
    
    // Featured Providers
    "featured_providers.title": "Prestataires en Vedette",
    "featured_providers.subtitle": "Découvrez nos meilleurs prestataires sélectionnés selon leur note et leur expérience",
    "featured_providers.verified": "Vérifié",
    "featured_providers.pro": "Pro",
    "featured_providers.reviews": "avis",
    "featured_providers.view_profile": "Voir le profil",
    "featured_providers.view_all": "Voir tous les prestataires",
    
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
    
    // Statistics
    "stats.providers": "Prestataires",
    "stats.missions": "Missions",
    "stats.satisfaction": "Satisfaction",
    "stats.support": "Support",
    
    // Testimonials
    "testimonials.review1": "Excellent service ! Le prestataire était ponctuel, professionnel et le travail était parfait. Je recommande vivement.",
    "testimonials.review2": "Très satisfait de la qualité du service. Prix raisonnable et délais respectés. Je ferai appel à nouveau.",
    "testimonials.review3": "Plateforme très pratique pour trouver des prestataires fiables. L'interface est intuitive et le service client réactif.",
    "testimonials.user1": "Fatima Z.",
    "testimonials.user2": "Ahmed M.",
    "testimonials.user3": "Khadija L.",
    "testimonials.city1": "Casablanca",
    "testimonials.city2": "Rabat",
    "testimonials.city3": "Marrakech",
    
    // Newsletter
    "newsletter.stay_informed": "Restez informé des nouveautés et des offres dans votre région",
    "newsletter.description": "Inscrivez-vous gratuitement et ne manquez aucune actualité de Khadamat. Recevez des offres personnalisées pour",
    "newsletter.email_placeholder": "Entrez votre adresse email",
    "newsletter.subscribing": "Inscription...",
    "newsletter.subscribe_button": "S'inscrire",
    "newsletter.success_message": "✅ Inscription réussie ! Vous recevrez bientôt nos actualités personnalisées pour",
    "newsletter.what_you_get": "Ce que vous recevrez :",
    "newsletter.site_news_title": "Actualités du site",
    "newsletter.site_news_desc": "Nouvelles fonctionnalités et améliorations de la plateforme",
    "newsletter.local_offers_title": "Offres localisées",
    "newsletter.local_offers_desc": "Promotions et prestataires disponibles dans votre région",
    "newsletter.useful_tips_title": "Conseils utiles",
    "newsletter.useful_tips_desc": "Astuces et guides pratiques pour vos projets",
    "newsletter.security_title": "Sécurité garantie",
    "newsletter.security_desc": "Vos données sont protégées et ne seront jamais partagées",
    "newsletter.no_spam": "Pas de spam, désabonnement en un clic",
    "newsletter.your_region": "votre région",
    
    // Join Providers
    "join_providers.title": "Rejoignez notre communauté de professionnels certifiés",
    "join_providers.subtitle": "Développez votre activité, gagnez la confiance des clients et accédez à de nouveaux projets avec notre plateforme de confiance.",
    "join_providers.become_provider": "Devenir prestataire",
    "join_providers.club_pro": "Club Pro",
    "join_providers.develop_activity_title": "Développez votre activité",
    "join_providers.develop_activity_desc": "Accédez à de nouveaux clients et projets réguliers",
    "join_providers.gain_trust_title": "Gagnez la confiance",
    "join_providers.gain_trust_desc": "Badge de vérification et avis clients pour vous démarquer",
    "join_providers.competitive_prices_title": "Tarifs compétitifs",
    "join_providers.competitive_prices_desc": "Fixez vos prix et maximisez vos revenus",
    
    // Booking Modal
    "booking.title": "Réserver",
    "booking.description_label": "Description de votre demande",
    "booking.description_placeholder": "Décrivez en détail ce que vous souhaitez faire (ex: réparation de robinet, installation électrique, nettoyage complet...)",
    "booking.confirm": "Confirmer la réservation",
    
    // Common
    "common.cancel": "Annuler",
    "common.language": "fr",
    
    // Prestataires page
    "prestataires.title": "Trouvez un Prestataire près de chez vous",
    "prestataires.subtitle": "Découvrez nos prestataires vérifiés et qualifiés pour tous vos besoins",
    "prestataires.search_placeholder": "Rechercher un prestataire...",
    "prestataires.filters": "Filtres",
    "prestataires.service_label": "Service",
    "prestataires.all_services": "Tous les services",
    "prestataires.city_label": "Ville",
    "prestataires.all_cities": "Toutes les villes",
    "prestataires.rating_label": "Note minimum",
    "prestataires.all_ratings": "Toutes les notes",
    "prestataires.stars": "étoiles",
    "prestataires.clear_filters": "Effacer les filtres",
    "prestataires.results_count": "prestataire trouvé",
    "prestataires.results_count_plural": "prestataires trouvés",
    "prestataires.no_results_title": "Aucun prestataire trouvé",
    "prestataires.no_results_desc": "Essayez de modifier vos critères de recherche ou de supprimer certains filtres.",
    "prestataires.clear_all_filters": "Effacer tous les filtres",
    
    // Provider Profile
    "provider_profile.book_provider": "Réserver ce prestataire",
    "provider_profile.contact_description": "Contactez le prestataire pour discuter de votre projet",
    "provider_profile.book_now": "Réserver maintenant",
    "provider_profile.message": "Message",
    "provider_profile.call": "Appeler",
    "provider_profile.mission_description": "Description de la mission",
    "provider_profile.mission_placeholder": "Décrivez votre projet...",
    "provider_profile.cancel": "Annuler",
    "provider_profile.confirm": "Confirmer",
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
    "nav.messages": "الرسائل",
    "nav.contact": "اتصل بنا",
    "nav.about": "حول",
    "nav.profile": "الملف الشخصي",
    
    // User Profile Menu
    "profile.menu.profile": "الملف الشخصي",
    "profile.menu.orders": "طلباتي",
    "profile.menu.reservations": "حجوزاتي",
    "profile.menu.favorites": "المفضلة",
    "profile.menu.missions": "مهامي",
    "profile.menu.club_pro": "النادي المميز",
    "profile.menu.messages": "الرسائل",
    "profile.menu.settings": "الإعدادات",
    "profile.menu.logout": "تسجيل الخروج",
    "profile.role.client": "عميل",
    "profile.role.provider": "مقدم خدمة",
    
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
    "services.popular": "الخدمات الشائعة",
    "services.popular_in": "الخدمات الشائعة في",
    "services.plumbing": "السباكة",
    "services.electricity": "الكهرباء",
    "services.cleaning": "التنظيف",
    "services.gardening": "البستنة",
    "services.painting": "الدهان",
    "services.repair": "الإصلاح",
    "services.installation": "التركيب",
    "services.deep_cleaning": "التنظيف العميق",
    "services.moving": "النقل",
    
    // How it works
    "how_it_works.title": "كيف يعمل؟",
    "how_it_works.subtitle": "اعثر على مقدم الخدمة المناسب في 3 خطوات بسيطة",
    "how_it_works.step1": "1. ابحث",
    "how_it_works.step1_desc": "صف احتياجك وموقعك",
    "how_it_works.step2": "2. قارن",
    "how_it_works.step2_desc": "راجع ملفات تعريف مقدمي الخدمات وآرائهم",
    "how_it_works.step3": "3. تواصل",
    "how_it_works.step3_desc": "تواصل مباشرة ونسق خدمتك",
    
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
    "providers.view_profile": "الملف الشخصي",
    
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
    
    // Project page
    "project.hero.badge": "نشر مشروع",
    "project.hero.find_the": "اعثر على",
    "project.hero.ideal_provider": "مقدم الخدمة المثالي",
    "project.hero.description": "صف مشروعك واحصل على عروض من مقدمي خدمات مؤهلين. قارن العروض واختر أفضل محترف لاحتياجاتك.",
    "project.form.title": "نشر مشروع جديد",
    
    // Search and filters
    "search.suggestions": "اقتراحات",
    "search.clear_filters": "مسح المرشحات",
    "search.active_filters": "المرشحات النشطة",
    "search.search_term": "بحث",
    "search.service": "خدمة",
    "search.city": "مدينة",
    "search.price": "سعر",
    "search.available": "متاح",
    "search.club_pro": "نادي المحترفين",
    "search.date": "تاريخ",
    "calendar.available": "متاح",
    "calendar.unavailable": "غير متاح",
    "calendar.selected": "محدد",
    "calendar.legend": "مفتاح",
    "project.form.project_title": "عنوان المشروع",
    "project.form.title_placeholder": "مثال: تركيب كهرباء في الصالون",
    "project.form.category": "الفئة",
    "project.form.category_placeholder": "اختر فئة",
    "project.form.budget": "الميزانية",
    "project.form.budget_placeholder": "حدد الميزانية",
    "project.form.location": "الموقع",
    "project.form.location_placeholder": "مثال: الدار البيضاء، المعاريف",
    "project.form.deadline": "الموعد المطلوب",
    "project.form.deadline_placeholder": "مثال: خلال الأسبوع، عاجل",
    "project.form.description": "وصف مفصل",
    "project.form.description_placeholder": "صف مشروعك بالتفصيل: الأعمال المطلوبة، القيود، المواد المقدمة أم لا...",
    "project.form.skills": "المهارات المطلوبة",
    "project.form.skills_placeholder": "مثال: كهربائي معتمد، خبرة في المنازل الذكية",
    "project.form.publishing": "جاري النشر...",
    "project.form.publish_button": "نشر المشروع",
    "project.form.other": "أخرى",
    "project.budget.under_500": "أقل من 500 درهم",
    "project.budget.500_1000": "500 - 1000 درهم",
    "project.budget.1000_2000": "1000 - 2000 درهم",
    "project.budget.2000_5000": "2000 - 5000 درهم",
    "project.budget.over_5000": "أكثر من 5000 درهم",
    "project.budget.negotiable": "قابل للتفاوض",
    "project.toast.success_title": "تم نشر المشروع!",
    "project.toast.success_description": "تم نشر مشروعك بنجاح. سيتلقى مقدمو الخدمات إشعارات.",
    "project.toast.error_title": "خطأ في النشر",
    "project.toast.error_description": "حدث خطأ أثناء النشر.",
    "project.how_it_works.title": "كيف يعمل؟",
    "project.how_it_works.step1_title": "انشر مشروعك",
    "project.how_it_works.step1_desc": "صف احتياجاتك بالتفصيل",
    "project.how_it_works.step2_title": "احصل على عروض",
    "project.how_it_works.step2_desc": "مقدمو الخدمات سيتواصلون معك",
    "project.how_it_works.step3_title": "اختر الأفضل",
    "project.how_it_works.step3_desc": "قارن واختر",
    "project.recent.title": "المشاريع الحديثة",
    "project.status.completed": "مكتمل",
    "project.status.active": "نشط",
    "project.proposals": "عروض",
    "project.examples.ac_installation": "تركيب تكييف",
    "project.examples.bathroom_renovation": "تجديد الحمام",
    "project.examples.gardening": "البستنة والصيانة",
    "project.tips.title": "نصائح للنجاح",
    "project.tips.tip1": "كن دقيقاً في وصفك",
    "project.tips.tip2": "اذكر ميزانيتك الواقعية",
    "project.tips.tip3": "أضف صوراً إذا لزم الأمر",
    "project.tips.tip4": "رد بسرعة على مقدمي الخدمات",
    
    // Cities
    "cities.casablanca": "الدار البيضاء",
    "cities.rabat": "الرباط",
    "cities.marrakech": "مراكش",
    
    // Header
    "header.register": "التسجيل",
    "header.login": "تسجيل الدخول",
    "header.language": "اللغة",
    "header.sos": "طوارئ",
    "header.sos_alert": "تم تفعيل خدمة الطوارئ - المساعدة العاجلة قيد التقدم",
    
    // Messages page
    "messages.badge": "الرسائل",
    "messages.title": "محادثاتي",
    "messages.description": "تواصل مباشرة مع مقدمي الخدمات",
    "messages.conversations": "المحادثات",
    "messages.no_conversations": "لا توجد محادثات",
    "messages.start_conversation": "ابدأ محادثة",
    "messages.last_message_1": "العرض سيكون جاهزاً غداً",
    "messages.last_message_2": "ممتاز، أؤكد ليوم الخميس",
    "messages.last_message_3": "تم إرسال الصور",
    
    // Profile page
    "profile.stats.projects": "المشاريع",
    "profile.stats.rating": "التقييم",
    "profile.stats.favorites": "المفضلة",
    "profile.verified": "موثق",
    "profile.member_since": "عضو منذ",
    "profile.account_settings": "إعدادات الحساب",
    "profile.menu.edit_profile": "تعديل الملف الشخصي",
    "profile.menu.edit_profile_desc": "المعلومات الشخصية والصورة",
    "profile.menu.verification": "التوثيق",
    "profile.menu.verification_desc": "تحقق من هويتك",
    "profile.menu.payments": "المدفوعات",
    "profile.menu.payments_desc": "وسائل الدفع والفواتير",
    
    // Common
    "common.configure": "تكوين",
    "common.search": "بحث",
    
    // SOS
    "sos.title": "خدمة الطوارئ 24/7",
    "sos.subtitle": "طوارئ؟ نحن هنا!",
    "sos.description": "الوصول المباشر لأرقام الطوارئ الرسمية مع تحديد الموقع الجغرافي التلقائي",
    "sos.police": "الشرطة",
    "sos.fire": "الإطفاء/الإسعاف",
    "sos.gendarmerie": "الدرك الملكي",
    "sos.call_now": "اتصل الآن",
    
    // Newsletter
    "newsletter.title": "ابق على اطلاع مع نشرتنا الإخبارية",
    "newsletter.subtitle": "اشترك مجاناً ولا تفوت أي أخبار من خدمات",
    "newsletter.placeholder": "بريدك الإلكتروني",
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
    
    // Featured Providers
    "featured_providers.title": "مقدمو الخدمات المميزون",
    "featured_providers.subtitle": "اكتشف أفضل مقدمي الخدمات المختارين حسب تقييمهم وخبرتهم",
    "featured_providers.verified": "موثق",
    "featured_providers.pro": "محترف",
    "featured_providers.reviews": "مراجعة",
    "featured_providers.view_profile": "عرض الملف الشخصي",
    "featured_providers.view_all": "عرض جميع مقدمي الخدمات",
    
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
    
    // Statistics
    "stats.providers": "مقدمو الخدمات",
    "stats.missions": "المهام",
    "stats.satisfaction": "الرضا",
    "stats.support": "الدعم",
    
    // Testimonials
    "testimonials.review1": "خدمة ممتازة! كان مقدم الخدمة دقيقاً ومهنياً والعمل كان مثالياً. أوصي بشدة.",
    "testimonials.review2": "راضٍ جداً من جودة الخدمة. السعر معقول والمواعيد محترمة. سألجأ مرة أخرى.",
    "testimonials.review3": "منصة مفيدة جداً للعثور على مقدمي خدمات موثوقين. الواجهة بديهية وخدمة العملاء متجاوبة.",
    "testimonials.user1": "فاطمة ز.",
    "testimonials.user2": "أحمد م.",
    "testimonials.user3": "خديجة ل.",
    "testimonials.city1": "الدار البيضاء",
    "testimonials.city2": "الرباط",
    "testimonials.city3": "مراكش",
    
    // Newsletter
    "newsletter.stay_informed": "ابق على اطلاع بالأخبار والعروض في منطقتك",
    "newsletter.description": "اشترك مجاناً ولا تفوت أي أخبار من خدمات. احصل على عروض مخصصة لـ",
    "newsletter.email_placeholder": "أدخل بريدك الإلكتروني",
    "newsletter.subscribing": "جاري التسجيل...",
    "newsletter.subscribe_button": "اشترك",
    "newsletter.success_message": "✅ تم التسجيل بنجاح! ستصلك قريباً أخبارنا المخصصة لـ",
    "newsletter.what_you_get": "ما ستحصل عليه:",
    "newsletter.site_news_title": "أخبار الموقع",
    "newsletter.site_news_desc": "ميزات جديدة وتحسينات للمنصة",
    "newsletter.local_offers_title": "عروض محلية",
    "newsletter.local_offers_desc": "عروض ومقدمي خدمات متاحون في منطقتك",
    "newsletter.useful_tips_title": "نصائح مفيدة",
    "newsletter.useful_tips_desc": "حيل وأدلة عملية لمشاريعك",
    "newsletter.security_title": "أمان مضمون",
    "newsletter.security_desc": "بياناتك محمية ولن يتم مشاركتها أبداً",
    "newsletter.no_spam": "لا بريد مزعج، إلغاء الاشتراك بنقرة واحدة",
    "newsletter.your_region": "منطقتك",
    
    // Join Providers
    "join_providers.title": "انضم إلى مجتمعنا من المحترفين المعتمدين",
    "join_providers.subtitle": "طور نشاطك، اكسب ثقة العملاء واحصل على مشاريع جديدة مع منصتنا الموثوقة.",
    "join_providers.become_provider": "أصبح مقدم خدمة",
    "join_providers.club_pro": "نادي المحترفين",
    "join_providers.develop_activity_title": "طور نشاطك",
    "join_providers.develop_activity_desc": "احصل على عملاء ومشاريع جديدة منتظمة",
    "join_providers.gain_trust_title": "اكسب الثقة",
    "join_providers.gain_trust_desc": "شارة التحقق ومراجعات العملاء للتميز",
    "join_providers.competitive_prices_title": "أسعار تنافسية",
    "join_providers.competitive_prices_desc": "حدد أسعارك واعظم أرباحك",
    
    // Booking Modal
    "booking.title": "حجز",
    "booking.description_label": "وصف طلبك",
    "booking.description_placeholder": "صف بالتفصيل ما تريد القيام به (مثل: إصلاح الصنبور، تركيب كهربائي، تنظيف شامل...)",
    "booking.confirm": "تأكيد الحجز",
    
    // Common
    "common.cancel": "إلغاء",
    "common.language": "ar",
    
    // Prestataires page
    "prestataires.title": "اعثر على مقدم خدمة قريب منك",
    "prestataires.subtitle": "اكتشف مقدمي الخدمات المعتمدين والمؤهلين لجميع احتياجاتك",
    "prestataires.search_placeholder": "البحث عن مقدم خدمة...",
    "prestataires.filters": "المرشحات",
    "prestataires.service_label": "الخدمة",
    "prestataires.all_services": "جميع الخدمات",
    "prestataires.city_label": "المدينة",
    "prestataires.all_cities": "جميع المدن",
    "prestataires.rating_label": "الحد الأدنى للتقييم",
    "prestataires.all_ratings": "جميع التقييمات",
    "prestataires.stars": "نجوم",
    "prestataires.clear_filters": "مسح المرشحات",
    "prestataires.results_count": "مقدم خدمة وجد",
    "prestataires.results_count_plural": "مقدمو خدمات وجدوا",
    "prestataires.no_results_title": "لم يتم العثور على مقدم خدمة",
    "prestataires.no_results_desc": "حاول تعديل معايير البحث أو إزالة بعض المرشحات.",
    "prestataires.clear_all_filters": "مسح جميع المرشحات",
    
    // Provider Profile
    "provider_profile.book_provider": "حجز هذا مقدم الخدمة",
    "provider_profile.contact_description": "تواصل مع مقدم الخدمة لمناقشة مشروعك",
    "provider_profile.book_now": "احجز الآن",
    "provider_profile.message": "رسالة",
    "provider_profile.call": "اتصال",
    "provider_profile.mission_description": "وصف المهمة",
    "provider_profile.mission_placeholder": "صف مشروعك...",
    "provider_profile.cancel": "إلغاء",
    "provider_profile.confirm": "تأكيد",
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
