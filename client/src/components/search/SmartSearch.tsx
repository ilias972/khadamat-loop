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
    <div className={`max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-3 mb-12 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 px-4 flex-1">
          <Search className="w-6 h-6 text-gray-400" />
          <input 
            className="flex-1 py-4 text-lg placeholder-gray-400 border-none focus:outline-none"
            placeholder="Rechercher un service (ex: plombier à Casablanca)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <button 
          onClick={handleSearch}
          className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>Rechercher</span>
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
