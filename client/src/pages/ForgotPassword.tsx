import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock } from "lucide-react";

const requestSchema = z.object({
  email: z.string().email("Email invalide"),
});

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Mot de passe trop court"),
    confirmPassword: z.string().min(8, "Mot de passe trop court"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const token = params.get("token");
  const isResetMode = !!token;

  const requestForm = useForm<{ email: string }>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<{ newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRequest = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSuccess(true);
    } catch (e) {
      setError("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  const submitReset = async (data: { newPassword: string; confirmPassword: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.error?.code === "TOKEN_EXPIRED") {
          setError(t("auth.reset.token_expired"));
        } else {
          setError(t("auth.reset.token_invalid"));
        }
        return;
      }
      toast({ description: t("auth.reset.success") });
      setLocation("/login");
    } catch (e) {
      setError("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            {isResetMode ? t("auth.reset.title") : t("auth.forgot.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isResetMode && success && (
            <Alert>
              <AlertDescription>{t("auth.forgot.success")}</AlertDescription>
            </Alert>
          )}

          {isResetMode ? (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(submitReset)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {t("auth.reset.new_password")}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {t("auth.reset.confirm_password")}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t("auth.reset.submit")
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...requestForm}>
              <form onSubmit={requestForm.handleSubmit(submitRequest)} className="space-y-4">
                <FormField
                  control={requestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t("auth.forgot.email_label")}
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t("auth.forgot.send_link")
                  )}
                </Button>
              </form>
            </Form>
          )}

          {error && isResetMode && (
            <Button variant="link" onClick={() => setLocation("/forgot-password")}> 
              {t("auth.forgot.send_link")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

