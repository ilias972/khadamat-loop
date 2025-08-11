import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple in-memory cache for catalog endpoint
let catalogCache: { data: any; expires: number } | null = null;

// Utility functions for normalization and scoring
const removeDiacritics = (str: string) =>
  str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
const normalizeFr = (str: string) => removeDiacritics(str).toLowerCase();
const normalizeAr = (str: string) =>
  str
    // Remove Arabic diacritics
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g, '')
    .toLowerCase();

const slugify = (str: string) =>
  normalizeFr(str).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const levenshtein = (a: string, b: string) => {
  const matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
    }
  }
  return matrix[b.length][a.length];
};

export async function getServiceCatalog(req: Request, res: Response, next: NextFunction) {
  try {
    const locale = (req.query.locale as string) === 'ar' ? 'ar' : 'fr';
    if (catalogCache && catalogCache.expires > Date.now()) {
      return res.json({ success: true, data: catalogCache.data });
    }

    const services = await prisma.service.findMany();
    const collator = new Intl.Collator(locale, { sensitivity: 'base' });

    const categoriesMap = new Map<string, any>();
    services.forEach((s) => {
      const catCode = s.category;
      const serviceObj = {
        id: s.id,
        code: s.category,
        slug: slugify(s.name),
        name_fr: s.name,
        name_ar: s.nameAr || s.name,
      };
      if (!categoriesMap.has(catCode)) {
        categoriesMap.set(catCode, {
          code: catCode,
          name_fr: catCode,
          name_ar: catCode,
          services: [],
        });
      }
      categoriesMap.get(catCode).services.push(serviceObj);
    });

    const categories = Array.from(categoriesMap.values());
    categories.forEach((cat) => {
      cat.services.sort((a: any, b: any) =>
        collator.compare(
          locale === 'ar' ? a.name_ar : a.name_fr,
          locale === 'ar' ? b.name_ar : b.name_fr,
        ),
      );
    });
    categories.sort((a: any, b: any) =>
      collator.compare(locale === 'ar' ? a.name_ar : a.name_fr, locale === 'ar' ? b.name_ar : b.name_fr),
    );

    const data = { categories };
    catalogCache = { data, expires: Date.now() + 10 * 60 * 1000 };
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function suggestServices(req: Request, res: Response, next: NextFunction) {
  try {
    const rawQuery = ((req.query.q as string) || '').trim();
    const limit = Math.min(parseInt((req.query.limit as string) || '8', 10), 50);
    const locale = (req.query.locale as string) === 'ar' ? 'ar' : 'fr';
    const normalize = locale === 'ar' ? normalizeAr : normalizeFr;
    const q = normalize(rawQuery);
    if (!q) return res.json({ success: true, data: { suggestions: [] } });

    const services = await prisma.service.findMany();
    const collator = new Intl.Collator(locale, { sensitivity: 'base' });

    const suggestions: any[] = [];
    services.forEach((s) => {
      const name = locale === 'ar' ? s.nameAr || s.name : s.name;
      const normName = normalize(name);
      let score = 0;
      if (normName.startsWith(q)) score = 1;
      else if (normName.split(' ').some((w) => w.startsWith(q))) score = 0.9;
      else if (normName.includes(q)) score = 0.8;
      else if (levenshtein(normName, q) === 1) score = 0.7;
      if (score > 0) {
        suggestions.push({
          id: s.id,
          slug: slugify(s.name),
          name_fr: s.name,
          name_ar: s.nameAr || s.name,
          category_code: s.category,
          _score: score,
        });
      }
    });

    suggestions.sort(
      (a, b) =>
        b._score - a._score ||
        collator.compare(locale === 'ar' ? a.name_ar : a.name_fr, locale === 'ar' ? b.name_ar : b.name_fr),
    );

    const final = suggestions.slice(0, limit).map(({ _score, ...rest }) => rest);
    res.json({ success: true, data: { suggestions: final } });
  } catch (err) {
    next(err);
  }
}

export async function listServices(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 50);
    const skip = (page - 1) * size;
    const q = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { provider: true },
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service.count({ where }),
    ]);

    res.json({ success: true, data: { services, total, page, size } });
  } catch (err) {
    next(err);
  }
}

export async function listPopularServices(_req: Request, res: Response, next: NextFunction) {
  try {
    const services = await prisma.service.findMany({
      where: { isPopular: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.json({ success: true, data: { services } });
  } catch (err) {
    next(err);
  }
}

export async function listServicesByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const cat = req.params.cat;
    const services = await prisma.service.findMany({ where: { category: cat } });
    res.json({ success: true, data: { services } });
  } catch (err) {
    next(err);
  }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) return next({ status: 401, message: 'Unauthorized' });

    const provider = await prisma.provider.findUnique({ where: { userId } });
    if (!provider) return next({ status: 403, message: 'Not a provider' });

    const service = await prisma.service.create({
      data: {
        providerId: provider.id,
        name: req.body.name,
        nameAr: req.body.nameAr,
        description: req.body.description,
        descriptionAr: req.body.descriptionAr,
        category: req.body.category,
        icon: req.body.icon,
        basePrice: req.body.basePrice ?? 0,
        isPopular: req.body.isPopular ?? false,
      },
    });

    res.status(201).json({ success: true, data: { service } });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const service = await prisma.service.findUnique({
      where: { id },
      include: { provider: true },
    });
    if (!service) return next({ status: 404, message: 'Service not found' });

    const userId = parseInt(req.user?.id || '', 10);
    const role = req.user?.role;
    if (service.provider.userId !== userId && role !== 'admin') {
      return next({ status: 403, message: 'Forbidden' });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: req.body.name,
        nameAr: req.body.nameAr,
        description: req.body.description,
        descriptionAr: req.body.descriptionAr,
        category: req.body.category,
        icon: req.body.icon,
        basePrice: req.body.basePrice,
        isPopular: req.body.isPopular,
      },
    });

    res.json({ success: true, data: { service: updated } });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const service = await prisma.service.findUnique({
      where: { id },
      include: { provider: true },
    });
    if (!service) return next({ status: 404, message: 'Service not found' });

    const userId = parseInt(req.user?.id || '', 10);
    const role = req.user?.role;
    if (service.provider.userId !== userId && role !== 'admin') {
      return next({ status: 403, message: 'Forbidden' });
    }

    await prisma.service.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
