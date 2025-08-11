import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

export interface CatalogService {
  id: number;
  code: string;
  slug: string;
  name_fr: string;
  name_ar: string;
}

export interface CatalogCategory {
  code: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  services: CatalogService[];
}

interface CatalogResponse {
  categories: CatalogCategory[];
}

export function useServicesCatalog() {
  const { language } = useLanguage();
  return useQuery<CatalogResponse>({
    queryKey: ["/api/services/catalog", language],
    queryFn: async () => {
      const res = await fetch(`/api/services/catalog?locale=${language}`);
      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error("Invalid catalog data");
      }
      return json.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
