import { useLanguage } from "@/contexts/LanguageContext";

export default function PostService() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t("mobile.post")}
        </h1>
        <p className="text-gray-600">Page publication de service en cours de développement...</p>
      </div>
    </div>
  );
}