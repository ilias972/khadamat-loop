import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Star, MapPin, CheckCircle, Edit, Settings, LogOut, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const clientData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  location: "",
  rating: 0,
  reviewCount: 0,
  isVerified: false,
  avatar: "",
  joinDate: "",
  completedMissions: 0,
  favoriteProviders: 0,
  reviews: [] as any[],
  missions: [] as any[],
};

export default function Profile() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setLocation('/login');
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
                src={clientData.avatar}
                alt={clientData.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 truncate">
                  {clientData.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{clientData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{clientData.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({clientData.reviewCount} avis reçus)</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {clientData.isVerified && (
                <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t("profile.verified")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal - Page unique déroulante */}
        <div className="space-y-8">
          {/* Section Aperçu */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.overview")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {clientData.completedMissions}
                  </div>
                  <div className="text-sm text-gray-600">{t("profile.completed_missions")}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {clientData.favoriteProviders}
                  </div>
                  <div className="text-sm text-gray-600">{t("profile.favorite_providers")}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {clientData.rating}
                  </div>
                  <div className="text-sm text-gray-600">{t("profile.average_rating")}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section Missions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.reserved_missions")}</h2>
            <div className="space-y-4">
              {clientData.missions.map((mission) => (
                <Card key={mission.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-gray-900">{mission.title}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mission.status === "Terminé" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {mission.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{mission.provider}</span>
                      <span>{mission.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section Avis */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.reviews_received")}</h2>
            <div className="space-y-4">
              {clientData.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{review.providerName}</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section Paramètres */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres du compte</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Informations personnelles</h4>
                  <p className="text-sm text-gray-600">Nom, email, téléphone</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation('/profile/info')}
                >
                  Modifier
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Sécurité</h4>
                  <p className="text-sm text-gray-600">Mot de passe, authentification</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation('/profil/client/securite')}
                >
                  Modifier
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className="text-sm text-gray-600">Préférences de notification</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation('/profil/client/notifications')}
                >
                  Configurer
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900">Déconnexion</h4>
                  <p className="text-sm text-red-600">Se déconnecter de votre compte</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
