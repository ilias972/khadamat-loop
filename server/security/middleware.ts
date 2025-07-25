import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import { verifyAccessToken, AuthUser } from './auth';
import { SecurityLogger } from './logger';

// Extension interface Request pour TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionId?: string;
      clientIp?: string;
    }
  }
}

// Rate limiting agressif
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true, // Fix for Replit proxy
    handler: (req, res) => {
      SecurityLogger.logSuspiciousActivity(req.ip || 'unknown', 'RATE_LIMIT_EXCEEDED', {
        endpoint: req.path,
        userAgent: req.get('User-Agent')
      });
      res.status(429).json({ error: message });
    }
  });
};

// Rate limits spécifiques par endpoint
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 tentatives max
  'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
);

export const apiRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  100, // 100 requêtes max
  'Trop de requêtes. Ralentissez.'
);

export const strictRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 requêtes max
  'Limite stricte atteinte. Attendez avant de continuer.'
);

// Configuration CORS sécurisée
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://khadamat.ma',
      'https://www.khadamat.ma',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      SecurityLogger.logSuspiciousActivity(origin, 'CORS_VIOLATION', { origin });
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 heures
};

// Configuration Helmet pour sécurité headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for development
      connectSrc: ["'self'", "wss:", "ws:", "*"], // Allow all connections for development
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true
});

// Middleware d'authentification
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ error: 'Token d\'accès requis' });
    }
    
    const user = verifyAccessToken(token);
    if (!user) {
      SecurityLogger.logSuspiciousActivity(req.ip, 'INVALID_TOKEN', {
        token: token.substring(0, 10) + '...',
        userAgent: req.get('User-Agent')
      });
      return res.status(403).json({ error: 'Token invalide' });
    }
    
    req.user = user;
    req.sessionId = user.sessionId;
    next();
  } catch (error) {
    SecurityLogger.logError('AUTH_ERROR', error);
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};

// Middleware de vérification rôle
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      SecurityLogger.logSuspiciousActivity(req.ip, 'UNAUTHORIZED_ACCESS', {
        userId: req.user?.id,
        requiredRoles: roles,
        userRole: req.user?.role
      });
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    next();
  };
};

// Middleware de vérification 2FA
export const require2FA = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.twoFactorEnabled) {
    return res.status(403).json({ 
      error: 'Authentification à deux facteurs requise',
      code: 'REQUIRE_2FA'
    });
  }
  next();
};

// Validation stricte des entrées
export const validateLoginInput = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email valide requis'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Mot de passe requis'),
  body('email')
    .custom((value) => {
      // Protection contre injection
      if (/<script|javascript:|data:|vbscript:/i.test(value)) {
        throw new Error('Email contient du contenu suspect');
      }
      return true;
    })
];

export const validateRegisterInput = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email valide requis'),
  body('password')
    .isLength({ min: 12 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Mot de passe trop faible'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage('Prénom invalide'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage('Nom invalide'),
  body('phone')
    .isMobilePhone('ar-MA')
    .withMessage('Numéro de téléphone marocain requis')
];

export const validate2FAInput = [
  body('token')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Code 2FA à 6 chiffres requis')
];

// Middleware de validation des erreurs
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    SecurityLogger.logSuspiciousActivity(req.ip, 'VALIDATION_ERROR', {
      errors: errors.array(),
      body: req.body
    });
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array()
    });
  }
  next();
};

// Middleware de capture IP réelle
export const captureClientIP = (req: Request, res: Response, next: NextFunction) => {
  req.clientIp = req.ip || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress || 
                 (req.headers['x-forwarded-for'] as string)?.split(',')[0];
  next();
};

// Middleware de détection d'activités suspectes
export const detectSuspiciousActivity = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|httpie/i,
    /python|php|java|node/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    SecurityLogger.logSuspiciousActivity(req.ip, 'SUSPICIOUS_USER_AGENT', {
      userAgent,
      endpoint: req.path
    });
  }
  
  // Vérification taille body pour éviter DoS
  if (req.get('content-length') && parseInt(req.get('content-length')!) > 1024 * 1024) {
    SecurityLogger.logSuspiciousActivity(req.ip, 'LARGE_PAYLOAD', {
      size: req.get('content-length'),
      endpoint: req.path
    });
    return res.status(413).json({ error: 'Payload trop volumineux' });
  }
  
  next();
};

// Middleware de sanitisation
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script.*?>.*?<\/script>/gi, '')
        .replace(/<.*?>/g, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  next();
};