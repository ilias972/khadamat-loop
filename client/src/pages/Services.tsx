import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import ServiceCard from "@/components/services/ServiceCard";
import SmartSearch from "@/components/search/SmartSearch";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@shared/schema";

export default function Services() {
  const { t } = useLanguage();

  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t("common.error")}</p>
          <button onClick={() => window.location.reload()} className="text-orange-500 hover:text-orange-600">
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t("nav.services")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t("services.subtitle")}
            </p>
            
            <SmartSearch />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {services?.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onClick={() => console.log("Navigate to service:", service.name)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
