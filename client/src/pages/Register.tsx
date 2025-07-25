import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Eye, EyeOff, Lock, Mail, User, Phone, MapPin, IdCard, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";

// Schéma de validation renforcé pour inscription
const registerSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Email requis"),
  password: z.string()
    .min(12, "Mot de passe doit contenir au moins 12 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Mot de passe doit contenir: majuscule, minuscule, chiffre, caractère spécial"),
  confirmPassword: z.string().min(1, "Confirmation requise"),
  firstName: z.string()
    .min(2, "Prénom doit contenir au moins 2 caractères")
    .max(50, "Prénom trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Prénom contient des caractères invalides"),
  lastName: z.string()
    .min(2, "Nom doit contenir au moins 2 caractères")
    .max(50, "Nom trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Nom contient des caractères invalides"),
  phone: z.string()
    .regex(/^(\+212|0)[5-7]\d{8}$/, "Numéro de téléphone marocain invalide"),
  userType: z.enum(['client', 'provider'], {
    errorMap: () => ({ message: "Type d'utilisateur requis" })
  }),
  nationalId: z.string()
    .regex(/^[A-Z]{1,2}\d{6}$/, "Numéro de carte nationale marocaine invalide")
    .optional(),
  passport: z.string()
    .regex(/^[A-Z]{2}\d{6}$/, "Numéro de passeport marocain invalide")
    .optional(),
  address: z.string().min(20, "Adresse complète requise (minimum 20 caractères)"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation"
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la politique de confidentialité"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
}).refine((data) => data.nationalId || data.passport, {
  message: "OBLIGATOIRE: Carte nationale OU passeport marocain requis",
  path: ["nationalId"]
}).refine((data) => {
  if (data.birthDate) {
    const age = new Date().getFullYear() - new Date(data.birthDate).getFullYear();
    return age >= 18;
  }
  return false;
}, {
  message: "Vous devez être majeur (18+ ans) pour créer un compte",
  path: ["birthDate"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string[]>([]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      userType: undefined,
      nationalId: "",
      passport: "",
      address: "",
      birthDate: "",
      acceptTerms: false,
      acceptPrivacy: false
    }
  });

  // Vérification force mot de passe en temps réel
  const checkPasswordStrength = (password: string) => {
    const checks = [
      { test: password.length >= 12, message: "Au moins 12 caractères" },
      { test: /[a-z]/.test(password), message: "Une minuscule" },
      { test: /[A-Z]/.test(password), message: "Une majuscule" },
      { test: /\d/.test(password), message: "Un chiffre" },
      { test: /[@$!%*?&]/.test(password), message: "Un caractère spécial" }
    ];
    
    setPasswordStrength(checks.map(check => 
      check.test ? `✅ ${check.message}` : `❌ ${check.message}`
    ));
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('Un compte avec cet email existe déjà');
          return;
        }
        
        if (result.details && Array.isArray(result.details)) {
          setError(result.details.map((d: any) => d.msg).join(', '));
          return;
        }

        throw new Error(result.error || 'Erreur lors de la création du compte');
      }

      setSuccess(true);

    } catch (error) {
      console.error('Erreur inscription:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glassmorphism shadow-xl border-0">
          <CardContent className="text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Compte créé avec succès !
            </h2>
            <p className="text-gray-600 mb-6">
              Un email de vérification a été envoyé à votre adresse. 
              Cliquez sur le lien pour activer votre compte.
            </p>
            <Link href="/login">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Se connecter
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* En-tête avec alerte importante */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer un compte Khadamat
          </h1>
          <p className="text-gray-600">
            Rejoignez la plateforme sécurisée de services au Maroc
          </p>
        </div>

        {/* Alerte importante sur la vérification d'identité */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Nouvelle réglementation marocaine :</strong> Conformément aux directives de Bank Al Maghrib et 
            à la loi sur la protection des consommateurs, tous les utilisateurs doivent fournir une pièce d'identité 
            marocaine valide (carte nationale ou passeport) pour créer un compte.
          </AlertDescription>
        </Alert>

        <Card className="glassmorphism shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <User className="w-5 h-5 text-orange-500" />
              Inscription Sécurisée
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Informations personnelles */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Ahmed" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Benali" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email et téléphone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="ahmed@example.com" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Téléphone
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+212 6 XX XX XX XX" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">Numéro marocain requis</p>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mots de passe */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              {...field}
                              disabled={isLoading}
                              onChange={(e) => {
                                field.onChange(e);
                                checkPasswordStrength(e.target.value);
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        {passwordStrength.length > 0 && (
                          <div className="text-xs space-y-1">
                            {passwordStrength.map((check, index) => (
                              <div key={index}>{check}</div>
                            ))}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              {...field}
                              disabled={isLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Type d'utilisateur */}
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de compte</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre type de compte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="client">Client - Je recherche des services</SelectItem>
                          <SelectItem value="provider">Prestataire - Je propose des services</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vérification d'identité OBLIGATOIRE */}
                <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                    <IdCard className="w-5 h-5" />
                    Vérification d'identité OBLIGATOIRE
                  </h3>
                  <div className="bg-red-100 border border-red-300 rounded p-4 mb-4">
                    <p className="text-sm text-red-800 font-medium mb-2">
                      ⚠️ REQUIS: Tous les utilisateurs doivent fournir une pièce d'identité marocaine valide
                    </p>
                    <ul className="text-xs text-red-700 list-disc list-inside space-y-1">
                      <li>Conformité aux réglementations de Bank Al Maghrib</li>
                      <li>Protection contre la fraude et l'usurpation d'identité</li>
                      <li>Sécurisation des transactions financières</li>
                      <li>Respect de la loi marocaine sur les services numériques</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Documents d'identité */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nationalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-700 font-medium">
                              Carte nationale marocaine
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="A123456 ou AB123456" 
                                {...field} 
                                disabled={isLoading}
                                maxLength={8}
                                className="border-red-300 focus:border-red-500"
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-red-600">Format strict: A123456 ou AB123456</p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="passport"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-700 font-medium">
                              OU Passeport marocain
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="AB123456" 
                                {...field} 
                                disabled={isLoading}
                                maxLength={8}
                                className="border-red-300 focus:border-red-500"
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-red-600">Format: AB123456 (2 lettres + 6 chiffres)</p>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Date de naissance */}
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-700 font-medium">
                            Date de naissance (18+ ans requis)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                              disabled={isLoading}
                              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                              className="border-red-300 focus:border-red-500"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-red-600">Vous devez être majeur selon la loi marocaine</p>
                        </FormItem>
                      )}
                    />

                    {/* Adresse complète */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-red-700 font-medium">
                            <MapPin className="w-4 h-4" />
                            Adresse complète au Maroc
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Numéro, rue, quartier, ville, Maroc (minimum 20 caractères)" 
                              {...field} 
                              disabled={isLoading}
                              className="border-red-300 focus:border-red-500"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-red-600">Adresse complète requise pour conformité Bank Al Maghrib</p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Acceptation des conditions */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            J'accepte les{" "}
                            <Link href="/terms" className="text-orange-600 hover:underline">
                              conditions d'utilisation
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptPrivacy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            J'accepte la{" "}
                            <Link href="/privacy" className="text-orange-600 hover:underline">
                              politique de confidentialité
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bouton d'inscription */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création du compte...
                    </div>
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>
              </form>
            </Form>

            {/* Lien de connexion */}
            <div className="text-center pt-4 border-t border-gray-200">
              <span className="text-gray-600">Déjà un compte ? </span>
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto text-orange-600 hover:text-orange-700 font-semibold">
                  Se connecter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Informations de sécurité et liens utiles */}
        <div className="mt-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            Données chiffrées AES-256 • Conformité Bank Al Maghrib
          </div>
          
          <div className="text-sm text-gray-600">
            <Link href="/identity-verification" className="text-orange-600 hover:underline">
              Pourquoi demandons-nous une pièce d'identité ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}