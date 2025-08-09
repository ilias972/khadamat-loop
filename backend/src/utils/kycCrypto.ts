import crypto from 'node:crypto';
const PEPPER = process.env.KYC_HASH_PEPPER || '';
const KEY_HEX = process.env.KYC_ENC_KEY_HEX || '';
const KEY = KEY_HEX && /^[0-9a-fA-F]{64}$/.test(KEY_HEX) ? Buffer.from(KEY_HEX, 'hex') : null;

export function hashDocNumber(userId: number, docNumber: string) {
  const salt = crypto.createHash('sha256').update(String(userId)).digest('hex');
  return crypto.createHash('sha256').update(`${PEPPER}:${salt}:${docNumber}`).digest('hex');
}
export const last4 = (s: string) => s.slice(-4);

export function encryptDocNumber(raw: string) {
  if (!KEY) throw new Error('KYC_ENC_KEY_HEX missing/invalid');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const enc = Buffer.concat([cipher.update(raw, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encDoc: enc, encDocTag: tag, encDocNonce: iv };
}
