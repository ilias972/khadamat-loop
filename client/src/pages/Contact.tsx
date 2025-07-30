import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  HelpCircle,
  AlertTriangle,
  Star,
  Users,
  Globe
} from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Sujet requis"),
  category: z.string().min(1, "Catégorie requise"),
  message: z.string().min(10, "Message trop court (minimum 10 caractères)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Contact form submitted:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      reset();
      setSelectedCategory("");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Une erreur s'est produite lors de l'envoi.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@khadamat.ma",
      description: "Écrivez-nous pour toute question",
      action: "mailto:contact@khadamat.ma",
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+212 (5) XX XXX XXX",
      description: "Appelez-nous du lundi au vendredi",
      action: "tel:+212XXXXXXX",
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Casablanca, Maroc",
      description: "Siège social de Khadamat",
      action: null,
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "9h - 18h",
      description: "Lundi au Vendredi",
      action: null,
    },
  ];

  const categories = [
    { value: "general", label: "Question générale", icon: HelpCircle },
    { value: "support", label: "Support technique", icon: AlertTriangle },
    { value: "provider", label: "Devenir prestataire", icon: Users },
    { value: "billing", label: "Facturation", icon: Star },
    { value: "partnership", label: "Partenariat", icon: Globe },
  ];

  const faqItems = [
    {
      question: "Comment puis-je devenir prestataire sur Khadamat ?",
      answer: "Créez un compte prestataire, complétez votre profil et soumettez vos documents pour vérification. Notre équipe examinera votre candidature sous 48h.",
    },
    {
      question: "Quels sont les tarifs de Khadamat ?",
      answer: "L'inscription est gratuite pour les clients. Personne ne paie de commission, ni les clients ni les prestataires.",
    },
    {
      question: "Comment fonctionne le Club Pro ?",
      answer: "Le Club Pro est notre programme premium pour les prestataires vérifiés. Il offre plus de visibilité et des avantages exclusifs pour 50 DH/mois.",
    },
    {
      question: "Que faire si j'ai un problème avec un prestataire ?",
      answer: "Contactez notre service client immédiatement. Nous médirons le conflit et prendrons les mesures appropriées pour résoudre le problème.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
            {t("nav.contact")}
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Nous Sommes
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {" "}À Votre Écoute
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous accompagner 
            dans votre expérience Khadamat.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card 
                key={index}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale text-center ${
                  info.action ? 'cursor-pointer' : ''
                }`}
                onClick={() => info.action && window.open(info.action, '_blank')}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 gradient-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-lg font-semibold text-orange-600 mb-1">{info.value}</p>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-orange-500" />
                  Envoyez-nous un Message
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Votre prénom"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Votre nom"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select onValueChange={(value) => {
                      setValue("category", value);
                      setSelectedCategory(value);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-2">
                              <category.icon className="w-4 h-4" />
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      placeholder="Résumez votre demande en quelques mots"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      rows={6}
                      placeholder="Décrivez votre demande en détail..."
                      className="resize-none"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full gradient-orange text-white py-3 font-semibold rounded-xl border-0 flex items-center justify-center space-x-2"
                  >
                    {contactMutation.isPending ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le Message</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Questions Fréquentes
              </h2>
              
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-start">
                        <HelpCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed pl-7">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Help */}
              <Card className="mt-8 border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">
                    Besoin d'une Aide Immédiate ?
                  </h3>
                  <p className="text-orange-100 mb-4">
                    Pour les urgences ou questions techniques, notre équipe est disponible par téléphone
                  </p>
                  <Button
                    className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
                    onClick={() => window.open("tel:+212XXXXXXX")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler Maintenant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Où Nous Trouver
            </h2>
            <p className="text-xl text-gray-600">
              Notre siège social à Casablanca
            </p>
          </div>
          
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold">Casablanca, Maroc</p>
                <p className="text-gray-500">Carte interactive bientôt disponible</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
