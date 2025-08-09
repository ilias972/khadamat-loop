export function isValidDay(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s + 'T00:00:00Z').getTime());
}
export function isFutureOrTodayDay(s: string): boolean {
  const today = new Date();
  const tzToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const d = new Date(s + 'T00:00:00Z');
  return d.getTime() >= tzToday.getTime();
}
