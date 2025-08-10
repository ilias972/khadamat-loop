import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import SmartSearch from "@/components/search/SmartSearch";
import FeaturedProvidersCarousel from "@/components/providers/FeaturedProvidersCarousel";
import JoinProviders from "@/components/providers/JoinProviders";
import NewsletterSection from "@/components/ui/NewsletterSection";
import { Button } from "@/components/ui/button";
import { Lightbulb, Search, User, MessageCircle, Star, Wrench, Droplets, Sparkles, Palette, Hammer } from "lucide-react";
import { Link } from "wouter";
import type { Service } from "@shared/schema";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useRef, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const { t, language } = useLanguage();
  const { city: userLocation } = useGeolocation();
  const numberFormatter = new Intl.NumberFormat(language);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [showTop, setShowTop] = useState(false);

  // Fetch popular services
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services/popular"],
  });
  interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    avatar?: string | null;
  }

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews/home"],
  });
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    stepsRef.current.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 pt-32 md:pt-36 pb-12 md:pb-16">
        <div className="absolute inset-0 hidden md:block pattern-bg opacity-100" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-2">
              {t("hero.title")}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {" "}{t("hero.title_highlight")}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
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
      <section className="py-12 bg-white">
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
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {t("services.popular")}
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                {t("services.subtitle")}
              </p>
            </div>
            
            {/* Grid des services populaires */}
            {servicesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 px-2 md:px-0">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rounded-2xl h-32 md:h-40 animate-pulse bg-gray-200/70" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 px-2 md:px-0">
                {[
                  { nameKey: 'services.plumbing', serviceName: 'plomberie', count: 156, popular: true, icon: Droplets },
                  { nameKey: 'services.cleaning', serviceName: 'nettoyage', count: 89, popular: true, icon: Sparkles },
                  { nameKey: 'services.electricity', serviceName: 'electricite', count: 134, popular: false, icon: Lightbulb },
                  { nameKey: 'services.gardening', serviceName: 'jardinage', count: 67, popular: false, icon: Wrench },
                  { nameKey: 'services.painting', serviceName: 'peinture', count: 92, popular: true, icon: Palette },
                  { nameKey: 'services.repair', serviceName: 'reparation', count: 78, popular: false, icon: Hammer },
                ].map((service, index) => {
                  const Icon = service.icon;
                  return (
                  <Link
                    key={index}
                    href={`/prestataires?service=${encodeURIComponent(service.serviceName)}${userLocation ? `&location=${encodeURIComponent(userLocation)}` : ""}`}
                    className="group block cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-xl md:rounded-2xl"
                  >
                    <div className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-6 text-center hover:shadow-xl hover:border-orange-300 transition-[transform,box-shadow,border-color] duration-300 transform hover:-translate-y-1 shadow-md service-card-pulse">

                      <div className="text-2xl md:text-4xl mb-2 md:mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                        <Icon aria-hidden="true" focusable="false" className="w-12 h-12 md:w-16 md:h-16 text-orange-500" />
                      </div>
                      <h3 className="font-semibold md:font-bold text-sm md:text-base text-gray-900 mb-1 md:mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                        {t(service.nameKey)}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">{t("services.providers_count", { count: service.count, formattedCount: numberFormatter.format(service.count) })}</p>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
            
            {/* Bouton voir plus */}
            <div className="text-center mt-12">
              <Link href="/services">
                <Button
                  asChild
                  variant="outline"
                  className="h-11 px-5 rounded-xl border-orange-500 text-orange-500 hover:bg-orange-50"
                >
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
            <div
              ref={el => (stepsRef.current[0] = el)}
              className="text-center opacity-0 translate-y-2 transition-all duration-200 ease-out"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search aria-hidden="true" focusable="false" className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step1")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step1_desc")}
              </p>
            </div>

            <div
              ref={el => (stepsRef.current[1] = el)}
              className="text-center opacity-0 translate-y-2 transition-all duration-200 ease-out"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User aria-hidden="true" focusable="false" className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {t("how_it_works.step2")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("how_it_works.step2_desc")}
              </p>
            </div>

            <div
              ref={el => (stepsRef.current[2] = el)}
              className="text-center opacity-0 translate-y-2 transition-all duration-200 ease-out"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
            {reviewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-10 h-10 rounded-full mr-3" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                  <div className="flex items-center mb-4">
                    {review.avatar ? (
                      <img src={review.avatar} alt="" className="w-10 h-10 rounded-full mr-3" loading="lazy" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                    )}
                    <div className="font-semibold text-gray-900">{review.name}</div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1" aria-label={`${review.rating} / 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          aria-hidden="true"
                          className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed font-medium">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="min-h-[200px] flex flex-col items-center justify-center text-center md:col-span-3">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('reviews.empty.title')}</h3>
                <p className="text-gray-500">{t('reviews.empty.subtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter - Repositionnée après les témoignages */}
      <NewsletterSection />

      {/* Bottom CTA mobile */}
      <a
        href="#search"
        className="md:hidden fixed bottom-4 inset-x-4 z-50"
      >
        <Button className="w-full">
          {language === "ar" ? "البحث عن مقدم خدمة" : "Trouver un prestataire"}
        </Button>
      </a>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-4 right-4 hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-orange-500 text-white transition-opacity ${showTop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label={language === "ar" ? "العودة إلى الأعلى" : "Retour en haut"}
      >
        ↑
      </button>
    </div>
  );
}
