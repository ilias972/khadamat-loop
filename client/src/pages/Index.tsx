import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import ServiceCard from "@/components/services/ServiceCard";
import ProviderCard from "@/components/providers/ProviderCard";
import FeaturedProvidersCarousel from "@/components/providers/FeaturedProvidersCarousel";
import JoinProviders from "@/components/providers/JoinProviders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Tag, Rocket, Shield, Mail, Bell, MapPin, Lightbulb, Search, User, MessageCircle, Star, Headphones, Building, Wrench, Droplets, Sparkles, Palette, Hammer } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Service, ProviderWithUser } from "@shared/schema";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { useState, useEffect } from "react";

export default function Index() {
  const { t, language } = useLanguage();
  const [userLocation, setUserLocation] = useState<string>("");
  const [, setLocation] = useLocation();

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
    { name: t("services.plumbing"), service: "plomberie", icon: Droplets },
    { name: t("services.electricity"), service: "electricite", icon: Lightbulb },
    { name: t("services.cleaning"), service: "nettoyage", icon: Sparkles },
    { name: t("services.gardening"), service: "jardinage", icon: Wrench },
  ];

  const handleSuggestionClick = (service: string) => {
    // Rediriger vers la page Prestataires avec le filtre de service
    setLocation(`/prestataires?service=${encodeURIComponent(service)}`);
  };

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
          
          {/* Quick Actions - Suggestions cliquables */}
          <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-6 md:mt-8 animate-fade-in px-4">
            {popularCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Badge 
                  key={category.name}
                  variant="secondary"
                  className="bg-white/70 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium text-gray-700 border border-orange-200 hover:bg-white cursor-pointer transition-colors flex items-center gap-2"
                  onClick={() => handleSuggestionClick(category.service)}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Badge>
              );
            })}
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
        {/* Background principal avec dégradé fluide - full width */}
        <div className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50 to-orange-50 w-full">
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
                { nameKey: 'services.plumbing', serviceName: 'plomberie', count: '156 prestataires', popular: true, icon: Droplets },
                { nameKey: 'services.cleaning', serviceName: 'nettoyage', count: '89 prestataires', popular: true, icon: Sparkles },
                { nameKey: 'services.electricity', serviceName: 'electricite', count: '134 prestataires', popular: false, icon: Lightbulb },
                { nameKey: 'services.gardening', serviceName: 'jardinage', count: '67 prestataires', popular: false, icon: Wrench },
                { nameKey: 'services.painting', serviceName: 'peinture', count: '92 prestataires', popular: true, icon: Palette },
                { nameKey: 'services.repair', serviceName: 'reparation', count: '78 prestataires', popular: false, icon: Hammer },
              ].map((service, index) => {
                const Icon = service.icon;
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
                        <Icon className="w-12 h-12 md:w-16 md:h-16 text-orange-500" />
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

      {/* Comment ça marche */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t("how_it_works.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("how_it_works.subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step1")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step1_desc")}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step2")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step2_desc")}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step3")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prestataires en vedette */}
      <FeaturedProvidersCarousel />

      {/* Rejoindre les prestataires */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <JoinProviders />
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t("testimonials.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Excellent service ! Le prestataire était ponctuel, professionnel et le travail était parfait. Je recommande vivement."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Fatima Z.</div>
                  <div className="text-sm text-gray-600">Casablanca</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Très satisfait de la qualité du service. Prix raisonnable et délais respectés. Je ferai appel à nouveau."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Ahmed M.</div>
                  <div className="text-sm text-gray-600">Rabat</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Plateforme très pratique pour trouver des prestataires fiables. L'interface est intuitive et le service client réactif."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Khadija L.</div>
                  <div className="text-sm text-gray-600">Marrakech</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("newsletter.title")}
          </h2>
          <p className="text-lg md:text-xl mb-8 text-orange-100">
            {t("newsletter.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {t("newsletter.subscribe")}
            </button>
          </div>
          
          <p className="text-sm text-orange-200 mt-4">
            {t("newsletter.privacy")}
          </p>
        </div>
      </section>
    </div>
  );
}
