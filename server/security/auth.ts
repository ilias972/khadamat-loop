import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import crypto from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// Configuration sécurisée
const JWT_SECRET = process.env.JWT_SECRET || 'khadamat-super-secret-key-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'khadamat-refresh-secret-2024';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'khadamat-encryption-key-32-chars!!';

export interface AuthUser {
  id: number;
  email: string;
  role: 'client' | 'provider' | 'admin';
  isVerified: boolean;
  twoFactorEnabled: boolean;
  sessionId: string;
}

export interface UserSession {
  id: string;
  userId: number;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastActive: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

// Hashage sécurisé des mots de passe avec bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Très sécurisé
  return await bcrypt.hash(password, saltRounds);
}

// Vérification mot de passe
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Chiffrement AES-256 pour données sensibles
export function encryptSensitiveData(data: string): string {
  return crypto.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

// Déchiffrement AES-256
export function decryptSensitiveData(encryptedData: string): string {
  const bytes = crypto.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(crypto.enc.Utf8);
}

// Génération token JWT sécurisé
export function generateAccessToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      sessionId: user.sessionId,
      verified: user.isVerified 
    },
    JWT_SECRET,
    { 
      expiresIn: '15m', // Token court pour sécurité
      issuer: 'khadamat-platform',
      audience: 'khadamat-users'
    }
  );
}

// Génération refresh token
export function generateRefreshToken(userId: number, sessionId: string): string {
  return jwt.sign(
    { userId, sessionId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { 
      expiresIn: '7d',
      issuer: 'khadamat-platform'
    }
  );
}

// Vérification token JWT
export function verifyAccessToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isVerified: decoded.verified,
      twoFactorEnabled: false, // À récupérer de la DB
      sessionId: decoded.sessionId
    };
  } catch (error) {
    return null;
  }
}

// Génération secret 2FA
export function generate2FASecret(email: string): { secret: string; qrCode: string } {
  const secret = speakeasy.generateSecret({
    name: `Khadamat (${email})`,
    issuer: 'Khadamat Platform',
    length: 32
  });
  
  return {
    secret: secret.base32!,
    qrCode: secret.otpauth_url!
  };
}

// Vérification code 2FA
export function verify2FAToken(secret: string, token: string, window: number = 2): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window // Fenêtre de tolérance pour décalage temps
  });
}

// Génération session sécurisée
export function createUserSession(userId: number, ipAddress: string, userAgent: string): UserSession {
  const sessionId = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  
  const user: AuthUser = {
    id: userId,
    email: '', // À récupérer de la DB
    role: 'client', // À récupérer de la DB
    isVerified: false,
    twoFactorEnabled: false,
    sessionId
  };
  
  return {
    id: sessionId,
    userId,
    token: generateAccessToken(user),
    refreshToken: generateRefreshToken(userId, sessionId),
    expiresAt,
    createdAt: now,
    lastActive: now,
    ipAddress,
    userAgent,
    isActive: true
  };
}

// Validation force mot de passe
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Le mot de passe doit contenir au moins 12 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  // Vérification contre mots de passe communs
  const commonPasswords = ['password', '123456', 'azerty', 'qwerty', 'admin', 'khadamat'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Le mot de passe ne doit pas contenir de mots communs');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Génération token de vérification email/SMS
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Protection contre le timing attack
export async function constantTimeCompare(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  // Ajouter délai aléatoire pour masquer les patterns de timing
  await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
  
  return result === 0;
}