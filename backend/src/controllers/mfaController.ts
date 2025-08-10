import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSecret, otpauthURL, verifyTotp } from '../utils/totp';
import { encryptWithActiveKey, decryptWithKeyId } from '../config/keyring';
import { verifyPassword } from '../utils/password';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

function hashRecovery(code: string) {
  const pepper = process.env.KYC_HASH_PEPPER || '';
  return crypto.createHash('sha256').update(code + pepper).digest('hex');
}

export async function startSetup(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) return next({ status: 401, message: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next({ status: 404, message: 'User not found' });
    const secret = generateSecret();
    const uri = otpauthURL(user.email, secret);
    const enc = encryptWithActiveKey(secret);
    await prisma.mfaSecret.upsert({
      where: { userId },
      update: { encSecret: enc.encDoc, encTag: enc.encDocTag, encNonce: enc.encDocNonce, keyId: enc.keyId, enabledAt: null, recoveryCodes: null },
      create: { userId, encSecret: enc.encDoc, encTag: enc.encDocTag, encNonce: enc.encDocNonce, keyId: enc.keyId },
    });
    res.json({ success: true, data: { secret, otpauthUrl: uri, qr: null } });
  } catch (err) {
    next(err);
  }
}

export async function verifySetup(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const { code } = req.body as { code: string };
    const record = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!record) return next({ status: 400, message: 'No setup in progress' });
    const secret = decryptWithKeyId(record.keyId, record.encSecret, record.encTag, record.encNonce);
    const step = parseInt(process.env.MFA_WINDOW_SECONDS || '30', 10);
    const drift = parseInt(process.env.MFA_DRIFT_STEPS || '1', 10);
    if (!verifyTotp(code, secret, step, drift)) {
      return next({ status: 400, message: 'Invalid code' });
    }
    const codes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString('hex'));
    const hashed = codes.map(hashRecovery);
    await prisma.mfaSecret.update({ where: { userId }, data: { enabledAt: new Date(), recoveryCodes: JSON.stringify(hashed) } });
    res.json({ success: true, data: { recoveryCodes: codes } });
  } catch (err) {
    next(err);
  }
}

export async function disableMfa(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const { password, code, recoveryCode } = req.body as { password: string; code?: string; recoveryCode?: string };
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next({ status: 404, message: 'User not found' });
    const validPwd = await verifyPassword(password, user.password);
    if (!validPwd) return next({ status: 401, message: 'Invalid password' });
    const record = await prisma.mfaSecret.findUnique({ where: { userId } });
    if (!record) return next({ status: 400, message: 'MFA not enabled' });
    const secret = decryptWithKeyId(record.keyId, record.encSecret, record.encTag, record.encNonce);
    const step = parseInt(process.env.MFA_WINDOW_SECONDS || '30', 10);
    const drift = parseInt(process.env.MFA_DRIFT_STEPS || '1', 10);
    let ok = false;
    if (code && verifyTotp(code, secret, step, drift)) ok = true;
    if (!ok && recoveryCode) {
      const arr = record.recoveryCodes ? (JSON.parse(record.recoveryCodes) as string[]) : [];
      const hash = hashRecovery(recoveryCode);
      if (arr.includes(hash)) ok = true;
    }
    if (!ok) return next({ status: 401, message: 'Invalid code' });
    await prisma.mfaSecret.delete({ where: { userId } });
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
}
