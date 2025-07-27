import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import FeaturedProviderCard from "./FeaturedProviderCard";

// Données mockées des prestataires en vedette
const featuredProviders = [
  {
    id: "1",
    name: "Ahmed Benali",
    service: "Électricien",
    location: "Rabat",
    rating: 4.8,
    reviewCount: 52,
    price: "À partir de 150 DHS",
    isVerified: true,
    isPro: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "2",
    name: "Fatima El Mansouri",
    service: "Ménage",
    location: "Casablanca",
    rating: 4.9,
    reviewCount: 78,
    price: "À partir de 120 DHS",
    isVerified: true,
    isPro: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c8a6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "3",
    name: "Omar Tazi",
    service: "Plombier",
    location: "Marrakech",
    rating: 4.7,
    reviewCount: 45,
    price: "À partir de 180 DHS",
    isVerified: true,
    isPro: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "4",
    name: "Aicha Zerouali",
    service: "Jardinage",
    location: "Fès",
    rating: 4.6,
    reviewCount: 38,
    price: "À partir de 200 DHS",
    isVerified: true,
    isPro: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "5",
    name: "Karim Alami",
    service: "Peintre",
    location: "Tanger",
    rating: 4.5,
    reviewCount: 29,
    price: "À partir de 160 DHS",
    isVerified: true,
    isPro: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: "6",
    name: "Sara Bennani",
    service: "Cuisinière",
    location: "Agadir",
    rating: 4.9,
    reviewCount: 63,
    price: "À partir de 140 DHS",
    isVerified: true,
    isPro: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c8a6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
];

export default function FeaturedProviders() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, featuredProviders.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, featuredProviders.length - 3)) % Math.max(1, featuredProviders.length - 3));
  };

  const visibleProviders = featuredProviders.slice(currentIndex, currentIndex + 4);

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
        <div className="relative">
          {/* Boutons de navigation */}
          {featuredProviders.length > 4 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all border border-gray-200"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all border border-gray-200"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Grille des prestataires */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-8 lg:px-12">
            {visibleProviders.map((provider) => (
              <FeaturedProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          {/* Indicateurs de navigation */}
          {featuredProviders.length > 4 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.max(1, featuredProviders.length - 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
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