import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  TrendingUp,
  Globe,
  Shield,
  CheckCircle,
  Handshake,
  Star,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function About() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const values = [
    {
      icon: Shield,
      title: "Confiance",
      description: "Nous vérifions chaque prestataire pour garantir la qualité et la sécurité de nos services.",
    },
    {
      icon: Heart,
      title: "Proximité",
      description: "Une approche locale qui privilégie les relations humaines et la compréhension des besoins spécifiques.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Nous ne sélectionnons que les meilleurs prestataires pour offrir un service d'exception.",
    },
    {
      icon: Handshake,
      title: "Engagement",
      description: "Notre mission est de faciliter les rencontres entre clients et prestataires de qualité.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Prestataires Actifs", icon: Users },
    { value: "50,000+", label: "Clients Satisfaits", icon: Heart },
    { value: "15", label: "Villes Couvertes", icon: MapPin },
    { value: "4.8/5", label: "Note Moyenne", icon: Star },
  ];

  const milestones = [
    {
      year: "2021",
      title: "Création de Khadamat",
      description: "Lancement de la première version avec 100 prestataires à Casablanca",
    },
    {
      year: "2022",
      title: "Expansion Nationale",
      description: "Extension à 5 grandes villes du Maroc avec plus de 1,000 prestataires",
    },
    {
      year: "2023",
      title: "Lancement Club Pro",
      description: "Introduction du programme de vérification premium pour les prestataires",
    },
    {
      year: "2024",
      title: "Innovation Continue",
      description: "Nouvelles fonctionnalités : messagerie temps réel, service SOS, paiement sécurisé",
    },
  ];

  const team = [
    {
      name: "Youssef Benali",
      role: "CEO & Fondateur",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Expert en technologie avec 15 ans d'expérience dans le digital au Maroc",
    },
    {
      name: "Aicha Alaoui",
      role: "Directrice Technique",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Ingénieure logiciel passionnée par l'innovation et les solutions durables",
    },
    {
      name: "Omar Idrissi",
      role: "Directeur Commercial",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Spécialiste du développement commercial et des partenariats stratégiques",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
            {t("nav.about")}
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Notre Mission :
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {" "}Connecter
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Khadamat est né d'une vision simple : faciliter l'accès aux services professionnels de qualité 
            partout au Maroc en créant une plateforme de confiance qui unit clients et prestataires.
          </p>

          <div className="flex justify-center space-x-4">
            <Button 
              className="gradient-orange text-white px-8 py-3 rounded-xl font-semibold border-0"
              onClick={() => setLocation("/register")}
            >
              Rejoindre Khadamat
            </Button>
            <Button 
              variant="outline" 
              className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl font-semibold"
              onClick={() => setLocation("/services")}
            >
              Découvrir nos Services
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident notre mission et façonnent notre approche
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Tout a commencé en 2021 avec une frustration partagée par de nombreux Marocains : 
                la difficulté de trouver des prestataires de services fiables et qualifiés. 
                Nos fondateurs ont décidé de créer une solution digitale innovante pour résoudre ce problème.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Aujourd'hui, Khadamat est devenu la référence au Maroc pour connecter clients et prestataires, 
                avec un système de vérification rigoureux et des outils modernes pour faciliter les échanges.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                  <span className="text-gray-700">Vérification rigoureuse de tous les prestataires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                  <span className="text-gray-700">Système de notation transparent et équitable</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                  <span className="text-gray-700">Support client disponible 7j/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                  <span className="text-gray-700">Paiement sécurisé et protection des données</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Équipe Khadamat au travail"
                className="rounded-2xl shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Bureau moderne Khadamat"
                className="rounded-2xl shadow-lg mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Technologie et innovation"
                className="rounded-2xl shadow-lg -mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Services professionnels au Maroc"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Notre Parcours
            </h2>
            <p className="text-xl text-gray-600">
              Les étapes clés de notre développement
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 gradient-orange rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                </div>
                <Card className="flex-1 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-600">
                        {milestone.year}
                      </Badge>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 text-orange-200" />
          <h2 className="text-4xl font-bold mb-6">
            Rejoignez Notre Mission
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Que vous soyez client à la recherche de services ou prestataire souhaitant développer votre activité, 
            Khadamat est là pour vous accompagner.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all"
              onClick={() => setLocation("/register")}
            >
              <Users className="w-5 h-5 mr-2" />
              Devenir Prestataire
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-xl font-semibold"
              onClick={() => setLocation("/contact")}
            >
              <Mail className="w-5 h-5 mr-2" />
              Nous Contacter
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 mt-8 text-orange-200">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>+212 5XX XXX XXX</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>hello@khadamat.ma</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
