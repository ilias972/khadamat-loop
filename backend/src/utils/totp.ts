import crypto from 'node:crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateSecret(length = 20): string {
  const buffer = crypto.randomBytes(length);
  return base32Encode(buffer);
}

export function base32Encode(buffer: Buffer): string {
  let bits = '';
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, '0');
  }
  let output = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    if (chunk.length < 5) {
      output += BASE32_ALPHABET[parseInt(chunk.padEnd(5, '0'), 2)];
    } else {
      output += BASE32_ALPHABET[parseInt(chunk, 2)];
    }
  }
  return output;
}

export function base32Decode(str: string): Buffer {
  let bits = '';
  for (const char of str.replace(/=+$/,'')) {
    const val = BASE32_ALPHABET.indexOf(char.toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function generateTotp(secret: string, step = 30, time = Date.now()): string {
  const key = base32Decode(secret);
  const counter = Math.floor(time / (step * 1000));
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(0, 0);
  buffer.writeUInt32BE(counter, 4);
  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return code.toString().padStart(6, '0');
}

export function verifyTotp(token: string, secret: string, step = 30, window = 1): boolean {
  const time = Date.now();
  for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
    const code = generateTotp(secret, step, time + errorWindow * step * 1000);
    if (code === token) return true;
  }
  return false;
}

export function otpauthURL(userEmail: string, secret: string, issuer = 'Khadamat'): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}

