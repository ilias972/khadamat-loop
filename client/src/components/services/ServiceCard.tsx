import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { getServiceIcon } from "@/lib/serviceIcons";
import { getNameBySlug } from "@/lib/servicesCatalog";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  const { t, language } = useLanguage();

  const name = getNameBySlug(service.category, language);
  const description = language === "ar" && service.descriptionAr ? service.descriptionAr : (service.description || "");

  return (
    <div
      className="group bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:shadow-xl hover:border-orange-300 transition-[transform,box-shadow,border-color] duration-300 transform hover:-translate-y-1 shadow-md service-card-pulse cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
        {(() => {
          const Icon = getServiceIcon(service.category);
          return <Icon className="w-12 h-12 text-orange-500" />;
        })()}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
        {name}
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="text-orange-500 font-semibold hover:text-orange-600 transition-colors flex items-center space-x-2 rtl:space-x-reverse">
        <span>{t("services.explore")}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
