import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Sentry } from '../config/sentry';

export type UserRole = 'client' | 'provider' | 'admin';

interface JwtPayload {
  id: string;
  role: UserRole;
  mfa?: boolean;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: 'Authorization header missing or malformed',
        timestamp: new Date().toISOString(),
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not configured');

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role, mfa: decoded.mfa };
    if (Sentry) {
      Sentry.getCurrentHub().configureScope((scope: any) => {
        scope.setUser({ id: decoded.id });
      });
    }
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: 'Invalid or expired token',
        timestamp: new Date().toISOString(),
      },
    });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 403,
          message: 'Forbidden',
          timestamp: new Date().toISOString(),
        },
      });
    }
    next();
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        mfa?: boolean;
      };
    }
  }
}

export {};
