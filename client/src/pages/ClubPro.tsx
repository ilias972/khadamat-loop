import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Headphones, Building, Star, CheckCircle, ArrowRight, Users, TrendingUp, Award, CreditCard, Tag, Rocket, Shield, Crown, User, Zap, Target, Calendar, MessageSquare, Phone, Mail, MapPin, Clock, DollarSign, Percent, ArrowUpRight } from "lucide-react";

export default function ClubPro() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: "Vérification Premium",
      description: "Badge vérifié et profil certifié pour inspirer confiance",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Visibilité Prioritaire",
      description: "Apparaissez en premier dans les résultats de recherche",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Crown,
      title: "Support Premium",
      description: "Assistance dédiée et réponse en moins d'1 heure",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Accès Premium",
      description: "Clients de qualité et projets exclusifs",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Badge Vérifié",
      description: "Profil certifié avec badge orange",
      highlight: "Exclusif"
    },
    {
      icon: Target,
      title: "Classement Prioritaire",
      description: "Premier dans les résultats de recherche",
      highlight: "Premium"
    },
    {
      icon: Users,
      title: "Clients Premium",
      description: "Accès aux clients les plus valorisés",
      highlight: "Exclusif"
    },
    {
      icon: MessageSquare,
      title: "Support Dédié",
      description: "Réponse garantie en moins d'1 heure",
      highlight: "24/7"
    },
    {
      icon: Calendar,
      title: "Réservations Avancées",
      description: "Planification et gestion optimisée",
      highlight: "Smart"
    },
    {
      icon: DollarSign,
      title: "Tarifs Premium",
      description: "Prix plus élevés pour vos services",
      highlight: "+40%"
    }
  ];

  const stats = [
    { number: "3x", label: "Plus de clients", icon: Users },
    { number: "200%", label: "Augmentation CA", icon: TrendingUp },
    { number: "<1h", label: "Support prioritaire", icon: Clock },
    { number: "95%", label: "Satisfaction", icon: Star }
  ];

  const testimonials = [
    {
      name: "Ahmed Benali",
      role: "Électricien Club Pro",
      avatar: "AB",
      rating: 4.9,
      reviews: 127,
      text: "Depuis que j'ai rejoint le Club Pro, j'ai 3x plus de clients. Le badge vérifié fait toute la différence !",
      highlight: "+300% clients"
    },
    {
      name: "Fatima Zahra",
      role: "Nettoyage Club Pro",
      avatar: "FZ",
      rating: 4.8,
      reviews: 89,
      text: "Le support prioritaire est exceptionnel. Je reçois une réponse en moins d'1h à chaque fois !",
      highlight: "Support 24/7"
    },
    {
      name: "Mohammed Idrissi",
      role: "Plombier Club Pro",
      avatar: "MI",
      rating: 4.7,
      reviews: 156,
      text: "Apparaître en premier dans les résultats de recherche a boosté mon activité de 200% !",
      highlight: "+200% CA"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 pt-24">
      {/* Hero Section - Modern Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
            <Crown className="w-5 h-5" />
            <span className="font-bold text-lg">Club Pro</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Rejoignez l'
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              Élite
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed mb-12">
            Développez votre activité, gagnez la confiance des clients et accédez à de nouveaux projets avec notre plateforme de confiance
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-orange-100 text-sm mb-12">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>Vérification 24h</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>Support prioritaire</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>Badge premium</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
            onClick={() => setLocation("/club-pro/checkout")}
          >
            Rejoindre le Club Pro
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi choisir le Club Pro ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez l'élite des prestataires et bénéficiez d'avantages exclusifs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Vos Avantages Exclusifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez tous les bénéfices réservés aux membres Club Pro
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        {benefit.highlight}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - Modern Card */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tarification Simple
            </h2>
            <p className="text-xl text-black-300">
              Un seul plan, tous les avantages inclus
            </p>
          </div>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
                  <Crown className="w-5 h-5" />
                  <span>Club Pro</span>
                </div>
                
                <div className="mb-8">
                  <span className="text-5xl md:text-7xl font-bold text-white">50 DH</span>
                  <span className="text-2xl text-orange-100 ml-3">/mois</span>
                </div>
                
                <p className="text-orange-100 text-lg mb-8">
                  Engagement d'un an - Paiement sécurisé
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {benefits.slice(0, 6).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white">
                      {benefit.title}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                              <Button 
                className="w-full bg-white text-orange-600 hover:bg-gray-100 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl"
                onClick={() => setLocation("/club-pro/checkout")}
              >
                Rejoindre maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
                
                <p className="text-sm text-orange-100 mt-4">
                  Paiement sécurisé - Carte bancaire, PayPal, Orange Money
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section - Enhanced Design */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ils ont transformé leur activité
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos prestataires Club Pro
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {testimonial.highlight}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{testimonial.rating}/5 ({testimonial.reviews} avis)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à rejoindre l'élite ?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            Rejoignez le Club Pro et transformez votre activité dès aujourd'hui
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="outline" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
              onClick={() => setLocation("/club-pro/checkout")}
            >
              Rejoindre le Club Pro
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button variant="outline" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl">
              En savoir plus
            </Button>
          </div>
          
          <p className="text-sm text-orange-100 mt-6">
            ✓ Vérification en 24h • ✓ Support prioritaire • ✓ Sans engagement
          </p>
        </div>
      </section>
    </div>
  );
}