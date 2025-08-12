import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { queryClient } from "@/lib/queryClient";

export interface ServiceCatalogItem {
  id: number;
  code: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  category_code: string;
}

async function fetchCatalog(lang: string) {
  const res = await fetch(`/api/services/catalog?groupBy=category&locale=${lang}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.items || [];
}

export function useServicesCatalog() {
  const { language } = useLanguage();
  return useQuery<ServiceCatalogItem[]>({
    queryKey: ["servicesCatalog", language],
    queryFn: () => fetchCatalog(language),
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export async function ensureCatalogPrefetched(lang: string) {
  await queryClient.ensureQueryData({
    queryKey: ["servicesCatalog", lang],
    queryFn: () => fetchCatalog(lang),
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function getBySlug(
  items: ServiceCatalogItem[] | undefined,
  slug: string,
) {
  return items?.find((s) => s.slug === slug);
}

export function getById(
  items: ServiceCatalogItem[] | undefined,
  id: number,
) {
  return items?.find((s) => s.id === id);
}

export function listByCategory(
  items: ServiceCatalogItem[] | undefined,
  category: string,
) {
  return items?.filter((s) => s.category_code === category) || [];
}

export function resolveServiceName(item: ServiceCatalogItem, lang: string) {
  return lang === "ar" ? item.name_ar || item.name_fr : item.name_fr;
}

export function prettifySlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getNameBySlug(slug: string, lang: string) {
  const items = queryClient.getQueryData<ServiceCatalogItem[]>([
    "servicesCatalog",
    lang,
  ]);
  const s = items?.find((item) => item.slug === slug);
  return s ? resolveServiceName(s, lang) : prettifySlug(slug);
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function fuzzy(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function searchLocal(
  items: ServiceCatalogItem[] | undefined,
  query: string,
  lang: string,
) {
  if (!items) return [] as ServiceCatalogItem[];
  const q = normalize(query);
  return items
    .map((item) => {
      const name = normalize(lang === "ar" ? item.name_ar : item.name_fr);
      if (name.startsWith(q)) return { item, score: 0 };
      if (name.includes(" " + q)) return { item, score: 1 };
      if (name.includes(q)) return { item, score: 2 };
      if (fuzzy(name, q) <= 1) return { item, score: 3 };
      return null;
    })
    .filter((x): x is { item: ServiceCatalogItem; score: number } => x !== null)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.item);
}

