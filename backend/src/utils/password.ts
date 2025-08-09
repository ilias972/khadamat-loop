// Password hashing utilities with optional bcryptjs support
import crypto from 'node:crypto';

const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 12);

async function tryBcrypt() {
  try {
    return await import('bcryptjs');
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  const bcrypt = await tryBcrypt();
  if (bcrypt) {
    return await bcrypt.hash(plain, ROUNDS);
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100_000;
  const keylen = 64;
  const digest = 'sha256';
  const derived = await new Promise<Buffer>((res, rej) =>
    crypto.pbkdf2(plain, salt, iterations, keylen, digest, (e, d) => (e ? rej(e) : res(d)))
  );
  return `pbkdf2$${iterations}$${salt}$${derived.toString('hex')}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const bcrypt = await tryBcrypt();
  if (bcrypt && !stored.startsWith('pbkdf2$')) {
    return await bcrypt.compare(plain, stored);
  }
  if (!stored.startsWith('pbkdf2$')) return false;
  const [, itStr, salt, hashHex] = stored.split('$');
  const iterations = Number(itStr);
  const keylen = Buffer.from(hashHex, 'hex').length;
  const digest = 'sha256';
  const derived = await new Promise<Buffer>((res, rej) =>
    crypto.pbkdf2(plain, salt, iterations, keylen, digest, (e, d) => (e ? rej(e) : res(d)))
  );
  return crypto.timingSafeEqual(Buffer.from(hashHex, 'hex'), derived);
}
