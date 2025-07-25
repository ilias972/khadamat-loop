import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Lock, Mail, Smartphone } from "lucide-react";
import { Link, useLocation } from "wouter";

// Schéma de validation pour connexion
const loginSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Email requis"),
  password: z.string().min(1, "Mot de passe requis"),
  twoFactorCode: z.string().optional(),
  rememberMe: z.boolean().default(false)
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [require2FA, setRequire2FA] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      twoFactorCode: "",
      rememberMe: false
    }
  });

  // Simulation de connexion sécurisée
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulation API call avec rate limiting et sécurité
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'REQUIRE_2FA') {
          setRequire2FA(true);
          setError('Code d\'authentification à deux facteurs requis');
          return;
        }
        
        if (result.code === 'ACCOUNT_NOT_VERIFIED') {
          setError('Compte non vérifié. Vérifiez votre email.');
          return;
        }

        throw new Error(result.error || 'Erreur de connexion');
      }

      // Connexion réussie
      setSuccessMessage('Connexion réussie ! Redirection...');
      
      // Stocker le token (en production, utiliser httpOnly cookies)
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('refresh_token', result.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(result.user));

      // Redirection après connexion
      setTimeout(() => {
        setLocation('/');
      }, 1500);

    } catch (error) {
      console.error('Erreur connexion:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Demande de nouveau code de vérification
  const requestNewVerificationCode = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.getValues('email') })
      });

      if (response.ok) {
        setSuccessMessage('Nouveau code de vérification envoyé');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi du code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* En-tête sécurisé */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connexion Sécurisée
          </h1>
          <p className="text-gray-600">
            Accédez à votre compte Khadamat en toute sécurité
          </p>
        </div>

        <Card className="glassmorphism shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Lock className="w-5 h-5 text-orange-500" />
              Connexion
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Messages d'état */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
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
                          placeholder="votre@email.com"
                          {...field}
                          className="h-12"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mot de passe */}
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
                            className="h-12 pr-12"
                            disabled={isLoading}
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
                    </FormItem>
                  )}
                />

                {/* Code 2FA (affiché si requis) */}
                {require2FA && (
                  <FormField
                    control={form.control}
                    name="twoFactorCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Code de vérification (2FA)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            {...field}
                            className="h-12 text-center text-lg font-mono tracking-widest"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Entrez le code à 6 chiffres de votre application d'authentification
                        </p>
                      </FormItem>
                    )}
                  />
                )}

                {/* Options */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...form.register('rememberMe')}
                      className="rounded border-gray-300"
                    />
                    Se souvenir de moi
                  </label>
                  <Link href="/forgot-password">
                    <Button variant="link" className="p-0 h-auto text-orange-600 hover:text-orange-700">
                      Mot de passe oublié ?
                    </Button>
                  </Link>
                </div>

                {/* Bouton de connexion */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion en cours...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </Form>

            {/* Liens additionnels */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {error && error.includes('non vérifié') && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={requestNewVerificationCode}
                  disabled={isLoading}
                >
                  Renvoyer l'email de vérification
                </Button>
              )}
              
              <div className="text-center">
                <span className="text-gray-600">Pas encore de compte ? </span>
                <Link href="/register">
                  <Button variant="link" className="p-0 h-auto text-orange-600 hover:text-orange-700 font-semibold">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de sécurité */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            Connexion sécurisée SSL
          </div>
        </div>
      </div>
    </div>
  );
}