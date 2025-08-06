import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Settings, 
  ArrowLeft,
  Mail,
  MessageSquare,
  Calendar,
  Star
} from "lucide-react";

export default function ProfileClientNotifications() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    reservationUpdates: true,
    newMessages: true,
    serviceReminders: true,
    promotionalOffers: false
  });

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simulation de sauvegarde
    console.log("Sauvegarde des paramètres de notifications");
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
                Paramètres de notifications
              </h1>
              <p className="text-gray-600">
                Configurez vos préférences de notifications
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-orange-600 font-medium">Actives</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-orange-600" />
                <span>Paramètres de notifications</span>
              </div>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurer
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
            {/* Canaux de notification */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Canaux de notification</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notifications par email</p>
                  <p className="text-sm text-gray-600">Recevoir les notifications par email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notifications SMS</p>
                  <p className="text-sm text-gray-600">Recevoir les notifications par SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notifications push</p>
                  <p className="text-sm text-gray-600">Recevoir les notifications push sur mobile</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Types de notifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Types de notifications</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mises à jour de réservation</p>
                  <p className="text-sm text-gray-600">Statut, confirmations, modifications</p>
                </div>
                <Switch
                  checked={notifications.reservationUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("reservationUpdates", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Nouveaux messages</p>
                  <p className="text-sm text-gray-600">Messages des prestataires</p>
                </div>
                <Switch
                  checked={notifications.newMessages}
                  onCheckedChange={(checked) => handleNotificationChange("newMessages", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Rappels de service</p>
                  <p className="text-sm text-gray-600">Rappels avant les rendez-vous</p>
                </div>
                <Switch
                  checked={notifications.serviceReminders}
                  onCheckedChange={(checked) => handleNotificationChange("serviceReminders", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Offres promotionnelles</p>
                  <p className="text-sm text-gray-600">Réductions et offres spéciales</p>
                </div>
                <Switch
                  checked={notifications.promotionalOffers}
                  onCheckedChange={(checked) => handleNotificationChange("promotionalOffers", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Emails marketing</p>
                  <p className="text-sm text-gray-600">Newsletter et actualités</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
