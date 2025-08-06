import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Users, Crown, ArrowRight } from "lucide-react";

export default function JoinProviders() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("join_providers.title")}
          </h2>
          
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            {t("join_providers.subtitle")}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <button  className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <span>{t("join_providers.become_provider")}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          
          <Link href="/club-pro">
            <button className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center space-x-2 border-2 border-white/20 hover:border-white/30">
              <Crown className="w-5 h-5" />
              <span>{t("join_providers.club_pro")}</span>
            </button>
          </Link>
        </div>

        {/* Avantages */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{t("join_providers.develop_activity_title")}</h3>
            <p className="text-orange-100">{t("join_providers.develop_activity_desc")}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{t("join_providers.gain_trust_title")}</h3>
            <p className="text-orange-100">{t("join_providers.gain_trust_desc")}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{t("join_providers.competitive_prices_title")}</h3>
            <p className="text-orange-100">{t("join_providers.competitive_prices_desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
} 