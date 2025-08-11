import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageCircle,
  CheckCircle,
  Shield,
  Heart,
  Award,
  Handshake,
} from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const howItWorks = [
    {
      icon: Search,
      title: t("about.how.step1.title"),
      description: t("about.how.step1.desc"),
    },
    {
      icon: MessageCircle,
      title: t("about.how.step2.title"),
      description: t("about.how.step2.desc"),
    },
    {
      icon: CheckCircle,
      title: t("about.how.step3.title"),
      description: t("about.how.step3.desc"),
    },
  ];

  const values = [
    {
      icon: Shield,
      title: t("about.values.trust.title"),
      description: t("about.values.trust.desc"),
    },
    {
      icon: Heart,
      title: t("about.values.proximity.title"),
      description: t("about.values.proximity.desc"),
    },
    {
      icon: Award,
      title: t("about.values.excellence.title"),
      description: t("about.values.excellence.desc"),
    },
    {
      icon: Handshake,
      title: t("about.values.commitment.title"),
      description: t("about.values.commitment.desc"),
    },
  ];

  const trustPoints = [
    t("about.trust.b1"),
    t("about.trust.b2"),
    t("about.trust.b3"),
    t("about.trust.b4"),
    t("about.trust.b5"),
  ];

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
  ];

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6"
          >
            {t("about.badge")}
          </Badge>
          <h1
            className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("about.title")}
          </h1>
          <p
            className={`text-xl text-gray-600 max-w-3xl mx-auto mb-8 ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("about.subtitle")}
          </p>
          <div
            className={`flex justify-center space-x-4 ${
              language === "ar" ? "space-x-reverse" : ""
            }`}
          >
            <Button
              className="gradient-orange text-white px-8 py-3 rounded-xl font-semibold border-0"
              onClick={() => setLocation("/register")}
            >
              {t("about.cta.join")}
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl font-semibold"
              onClick={() => setLocation("/services")}
            >
              {t("about.cta.explore")}
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className={`text-4xl font-bold text-gray-900 mb-12 text-center ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("about.how.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className={`text-4xl font-bold text-gray-900 mb-12 text-center ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("about.values.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon
                      className="w-8 h-8 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className={`text-4xl font-bold text-gray-900 mb-6 text-center ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("about.trust.title")}
          </h2>
          <ul
            className={`space-y-3 list-disc ${
              language === "ar" ? "pr-6 text-right" : "pl-6"
            }`}
          >
            {trustPoints.map((point, i) => (
              <li key={i} className="text-gray-700">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reviews placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("about.reviews.title")}
          </h2>
          <p className="text-gray-600">{t("about.reviews.empty")}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className={`text-4xl font-bold text-gray-900 mb-8 text-center ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {t("faq.title")}
          </h2>
          <Accordion type="single" collapsible>
            {faqs.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className={language === "ar" ? "text-right" : ""}>
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className={language === "ar" ? "text-right" : ""}>
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {t("cta.join.title")}
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            {t("cta.join.desc")}
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${
              language === "ar" ? "sm:flex-row-reverse" : ""
            }`}
          >
            <Button
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50"
              onClick={() => setLocation("/register")}
            >
              {t("cta.join.register")}
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-xl font-semibold"
              onClick={() => setLocation("/contact")}
            >
              {t("cta.join.contact")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

