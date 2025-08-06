import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Heart, Star, MapPin, Phone, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Favorites() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Données mockées pour les favoris
  const favorites = [
    {
      id: 1,
      name: "Ahmed Ben Ali",
      service: "Plomberie",
      rating: 4.8,
      reviews: 127,
      location: "Casablanca",
      verified: true,
      avatar: null,
      description: "Plombier professionnel avec 10 ans d'expérience"
    },
    {
      id: 2,
      name: "Fatima Zahra",
      service: "Ménage",
      rating: 4.9,
      reviews: 89,
      location: "Rabat",
      verified: true,
      avatar: null,
      description: "Service de ménage de qualité, ponctuelle et fiable"
    },
    {
      id: 3,
      name: "Mohammed El Hassani",
      service: "Électricité",
      rating: 4.7,
      reviews: 156,
      location: "Marrakech",
      verified: false,
      avatar: null,
      description: "Électricien certifié, installations sécurisées"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mes favoris
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Retrouvez vos prestataires préférés et services favoris
            </p>
          </div>
        </div>
      </section>

      {/* Liste des favoris */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {favorites.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* En-tête avec avatar et nom */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-orange-600">
                          {favorite.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{favorite.name}</h3>
                        <p className="text-sm text-gray-500">{favorite.service}</p>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-600 transition-colors">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {favorite.description}
                  </p>

                  {/* Localisation et note */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{favorite.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{favorite.rating}</span>
                      <span className="text-xs text-gray-500">({favorite.reviews})</span>
                    </div>
                  </div>

                  {/* Badge vérifié */}
                  {favorite.verified && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Vérifié
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={() => window.open(`tel:+212612345678`)}
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Appeler</span>
                    </button>
                    <button 
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setLocation(`/messages/${favorite.id}`)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun favori
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore ajouté de prestataires à vos favoris.
              </p>
              <Link href="/prestataires">
                <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                  Découvrir des prestataires
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 