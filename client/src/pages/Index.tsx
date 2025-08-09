import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import FeaturedProvidersCarousel from "@/components/providers/FeaturedProvidersCarousel";
import JoinProviders from "@/components/providers/JoinProviders";
import NewsletterSection from "@/components/ui/NewsletterSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Search, User, MessageCircle, Star, Wrench, Droplets, Sparkles, Palette, Hammer, Quote } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Service } from "@shared/schema";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { city: userLocation } = useGeolocation();
  const { toast } = useToast();

  // Fetch popular services
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services/popular"],
  });


  const popularCategories = [
    { name: t("services.plumbing"), service: "plomberie", icon: Droplets },
    { name: t("services.electricity"), service: "electricite", icon: Lightbulb },
    { name: t("services.cleaning"), service: "nettoyage", icon: Sparkles },
    { name: t("services.gardening"), service: "jardinage", icon: Wrench },
  ];

  const handleSuggestionClick = (service: string) => {
    // Rediriger vers la page Prestataires avec le service et la localisation détectée
    const params = new URLSearchParams({ service });
    if (userLocation) {
      params.set("location", userLocation);
      toast({ description: t("toast.search_launched").replace("{{city}}", userLocation) });
    } else {
      toast({ description: t("toast.search_launched_generic") });
    }
    setLocation(`/prestataires?${params.toString()}`);
  };

  return (
    <div className="min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 pt-32 md:pt-36 pb-12 md:pb-16 pattern-bg">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight p-2">
              {t("hero.title")}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {" "}{t("hero.title_highlight")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed p-4">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Smart Search Bar avec suggestions */}
          <div id="search">
            <SmartSearch showSuggestions={true} />
          </div>

        </div>
      </section>

      {/* Statistiques - 4 blocs d'information */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">{t("stats.providers")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">{t("stats.missions")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">4.8/5</div>
              <div className="text-gray-600 font-medium">{t("stats.satisfaction")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">{t("stats.support")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services populaires - Section avec dégradé intégré */}
      <section className="relative overflow-hidden">
        {/* Background principal avec dégradé fluide - full width */}
        <div className="py-12 md:py-16 bg-gradient-to-b from-white via-gray-50 to-orange-50 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {t("services.popular")}
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                {t("services.subtitle")}
              </p>
            </div>

            {/* Grid des services populaires */}
            {servicesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rounded-2xl h-32 md:h-40 animate-pulse bg-gray-200/70" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                {[ 
                  { nameKey: 'services.plumbing', serviceName: 'plomberie', count: '156 prestataires', popular: true, icon: Droplets },
                  { nameKey: 'services.cleaning', serviceName: 'nettoyage', count: '89 prestataires', popular: true, icon: Sparkles },
                  { nameKey: 'services.electricity', serviceName: 'electricite', count: '134 prestataires', popular: false, icon: Lightbulb },
                  { nameKey: 'services.gardening', serviceName: 'jardinage', count: '67 prestataires', popular: false, icon: Wrench },
                  { nameKey: 'services.painting', serviceName: 'peinture', count: '92 prestataires', popular: true, icon: Palette },
                  { nameKey: 'services.repair', serviceName: 'reparation', count: '78 prestataires', popular: false, icon: Hammer },
                ].map((service, index) => {
                  const Icon = service.icon;
                  return (
                  <Link
                    key={index}
                    href={`/prestataires?service=${encodeURIComponent(service.serviceName)}${userLocation ? `&location=${encodeURIComponent(userLocation)}` : ""}`}
                    onClick={() => toast({ description: userLocation ? t("toast.search_launched").replace("{{city}}", userLocation) : t("toast.search_launched_generic") })}
                  >
                    <div className="group cursor-pointer relative">
                      <div className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-6 text-center hover:shadow-xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-2 shadow-md service-card-pulse">

                        <div className="text-2xl md:text-4xl mb-2 md:mb-4 group-hover:scale-110 transition-transform flex items-center justify-center aspect-square">
                          <Icon aria-hidden="true" focusable="false" className="w-12 h-12 md:w-16 md:h-16 text-orange-500" />
                        </div>
                        <h3 className="font-semibold md:font-bold text-sm md:text-base text-gray-900 mb-1 md:mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                          {t(service.nameKey)}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">{service.count}</p>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
            
            {/* Bouton voir plus */}
            <div className="text-center mt-12">
              <Link href="/services">
                <Button asChild variant="outline" className="h-11 px-5 rounded-xl">
                  <span>{t("services.explore")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t("how_it_works.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("how_it_works.subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 aspect-square bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search aria-hidden="true" focusable="false" className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step1")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step1_desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 aspect-square bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User aria-hidden="true" focusable="false" className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step2")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step2_desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 aspect-square bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle aria-hidden="true" focusable="false" className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step3")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prestataires en vedette */}
      <FeaturedProvidersCarousel />

      {/* Rejoindre les prestataires - Club Pro - Repositionné plus haut */}
      <JoinProviders />

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t("testimonials.title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg" aria-label="Témoignage">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden aspect-square mr-3">
                  <img src="https://via.placeholder.com/40" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{t("testimonials.user1")}</span>
                  <Badge variant="secondary" className="text-xs">{t("testimonials.verified_badge")}</Badge>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1 rtl:space-x-reverse" aria-label="Note 5 sur 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed font-medium relative">
                <Quote className="w-5 h-5 text-orange-500 absolute -top-2 -left-2 rtl:-right-2 rtl:left-auto rtl:rotate-180" />
                {t("testimonials.review1")}
              </p>
              <div className="text-sm text-gray-600">{t("testimonials.city1")}</div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg" aria-label="Témoignage">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden aspect-square mr-3">
                  <img src="https://via.placeholder.com/40" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{t("testimonials.user2")}</span>
                  <Badge variant="secondary" className="text-xs">{t("testimonials.verified_badge")}</Badge>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1 rtl:space-x-reverse" aria-label="Note 5 sur 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed font-medium relative">
                <Quote className="w-5 h-5 text-orange-500 absolute -top-2 -left-2 rtl:-right-2 rtl:left-auto rtl:rotate-180" />
                {t("testimonials.review2")}
              </p>
              <div className="text-sm text-gray-600">{t("testimonials.city2")}</div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg" aria-label="Témoignage">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden aspect-square mr-3">
                  <img src="https://via.placeholder.com/40" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{t("testimonials.user3")}</span>
                  <Badge variant="secondary" className="text-xs">{t("testimonials.verified_badge")}</Badge>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1 rtl:space-x-reverse" aria-label="Note 5 sur 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed font-medium relative">
                <Quote className="w-5 h-5 text-orange-500 absolute -top-2 -left-2 rtl:-right-2 rtl:left-auto rtl:rotate-180" />
                {t("testimonials.review3")}
              </p>
              <div className="text-sm text-gray-600">{t("testimonials.city3")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Repositionnée après les témoignages */}
      <NewsletterSection />

      {/* Bottom CTA mobile */}
      <a href="#search" className="md:hidden fixed bottom-4 inset-x-4 z-50">
        <Button className="w-full">{t("home.find_provider")}</Button>
      </a>
    </div>
  );
}
