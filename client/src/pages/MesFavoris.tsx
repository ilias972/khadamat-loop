import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin, Phone, MessageCircle, User, Crown } from "lucide-react";

export default function MesFavoris() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Données mockées des favoris
  const favorites = [
    {
      id: 1,
      name: "Ahmed Ben Ali",
      service: "Plomberie",
      rating: 4.8,
      reviews: 127,
      location: "Casablanca, Maarif",
      isOnline: true,
      isClubPro: true,
      price: "À partir de 200 DH",
      specialties: ["Installation", "Réparation", "Débouchage"],
      phone: "+212 6 12 34 56 78"
    },
    {
      id: 2,
      name: "Mohammed El Fassi",
      service: "Électricité",
      rating: 4.9,
      reviews: 89,
      location: "Casablanca, Anfa",
      isOnline: false,
      isClubPro: false,
      price: "À partir de 300 DH",
      specialties: ["Installation électrique", "Dépannage", "Éclairage"],
      phone: "+212 6 98 76 54 32"
    },
    {
      id: 3,
      name: "Fatima Zahra",
      service: "Ménage",
      rating: 4.7,
      reviews: 203,
      location: "Casablanca, Bourgogne",
      isOnline: true,
      isClubPro: true,
      price: "À partir de 150 DH",
      specialties: ["Ménage régulier", "Nettoyage profond", "Repassage"],
      phone: "+212 6 45 67 89 01"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("profile.menu.favorites")}
          </h1>
          <p className="text-gray-600">
            Vos prestataires préférés et les services que vous aimez
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total favoris</p>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En ligne</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter(f => f.isOnline).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Club Pro</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter(f => f.isClubPro).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des favoris */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-orange-600" />
                      </div>
                      {favorite.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{favorite.name}</CardTitle>
                      <p className="text-gray-600">{favorite.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{favorite.rating}</span>
                    <span className="text-xs text-gray-500">({favorite.reviews})</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{favorite.location}</span>
                  </div>
                  
                  <div className="text-sm font-semibold text-orange-600">
                    {favorite.price}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {favorite.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  {favorite.isClubPro && (
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">Club Pro</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setLocation(`/messages/${favorite.id}`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(`tel:${favorite.phone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* État vide */}
        {favorites.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun favori
            </h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore ajouté de prestataires à vos favoris. 
              Commencez par explorer nos services !
            </p>
            <Button>
              Découvrir des prestataires
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 