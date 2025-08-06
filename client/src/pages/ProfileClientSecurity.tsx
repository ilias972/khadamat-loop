import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Edit, 
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Key,
  CheckCircle
} from "lucide-react";

export default function ProfileClientSecurity() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    lastLogin: "2024-01-15 14:30",
    loginHistory: [
      { date: "2024-01-15 14:30", device: "Chrome - MacBook Pro", location: "Casablanca, Maroc" },
      { date: "2024-01-14 09:15", device: "Safari - iPhone", location: "Rabat, Maroc" },
      { date: "2024-01-12 16:45", device: "Chrome - Windows", location: "Fès, Maroc" }
    ]
  });

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurityInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log("Sauvegarde des paramètres de sécurité");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/profil/client")}
            className="mb-4 text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au profil
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Sécurité du compte
              </h1>
              <p className="text-gray-600">
                Gérez vos paramètres de sécurité et mots de passe
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Sécurisé</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span>Paramètres de sécurité</span>
              </div>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSave}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Sauvegarder
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Changement de mot de passe */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Changer le mot de passe</h3>
              
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={securityInfo.currentPassword}
                    onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={securityInfo.newPassword}
                    onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={securityInfo.confirmPassword}
                  onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Authentification à deux facteurs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Authentification à deux facteurs</h3>
                  <p className="text-sm text-gray-600">Sécurisez votre compte avec un code supplémentaire</p>
                </div>
                <Switch
                  checked={securityInfo.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSecurityChange("twoFactorEnabled", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Historique de connexion */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Historique de connexion</h3>
              <div className="space-y-3">
                {securityInfo.loginHistory.map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{login.device}</p>
                        <p className="text-sm text-gray-600">{login.location}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{login.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
