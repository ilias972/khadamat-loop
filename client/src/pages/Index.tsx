import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import ServiceCard from "@/components/services/ServiceCard";
import ProviderCard from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Tag, Rocket, Shield, Mail, Bell, MapPin, Lightbulb, Search, User, MessageCircle, Star, Headphones, Building } from "lucide-react";
import type { Service, ProviderWithUser } from "@shared/schema";

export default function Index() {
  const { t } = useLanguage();

  // Fetch popular services
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services/popular"],
  });

  // Fetch Club Pro providers
  const { data: providers, isLoading: providersLoading } = useQuery<ProviderWithUser[]>({
    queryKey: ["/api/providers?clubPro=true"],
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
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 pt-20 md:pt-20 pb-12 md:pb-16 pattern-bg">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-2">
              {t("hero.title")}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {" "}{t("hero.title_highlight")}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              {t("hero.subtitle")}
            </p>
          </div>
          
          {/* Smart Search Bar */}
          <SmartSearch />
          
          {/* Quick Actions */}
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-6 md:mt-8 animate-fade-in px-4">
            {popularCategories.map((category) => (
              <Badge 
                key={category}
                variant="secondary"
                className="bg-white/70 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium text-gray-700 border border-orange-200 hover:bg-white cursor-pointer transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Services populaires - Nouvelle section après recherche */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {t("services.popular_in")} <span className="text-orange-500" id="user-city">{t("hero.location")}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              {t("services.subtitle")}
            </p>
          </div>
          
          {/* Grid des services populaires */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 px-2 md:px-0">
            {[
              { name: 'Plomberie', icon: '🔧', count: '156 pros', popular: true },
              { name: 'Ménage', icon: '🧽', count: '89 pros', popular: true },
              { name: 'Électricité', icon: '⚡', count: '134 pros', popular: false },
              { name: 'Jardinage', icon: '🌱', count: '67 pros', popular: false },
              { name: 'Peinture', icon: '🎨', count: '92 pros', popular: true },
              { name: 'Réparation', icon: '🔨', count: '78 pros', popular: false },
            ].map((service, index) => (
              <div key={index} className="group cursor-pointer relative">
                <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-6 text-center hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-2">
                  {/* Badge populaire */}
                  {service.popular && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      🔥 TOP
                    </div>
                  )}
                  
                  <div className="text-2xl md:text-4xl mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold md:font-bold text-sm md:text-base text-gray-900 mb-1 md:mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                    {service.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">{service.count}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bouton voir plus */}
          <div className="text-center mt-12">
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
              {t("services.explore")}
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
                {t("club_pro.title")}
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t("club_pro.home_subtitle")}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <span className="font-medium text-gray-800">{t("club_pro.badge_benefit")}</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{t("club_pro.priority_benefit")}</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{t("club_pro.support_benefit")}</span>
                </div>
                
                {/* Avantage principal - mis en évidence */}
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-400/20 to-orange-300/20 rounded-xl border-2 border-yellow-300/50">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-orange-800 block">{t("club_pro.exclusive_access")}</span>
                    <span className="font-medium text-gray-800">{t("club_pro.large_projects")}</span>
                  </div>
                </div>
              </div>
              
              <button className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-lg">
                {t("club_pro.join_cta")}
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

      {/* Section avis utilisateurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("testimonials.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>
          
          {/* Grid des avis */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Fatima El Mansouri",
                city: "Casablanca",
                service: "Ménage",
                rating: 5,
                comment: "Service impeccable ! La femme de ménage était ponctuelle et très professionnelle. Je recommande vivement Khadamat.",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c8a6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                date: "Il y a 2 jours"
              },
              {
                name: "Mohamed Benali",
                city: "Rabat", 
                service: "Plomberie",
                rating: 5,
                comment: "Problème de fuite résolu en 30 minutes. Le plombier était compétent et le prix très raisonnable. Excellent service !",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                date: "Il y a 5 jours"
              },
              {
                name: "Aicha Zerouali",
                city: "Marrakech",
                service: "Jardinage", 
                rating: 5,
                comment: "Mon jardin n'a jamais été aussi beau ! L'équipe de jardinage était soigneuse et a respecté tous mes souhaits.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                date: "Il y a 1 semaine"
              },
              {
                name: "Omar Tazi",
                city: "Fès",
                service: "Électricité",
                rating: 5,
                comment: "Installation électrique parfaite. L'électricien était très professionnel et a expliqué chaque étape. Service au top !",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                date: "Il y a 3 jours"
              }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Header de l'avis */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-500">{review.city}</p>
                    </div>
                  </div>
                  
                  {/* Badge service */}
                  <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                    {review.service}
                  </span>
                </div>
                
                {/* Étoiles */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                </div>
                
                {/* Commentaire */}
                <p className="text-gray-600 leading-relaxed text-sm italic">
                  "{review.comment}"
                </p>
                
                {/* Badge vérifié */}
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Avis vérifié</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Statistiques globales */}
          <div className="text-center mt-12 bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">4.9★</div>
                <div className="text-gray-600">Note moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">12,547</div>
                <div className="text-gray-600">Avis clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
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
