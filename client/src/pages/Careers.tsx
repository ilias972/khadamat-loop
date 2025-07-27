import { useLanguage } from "@/contexts/LanguageContext";
import { Briefcase, Users, Heart, TrendingUp, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Careers() {
  const { t } = useLanguage();

  const jobOffers = [
    {
      title: "Développeur Full-Stack",
      location: "Casablanca",
      type: "CDI",
      department: "Tech",
      description: "Rejoignez notre équipe technique pour développer la prochaine génération de Khadamat."
    },
    {
      title: "Responsable Marketing Digital",
      location: "Rabat",
      type: "CDI",
      department: "Marketing",
      description: "Pilotez notre stratégie marketing digital et développez notre présence en ligne."
    },
    {
      title: "Customer Success Manager",
      location: "Remote",
      type: "CDI",
      department: "Support",
      description: "Accompagnez nos clients dans leur réussite sur la plateforme Khadamat."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16 pt-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Rejoignez l'équipe Khadamat
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Construisons ensemble l'avenir des services au Maroc
          </p>
          <div className="flex justify-center">
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Équipe passionnée</h3>
                <p className="text-gray-600">Des collègues motivés et bienveillants</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Croissance forte</h3>
                <p className="text-gray-600">Opportunités d'évolution et d'apprentissage</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Impact positif</h3>
                <p className="text-gray-600">Aidez des milliers de Marocains</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Postes ouverts</h2>
            <p className="text-xl text-gray-600">Trouvez le poste qui vous correspond</p>
          </div>

          <div className="space-y-6">
            {jobOffers.map((job, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                        {job.department}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600">{job.description}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link href="/contact">
                      <button className="gradient-orange text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all">
                        Postuler
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi Khadamat ?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Salaire attractif",
                description: "Rémunération compétitive avec primes de performance"
              },
              {
                icon: "🏥",
                title: "Assurance santé",
                description: "Couverture médicale complète pour vous et votre famille"
              },
              {
                icon: "🏖️",
                title: "Congés flexibles",
                description: "25 jours de congés + jours de récupération"
              },
              {
                icon: "📚",
                title: "Formation continue",
                description: "Budget formation et conférences tech"
              },
              {
                icon: "🏠",
                title: "Télétravail",
                description: "Flexibilité hybride bureau/domicile"
              },
              {
                icon: "🎯",
                title: "Objectifs clairs",
                description: "OKRs transparents et feedback régulier"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Envoyez-nous votre candidature spontanée, nous serons ravis de vous rencontrer !
          </p>
          <Link href="/contact">
            <button className="gradient-orange text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all">
              Candidature spontanée
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}