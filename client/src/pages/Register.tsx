import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  UserCheck,
  Briefcase
} from "lucide-react";

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Confirmation du mot de passe requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<"client" | "provider">("client");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: "client",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<RegisterFormData, "confirmPassword">) => {
      const response = await apiRequest("POST", "/api/users/register", userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...userData } = data;
    createUserMutation.mutate(userData);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: "Type de compte", description: "Choisissez votre profil" },
    { id: 2, title: "Informations personnelles", description: "Vos coordonnées" },
    { id: 3, title: "Sécurisation", description: "Mot de passe et validation" },
  ];

  const moroccanCities = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", 
    "Oujda", "Kenitra", "Tétouan", "Safi", "Mohammedia", "Khouribga", "Beni Mellal",
    "El Jadida", "Nador", "Taza", "Settat", "Larache", "Ksar El Kebir"
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 pattern-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Créez Votre Compte
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rejoignez la communauté Khadamat et accédez à des milliers de services professionnels
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(currentStep / 3) * 100} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${
                  currentStep >= step.id ? 'text-orange-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                  currentStep >= step.id 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Account Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Quel type de compte souhaitez-vous ?
                    </h2>
                    <p className="text-gray-600">
                      Choisissez le type de compte qui correspond à vos besoins
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Client Card */}
                    <div 
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        userType === "client" 
                          ? 'border-orange-500 bg-orange-50 shadow-lg' 
                          : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                      }`}
                      onClick={() => {
                        setUserType("client");
                        setValue("userType", "client");
                      }}
                    >
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                          userType === "client" ? 'gradient-orange' : 'bg-gray-100'
                        }`}>
                          <User className={`w-8 h-8 ${userType === "client" ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Client</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Je cherche des prestataires de services pour mes besoins
                        </p>
                        <ul className="text-left text-sm text-gray-600 space-y-1">
                          <li>• Publier des projets</li>
                          <li>• Contacter des prestataires</li>
                          <li>• Système de favoris</li>
                          <li>• Messagerie intégrée</li>
                        </ul>
                      </div>
                    </div>

                    {/* Provider Card */}
                    <div 
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        userType === "provider" 
                          ? 'border-orange-500 bg-orange-50 shadow-lg' 
                          : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                      }`}
                      onClick={() => {
                        setUserType("provider");
                        setValue("userType", "provider");
                      }}
                    >
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                          userType === "provider" ? 'gradient-orange' : 'bg-gray-100'
                        }`}>
                          <Briefcase className={`w-8 h-8 ${userType === "provider" ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Prestataire</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Je propose mes services professionnels aux clients
                        </p>
                        <ul className="text-left text-sm text-gray-600 space-y-1">
                          <li>• Profil professionnel</li>
                          <li>• Recevoir des demandes</li>
                          <li>• Éligible Club Pro</li>
                          <li>• Outils de gestion</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Informations Personnelles
                    </h2>
                    <p className="text-gray-600">
                      Complétez vos informations pour créer votre profil
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <div className="relative">
                        <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className="pl-10"
                          placeholder="Votre prénom"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <div className="relative">
                        <UserCheck className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className="pl-10"
                          placeholder="Votre nom"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse Email *</Label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="pl-10"
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="phone"
                        {...register("phone")}
                        className="pl-10"
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ville</Label>
                    <Select onValueChange={(value) => setValue("location", value)}>
                      <SelectTrigger>
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                          <SelectValue placeholder="Choisissez votre ville" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {moroccanCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Security */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Sécurisation du Compte
                    </h2>
                    <p className="text-gray-600">
                      Choisissez un mot de passe sécurisé pour protéger votre compte
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur *</Label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="username"
                        {...register("username")}
                        className="pl-10"
                        placeholder="Nom d'utilisateur unique"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="pl-10"
                        placeholder="Mot de passe sécurisé"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className="pl-10"
                        placeholder="Répétez votre mot de passe"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Critères du mot de passe :</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Au moins 8 caractères</li>
                      <li>• Une lettre majuscule et minuscule</li>
                      <li>• Un chiffre</li>
                      <li>• Un caractère spécial</li>
                    </ul>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      J'accepte les{" "}
                      <a href="#" className="text-orange-600 hover:text-orange-700 underline">
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="#" className="text-orange-600 hover:text-orange-700 underline">
                        politique de confidentialité
                      </a>{" "}
                      de Khadamat.
                    </Label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="gradient-orange text-white border-0 flex items-center space-x-2"
                  >
                    <span>Suivant</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    className="gradient-orange text-white border-0 flex items-center space-x-2"
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <span>Création...</span>
                      </>
                    ) : (
                      <>
                        <span>Créer mon compte</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{" "}
            <button
              onClick={() => setLocation("/login")}
              className="text-orange-600 hover:text-orange-700 font-semibold underline"
            >
              Connectez-vous
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
