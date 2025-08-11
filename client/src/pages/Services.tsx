import { useState, useMemo, useEffect } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ServiceSearchBar from "@/components/search/ServiceSearchBar";
import { useServicesCatalog, CatalogService } from "@/hooks/useServicesCatalog";

export default function Services() {
  const { language, t } = useLanguage();
  const { data, isLoading, error, refetch } = useServicesCatalog();
  const [query, setQuery] = useState("");

  const displayName = (s: CatalogService) =>
    language === "ar" ? s.name_ar : s.name_fr;

  const collator = useMemo(
    () => new Intl.Collator(language, { sensitivity: "base" }),
    [language]
  );

  const services = useMemo(() => {
    if (!data?.categories) return [] as CatalogService[];
    const list: CatalogService[] = [];
    data.categories.forEach((cat) => {
      cat.services?.forEach((s) => list.push(s));
    });
    return list.sort((a, b) => collator.compare(displayName(a), displayName(b)));
  }, [data, collator]);

  useEffect(() => {
    if (!isLoading && data && data.categories.length === 0 && process.env.NODE_ENV !== "production") {
      console.warn("Services catalog empty");
    }
  }, [isLoading, data]);

  const normalize = (str: string) => {
    let s = str.toLowerCase();
    if (language === "ar") s = s.replace(/[\u064B-\u065F]/g, "");
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const distance = (a: string, b: string) => {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  };

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return services;
    return services
      .map((s) => {
        const name = normalize(displayName(s));
        let score = Infinity;
        if (name.startsWith(q)) score = 0;
        else if (name.split(/\s+/).some((w) => w.startsWith(q))) score = 1;
        else if (name.includes(q)) score = 2;
        else if (distance(name, q) <= 1) score = 3;
        return { s, score };
      })
      .filter((x) => x.score !== Infinity)
      .sort(
        (a, b) => a.score - b.score || collator.compare(displayName(a.s), displayName(b.s))
      )
      .map((x) => x.s);
  }, [services, query, collator]);

  const handleServiceClick = (s: CatalogService) => {
    window.location.href = `/prestataires?service=${s.slug}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center space-y-4">
          <p>{t("common.error")}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            {t("common.retry")}
          </button>
        </div>
      );
    }
    if (!data || data.categories.length === 0) {
      return <div className="text-center py-10">{t("services.empty")}</div>;
    }
    if (filtered.length === 0) {
      return (
        <div className="text-center py-10" role="status" aria-live="polite">
          {t("filters.noResults")}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((s) => (
          <ServiceCard
            key={s.id}
            service={{
              id: s.id,
              name: s.name_fr,
              nameAr: s.name_ar,
              description: "",
              descriptionAr: "",
              category: s.code,
              icon: "",
              isPopular: false,
            }}
            onClick={() => handleServiceClick(s)}
            highlight={query}
          />
        ))}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-20">
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <ServiceSearchBar onQueryChange={setQuery} />
            {renderContent()}
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}

