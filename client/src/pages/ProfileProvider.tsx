import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Shield, 
  Bell, 
  Edit, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Key,
  Building,
  Briefcase,
  Star,
  Crown,
  Clock,
  DollarSign
} from "lucide-react";

export default function ProfileProvider() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("info");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Mohammed",
    lastName: "Idrissi",
    email: "mohammed.idrissi@email.com",
    phone: "+212 6 98 76 54 32",
    address: "456 Avenue Mohammed V, Casablanca",
    birthDate: "1980-07-22",
    companyName: "Électricité Idrissi",
    siret: "12345678901234",
    description: "Électricien professionnel avec plus de 15 ans d'expérience. Spécialisé dans l'installation électrique, la maintenance et la rénovation.",
    services: ["Installation électrique", "Maintenance", "Dépannage", "Rénovation"],
    experience: "15 ans",
    hourlyRate: "150 DH"
  });

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

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    newReservations: true,
    newMessages: true,
    serviceReminders: true,
    promotionalOffers: false,
    clientReviews: true,
    paymentNotifications: true,
    availabilityUpdates: true
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurityInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePersonalInfo = () => {
    // Simulation de sauvegarde
    console.log("Sauvegarde des informations personnelles");
  };

  const handleSaveSecurity = () => {
    // Simulation de sauvegarde
    console.log("Sauvegarde des paramètres de sécurité");
  };

  const handleSaveNotifications = () => {
    // Simulation de sauvegarde
    console.log("Sauvegarde des paramètres de notifications");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Mon Profil Prestataire
              </h1>
              <p className="text-gray-600">
                Gérez vos informations professionnelles, sécurité et notifications
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                <Crown className="w-4 h-4 mr-1" />
                Club Pro
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-1" />
                Vérifié
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Informations</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Informations personnelles */}
          <TabsContent value="info" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-orange-600" />
                    <span>Informations professionnelles</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSavePersonalInfo}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={personalInfo.companyName}
                    onChange={(e) => handlePersonalInfoChange("companyName", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="siret">Numéro SIRET</Label>
                  <Input
                    id="siret"
                    value={personalInfo.siret}
                    onChange={(e) => handlePersonalInfoChange("siret", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email professionnel</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                    />
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adresse professionnelle</Label>
                  <Input
                    id="address"
                    value={personalInfo.address}
                    onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description des services</Label>
                  <Textarea
                    id="description"
                    value={personalInfo.description}
                    onChange={(e) => handlePersonalInfoChange("description", e.target.value)}
                    rows={4}
                    placeholder="Décrivez vos services, votre expérience et vos spécialités..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="experience">Années d'expérience</Label>
                    <Input
                      id="experience"
                      value={personalInfo.experience}
                      onChange={(e) => handlePersonalInfoChange("experience", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Tarif horaire (DH)</Label>
                    <Input
                      id="hourlyRate"
                      value={personalInfo.hourlyRate}
                      onChange={(e) => handlePersonalInfoChange("hourlyRate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Date de naissance</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={personalInfo.birthDate}
                      onChange={(e) => handlePersonalInfoChange("birthDate", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Services proposés</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personalInfo.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <span>Paramètres de sécurité</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSaveSecurity}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
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
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
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
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityInfo.confirmPassword}
                      onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
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
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <span>Paramètres de notifications</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSaveNotifications}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer
                  </Button>
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
                    />
                  </div>
                </div>

                {/* Types de notifications prestataire */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Types de notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Nouvelles réservations</p>
                      <p className="text-sm text-gray-600">Demandes de service et réservations</p>
                    </div>
                    <Switch
                      checked={notifications.newReservations}
                      onCheckedChange={(checked) => handleNotificationChange("newReservations", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Nouveaux messages</p>
                      <p className="text-sm text-gray-600">Messages des clients</p>
                    </div>
                    <Switch
                      checked={notifications.newMessages}
                      onCheckedChange={(checked) => handleNotificationChange("newMessages", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Avis clients</p>
                      <p className="text-sm text-gray-600">Nouveaux avis et évaluations</p>
                    </div>
                    <Switch
                      checked={notifications.clientReviews}
                      onCheckedChange={(checked) => handleNotificationChange("clientReviews", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notifications de paiement</p>
                      <p className="text-sm text-gray-600">Paiements reçus et transactions</p>
                    </div>
                    <Switch
                      checked={notifications.paymentNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("paymentNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Mises à jour de disponibilité</p>
                      <p className="text-sm text-gray-600">Rappels de planification</p>
                    </div>
                    <Switch
                      checked={notifications.availabilityUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("availabilityUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Offres promotionnelles</p>
                      <p className="text-sm text-gray-600">Offres spéciales et réductions</p>
                    </div>
                    <Switch
                      checked={notifications.promotionalOffers}
                      onCheckedChange={(checked) => handleNotificationChange("promotionalOffers", checked)}
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
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
