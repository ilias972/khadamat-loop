import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import ServiceCard from "@/components/services/ServiceCard";
import ProviderCard from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Tag, Rocket, Shield, Mail, Bell, MapPin, Lightbulb } from "lucide-react";
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



      {/* Featured Providers */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("providers.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("providers.subtitle")}
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

      {/* Club Pro Section */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Crown className="w-6 h-6 text-yellow-300" />
              <span className="font-bold text-lg">{t("nav.club_pro")}</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-6">
              {t("club_pro.title")}
            </h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              {t("club_pro.subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("club_pro.verification.title")}</h3>
              <p className="text-orange-100 leading-relaxed">
                {t("club_pro.verification.desc")}
              </p>
            </div>
            
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("club_pro.visibility.title")}</h3>
              <p className="text-orange-100 leading-relaxed">
                {t("club_pro.visibility.desc")}
              </p>
            </div>
            
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("club_pro.trust.title")}</h3>
              <p className="text-orange-100 leading-relaxed">
                {t("club_pro.trust.desc")}
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg">
              {t("club_pro.cta")}
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t("newsletter.title")}
          </h2>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            {t("newsletter.subtitle")}
          </p>
          
          <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-2">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <input 
                type="email" 
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder-orange-200 border-none focus:outline-none"
                placeholder={t("newsletter.placeholder")}
              />
              <Button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all">
                {t("newsletter.subscribe")}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-orange-200 mt-4">
            <Shield className="w-4 h-4 inline mr-2" />
            {t("newsletter.privacy")}
          </p>
        </div>
      </section>
    </div>
  );
}
