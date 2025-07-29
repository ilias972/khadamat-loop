
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Headphones, Building, Star, CheckCircle, ArrowRight, Users, TrendingUp, Award, CreditCard, Tag, Rocket, Shield, Crown, User } from "lucide-react";

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
      title: "Accès aux Clients Premium",
      description: "Recevez les demandes des clients les plus valorisés et fidèles",
    },
    {
      icon: Award,
      title: t("club_pro.benefit_support_title"),
      description: t("club_pro.benefit_support_desc"),
    },
  ];

  return (
    <div className="min-h-screen pt-20 mt-[-16px] mb-[-16px]">
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
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Vos Avantages Club Pro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez tous les bénéfices exclusifs réservés aux membres Club Pro
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("club_pro.pricing_title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("club_pro.pricing_subtitle")}
            </p>
          </div>
          
          <Card className="bg-orange-500 text-white border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Crown className="w-4 h-4" />
                  <span>Club Pro</span>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl md:text-6xl font-bold text-white">50 DH</span>
                  <span className="text-xl text-orange-100 ml-2">{t("club_pro.per_month")}</span>
                </div>
                
                <p className="text-orange-100 mb-6">
                  {t("club_pro.commitment_1_year")}
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className={`${benefit.title.includes("Classement Prioritaire") ? "text-yellow-300 font-bold" : "text-white"}`}>
                      {benefit.title}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105">
                  {t("club_pro.join_button")}
                </Button>
                
                <p className="text-sm text-orange-100 mt-4">
                  {t("club_pro.payment_methods")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos membres Club Pro
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos prestataires Club Pro
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ahmed Benali</h4>
                    <p className="text-sm text-gray-600">Électricien Club Pro</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Depuis que j'ai rejoint le Club Pro, j'ai 3x plus de clients. Le badge vérifié fait toute la différence !"
                </p>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">4.9/5 (127 avis)</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fatima Zahra</h4>
                    <p className="text-sm text-gray-600">Nettoyage Club Pro</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Le support prioritaire est exceptionnel. Je reçois une réponse en moins d'1h à chaque fois !"
                </p>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">4.8/5 (89 avis)</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mohammed Idrissi</h4>
                    <p className="text-sm text-gray-600">Plombier Club Pro</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Apparaître en premier dans les résultats de recherche a boosté mon activité de 200% !"
                </p>
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">4.7/5 (156 avis)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à rejoindre l'élite ?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Rejoignez le Club Pro et transformez votre activité dès aujourd'hui
          </p>
          <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105">
            {t("club_pro.join_button")}
          </Button>
        </div>
      </section>
    </div>
  );
}
