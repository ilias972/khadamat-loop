import { Link } from "wouter";
import { Star, MapPin, CheckCircle, Crown, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import BookingModal from "@/components/ui/BookingModal";

interface FeaturedProviderCardProps {
  provider: {
    id: string;
    name: string;
    service: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: string;
    isVerified: boolean;
    isPro: boolean;
    avatar?: string;
  };
}

export default function FeaturedProviderCard({ provider }: FeaturedProviderCardProps) {
  const { t } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBooking = (date: string, description: string) => {
    // Ici vous pouvez ajouter la logique pour envoyer la réservation à l'API
    console.log("Réservation:", { provider: provider.name, date, description });
    // Simuler une confirmation
    alert(`${t("booking.confirm")} pour ${provider.name} le ${date}`);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-2 min-h-[280px] flex flex-col">
      {/* Zone unifiée avec background stylisé */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 mb-3 border border-orange-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg relative">
              {provider.avatar ? (
                <img 
                  src={provider.avatar} 
                  alt={provider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
              {/* Indicateur de disponibilité */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{provider.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {provider.isVerified && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>✔️ Vérifié</span>
                  </div>
                )}
                {provider.isPro && (
                  <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                    <Crown className="w-3 h-3" />
                    <span>⭐ Pro</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Note et avis dans la zone unifiée */}
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-bold text-gray-900">{provider.rating}</span>
            </div>
            <span className="text-gray-600 text-xs">({provider.reviewCount} avis)</span>
          </div>
        </div>
      </div>

      {/* Service et localisation */}
      <div className="mb-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-800 text-sm">{provider.service}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{provider.location}</span>
        </div>
      </div>

      {/* Prix sans "à partir de" */}
      <div className="mb-3">
        <div className="text-orange-600 font-bold text-base">
          {provider.price.replace('À partir de ', '')}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex space-x-2 mt-auto">
        <Link href={`/providers/${provider.id}`} className="flex-1">
          <button className="w-full bg-orange-500 text-white hover:bg-orange-600 border border-orange-500 rounded-xl py-2 px-4 font-medium transition-colors">
            {t("providers.view_profile")}
          </button>
        </Link>
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="flex-1 bg-orange-500 text-white hover:bg-orange-600 rounded-xl py-2 px-4 font-medium transition-colors"
        >
          {t("booking.title")}
        </button>
      </div>

      {/* Modal de réservation */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        providerName={provider.name}
        onConfirm={handleBooking}
      />
    </div>
  );
} 