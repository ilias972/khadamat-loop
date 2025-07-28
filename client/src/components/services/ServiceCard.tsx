import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import ServiceIcon from "@/components/ui/ServiceIcon";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  const { t, language } = useLanguage();
  
  const name = language === "ar" && service.nameAr ? service.nameAr : service.name;
  const description = language === "ar" && service.descriptionAr ? service.descriptionAr : (service.description || "");

  return (
    <div 
      className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 hover-scale cursor-pointer"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {(service.category === 'plomberie' || service.name === 'Plomberie' || service.category === 'electricite' || service.name === 'Électricité') && (
          <ServiceIcon serviceName={service.category || service.name} className="w-12 h-12" />
        )}
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
