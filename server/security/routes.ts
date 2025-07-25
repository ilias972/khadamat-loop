import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { 
  hashPassword, 
  verifyPassword, 
  generate2FASecret, 
  verify2FAToken,
  createUserSession,
  validatePasswordStrength,
  generateVerificationToken
} from './auth';
import { 
  authRateLimit, 
  strictRateLimit,
  validateLoginInput,
  validateRegisterInput,
  validate2FAInput,
  handleValidationErrors,
  authenticateToken,
  require2FA,
  captureClientIP,
  detectSuspiciousActivity,
  sanitizeInput
} from './middleware';
import { SecurityLogger, AuditLogger } from './logger';
import { SecureNotificationManager } from './notifications';
import { EnterpriseEncryption } from './encryption';
import { validateMoroccanKYC } from './payment';

const router = Router();

// Middleware global pour toutes les routes de sécurité
router.use(captureClientIP);
router.use(detectSuspiciousActivity);
router.use(sanitizeInput);

// Interface pour les utilisateurs (à synchroniser avec schema.ts)
interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client' | 'provider' | 'admin';
  isVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  nationalId?: string;
  address?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Stockage temporaire (en production, utiliser base de données)
let users: User[] = [];
let sessions: any[] = [];
let verificationCodes: { [email: string]: { code: string; expiresAt: Date; type: string } } = {};

// Route d'inscription sécurisée
router.post('/register', 
  authRateLimit,
  validateRegisterInput,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone, userType, nationalId, address } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        SecurityLogger.logSuspiciousActivity(req.clientIp!, 'DUPLICATE_REGISTRATION', { email });
        return res.status(409).json({ error: 'Utilisateur déjà existant' });
      }
      
      // Validation force mot de passe
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          error: 'Mot de passe trop faible',
          details: passwordValidation.errors
        });
      }
      
      // Validation KYC OBLIGATOIRE pour tous les utilisateurs
      const kycValidation = validateMoroccanKYC({ 
        nationalId, 
        passport: req.body.passport,
        phoneNumber: phone, 
        address,
        birthDate: req.body.birthDate
      });
      
      if (!kycValidation.valid) {
        return res.status(400).json({
          error: 'Vérification d\'identité obligatoire échouée',
          details: kycValidation.errors,
          riskLevel: kycValidation.riskLevel
        });
      }
      
      // Chiffrement mot de passe
      const hashedPassword = await hashPassword(password);
      
      // Création utilisateur avec données chiffrées
      const newUser: User = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: userType || 'client',
        isVerified: false,
        twoFactorEnabled: false,
        nationalId: nationalId ? EnterpriseEncryption.encryptSensitiveData(nationalId).encrypted : undefined,
        address: address ? EnterpriseEncryption.encryptSensitiveData(address).encrypted : undefined,
        createdAt: new Date()
      };
      
      users.push(newUser);
      
      // Génération code de vérification email
      const verificationCode = generateVerificationToken();
      verificationCodes[email] = {
        code: verificationCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        type: 'email_verification'
      };
      
      // Envoi email de vérification
      await SecureNotificationManager.sendSecureEmail(
        email,
        'email_verification',
        {
          firstName,
          verificationCode,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email?code=${verificationCode}&email=${encodeURIComponent(email)}`
        },
        'high'
      );
      
      // Log de l'inscription
      SecurityLogger.logLoginAttempt(email, req.clientIp!, true, {
        action: 'REGISTRATION',
        userType: newUser.role
      });
      
      res.status(201).json({
        message: 'Compte créé avec succès. Vérifiez votre email.',
        userId: newUser.id,
        requiresVerification: true
      });
      
    } catch (error) {
      SecurityLogger.logError('REGISTRATION_ERROR', error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
  }
);

// Route de connexion sécurisée avec 2FA
router.post('/login',
  authRateLimit,
  validateLoginInput,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, password, twoFactorCode } = req.body;
      
      // Recherche utilisateur
      const user = users.find(u => u.email === email);
      if (!user) {
        SecurityLogger.logSuspiciousActivity(req.clientIp!, 'LOGIN_UNKNOWN_EMAIL', { email });
        return res.status(401).json({ error: 'Identifiants invalides' });
      }
      
      // Vérification mot de passe
      const passwordValid = await verifyPassword(password, user.password);
      if (!passwordValid) {
        SecurityLogger.logLoginAttempt(email, req.clientIp!, false, { reason: 'INVALID_PASSWORD' });
        return res.status(401).json({ error: 'Identifiants invalides' });
      }
      
      // Vérification compte activé
      if (!user.isVerified) {
        return res.status(403).json({ 
          error: 'Compte non vérifié',
          code: 'ACCOUNT_NOT_VERIFIED'
        });
      }
      
      // Vérification 2FA si activé
      if (user.twoFactorEnabled) {
        if (!twoFactorCode) {
          return res.status(403).json({
            error: 'Code 2FA requis',
            code: 'REQUIRE_2FA'
          });
        }
        
        if (!user.twoFactorSecret) {
          SecurityLogger.logSecurityError('MISSING_2FA_SECRET', { userId: user.id });
          return res.status(500).json({ error: 'Erreur de configuration 2FA' });
        }
        
        const twoFactorValid = verify2FAToken(user.twoFactorSecret, twoFactorCode);
        if (!twoFactorValid) {
          SecurityLogger.log2FAAttempt(user.id, false, req.clientIp!);
          return res.status(401).json({ error: 'Code 2FA invalide' });
        }
        
        SecurityLogger.log2FAAttempt(user.id, true, req.clientIp!);
      }
      
      // Création session sécurisée
      const session = createUserSession(
        user.id,
        req.clientIp!,
        req.get('User-Agent') || ''
      );
      sessions.push(session);
      
      // Mise à jour dernière connexion
      user.lastLoginAt = new Date();
      
      // Log connexion réussie
      SecurityLogger.logLoginAttempt(email, req.clientIp!, true, {
        userId: user.id,
        twoFactorUsed: user.twoFactorEnabled
      });
      
      // Notification de connexion
      await SecureNotificationManager.sendSecureEmail(
        email,
        'login_success',
        {
          firstName: user.firstName,
          loginDate: new Date().toLocaleString('fr-FR'),
          ipAddress: req.clientIp!,
          userAgent: req.get('User-Agent') || 'Inconnu'
        },
        'low'
      );
      
      res.json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled
        },
        token: session.token,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt
      });
      
    } catch (error) {
      SecurityLogger.logError('LOGIN_ERROR', error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }
);

// Configuration 2FA - Génération QR Code
router.post('/2fa/setup',
  strictRateLimit,
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = users.find(u => u.id === req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      if (user.twoFactorEnabled) {
        return res.status(400).json({ error: '2FA déjà activé' });
      }
      
      // Génération secret 2FA
      const { secret, qrCode } = generate2FASecret(user.email);
      
      // Stockage temporaire du secret (non activé tant que pas vérifié)
      user.twoFactorSecret = secret;
      
      SecurityLogger.logSensitiveOperation(
        user.id,
        '2FA_SETUP_INITIATED',
        { email: user.email },
        req.clientIp!
      );
      
      res.json({
        message: 'Secret 2FA généré',
        secret,
        qrCode,
        manualEntryKey: secret
      });
      
    } catch (error) {
      SecurityLogger.logError('2FA_SETUP_ERROR', error);
      res.status(500).json({ error: 'Erreur configuration 2FA' });
    }
  }
);

// Activation 2FA avec vérification code
router.post('/2fa/enable',
  strictRateLimit,
  authenticateToken,
  validate2FAInput,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const user = users.find(u => u.id === req.user!.id);
      
      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ error: 'Configuration 2FA non initialisée' });
      }
      
      // Vérification code 2FA
      const isValid = verify2FAToken(user.twoFactorSecret, token);
      if (!isValid) {
        SecurityLogger.log2FAAttempt(user.id, false, req.clientIp!);
        return res.status(400).json({ error: 'Code 2FA invalide' });
      }
      
      // Activation 2FA
      user.twoFactorEnabled = true;
      
      // Génération codes de récupération
      const recoveryCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      );
      
      SecurityLogger.logSensitiveOperation(
        user.id,
        '2FA_ENABLED',
        { email: user.email },
        req.clientIp!
      );
      
      // Notification par email
      await SecureNotificationManager.sendSecureEmail(
        user.email,
        'two_factor_setup',
        {
          firstName: user.firstName,
          recoveryCodes: recoveryCodes.join('<br>')
        },
        'high'
      );
      
      res.json({
        message: '2FA activé avec succès',
        recoveryCodes
      });
      
    } catch (error) {
      SecurityLogger.logError('2FA_ENABLE_ERROR', error);
      res.status(500).json({ error: 'Erreur activation 2FA' });
    }
  }
);

// Vérification email
router.post('/verify-email',
  authRateLimit,
  body('email').isEmail().normalizeEmail(),
  body('code').isLength({ min: 1 }),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;
      
      const verification = verificationCodes[email];
      if (!verification || verification.code !== code) {
        SecurityLogger.logSuspiciousActivity(req.clientIp!, 'INVALID_VERIFICATION_CODE', { email });
        return res.status(400).json({ error: 'Code de vérification invalide' });
      }
      
      if (verification.expiresAt < new Date()) {
        delete verificationCodes[email];
        return res.status(400).json({ error: 'Code de vérification expiré' });
      }
      
      // Activation compte
      const user = users.find(u => u.email === email);
      if (user) {
        user.isVerified = true;
        delete verificationCodes[email];
        
        SecurityLogger.logSensitiveOperation(
          user.id,
          'EMAIL_VERIFIED',
          { email },
          req.clientIp!
        );
      }
      
      res.json({ message: 'Email vérifié avec succès' });
      
    } catch (error) {
      SecurityLogger.logError('EMAIL_VERIFICATION_ERROR', error);
      res.status(500).json({ error: 'Erreur vérification email' });
    }
  }
);

// Route de déconnexion sécurisée
router.post('/logout',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // Invalidation session
      const sessionIndex = sessions.findIndex(s => s.id === req.sessionId);
      if (sessionIndex !== -1) {
        sessions[sessionIndex].isActive = false;
        SecurityLogger.logSessionActivity(
          req.sessionId!,
          req.user!.id,
          'LOGOUT',
          req.clientIp!
        );
      }
      
      res.json({ message: 'Déconnexion réussie' });
      
    } catch (error) {
      SecurityLogger.logError('LOGOUT_ERROR', error);
      res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
  }
);

// Informations de sécurité utilisateur
router.get('/security-info',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = users.find(u => u.id === req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      const userSessions = sessions.filter(s => s.userId === user.id && s.isActive);
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled,
          isVerified: user.isVerified,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        },
        security: {
          activeSessions: userSessions.length,
          sessions: userSessions.map(s => ({
            id: s.id,
            createdAt: s.createdAt,
            lastActive: s.lastActive,
            ipAddress: s.ipAddress.replace(/(\d+\.\d+)\.\d+\.\d+/, '$1.***.**'), // Masquer IP partiellement
            userAgent: s.userAgent
          }))
        }
      });
      
    } catch (error) {
      SecurityLogger.logError('SECURITY_INFO_ERROR', error);
      res.status(500).json({ error: 'Erreur récupération informations sécurité' });
    }
  }
);

export default router;