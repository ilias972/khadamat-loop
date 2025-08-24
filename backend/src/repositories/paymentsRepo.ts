import { prisma } from '../lib/prisma';
import { repoOpTotal, repoOpDurationMs } from '../metrics';

export interface ActivatePayload {
  subscriptionId: number;
  startDate: Date;
  endDate: Date;
}

export const paymentsRepo = {
  async markSubscriptionActiveAtomic(
    userId: number,
    sessionId: string,
    payload: ActivatePayload,
    cb?: (tx: any, subscription: any) => Promise<void>
  ) {
    const end = repoOpDurationMs?.startTimer({ repo: 'payments', method: 'markSubscriptionActiveAtomic' });
    try {
      const result = await prisma.$transaction(async (tx) => {
        const sub = await tx.subscription.update({
          where: { id: payload.subscriptionId },
          data: { status: 'ACTIVE', startAt: payload.startDate, endAt: payload.endDate, externalId: sessionId },
        });
        await tx.subscription.updateMany({
          where: { userId, status: 'PENDING', id: { not: sub.id } },
          data: { status: 'CANCELED' },
        });
        if (cb) await cb(tx, sub);
        return sub;
      });
      repoOpTotal?.inc({ repo: 'payments', method: 'markSubscriptionActiveAtomic' });
      return result;
    } finally {
      end?.();
    }
  },

  async cancelPendingForUser(userId: number) {
    const end = repoOpDurationMs?.startTimer({ repo: 'payments', method: 'cancelPendingForUser' });
    try {
      const res = await prisma.subscription.updateMany({
        where: { userId, status: 'PENDING' },
        data: { status: 'CANCELED' },
      });
      repoOpTotal?.inc({ repo: 'payments', method: 'cancelPendingForUser' });
      return res.count;
    } finally {
      end?.();
    }
  },
};
