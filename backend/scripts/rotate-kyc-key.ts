import { PrismaClient } from '@prisma/client';
import { decryptWithKeyId, encryptWithActiveKey, getActiveKeyId } from '../src/config/keyring';
const prisma = new PrismaClient();
(async () => {
  const targetKeyId = getActiveKeyId();
  const items = await prisma.kycVault.findMany();
  for (const v of items) {
    if (!v.keyId || v.keyId === targetKeyId || !v.encDoc || !v.encDocTag || !v.encDocNonce) continue;
    const plain = decryptWithKeyId(v.keyId, v.encDoc, v.encDocTag, v.encDocNonce);
    const { keyId, encDoc, encDocTag, encDocNonce } = encryptWithActiveKey(plain);
    await prisma.kycVault.update({ where: { userId: v.userId }, data: { encDoc, encDocTag, encDocNonce, keyId } });
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
