import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Search, MapPin, User } from "lucide-react";
import Fuse from "fuse.js";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useServicesCatalog,
  searchLocalDetailed,
  type ServiceCatalogItem,
} from "@/lib/servicesCatalog";

interface SmartSearchProps {
  onSearch?: (service: string, city: string, provider?: string) => void;
  defaultLocation?: string;
  className?: string;
  showSuggestions?: boolean;
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
  const [serviceQuery, setServiceQuery] = useState("");
  const [selectedService, setSelectedService] = useState<
    { slug: string; name: string } | null
  >(null);
  const [city, setCity] = useState(defaultLocation);
  const [provider, setProvider] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [providerSuggestions, setProviderSuggestions] = useState<any[]>([]);
  const [showProviderSuggestions, setShowProviderSuggestions] = useState(false);

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

  const [serviceSuggestions, setServiceSuggestions] = useState<
    { item: ServiceCatalogItem; score: number; providersCountInCity?: number }[]
  >([]);
  useEffect(() => {
    if (!catalog || serviceQuery.length < 1) {
      setServiceSuggestions([]);
      return;
    }
    const results = searchLocalDetailed(
      catalog as ServiceCatalogItem[],
      serviceQuery,
      language
    ).slice(0, 8);
    setServiceSuggestions(results);
  }, [catalog, serviceQuery, language]);

  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(async () => {
      if (serviceQuery.length < 1 || !city) return;
      try {
        const params = new URLSearchParams({
          q: serviceQuery,
          city,
          limit: "8",
        });
        const timeout = setTimeout(() => controller.abort(), 1200);
        try {
          const res = await fetch(`/api/services/suggest?${params.toString()}`, {
            signal: controller.signal,
          });
          const json = await res.json();
          const map = new Map<string, number>();
          for (const it of json.data?.items || []) {
            map.set(it.slug, it.providersCountInCity || 0);
          }
          setServiceSuggestions((prev) =>
            prev
              .map((r) => ({
                ...r,
                providersCountInCity: map.get(r.item.slug) ?? 0,
              }))
              .sort((a, b) => {
                if (a.score !== b.score) return a.score - b.score;
                return (
                  (b.providersCountInCity > 0 ? 1 : 0) -
                  (a.providersCountInCity > 0 ? 1 : 0)
                );
              })
          );
        } finally {
          clearTimeout(timeout);
        }
      } catch {
        if (!controller.signal.aborted) {
          // keep local suggestions
        }
      }
    }, 250);
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [serviceQuery, city]);
  const citySuggestions =
    city && !currentCities.includes(city)
      ? fuseCities.search(city).map((r) => r.item).slice(0, 5)
      : [];

  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(async () => {
      if (provider) {
        try {
          const params = new URLSearchParams({ q: provider, limit: "8" });
          if (city) params.append("city", city);
          const timeout = setTimeout(() => controller.abort(), 1200);
          try {
            const res = await fetch(
              `/api/providers/suggest?${params.toString()}`,
              { signal: controller.signal }
            );
            const json = await res.json();
            setProviderSuggestions(json.data?.items || []);
          } finally {
            clearTimeout(timeout);
          }
        } catch {
          if (!controller.signal.aborted) setProviderSuggestions([]);
        }
      } else {
        setProviderSuggestions([]);
      }
    }, 250);
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [provider, city]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedService) params.append("services", selectedService.slug);
    if (city) params.append("city", city);
    if (provider) params.append("q", provider);
    const url = `/providers${params.toString() ? `?${params.toString()}` : ""}`;
    setLocation(url);
    onSearch?.(serviceQuery, city, provider);
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
            value={serviceQuery}
            onChange={(e) => {
              setServiceQuery(e.target.value);
              setSelectedService(null);
              setShowServiceSuggestions(true);
            }}
            onFocus={() => setShowServiceSuggestions(true)}
            onBlur={() => setTimeout(() => setShowServiceSuggestions(false), 150)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          {showServiceSuggestions && serviceQuery && (
            <div className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto">
              {serviceSuggestions.length > 0 ? (
                serviceSuggestions.map(({ item, providersCountInCity }) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                    onClick={() => {
                      const name = language === "ar" ? item.name_ar : item.name_fr;
                      setServiceQuery(name);
                      setSelectedService({ slug: item.slug, name });
                      setShowServiceSuggestions(false);
                    }}
                  >
                    <div>{language === "ar" ? item.name_ar : item.name_fr}</div>
                    {city && (
                      <div className="text-sm text-gray-500">
                        {t("home.search.providersNearCity", {
                          count: providersCountInCity ?? 0,
                          city,
                        })}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="px-4 py-2 text-gray-700">
                    {t("home.search.noResults")}
                  </div>
                  <div
                    className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                    onMouseDown={() => setLocation("/services")}
                  >
                    {t("home.search.viewAllServices")}
                  </div>
                  {city && (
                    <div
                      className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                      onMouseDown={() =>
                        setLocation(`/providers?city=${encodeURIComponent(city)}`)
                      }
                    >
                      {t("home.search.nearbyProviders")}
                    </div>
                  )}
                </>
              )}
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
      <div className="relative flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl mt-4">
        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          className="flex-1 py-2 text-base placeholder-gray-400 bg-transparent border-none focus:outline-none"
          placeholder={t("home.search.providerPlaceholder")}
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
        {showProviderSuggestions && provider && (
          <div className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto">
            {providerSuggestions.length > 0 ? (
              providerSuggestions.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700"
                  onClick={() => {
                    setShowProviderSuggestions(false);
                    setLocation(`/providers/${p.slug || p.id}`);
                  }}
                >
                  {p.displayName}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-700">
                {t("home.search.providerNoResults")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

