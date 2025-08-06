import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Edit, 
  ArrowLeft,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  AlertTriangle
} from "lucide-react";
import { getAgeValidationMessage, getMinimumBirthDate } from "@/lib/ageValidation";

export default function ProfileInfo() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const [profileInfo, setProfileInfo] = useState({
    name: "Fatima Alami",
    email: "fatima.alami@email.com",
    phone: "+212 6 12 34 56 78",
    location: "Casablanca",
    birthDate: "1985-03-15",
    rating: 4.2,
    reviewCount: 8
  });

  const [isEditing, setIsEditing] = useState(false);
  const [ageError, setAgeError] = useState<string | null>(null);

  const validateAge = (birthDate: string) => {
    return getAgeValidationMessage(birthDate, 'profile');
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validation de l'âge en temps réel
    if (field === 'birthDate') {
      const error = validateAge(value);
      setAgeError(error);
    }
  };

  const handleSave = () => {
    // Vérification finale de l'âge avant sauvegarde
    const ageError = validateAge(profileInfo.birthDate);
    if (ageError) {
      setAgeError(ageError);
      return;
    }
    
    // Simulation de sauvegarde
    console.log("Sauvegarde des informations du profil");
    setIsEditing(false);
    setAgeError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAgeError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/profile")}
            className="mb-4 text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au profil
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Informations du profil
              </h1>
              <p className="text-gray-600">
                Gérez vos informations personnelles et contact
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-1" />
                Vérifié
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{profileInfo.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-600" />
                <span>Informations personnelles</span>
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
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={profileInfo.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profileInfo.birthDate}
                  onChange={(e) => handleProfileChange("birthDate", e.target.value)}
                  disabled={!isEditing}
                  max={getMinimumBirthDate()}
                />
                {ageError && (
                  <p className="text-red-500 text-xs mt-1">{ageError}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email"
                  type="email"
                  value={profileInfo.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  disabled={!isEditing}
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
                value={profileInfo.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={profileInfo.location}
                onChange={(e) => handleProfileChange("location", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Statistiques en lecture seule */}
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <Label>Note moyenne</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{profileInfo.rating}</span>
                  <span className="text-sm text-gray-500">({profileInfo.reviewCount} avis)</span>
                </div>
              </div>
              <div>
                <Label>Membre depuis</Label>
                <div className="mt-1 text-gray-700">
                  Mars 2023
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
