import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Tag, Rocket, Shield, CheckCircle, ArrowRight, Users, TrendingUp, Award } from "lucide-react";

export default function ClubPro() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

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
      title: "Badge Club Pro Distinctif",
      description: "Votre profil sera marqué d'un badge premium visible par tous les clients",
    },
    {
      icon: TrendingUp,
      title: "Classement Prioritaire",
      description: "Apparaissez en premier dans les résultats de recherche",
    },
    {
      icon: Users,
      title: "Accès aux Projets Premium",
      description: "Recevez les demandes de projets les plus valorisés",
    },
    {
      icon: Award,
      title: "Support Client Prioritaire",
      description: "Assistance dédiée et temps de réponse accéléré",
    },
  ];

  const plans = [
    {
      id: "monthly",
      name: "Mensuel",
      price: "299",
      period: "/mois",
      description: "Parfait pour commencer",
      popular: false,
    },
    {
      id: "yearly",
      name: "Annuel",
      price: "2990",
      period: "/an",
      originalPrice: "3588",
      description: "2 mois offerts",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Crown className="w-6 h-6 text-yellow-300" />
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
              <span>Vérification en 24h</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5" />
              <span>Support prioritaire</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5" />
              <span>Badge premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Club Pro ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez l'élite des prestataires et multipliez vos opportunités
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
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choisissez Votre Plan
            </h2>
            <p className="text-xl text-gray-600">
              Des tarifs transparents, sans engagement
            </p>
          </div>

          {/* Plan Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedPlan === "monthly"
                    ? "gradient-orange text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setSelectedPlan("yearly")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                  selectedPlan === "yearly"
                    ? "gradient-orange text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annuel
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                  -17%
                </Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? "ring-2 ring-orange-500 shadow-xl scale-105"
                    : "hover:shadow-lg"
                } ${selectedPlan === plan.id ? "ring-2 ring-orange-400" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 gradient-orange text-white text-center py-2 text-sm font-semibold">
                    ⭐ Plus Populaire
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-8"}`}>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-xl text-gray-600">DH</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500 mt-2">
                        <span className="line-through">{plan.originalPrice} DH/an</span>
                        <span className="text-green-600 font-semibold ml-2">Économisez 598 DH</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  <Button
                    className={`w-full py-4 text-lg font-semibold rounded-xl transition-all ${
                      plan.popular
                        ? "gradient-orange text-white border-0 hover:shadow-lg"
                        : "border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => console.log("Subscribe to", plan.name)}
                  >
                    {plan.popular ? "Commencer Maintenant" : "Choisir ce Plan"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              <Shield className="w-4 h-4 inline mr-2" />
              Annulation possible à tout moment • Support client 24/7
            </p>
            <p className="text-sm text-gray-500">
              * Prix en dirhams marocains, TVA incluse
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white">
            <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
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
