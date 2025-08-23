export const ERROR_MESSAGES: Record<string, { fr: string; ar: string }> = {
  UNAUTH: { fr: 'Non authentifié', ar: 'غير مصرح' },
  FORBIDDEN: { fr: 'Accès refusé', ar: 'ممنوع' },
  ACCOUNT_LOCKED: { fr: 'Compte verrouillé', ar: 'الحساب مقفل' },
  RATE_LIMITED: { fr: 'Trop de requêtes', ar: 'طلبات كثيرة جدًا' },
  UNSUPPORTED_MEDIA_TYPE: { fr: 'Type de média non supporté', ar: 'نوع الوسائط غير مدعوم' },
  VALIDATION_ERROR: { fr: 'Données invalides', ar: 'بيانات غير صالحة' },
  KYC_REQUIRED: { fr: "Vérification d'identité requise", ar: 'يلزم التحقق من الهوية' },
  ADMIN_IP_BLOCKED: { fr: 'IP administrateur bloquée', ar: 'عنوان IP الإداري محظور' },
  STRIPE_API_ERROR: { fr: 'Erreur Stripe', ar: 'خطأ سترايب' },
  NOT_FOUND: { fr: 'Introuvable', ar: 'غير موجود' },
  SERVER_ERROR: { fr: 'Erreur serveur', ar: 'خطأ في الخادم' },
};
