import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Key, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Globe,
  Monitor,
  Lock,
  Eye,
  Download
} from "lucide-react";

interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface SecurityAlert {
  id: string;
  type: 'login' | 'suspicious' | 'password' | '2fa';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function SecurityDashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<any>(null);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/auth/security-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setTwoFactorEnabled(data.user.twoFactorEnabled);
        
        // Simulation des sessions actives
        setSessions([
          {
            id: '1',
            device: 'Chrome sur Windows',
            location: 'Casablanca, Maroc',
            lastActive: 'Il y a 2 minutes',
            current: true
          },
          {
            id: '2',
            device: 'Safari sur iPhone',
            location: 'Rabat, Maroc',
            lastActive: 'Il y a 1 heure',
            current: false
          }
        ]);

        // Simulation des alertes sécurité
        setAlerts([
          {
            id: '1',
            type: 'login',
            message: 'Connexion réussie depuis une nouvelle IP',
            timestamp: '2024-01-25 14:30',
            severity: 'medium'
          },
          {
            id: '2',
            type: '2fa',
            message: 'Authentification à deux facteurs activée',
            timestamp: '2024-01-25 10:15',
            severity: 'low'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement données sécurité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setup2FA = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQRCodeData(data);
        setShowQRCode(true);
      }
    } catch (error) {
      console.error('Erreur configuration 2FA:', error);
    }
  };

  const enable2FA = async (code: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token: code })
      });

      if (response.ok) {
        setTwoFactorEnabled(true);
        setShowQRCode(false);
        loadSecurityData();
      }
    } catch (error) {
      console.error('Erreur activation 2FA:', error);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`/api/auth/sessions/${sessionId}/terminate`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Erreur terminaison session:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement du dashboard de sécurité...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Sécurité
          </h1>
          <p className="text-gray-600">
            Gérez la sécurité de votre compte Khadamat
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Statut de sécurité */}
          <Card className="lg:col-span-2 glassmorphism shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Statut de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score de sécurité */}
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {twoFactorEnabled ? '95%' : '70%'}
                </div>
                <div className="text-gray-600">Score de Sécurité</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: twoFactorEnabled ? '95%' : '70%' }}
                  />
                </div>
              </div>

              {/* Authentification à deux facteurs */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Authentification à deux facteurs</div>
                    <div className="text-sm text-gray-600">
                      {twoFactorEnabled 
                        ? 'Protection renforcée activée' 
                        : 'Ajoutez une couche de sécurité supplémentaire'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactorEnabled ? (
                    <Badge className="bg-green-100 text-green-800">Activé</Badge>
                  ) : (
                    <Button onClick={setup2FA} size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Activer
                    </Button>
                  )}
                </div>
              </div>

              {/* Vérification email */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Email vérifié</div>
                    <div className="text-sm text-gray-600">
                      {user?.email || 'Non vérifié'}
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
              </div>

              {/* Mot de passe */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Mot de passe</div>
                    <div className="text-sm text-gray-600">
                      Dernière modification: Il y a 2 jours
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLocation("/profil/client/securite")}
                >
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="glassmorphism shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start gap-2" 
                variant="outline"
                onClick={() => setLocation("/reglages")}
              >
                <Download className="w-4 h-4" />
                Exporter mes données
              </Button>
              <Button 
                className="w-full justify-start gap-2" 
                variant="outline"
                onClick={() => setLocation("/profil/client/securite")}
              >
                <Eye className="w-4 h-4" />
                Historique de connexion
              </Button>
              <Button 
                className="w-full justify-start gap-2" 
                variant="outline"
                onClick={() => setLocation("/contact")}
              >
                <AlertTriangle className="w-4 h-4" />
                Signaler un problème
              </Button>
            </CardContent>
          </Card>

          {/* Sessions actives */}
          <Card className="lg:col-span-2 glassmorphism shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-orange-500" />
                Sessions Actives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {session.device}
                        {session.current && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Actuelle</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.location} • {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => terminateSession(session.id)}
                    >
                      Terminer
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alertes récentes */}
          <Card className="glassmorphism shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alertes Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="space-y-2">
                  <div className={`flex items-center gap-2 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs opacity-75">{alert.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Configuration 2FA Modal */}
        {showQRCode && qrCodeData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Configuration 2FA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg inline-block mb-4">
                    {/* En production, générer un vrai QR code */}
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                      QR Code ici
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Scannez ce code avec votre application d'authentification (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                    {qrCodeData.secret}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Entrez le code à 6 chiffres"
                    className="w-full p-3 border border-gray-300 rounded-lg text-center font-mono text-lg"
                    maxLength={6}
                    onChange={(e) => {
                      if (e.target.value.length === 6) {
                        enable2FA(e.target.value);
                      }
                    }}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowQRCode(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}