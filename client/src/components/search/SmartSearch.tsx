import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface SmartSearchProps {
  onSearch?: (query: string, location: string) => void;
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

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, location);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-2 mb-12 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Recherche service */}
        <div className="flex-1 flex items-center space-x-3 px-6">
          <Search className="w-6 h-6 text-gray-400" />
          <input 
            className="flex-1 py-4 text-lg placeholder-gray-400 border-none focus:outline-none"
            placeholder="Que recherchez-vous ?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        {/* Séparateur */}
        <div className="w-px h-8 bg-gray-200"></div>
        
        {/* Recherche ville */}
        <div className="flex items-center space-x-3 px-6">
          <MapPin className="w-5 h-5 text-gray-400" />
          <input 
            className="w-40 py-4 text-lg placeholder-gray-400 border-none focus:outline-none"
            placeholder="Choisissez votre ville"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={(e) => e.target.placeholder = ''}
            onBlur={(e) => e.target.placeholder = 'Choisissez votre ville'}
          />
        </div>
        
        <button 
          onClick={handleSearch}
          className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
        >
          Rechercher
        </button>
      </div>
    </div>
  );
}
