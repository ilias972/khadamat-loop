import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, ArrowRight, Users, TrendingUp, Shield, Crown, Zap, Target, Calendar, MessageSquare, Clock, DollarSign } from "lucide-react";
import { useJoinClubPro } from "@/hooks/useJoinClubPro";
import { useLocation } from "wouter";

export default function ClubPro() {
  const { t } = useLanguage();
  const { handleJoinClubPro, isLoading } = useJoinClubPro();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Shield,
      titleKey: "club_pro.verification.title",
      descKey: "club_pro.verification.desc",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      titleKey: "club_pro.visibility.title",
      descKey: "club_pro.visibility.desc",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Crown,
      titleKey: "club_pro.trust.title",
      descKey: "club_pro.trust.desc",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Zap,
      titleKey: "club_pro.exclusive_access",
      descKey: "club_pro.large_projects",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const benefits = [
    {
      icon: Star,
      titleKey: "club_pro.benefits.badge.title",
      descKey: "club_pro.benefits.badge.desc",
      highlightKey: "club_pro.benefits.badge.highlight"
    },
    {
      icon: Target,
      titleKey: "club_pro.benefits.ranking.title",
      descKey: "club_pro.benefits.ranking.desc",
      highlightKey: "club_pro.benefits.ranking.highlight"
    },
    {
      icon: Users,
      titleKey: "club_pro.benefits.clients.title",
      descKey: "club_pro.benefits.clients.desc",
      highlightKey: "club_pro.benefits.clients.highlight"
    },
    {
      icon: MessageSquare,
      titleKey: "club_pro.benefits.support.title",
      descKey: "club_pro.benefits.support.desc",
      highlightKey: "club_pro.benefits.support.highlight"
    },
    {
      icon: Calendar,
      titleKey: "club_pro.benefits.reservations.title",
      descKey: "club_pro.benefits.reservations.desc",
      highlightKey: "club_pro.benefits.reservations.highlight"
    },
    {
      icon: DollarSign,
      titleKey: "club_pro.benefits.pricing.title",
      descKey: "club_pro.benefits.pricing.desc",
      highlightKey: "club_pro.benefits.pricing.highlight"
    }
  ];

  const stats = [
    { number: "3x", labelKey: "club_pro.stats.more_clients", icon: Users },
    { number: "200%", labelKey: "club_pro.stats.revenue_increase", icon: TrendingUp },
    { number: "<1h", labelKey: "club_pro.stats.priority_support", icon: Clock },
    { number: "95%", labelKey: "club_pro.stats.satisfaction", icon: Star }
  ];

  const testimonials: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 pt-24">
      {/* Hero Section - Modern Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
            <Crown className="w-5 h-5" aria-hidden="true" />
            <span className="font-bold text-lg">{t("nav.club_pro")}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t("club_pro.title")}
          </h1>

          <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed mb-12">
            {t("club_pro.join_elite")}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-orange-100 text-sm mb-12">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              <span>{t("club_pro.verification_24h")}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              <span>{t("club_pro.priority_support")}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
              <span>{t("club_pro.premium_badge")}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
            onClick={handleJoinClubPro}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {t("club.join")}
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{t(stat.labelKey)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("club_pro.why_choose")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("club_pro.join_elite")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(feature.descKey)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("club_pro.benefits_title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("club_pro.benefits_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        {t(benefit.highlightKey)}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">
                      {t(benefit.titleKey)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(benefit.descKey)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - Modern Card */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("club_pro.simple_pricing_title")}
              </h2>
              <p className="text-xl text-black-300">
                {t("club_pro.simple_pricing_desc")}
              </p>
            </div>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
                    <Crown className="w-5 h-5" aria-hidden="true" />
                    <span>{t("nav.club_pro")}</span>
                  </div>
                
                <div className="mb-8">
                    <span className="text-5xl md:text-7xl font-bold text-white">50 DH</span>
                    <span className="text-2xl text-orange-100 ml-3">{t("club_pro.per_month")}</span>
                  </div>

                  <p className="text-orange-100 text-lg mb-8">
                    {t("club_pro.commitment_secure")}
                  </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {benefits.slice(0, 6).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" aria-hidden="true" />
                    <span className="text-white">
                      {t(benefit.titleKey)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button
                className="w-full bg-white text-orange-600 hover:bg-gray-100 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl"
                onClick={handleJoinClubPro}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {t("club.join")}
                    <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </>
                )}
              </Button>
                
                <p className="text-sm text-orange-100 mt-4">
                  {t("club_pro.secure_payment")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section - Enhanced Design */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t("club_pro.testimonials_title")}
                </h2>
                <p className="text-xl text-gray-600">
                  {t("club_pro.testimonials_subtitle")}
                </p>
              </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                        </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">{t(testimonial.roleKey)}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {t(testimonial.highlightKey)}
                        </Badge>
                      </div>

                      <p className="text-gray-700 italic mb-6 leading-relaxed">
                        "{t(testimonial.textKey)}"
                      </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'fill-current' : ''}`} aria-hidden="true" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{testimonial.rating}/5 ({testimonial.reviews} avis)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("club_pro.cta_title")}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-orange-100">
            {t("club_pro.cta_subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
                onClick={handleJoinClubPro}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {t("club.join")}
                    <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
                onClick={() => setLocation("/faq")}
              >
                {t("club_pro.cta_learn_more")}
              </Button>
          </div>
          
          <p className="text-sm text-orange-100 mt-6">
            {t("club_pro.cta_features")}
          </p>
        </div>
      </section>
    </div>
  );
}
