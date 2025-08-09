import { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 50);
    const skip = (page - 1) * size;

    const where = { userId };

    const [items, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        include: {
          provider: {
            include: {
              user: { select: { id: true, email: true } },
            },
          },
        },
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.favorite.count({ where }),
    ]);

    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function addFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const { providerId } = req.body as { providerId: number };

    try {
      const favorite = await prisma.favorite.create({
        data: { userId, providerId },
      });
      res.status(201).json({ success: true, data: { favorite } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return res.json({ success: true });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const providerId = parseInt(req.params.providerId, 10);

    try {
      await prisma.favorite.delete({
        where: { uniq_user_provider_fav: { userId, providerId } },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return res.json({ success: true });
      }
      throw err;
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function checkFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const providerId = parseInt(req.params.providerId, 10);

    const favorite = await prisma.favorite.findUnique({
      where: { uniq_user_provider_fav: { userId, providerId } },
      select: { id: true },
    });

    res.json({ success: true, data: { isFavorite: !!favorite } });
  } catch (err) {
    next(err);
  }
}
