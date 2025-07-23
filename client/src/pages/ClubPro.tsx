
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Headphones, Building, Star, CheckCircle, ArrowRight, Users, TrendingUp, Award, CreditCard, Tag, Rocket, Shield, Crown } from "lucide-react";

export default function ClubPro() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Tag,
      title: t("club_pro.verification.title"),
      description: t("club_pro.verification.desc"),
    },
    {
      icon: Rocket,
      title: t("club_pro.visibility.title"),
      description: t("club_pro.visibility.desc"),
    },
    {
      icon: Shield,
      title: t("club_pro.trust.title"),
      description: t("club_pro.trust.desc"),
    },
  ];

  const benefits = [
    {
      icon: Star,
      title: t("club_pro.benefit_badge_title"),
      description: t("club_pro.benefit_badge_desc"),
    },
    {
      icon: TrendingUp,
      title: t("club_pro.benefit_ranking_title"),
      description: t("club_pro.benefit_ranking_desc"),
    },
    {
      icon: Users,
      title: t("club_pro.benefit_projects_title"),
      description: t("club_pro.benefit_projects_desc"),
    },
    {
      icon: Award,
      title: t("club_pro.benefit_support_title"),
      description: t("club_pro.benefit_support_desc"),
    },
  ];



  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <span className="font-bold text-lg">{t("nav.club_pro")}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t("club_pro.title")}
          </h1>
          
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed mb-8">
            {t("club_pro.subtitle")}
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-orange-100 text-sm">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5" />
              <span>{t("club_pro.verification_24h")}</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5" />
              <span>{t("club_pro.priority_support")}</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5" />
              <span>{t("club_pro.premium_badge")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("club_pro.why_choose")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("club_pro.join_elite")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse p-6 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t("club_pro.pricing_title")}
          </h2>
          
          <p className="text-xl text-gray-600 mb-12">
            {t("club_pro.pricing_subtitle")}
          </p>
          
          {/* Carte d'abonnement unique */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 max-w-md mx-auto">
            <div className="bg-white/20 rounded-2xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2">{t("nav.club_pro")}</h3>
              <div className="text-5xl font-bold mb-2">50 {t("common.currency")}</div>
              <div className="text-orange-100">{t("club_pro.per_month")}</div>
              <div className="text-sm text-orange-100 mt-2">
                {t("club_pro.commitment_1_year")}
              </div>
            </div>
            
            {/* Nouveaux avantages */}
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-500 font-bold text-sm">✓</span>
                </div>
                <span className="font-medium">{t("club_pro.badge_benefit")}</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Search className="w-4 h-4 text-orange-500" />
                </div>
                <span className="font-medium">{t("club_pro.priority_benefit")}</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-4 h-4 text-orange-500" />
                </div>
                <span className="font-medium">{t("club_pro.support_benefit")}</span>
              </div>
              
              {/* Avantage principal - mis en évidence */}
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-400/20 to-orange-300/20 rounded-xl border-2 border-yellow-300/30">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-yellow-100 block">{t("club_pro.exclusive_access")}</span>
                  <span className="font-medium">{t("club_pro.large_projects")}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-white text-orange-500 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
              {t("club_pro.join_button")}
            </button>
          </div>
          
          {/* Moyens de paiement */}
          <div className="mt-12">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">{t("club_pro.payment_methods")}</h4>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {/* inwi money */}
              <div className="flex items-center space-x-3 bg-red-50 px-4 py-3 rounded-lg hover:bg-red-100 transition-colors">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold">inwi</span>
                </div>
                <span className="font-semibold text-gray-700">inwi money</span>
              </div>
              
              {/* Maroc Telecom */}
              <div className="flex items-center space-x-3 bg-blue-50 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">MT</span>
                </div>
                <span className="font-semibold text-gray-700">MT Cash</span>
              </div>
              
              {/* Orange Money */}
              <div className="flex items-center space-x-3 bg-orange-50 px-4 py-3 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">📱</span>
                </div>
                <span className="font-semibold text-gray-700">Orange Money</span>
              </div>
              
              {/* PayPal avec logo amélioré */}
              <div className="flex items-center space-x-3 bg-blue-50 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.124 9.124 0 0 1-.478 1.634c-.99 4.945-4.24 6.674-8.424 6.674h-2.13c-.524 0-.968.382-1.05.9L7.076 21.337"/>
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">PayPal</span>
              </div>
              
              {/* Carte bancaire */}
              <div className="flex items-center space-x-3 bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 transition-colors">
                <CreditCard className="w-10 h-10 text-green-600" />
                <span className="font-semibold text-gray-700">Carte bancaire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section avis prestataires - remplace "Prêt à rejoindre" */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Témoignages de nos prestataires Club Pro
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez comment le Club Pro a transformé leur activité
            </p>
          </div>
          
          {/* Grid des avis prestataires */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Hassan Benali",
                service: "Plomberie",
                city: "Casablanca", 
                comment: "Depuis Club Pro, j'accède à des projets d'entreprises. Mon chiffre d'affaires a triplé !",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                rating: 5,
                badge: "Club Pro depuis 2 ans"
              },
              {
                name: "Khadija El Fassi",
                service: "Ménage",
                city: "Rabat",
                comment: "Le badge Club Pro me donne une crédibilité énorme. Les clients me font plus confiance.",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c8a6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100", 
                rating: 5,
                badge: "Club Pro depuis 1 an"
              },
              {
                name: "Youssef Taibi",
                service: "Électricité", 
                city: "Marrakech",
                comment: "Grâce aux gros projets Club Pro, j'ai pu embaucher 3 employés. Merci Khadamat !",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                rating: 5,
                badge: "Club Pro depuis 3 ans"
              },
              {
                name: "Amina Zerktouni",
                service: "Jardinage",
                city: "Fès", 
                comment: "Le support dédié est fantastique. Ils m'aident à décrocher les meilleurs contrats.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                rating: 5,
                badge: "Club Pro depuis 6 mois"
              }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.service} • {review.city}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">
                  {review.badge}
                </div>
                
                <p className="text-gray-600 italic text-sm mb-4">"{review.comment}"</p>
                
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Rejoindre Club Pro ?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Démarquez-vous de la concurrence et accédez à des opportunités exclusives dès aujourd'hui
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
            >
              {t("club_pro.cta")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
