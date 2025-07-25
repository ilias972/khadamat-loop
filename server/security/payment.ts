import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SecurityLogger, AuditLogger } from './logger';

// Interface pour les providers de paiement
export interface PaymentProvider {
  name: string;
  type: 'international' | 'local_morocco' | 'local_algeria';
  isActive: boolean;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
}

// Providers de paiement sécurisés - JAMAIS de traitement direct de cartes
export const PAYMENT_PROVIDERS: { [key: string]: PaymentProvider } = {
  stripe: {
    name: 'Stripe',
    type: 'international',
    isActive: true,
    supportedCurrencies: ['MAD', 'EUR', 'USD'],
    fees: { percentage: 2.9, fixed: 30 }
  },
  paypal: {
    name: 'PayPal',
    type: 'international',
    isActive: true,
    supportedCurrencies: ['MAD', 'EUR', 'USD'],
    fees: { percentage: 3.4, fixed: 35 }
  },
  cib: {
    name: 'CIB (Centre Monétique Interbancaire)',
    type: 'local_morocco',
    isActive: true,
    supportedCurrencies: ['MAD'],
    fees: { percentage: 2.0, fixed: 0 }
  },
  satim: {
    name: 'SATIM (Algérie)',
    type: 'local_algeria',
    isActive: false, // Désactivé pour focus Maroc
    supportedCurrencies: ['DZD'],
    fees: { percentage: 1.5, fixed: 0 }
  },
  cmi: {
    name: 'CMI (Centre Monétique Interbancaire Maroc)',
    type: 'local_morocco',
    isActive: true,
    supportedCurrencies: ['MAD'],
    fees: { percentage: 1.8, fixed: 0 }
  }
};

// Interface pour transaction sécurisée
export interface SecureTransaction {
  id: string;
  userId: number;
  providerId: number;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  tokenId: string; // Token temporaire du provider
  expiresAt: Date;
  createdAt: Date;
  metadata: {
    serviceId?: number;
    projectId?: number;
    clientIP: string;
    userAgent: string;
  };
}

// Générateur de tokens temporaires sécurisés
export function generateSecurePaymentToken(transactionId: string, userId: number): string {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${transactionId}:${userId}:${timestamp}:${nonce}`;
  
  const secret = process.env.PAYMENT_SECRET || 'khadamat-payment-secret-2024';
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  
  return Buffer.from(`${payload}:${hash}`).toString('base64');
}

// Vérification token de paiement
export function verifyPaymentToken(token: string, maxAgeMs: number = 15 * 60 * 1000): { valid: boolean; transactionId?: string; userId?: number } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    
    if (parts.length !== 5) return { valid: false };
    
    const [transactionId, userId, timestamp, nonce, providedHash] = parts;
    const payload = `${transactionId}:${userId}:${timestamp}:${nonce}`;
    
    const secret = process.env.PAYMENT_SECRET || 'khadamat-payment-secret-2024';
    const expectedHash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    
    // Protection contre timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(expectedHash, 'hex'), Buffer.from(providedHash, 'hex'))) {
      return { valid: false };
    }
    
    // Vérification expiration
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > maxAgeMs) {
      return { valid: false };
    }
    
    return {
      valid: true,
      transactionId,
      userId: parseInt(userId)
    };
  } catch (error) {
    SecurityLogger.logSecurityError('PAYMENT_TOKEN_VERIFICATION_FAILED', error);
    return { valid: false };
  }
}

// Validation montant selon réglementations marocaines (Bank Al Maghrib)
export function validateTransactionAmount(amount: number, currency: string, userType: 'individual' | 'business'): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Montants minimum et maximum selon Bank Al Maghrib
  const limits = {
    MAD: {
      individual: { min: 10, max: 50000 }, // 10 MAD à 50,000 MAD par transaction
      business: { min: 10, max: 500000 }   // Limite plus élevée pour entreprises
    },
    EUR: {
      individual: { min: 1, max: 5000 },
      business: { min: 1, max: 50000 }
    },
    USD: {
      individual: { min: 1, max: 5500 },
      business: { min: 1, max: 55000 }
    }
  };
  
  const currencyLimits = limits[currency as keyof typeof limits];
  if (!currencyLimits) {
    errors.push(`Devise ${currency} non supportée`);
    return { valid: false, errors };
  }
  
  const userLimits = currencyLimits[userType];
  
  if (amount < userLimits.min) {
    errors.push(`Montant minimum: ${userLimits.min} ${currency}`);
  }
  
  if (amount > userLimits.max) {
    errors.push(`Montant maximum: ${userLimits.max} ${currency} pour ${userType}`);
  }
  
  // Vérification des centimes (2 décimales max)
  if (Math.round(amount * 100) !== amount * 100) {
    errors.push('Montant ne peut avoir plus de 2 décimales');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Classe pour gestion sécurisée des paiements
export class SecurePaymentManager {
  // Création transaction sécurisée
  static async createSecureTransaction(
    userId: number,
    providerId: number,
    amount: number,
    currency: string,
    description: string,
    metadata: any,
    clientIP: string
  ): Promise<SecureTransaction> {
    const transactionId = uuidv4();
    const tokenId = generateSecurePaymentToken(transactionId, userId);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    const transaction: SecureTransaction = {
      id: transactionId,
      userId,
      providerId,
      amount,
      currency,
      description,
      status: 'pending',
      paymentMethod: 'card', // Déterminé par le provider
      tokenId,
      expiresAt,
      createdAt: new Date(),
      metadata: {
        ...metadata,
        clientIP,
        userAgent: metadata.userAgent
      }
    };
    
    // Log de l'opération
    AuditLogger.logPaymentOperation(userId, 'CREATE_TRANSACTION', amount, `provider_${providerId}`, clientIP);
    
    return transaction;
  }
  
  // Intégration Stripe (exemple sécurisé)
  static async processStripePayment(transaction: SecureTransaction, stripeToken: string): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
    try {
      // En production, utiliser Stripe SDK officiel
      const stripePayment = {
        amount: Math.round(transaction.amount * 100), // Stripe utilise centimes
        currency: transaction.currency.toLowerCase(),
        payment_method: stripeToken,
        confirmation_method: 'manual',
        confirm: true,
        metadata: {
          transactionId: transaction.id,
          userId: transaction.userId.toString(),
          platform: 'khadamat'
        }
      };
      
      // Simulation - en production, appeler Stripe API
      const paymentResult = {
        id: `pi_${uuidv4()}`,
        status: 'succeeded'
      };
      
      AuditLogger.logPaymentOperation(
        transaction.userId,
        'STRIPE_PAYMENT_PROCESSED',
        transaction.amount,
        'stripe',
        transaction.metadata.clientIP
      );
      
      return {
        success: true,
        paymentIntentId: paymentResult.id
      };
    } catch (error) {
      SecurityLogger.logSecurityError('STRIPE_PAYMENT_ERROR', error, {
        transactionId: transaction.id,
        userId: transaction.userId
      });
      
      return {
        success: false,
        error: 'Erreur lors du traitement du paiement'
      };
    }
  }
  
  // Intégration CIB/CMI (providers marocains)
  static async processMoroccanPayment(transaction: SecureTransaction, cardToken: string): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // Configuration pour providers marocains (CIB/CMI)
      const payment = {
        amount: transaction.amount,
        currency: transaction.currency,
        cardToken, // Token fourni par CIB/CMI
        merchantId: process.env.MOROCCO_MERCHANT_ID,
        orderId: transaction.id,
        returnUrl: `${process.env.FRONTEND_URL}/payment/return`,
        cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`
      };
      
      // Simulation - en production, appeler API CIB/CMI
      const result = {
        transactionId: `ma_${uuidv4()}`,
        status: 'approved'
      };
      
      AuditLogger.logPaymentOperation(
        transaction.userId,
        'MOROCCO_PAYMENT_PROCESSED',
        transaction.amount,
        'cib_cmi',
        transaction.metadata.clientIP
      );
      
      return {
        success: true,
        transactionId: result.transactionId
      };
    } catch (error) {
      SecurityLogger.logSecurityError('MOROCCO_PAYMENT_ERROR', error, {
        transactionId: transaction.id
      });
      
      return {
        success: false,
        error: 'Erreur lors du paiement via provider marocain'
      };
    }
  }
  
  // Vérification statut transaction
  static async verifyTransactionStatus(transactionId: string, userId: number): Promise<{ status: string; verified: boolean }> {
    try {
      // En production, vérifier dans la base de données
      // et confirmer avec le provider de paiement
      
      AuditLogger.logDataAccess(userId, 'READ', 'transaction_status', 'system');
      
      return {
        status: 'completed',
        verified: true
      };
    } catch (error) {
      SecurityLogger.logError('TRANSACTION_VERIFICATION_ERROR', error);
      return {
        status: 'error',
        verified: false
      };
    }
  }
}

// Configuration conformité Bank Al Maghrib
export const MOROCCO_COMPLIANCE = {
  dailyLimits: {
    individual: 10000, // 10,000 MAD par jour
    business: 100000   // 100,000 MAD par jour
  },
  monthlyLimits: {
    individual: 200000, // 200,000 MAD par mois
    business: 2000000   // 2,000,000 MAD par mois
  },
  requiredFields: [
    'nationalId', // Carte nationale ou passeport
    'phoneNumber', // Numéro marocain obligatoire
    'address'      // Adresse au Maroc
  ],
  supportedBanks: [
    'Attijariwafa Bank',
    'Banque Populaire',
    'BMCE Bank',
    'BMCI',
    'Crédit Agricole du Maroc',
    'Crédit du Maroc',
    'CIH Bank',
    'Al Barid Bank'
  ]
};

// Validation KYC OBLIGATOIRE (Know Your Customer) pour Maroc
export function validateMoroccanKYC(userData: any): { valid: boolean; errors: string[]; riskLevel: 'low' | 'medium' | 'high' } {
  const errors: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  
  // OBLIGATOIRE: Document d'identité marocain (carte nationale OU passeport)
  const hasNationalId = userData.nationalId && /^[A-Z]{1,2}\d{6}$/.test(userData.nationalId);
  const hasPassport = userData.passport && /^[A-Z]{2}\d{6}$/.test(userData.passport);
  
  if (!hasNationalId && !hasPassport) {
    errors.push('OBLIGATOIRE: Carte nationale marocaine OU passeport requis pour tous les utilisateurs');
    riskLevel = 'high';
    return { valid: false, errors, riskLevel }; // Arrêt immédiat si pas de document
  }
  
  // Validation spécifique carte nationale
  if (userData.nationalId && !hasNationalId) {
    errors.push('Format carte nationale invalide. Format requis: A123456 ou AB123456');
    riskLevel = 'high';
  }
  
  // Validation spécifique passeport marocain
  if (userData.passport && !hasPassport) {
    errors.push('Format passeport marocain invalide. Format requis: AB123456');
    riskLevel = 'high';
  }
  
  // OBLIGATOIRE: Numéro de téléphone marocain
  if (!userData.phoneNumber || !/^(\+212|0)[5-7]\d{8}$/.test(userData.phoneNumber)) {
    errors.push('OBLIGATOIRE: Numéro de téléphone marocain requis (+212XXXXXXXXX ou 0XXXXXXXXX)');
    riskLevel = 'high';
  }
  
  // OBLIGATOIRE: Adresse complète au Maroc
  if (!userData.address || userData.address.length < 20) {
    errors.push('OBLIGATOIRE: Adresse complète au Maroc requise (minimum 20 caractères)');
    riskLevel = 'high';
  }
  
  // OBLIGATOIRE: Vérification âge (majeur)
  if (!userData.birthDate) {
    errors.push('OBLIGATOIRE: Date de naissance requise');
    riskLevel = 'high';
  } else {
    const age = new Date().getFullYear() - new Date(userData.birthDate).getFullYear();
    if (age < 18) {
      errors.push('OBLIGATOIRE: Utilisateur doit être majeur (18+ ans) selon la loi marocaine');
      riskLevel = 'high';
    }
  }
  
  // Vérifications additionnelles pour conformité Bank Al Maghrib
  if (userData.nationalId) {
    // Validation préfixes carte nationale valides
    const validPrefixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF'];
    const prefix = userData.nationalId.replace(/\d/g, '');
    if (!validPrefixes.includes(prefix)) {
      errors.push('Préfixe de carte nationale non reconnu');
      riskLevel = 'medium';
    }
  }
  
  if (userData.passport) {
    // Validation préfixes passeport marocain
    const validPassportPrefixes = ['MA', 'AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV'];
    const prefix = userData.passport.substring(0, 2);
    if (!validPassportPrefixes.includes(prefix)) {
      errors.push('Préfixe de passeport marocain non reconnu');
      riskLevel = 'medium';
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    riskLevel
  };
}