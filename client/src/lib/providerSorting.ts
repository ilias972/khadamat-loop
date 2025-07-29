import type { ProviderWithUser } from "@shared/schema";

export interface SortableProvider extends ProviderWithUser {
  isClubPro: boolean;
  missions: number;
  city: string;
}

/**
 * Trie les prestataires selon la logique prioritaire :
 * 1. Les prestataires Club Pro en premier
 * 2. Parmi les Club Pro, tri par ratio (note moyenne / nombre de missions) croissant
 * 3. Ensuite les autres prestataires par note décroissante
 */
export function getSortedProviders(providers: SortableProvider[]): SortableProvider[] {
  return providers.sort((a, b) => {
    // 1. Priorité aux prestataires Club Pro
    if (a.isClubPro && !b.isClubPro) return -1;
    if (!a.isClubPro && b.isClubPro) return 1;
    
    // 2. Si les deux sont Club Pro, tri par ratio (note/missions) croissant
    if (a.isClubPro && b.isClubPro) {
      const ratingA = parseFloat(a.rating || "0");
      const ratingB = parseFloat(b.rating || "0");
      const ratioA = a.missions > 0 ? ratingA / a.missions : ratingA;
      const ratioB = b.missions > 0 ? ratingB / b.missions : ratingB;
      return ratioA - ratioB; // Croissant : plus le ratio est bas, plus prioritaire
    }
    
    // 3. Pour les non-Club Pro, tri par note décroissante
    const ratingA = parseFloat(a.rating || "0");
    const ratingB = parseFloat(b.rating || "0");
    return ratingB - ratingA;
  });
}

/**
 * Filtre les prestataires par ville et applique le tri
 */
export function getFilteredAndSortedProviders(
  providers: SortableProvider[], 
  city?: string
): SortableProvider[] {
  let filteredProviders = providers;
  
  // Filtrer par ville si spécifiée
  if (city) {
    filteredProviders = providers.filter(provider => 
      provider.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  return getSortedProviders(filteredProviders);
}

/**
 * Récupère le prestataire le plus prioritaire (premier après tri)
 */
export function getTopPriorityProvider(providers: SortableProvider[]): SortableProvider | null {
  const sortedProviders = getSortedProviders(providers);
  return sortedProviders.length > 0 ? sortedProviders[0] : null;
} 