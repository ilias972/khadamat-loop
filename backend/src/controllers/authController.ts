import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../middlewares/auth';
import { decryptWithKeyId } from '../config/keyring';
import { verifyTotp } from '../utils/totp';
import crypto from 'node:crypto';

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

    const hashed = await hashPassword(password);
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

    if (user.isDisabled) {
      return next({ status: 403, message: 'Account disabled' });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return next({ status: 401, message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next({ status: 500, message: 'JWT secret not configured' });
    }

    const enforce = process.env.STAGE === 'prod' || process.env.MFA_ENFORCE === 'true';
    const roles = (process.env.MFA_ENFORCE_ROLES || 'ADMIN').split(',').map((r) => r.trim().toUpperCase());
    let requireMfa = false;
    if (enforce && roles.includes(user.role.toUpperCase())) {
      const mfa = await prisma.mfaSecret.findUnique({ where: { userId: user.id }, select: { enabledAt: true } });
      if (mfa && mfa.enabledAt) requireMfa = true;
    }

    if (requireMfa) {
      const pendingToken = jwt.sign(
        { id: user.id.toString(), role: user.role.toLowerCase() as UserRole, mfaPending: true },
        secret,
        { expiresIn: '5m' }
      );
      return res.json({ success: true, data: { mfaRequired: true, pendingToken } });
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

export async function verifyMfa(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'Authorization header missing or malformed', timestamp: new Date().toISOString() },
      });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next({ status: 500, message: 'JWT secret not configured' });
    }
    let payload: any;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'Invalid or expired token', timestamp: new Date().toISOString() },
      });
    }
    if (!payload?.mfaPending) {
      return res.status(400).json({
        success: false,
        error: { code: 400, message: 'Invalid pending token', timestamp: new Date().toISOString() },
      });
    }
    const userId = parseInt(payload.id, 10);
    const { code, recoveryCode } = req.body as { code?: string; recoveryCode?: string };
    const record = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!record || !record.enabledAt) {
      return res.status(400).json({
        success: false,
        error: { code: 400, message: 'MFA not enabled', timestamp: new Date().toISOString() },
      });
    }
    const plain = decryptWithKeyId(record.keyId, record.encSecret, record.encTag, record.encNonce);
    const step = parseInt(process.env.MFA_WINDOW_SECONDS || '30', 10);
    const drift = parseInt(process.env.MFA_DRIFT_STEPS || '1', 10);
    let ok = false;
    if (code && verifyTotp(code, plain, step, drift)) ok = true;
    if (!ok && recoveryCode) {
      const arr = record.recoveryCodes ? (JSON.parse(record.recoveryCodes) as string[]) : [];
      const hash = crypto.createHash('sha256').update(recoveryCode + (process.env.KYC_HASH_PEPPER || '')).digest('hex');
      const idx = arr.indexOf(hash);
      if (idx >= 0) {
        ok = true;
        arr.splice(idx, 1);
        await prisma.mfaSecret.update({ where: { userId }, data: { recoveryCodes: JSON.stringify(arr) } });
      }
    }
    if (!ok) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'Invalid MFA code', timestamp: new Date().toISOString() },
      });
    }
    const accessToken = jwt.sign({ id: userId.toString(), role: payload.role as UserRole, mfa: true }, secret, { expiresIn: '15m' });
    res.json({ success: true, data: { accessToken } });
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
