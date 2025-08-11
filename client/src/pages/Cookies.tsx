import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export default function Cookies() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t("legal.cookies.title")}</h1>
          <div className="space-y-4 text-gray-600 text-sm">
            <p>{t("cookies.onlyNecessary")}</p>
            <p>{t("cookies.consent")}</p>
            <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">{t("cookies.managePreferences")}</Link>
            <p>{t("legal.applyLaw.ma")}</p>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-gray-500 text-sm space-y-1">
            <p>{t("legal.contact")}</p>
            <p>{t("legal.lastUpdated")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

