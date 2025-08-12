import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import ArtisanProfileCard from "@/components/providers/ArtisanProfileCard";
import { Search, Filter, MapPin, Calendar, DollarSign } from "lucide-react";
import { getFilteredAndSortedProviders } from "@/lib/providerSorting";
import type { SortableProvider } from "@/lib/providerSorting";
import { getNameBySlug } from "@/lib/servicesCatalog";

// Liste des prestataires fournie par l'API
const allProviders: SortableProvider[] = [];

export default function Prestataires() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(""); // slug
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const services = [
    "plomberie",
    "electricite",
    "menage",
    "jardinage",
    "peinture",
    "menuiserie",
    "nettoyage",
    "reparation",
  ];

  const cities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Agadir",
    "Tanger",
    "Autre",
  ];

  const ratings = [4.5, 4.0, 3.5, 3.0];

  // Récupérer les filtres depuis l'URL si présents
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceFilter = urlParams.get('service');
    const locationFilter = urlParams.get('location');
    const providerFilter = urlParams.get('provider');

    if (serviceFilter) {
      const decodedService = decodeURIComponent(serviceFilter).toLowerCase();
      setSelectedService(decodedService);
    }
    if (locationFilter) {
      const decodedCity = decodeURIComponent(locationFilter);
      setSelectedCity(cities.includes(decodedCity) ? decodedCity : "Autre");
    }
    if (providerFilter) {
      setSearchTerm(decodeURIComponent(providerFilter));
    }
  }, []);

  // Fonction pour générer les jours du mois
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

  // Fonction pour vérifier si une date est disponible
  const isDateAvailable = (date: Date) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    // Mock - en réalité, cela viendrait de l'API
    return Math.random() > 0.3; // 70% de chance d'être disponible
  };

  // Fonction pour vérifier si un prestataire est disponible à une date donnée
  const isProviderAvailableOnDate = (provider: SortableProvider, date: string) => {
    // Mock - en réalité, cela viendrait de l'API
    return Math.random() > 0.2; // 80% de chance d'être disponible
  };

  // Fonction pour vérifier si une date est dans le passé
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Fonction pour changer de mois
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedService("");
    setSelectedCity("");
    setSelectedRating(null);
    setSelectedDate("");
  };

  // Filtrer et trier les prestataires
  const filteredProviders = useMemo(() => {
    let filtered = allProviders.filter(provider => {
      const matchesSearch = searchTerm === "" || 
        `${provider.user.firstName} ${provider.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialties?.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        provider.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesService =
        selectedService === "" ||
        provider.specialties?.some((specialty) =>
          specialty.toLowerCase().includes(selectedService.toLowerCase()),
        );
      
      const matchesCity =
        selectedCity === "" ||
        selectedCity === "Autre" ||
        provider.city.toLowerCase().includes(selectedCity.toLowerCase());
      
      const matchesRating = selectedRating === null || 
        parseFloat(provider.rating || "0") >= selectedRating;
      
      return matchesSearch && matchesService && matchesCity && matchesRating;
    });

    // Appliquer le tri selon la logique Club Pro
    return getFilteredAndSortedProviders(
      filtered,
      selectedCity === "Autre" ? undefined : selectedCity
    );
  }, [searchTerm, selectedService, selectedCity, selectedRating]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {t("prestataires.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("prestataires.subtitle")}
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t("prestataires.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 bg-orange-500 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {t("prestataires.filters")}
            </button>
          </div>

          {/* Filtres avancés */}
          {(showFilters || window.innerWidth >= 1024) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("prestataires.service_label")}</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">{t("prestataires.all_services")}</option>
                    {services.map((slug) => (
                      <option key={slug} value={slug}>{getNameBySlug(slug, language)}</option>
                    ))}
                  </select>
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("prestataires.city_label")}</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">{t("prestataires.all_cities")}</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("prestataires.rating_label")}</label>
                  <select
                    value={selectedRating || ""}
                    onChange={(e) => setSelectedRating(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">{t("prestataires.all_ratings")}</option>
                    {ratings.map(rating => (
                      <option key={rating} value={rating}>{rating}+ {t("prestataires.stars")}</option>
                    ))}
                  </select>
                </div>

                {/* Effacer les filtres */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    {t("prestataires.clear_filters")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredProviders.length} {filteredProviders.length === 1 ? t("prestataires.results_count") : t("prestataires.results_count_plural")}
            </h2>
          </div>

                     {/* Grille des prestataires */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredProviders.map((provider) => (
               <ArtisanProfileCard
                 key={provider.id}
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
             ))}
           </div>

          {/* Pagination simplifiée */}
          {filteredProviders.length > 0 && (
            <div className="flex items-center justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 bg-orange-500 text-white rounded-lg">1</button>
              </nav>
            </div>
          )}

          {/* Aucun résultat */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("prestataires.no_results_title")}</h3>
              <p className="text-gray-600 mb-4">
                {t("prestataires.no_results_desc")}
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                {t("prestataires.clear_all_filters")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 