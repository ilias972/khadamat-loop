import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Star, MapPin, CheckCircle, Edit, Settings, LogOut, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Données mockées du client (en réalité, cela viendrait de l'API)
const clientData = {
  id: "1",
  name: "Fatima Alami",
  email: "fatima.alami@email.com",
  phone: "+212 6 12 34 56 78",
  location: "Casablanca",
  rating: 4.2,
  reviewCount: 8,
  isVerified: true,
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  joinDate: "2023-03-15",
  completedMissions: 12,
  favoriteProviders: 5,
  reviews: [
    {
      id: 1,
      providerName: "Ahmed Benali",
      rating: 5,
      comment: "Excellent prestataire, très professionnel",
      date: "2024-01-15"
    },
    {
      id: 2,
      providerName: "Mohammed K.",
      rating: 4,
      comment: "Bon service, délais respectés",
      date: "2024-01-10"
    }
  ],
  missions: [
    {
      id: 1,
      title: "Installation électrique salon",
      provider: "Ahmed Benali",
      status: "Terminé",
      date: "2024-01-15",
      amount: 800
    },
    {
      id: 2,
      title: "Réparation plomberie cuisine",
      provider: "Mohammed K.",
      status: "En cours",
      date: "2024-01-20",
      amount: 450
    }
  ]
};

export default function Profile() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

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
            
            {/* Badges et actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {clientData.isVerified && (
                <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Vérifié</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLocation("/profile/info")}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal - Page unique déroulante */}
        <div className="space-y-8">
          {/* Section Aperçu */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Aperçu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {clientData.completedMissions}
                  </div>
                  <div className="text-sm text-gray-600">Missions terminées</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {clientData.favoriteProviders}
                  </div>
                  <div className="text-sm text-gray-600">Prestataires favoris</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {clientData.rating}
                  </div>
                  <div className="text-sm text-gray-600">Note moyenne reçue</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section Missions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Missions réservées</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis reçus des prestataires</h2>
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
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Sécurité</h4>
                  <p className="text-sm text-gray-600">Mot de passe, authentification</p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className="text-sm text-gray-600">Préférences de notification</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900">Déconnexion</h4>
                  <p className="text-sm text-red-600">Se déconnecter de votre compte</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
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