import { Link } from "wouter";
import { Star, MapPin, CheckCircle, Crown, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import BookingModal from "@/components/ui/BookingModal";

interface ArtisanProfileCardProps {
  provider: {
    id: string;
    name: string;
    service: string;
    description?: string;
    location: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    isPro: boolean;
    avatar?: string;
  };
}

export default function ArtisanProfileCard({ provider }: ArtisanProfileCardProps) {
  const { t, language } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleBooking = (date: string, description: string) => {
    // Ici vous pouvez ajouter la logique pour envoyer la réservation à l'API
    console.log("Réservation:", { provider: provider.name, date, description });
    // Simuler une confirmation
    alert(`${t("booking.confirm")} pour ${provider.name} le ${date}`);
  };

  return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 min-h-[320px] flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg relative">
            {provider.avatar ? (
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <User className="w-7 h-7" />
            )}
          </div>
                               <div>
                       <h3 className="font-bold text-gray-900 text-lg leading-tight">{provider.name}</h3>
                       <div className="flex items-center space-x-2 mt-1 rtl:space-x-reverse">
                         {provider.isPro && (
                           <span title="Club Pro" className="inline-flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                             <Crown className="w-3 h-3 mr-1" />
                             Pro
                           </span>
                         )}
                         {provider.isVerified && (
                           <span title="Vérifié" className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                             <CheckCircle className="w-3 h-3 mr-1" />
                             Vérifié
                           </span>
                         )}
                       </div>
                     </div>
                   </div>
      </div>
      <div className="text-orange-600 font-semibold text-sm mb-1">{provider.service}</div>
      {provider.description && (
        <div className="text-gray-600 text-sm mb-2 line-clamp-2 flex-1">{provider.description}</div>
      )}
      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="font-bold text-gray-900">{provider.rating}</span>
        <span className="text-gray-500 text-sm">({provider.reviewCount})</span>
      </div>
      <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500 text-sm mb-2">
        <MapPin className="w-4 h-4" />
        <span>{provider.location}</span>
      </div>
      
      {/* Boutons d'action */}
      <div className="flex space-x-2 rtl:space-x-reverse mt-auto">
        <Link href={`/providers/${provider.id}`} className="flex-1">
          <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-xl font-semibold transition-all">
            {t("providers.view_profile")}
          </button>
        </Link>
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="flex-1 bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-xl font-semibold transition-all"
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