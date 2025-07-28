import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import ServiceCard from "@/components/services/ServiceCard";
import ProviderCard from "@/components/providers/ProviderCard";
import FeaturedProviders from "@/components/providers/FeaturedProviders";
import JoinProviders from "@/components/providers/JoinProviders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Tag, Rocket, Shield, Mail, Bell, MapPin, Lightbulb, Search, User, MessageCircle, Star, Headphones, Building } from "lucide-react";
import { Link } from "wouter";
import type { Service, ProviderWithUser } from "@shared/schema";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { useState, useEffect } from "react";

export default function Index() {
  const { t, language } = useLanguage();
  const [userLocation, setUserLocation] = useState<string>("");

  // Détection automatique de la localisation
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Essayer la géolocalisation du navigateur
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                // Utiliser un service de géocodage inverse (exemple avec une API gratuite)
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
                );
                const data = await response.json();
                const city = data.address?.city || data.address?.town || data.address?.village || "Casablanca";
                setUserLocation(city);
              } catch (error) {
                console.log("Erreur géocodage:", error);
                setUserLocation("Casablanca"); // Fallback
              }
            },
            (error) => {
              console.log("Erreur géolocalisation:", error);
              setUserLocation("Casablanca"); // Fallback
            }
          );
        } else {
          setUserLocation("Casablanca"); // Fallback si géolocalisation non supportée
        }
      } catch (error) {
        console.log("Erreur détection localisation:", error);
        setUserLocation("Casablanca"); // Fallback final
      }
    };

    detectUserLocation();
  }, []);

  // Fetch popular services
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services/popular"],
  });

  // Fetch Club Pro providers
  const { data: providers, isLoading: providersLoading } = useQuery<ProviderWithUser[]>({
    queryKey: ["/api/providers?clubPro=true"],
  });



  const popularCategories = [
    t("services.plumbing"),
    t("services.electricity"), 
    t("services.cleaning"),
    t("services.gardening"),
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 pt-32 md:pt-36 pb-12 md:pb-16 pattern-bg">
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

      {/* Statistiques - 4 blocs d'information */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Prestataires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Missions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">4.8/5</div>
              <div className="text-gray-600 font-medium">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services populaires - Section avec dégradé intégré */}
      <section className="relative overflow-hidden">
        {/* Background principal avec dégradé fluide */}
        <div className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {t("services.popular")}
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                {t("services.subtitle")}
              </p>
            </div>
            
            {/* Grid des services populaires */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 px-2 md:px-0">
              {[
                { nameKey: 'services.plumbing', serviceName: 'plomberie', count: '156 prestataires', popular: true },
                { nameKey: 'services.cleaning', serviceName: 'nettoyage', count: '89 prestataires', popular: true },
                { nameKey: 'services.electricity', serviceName: 'electricite', count: '134 prestataires', popular: false },
                { nameKey: 'services.gardening', serviceName: 'jardinage', count: '67 prestataires', popular: false },
                { nameKey: 'services.painting', serviceName: 'peinture', count: '92 prestataires', popular: true },
                { nameKey: 'services.repair', serviceName: 'reparation', count: '78 prestataires', popular: false },
              ].map((service, index) => {
                return (
                <Link key={index} href="/services">
                  <div className="group cursor-pointer relative">
                    <div className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-6 text-center hover:shadow-xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                      {/* Badge populaire */}
                      {service.popular && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🔥 TOP
                        </div>
                      )}
                      
                      <div className="text-2xl md:text-4xl mb-2 md:mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                        {service.serviceName === 'plomberie' && (
                          <ServiceIcon serviceName={service.serviceName} className="w-12 h-12 md:w-16 md:h-16" />
                        )}
                        {service.serviceName === 'electricite' && (
                          <ServiceIcon serviceName={service.serviceName} className="w-12 h-12 md:w-16 md:h-16" />
                        )}
                      </div>
                      <h3 className="font-semibold md:font-bold text-sm md:text-base text-gray-900 mb-1 md:mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                        {t(service.nameKey)}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">{service.count}</p>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
            
            {/* Bouton voir plus */}
            <div className="text-center mt-12">
              <Link href="/services">
                <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
                  {t("services.explore")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Prestataires en Vedette */}
      <FeaturedProviders />

      {/* Comment ça marche */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("how_it_works.title")}</h2>
            <p className="text-xl text-gray-600">{t("how_it_works.subtitle")}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("how_it_works.step1")}</h3>
              <p className="text-gray-600">{t("how_it_works.step1_desc")}</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("how_it_works.step2")}</h3>
              <p className="text-gray-600">{t("how_it_works.step2_desc")}</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("how_it_works.step3")}</h3>
              <p className="text-gray-600">{t("how_it_works.step3_desc")}</p>
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
              
              <Link href="/club-pro">
                <button className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-lg">
                  {t("club_pro.join_cta")}
                </button>
              </Link>
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

      {/* Rejoignez nos prestataires */}
      <JoinProviders />

      {/* Newsletter Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
              {t("newsletter.title")}
            </h2>
            
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 md:mb-12 px-4">
              {t("newsletter.subtitle")}
            </p>
            
            {/* Formulaire newsletter responsive */}
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-4 mb-8 md:mb-12">
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <input 
                    type="email"
                    className="flex-1 px-4 md:px-6 py-3 md:py-4 text-base md:text-lg placeholder-gray-400 border-none focus:outline-none rounded-xl min-w-0"
                    placeholder={t("newsletter.placeholder")}
                  />
                </div>
                <Link href="/register">
                  <button className="w-full gradient-orange text-white px-4 md:px-6 py-3 md:py-4 rounded-xl font-semibold transition-all hover:scale-105">
                    {t("newsletter.subscribe")}
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Avantages */}
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg border border-orange-100 max-w-2xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Ce que vous recevrez :</h3>
              
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Bell className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Actualités du site</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Nouvelles fonctionnalités et mises à jour</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Prestataires locaux</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Nouveaux prestataires dans votre région</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Tag className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Offres exclusives</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Réductions et promotions spéciales</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Lightbulb className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Conseils utiles</h4>
                    <p className="text-gray-600 text-xs md:text-sm">Astuces et guides pratiques</p>
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
