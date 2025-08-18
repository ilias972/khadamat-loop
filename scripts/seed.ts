import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cities = [
  { name: 'Casablanca', slug: 'casablanca', lat: 33.5731, lng: -7.5898 },
  { name: 'Rabat', slug: 'rabat', lat: 34.0209, lng: -6.8416 },
  { name: 'Marrakech', slug: 'marrakech', lat: 31.6295, lng: -7.9811 },
  { name: 'Fes', slug: 'fes', lat: 34.0181, lng: -5.0078 },
  { name: 'Tanger', slug: 'tanger', lat: 35.7595, lng: -5.8340 },
  { name: 'Agadir', slug: 'agadir', lat: 30.4278, lng: -9.5981 },
  { name: 'Kenitra', slug: 'kenitra', lat: 34.2610, lng: -6.5802 },
  { name: 'Oujda', slug: 'oujda', lat: 34.6814, lng: -1.9086 },
  { name: 'Meknes', slug: 'meknes', lat: 33.8935, lng: -5.5473 },
  { name: 'Tetouan', slug: 'tetouan', lat: 35.5785, lng: -5.3684 },
  { name: 'Safi', slug: 'safi', lat: 32.2994, lng: -9.2372 }
]

const services = [
  { code: 'PLOMBERIE', slug: 'plomberie', name_fr: 'Plomberie', name_ar: 'سباكة', category_code: 'GENERAL', sort_order: 1 },
  { code: 'ELECTRICITE', slug: 'electricite', name_fr: 'Électricité', name_ar: 'كهرباء', category_code: 'GENERAL', sort_order: 2 },
  { code: 'PEINTURE', slug: 'peinture', name_fr: 'Peinture', name_ar: 'دهان', category_code: 'GENERAL', sort_order: 3 },
  { code: 'MENAGE', slug: 'menage', name_fr: 'Ménage', name_ar: 'تنظيف', category_code: 'GENERAL', sort_order: 4 },
  { code: 'JARDINAGE', slug: 'jardinage', name_fr: 'Jardinage', name_ar: 'بستنة', category_code: 'GENERAL', sort_order: 5 },
  { code: 'GARDE_ENFANTS', slug: 'garde-enfants', name_fr: "Garde d'enfants", name_ar: 'رعاية الأطفال', category_code: 'GENERAL', sort_order: 6 },
  { code: 'COURS_PARTICULIERS', slug: 'cours-particuliers', name_fr: 'Cours particuliers', name_ar: 'دروس خاصة', category_code: 'GENERAL', sort_order: 7 },
  { code: 'COIFFURE', slug: 'coiffure', name_fr: 'Coiffure', name_ar: 'حلاقة', category_code: 'GENERAL', sort_order: 8 },
  { code: 'ESTHETIQUE', slug: 'esthetique', name_fr: 'Esthétique', name_ar: 'تجميل', category_code: 'GENERAL', sort_order: 9 },
  { code: 'INFORMATIQUE', slug: 'informatique', name_fr: 'Réparation informatique', name_ar: 'إصلاح الحواسيب', category_code: 'GENERAL', sort_order: 10 },
  { code: 'PHOTOGRAPHIE', slug: 'photographie', name_fr: 'Photographie', name_ar: 'تصوير', category_code: 'GENERAL', sort_order: 11 },
  { code: 'DECORATION', slug: 'decoration', name_fr: 'Décoration', name_ar: 'ديكور', category_code: 'GENERAL', sort_order: 12 },
  { code: 'COUTURE', slug: 'couture', name_fr: 'Couture', name_ar: 'خياطة', category_code: 'GENERAL', sort_order: 13 },
  { code: 'DEMENAGEMENT', slug: 'demenagement', name_fr: 'Déménagement', name_ar: 'نقل الأثاث', category_code: 'GENERAL', sort_order: 14 },
  { code: 'MENUISERIE', slug: 'menuiserie', name_fr: 'Menuiserie', name_ar: 'نجارة', category_code: 'GENERAL', sort_order: 15 },
  { code: 'SERRURERIE', slug: 'serrurerie', name_fr: 'Serrurerie', name_ar: 'حدادة', category_code: 'GENERAL', sort_order: 16 },
  { code: 'MACONNERIE', slug: 'maconnerie', name_fr: 'Maçonnerie', name_ar: 'بناء', category_code: 'GENERAL', sort_order: 17 },
  { code: 'CARRELAGE', slug: 'carrelage', name_fr: 'Carrelage', name_ar: 'تبليط', category_code: 'GENERAL', sort_order: 18 },
  { code: 'PLATRERIE', slug: 'platrerie', name_fr: 'Plâtrerie', name_ar: 'جبس', category_code: 'GENERAL', sort_order: 19 },
  { code: 'CLIMATISATION', slug: 'climatisation', name_fr: 'Climatisation', name_ar: 'تكييف', category_code: 'GENERAL', sort_order: 20 },
  { code: 'CHAUFFAGE', slug: 'chauffage', name_fr: 'Chauffage', name_ar: 'تدفئة', category_code: 'GENERAL', sort_order: 21 },
  { code: 'AUTO_ECOLE', slug: 'auto-ecole', name_fr: 'Auto-école', name_ar: 'مدرسة تعليم السياقة', category_code: 'GENERAL', sort_order: 22 },
  { code: 'TAXI', slug: 'taxi', name_fr: 'Taxi', name_ar: 'طاكسي', category_code: 'GENERAL', sort_order: 23 },
  { code: 'LOCATION_VOITURE', slug: 'location-voiture', name_fr: 'Location de voiture', name_ar: 'كراء السيارات', category_code: 'GENERAL', sort_order: 24 },
  { code: 'GUIDE_TOURISTIQUE', slug: 'guide-touristique', name_fr: 'Guide touristique', name_ar: 'دليل سياحي', category_code: 'GENERAL', sort_order: 25 },
  { code: 'TRADUCTION', slug: 'traduction', name_fr: 'Traduction', name_ar: 'ترجمة', category_code: 'GENERAL', sort_order: 26 },
  { code: 'CUISINE', slug: 'cuisine', name_fr: 'Cuisine', name_ar: 'طبخ', category_code: 'GENERAL', sort_order: 27 },
  { code: 'BOULANGERIE', slug: 'boulangerie', name_fr: 'Boulangerie', name_ar: 'مخبزة', category_code: 'GENERAL', sort_order: 28 },
  { code: 'PATISSERIE', slug: 'patisserie', name_fr: 'Pâtisserie', name_ar: 'حلويات', category_code: 'GENERAL', sort_order: 29 },
  { code: 'LIVRAISON', slug: 'livraison', name_fr: 'Livraison', name_ar: 'توصيل', category_code: 'GENERAL', sort_order: 30 }
]

async function main() {
  await prisma.city.createMany({ data: cities, skipDuplicates: true })
  await prisma.serviceCatalog.createMany({ data: services, skipDuplicates: true })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
