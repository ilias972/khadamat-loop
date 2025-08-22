import { Request, Response, NextFunction } from 'express';
import ipaddr from 'ipaddr.js';
import { env } from '../config/env';
import { logger } from '../config/logger';

export function ipAllowList() {
  const list = (env.adminIpAllowlist || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const cidrs = list
    .map((entry) => {
      try {
        return ipaddr.parseCIDR(entry);
      } catch {
        return null;
      }
    })
    .filter((v): v is [ipaddr.IPv4 | ipaddr.IPv6, number] => v !== null);

  return (req: Request, res: Response, next: NextFunction) => {
    if (cidrs.length === 0) return next();
    try {
      const addr = ipaddr.parse(req.ip || '');
      const allowed = cidrs.some(([net, prefix]) => addr.match(net, prefix));
      if (allowed) return next();
    } catch {}
    logger.warn('ADMIN_IP_BLOCKED', { ip: req.ip });
    return res.status(403).json({
      success: false,
      error: {
        code: 'ADMIN_IP_BLOCKED',
        message: 'IP not allowed',
        timestamp: new Date().toISOString(),
      },
    });
  };
}
