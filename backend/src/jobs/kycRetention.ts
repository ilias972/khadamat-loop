import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function runKycRetentionJob() {
  const days = Number(process.env.KYC_RETENTION_DAYS ?? 30);
  const cut = new Date(Date.now() - days*24*3600*1000);
  await prisma.verification.updateMany({
    where: { verifiedAt: { lt: cut } },
    data: { data: null }
  });
  if ((process.env.KYC_STORE_RAW ?? 'false').toLowerCase() === 'true') {
    // à toi de choisir une règle (ex: purge si > 180j)
  }
}
