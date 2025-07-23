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
    <div className={`max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-3 mb-12 ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Service Search - Required */}
        <div className="flex items-center space-x-3 px-4 flex-1">
          <Search className="w-6 h-6 text-gray-400" />
          <input 
            className="flex-1 py-4 text-lg placeholder-gray-400 border-none focus:outline-none"
            placeholder={t("hero.search_placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        {/* Provider Search - Optional */}
        <div className="flex items-center space-x-2 px-3 border-l border-gray-200">
          <input 
            className="w-48 py-4 text-lg placeholder-gray-400 border-none focus:outline-none"
            placeholder="Prestataire (optionnel)"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        {/* City Selector */}
        <div className="relative">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pr-10 text-gray-700 focus:outline-none focus:border-orange-300 cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        
        <button 
          onClick={handleSearch}
          className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>{t("hero.search_button")}</span>
        </button>
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
