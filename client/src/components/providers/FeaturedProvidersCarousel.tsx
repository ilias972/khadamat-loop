import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArtisanProfileCard from "@/components/providers/ArtisanProfileCard";
import { getSortedProviders } from "@/lib/providerSorting";
import type { SortableProvider } from "@/lib/providerSorting";

// Données mockées des prestataires Club Pro (8 prestataires sélectionnés mensuellement)
const mockProviders: SortableProvider[] = [
  {
    id: 1,
    userId: 1,
    specialties: ["Menuiserie"],
    experience: 15,
    rating: "4.9",
    reviewCount: 127,
    isOnline: true,
    hourlyRate: "150.00",
    bio: "Menuisier professionnel avec 15 ans d'expérience dans la fabrication de meubles et de décoration",
    bioAr: null,
    user: {
      id: 1,
      username: "ahmed_ben_ali",
      email: "ahmed@example.com",
      password: "",
      firstName: "Ahmed",
      lastName: "Ben Ali",
      phone: "+212600000001",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Casablanca",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 45,
    city: "Casablanca"
  },
  {
    id: 2,
    userId: 2,
    specialties: ["Électricité"],
    experience: 12,
    rating: "4.7",
    reviewCount: 156,
    isOnline: false,
    hourlyRate: "120.00",
    bio: "Électricien certifié spécialisé dans les installations électriques modernes",
    bioAr: null,
    user: {
      id: 2,
      username: "mohammed_idrissi",
      email: "mohammed@example.com",
      password: "",
      firstName: "Mohammed",
      lastName: "Idrissi",
      phone: "+212600000002",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Marrakech",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 78,
    city: "Marrakech"
  },
  {
    id: 3,
    userId: 3,
    specialties: ["Nettoyage"],
    experience: 8,
    rating: "4.9",
    reviewCount: 112,
    isOnline: true,
    hourlyRate: "80.00",
    bio: "Service de nettoyage complet avec utilisation de produits écologiques",
    bioAr: null,
    user: {
      id: 3,
      username: "khadija_marrakchi",
      email: "khadija@example.com",
      password: "",
      firstName: "Khadija",
      lastName: "Marrakchi",
      phone: "+212600000003",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Marrakech",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 32,
    city: "Marrakech"
  },
  {
    id: 4,
    userId: 4,
    specialties: ["Plomberie"],
    experience: 10,
    rating: "4.8",
    reviewCount: 94,
    isOnline: true,
    hourlyRate: "100.00",
    bio: "Plombier expert en réparation et installation de tuyauterie et équipements sanitaires",
    bioAr: null,
    user: {
      id: 4,
      username: "hassan_alami",
      email: "hassan@example.com",
      password: "",
      firstName: "Hassan",
      lastName: "Alami",
      phone: "+212600000004",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Casablanca",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 67,
    city: "Casablanca"
  },
  {
    id: 5,
    userId: 5,
    specialties: ["Peinture"],
    experience: 9,
    rating: "4.6",
    reviewCount: 89,
    isOnline: false,
    hourlyRate: "90.00",
    bio: "Peintre décorateur avec expertise en finitions et rénovation",
    bioAr: null,
    user: {
      id: 5,
      username: "amina_el_fassi",
      email: "amina@example.com",
      password: "",
      firstName: "Amina",
      lastName: "El Fassi",
      phone: "+212600000005",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Rabat",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 43,
    city: "Rabat"
  },
  {
    id: 6,
    userId: 6,
    specialties: ["Jardinage"],
    experience: 7,
    rating: "4.5",
    reviewCount: 76,
    isOnline: true,
    hourlyRate: "70.00",
    bio: "Jardinier passionné spécialisé dans l'aménagement et l'entretien de jardins",
    bioAr: null,
    user: {
      id: 6,
      username: "youssef_bidaoui",
      email: "youssef@example.com",
      password: "",
      firstName: "Youssef",
      lastName: "Bidaoui",
      phone: "+212600000006",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Marrakech",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 38,
    city: "Marrakech"
  },
  {
    id: 7,
    userId: 7,
    specialties: ["Réparation"],
    experience: 11,
    rating: "4.7",
    reviewCount: 103,
    isOnline: false,
    hourlyRate: "85.00",
    bio: "Technicien polyvalent spécialisé dans la réparation d'équipements divers",
    bioAr: null,
    user: {
      id: 7,
      username: "abderrahman_tazi",
      email: "abderrahman@example.com",
      password: "",
      firstName: "Abderrahman",
      lastName: "Tazi",
      phone: "+212600000007",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Fès",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 52,
    city: "Fès"
  },
  {
    id: 8,
    userId: 8,
    specialties: ["Installation"],
    experience: 13,
    rating: "4.8",
    reviewCount: 118,
    isOnline: true,
    hourlyRate: "110.00",
    bio: "Installateur professionnel spécialisé dans les équipements modernes",
    bioAr: null,
    user: {
      id: 8,
      username: "fatima_zahra",
      email: "fatima@example.com",
      password: "",
      firstName: "Fatima",
      lastName: "Zahra",
      phone: "+212600000008",
      avatar: null,
      userType: "provider",
      isClubPro: true,
      isVerified: true,
      location: "Agadir",
      createdAt: new Date(),
    },
    isClubPro: true,
    missions: 61,
    city: "Agadir"
  }
];

interface FeaturedProvidersCarouselProps {
  className?: string;
}

export default function FeaturedProvidersCarousel({ className = "" }: FeaturedProvidersCarouselProps) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

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
  const sortedProviders = getSortedProviders(mockProviders);
  const totalSlides = Math.ceil(sortedProviders.length / visibleCount);
  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

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
            <ChevronLeft className="w-5 h-5 text-orange-500" />
          </button>

          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-orange-200 rounded-full p-3 shadow-lg hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 -mr-4 md:-mr-6"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5 text-orange-500" />
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
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
              {t("featured_providers.view_all")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
} 