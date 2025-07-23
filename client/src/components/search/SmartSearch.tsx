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
    <div className={`max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-2 animate-fade-in ${className}`}>
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex-1 flex items-center space-x-4 rtl:space-x-reverse px-6 py-4">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-lg placeholder-gray-400 border-none focus:outline-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={placeholder || t("hero.search_placeholder")}
          />
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-400">
            <MapPin className="w-4 h-4" />
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-none bg-transparent p-0 text-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-24"
            />
          </div>
        </div>
        <Button 
          onClick={handleSearch}
          className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg border-0"
        >
          {t("hero.search_button")}
        </Button>
      </div>
    </div>
  );
}
