import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ChevronDown } from "lucide-react";

interface SmartSearchProps {
  onSearch?: (query: string, location: string, provider?: string) => void;
  placeholder?: string;
  defaultLocation?: string;
  className?: string;
}

export default function SmartSearch({ 
  onSearch, 
  placeholder, 
  defaultLocation = "Casablanca",
  className = ""
}: SmartSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [provider, setProvider] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, location, provider);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const cities = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
    "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan"
  ];

  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-4 md:p-6 mb-8 md:mb-12 ${className}`}>
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
        {/* Service search input */}
        <div className="flex items-center space-x-3 px-3 md:px-4 flex-1 border border-gray-200 md:border-none rounded-xl md:rounded-none">
          <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
          <input 
            className="flex-1 py-3 md:py-4 text-base md:text-lg placeholder-gray-400 border-none focus:outline-none min-w-0"
            placeholder={t("hero.search_placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        {/* City Input */}
        <div className="relative flex-1 md:max-w-xs">
          <input
            className="w-full py-3 md:py-4 px-3 md:px-4 pr-10 text-base md:text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-orange-300 min-w-0"
            placeholder={t("hero.city_placeholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
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
      
      {/* Second row: Provider Search - Optional */}
      <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          className="flex-1 py-2 text-base placeholder-gray-400 bg-transparent border-none focus:outline-none"
          placeholder={t("hero.provider_placeholder")}
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      
      {/* Suggestions rapides */}
      <div className="flex flex-wrap gap-2 mt-4 px-4">
        <span className="text-sm text-gray-500">Suggestions :</span>
        {['Plombier Casablanca', 'Ménage Rabat', 'Électricien Marrakech', 'Jardinage Fès'].map((suggestion, index) => (
          <button key={index} className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-100 transition-colors">
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
