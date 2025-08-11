import { useQuery } from "@tanstack/react-query";
import ServiceCard from "@/components/services/ServiceCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface CatalogService {
  id: number;
  code: string;
  slug: string;
  name_fr: string;
  name_ar: string;
}

interface CatalogCategory {
  code: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  services: CatalogService[];
}

export default function Services() {
  const { language, t } = useLanguage();
  const { data, isLoading } = useQuery<{ categories: CatalogCategory[] }>({
    queryKey: ["/api/services/catalog", language],
    queryFn: async () => {
      const res = await fetch(`/api/services/catalog?locale=${language}`);
      const json = await res.json();
      return json.success ? json.data : { categories: [] };
    },
  });

  const categories = data?.categories ?? [];

  const handleServiceClick = (s: CatalogService) => {
    window.location.href = `/prestataires?service=${s.slug}`;
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {isLoading ? (
            <div>{t("common.loading")}</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.code} id={cat.slug}>
                <h2 className="text-2xl font-bold mb-6">
                  {language === "ar" ? cat.name_ar : cat.name_fr}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {cat.services.map((s) => (
                    <ServiceCard
                      key={s.id}
                      service={{
                        id: s.id,
                        name: s.name_fr,
                        nameAr: s.name_ar,
                        description: "",
                        descriptionAr: "",
                        category: s.code,
                        icon: "",
                        isPopular: false,
                      }}
                      onClick={() => handleServiceClick(s)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
