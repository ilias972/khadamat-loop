import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Users, Crown, ArrowRight } from "lucide-react";

export default function JoinProviders() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez notre communauté de professionnels certifiés
          </h2>
          
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            Développez votre activité, gagnez la confiance des clients et accédez à de nouveaux projets avec notre plateforme de confiance.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <button className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <span>Devenir prestataire</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          
          <Link href="/club-pro">
            <button className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center space-x-2 border-2 border-white/20 hover:border-white/30">
              <Crown className="w-5 h-5" />
              <span>Club Pro</span>
            </button>
          </Link>
        </div>

        {/* Avantages */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Développez votre activité</h3>
            <p className="text-orange-100">Accédez à de nouveaux clients et projets réguliers</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Gagnez la confiance</h3>
            <p className="text-orange-100">Badge de vérification et avis clients pour vous démarquer</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Tarifs compétitifs</h3>
            <p className="text-orange-100">Fixez vos prix et maximisez vos revenus</p>
          </div>
        </div>
      </div>
    </section>
  );
} 