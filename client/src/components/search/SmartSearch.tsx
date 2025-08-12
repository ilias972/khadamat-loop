import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Search, MapPin, User } from "lucide-react";
import Fuse from "fuse.js";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useServicesCatalog,
  searchLocal,
  type ServiceCatalogItem,
} from "@/lib/servicesCatalog";

interface SmartSearchProps {
  onSearch?: (service: string, city: string, provider?: string) => void;
  defaultLocation?: string;
  className?: string;
}

const CITIES = {
  fr: ["Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger", "Oujda"],
  ar: ["الدار البيضاء", "الرباط", "فاس", "مراكش", "أكادير", "طنجة", "وجدة"],
};

export default function SmartSearch({
  onSearch,
  defaultLocation = "",
  className = "",
}: SmartSearchProps) {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [service, setService] = useState("");
  const [city, setCity] = useState(defaultLocation);
  const [provider, setProvider] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const { city: detectedCity, isLoading: locationLoading } = useGeolocation();
  useEffect(() => {
    if (detectedCity && !defaultLocation) {
      setCity(detectedCity);
    }
  }, [detectedCity, defaultLocation]);

  const { data: catalog } = useServicesCatalog();
  const currentCities = CITIES[language as keyof typeof CITIES] || CITIES.fr;
  const fuseCities = new Fuse(currentCities, {
    threshold: 0.3,
    includeScore: true,
    keys: ["name"],
  });

  const serviceSuggestions =
    service && catalog
      ? searchLocal(catalog as ServiceCatalogItem[], service, language)
          .map((item) => (language === "ar" ? item.name_ar : item.name_fr))
          .slice(0, 8)
      : [];
  const citySuggestions =
    city && !currentCities.includes(city)
      ? fuseCities.search(city).map((r) => r.item).slice(0, 5)
      : [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (service) params.append("service", service);
    if (city) params.append("location", city);
    if (provider) params.append("provider", provider);
    const url = `/prestataires${params.toString() ? `?${params.toString()}` : ""}`;
    setLocation(url);
    onSearch?.(service, city, provider);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-4 md:p-6 mb-8 md:mb-12 ${className}`}> 
      <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
        {/* Service input */}
        <div className="flex items-center space-x-3 px-3 md:px-4 flex-1 border border-gray-200 md:border-none rounded-xl md:rounded-none relative">
          <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
          <input
            className="flex-1 py-3 md:py-4 text-base md:text-lg placeholder-gray-400 border-none focus:outline-none min-w-0"
            placeholder={t("home.search.servicePlaceholder")}
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setShowServiceSuggestions(true);
            }}
            onFocus={() => setShowServiceSuggestions(true)}
            onBlur={() => setTimeout(() => setShowServiceSuggestions(false), 150)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          {showServiceSuggestions && serviceSuggestions.length > 0 && (
            <div className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto">
              {serviceSuggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                  onClick={() => {
                    setService(s);
                    setShowServiceSuggestions(false);
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City input */}
        <div className="relative flex-1 md:max-w-xs">
          <input
            className="w-full py-3 md:py-4 px-3 md:px-4 pr-10 text-base md:text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-orange-300 min-w-0"
            placeholder={t("home.search.cityPlaceholder")}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setShowCitySuggestions(true);
            }}
            onFocus={() => setShowCitySuggestions(true)}
            onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          <MapPin
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 ${locationLoading ? "geolocation-pulse" : ""}`}
          />
          {showCitySuggestions && citySuggestions.length > 0 && (
            <div className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto">
              {citySuggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                  onClick={() => {
                    setCity(s);
                    setShowCitySuggestions(false);
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="gradient-orange text-white px-4 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center space-x-2 min-w-0"
        >
          <Search className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="hidden sm:inline">{t("hero.search_button")}</span>
          <span className="sm:hidden">{t("common.search")}</span>
        </button>
      </div>

      {/* Provider search */}
      <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl mt-4">
        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          className="flex-1 py-2 text-base placeholder-gray-400 bg-transparent border-none focus:outline-none"
          placeholder={t("home.search.providerPlaceholder")}
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

