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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  UserPlus,
  ArrowRight,
  Shield
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await apiRequest("POST", "/api/users/login", credentials);
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Connexion réussie !",
        description: `Bienvenue ${user.firstName} ${user.lastName}`,
      });
      
      // Store user info in localStorage (in a real app, use proper auth state management)
      localStorage.setItem("khadamat-user", JSON.stringify(user));
      
      // Redirect based on user type
      if (user.userType === "provider") {
        setLocation("/providers");
      } else {
        setLocation("/");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 pattern-bg">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bon Retour !
          </h1>
          <p className="text-gray-600">
            Connectez-vous à votre compte Khadamat
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              {t("nav.login")}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pl-10 pr-10"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" {...register("rememberMe")} />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Se souvenir de moi
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-orange-600 hover:text-orange-700 underline"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full gradient-orange text-white py-3 font-semibold rounded-xl border-0 flex items-center justify-center space-x-2"
              >
                {loginMutation.isPending ? (
                  <span>Connexion...</span>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Se connecter</span>
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <Separator className="relative">
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-500 text-sm">
                  ou
                </span>
              </Separator>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-gray-300 hover:bg-gray-50"
                onClick={() => console.log("Google login")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-gray-300 hover:bg-gray-50"
                onClick={() => console.log("Facebook login")}
              >
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuer avec Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de compte ?
          </p>
          <Button
            variant="outline"
            onClick={() => setLocation("/register")}
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 py-3 flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Créer un compte</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">Connexion Sécurisée</h4>
              <p className="text-blue-700 text-xs mt-1">
                Vos données sont protégées par un chiffrement SSL et ne sont jamais stockées en clair.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
