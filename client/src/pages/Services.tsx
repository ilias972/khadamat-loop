import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import ServiceCard from "@/components/services/ServiceCard";
import SmartSearch from "@/components/search/SmartSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "wouter";
import type { Service } from "@shared/schema";

// Données mockées comme fallback
const mockServices: Service[] = [
  {
    id: 1,
    name: "Plomberie",
    nameAr: "سباكة",
    description: "Services de plomberie professionnels pour tous vos besoins",
    descriptionAr: "خدمات سباكة احترافية لجميع احتياجاتك",
    category: "plomberie",
    icon: "Wrench",
    isPopular: true
  },
  {
    id: 2,
    name: "Électricité",
    nameAr: "كهرباء",
    description: "Installation et réparation électrique sécurisée",
    descriptionAr: "تركيب وإصلاح كهربائي آمن",
    category: "electricite",
    icon: "Zap",
    isPopular: true
  },
  {
    id: 3,
    name: "Nettoyage",
    nameAr: "تنظيف",
    description: "Services de nettoyage résidentiel et commercial",
    descriptionAr: "خدمات تنظيف سكنية وتجارية",
    category: "nettoyage",
    icon: "Sparkles",
    isPopular: true
  },
  {
    id: 4,
    name: "Jardinage",
    nameAr: "بستنة",
    description: "Entretien et aménagement de jardins",
    descriptionAr: "صيانة وتنسيق الحدائق",
    category: "jardinage",
    icon: "TreePine",
    isPopular: false
  },
  {
    id: 5,
    name: "Peinture",
    nameAr: "دهان",
    description: "Services de peinture intérieure et extérieure",
    descriptionAr: "خدمات دهان داخلية وخارجية",
    category: "peinture",
    icon: "Palette",
    isPopular: true
  },
  {
    id: 6,
    name: "Réparation",
    nameAr: "إصلاح",
    description: "Réparation générale et maintenance",
    descriptionAr: "إصلاح عام وصيانة",
    category: "reparation",
    icon: "Hammer",
    isPopular: false
  },
  {
    id: 7,
    name: "Climatisation",
    nameAr: "تكييف",
    description: "Installation et maintenance de climatisation",
    descriptionAr: "تركيب وصيانة التكييف",
    category: "climatisation",
    icon: "Snowflake",
    isPopular: false
  },
  {
    id: 8,
    name: "Sécurité",
    nameAr: "أمن",
    description: "Systèmes de sécurité et surveillance",
    descriptionAr: "أنظمة الأمن والمراقبة",
    category: "securite",
    icon: "Shield",
    isPopular: false
  }
];

const categories = ['Tous', 'Populaires', 'Nouveaux', 'Urgents'];

export default function Services() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    retry: 1, // Réduire les tentatives pour éviter les longs délais
  });

  // Utiliser les données mockées si l'API échoue ou retourne vide
  const displayServices = services && services.length > 0 ? services : mockServices;

  // Filtrer les services selon la catégorie sélectionnée
  const filteredServices = displayServices.filter(service => {
    if (selectedCategory === 'Tous') return true;
    if (selectedCategory === 'Populaires') return service.isPopular;
    if (selectedCategory === 'Nouveaux') return !service.isPopular;
    if (selectedCategory === 'Urgents') return service.isPopular; // Pour l'exemple
    return true;
  });

  const handleServiceClick = (service: Service) => {
    // Rediriger vers la page des prestataires avec le service sélectionné
    window.location.href = `/artisans?service=${encodeURIComponent(service.name)}`;
  };

  if (error) {
    console.log("Erreur API Services:", error);
    // On continue avec les données mockées au lieu d'afficher une erreur
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

      {/* Filtres */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-gray-50 rounded-2xl p-2 shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'hover:bg-orange-100 hover:text-orange-700 text-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
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
            <>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {selectedCategory === 'Tous' ? 'Tous nos services' : `Services ${selectedCategory.toLowerCase()}`}
                </h2>
                <p className="text-gray-600">
                  {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredServices.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service}
                    onClick={() => handleServiceClick(service)}
                  />
                ))}
              </div>
              
              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">Aucun service trouvé pour cette catégorie</p>
                  <button 
                    onClick={() => setSelectedCategory('Tous')}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Voir tous les services
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Besoin d'un service spécifique ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Si vous ne trouvez pas le service que vous recherchez, contactez-nous directement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                Nous contacter
              </button>
            </Link>
            <Link href="/artisans">
              <button className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
                Voir les prestataires
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
