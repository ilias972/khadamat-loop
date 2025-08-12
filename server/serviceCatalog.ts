export interface ServiceCatalogItem {
  id: number;
  code: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  category_code: string;
  is_active: boolean;
  sort_order: number;
}

export const serviceCatalog: ServiceCatalogItem[] = [
  { id: 1, code: 'PLOMBERIE', slug: 'plomberie', name_fr: 'Plomberie', name_ar: 'السباكة', category_code: 'PLOMBERIE', is_active: true, sort_order: 1 },
  { id: 2, code: 'ELECTRICITE', slug: 'electricite', name_fr: 'Électricité', name_ar: 'الكهرباء', category_code: 'ELECTRICITE', is_active: true, sort_order: 2 },
  { id: 3, code: 'PEINTURE', slug: 'peinture', name_fr: 'Peinture', name_ar: 'الصباغة', category_code: 'PEINTURE', is_active: true, sort_order: 3 },
  { id: 4, code: 'NETTOYAGE', slug: 'nettoyage', name_fr: 'Nettoyage (ménage)', name_ar: 'التنظيف المنزلي', category_code: 'NETTOYAGE', is_active: true, sort_order: 4 },
  { id: 5, code: 'JARDINAGE', slug: 'jardinage', name_fr: 'Jardinage', name_ar: 'البستنة', category_code: 'JARDINAGE', is_active: true, sort_order: 5 },
  { id: 6, code: 'SERRURERIE', slug: 'serrurerie', name_fr: 'Serrurerie', name_ar: 'خدمات الأقفال', category_code: 'SERRURERIE', is_active: true, sort_order: 6 },
  { id: 7, code: 'MENUISERIE_BOIS', slug: 'menuiserie-bois', name_fr: 'Menuiserie bois', name_ar: 'نجارة الخشب', category_code: 'MENUISERIE_BOIS', is_active: true, sort_order: 7 },
  { id: 8, code: 'ALU_PVC', slug: 'aluminium-pvc', name_fr: 'Aluminium / PVC', name_ar: 'ألمنيوم وPVC', category_code: 'ALU_PVC', is_active: true, sort_order: 8 },
  { id: 9, code: 'MACONNERIE', slug: 'maconnerie', name_fr: 'Maçonnerie', name_ar: 'أشغال البناء', category_code: 'MACONNERIE', is_active: true, sort_order: 9 },
  { id: 10, code: 'CARRELAGE', slug: 'carrelage', name_fr: 'Carrelage / Faïence', name_ar: 'تبليط / سيراميك', category_code: 'CARRELAGE', is_active: true, sort_order: 10 },
  { id: 11, code: 'PLATRERIE', slug: 'platrerie', name_fr: 'Plâtrerie / Faux plafonds', name_ar: 'الجبس والأسقف المعلقة', category_code: 'PLATRERIE', is_active: true, sort_order: 11 },
  { id: 12, code: 'CLIM_CHAUFFAGE', slug: 'climatisation', name_fr: 'Climatisation / Chauffage', name_ar: 'التكييف والتدفئة', category_code: 'CLIM_CHAUFFAGE', is_active: true, sort_order: 12 },
  { id: 13, code: 'CHAUFFE_EAU', slug: 'chauffe-eau', name_fr: 'Chauffe-eau (gaz/élec)', name_ar: 'سخان الماء (غاز/كهرباء)', category_code: 'CHAUFFE_EAU', is_active: true, sort_order: 13 },
  { id: 14, code: 'ELECTROMENAGER', slug: 'reparation-electromenager', name_fr: 'Réparation électroménager', name_ar: 'إصلاح الأجهزة المنزلية', category_code: 'ELECTROMENAGER', is_active: true, sort_order: 14 },
  { id: 15, code: 'INFORMATIQUE', slug: 'informatique-reseaux', name_fr: 'Informatique / Réseaux', name_ar: 'معلوميات وشبكات', category_code: 'INFORMATIQUE', is_active: true, sort_order: 15 },
  { id: 16, code: 'PARABOLE_TV', slug: 'parabole-tv', name_fr: 'Parabole / TV', name_ar: 'تركيب الصحون اللاقطة / التلفاز', category_code: 'PARABOLE_TV', is_active: true, sort_order: 16 },
  { id: 17, code: 'VITRERIE', slug: 'vitrerie', name_fr: 'Vitrerie', name_ar: 'الزجاج', category_code: 'VITRERIE', is_active: true, sort_order: 17 },
  { id: 18, code: 'TOITURE_ETANCHEITE', slug: 'toiture-etancheite', name_fr: 'Toiture / Étanchéité', name_ar: 'الأسطح والعزل المائي', category_code: 'TOITURE_ETANCHEITE', is_active: true, sort_order: 18 },
  { id: 19, code: 'FERRONNERIE', slug: 'ferronnerie', name_fr: 'Ferronnerie', name_ar: 'الحدادة', category_code: 'FERRONNERIE', is_active: true, sort_order: 19 },
  { id: 20, code: 'DEMENAGEMENT', slug: 'demenagement', name_fr: 'Déménagement', name_ar: 'نقل الأثاث', category_code: 'DEMENAGEMENT', is_active: true, sort_order: 20 },
  { id: 21, code: 'NUISIBLES', slug: 'traitement-nuisibles', name_fr: 'Traitement nuisibles', name_ar: 'مكافحة الحشرات', category_code: 'NUISIBLES', is_active: true, sort_order: 21 },
  { id: 22, code: 'RIDEAUX_STORES', slug: 'rideaux-stores', name_fr: 'Pose rideaux / stores', name_ar: 'تركيب الستائر والستائر المتحركة', category_code: 'RIDEAUX_STORES', is_active: true, sort_order: 22 },
  { id: 23, code: 'MONTAGE_MEUBLES', slug: 'montage-meubles', name_fr: 'Montage meubles', name_ar: 'تركيب الأثاث', category_code: 'MONTAGE_MEUBLES', is_active: true, sort_order: 23 },
  { id: 24, code: 'CUISINES_PLACARDS', slug: 'cuisines-placards', name_fr: 'Cuisines / Placards', name_ar: 'مطابخ وخزائن', category_code: 'CUISINES_PLACARDS', is_active: true, sort_order: 24 },
  { id: 25, code: 'SALLE_DE_BAIN', slug: 'salle-de-bain', name_fr: 'Salle de bain (installation)', name_ar: 'تركيب الحمامات', category_code: 'SALLE_DE_BAIN', is_active: true, sort_order: 25 },
  { id: 26, code: 'SOLAIRE', slug: 'solaire', name_fr: 'Solaire (photovoltaïque)', name_ar: 'طاقة شمسية (ألواح)', category_code: 'SOLAIRE', is_active: true, sort_order: 26 },
  { id: 27, code: 'SOLS_PARQUET', slug: 'sols-parquet', name_fr: 'Sols / Parquet', name_ar: 'الأرضيات والباركيه', category_code: 'SOLS_PARQUET', is_active: true, sort_order: 27 },
  { id: 28, code: 'PAPIER_PEINT', slug: 'papier-peint', name_fr: 'Papier peint / Tapisserie', name_ar: 'ورق الجدران والتنجيد', category_code: 'PAPIER_PEINT', is_active: true, sort_order: 28 },
  { id: 29, code: 'SECURITE_CCTV', slug: 'securite-alarme', name_fr: 'Sécurité / Alarme / CCTV', name_ar: 'الأمن والمراقبة (كاميرات وإنذار)', category_code: 'SECURITE_CCTV', is_active: true, sort_order: 29 },
  { id: 30, code: 'MULTI_SERVICES', slug: 'multi-services', name_fr: 'Multi-services (petits travaux)', name_ar: 'أشغال منزلية عامة', category_code: 'MULTI_SERVICES', is_active: true, sort_order: 30 },
];

