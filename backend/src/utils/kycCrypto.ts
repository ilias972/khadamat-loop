import crypto from 'node:crypto';
const PEPPER = process.env.KYC_HASH_PEPPER || '';

export function hashDocNumber(userId: number, docNumber: string) {
  const salt = crypto.createHash('sha256').update(String(userId)).digest('hex');
  return crypto.createHash('sha256').update(`${PEPPER}:${salt}:${docNumber}`).digest('hex');
}
export const last4 = (s: string) => s.slice(-4);
