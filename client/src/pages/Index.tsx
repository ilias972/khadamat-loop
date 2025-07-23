import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import ServiceCard from "@/components/services/ServiceCard";
import ProviderCard from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Tag, Rocket, Shield, Mail, Bell, MapPin, Lightbulb, Search, User, MessageCircle } from "lucide-react";
import type { Service, ProviderWithUser } from "@shared/schema";

export default function Index() {
  const { t } = useLanguage();

  // Fetch popular services
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services/popular"],
  });

  // Fetch Club Pro providers
  const { data: providers, isLoading: providersLoading } = useQuery<ProviderWithUser[]>({
    queryKey: ["/api/providers", { clubPro: true }],
  });



  const popularCategories = [
    "Plomberie",
    "Électricité", 
    "Ménage",
    "Jardinage",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 pt-20 pb-16 pattern-bg">
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t("hero.title")}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {" "}{t("hero.title_highlight")}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
          
          {/* Smart Search Bar */}
          <SmartSearch />
          
          {/* Quick Actions */}
          <div className="flex justify-center flex-wrap gap-4 mt-8 animate-fade-in">
            {popularCategories.map((category) => (
              <Badge 
                key={category}
                variant="secondary"
                className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-orange-200 hover:bg-white cursor-pointer transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Services populaires - Nouvelle section après recherche */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Services populaires à <span className="text-orange-500" id="user-city">Casablanca</span>
            </h2>
            <p className="text-xl text-gray-600">
              Les services les plus demandés dans votre ville
            </p>
          </div>
          
          {/* Grid des services populaires */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Plomberie', icon: '🔧', count: '156 pros', popular: true },
              { name: 'Ménage', icon: '🧽', count: '89 pros', popular: true },
              { name: 'Électricité', icon: '⚡', count: '134 pros', popular: false },
              { name: 'Jardinage', icon: '🌱', count: '67 pros', popular: false },
              { name: 'Peinture', icon: '🎨', count: '92 pros', popular: true },
              { name: 'Réparation', icon: '🔨', count: '78 pros', popular: false },
            ].map((service, index) => (
              <div key={index} className="group cursor-pointer relative">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-2">
                  {/* Badge populaire */}
                  {service.popular && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      🔥 TOP
                    </div>
                  )}
                  
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500">{service.count}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bouton voir plus */}
          <div className="text-center mt-12">
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
              Voir tous les services
            </button>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600">Trouvez le bon prestataire en 3 étapes simples</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Recherchez</h3>
              <p className="text-gray-600">Décrivez votre besoin et votre localisation</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Comparez</h3>
              <p className="text-gray-600">Consultez les profils et avis des prestataires</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Contactez</h3>
              <p className="text-gray-600">Échangez directement et planifiez votre service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation Club Pro (REMONTÉ) */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 gradient-orange rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Club Pro
                </span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Rejoignez l'élite des prestataires
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Obtenez plus de visibilité, zéro commission et un badge de confiance pour seulement 50 DH/mois.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  '✅ Badge "Vérifié" sur votre profil',
                  '✅ Priorité dans les résultats',
                  '✅ 0% de commission',
                  '✅ Support prioritaire 24/7'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-lg">
                Devenir Club Pro - 50 DH/mois
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="gradient-orange text-white p-6 rounded-2xl mb-6">
                  <h3 className="text-2xl font-bold mb-2">Ahmed B.</h3>
                  <p className="text-orange-100">Plombier Club Pro</p>
                </div>
                <p className="text-gray-600 italic">
                  "Depuis que j'ai rejoint le Club Pro, j'ai 3x plus de clients. Le badge vérifié fait toute la différence !"
                </p>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="ml-2 text-gray-600">4.9/5 (127 avis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des milliers de clients satisfaits nous font confiance
            </p>
          </div>
          
          {providersLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {providers?.slice(0, 3).map((provider) => (
                <ProviderCard 
                  key={provider.id} 
                  provider={provider}
                  onContact={() => console.log("Contact provider:", provider.user.firstName)}
                  onToggleFavorite={() => console.log("Toggle favorite:", provider.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Restez informé avec notre newsletter
            </h2>
            
            <p className="text-xl text-gray-600 mb-12">
              Inscrivez-vous gratuitement et ne manquez aucune actualité de Khadamat
            </p>
            
            {/* Formulaire newsletter */}
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-2 mb-12">
              <div className="flex items-center space-x-3">
                <input 
                  type="email"
                  className="flex-1 px-6 py-4 text-lg placeholder-gray-400 border-none focus:outline-none rounded-xl"
                  placeholder="Votre email"
                />
                <button className="gradient-orange text-white px-6 py-4 rounded-xl font-semibold transition-all hover:scale-105">
                  S'inscrire
                </button>
              </div>
            </div>
            
            {/* Avantages */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ce que vous recevrez :</h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Bell className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Actualités du site</h4>
                    <p className="text-gray-600 text-sm">Nouvelles fonctionnalités et mises à jour</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prestataires locaux</h4>
                    <p className="text-gray-600 text-sm">Nouveaux prestataires dans votre région</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Tag className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Offres exclusives</h4>
                    <p className="text-gray-600 text-sm">Réductions et promotions spéciales</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Lightbulb className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Conseils utiles</h4>
                    <p className="text-gray-600 text-sm">Astuces et guides pratiques</p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              📧 Pas de spam, désabonnement en un clic
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}
