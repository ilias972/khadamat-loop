import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient() as any;

const cities = [
  { name: "Casablanca", slug: "casablanca", lat: 33.57311, lng: -7.589843 },
  { name: "Rabat", slug: "rabat", lat: 34.020882, lng: -6.84165 },
  { name: "Marrakech", slug: "marrakech", lat: 31.62947, lng: -7.981084 }
];

const providers = [
  {
    user: {
      email: "ahmed@example.com",
      password: "hashed_password",
      phone: "+212612345678",
      preferredLang: "fr"
    },
    profile: {
      bio: "Électricien professionnel avec 8 ans d'expérience",
      specialties: ["Électricité", "Domotique"],
      experience: 8,
      rating: 4.9,
      reviewCount: 127,
      isOnline: true,
      hourlyRate: 150,
      citySlug: "casablanca"
    },
    service: {
      name: "Électricité",
      nameAr: "الكهرباء",
      description: "Installation électrique, dépannage et mise aux normes",
      descriptionAr: "تركيب كهربائي وإصلاحات وتحديث المعايير",
      category: "home_maintenance",
      icon: "bolt",
      basePrice: 150,
      isPopular: true
    }
  },
  {
    user: {
      email: "fatima@example.com",
      password: "hashed_password",
      phone: "+212623456789",
      preferredLang: "fr"
    },
    profile: {
      bio: "Spécialiste du ménage et du repassage",
      specialties: ["Ménage", "Repassage"],
      experience: 5,
      rating: 4.8,
      reviewCount: 89,
      isOnline: true,
      hourlyRate: 80,
      citySlug: "rabat"
    },
    service: {
      name: "Ménage",
      nameAr: "التنظيف",
      description: "Services de nettoyage pour particuliers et entreprises",
      descriptionAr: "خدمات التنظيف للأفراد والشركات",
      category: "cleaning",
      icon: "broom",
      basePrice: 80,
      isPopular: true
    }
  },
  {
    user: {
      email: "omar@example.com",
      password: "hashed_password",
      phone: "+212634567890",
      preferredLang: "fr"
    },
    profile: {
      bio: "Plombier expert disponible en urgence",
      specialties: ["Plomberie", "Urgence 24/7"],
      experience: 12,
      rating: 4.7,
      reviewCount: 64,
      isOnline: false,
      hourlyRate: 120,
      citySlug: "marrakech"
    },
    service: {
      name: "Plomberie",
      nameAr: "السباكة",
      description: "Réparations, installations et dépannages d'urgence 24/7",
      descriptionAr: "إصلاحات وتركيبات وخدمات طوارئ على مدار الساعة",
      category: "home_maintenance",
      icon: "wrench",
      basePrice: 120,
      isPopular: true
    }
  }
];

async function upsertCities() {
  const entries = new Map<string, number>();
  for (const city of cities) {
    const record = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        name: city.name,
        lat: city.lat,
        lng: city.lng
      },
      create: {
        name: city.name,
        slug: city.slug,
        lat: city.lat,
        lng: city.lng
      }
    });
    entries.set(city.slug, record.id);
  }
  return entries;
}

async function seedProviders(cityIndex: Map<string, number>) {
  for (const provider of providers) {
    const user = await prisma.user.upsert({
      where: { email: provider.user.email },
      update: {
        password: provider.user.password,
        phone: provider.user.phone,
        preferredLang: provider.user.preferredLang ?? null,
        isVerified: true,
        isDemo: true,
        role: "PROVIDER"
      },
      create: {
        email: provider.user.email,
        password: provider.user.password,
        phone: provider.user.phone,
        preferredLang: provider.user.preferredLang ?? null,
        role: "PROVIDER",
        isVerified: true,
        isDemo: true
      }
    });

    const cityMeta = provider.profile.citySlug
      ? cities.find((c) => c.slug === provider.profile.citySlug)
      : undefined;
    const cityId = provider.profile.citySlug ? cityIndex.get(provider.profile.citySlug) : undefined;

    const providerRecord = await prisma.provider.upsert({
      where: { userId: user.id },
      update: {
        bio: provider.profile.bio,
        specialties: provider.profile.specialties.join(", "),
        experience: provider.profile.experience,
        rating: provider.profile.rating,
        reviewCount: provider.profile.reviewCount,
        isVerified: true,
        isOnline: provider.profile.isOnline,
        hourlyRate: provider.profile.hourlyRate,
        cityId: cityId,
        lat: cityMeta?.lat ?? null,
        lng: cityMeta?.lng ?? null
      },
      create: {
        userId: user.id,
        bio: provider.profile.bio,
        specialties: provider.profile.specialties.join(", "),
        experience: provider.profile.experience,
        rating: provider.profile.rating,
        reviewCount: provider.profile.reviewCount,
        isVerified: true,
        isOnline: provider.profile.isOnline,
        hourlyRate: provider.profile.hourlyRate,
        cityId: cityId,
        lat: cityMeta?.lat ?? null,
        lng: cityMeta?.lng ?? null
      }
    });

    const existingService = await prisma.service.findFirst({
      where: {
        providerId: providerRecord.id,
        name: provider.service.name
      }
    });

    if (existingService) {
      await prisma.service.update({
        where: { id: existingService.id },
        data: {
          nameAr: provider.service.nameAr,
          description: provider.service.description,
          descriptionAr: provider.service.descriptionAr,
          category: provider.service.category,
          icon: provider.service.icon,
          basePrice: provider.service.basePrice,
          isPopular: provider.service.isPopular
        }
      });
    } else {
      await prisma.service.create({
        data: {
          providerId: providerRecord.id,
          name: provider.service.name,
          nameAr: provider.service.nameAr,
          description: provider.service.description,
          descriptionAr: provider.service.descriptionAr,
          category: provider.service.category,
          icon: provider.service.icon,
          basePrice: provider.service.basePrice,
          isPopular: provider.service.isPopular
        }
      });
    }
  }
}

async function main() {
  console.log("\n➡️  Seeding reference data (users, providers, services)...");
  const cityIndex = await upsertCities();
  await seedProviders(cityIndex);
  console.log("✅ Seed completed.");
}

main()
  .catch(error => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
