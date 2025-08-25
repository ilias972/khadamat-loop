export function stripDiacritics(input: string): string {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeArabic(input: string): string {
  return input
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export function normalizeText(input: string): string {
  return normalizeArabic(stripDiacritics(input.toLowerCase().trim()));
}
