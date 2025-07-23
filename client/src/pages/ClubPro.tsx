
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Tag, Rocket, Shield, CheckCircle, ArrowRight, Users, TrendingUp, Award, CreditCard } from "lucide-react";

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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Un seul abonnement, tous les avantages
          </h2>
          
          <p className="text-xl text-gray-600 mb-12">
            Rejoignez le Club Pro et boostez votre activité
          </p>
          
          {/* Carte d'abonnement unique */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 max-w-md mx-auto">
            <div className="bg-white/20 rounded-2xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2">Club Pro</h3>
              <div className="text-5xl font-bold mb-2">50 DH</div>
              <div className="text-orange-100">par mois</div>
              <div className="text-sm text-orange-100 mt-2">
                💍 Engagement 1 an
              </div>
            </div>
            
            {/* Avantages */}
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Badge "Vérifié" sur votre profil</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Priorité dans les résultats de recherche</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>0% de commission sur les services</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Support prioritaire 24/7</span>
              </div>
            </div>
            
            <button className="w-full bg-white text-orange-500 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
              Rejoindre maintenant
            </button>
          </div>
          
          {/* Moyens de paiement */}
          <div className="mt-12">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Moyens de paiement acceptés</h4>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">inwi</span>
                </div>
                <span className="font-medium text-gray-700">inwi money</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">iam</span>
                </div>
                <span className="font-medium text-gray-700">MT Cash</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📱</span>
                </div>
                <span className="font-medium text-gray-700">Orange Money</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                <CreditCard className="w-8 h-8 text-green-500" />
                <span className="font-medium text-gray-700">Carte bancaire</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
                <span className="font-medium text-gray-700">PayPal</span>
              </div>
            </div>
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
