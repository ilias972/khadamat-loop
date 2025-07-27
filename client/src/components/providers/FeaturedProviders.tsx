import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import FeaturedProviderCard from "./FeaturedProviderCard";
import ArtisanProfileCard from "@/components/providers/ArtisanProfileCard";

// Données mockées des prestataires en vedette
const featuredProviders = [
  {
    id: "1",
    name: "Ahmed Ben Ali",
    nameAr: "أحمد بن علي",
    service: "Menuisier",
    description: "Menuisier professionnel avec 15 ans d'expérience dans la fabrication de meubles et de décoration",
    location: "Casablanca",
    rating: 4.9,
    reviewCount: 127,
    isVerified: true,
    isPro: true,
    avatar: undefined,
    specialties: ["Meubles sur mesure", "Parquet"],
    missionsCount: 150
  },
  {
    id: "2",
    name: "Fatima Zahra",
    nameAr: "فاطمة الزهراء",
    service: "Nettoyage",
    description: "Service de nettoyage fiable pour maisons et bureaux",
    location: "Rabat",
    rating: 4.8,
    reviewCount: 89,
    isVerified: true,
    isPro: false,
    avatar: undefined,
    specialties: ["Ménage écologique", "Repassage"],
    missionsCount: 95
  },
  {
    id: "3",
    name: "Mohammed Idrissi",
    nameAr: "محمد الإدريسي",
    service: "Électricien",
    description: "Électricien certifié spécialisé dans les installations électriques modernes",
    location: "Marrakech",
    rating: 4.7,
    reviewCount: 156,
    isVerified: true,
    isPro: true,
    avatar: undefined,
    specialties: ["Domotique", "Tableaux électriques"],
    missionsCount: 203
  },
  {
    id: "4",
    name: "Khadija Marrakchi",
    nameAr: "خديجة المراكشي",
    service: "Nettoyage",
    description: "Service de nettoyage complet avec utilisation de produits écologiques",
    location: "Marrakech",
    rating: 4.9,
    reviewCount: 112,
    isVerified: true,
    isPro: true,
    avatar: undefined,
    specialties: ["Nettoyage profond", "Désinfection"],
    missionsCount: 140
  }
];

export default function FeaturedProviders() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const cardsToShow = 3;
  const pageCount = Math.ceil(featuredProviders.length / cardsToShow);
  const total = featuredProviders.length;
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < pageCount - 1;
  const visibleProviders = featuredProviders.slice(currentPage * cardsToShow, currentPage * cardsToShow + cardsToShow);

  const nextSlide = () => {
    if (canGoNext) setCurrentPage(currentPage + 1);
  };
  const prevSlide = () => {
    if (canGoPrev) setCurrentPage(currentPage - 1);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Titre et description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("featured_providers.title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("featured_providers.subtitle")}
          </p>
        </div>

        {/* Slider des prestataires */}
        <div className="relative w-full flex flex-col items-center">
          {/* Boutons navigation */}
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-orange-200 rounded-full p-2 shadow-md hover:bg-orange-50 disabled:opacity-30"
            style={{marginLeft: '-24px'}}
          >
            <ChevronLeft className="w-6 h-6 text-orange-500" />
          </button>
          <div className="flex flex-row overflow-x-auto gap-6 px-8 py-2 scrollbar-hide justify-center mx-auto">
            {visibleProviders.map((provider) => (
              <div key={provider.id} className="min-w-[320px] max-w-xs w-full flex-shrink-0">
                <ArtisanProfileCard provider={{
                  ...provider,
                  nameAr: provider.nameAr,
                  description: provider.description,
                  specialties: provider.specialties,
                  missionsCount: provider.missionsCount
                }} />
              </div>
            ))}
          </div>
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-orange-200 rounded-full p-2 shadow-md hover:bg-orange-50 disabled:opacity-30"
            style={{marginRight: '-24px'}}
          >
            <ChevronRight className="w-6 h-6 text-orange-500" />
          </button>
          {/* Dots de pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-200 border-2 ${
                  idx === currentPage ? 'bg-orange-500 border-orange-500 scale-125 shadow' : 'bg-gray-200 border-gray-300'
                }`}
                onClick={() => setCurrentPage(idx)}
                aria-label={`Aller à la page ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bouton voir plus */}
        <div className="text-center mt-12">
          <Link href="/artisans">
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
              {t("featured_providers.view_all")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
} 