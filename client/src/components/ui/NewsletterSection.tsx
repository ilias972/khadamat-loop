import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Bell, MapPin, Lightbulb, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");

  // Détection automatique de la localisation pour personnaliser les emails
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
                );
                const data = await response.json();
                const city = data.address?.city || data.address?.town || data.address?.village || "votre région";
                setUserLocation(city);
              } catch (error) {
                console.log("Erreur géocodage:", error);
                setUserLocation("votre région");
              }
            },
            (error) => {
              console.log("Erreur géolocalisation:", error);
              setUserLocation("votre région");
            }
          );
        } else {
          setUserLocation("votre région");
        }
      } catch (error) {
        console.log("Erreur détection localisation:", error);
        setUserLocation("votre région");
      }
    };

    detectUserLocation();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    // Simuler l'inscription (remplacer par votre API)
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset après 3 secondes
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 newsletter-fade-in">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-orange-300 transform rotate-12 scale-150"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icône principale */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg newsletter-bounce">
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          {/* Titre et description */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Restez informé des nouveautés et des offres dans votre région
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Inscrivez-vous gratuitement et ne manquez aucune actualité de Khadamat. 
            Recevez des offres personnalisées pour {userLocation || "votre région"}.
          </p>
          
          {/* Formulaire d'inscription */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre adresse email"
                  className="flex-1 px-6 py-4 text-lg border-none focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? "Inscription..." : "S'inscrire"}
                </Button>
              </div>
            </div>
          </form>
          
          {/* Message de succès */}
          {isSubscribed && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 animate-fade-in">
              <p className="text-green-800 font-medium">
                ✅ Inscription réussie ! Vous recevrez bientôt nos actualités personnalisées pour {userLocation || "votre région"}.
              </p>
            </div>
          )}
          
          {/* Avantages */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-orange-100 max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center">
              Ce que vous recevrez :
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex items-start space-x-4 newsletter-benefit" style={{ animationDelay: '0.1s' }}>
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Actualités du site</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Nouvelles fonctionnalités et améliorations de la plateforme
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 newsletter-benefit" style={{ animationDelay: '0.2s' }}>
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Offres localisées</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Promotions et prestataires disponibles dans votre région
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 newsletter-benefit" style={{ animationDelay: '0.3s' }}>
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conseils utiles</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Astuces et guides pratiques pour vos projets
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 newsletter-benefit" style={{ animationDelay: '0.4s' }}>
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sécurité garantie</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Vos données sont protégées et ne seront jamais partagées
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Note de confidentialité */}
          <p className="text-sm text-gray-500 mt-8 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Pas de spam, désabonnement en un clic
          </p>
        </div>
      </div>
    </section>
  );
} 