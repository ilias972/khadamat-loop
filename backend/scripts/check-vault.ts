import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async ()=>{
  const userId = Number(process.argv[2]);
  if (!userId) throw new Error('Usage: ts-node scripts/check-vault.ts <userId>');
  const v = await prisma.kycVault.findUnique({ where:{ userId }});
  console.log({ userId, hasCipher: !!(v?.encDoc && v.encDocTag && v.encDocNonce), keyId: v?.keyId, updatedAt: v?.updatedAt });
  process.exit(0);
})().catch(e=>{ console.error(e); process.exit(1); });
