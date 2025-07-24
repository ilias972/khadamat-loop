import { useLanguage } from "@/contexts/LanguageContext";
import { Handshake, Building, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Partners() {
  const { t } = useLanguage();

  const partners = [
    {
      name: "Maroc Telecom",
      logo: "🌐",
      description: "Partenaire technologique pour les solutions de communication",
      category: "Technologie"
    },
    {
      name: "Banque Populaire",
      logo: "🏦",
      description: "Solutions de paiement et financement pour nos prestataires",
      category: "Finance"
    },
    {
      name: "CNSS",
      logo: "🏛️",
      description: "Vérification des statuts professionnels",
      category: "Institution"
    },
    {
      name: "Inwi",
      logo: "📱",
      description: "Partenaire télécoms pour les notifications SMS",
      category: "Technologie"
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Accès élargi",
      description: "Atteignez nos 50,000+ utilisateurs actifs"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: "Croissance mutuelle",
      description: "Développons ensemble nos activités"
    },
    {
      icon: <Building className="w-8 h-8 text-orange-500" />,
      title: "Visibilité renforcée",
      description: "Profitez de notre plateforme pour vous faire connaître"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Handshake className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nos Partenaires
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ensemble, nous créons un écosystème de services d'excellence au Maroc
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
            <p className="text-xl text-gray-600">Des partenaires de qualité pour un service d'excellence</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="text-6xl mb-4">{partner.logo}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{partner.name}</h3>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                  {partner.category}
                </span>
                <p className="text-gray-600 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi devenir partenaire ?</h2>
            <p className="text-xl text-gray-600">Découvrez les avantages d'un partenariat avec Khadamat</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Partnerships */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Types de partenariats</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Partenaire Technologique</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li>• Intégration API</li>
                <li>• Solutions de paiement</li>
                <li>• Infrastructure cloud</li>
                <li>• Services de communication</li>
              </ul>
              <Link href="/contact">
                <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all">
                  En savoir plus
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Partenaire Commercial</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li>• Distribution conjointe</li>
                <li>• Marketing croisé</li>
                <li>• Programmes de fidélité</li>
                <li>• Événements communs</li>
              </ul>
              <Link href="/contact">
                <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all">
                  En savoir plus
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Partenaire Institutionnel</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li>• Certifications officielles</li>
                <li>• Programmes de formation</li>
                <li>• Labels de qualité</li>
                <li>• Compliance réglementaire</li>
              </ul>
              <Link href="/contact">
                <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all">
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Intéressé par un partenariat ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contactez notre équipe partenariats pour explorer les opportunités de collaboration
          </p>
          <Link href="/contact">
            <button className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all">
              Devenir partenaire
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}