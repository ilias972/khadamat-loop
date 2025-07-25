import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Configuration de chiffrement AES-256-GCM pour données sensibles
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits

// Clé maître de chiffrement (en production, utiliser KMS)
const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY || 'khadamat-master-key-must-be-32-chars!';

// Interface pour données chiffrées
export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
  salt?: string;
}

// Classe pour gestion du chiffrement de niveau entreprise
export class EnterpriseEncryption {
  // Génération clé dérivée sécurisée avec PBKDF2
  private static deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
  }
  
  // Chiffrement AES-256-GCM avec authentification
  static encryptSensitiveData(data: string, useUserKey?: string): EncryptedData {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const salt = crypto.randomBytes(SALT_LENGTH);
      
      // Utiliser clé utilisateur ou clé maître
      const key = useUserKey 
        ? this.deriveKey(useUserKey, salt)
        : Buffer.from(MASTER_KEY.padEnd(KEY_LENGTH, '0').slice(0, KEY_LENGTH));
      
      const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, key);
      cipher.setAAD(Buffer.from('khadamat-auth-data'));
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        salt: useUserKey ? salt.toString('hex') : undefined
      };
    } catch (error) {
      throw new Error('Erreur de chiffrement des données sensibles');
    }
  }
  
  // Déchiffrement AES-256-GCM avec vérification authenticité
  static decryptSensitiveData(encryptedData: EncryptedData, useUserKey?: string): string {
    try {
      const key = useUserKey && encryptedData.salt
        ? this.deriveKey(useUserKey, Buffer.from(encryptedData.salt, 'hex'))
        : Buffer.from(MASTER_KEY.padEnd(KEY_LENGTH, '0').slice(0, KEY_LENGTH));
      
      const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, key);
      decipher.setAAD(Buffer.from('khadamat-auth-data'));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Erreur de déchiffrement - données corrompues ou clé invalide');
    }
  }
  
  // Chiffrement pour mots de passe avec bcrypt (plus sécurisé que SHA)
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 14; // Très haute sécurité (recommandé pour 2024+)
    return await bcrypt.hash(password, saltRounds);
  }
  
  // Vérification mot de passe avec protection timing attack
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      // Toujours prendre le même temps pour éviter timing attacks
      await bcrypt.compare(password, '$2b$14$invalidhashtopreventtimingattacks');
      return false;
    }
  }
  
  // Génération clé API sécurisée
  static generateAPIKey(prefix: string = 'kh'): string {
    const randomBytes = crypto.randomBytes(32);
    const timestamp = Date.now().toString(36);
    const checksum = crypto.createHash('sha256')
      .update(randomBytes + timestamp)
      .digest('hex')
      .slice(0, 8);
    
    return `${prefix}_${timestamp}_${randomBytes.toString('hex')}_${checksum}`;
  }
  
  // Validation clé API
  static validateAPIKey(apiKey: string): { valid: boolean; prefix?: string; timestamp?: number } {
    try {
      const parts = apiKey.split('_');
      if (parts.length !== 4) return { valid: false };
      
      const [prefix, timestamp, randomHex, providedChecksum] = parts;
      const randomBytes = Buffer.from(randomHex, 'hex');
      
      if (randomBytes.length !== 32) return { valid: false };
      
      const expectedChecksum = crypto.createHash('sha256')
        .update(randomBytes + timestamp)
        .digest('hex')
        .slice(0, 8);
      
      if (expectedChecksum !== providedChecksum) return { valid: false };
      
      return {
        valid: true,
        prefix,
        timestamp: parseInt(timestamp, 36)
      };
    } catch (error) {
      return { valid: false };
    }
  }
  
  // Chiffrement pour données PII (informations personnelles)
  static encryptPII(data: { [key: string]: any }): { [key: string]: any } {
    const sensitiveFields = [
      'email', 'phone', 'nationalId', 'address', 
      'bankAccount', 'creditCard', 'passport'
    ];
    
    const result = { ...data };
    
    sensitiveFields.forEach(field => {
      if (result[field]) {
        result[field] = this.encryptSensitiveData(result[field]);
      }
    });
    
    return result;
  }
  
  // Déchiffrement pour données PII
  static decryptPII(encryptedData: { [key: string]: any }): { [key: string]: any } {
    const sensitiveFields = [
      'email', 'phone', 'nationalId', 'address',
      'bankAccount', 'creditCard', 'passport'
    ];
    
    const result = { ...encryptedData };
    
    sensitiveFields.forEach(field => {
      if (result[field] && typeof result[field] === 'object' && result[field].encrypted) {
        try {
          result[field] = this.decryptSensitiveData(result[field]);
        } catch (error) {
          // En cas d'erreur, laisser les données chiffrées
          console.warn(`Impossible de déchiffrer le champ ${field}`);
        }
      }
    });
    
    return result;
  }
  
  // Génération token session sécurisé
  static generateSessionToken(userId: number, userRole: string): string {
    const payload = {
      userId,
      userRole,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };
    
    const signature = crypto.createHmac('sha256', MASTER_KEY)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return Buffer.from(JSON.stringify({ ...payload, signature })).toString('base64');
  }
  
  // Vérification token session
  static verifySessionToken(token: string): { valid: boolean; userId?: number; userRole?: string } {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      const { signature, ...payload } = decoded;
      
      const expectedSignature = crypto.createHmac('sha256', MASTER_KEY)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
        return { valid: false };
      }
      
      // Vérifier expiration (24h par défaut)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - payload.timestamp > maxAge) {
        return { valid: false };
      }
      
      return {
        valid: true,
        userId: payload.userId,
        userRole: payload.userRole
      };
    } catch (error) {
      return { valid: false };
    }
  }
}

// Classe pour gestion des clés de rotation
export class KeyRotationManager {
  private static keyHistory: { [keyId: string]: { key: string; createdAt: Date; active: boolean } } = {};
  
  // Génération nouvelle clé avec ID
  static generateNewKey(): { keyId: string; key: string } {
    const keyId = crypto.randomUUID();
    const key = crypto.randomBytes(32).toString('hex');
    
    this.keyHistory[keyId] = {
      key,
      createdAt: new Date(),
      active: true
    };
    
    return { keyId, key };
  }
  
  // Rotation automatique des clés (à programmer avec cron)
  static rotateKeys(): void {
    // Désactiver les anciennes clés
    Object.keys(this.keyHistory).forEach(keyId => {
      const keyData = this.keyHistory[keyId];
      const daysSinceCreation = (Date.now() - keyData.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceCreation > 30) { // 30 jours
        keyData.active = false;
      }
    });
    
    // Générer nouvelle clé
    this.generateNewKey();
    console.log('Rotation des clés effectuée');
  }
  
  // Récupération clé active
  static getActiveKey(): string | null {
    const activeKeys = Object.values(this.keyHistory).filter(k => k.active);
    return activeKeys.length > 0 ? activeKeys[activeKeys.length - 1].key : null;
  }
}

// Utilitaires de sécurité additionnels
export class SecurityUtils {
  // Génération salt personnalisé pour utilisateur
  static generateUserSalt(userId: number, email: string): string {
    return crypto.createHash('sha256')
      .update(`${userId}:${email}:${MASTER_KEY}`)
      .digest('hex');
  }
  
  // Hachage sécurisé pour vérification intégrité
  static createIntegrityHash(data: any): string {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data) + MASTER_KEY)
      .digest('hex');
  }
  
  // Vérification intégrité données
  static verifyIntegrity(data: any, hash: string): boolean {
    const expectedHash = this.createIntegrityHash(data);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  }
  
  // Anonymisation données sensibles pour logs
  static anonymizeForLogs(data: any): any {
    const result = { ...data };
    
    // Masquer emails
    if (result.email) {
      result.email = result.email.replace(/(.{2}).*@(.*)/, '$1***@$2');
    }
    
    // Masquer téléphones
    if (result.phone) {
      result.phone = result.phone.replace(/(\+212\d{2})\d{6}/, '$1******');
    }
    
    // Masquer cartes nationales
    if (result.nationalId) {
      result.nationalId = result.nationalId.replace(/(.{2}).*/, '$1****');
    }
    
    return result;
  }
}