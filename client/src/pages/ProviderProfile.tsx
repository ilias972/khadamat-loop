import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, MapPin, Clock, Calendar, MessageCircle, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import StatsSection from "@/components/providers/StatsSection";
import ReviewSection from "@/components/providers/ReviewSection";
import AvailabilitySection from "@/components/providers/AvailabilitySection";

// Données mockées du prestataire (en réalité, cela viendrait de l'API)
const providerData = {
  id: "",
  name: "",
  service: "",
  location: "",
  rating: 0,
  reviewCount: 0,
  isVerified: false,
  isPro: false,
  experience: 0,
  responseTime: "",
  missionsCompleted: 0,
  description: "",
  skills: [],
  avatar: "",
  portfolio: [],
  reviews: [],
  availability: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  }
};

export default function ProviderProfile() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleBooking = () => {
    // Ici on ouvrirait la messagerie interne
    setLocation("/messages");
  };

  // Fonction pour générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Ajouter les jours vides du début
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Ajouter tous les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Fonction pour vérifier si une date est disponible
  const isDateAvailable = (date: Date) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    return providerData.availability[dayName as keyof typeof providerData.availability]?.length > 0;
  };

  // Fonction pour vérifier si une date est dans le passé
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Fonction pour changer de mois
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header du profil */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar et infos principales */}
            <div className="flex items-center space-x-4">
              <img
                src={providerData.avatar}
                alt={providerData.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 truncate">
                  {providerData.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-gray-600">
                  <span className="font-medium">{providerData.service}</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{providerData.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Score moyen et nombre d'avis - En haut à droite */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-xl">{providerData.rating}</span>
                </div>
                <p className="text-sm text-gray-600">({providerData.reviewCount} avis)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistiques */}
            <StatsSection
              missionsCompleted={providerData.missionsCompleted}
              experience={providerData.experience}
              responseTime={providerData.responseTime}
              isVerified={providerData.isVerified}
              isPro={providerData.isPro}
            />

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-700 leading-relaxed">{providerData.description}</p>
            </div>

            {/* Compétences */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {providerData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {providerData.portfolio.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Travail ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Avis clients */}
            <ReviewSection reviews={providerData.reviews} />
          </div>

          {/* Colonne latérale - Réservation */}
          <div className="space-y-6">
            {/* Carte de réservation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("provider_profile.book_provider")}</h3>
              
              {!showBookingForm ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">{t("provider_profile.contact_description")}</p>
                  </div>
                  
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    {t("provider_profile.book_now")}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{t("provider_profile.message")}</span>
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{t("provider_profile.call")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      {/* En-tête du calendrier */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => changeMonth('prev')}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h3 className="font-semibold text-gray-900">
                          {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                          onClick={() => changeMonth('next')}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Jours de la semaine */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Grille des jours */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((day, index) => {
                          if (!day) {
                            return <div key={index} className="h-8" />;
                          }

                          const isAvailable = isDateAvailable(day);
                          const isPast = isDateInPast(day);
                          const isSelected = selectedDate === formatDate(day);

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                if (isAvailable && !isPast) {
                                  setSelectedDate(formatDate(day));
                                }
                              }}
                              disabled={!isAvailable || isPast}
                              className={`
                                h-8 w-8 rounded-lg text-sm font-medium transition-all
                                ${isSelected 
                                  ? 'bg-orange-500 text-white' 
                                  : isAvailable && !isPast
                                    ? 'hover:bg-orange-100 text-gray-900'
                                    : 'text-gray-300 cursor-not-allowed'
                                }
                              `}
                            >
                              {day.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  

                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("provider_profile.mission_description")}</label>
                    <textarea
                      value={missionDescription}
                      onChange={(e) => setMissionDescription(e.target.value)}
                      placeholder={t("provider_profile.mission_placeholder")}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-300"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      {t("provider_profile.cancel")}
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={!selectedDate || !missionDescription.trim()}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("provider_profile.confirm")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Disponibilités */}
            <AvailabilitySection availability={providerData.availability} />
          </div>
        </div>
      </div>
    </div>
  );
} 