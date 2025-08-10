import crypto from 'node:crypto';

type Keyring = Record<string, Buffer>;
let cache: { activeId: string; keys: Keyring } | null = null;

function parseKeyring(): { activeId: string; keys: Keyring } {
  if (cache) return cache;
  const raw = process.env.KYC_ENC_KEYRING_JSON || '{}';
  const json = JSON.parse(raw) as Record<string, string>;
  const keys: Keyring = {};
  for (const [id, hex] of Object.entries(json)) {
    if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error(`Invalid key hex for ${id}`);
    keys[id] = Buffer.from(hex, 'hex');
  }
  const activeId = process.env.KYC_ENC_ACTIVE_KEY_ID || '';
  if (!activeId || !keys[activeId]) throw new Error('Active key id missing or not in keyring');
  cache = { activeId, keys };
  return cache;
}

export function getActiveKeyId() { return parseKeyring().activeId; }
export function getKey(id: string) {
  const key = parseKeyring().keys[id];
  if (!key) throw new Error(`Key not found: ${id}`);
  return key;
}
export function encryptWithActiveKey(plain: string) {
  const keyId = getActiveKeyId();
  const key = getKey(keyId);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { keyId, encDoc: enc, encDocTag: tag, encDocNonce: iv };
}
export function decryptWithKeyId(keyId: string, encDoc: Buffer, tag: Buffer, iv: Buffer) {
  const key = getKey(keyId);
  const d = crypto.createDecipheriv('aes-256-gcm', key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(encDoc), d.final()]).toString('utf8');
}
