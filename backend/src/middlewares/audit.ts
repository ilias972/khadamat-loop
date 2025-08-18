import { prisma } from '../lib/prisma';

interface LogParams {
  userId?: number;
  action: string;
  resource: string;
  resourceId?: number;
  oldValues?: any;
  newValues?: any;
  ip?: string;
  ua?: string | string[];
}

export async function logAction({
  userId,
  action,
  resource,
  resourceId,
  oldValues,
  newValues,
  ip,
  ua,
}: LogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
        newValues: newValues ? JSON.stringify(newValues) : undefined,
        ipAddress: ip,
        userAgent: typeof ua === 'string' ? ua : Array.isArray(ua) ? ua.join(',') : undefined,
      },
    });
  } catch (err) {
    console.error('Audit log failed', err);
  }
}

export default logAction;
