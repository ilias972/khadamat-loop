import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Star, MessageCircle, Eye } from "lucide-react";

export default function MesReservations() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Données mockées des réservations
  const reservations = [
    {
      id: 1,
      service: "Plomberie",
      provider: "Ahmed Ben Ali",
      date: "2024-01-15",
      time: "14:00",
      location: "Casablanca, Maarif",
      status: "confirmée",
      rating: 4.8,
      price: "300 DH"
    },
    {
      id: 2,
      service: "Électricité",
      provider: "Mohammed El Fassi",
      date: "2024-01-20",
      time: "10:00",
      location: "Casablanca, Anfa",
      status: "en attente",
      rating: 4.9,
      price: "450 DH"
    },
    {
      id: 3,
      service: "Ménage",
      provider: "Fatima Zahra",
      date: "2024-01-18",
      time: "09:00",
      location: "Casablanca, Bourgogne",
      status: "terminée",
      rating: 4.7,
      price: "200 DH"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmée":
        return "bg-green-100 text-green-800";
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "terminée":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("profile.menu.reservations")}
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations et suivez l'état de vos services
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-pointer">
            Toutes
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            En attente
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Confirmées
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Terminées
          </Badge>
        </div>

        {/* Liste des réservations */}
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{reservation.service}</CardTitle>
                      <p className="text-gray-600">{reservation.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{reservation.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(reservation.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{reservation.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{reservation.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-orange-600">
                    {reservation.price}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation(`/messages/${reservation.provider}`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => setLocation(`/reservations/${reservation.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* État vide */}
        {reservations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune réservation
            </h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore de réservations. Commencez par rechercher un service !
            </p>
            <Button>
              Rechercher un service
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 