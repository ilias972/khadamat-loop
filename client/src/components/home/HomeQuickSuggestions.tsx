import { useLanguage } from "@/contexts/LanguageContext";
import { useServicesCatalog } from "@/lib/servicesCatalog";
import { getServiceIcon } from "@/lib/serviceIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface Props {
  city?: string;
  query?: string;
}

export default function HomeQuickSuggestions({ city = "", query = "" }: Props) {
  const { t, language } = useLanguage();
  const { data: catalog, isLoading } = useServicesCatalog();

  if (query.length >= 1) return null;

  const collator = new Intl.Collator(language, { sensitivity: "base" });
  const sorted = [...(catalog || [])].sort((a, b) =>
    collator.compare(
      language === "fr" ? a.name_fr : a.name_ar,
      language === "fr" ? b.name_fr : b.name_ar
    )
  );
  const items = sorted.slice(0, 4);

  const cityLabel = city || t("home.quick.nearMe");

  return (
    <div className="mt-4 max-w-7xl mx-auto px-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {t("home.quick.title")}
      </h3>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {items.map((item) => {
            const Icon = getServiceIcon(item.slug);
            const serviceName = language === "ar" ? item.name_ar : item.name_fr;
            const text = t(
              "home.quick.item",
              { service: serviceName, city: cityLabel } as any
            );
            const href = `/providers?services=${item.slug}${city ? `&city=${encodeURIComponent(city)}` : ""}`;
            return (
              <Link
                key={item.id}
                href={href}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-sm hover:border-orange-300 hover:text-orange-600 transition-colors"
                aria-label={text}
              >
                <Icon className="w-4 h-4" />
                <span className="line-clamp-1">{text}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

