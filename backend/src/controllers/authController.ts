import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../middlewares/auth';
import { decryptWithKeyId } from '../config/keyring';
import { verifyTotp } from '../utils/totp';
import crypto from 'node:crypto';
import { sendEmail } from '../services/email';
import { logAction } from '../middlewares/audit';

type Role = 'CLIENT' | 'PROVIDER' | 'ADMIN';

const prisma = new PrismaClient();
const refreshExpireMs = 7 * 24 * 60 * 60 * 1000;
const secureCookie = process.env.STAGE === 'prod';

function signTokens(userId: number, role: string, mfa?: boolean) {
  const secret = process.env.JWT_SECRET!;
  const jti = crypto.randomUUID();
  const accessToken = jwt.sign(
    { id: userId.toString(), role: role.toLowerCase() as UserRole, mfa },
    secret,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: userId.toString(), role: role.toLowerCase() as UserRole, mfa, jti },
    secret,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken, jti };
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'strict',
    maxAge: refreshExpireMs,
  });
}

function parseRefreshToken(req: Request): string | null {
  const raw = req.headers.cookie || '';
  const found = raw
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith('refreshToken='));
  return found ? decodeURIComponent(found.split('=')[1]) : null;
}

function hashJti(jti: string) {
  return crypto.createHash('sha256').update(jti).digest('hex');
}

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

    const { accessToken, refreshToken, jti } = signTokens(user.id, user.role);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        jtiHash: hashJti(jti),
        expiresAt: new Date(Date.now() + refreshExpireMs),
      },
    });
    setRefreshCookie(res, refreshToken);
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
    const { accessToken, refreshToken, jti } = signTokens(userId, payload.role as string, true);
    await prisma.refreshToken.create({
      data: {
        userId,
        jtiHash: hashJti(jti),
        expiresAt: new Date(Date.now() + refreshExpireMs),
      },
    });
    setRefreshCookie(res, refreshToken);
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

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = parseRefreshToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'Invalid token', timestamp: new Date().toISOString() },
      });
    }
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
        error: { code: 401, message: 'Invalid token', timestamp: new Date().toISOString() },
      });
    }
    const jti = payload?.jti as string | undefined;
    if (!jti) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'Invalid token', timestamp: new Date().toISOString() },
      });
    }
    const record = await prisma.refreshToken.findUnique({ where: { jtiHash: hashJti(jti) } });
    if (!record || record.revokedAt || record.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'Invalid token', timestamp: new Date().toISOString() },
      });
    }
    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user || user.isDisabled) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: 'Invalid token', timestamp: new Date().toISOString() },
      });
    }
    if (!payload.mfa) {
      const mfa = await prisma.mfaSecret.findUnique({ where: { userId: user.id }, select: { enabledAt: true } });
      if (mfa && mfa.enabledAt) {
        return res.status(401).json({
          success: false,
          error: { code: 401, message: 'MFA required', timestamp: new Date().toISOString() },
        });
      }
    }

    await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
    const { accessToken, refreshToken, jti: newJti } = signTokens(user.id, user.role, payload.mfa);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        jtiHash: hashJti(newJti),
        expiresAt: new Date(Date.now() + refreshExpireMs),
      },
    });
    setRefreshCookie(res, refreshToken);
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response) {
  const token = parseRefreshToken(req);
  if (token) {
    try {
      const secret = process.env.JWT_SECRET!;
      const payload: any = jwt.verify(token, secret);
      if (payload?.jti) {
        await prisma.refreshToken.updateMany({
          where: { jtiHash: hashJti(payload.jti), revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    } catch {}
  }
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'strict',
    maxAge: 0,
  });
  res.json({ success: true });
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.user?.id || '', 10);
    const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string };
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }
    const valid = await verifyPassword(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({
        success: false,
        error: { code: 400, message: 'Invalid current password', timestamp: new Date().toISOString() },
      });
    }
    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id }, data: { password: hashed } });
    await prisma.refreshToken.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body as { email: string };
  const generic = { success: true, message: 'If an account exists, an email has been sent.' };
  try {
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    await logAction({ action: 'PASSWORD_RESET_REQUEST', resource: 'user', newValues: { emailHash: hashedEmail }, ip: req.ip, ua: req.headers['user-agent'] });

    const user = await prisma.user.findFirst({ where: { email, isDisabled: false } });
    if (user) {
      const since = new Date(Date.now() - 15 * 60 * 1000);
      const recentCount = await prisma.passwordResetToken.count({ where: { userId: user.id, createdAt: { gte: since } } });
      if (recentCount < 3) {
        const raw = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(raw + (process.env.RESET_TOKEN_PEPPER || '')).digest('hex');
        await prisma.passwordResetToken.create({
          data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
        });
        const link = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/forgot-password?token=${raw}`;
        await sendEmail(user.email, 'Password reset', `Use this link to reset your password: ${link}`);
      }
    }
    res.json(generic);
  } catch (err) {
    next(err);
  }
}

export async function confirmResetPassword(req: Request, res: Response, next: NextFunction) {
  const { token, newPassword } = req.body as { token: string; newPassword: string };
  try {
    const hash = crypto.createHash('sha256').update(token + (process.env.RESET_TOKEN_PEPPER || '')).digest('hex');
    const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hash } });

    if (!record || record.usedAt) {
      await logAction({ action: 'PASSWORD_RESET_FAIL', resource: 'passwordReset', newValues: { reason: 'invalid' }, ip: req.ip, ua: req.headers['user-agent'] });
      return res.status(400).json({
        success: false,
        error: { code: 'TOKEN_INVALID', message: 'Invalid token', timestamp: new Date().toISOString() },
      });
    }

    if (record.expiresAt < new Date()) {
      await logAction({ action: 'PASSWORD_RESET_FAIL', resource: 'passwordReset', resourceId: record.userId, newValues: { reason: 'expired' }, ip: req.ip, ua: req.headers['user-agent'] });
      return res.status(410).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Token expired', timestamp: new Date().toISOString() },
      });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.$transaction([
      prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);

    await logAction({ userId: record.userId, action: 'PASSWORD_RESET_SUCCESS', resource: 'user', resourceId: record.userId, ip: req.ip, ua: req.headers['user-agent'] });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
