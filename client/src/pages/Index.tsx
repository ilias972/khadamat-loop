import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import ServiceCard from "@/components/services/ServiceCard";
import ProviderCard from "@/components/providers/ProviderCard";
import ChatInterface from "@/components/messaging/ChatInterface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Tag, Rocket, Shield } from "lucide-react";
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

  // Mock data for chat demo
  const mockContact = {
    id: 1,
    name: "Ahmed Benali",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    isOnline: true,
  };

  const mockMessages = [
    {
      id: 1,
      text: "Bonjour ! J'ai bien reçu votre demande pour l'installation électrique. Je peux passer demain matin.",
      isSent: false,
      timestamp: "10:30",
    },
    {
      id: 2,
      text: "Parfait ! À quelle heure exactement ?",
      isSent: true,
      timestamp: "10:32",
    },
    {
      id: 3,
      text: "Entre 9h et 10h si ça vous convient. J'apporte tout le matériel nécessaire.",
      isSent: false,
      timestamp: "10:33",
    },
  ];

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

      {/* Service Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("services.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>
          
          {servicesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services?.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onClick={() => console.log("Navigate to service:", service.name)}
                />
              ))}
            </div>
          )}
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

      {/* Chat Interface Demo */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t("chat.title")}
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t("chat.subtitle")}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{t("chat.features.realtime")}</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{t("chat.features.calls")}</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{t("chat.features.files")}</span>
                </div>
              </div>
            </div>
            
            <ChatInterface 
              contact={mockContact}
              messages={mockMessages}
              onSendMessage={(message) => console.log("Send message:", message)}
            />
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
