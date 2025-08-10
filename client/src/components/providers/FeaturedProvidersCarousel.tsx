import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ArtisanProfileCard from "@/components/providers/ArtisanProfileCard";
import { getSortedProviders } from "@/lib/providerSorting";
import type { SortableProvider } from "@/lib/providerSorting";

// Aucune donnée de prestataire en dur
const mockProviders: SortableProvider[] = [];

interface FeaturedProvidersCarouselProps {
  className?: string;
}

export default function FeaturedProvidersCarousel({ className = "" }: FeaturedProvidersCarouselProps) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const { data: providersData, isLoading } = useQuery<SortableProvider[]>({
    queryKey: ["/api/providers?clubPro=true"],
  });

  // Détection de la taille d'écran et gestion du clavier
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevSlide();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextSlide();
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide]); // Ajouter currentSlide comme dépendance

  // Déterminer le nombre de prestataires visibles selon la taille d'écran
  const getVisibleCount = () => {
    if (windowWidth < 768) return 1; // Mobile
    if (windowWidth < 1024) return 2; // Tablette
    if (windowWidth < 1280) return 3; // Desktop moyen
    return 4; // Desktop large
  };

  const visibleCount = getVisibleCount();
  const providerList = providersData ?? [];
  const sortedProviders = getSortedProviders(providerList);
  const totalSlides = Math.ceil(sortedProviders.length / visibleCount);
  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  if (sortedProviders.length === 0) {
    return (
      <section className={`py-16 bg-gradient-to-br from-gray-50 to-orange-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("featured_providers.title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            {t("featured_providers.empty")}
          </p>
          <Link href="/register">
            <Button
              variant="outline"
              className="h-11 px-5 rounded-xl border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              {t("featured_providers.cta")}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Fonctions de navigation pour le clavier
  const handleNextSlide = () => {
    if (canGoNext) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // Obtenir les prestataires pour le slide actuel
  const getCurrentSlideProviders = () => {
    const startIndex = currentSlide * visibleCount;
    return sortedProviders.slice(startIndex, startIndex + visibleCount);
  };

  if (isLoading) {
    return (
      <section className={`py-16 bg-gradient-to-br from-gray-50 to-orange-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("featured_providers.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("featured_providers.subtitle")}
            </p>
          </div>

          <div className="px-8 md:px-12">
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-full rounded-2xl h-80 animate-pulse bg-gray-200/70" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-orange-50 ${className}`}>
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

        {/* Carousel Container */}
        <div className="relative">
          {/* Boutons de navigation */}
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-orange-200 rounded-full p-3 shadow-lg hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 -ml-4 md:-ml-6"
            aria-label="Précédent"
          >
            <ChevronLeft aria-hidden="true" focusable="false" className="w-5 h-5 text-orange-500" />
          </button>

          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-orange-200 rounded-full p-3 shadow-lg hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 -mr-4 md:-mr-6"
            aria-label="Suivant"
          >
            <ChevronRight aria-hidden="true" focusable="false" className="w-5 h-5 text-orange-500" />
          </button>

          {/* Conteneur des prestataires */}
          <div className="px-8 md:px-12">
            <div 
              className="grid gap-6 transition-all duration-300 ease-in-out"
              style={{
                gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                minHeight: '400px' // Hauteur minimale pour éviter les sauts
              }}
            >
              {getCurrentSlideProviders().map((provider) => (
                <div key={provider.id} className="w-full animate-fade-in">
                  <ArtisanProfileCard 
                    provider={{
                      id: provider.id.toString(),
                      name: `${provider.user.firstName} ${provider.user.lastName}`,
                      service: provider.specialties?.[0] || "Service",
                      description: provider.bio || undefined,
                      location: provider.city,
                      rating: parseFloat(provider.rating || "0"),
                      reviewCount: provider.reviewCount || 0,
                      isVerified: provider.user.isVerified || false,
                      isPro: provider.isClubPro,
                      avatar: provider.user.avatar || undefined
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>

                  {/* Indicateurs de pagination */}
        {totalSlides > 1 && (
          <div className="flex flex-col items-center gap-4 mt-8">
            {/* Indicateur de position */}
            <div className="text-sm text-gray-600">
              {currentSlide + 1} sur {totalSlides} • {visibleCount} prestataire{visibleCount > 1 ? 's' : ''} par vue
            </div>
            
            {/* Points de navigation */}
            <div className="flex justify-center items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 border-2 ${
                    index === currentSlide 
                      ? 'bg-orange-500 border-orange-500 scale-125 shadow' 
                      : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                  }`}
                  aria-label={`Aller au slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        </div>

        {/* Bouton voir plus */}
        <div className="text-center mt-12">
          <Link href="/prestataires">
            <Button
              asChild
              variant="outline"
              className="h-11 px-5 rounded-xl border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <span>{t("featured_providers.view_all")}</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}