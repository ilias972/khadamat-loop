import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import FeaturedProviderCard from "@/components/providers/FeaturedProviderCard";
import ArtisanProfileCard from "@/components/providers/ArtisanProfileCard";
import { Search, Filter, MapPin, Calendar, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";

// Type pour les prestataires
interface Provider {
  id: string;
  name: string;
  service: string;
  description?: string;
  location: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPro: boolean;
  avatar?: string;
  disponibilites: string[];
}

// Données mockées des prestataires
const allProviders: Provider[] = [
  {
    id: "1",
    name: "Ahmed Ben Ali",
    service: "Menuisier",
    description: "Menuisier professionnel avec 15 ans d'expérience dans la fabrication de meubles et de décoration",
    location: "Casablanca",
    rating: 4.9,
    reviewCount: 127,
    isVerified: true,
    isPro: true,
    avatar: undefined,
    disponibilites: []
  },
  {
    id: "2",
    name: "Fatima Zahra",
    service: "Nettoyage",
    description: "Service de nettoyage fiable pour maisons et bureaux",
    location: "Rabat",
    rating: 4.8,
    reviewCount: 89,
    isVerified: true,
    isPro: false,
    avatar: undefined,
    disponibilites: []
  },
  {
    id: "3",
    name: "Mohammed Idrissi",
    service: "Électricien",
    description: "Électricien certifié spécialisé dans les installations électriques modernes",
    location: "Marrakech",
    rating: 4.7,
    reviewCount: 156,
    isVerified: true,
    isPro: true,
    avatar: undefined,
    disponibilites: []
  },
  {
    id: "4",
    name: "Abderrahman Tazi",
    service: "Plombier",
    description: "Plombier expert en réparation et installation de tuyauterie et équipements sanitaires",
    location: "Fès",
    rating: 4.6,
    reviewCount: 94,
    isVerified: true,
    isPro: false,
    avatar: undefined,
    disponibilites: []
  },
  {
    id: "5",
    name: "Khadija Marrakchi",
    service: "Nettoyage",
    description: "Service de nettoyage complet avec utilisation de produits écologiques",
    location: "Marrakech",
    rating: 4.9,
    reviewCount: 112,
    isVerified: true,
    isPro: true,
    avatar: undefined,
    disponibilites: []
  },
  {
    id: "6",
    name: "Youssef Bidaoui",
    service: "Peintre",
    description: "Peintre professionnel spécialisé dans la peinture intérieure et extérieure",
    location: "Casablanca",
    rating: 4.5,
    reviewCount: 67,
    isVerified: false,
    isPro: false,
    avatar: undefined,
    disponibilites: []
  }
];

const services = ["Tous", "Cuisinière", "Électricien", "Jardinage", "Ménage", "Peintre", "Plombier"];
const cities = ["Toutes les villes", "Rabat", "Casablanca", "Tanger", "Marrakech", "Agadir", "Fès", "Oujda"];

export default function Prestataires() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("Tous");
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Utiliser des listes locales pour permettre l'ajout dynamique
  const [serviceOptions, setServiceOptions] = useState([...services]);
  const [cityOptions, setCityOptions] = useState([...cities]);

  // Fonctions pour le calendrier
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Ajouter les jours vides du début
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Ajouter tous les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    // Vérifier si au moins un prestataire est disponible ce jour-là
    const dateString = formatDate(date);
    return allProviders.some((provider: Provider) => 
      provider.disponibilites && Array.isArray(provider.disponibilites) && provider.disponibilites.includes(dateString)
    );
  };

  // Fonction pour vérifier si un prestataire spécifique est disponible à une date
  const isProviderAvailableOnDate = (provider: Provider, date: string) => {
    return provider.disponibilites && Array.isArray(provider.disponibilites) && provider.disponibilites.includes(date);
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Fonction pour nettoyer les paramètres d'URL
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedService("Tous");
    setSelectedCity("Toutes les villes");
    setSelectedDate(null);
    setShowCalendar(false);
  };

  // Lire les paramètres d'URL au chargement
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const serviceParam = urlParams.get('service');
    const villeParam = urlParams.get('ville');
    const providerParam = urlParams.get('provider');

    // Mettre à jour les filtres avec les paramètres d'URL
    if (serviceParam) {
      if (!serviceOptions.includes(serviceParam)) {
        setServiceOptions(prev => [...prev, serviceParam]);
      }
      setSelectedService(serviceParam);
    }

    if (villeParam) {
      if (!cityOptions.includes(villeParam)) {
        setCityOptions(prev => [...prev, villeParam]);
      }
      setSelectedCity(villeParam);
    }

    // On ne touche pas à searchTerm ici
    // if (providerParam) {
    //   setSearchTerm(prev => prev ? `${prev} ${providerParam}` : providerParam);
    // }
  }, [location]);

  // Synchroniser le champ recherche et le dropdown service
  useEffect(() => {
    if (selectedService && selectedService !== 'Tous') {
      setSearchTerm(selectedService);
    }
  }, [selectedService]);

  // Filtrage des prestataires
  const filteredProviders = useMemo(() => {
    return allProviders.filter(provider => {
      // Filtre par recherche
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre par service
      const matchesService = selectedService === "Tous" || provider.service === selectedService;

      // Filtre par ville
      const matchesCity = selectedCity === "Toutes les villes" || provider.location === selectedCity;

      // Filtre par date sélectionnée
      const matchesDate = !selectedDate || isProviderAvailableOnDate(provider, formatDate(selectedDate));

      return matchesSearch && matchesService && matchesCity && matchesDate;
    }).sort((a, b) => {
      // Tri par disponibilité si une date est sélectionnée
      if (selectedDate) {
        const aAvailable = isProviderAvailableOnDate(a, formatDate(selectedDate));
        const bAvailable = isProviderAvailableOnDate(b, formatDate(selectedDate));
        
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
      }
      
      // Tri par Club Pro en priorité
      if (a.isPro && !b.isPro) return -1;
      if (!a.isPro && b.isPro) return 1;
      
      // Tri par note décroissante
      return b.rating - a.rating;
    });
  }, [searchTerm, selectedService, selectedCity, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trouvez le bon prestataire
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des milliers de prestataires qualifiés et vérifiés prêts à vous aider dans vos projets
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Rechercher un prestataire, un service ou une ville..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filtres :</span>
            </div>

            {/* Filtre Service */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
            >
              {serviceOptions.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>

            {/* Filtre Ville */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
            >
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>



            {/* Bouton Calendrier */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs md:text-sm text-gray-700">
                {selectedDate ? selectedDate.toLocaleDateString('fr-FR') : 'Choisir une date'}
              </span>
            </button>

            {/* Bouton Effacer les filtres */}
            {(searchTerm || selectedService !== "Tous" || selectedCity !== "Toutes les villes" || selectedDate) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors"
              >
                <span className="text-sm">{t("search.clear_filters")}</span>
              </button>
            )}
          </div>

          {/* Calendrier moderne */}
          {showCalendar && (
            <div className="mt-6 p-4 md:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              {/* Header du calendrier */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => changeMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => changeMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille des jours */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentMonth).map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-10" />;
                  }

                           const isAvailable = isDateAvailable(day);
         const isPast = isDateInPast(day);
         const isSelected = selectedDate && formatDate(selectedDate) === formatDate(day);
         const canSelect = !isPast; // Permettre la sélection de toutes les dates non passées

         return (
           <button
             key={index}
             onClick={() => {
               if (canSelect) {
                 setSelectedDate(day);
               }
             }}
             disabled={!canSelect}
             className={`
               h-10 w-full rounded-lg text-sm font-medium transition-all duration-200 relative
               ${isSelected 
                 ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                 : canSelect
                   ? isAvailable
                     ? 'hover:bg-orange-50 text-gray-900 border border-transparent hover:border-orange-200'
                     : 'hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200'
                   : 'text-gray-300 cursor-not-allowed bg-gray-50'
               }
             `}
           >
             <span className="relative z-10">{day.getDate()}</span>
             {isAvailable && !isSelected && canSelect && (
               <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
             )}
           </button>
         );
                })}
              </div>

              {/* Légende */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>{t("calendar.available")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span>{t("calendar.unavailable")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>{t("calendar.selected")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Résultats */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {filteredProviders.length} prestataire{filteredProviders.length > 1 ? 's' : ''} trouvé{filteredProviders.length > 1 ? 's' : ''}
              </p>
              
              {/* Filtres actifs */}
              {(searchTerm || selectedService !== "Tous" || selectedCity !== "Toutes les villes" || selectedDate) && (
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {t("search.search_term")}: {searchTerm}
                    </span>
                  )}
                  {selectedService !== "Tous" && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {t("search.service")}: {selectedService}
                    </span>
                  )}
                  {selectedCity !== "Toutes les villes" && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {t("search.city")}: {selectedCity}
                    </span>
                  )}
                  {selectedDate && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {t("search.date")}: {new Date(selectedDate).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grille des prestataires */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {filteredProviders.length > 0 ? (
            <>
              {/* Affichage séparé par disponibilité si une date est sélectionnée */}
              {selectedDate && (
                <>
                  {/* Prestataires disponibles à cette date exacte */}
                  {filteredProviders.filter(p => isProviderAvailableOnDate(p, formatDate(selectedDate))).length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        Disponibles le {selectedDate.toLocaleDateString('fr-FR')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredProviders
                          .filter(p => isProviderAvailableOnDate(p, formatDate(selectedDate)))
                          .map((provider) => (
                            <div key={provider.id} className="relative group">
                              <div className="absolute top-4 right-4 z-10">
                                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">✓</span>
                                </div>
                              </div>
                              <ArtisanProfileCard provider={provider} />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Prestataires disponibles autour de cette date */}
                  {filteredProviders.filter(p => !isProviderAvailableOnDate(p, formatDate(selectedDate))).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        Autres prestataires (disponibles autour de cette date)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredProviders
                          .filter(p => !isProviderAvailableOnDate(p, formatDate(selectedDate)))
                          .map((provider) => (
                            <div key={provider.id} className="relative group">
                              <div className="absolute top-4 right-4 z-10">
                                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">✗</span>
                                </div>
                              </div>
                              <ArtisanProfileCard provider={provider} />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Affichage normal si aucune date n'est sélectionnée */}
              {!selectedDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProviders.map((provider) => (
                    <div key={provider.id} className="relative group">
                      <ArtisanProfileCard provider={provider} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun prestataire trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 