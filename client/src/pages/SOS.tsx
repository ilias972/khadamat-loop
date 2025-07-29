import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  MapPin, 
  Clock, 
  Flame,
  ShieldQuestion
} from "lucide-react";

export default function SOS() {
  const { t } = useLanguage();

  const emergencyServices = [
    {
      id: "police",
      name: t("sos.police"),
      number: "19",
      icon: Shield,
      color: "blue",
      description: "Urgences de sécurité, accidents et situations d'urgence nécessitant une intervention policière",
      available: "24h/24, 7j/7",
    },
    {
      id: "fire",
      name: t("sos.fire"),
      number: "15",
      icon: Flame,
      color: "red",
      description: "Urgences médicales, incendies et situations nécessitant une intervention des secours",
      available: "24h/24, 7j/7",
    },
    {
      id: "gendarmerie",
      name: t("sos.gendarmerie"),
      number: "177",
      icon: ShieldQuestion,
      color: "green",
      description: "Urgences en zones rurales et situations nécessitant l'intervention de la gendarmerie",
      available: "24h/24, 7j/7",
    },
  ];



  const handleEmergencyCall = (number: string, serviceName: string) => {
    // In a real app, this would initiate a call with geolocation
    if (confirm(`Appeler le ${number} - ${serviceName} ?`)) {
      window.location.href = `tel:${number}`;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-500",
        hover: "hover:bg-blue-600",
        border: "border-blue-500",
        text: "text-blue-600",
        ring: "ring-blue-100",
      },
      red: {
        bg: "bg-red-500",
        hover: "hover:bg-red-600",
        border: "border-red-500",
        text: "text-red-600",
        ring: "ring-red-100",
      },
      green: {
        bg: "bg-green-500",
        hover: "hover:bg-green-600",
        border: "border-green-500",
        text: "text-green-600",
        ring: "ring-green-100",
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 md:py-16 border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-3 rtl:space-x-reverse bg-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full mb-6 md:mb-8">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-base md:text-lg">{t("sos.title")}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            {t("sos.subtitle")}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
            {t("sos.description")}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 rtl:space-x-reverse text-gray-600 text-sm px-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <span>Disponible 24h/24</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <span>Géolocalisation automatique</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <span>Appel direct</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Emergency Services */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Numéros d'Urgence Officiels
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Contacts directs avec les services de secours marocains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {emergencyServices.map((service) => {
              const colors = getColorClasses(service.color);
              return (
                <Card 
                  key={service.id}
                  className={`overflow-hidden shadow-xl border-l-4 ${colors.border} hover:shadow-2xl transition-all duration-300 hover-scale h-full`}
                >
                  <CardContent className="p-6 md:p-8 h-full flex flex-col">
                    <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse mb-4 md:mb-6">
                      <div className={`w-12 h-12 md:w-16 md:h-16 ${colors.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <service.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-2xl font-bold text-gray-900 truncate">{service.name}</h3>
                        <div className={`text-xl md:text-2xl font-bold ${colors.text}`}>{service.number}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed flex-1 text-sm md:text-base">
                      {service.description}
                    </p>

                    <div className="mb-4 md:mb-6">
                      <Badge variant="secondary" className={`${colors.ring} ${colors.text} font-medium text-xs md:text-sm`}>
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        {service.available}
                      </Badge>
                    </div>
                    
                    <Button
                      onClick={() => handleEmergencyCall(service.number, service.name)}
                      className={`w-full ${colors.bg} ${colors.hover} text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold transition-all text-base md:text-lg border-0 mt-auto`}
                    >
                      <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      {t("sos.call_now")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premiers Secours */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Gestes de premiers secours à connaître
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Instructions simples et claires pour réagir en cas d'urgence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-white text-xl font-bold">🫁</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Étouffement
                </h3>
                <div className="space-y-3 text-gray-700 text-sm md:text-base flex-1">
                  <p><strong>1.</strong> Demandez à la personne de tousser fort</p>
                  <p><strong>2.</strong> Donnez 5 tapes dans le dos</p>
                  <p><strong>3.</strong> Si ça ne marche pas, faites la manœuvre de Heimlich</p>
                  <p><strong>4.</strong> Appelez les secours si ça continue</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-white text-xl font-bold">🔥</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Brûlure
                </h3>
                <div className="space-y-3 text-gray-700 text-sm md:text-base flex-1">
                  <p><strong>1.</strong> Refroidissez avec de l'eau (15-20 minutes)</p>
                  <p><strong>2.</strong> Ne mettez pas de glace directement</p>
                  <p><strong>3.</strong> Couvrez avec un linge propre</p>
                  <p><strong>4.</strong> Appelez les secours si c'est grave</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-white text-xl font-bold">💤</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Perte de connaissance
                </h3>
                <div className="space-y-3 text-gray-700 text-sm md:text-base flex-1">
                  <p><strong>1.</strong> Vérifiez si la personne respire</p>
                  <p><strong>2.</strong> Mettez-la en position latérale de sécurité</p>
                  <p><strong>3.</strong> Appelez immédiatement les secours</p>
                  <p><strong>4.</strong> Restez avec elle jusqu'à l'arrivée</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-white text-xl font-bold">🩸</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Saignement
                </h3>
                <div className="space-y-3 text-gray-700 text-sm md:text-base flex-1">
                  <p><strong>1.</strong> Appuyez directement sur la blessure</p>
                  <p><strong>2.</strong> Utilisez un linge propre</p>
                  <p><strong>3.</strong> Surélevez le membre si possible</p>
                  <p><strong>4.</strong> Appelez les secours si c'est important</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-white text-xl font-bold">⚡</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Électrocution
                </h3>
                <div className="space-y-3 text-gray-700 text-sm md:text-base flex-1">
                  <p><strong>1.</strong> Ne touchez pas la personne directement</p>
                  <p><strong>2.</strong> Coupez le courant si possible</p>
                  <p><strong>3.</strong> Utilisez un objet non conducteur</p>
                  <p><strong>4.</strong> Appelez immédiatement les secours</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <span className="text-white text-xl font-bold">🌡️</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Coup de chaleur
                </h3>
                <div className="space-y-3 text-gray-700 text-sm md:text-base flex-1">
                  <p><strong>1.</strong> Mettez la personne à l'ombre</p>
                  <p><strong>2.</strong> Donnez-lui de l'eau à boire</p>
                  <p><strong>3.</strong> Refroidissez avec de l'eau</p>
                  <p><strong>4.</strong> Appelez les secours si nécessaire</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Conseils de Sécurité
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Comment bien utiliser les services d'urgence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Avant d'Appeler
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base flex-1">
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Gardez votre calme et parlez clairement</span>
                  </li>
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Préparez votre adresse exacte</span>
                  </li>
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Décrivez précisément la situation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 h-full">
              <CardContent className="p-6 md:p-8 h-full flex flex-col">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Informations à Donner
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base flex-1">
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Votre nom et numéro de téléphone</span>
                  </li>
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Adresse précise avec points de repère</span>
                  </li>
                  <li className="flex items-start space-x-2 rtl:space-x-reverse">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Nature de l'urgence et nombre de personnes impliquées</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Avertissement Important
          </h2>
          <p className="text-lg md:text-xl text-red-100 leading-relaxed">
            Les numéros d'urgence sont réservés aux situations d'urgence réelle. 
            L'utilisation abusive de ces services est passible d'amendes et de poursuites.
          </p>
        </div>
      </section>
    </div>
  );
}
