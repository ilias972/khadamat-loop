import { useLanguage } from "@/contexts/LanguageContext";

export default function ClubProTerms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t("legal.clubpro.title")}</h1>
          <div className="space-y-4 text-gray-600 text-sm">
            <p>{t("clubpro.price")}</p>
            <p>{t("clubpro.payment")}</p>
            <p>{t("clubpro.termination")}</p>
            <p>{t("clubpro.withdrawal")}</p>
            <p>{t("clubpro.consumer")}</p>
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

