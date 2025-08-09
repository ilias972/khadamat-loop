import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../middlewares/auth';

type Role = 'CLIENT' | 'PROVIDER' | 'ADMIN';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, role } = req.body as {
      email: string;
      password: string;
      role?: Role;
    };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return next({ status: 400, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: role ?? 'CLIENT',
        isVerified: true,
      },
      select: { id: true, email: true, role: true },
    });

    res.status(201).json({
      success: true,
      data: { user: newUser },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next({ status: 401, message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return next({ status: 401, message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next({ status: 500, message: 'JWT secret not configured' });
    }

    const accessToken = jwt.sign(
      { id: user.id.toString(), role: user.role.toLowerCase() as UserRole },
      secret,
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.user?.id || '', 10);
    if (!id) {
      return next({ status: 401, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
