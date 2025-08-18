import { prisma } from '../lib/prisma';

export async function runKycRetentionJob() {
  const metaDays = Number(process.env.KYC_RETENTION_DAYS ?? 30);
  const rawDays = Number(process.env.KYC_RAW_RETENTION_DAYS ?? 365);
  const cutMeta = new Date(Date.now() - metaDays * 24 * 3600 * 1000);
  const cutRaw = new Date(Date.now() - rawDays * 24 * 3600 * 1000);

  await prisma.verification.updateMany({
    where: { verifiedAt: { lt: cutMeta } },
    data: { data: null }
  });

  const holds = new Set(
    (await prisma.legalHold.findMany({ where: { until: { gt: new Date() } } })).map(h => h.userId)
  );

  const oldVaults = await prisma.kycVault.findMany({ where: { updatedAt: { lt: cutRaw } } });
  for (const v of oldVaults) {
    if (holds.has(v.userId)) continue;
    await prisma.kycVault.update({
      where: { userId: v.userId },
      data: { encDoc: null, encDocTag: null, encDocNonce: null }
    });
  }
}
