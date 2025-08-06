import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ChevronDown, User } from "lucide-react";
import Fuse from "fuse.js";
import { getSuggestionsByLanguage, parseSuggestionText } from "@/lib/suggestions";
import { useGeolocation } from "@/hooks/use-geolocation";

interface SmartSearchProps {
  onSearch?: (query: string, location: string, provider?: string) => void;
  placeholder?: string;
  defaultLocation?: string;
  className?: string;
  showSuggestions?: boolean;
}

interface IntelligentSuggestion {
  type: 'service' | 'city' | 'combination';
  text: string;
  display: string;
  score: number;
  service?: string;
  city?: string;
}

// Listes de services et villes (personnalisables)
const SERVICES = {
  fr: ["Plombier", "Électricien", "Jardinier", "Peintre", "Maçon", "Menuisier", "Déboucheur", "Ménage", "Nettoyage"],
  ar: ["سباك", "كهربائي", "بستاني", "رسام", "بناء", "نجار", "مفتح مجاري", "تنظيف", "تنظيف"]
};
const CITIES = {
  fr: ["Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Oujda"],
  ar: ["الدار البيضاء", "الرباط", "فاس", "مراكش", "أكادير", "طنجة", "وجدة"]
};

// Liste de prestataires fictifs pour l'autocomplétion
const PROVIDERS = [
  "Ahmed Benali - Plombier",
  "Fatima Zahra - Nettoyage",
  "Mohammed Idrissi - Électricien",
  "Amina El Fassi - Jardinier",
  "Hassan Alami - Peintre",
  "Karim Bennis - Maçon",
  "Sara Mansouri - Ménage",
  "Omar Tazi - Menuisier",
  "Leila Benjelloun - Plombier",
  "Youssef El Kaddouri - Électricien",
  "Nadia Ait Benhaddou - Nettoyage",
  "Rachid El Amrani - Jardinier",
  "Samira El Fassi - Peintre",
  "Abdelkader Benjelloun - Maçon",
  "Hakima El Mansouri - Ménage"
];

export default function SmartSearch({ 
  onSearch, 
  placeholder, 
  defaultLocation = "",
  className = "",
  showSuggestions = true
}: SmartSearchProps) {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [location, setLocationState] = useState(defaultLocation);
  const [provider, setProvider] = useState("");
  // Suggestions dynamiques
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showProviderSuggestions, setShowProviderSuggestions] = useState(false);
  
  // Utiliser le hook de géolocalisation
  const { city: userCity, isLoading: locationLoading } = useGeolocation();
  
  // Pré-remplir la ville avec la géolocalisation
  useEffect(() => {
    if (userCity && !defaultLocation) {
      setLocationState(userCity);
    }
  }, [userCity, defaultLocation]);

  // Récupérer les listes selon la langue
  const currentServices = SERVICES[language as keyof typeof SERVICES] || SERVICES.fr;
  const currentCities = CITIES[language as keyof typeof CITIES] || CITIES.fr;

  // Fuse.js pour services, villes et prestataires avec configuration améliorée
  const fuseServices = new Fuse(currentServices, { 
    threshold: 0.3,
    includeScore: true,
    keys: ['name']
  });
  const fuseCities = new Fuse(currentCities, { 
    threshold: 0.3,
    includeScore: true,
    keys: ['name']
  });
  const fuseProviders = new Fuse(PROVIDERS, {
    threshold: 0.4,
    includeScore: true,
    keys: ['name']
  });

  // Suggestions intelligentes combinées - Format "Service à Ville"
  const getIntelligentSuggestions = (): IntelligentSuggestion[] => {
    // Suggestions populaires toujours visibles
    const popularCombinations = [
      { service: 'Ménage', city: 'Casablanca' },
      { service: 'Jardinier', city: 'Rabat' },
      { service: 'Plombier', city: 'Marrakech' },
      { service: 'Électricien', city: 'Fès' },
      { service: 'Peintre', city: 'Agadir' },
      { service: 'Maçon', city: 'Tanger' },
      { service: 'Nettoyage', city: 'Casablanca' },
      { service: 'Menuisier', city: 'Rabat' }
    ];
    
    const suggestions: IntelligentSuggestion[] = [];
    
    // Si il y a une recherche, filtrer les suggestions
    if (query.trim()) {
      // Recherche dans les services
      const serviceResults = fuseServices.search(query);
      serviceResults.slice(0, 2).forEach(result => {
        suggestions.push({
          type: 'service',
          text: result.item,
          display: `${result.item} - Service`,
          score: result.score || 1,
          service: result.item
        });
      });
      
      // Recherche dans les villes
      const cityResults = fuseCities.search(query);
      cityResults.slice(0, 2).forEach(result => {
        suggestions.push({
          type: 'city',
          text: result.item,
          display: `${result.item} - Ville`,
          score: result.score || 1,
          city: result.item
        });
      });
      
      // Combinaisons populaires filtrées
      popularCombinations.forEach(combo => {
        if (query.toLowerCase().includes(combo.service.toLowerCase()) || 
            query.toLowerCase().includes(combo.city.toLowerCase())) {
          suggestions.push({
            type: 'combination',
            text: `${combo.service} ${combo.city}`,
            display: `${combo.service} à ${combo.city}`,
            score: 0.5,
            service: combo.service,
            city: combo.city
          });
        }
      });
      
      // Trier par score et limiter
      return suggestions
        .sort((a, b) => (a.score || 1) - (b.score || 1))
        .slice(0, 6);
    } else {
      // Si pas de recherche, afficher toutes les combinaisons populaires
      return popularCombinations.map(combo => ({
        type: 'combination',
        text: `${combo.service} ${combo.city}`,
        display: `${combo.service} à ${combo.city}`,
        score: 0.5,
        service: combo.service,
        city: combo.city
      }));
    }
  };

  const intelligentSuggestions = getIntelligentSuggestions();
  const serviceSuggestions = query
    ? fuseServices.search(query).map((r) => r.item).slice(0, 5)
    : [];
  const citySuggestions = location && !currentCities.includes(location)
    ? fuseCities.search(location).map((r) => r.item).slice(0, 5)
    : [];
  const providerSuggestions = provider
    ? fuseProviders.search(provider).map((r) => r.item).slice(0, 5)
    : [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append('service', query);
    if (location) params.append('location', location);
    if (provider) params.append('provider', provider);
    const searchUrl = `/prestataires${params.toString() ? '?' + params.toString() : ''}`;
    setLocation(searchUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: IntelligentSuggestion) => {
    if (suggestion.type === 'combination') {
      // Rediriger vers la page prestataires avec les filtres pré-remplis
      const params = new URLSearchParams();
      if (suggestion.service) {
        params.append('service', suggestion.service);
        setQuery(suggestion.service); // Mettre à jour aussi les champs de recherche
      }
      if (suggestion.city) {
        params.append('location', suggestion.city); // Changé de 'ville' à 'location'
        setLocationState(suggestion.city);
      }
      setLocation(`/prestataires?${params.toString()}`);
    } else if (suggestion.type === 'service') {
      setQuery(suggestion.service || suggestion.text);
      // Rediriger directement vers prestataires avec le service sélectionné
      const params = new URLSearchParams();
      params.append('service', suggestion.service || suggestion.text);
      setLocation(`/prestataires?${params.toString()}`);
    } else if (suggestion.type === 'city') {
      setLocationState(suggestion.city || suggestion.text);
      // Rediriger directement vers prestataires avec la ville sélectionnée
      const params = new URLSearchParams();
      params.append('location', suggestion.city || suggestion.text); // Changé de 'ville' à 'location'
      setLocation(`/prestataires?${params.toString()}`);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-4 md:p-6 mb-8 md:mb-12 ${className}`}>
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
        {/* Service search input */}
        <div className="flex items-center space-x-3 px-3 md:px-4 flex-1 border border-gray-200 md:border-none rounded-xl md:rounded-none relative">
          <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
          <input 
            className="flex-1 py-3 md:py-4 text-base md:text-lg placeholder-gray-400 border-none focus:outline-none min-w-0"
            placeholder={t("hero.search_placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowServiceSuggestions(true);
            }}
            onFocus={() => setShowServiceSuggestions(true)}
            onBlur={() => setTimeout(() => setShowServiceSuggestions(false), 150)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          {/* Suggestions dynamiques services */}
          {showServiceSuggestions && serviceSuggestions.length > 0 && (
            <div className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto">
              {serviceSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                  onClick={() => {
                    setQuery(suggestion);
                    setShowServiceSuggestions(false);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* City Input */}
        <div className="relative flex-1 md:max-w-xs">
          <input
            className="w-full py-3 md:py-4 px-3 md:px-4 pr-10 text-base md:text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-orange-300 min-w-0"
            placeholder={t("hero.city_placeholder")}
            value={location}
            onChange={(e) => {
              setLocationState(e.target.value);
              setShowCitySuggestions(true);
            }}
            onFocus={() => setShowCitySuggestions(true)}
            onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          <MapPin className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 ${locationLoading ? 'geolocation-pulse' : ''}`} />
          {/* Suggestions dynamiques villes */}
          {showCitySuggestions && citySuggestions.length > 0 && (
            <div className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto">
              {citySuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                  onClick={() => {
                    setLocationState(suggestion);
                    setShowCitySuggestions(false);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Search button */}
        <button 
          onClick={handleSearch}
          className="gradient-orange text-white px-4 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center space-x-2 min-w-0"
        >
          <Search className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="hidden sm:inline">{t("hero.search_button")}</span>
          <span className="sm:hidden">{t("common.search")}</span>
        </button>
      </div>
      
      {/* Second row: Provider Search - Enhanced with autocomplete */}
      <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl mt-4 relative">
        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input 
          className="flex-1 py-2 text-base placeholder-gray-400 bg-transparent border-none focus:outline-none"
          placeholder="Recherche prestataire"
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value);
            setShowProviderSuggestions(true);
          }}
          onFocus={() => setShowProviderSuggestions(true)}
          onBlur={() => setTimeout(() => setShowProviderSuggestions(false), 150)}
          onKeyPress={handleKeyPress}
          autoComplete="off"
        />
        {/* Suggestions dynamiques prestataires */}
        {showProviderSuggestions && providerSuggestions.length > 0 && (
          <div className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto">
            {providerSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                onClick={() => {
                  setProvider(suggestion);
                  setShowProviderSuggestions(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Suggestions intelligentes - MAINTENANT EN BAS dans le cadre blanc */}
      {showSuggestions && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3 font-medium">Suggestions populaires :</p>
          <div className="flex flex-wrap gap-2">
            {intelligentSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors cursor-pointer border border-orange-200 hover:border-orange-300"
              >
                {suggestion.display}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}