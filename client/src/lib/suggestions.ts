export interface Suggestion {
  service: string;
  city: string;
  displayText: string;
}

export const suggestions: Suggestion[] = [
  { service: 'Plomberie', city: 'Casablanca', displayText: 'Plomberie Casablanca' },
  { service: 'Ménage', city: 'Rabat', displayText: 'Ménage Rabat' },
  { service: 'Électricité', city: 'Marrakech', displayText: 'Électricité Marrakech' },
  { service: 'Jardinage', city: 'Fès', displayText: 'Jardinage Fès' },
  { service: 'Peinture', city: 'Tanger', displayText: 'Peinture Tanger' },
  { service: 'Menuiserie', city: 'Agadir', displayText: 'Menuiserie Agadir' },
  { service: 'Plomberie', city: 'Rabat', displayText: 'Plomberie Rabat' },
  { service: 'Ménage', city: 'Casablanca', displayText: 'Ménage Casablanca' },
  { service: 'Électricité', city: 'Fès', displayText: 'Électricité Fès' },
  { service: 'Jardinage', city: 'Marrakech', displayText: 'Jardinage Marrakech' }
];

// Fonction pour extraire le service et la ville d'un texte
export function parseSuggestionText(text: string): { service: string; city: string } | null {
  const suggestion = suggestions.find(s => 
    s.displayText.toLowerCase() === text.toLowerCase().trim()
  );
  
  if (suggestion) {
    return { service: suggestion.service, city: suggestion.city };
  }
  
  // Fallback: essayer de parser le texte manuellement
  const parts = text.trim().split(' ');
  if (parts.length >= 2) {
    const city = parts[parts.length - 1];
    const service = parts.slice(0, -1).join(' ');
    return { service, city };
  }
  
  return null;
}

// Fonction pour obtenir les suggestions par langue
export function getSuggestionsByLanguage(language: string): Suggestion[] {
  // Pour l'instant, on utilise les mêmes suggestions
  // Plus tard, on pourra ajouter des traductions
  return suggestions;
} 