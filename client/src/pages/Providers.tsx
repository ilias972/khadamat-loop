import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import ProviderCard from "@/components/providers/ProviderCard";
import SmartSearch from "@/components/search/SmartSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Filter, Star } from "lucide-react";
import { useState } from "react";
import type { ProviderWithUser } from "@shared/schema";

export default function Providers() {
  const { t } = useLanguage();
  const [showClubProOnly, setShowClubProOnly] = useState(false);

  const { data: providers, isLoading, error } = useQuery<ProviderWithUser[]>({
    queryKey: ["/api/providers", showClubProOnly ? { clubPro: true } : {}],
  });

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t("common.error")}</p>
          <button onClick={() => window.location.reload()} className="text-orange-500 hover:text-orange-600">
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t("nav.providers")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t("providers.subtitle")}
            </p>
            
            <SmartSearch />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Filtres:</span>
              
              <Button
                variant={showClubProOnly ? "default" : "outline"}
                onClick={() => setShowClubProOnly(!showClubProOnly)}
                className={`flex items-center space-x-2 rtl:space-x-reverse ${
                  showClubProOnly 
                    ? "gradient-orange text-white border-0" 
                    : "border-orange-200 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Star className="w-4 h-4" />
                <span>{t("nav.club_pro")}</span>
              </Button>
            </div>
            
            <div className="text-gray-500 text-sm">
              {providers?.length || 0} prestataires trouvés
            </div>
          </div>
        </div>
      </section>

      {/* Providers Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-80 w-full rounded-3xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {providers?.map((provider) => (
                <ProviderCard 
                  key={provider.id} 
                  provider={provider}
                  onContact={() => console.log("Contact provider:", provider.user.firstName)}
                  onToggleFavorite={() => console.log("Toggle favorite:", provider.id)}
                />
              ))}
            </div>
          )}
          
          {!isLoading && providers?.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Filter className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl">Aucun prestataire trouvé</p>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
