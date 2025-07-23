import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin } from "lucide-react";
import type { ProviderWithUser } from "@shared/schema";

interface ProviderCardProps {
  provider: ProviderWithUser;
  onContact?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export default function ProviderCard({ 
  provider, 
  onContact, 
  onToggleFavorite, 
  isFavorite = false 
}: ProviderCardProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover-scale">
      {/* Club Pro Badge */}
      {provider.user.isClubPro && (
        <div className="gradient-orange text-white px-4 py-2 text-sm font-semibold flex items-center space-x-2 rtl:space-x-reverse">
          <Star className="w-4 h-4 text-yellow-300" />
          <span>{t("providers.club_pro_badge")}</span>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-start space-x-6 rtl:space-x-reverse">
          <div className="relative">
            <img 
              src={provider.user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`}
              alt={`${provider.user.firstName} ${provider.user.lastName}`}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-100" 
            />
            {provider.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {provider.user.firstName} {provider.user.lastName}
            </h3>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{provider.rating}</span>
                <span className="text-gray-500">({provider.reviewCount} {t("providers.reviews")})</span>
              </div>
              
              {provider.user.location && (
                <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{provider.user.location}</span>
                </div>
              )}
            </div>
            
            {/* Specialties Tags */}
            {provider.specialties && provider.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {provider.specialties.map((specialty, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-100"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Button 
                onClick={onContact}
                className="flex-1 gradient-orange text-white py-3 px-6 rounded-xl font-semibold transition-all hover:shadow-lg border-0"
              >
                {t("providers.contact")}
              </Button>
              <Button 
                onClick={onToggleFavorite}
                variant="outline"
                size="icon"
                className="p-3 border-2 border-gray-200 hover:border-orange-300 rounded-xl transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'text-orange-500 fill-current' : 'text-gray-400 hover:text-orange-500'
                  }`} 
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
