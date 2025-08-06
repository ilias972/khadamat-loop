import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin } from "lucide-react";
import type { ProviderWithUser } from "@shared/schema";
import BookingModal from "@/components/ui/BookingModal";

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
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBooking = (date: string, description: string) => {
    // Ici vous pouvez ajouter la logique pour envoyer la réservation à l'API
    console.log("Réservation:", { provider: `${provider.user.firstName} ${provider.user.lastName}`, date, description });
    // Simuler une confirmation
    alert(`${t("booking.confirm")} pour ${provider.user.firstName} ${provider.user.lastName} le ${date}`);
  };
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover-scale">
      {/* Club Pro Badge */}
      {provider.user.isClubPro && (
        <div className="gradient-orange text-white px-4 py-2 text-sm font-semibold flex items-center space-x-2 rtl:space-x-reverse">
          <Star className="w-4 h-4 text-yellow-300" />
          <span>{t("providers.club_pro_badge")}</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <div className="relative">
            <img 
              src={provider.user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`}
              alt={`${provider.user.firstName} ${provider.user.lastName}`}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-orange-100" 
            />
            {provider.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {provider.user.firstName} {provider.user.lastName}
            </h3>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-3">
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
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.specialties.map((specialty, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-orange-100"
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
                {t("providers.view_profile")}
              </Button>
              <Button 
                onClick={() => setIsBookingModalOpen(true)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-all hover:shadow-lg border-0"
              >
                {t("booking.title")}
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

            {/* Modal de réservation */}
            <BookingModal
              isOpen={isBookingModalOpen}
              onClose={() => setIsBookingModalOpen(false)}
              providerName={`${provider.user.firstName} ${provider.user.lastName}`}
              onConfirm={handleBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
