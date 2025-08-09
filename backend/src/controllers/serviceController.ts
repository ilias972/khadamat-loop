import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
