import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  ArrowRight,
  CreditCard,
  HelpCircle,
  LogOut,
  Trash2,
  Download,
  Eye,
  Lock,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function Reglages() {
  const { t, language, toggleLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const handleLogout = () => {
    // Simulation de déconnexion
    console.log("Déconnexion");
  };

  const handleDeleteAccount = () => {
    // Simulation de suppression de compte
    console.log("Suppression de compte");
  };

  const handleExportData = () => {
    // Simulation d'export de données
    console.log("Export des données");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("settings.title")}
          </h1>
          <p className="text-gray-600">
            {t("settings.description")}
          </p>
        </div>

        <div className="space-y-6">
          {/* Section Profil */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-600" />
                <span>{t("settings.profile_section")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.profile.personal")}</h3>
                  <p className="text-sm text-gray-500">Nom, email, téléphone, localisation</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/profile/info")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {t("common.configure")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.profile.avatar")}</h3>
                  <p className="text-sm text-gray-500">Changer votre photo de profil</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/profile/info")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {t("common.configure")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.profile.language")}</h3>
                  <p className="text-sm text-gray-500">Français / العربية</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {language === 'fr' ? 'Français' : 'العربية'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Sécurité */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span>{t("settings.security_section")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.security.password")}</h3>
                  <p className="text-sm text-gray-500">Changer votre mot de passe</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/profil/client/securite")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {t("common.configure")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.security.2fa")}</h3>
                  <p className="text-sm text-gray-500">Sécurisez votre compte</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/profil/client/securite")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {t("common.configure")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.security.sessions")}</h3>
                  <p className="text-sm text-gray-500">Gérer vos connexions</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/profil/client/securite")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {t("common.configure")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Notifications */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-orange-600" />
                <span>{t("settings.notifications_section")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.notifications.manage")}</h3>
                  <p className="text-sm text-gray-500">Email, SMS, push notifications</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/profil/client/notifications")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {t("common.configure")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.theme.dark_mode")}</h3>
                  <p className="text-sm text-gray-500">Activer le thème sombre</p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section Paiement */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <span>Paiement et facturation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Méthodes de paiement</h3>
                  <p className="text-sm text-gray-500">Cartes, portefeuille électronique</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation("/profile/payment")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Gérer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Historique des paiements</h3>
                  <p className="text-sm text-gray-500">Factures et reçus</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation("/profile/billing")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Voir
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Support et Aide */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-orange-600" />
                <span>Support et aide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Centre d'aide</h3>
                  <p className="text-sm text-gray-500">FAQ et guides</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation("/faq")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Consulter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Contacter le support</h3>
                  <p className="text-sm text-gray-500">Assistance 24/7</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation("/contact")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Contacter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Compte */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-orange-600" />
                <span>{t("profile.account_settings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.actions.export_data")}</h3>
                  <p className="text-sm text-gray-500">Télécharger vos informations</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportData}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("settings.actions.export_data")}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.actions.logout")}</h3>
                  <p className="text-sm text-gray-500">Fermer votre session</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("settings.actions.logout")}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">{t("settings.actions.delete_account")}</h3>
                  <p className="text-sm text-gray-500">Action irréversible</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteAccount}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("settings.actions.delete_account")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
