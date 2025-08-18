import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function listProviders(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 50);
    const skip = (page - 1) * size;
    const q = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const orderBy = (req.query.sort as string) === 'rating'
      ? { rating: 'desc' as const }
      : { createdAt: 'desc' as const };

    const where: any = {};
    if (q) {
      where.OR = [
        { bio: { contains: q, mode: 'insensitive' } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
      ];
    }
    if (category) {
      where.services = { some: { category } };
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        include: { services: true, user: { select: { id: true, email: true } } },
        skip,
        take: size,
        orderBy,
      }),
      prisma.provider.count({ where }),
    ]);

    res.json({ success: true, data: { providers, total, page, size } });
  } catch (err) {
    next(err);
  }
}

export async function getProvider(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: { services: true, user: { select: { id: true, email: true } } },
    });
    if (!provider) return next({ status: 404, message: 'Provider not found' });
    res.json({ success: true, data: { provider } });
  } catch (err) {
    next(err);
  }
}

export async function createProvider(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) return next({ status: 401, message: 'Unauthorized' });

    const existing = await prisma.provider.findUnique({ where: { userId } });
    if (existing) return next({ status: 409, message: 'Provider already exists' });

    const provider = await prisma.provider.create({
      data: {
        userId,
        bio: req.body.bio,
        specialties: req.body.specialties,
        experience: req.body.experience,
        hourlyRate: req.body.hourlyRate,
        isOnline: req.body.isOnline,
      },
    });

    res.status(201).json({ success: true, data: { provider } });
  } catch (err) {
    next(err);
  }
}

export async function updateProvider(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) return next({ status: 404, message: 'Provider not found' });

    const userId = parseInt(req.user?.id || '', 10);
    const role = req.user?.role;
    if (provider.userId !== userId && role !== 'admin') {
      return next({ status: 403, message: 'Forbidden' });
    }

    const updated = await prisma.provider.update({
      where: { id },
      data: {
        bio: req.body.bio,
        specialties: req.body.specialties,
        experience: req.body.experience,
        hourlyRate: req.body.hourlyRate,
        isOnline: req.body.isOnline,
      },
    });

    res.json({ success: true, data: { provider: updated } });
  } catch (err) {
    next(err);
  }
}

export async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.service.findMany({
      distinct: ['category'],
      select: { category: true },
    });
    res.json({ success: true, data: { categories: categories.map((c) => c.category) } });
  } catch (err) {
    next(err);
  }
}
