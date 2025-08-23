import { cacheDelPattern } from '../utils/cache';

export async function invalidateServiceCatalog() {
  await cacheDelPattern('services:catalog:*');
}

export async function invalidateSuggest() {
  await cacheDelPattern('suggest:services:*');
  await cacheDelPattern('suggest:cities:*');
}

export async function invalidateSearchNear() {
  await cacheDelPattern('search:services:*');
}
