import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Shield, Lock, Crown, CheckCircle, ArrowRight } from "lucide-react";

export default function ClubProCheckout() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    acceptTerms: false,
    acceptNewsletter: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'un processus de paiement
    setTimeout(() => {
      setIsLoading(false);
      // Rediriger vers une page de succès ou le profil
      setLocation("/profile");
    }, 2000);
  };

  const planDetails = {
    name: "Club Pro",
    price: "50 DH",
    period: "/mois",
    duration: "Engagement d'un an",
    features: [
      "Badge vérifié et profil certifié",
      "Visibilité prioritaire dans les résultats",
      "Support premium 24/7",
      "Accès aux clients premium",
      "Tarifs premium (+40% en moyenne)",
      "Réservations avancées"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/club-pro")}
            className="mb-4 text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Club Pro
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Club Pro</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Finaliser votre inscription
            </h1>
            <p className="text-gray-600">
              Rejoignez l'élite des prestataires en quelques étapes simples
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de paiement */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <span>Informations de paiement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Informations personnelles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  {/* Informations de carte */}
                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardholderName">Nom du titulaire</Label>
                    <Input
                      id="cardholderName"
                      placeholder="Nom tel qu'il apparaît sur la carte"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Mois</Label>
                      <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange("expiryMonth", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Année</Label>
                      <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange("expiryYear", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        J'accepte les <a href="/terms" className="text-orange-600 hover:underline">conditions générales</a> et la{" "}
                        <a href="/privacy" className="text-orange-600 hover:underline">politique de confidentialité</a>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="newsletter"
                        checked={formData.acceptNewsletter}
                        onCheckedChange={(checked) => handleInputChange("acceptNewsletter", checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-sm leading-relaxed">
                        Je souhaite recevoir les offres et actualités du Club Pro
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !formData.acceptTerms}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Traitement en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Rejoindre le Club Pro</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Résumé de la commande */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Résumé de votre abonnement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Plan Club Pro</span>
                  <span className="text-2xl font-bold">{planDetails.price}</span>
                </div>
                <div className="text-orange-100 text-sm">
                  {planDetails.period} • {planDetails.duration}
                </div>
                
                <div className="pt-4 border-t border-orange-400">
                  <div className="space-y-2">
                    {planDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-orange-200 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Paiement sécurisé</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Chiffrement SSL 256-bit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Conformité PCI DSS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Protection des données</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Méthodes de paiement */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Méthodes de paiement acceptées</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Cartes bancaires</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-orange-600 font-semibold">Orange Money</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 font-semibold">PayPal</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-green-600 font-semibold">Virement</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
