import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { SecurityLogger } from './logger';

// Configuration sécurisée pour notifications
export interface NotificationConfig {
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sms: {
    provider: 'twillio' | 'local_morocco';
    apiKey: string;
    fromNumber: string;
  };
}

// Types de notifications sécurisées
export interface SecurityNotification {
  type: 'email' | 'sms' | 'both';
  recipient: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  template: string;
  variables: { [key: string]: any };
}

// Templates de notifications sécurisées
export const SECURITY_TEMPLATES = {
  login_success: {
    email: {
      subject: 'Connexion réussie - Khadamat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Connexion réussie</h2>
          <p>Bonjour {{firstName}},</p>
          <p>Une connexion a été effectuée sur votre compte Khadamat.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Détails de la connexion :</strong><br>
            📅 Date : {{loginDate}}<br>
            🌍 IP : {{ipAddress}}<br>
            💻 Appareil : {{userAgent}}
          </div>
          <p>Si ce n'était pas vous, changez immédiatement votre mot de passe.</p>
          <p>L'équipe Khadamat</p>
        </div>
      `
    },
    sms: {
      message: 'Khadamat: Connexion réussie le {{loginDate}} depuis {{ipAddress}}. Si ce n\'était pas vous, changez votre mot de passe.'
    }
  },
  
  suspicious_activity: {
    email: {
      subject: '🚨 Activité suspecte détectée - Khadamat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">🚨 Activité suspecte détectée</h2>
          <p>Bonjour {{firstName}},</p>
          <p>Nous avons détecté une activité inhabituelle sur votre compte :</p>
          <div style="background: #ffe6e6; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e74c3c;">
            <strong>Type d'activité :</strong> {{activityType}}<br>
            <strong>Date :</strong> {{detectionDate}}<br>
            <strong>IP :</strong> {{ipAddress}}<br>
            <strong>Détails :</strong> {{details}}
          </div>
          <p><strong>Actions recommandées :</strong></p>
          <ul>
            <li>Changez votre mot de passe immédiatement</li>
            <li>Activez l'authentification à deux facteurs</li>
            <li>Vérifiez vos informations de compte</li>
          </ul>
          <a href="{{securityUrl}}" style="background: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sécuriser mon compte</a>
        </div>
      `
    },
    sms: {
      message: 'Khadamat ALERTE: Activité suspecte détectée. Changez votre mot de passe immédiatement. Détails: {{activityType}}'
    }
  },
  
  two_factor_setup: {
    email: {
      subject: 'Authentification à deux facteurs activée - Khadamat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">🔐 Authentification à deux facteurs activée</h2>
          <p>Bonjour {{firstName}},</p>
          <p>L'authentification à deux facteurs a été activée avec succès sur votre compte.</p>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Codes de récupération :</strong><br>
            Conservez ces codes en lieu sûr :<br>
            {{recoveryCodes}}
          </div>
          <p>Votre compte est maintenant plus sécurisé.</p>
        </div>
      `
    }
  },
  
  payment_confirmation: {
    email: {
      subject: 'Confirmation de paiement - Khadamat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">✅ Paiement confirmé</h2>
          <p>Bonjour {{firstName}},</p>
          <p>Votre paiement a été traité avec succès.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <strong>Détails du paiement :</strong><br>
            💰 Montant : {{amount}} {{currency}}<br>
            🏷️ Service : {{serviceName}}<br>
            📅 Date : {{paymentDate}}<br>
            🔗 ID Transaction : {{transactionId}}
          </div>
          <p>Vous pouvez suivre votre commande dans votre espace client.</p>
        </div>
      `
    },
    sms: {
      message: 'Khadamat: Paiement confirmé {{amount}} {{currency}} pour {{serviceName}}. ID: {{transactionId}}'
    }
  }
};

// Classe pour gestion notifications sécurisées
export class SecureNotificationManager {
  private static transporter: nodemailer.Transporter;
  
  // Initialisation transporteur email sécurisé
  static async initialize() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      }
    });
    
    // Vérification connexion
    try {
      await this.transporter.verify();
      console.log('✅ Service email configuré');
    } catch (error) {
      SecurityLogger.logError('EMAIL_CONFIG_ERROR', error);
    }
  }
  
  // Envoi email sécurisé
  static async sendSecureEmail(
    to: string, 
    template: string, 
    variables: { [key: string]: any },
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<boolean> {
    try {
      const templateConfig = SECURITY_TEMPLATES[template as keyof typeof SECURITY_TEMPLATES];
      if (!templateConfig?.email) {
        throw new Error(`Template email ${template} non trouvé`);
      }
      
      // Remplacement variables dans template
      let subject = templateConfig.email.subject;
      let html = templateConfig.email.html;
      
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, variables[key]);
        html = html.replace(regex, variables[key]);
      });
      
      // Configuration priorité
      const priorityHeaders: { [key: string]: string } = {
        low: '5',
        medium: '3',
        high: '2',
        critical: '1'
      };
      
      await this.transporter.sendMail({
        from: `"Khadamat Sécurité" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        headers: {
          'X-Priority': priorityHeaders[priority],
          'X-MSMail-Priority': priority === 'critical' ? 'High' : 'Normal'
        }
      });
      
      SecurityLogger.logSensitiveOperation(0, 'EMAIL_SENT', {
        to: to.replace(/(.{3}).*@/, '$1***@'), // Masquer email dans logs
        template,
        priority
      }, 'system');
      
      return true;
    } catch (error) {
      SecurityLogger.logError('EMAIL_SEND_ERROR', error);
      return false;
    }
  }
  
  // Envoi SMS sécurisé (pour 2FA et alertes)
  static async sendSecureSMS(
    phoneNumber: string,
    template: string,
    variables: { [key: string]: any }
  ): Promise<boolean> {
    try {
      const templateConfig = SECURITY_TEMPLATES[template as keyof typeof SECURITY_TEMPLATES];
      if (!templateConfig || !('sms' in templateConfig)) {
        throw new Error(`Template SMS ${template} non trouvé`);
      }
      
      let message = templateConfig.sms.message;
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        message = message.replace(regex, variables[key]);
      });
      
      // En production, intégrer avec provider SMS marocain
      // Exemple avec Twillio ou service local
      console.log(`SMS à ${phoneNumber}: ${message}`);
      
      SecurityLogger.logSensitiveOperation(0, 'SMS_SENT', {
        phone: phoneNumber.replace(/(\+212\d{2})\d{6}/, '$1******'),
        template
      }, 'system');
      
      return true;
    } catch (error) {
      SecurityLogger.logError('SMS_SEND_ERROR', error);
      return false;
    }
  }
  
  // Génération code de vérification sécurisé
  static generateVerificationCode(length: number = 6): string {
    const digits = '0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      code += digits[randomIndex];
    }
    
    return code;
  }
  
  // Envoi code 2FA par email/SMS
  static async send2FACode(
    userEmail: string,
    userPhone: string,
    method: 'email' | 'sms' | 'both' = 'both'
  ): Promise<{ success: boolean; code?: string }> {
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    const variables = {
      code,
      expiresAt: expiresAt.toLocaleString('fr-FR'),
      appName: 'Khadamat'
    };
    
    try {
      let emailSent = true;
      let smsSent = true;
      
      if (method === 'email' || method === 'both') {
        emailSent = await this.sendSecureEmail(
          userEmail,
          '2fa_code',
          variables,
          'high'
        );
      }
      
      if (method === 'sms' || method === 'both') {
        smsSent = await this.sendSecureSMS(userPhone, '2fa_code', variables);
      }
      
      return {
        success: emailSent || smsSent,
        code: emailSent || smsSent ? code : undefined
      };
    } catch (error) {
      SecurityLogger.logError('2FA_CODE_SEND_ERROR', error);
      return { success: false };
    }
  }
  
  // Notification de connexion suspecte
  static async notifySuspiciousLogin(
    userEmail: string,
    userPhone: string,
    loginDetails: {
      ipAddress: string;
      userAgent: string;
      location?: string;
      timestamp: Date;
    }
  ): Promise<void> {
    const variables = {
      firstName: 'Utilisateur', // À récupérer de la DB
      loginDate: loginDetails.timestamp.toLocaleString('fr-FR'),
      ipAddress: loginDetails.ipAddress,
      userAgent: loginDetails.userAgent,
      location: loginDetails.location || 'Inconnue',
      securityUrl: `${process.env.FRONTEND_URL}/security`
    };
    
    // Email + SMS pour activité suspecte
    await Promise.all([
      this.sendSecureEmail(userEmail, 'suspicious_activity', variables, 'critical'),
      this.sendSecureSMS(userPhone, 'suspicious_activity', variables)
    ]);
  }
  
  // Notification de paiement
  static async notifyPaymentConfirmation(
    userEmail: string,
    paymentDetails: {
      amount: number;
      currency: string;
      serviceName: string;
      transactionId: string;
      timestamp: Date;
    }
  ): Promise<void> {
    const variables = {
      firstName: 'Client', // À récupérer de la DB
      amount: paymentDetails.amount.toFixed(2),
      currency: paymentDetails.currency,
      serviceName: paymentDetails.serviceName,
      transactionId: paymentDetails.transactionId,
      paymentDate: paymentDetails.timestamp.toLocaleString('fr-FR')
    };
    
    await this.sendSecureEmail(userEmail, 'payment_confirmation', variables, 'medium');
  }
}

// Template additionnel pour code 2FA
(SECURITY_TEMPLATES as any)['2fa_code'] = {
  email: {
    subject: 'Code de vérification Khadamat',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🔐 Code de vérification</h2>
        <p>Votre code de vérification Khadamat :</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; letter-spacing: 3px;">
          {{code}}
        </div>
        <p>Ce code expire dans 5 minutes.</p>
        <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
      </div>
    `
  },
  sms: {
    message: 'Khadamat: Votre code de vérification est {{code}}. Valide 5 minutes.'
  }
};