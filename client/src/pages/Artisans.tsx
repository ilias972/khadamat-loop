import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import FeaturedProviderCard from "@/components/providers/FeaturedProviderCard";
import { Search, Filter, MapPin, Calendar, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";

// Données mockées des prestataires
const allProviders = [
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
    priceRange: "150-200",
    available: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["09:00-12:00", "14:00-18:00"],
      tuesday: ["09:00-12:00", "14:00-18:00"],
      wednesday: ["09:00-12:00", "14:00-18:00"],
      thursday: ["09:00-12:00", "14:00-18:00"],
      friday: ["09:00-12:00", "14:00-18:00"],
      saturday: ["09:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
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
    priceRange: "100-150",
    available: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c8a6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["08:00-12:00", "14:00-18:00"],
      tuesday: ["08:00-12:00", "14:00-18:00"],
      wednesday: ["08:00-12:00", "14:00-18:00"],
      thursday: ["08:00-12:00", "14:00-18:00"],
      friday: ["08:00-12:00", "14:00-18:00"],
      saturday: ["08:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-01", "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
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
    priceRange: "150-200",
    available: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["09:00-12:00", "14:00-18:00"],
      tuesday: ["09:00-12:00", "14:00-18:00"],
      wednesday: ["09:00-12:00", "14:00-18:00"],
      thursday: ["09:00-12:00", "14:00-18:00"],
      friday: ["09:00-12:00", "14:00-18:00"],
      saturday: ["09:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
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
    priceRange: "200-300",
    available: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["07:00-12:00", "14:00-19:00"],
      tuesday: ["07:00-12:00", "14:00-19:00"],
      wednesday: ["07:00-12:00", "14:00-19:00"],
      thursday: ["07:00-12:00", "14:00-19:00"],
      friday: ["07:00-12:00", "14:00-19:00"],
      saturday: ["07:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-01", "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
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
    priceRange: "150-200",
    available: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["08:00-12:00", "14:00-18:00"],
      tuesday: ["08:00-12:00", "14:00-18:00"],
      wednesday: ["08:00-12:00", "14:00-18:00"],
      thursday: ["08:00-12:00", "14:00-18:00"],
      friday: ["08:00-12:00", "14:00-18:00"],
      saturday: ["08:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-01", "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
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
    priceRange: "100-150",
    available: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c8a6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["06:00-12:00", "14:00-20:00"],
      tuesday: ["06:00-12:00", "14:00-20:00"],
      wednesday: ["06:00-12:00", "14:00-20:00"],
      thursday: ["06:00-12:00", "14:00-20:00"],
      friday: ["06:00-12:00", "14:00-20:00"],
      saturday: ["06:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-01", "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
  },
  {
    id: "7",
    name: "Hassan El Fassi",
    service: "Plombier",
    location: "Casablanca",
    rating: 4.4,
    reviewCount: 41,
    price: "À partir de 170 DHS",
    isVerified: true,
    isPro: false,
    priceRange: "150-200",
    available: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["09:00-12:00", "14:00-18:00"],
      tuesday: ["09:00-12:00", "14:00-18:00"],
      wednesday: ["09:00-12:00", "14:00-18:00"],
      thursday: ["09:00-12:00", "14:00-18:00"],
      friday: ["09:00-12:00", "14:00-18:00"],
      saturday: ["09:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-27", "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-01", "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
  },
  {
    id: "8",
    name: "Nadia Benslimane",
    service: "Ménage",
    location: "Rabat",
    rating: 4.8,
    reviewCount: 56,
    price: "À partir de 130 DHS",
    isVerified: true,
    isPro: true,
    priceRange: "100-150",
    available: false,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c8a6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    availability: {
      monday: ["08:00-12:00", "14:00-18:00"],
      tuesday: ["08:00-12:00", "14:00-18:00"],
      wednesday: ["08:00-12:00", "14:00-18:00"],
      thursday: ["08:00-12:00", "14:00-18:00"],
      friday: ["08:00-12:00", "14:00-18:00"],
      saturday: ["08:00-12:00"],
      sunday: []
    },
    disponibilites: [
      "2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31",
      "2025-02-03", "2025-02-04", "2025-02-05", "2025-02-06", "2025-02-07", "2025-02-08",
      "2025-02-10", "2025-02-11", "2025-02-12", "2025-02-13", "2025-02-14", "2025-02-15",
      "2025-02-17", "2025-02-18", "2025-02-19", "2025-02-20", "2025-02-21", "2025-02-22",
      "2025-02-24", "2025-02-25", "2025-02-26", "2025-02-27", "2025-02-28"
    ]
  }
];

const services = ["Tous", "Plombier", "Électricien", "Ménage", "Jardinage", "Peintre", "Cuisinière"];
const cities = ["Toutes les villes", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Oujda"];
const priceRanges = ["Tous les prix", "0-100 DHS", "100-200 DHS", "200-300 DHS", "+300 DHS"];

export default function Artisans() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("Tous");
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");
  const [selectedPriceRange, setSelectedPriceRange] = useState("Tous les prix");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showProOnly, setShowProOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    return allProviders.some(provider => 
      provider.disponibilites && provider.disponibilites.includes(dateString)
    );
  };

  // Fonction pour vérifier si un prestataire spécifique est disponible à une date
  const isProviderAvailableOnDate = (provider: any, date: string) => {
    return provider.disponibilites && provider.disponibilites.includes(date);
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
    setSelectedPriceRange("Tous les prix");
    setShowAvailableOnly(false);
    setShowProOnly(false);
    setSelectedDate("");
    setShowCalendar(false);
  };

  // Lire les paramètres d'URL au chargement
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const serviceParam = urlParams.get('service');
    const cityParam = urlParams.get('city');
    const providerParam = urlParams.get('provider');
    
    // Mettre à jour les filtres avec les paramètres d'URL
    if (serviceParam) {
      setSearchTerm(serviceParam);
      // Trouver le service correspondant dans la liste des services
      const matchingService = services.find(service => 
        service.toLowerCase() === serviceParam.toLowerCase()
      );
      if (matchingService) {
        setSelectedService(matchingService);
      } else {
        setSelectedService(serviceParam);
      }
    }
    
    if (cityParam) {
      // Trouver la ville correspondante dans la liste des villes
      const matchingCity = cities.find(city => 
        city.toLowerCase() === cityParam.toLowerCase()
      );
      if (matchingCity) {
        setSelectedCity(matchingCity);
      } else {
        setSelectedCity(cityParam);
      }
    }
    
    if (providerParam) {
      setSearchTerm(prev => prev ? `${prev} ${providerParam}` : providerParam);
    }
  }, [location]);

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

      // Filtre par prix
      const matchesPrice = selectedPriceRange === "Tous les prix" || provider.priceRange === selectedPriceRange;

      // Filtre par disponibilité
      const matchesAvailability = !showAvailableOnly || provider.available;

      // Filtre par Club Pro
      const matchesPro = !showProOnly || provider.isPro;

      // Filtre par date sélectionnée
      const matchesDate = !selectedDate || isProviderAvailableOnDate(provider, selectedDate);

      return matchesSearch && matchesService && matchesCity && matchesPrice && matchesAvailability && matchesPro && matchesDate;
    }).sort((a, b) => {
      // Tri par disponibilité si une date est sélectionnée
      if (selectedDate) {
        const aAvailable = isProviderAvailableOnDate(a, selectedDate);
        const bAvailable = isProviderAvailableOnDate(b, selectedDate);
        
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
      }
      
      // Tri par Club Pro en priorité
      if (a.isPro && !b.isPro) return -1;
      if (!a.isPro && b.isPro) return 1;
      
      // Tri par note décroissante
      return b.rating - a.rating;
    });
  }, [searchTerm, selectedService, selectedCity, selectedPriceRange, showAvailableOnly, showProOnly, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trouvez le bon artisan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des milliers d'artisans qualifiés et vérifiés prêts à vous aider dans vos projets
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un artisan, un service ou une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-orange-300"
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
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>

            {/* Filtre Ville */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Filtre Prix */}
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>

            {/* Checkbox Disponibilité */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Disponible maintenant</span>
            </label>

            {/* Checkbox Club Pro */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showProOnly}
                onChange={(e) => setShowProOnly(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Club Pro uniquement</span>
            </label>

            {/* Bouton Calendrier */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs md:text-sm text-gray-700">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('fr-FR') : 'Choisir une date'}
              </span>
            </button>

            {/* Bouton Effacer les filtres */}
            {(searchTerm || selectedService !== "Tous" || selectedCity !== "Toutes les villes" || selectedPriceRange !== "Tous les prix" || showAvailableOnly || showProOnly || selectedDate) && (
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
         const isSelected = selectedDate === formatDate(day);
         const canSelect = !isPast; // Permettre la sélection de toutes les dates non passées

         return (
           <button
             key={index}
             onClick={() => {
               if (canSelect) {
                 setSelectedDate(formatDate(day));
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
                {filteredProviders.length} artisan{filteredProviders.length > 1 ? 's' : ''} trouvé{filteredProviders.length > 1 ? 's' : ''}
              </p>
              
              {/* Filtres actifs */}
              {(searchTerm || selectedService !== "Tous" || selectedCity !== "Toutes les villes" || selectedPriceRange !== "Tous les prix" || showAvailableOnly || showProOnly || selectedDate) && (
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
                  {selectedPriceRange !== "Tous les prix" && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {t("search.price")}: {selectedPriceRange}
                    </span>
                  )}
                  {showAvailableOnly && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {t("search.available")}
                    </span>
                  )}
                  {showProOnly && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {t("search.club_pro")}
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
                  {filteredProviders.filter(p => isProviderAvailableOnDate(p, selectedDate)).length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        Disponibles le {new Date(selectedDate).toLocaleDateString('fr-FR')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProviders
                          .filter(p => isProviderAvailableOnDate(p, selectedDate))
                          .map((provider) => (
                            <div key={provider.id} className="relative group">
                              <div className="absolute top-4 right-4 z-10">
                                <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">✓</span>
                                </div>
                              </div>
                              <FeaturedProviderCard provider={provider} />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Prestataires disponibles autour de cette date */}
                  {filteredProviders.filter(p => !isProviderAvailableOnDate(p, selectedDate)).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        Autres prestataires (disponibles autour de cette date)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProviders
                          .filter(p => !isProviderAvailableOnDate(p, selectedDate))
                          .map((provider) => (
                            <div key={provider.id} className="relative group">
                              <div className="absolute top-4 right-4 z-10">
                                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">✗</span>
                                </div>
                              </div>
                              <FeaturedProviderCard provider={provider} />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Affichage normal si aucune date n'est sélectionnée */}
              {!selectedDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProviders.map((provider) => (
                    <div key={provider.id} className="relative group">
                      <FeaturedProviderCard provider={provider} />
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun artisan trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 