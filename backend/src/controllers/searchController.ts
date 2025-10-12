import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { providerSearchDurationMs } from '../metrics';
import { env } from '../config/env';
import { cacheGet, cacheSet } from '../utils/cache';
import { normalizeText } from '../lib/normalize';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const searchSchema = z
  .object({
    service: z.string(),
    city: z.string().optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radiusKm: z.coerce.number().min(5).max(100).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .refine((d) => d.city || (d.lat !== undefined && d.lng !== undefined), {
    message: 'city or lat/lng required',
  });

export async function searchServices(req: Request, res: Response, next: NextFunction) {
  try {
    const params = searchSchema.parse(req.query);
    const radiusKm = params.radiusKm ?? env.searchRadiusKm;
    let centerLat: number;
    let centerLng: number;

    if (params.city) {
      const city = await prisma.city.findUnique({ where: { slug: params.city } });
      if (!city) {
        return res.status(404).json({
          success: false,
          error: { code: 'CITY_NOT_FOUND', message: 'City not found', timestamp: new Date().toISOString() },
        });
      }
      centerLat = city.lat;
      centerLng = city.lng;
    } else {
      centerLat = params.lat!;
      centerLng = params.lng!;
    }

    let serviceId: number | undefined = undefined;
    if (/^\d+$/.test(params.service)) {
      serviceId = parseInt(params.service, 10);
    } else {
      const svc = await prisma.serviceCatalog.findUnique({ where: { slug: params.service } });
      serviceId = svc?.id;
    }
    if (!serviceId) {
      return res.json({ success: true, data: { items: [], page: params.page, total: 0 } });
    }

    const cacheKey = `search:services:${serviceId}|${centerLat.toFixed(3)}|${centerLng.toFixed(3)}|${radiusKm}|${params.page}|${params.limit}|${env.searchRanking}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));

    let timerEnd: any;
    if (providerSearchDurationMs) {
      timerEnd = providerSearchDurationMs.startTimer();
    }
    const candidates = await prisma.provider.findMany({
      where: {
        lat: { not: null, gte: centerLat - latDelta, lte: centerLat + latDelta },
        lng: { not: null, gte: centerLng - lngDelta, lte: centerLng + lngDelta },
        services: { some: { serviceId } },
        user: { isDisabled: false },
      },
    });
    timerEnd?.();

    const items = candidates
      .map((p) => ({
        id: p.id,
        userId: p.userId,
        displayName: p.displayName,
        ratingAvg: (p as any).ratingAvg ?? 0,
        ratingCount: (p as any).ratingCount ?? 0,
        distanceKm: haversine(centerLat, centerLng, p.lat!, p.lng!),
        popularity: (p as any).ratingCount ?? 0,
      }))
      .filter((p) => p.distanceKm <= radiusKm);

    items.sort((a, b) => {
      const pop = b.popularity - a.popularity;
      if (pop !== 0) return pop;
      return a.distanceKm - b.distanceKm;
    });

    const start = (params.page - 1) * params.limit;
    const paged = items.slice(start, start + params.limit);
    const result = { success: true, data: { items: paged, page: params.page, total: items.length } };
    await cacheSet(cacheKey, JSON.stringify(result), env.cacheTtlSearch);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

const suggestSchema = z.object({ q: z.string().min(1).max(50), limit: z.coerce.number().min(1).max(20).default(8) });

export async function suggestCities(req: Request, res: Response, next: NextFunction) {
  try {
    const params = suggestSchema.parse(req.query);
    const normQ = normalizeText(params.q);
    const cacheKey = `suggest:cities:${normQ}|${params.limit}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const cities = await prisma.city.findMany({ select: { id: true, slug: true, name: true, lat: true, lng: true } });
    const items = cities
      .map((c) => {
        const nameNorm = normalizeText(c.name);
        let score = 3;
        if (nameNorm.startsWith(normQ)) score = 0;
        else if (nameNorm.includes(' ' + normQ)) score = 1;
        else if (nameNorm.includes(normQ)) score = 2;
        return { c, score };
      })
      .filter((m) => m.score < 3)
      .sort((a, b) => a.score - b.score)
      .slice(0, params.limit)
      .map((m) => ({
        id: m.c.id,
        slug: m.c.slug,
        name_fr: m.c.name,
        name_ar: m.c.name,
        lat: m.c.lat,
        lng: m.c.lng,
      }));

    const result = { success: true, data: { items } };
    await cacheSet(cacheKey, JSON.stringify(result), env.cacheTtlSuggest);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
