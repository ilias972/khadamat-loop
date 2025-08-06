import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Star, 
  MessageCircle, 
  ArrowLeft,
  Phone,
  Mail,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon
} from "lucide-react";

export default function ReservationDetails() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Données mockées de la réservation
  const reservation = {
    id: 1,
    service: "Plomberie",
    provider: {
      name: "Ahmed Ben Ali",
      phone: "+212 6 12 34 56 78",
      email: "ahmed.benali@email.com",
      rating: 4.8,
      reviews: 127,
      verified: true
    },
    date: "2024-01-15",
    time: "14:00",
    duration: "2 heures",
    location: "Casablanca, Maarif",
    address: "123 Rue Hassan II, Maarif, Casablanca",
    status: "confirmée",
    price: "300 DH",
    description: "Réparation de la fuite dans la salle de bain principale. Remplacement du robinet et vérification de l'étanchéité.",
    notes: "Merci de prévoir l'accès à la salle de bain. Le prestataire arrivera 10 minutes avant l'heure prévue.",
    paymentMethod: "Carte bancaire",
    paymentStatus: "Payé"
  };

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/mes-reservations")}
            className="mb-4 text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux réservations
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Détails de la réservation
              </h1>
              <p className="text-gray-600">
                Réservation #{reservation.id} - {reservation.service}
              </p>
            </div>
            <Badge className={getStatusColor(reservation.status)}>
              {reservation.status}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Détails du service */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span>Détails du service</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{reservation.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notes spéciales</h3>
                  <p className="text-gray-700">{reservation.notes}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Heure</p>
                      <p className="font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Durée estimée</p>
                      <p className="font-medium">{reservation.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Lieu</p>
                      <p className="font-medium">{reservation.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adresse complète</h3>
                  <p className="text-gray-700">{reservation.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informations de paiement */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <span>Informations de paiement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Montant</p>
                    <p className="text-2xl font-bold text-orange-600">{reservation.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Méthode de paiement</p>
                    <p className="font-medium">{reservation.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut du paiement</p>
                    <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
                      {reservation.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations du prestataire */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-orange-600" />
                  <span>Prestataire</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{reservation.provider.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{reservation.provider.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">({reservation.provider.reviews} avis)</span>
                    </div>
                  </div>
                </div>

                {reservation.provider.verified && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Prestataire vérifié</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{reservation.provider.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{reservation.provider.email}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setLocation(`/messages/${reservation.id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(`tel:${reservation.provider.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setLocation(`/messages/${reservation.id}`)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter le prestataire
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(`tel:${reservation.provider.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler le prestataire
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Signaler un problème
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Télécharger la facture
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
