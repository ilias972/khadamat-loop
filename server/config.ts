import { env } from 'process';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export const SEARCH_RADIUS_KM = clamp(parseInt(env.SEARCH_RADIUS_KM || '30', 10), 5, 100);
export type SearchRankingMode = 'popularity_local' | 'text_first';
export const SEARCH_RANKING: SearchRankingMode = env.SEARCH_RANKING === 'text_first' ? 'text_first' : 'popularity_local';
