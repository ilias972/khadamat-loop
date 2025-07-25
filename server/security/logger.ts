import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Configuration avancée des logs de sécurité
export class SecurityLogger {
  private static logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          message,
          traceId: meta.traceId || uuidv4(),
          ...meta
        });
      })
    ),
    defaultMeta: { service: 'khadamat-security' },
    transports: [
      // Logs d'erreurs dans fichier séparé
      new winston.transports.File({ 
        filename: 'logs/security-error.log', 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 10
      }),
      // Logs de sécurité généraux
      new winston.transports.File({ 
        filename: 'logs/security.log',
        maxsize: 5242880,
        maxFiles: 20
      }),
      // Console en développement
      ...(process.env.NODE_ENV === 'development' ? [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ] : [])
    ]
  });

  // Log des tentatives de connexion
  static logLoginAttempt(email: string, ip: string, success: boolean, details?: any) {
    this.logger.info('LOGIN_ATTEMPT', {
      email,
      ip,
      success,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // Log des activités suspectes
  static logSuspiciousActivity(ip: string, activityType: string, details: any) {
    this.logger.warn('SUSPICIOUS_ACTIVITY', {
      ip,
      activityType,
      details,
      timestamp: new Date().toISOString(),
      severity: 'HIGH'
    });
  }

  // Log des erreurs de sécurité
  static logSecurityError(errorType: string, error: any, context?: any) {
    this.logger.error('SECURITY_ERROR', {
      errorType,
      error: error.message || error,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }

  // Log des changements de permissions
  static logPermissionChange(adminId: number, targetUserId: number, change: string, details?: any) {
    this.logger.info('PERMISSION_CHANGE', {
      adminId,
      targetUserId,
      change,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Log des transactions sensibles
  static logSensitiveOperation(userId: number, operation: string, details: any, ip: string) {
    this.logger.info('SENSITIVE_OPERATION', {
      userId,
      operation,
      details,
      ip,
      timestamp: new Date().toISOString()
    });
  }

  // Log des tentatives 2FA
  static log2FAAttempt(userId: number, success: boolean, ip: string) {
    this.logger.info('2FA_ATTEMPT', {
      userId,
      success,
      ip,
      timestamp: new Date().toISOString()
    });
  }

  // Log des sessions
  static logSessionActivity(sessionId: string, userId: number, activity: string, ip: string) {
    this.logger.info('SESSION_ACTIVITY', {
      sessionId,
      userId,
      activity,
      ip,
      timestamp: new Date().toISOString()
    });
  }

  // Log des tentatives d'accès API
  static logAPIAccess(endpoint: string, method: string, ip: string, userId?: number, statusCode?: number) {
    this.logger.info('API_ACCESS', {
      endpoint,
      method,
      ip,
      userId,
      statusCode,
      timestamp: new Date().toISOString()
    });
  }

  // Log des erreurs générales
  static logError(context: string, error: any) {
    this.logger.error('APPLICATION_ERROR', {
      context,
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  // Log des violations de sécurité critiques
  static logCriticalSecurity(violation: string, details: any, ip: string) {
    this.logger.error('CRITICAL_SECURITY_VIOLATION', {
      violation,
      details,
      ip,
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      alert: true
    });
  }

  // Log des accès aux données sensibles
  static logSensitiveDataAccess(userId: number, dataType: string, action: string, ip: string) {
    this.logger.info('SENSITIVE_DATA_ACCESS', {
      userId,
      dataType,
      action,
      ip,
      timestamp: new Date().toISOString()
    });
  }

  // Statistiques de sécurité (pour dashboard)
  static async getSecurityStats(hours: number = 24) {
    // En production, ceci ferait des requêtes sur les logs
    // Pour l'instant, simulation des données
    return {
      loginAttempts: {
        successful: 150,
        failed: 12,
        blocked: 3
      },
      suspiciousActivities: 8,
      securityErrors: 2,
      apiCalls: 2453,
      criticalAlerts: 0,
      period: `${hours}h`
    };
  }
}

// Configuration des alertes en temps réel
export class SecurityAlerts {
  private static alertThresholds = {
    failedLogins: 5, // par IP dans 15 min
    suspiciousActivities: 10, // par heure
    criticalErrors: 1 // immédiat
  };

  static async checkAlertThresholds() {
    // En production, vérifier les seuils et envoyer alertes
    console.log('Vérification des seuils de sécurité...');
  }

  static async sendSecurityAlert(level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', message: string, details: any) {
    // En production, envoyer emails/SMS aux administrateurs
    SecurityLogger.logCriticalSecurity(`ALERT_${level}`, { message, details }, 'system');
  }
}

// Audit trail pour conformité
export class AuditLogger {
  static logDataAccess(userId: number, action: 'READ' | 'WRITE' | 'DELETE', resource: string, ip: string) {
    SecurityLogger.logSensitiveDataAccess(userId, resource, action, ip);
  }

  static logConfigurationChange(adminId: number, setting: string, oldValue: any, newValue: any, ip: string) {
    SecurityLogger.logSensitiveOperation(adminId, 'CONFIG_CHANGE', {
      setting,
      oldValue,
      newValue
    }, ip);
  }

  static logPaymentOperation(userId: number, operation: string, amount: number, provider: string, ip: string) {
    SecurityLogger.logSensitiveOperation(userId, 'PAYMENT_OPERATION', {
      operation,
      amount,
      provider,
      timestamp: new Date().toISOString()
    }, ip);
  }
}