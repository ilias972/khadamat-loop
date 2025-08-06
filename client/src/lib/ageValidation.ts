/**
 * Utilitaires pour la validation de l'âge
 * Système d'identification avec validation stricte de l'âge minimum de 18 ans
 */

export interface AgeValidationResult {
  isValid: boolean;
  age: number;
  errorMessage?: string;
}

/**
 * Calcule l'âge exact en tenant compte des mois et jours
 * @param birthDate - Date de naissance au format string (YYYY-MM-DD)
 * @returns AgeValidationResult avec l'âge calculé et la validité
 */
export function calculateExactAge(birthDate: string): AgeValidationResult {
  if (!birthDate) {
    return {
      isValid: false,
      age: 0,
      errorMessage: "Date de naissance requise"
    };
  }

  const birth = new Date(birthDate);
  const today = new Date();
  
  // Vérification que la date est valide
  if (isNaN(birth.getTime())) {
    return {
      isValid: false,
      age: 0,
      errorMessage: "Date de naissance invalide"
    };
  }

  // Vérification que la date n'est pas dans le futur
  if (birth > today) {
    return {
      isValid: false,
      age: 0,
      errorMessage: "La date de naissance ne peut pas être dans le futur"
    };
  }

  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Calcul précis de l'âge en tenant compte des mois et jours
  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    actualAge = age - 1;
  }

  return {
    isValid: actualAge >= 18,
    age: actualAge,
    errorMessage: actualAge < 18 ? "Vous devez être majeur (18+ ans) pour utiliser ce service." : undefined
  };
}

/**
 * Valide si l'utilisateur est majeur (18+ ans)
 * @param birthDate - Date de naissance au format string (YYYY-MM-DD)
 * @returns true si l'utilisateur est majeur, false sinon
 */
export function isAdult(birthDate: string): boolean {
  const result = calculateExactAge(birthDate);
  return result.isValid;
}

/**
 * Obtient l'âge exact de l'utilisateur
 * @param birthDate - Date de naissance au format string (YYYY-MM-DD)
 * @returns l'âge exact en années
 */
export function getExactAge(birthDate: string): number {
  const result = calculateExactAge(birthDate);
  return result.age;
}

/**
 * Génère un message d'erreur personnalisé pour la validation de l'âge
 * @param birthDate - Date de naissance au format string (YYYY-MM-DD)
 * @param context - Contexte d'utilisation (inscription, modification, etc.)
 * @returns message d'erreur personnalisé
 */
export function getAgeValidationMessage(birthDate: string, context: 'registration' | 'profile' | 'general' = 'general'): string | null {
  const result = calculateExactAge(birthDate);
  
  if (!result.isValid) {
    switch (context) {
      case 'registration':
        return "Vous devez être majeur (18+ ans) pour créer un compte. Vérifiez votre date de naissance.";
      case 'profile':
        return "Vous devez être majeur (18+ ans) pour utiliser ce service.";
      default:
        return "Vous devez être majeur (18+ ans) pour continuer.";
    }
  }
  
  return null;
}

/**
 * Calcule la date limite pour être majeur (18 ans)
 * @returns Date limite au format string (YYYY-MM-DD)
 */
export function getMinimumBirthDate(): string {
  const today = new Date();
  const minimumDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return minimumDate.toISOString().split('T')[0];
}

/**
 * Formate l'âge pour l'affichage
 * @param age - Âge en années
 * @returns Âge formaté avec unité
 */
export function formatAge(age: number): string {
  return `${age} an${age > 1 ? 's' : ''}`;
}
