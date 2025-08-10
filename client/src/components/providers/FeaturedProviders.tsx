import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import ArtisanProfileCard from "@/components/providers/ArtisanProfileCard";
import { getTopPriorityProvider } from "@/lib/providerSorting";
import type { SortableProvider } from "@/lib/providerSorting";

// Aucune donnée de prestataire en dur
const mockProviders: SortableProvider[] = [];

export default function FeaturedProviders() {
  const { t } = useLanguage();

  // Afficher les 8 prestataires Club Pro sélectionnés mensuellement
  const featuredProviders = mockProviders;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Titre et description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("featured_providers.title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("featured_providers.subtitle")}
          </p>
        </div>

        {featuredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProviders.map((provider) => (
              <ArtisanProfileCard
                key={provider.id}
                provider={{
                  id: provider.id.toString(),
                  name: `${provider.user.firstName} ${provider.user.lastName}`,
                  service: provider.specialties?.[0] || "Service",
                  description: provider.bio || undefined,
                  location: provider.city,
                  rating: parseFloat(provider.rating || "0"),
                  reviewCount: provider.reviewCount || 0,
                  isVerified: provider.user.isVerified || false,
                  isPro: provider.isClubPro,
                  avatar: provider.user.avatar || undefined
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{t("featured_providers.empty")}</p>
            <Link href="/register">
              <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
                {t("featured_providers.cta")}
              </button>
            </Link>
          </div>
        )}

        {/* Bouton voir plus */}
        <div className="text-center mt-12">
          <Link href="/prestataires">
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all">
              {t("featured_providers.view_all")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
} 