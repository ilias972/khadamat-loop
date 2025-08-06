import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Calendar } from "lucide-react";

export default function Missions() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Données mockées pour les missions
  const missions = [
    {
      id: 1,
      title: "Réparation fuite robinet cuisine",
      client: "Fatima Z.",
      location: "Casablanca, Maarif",
      date: "2024-01-25",
      time: "14:00",
      status: "pending",
      amount: "500 DH",
      description: "Fuite d'eau sous l'évier de la cuisine, besoin d'intervention rapide"
    },
    {
      id: 2,
      title: "Installation prise électrique salon",
      client: "Ahmed M.",
      location: "Rabat, Hassan",
      date: "2024-01-26",
      time: "10:00",
      status: "completed",
      amount: "800 DH",
      description: "Installation d'une nouvelle prise électrique dans le salon"
    },
    {
      id: 3,
      title: "Nettoyage appartement 3 pièces",
      client: "Khadija L.",
      location: "Marrakech, Guéliz",
      date: "2024-01-27",
      time: "09:00",
      status: "cancelled",
      amount: "300 DH",
      description: "Nettoyage complet de l'appartement, 3 pièces + cuisine"
    },
    {
      id: 4,
      title: "Réparation climatisation",
      client: "Omar S.",
      location: "Agadir, Talborjt",
      date: "2024-01-28",
      time: "16:00",
      status: "pending",
      amount: "1200 DH",
      description: "Climatisation qui ne refroidit plus, diagnostic nécessaire"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      case "urgent":
        return "Urgent";
      default:
        return "En cours";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mes missions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gérez vos missions et suivez vos interventions
            </p>
          </div>
        </div>
      </section>

      {/* Statistiques rapides */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{missions.filter(m => m.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{missions.filter(m => m.status === 'completed').length}</div>
              <div className="text-sm text-gray-600">Terminées</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{missions.filter(m => m.status === 'urgent').length}</div>
              <div className="text-sm text-gray-600">Urgentes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-600">{missions.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des missions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {missions.length > 0 ? (
            <div className="space-y-6">
              {missions.map((mission) => (
                <div key={mission.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {mission.title}
                        </h3>
                        {mission.status === 'urgent' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">
                        {mission.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>Client : {mission.client}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{mission.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mission.status)}`}>
                        {getStatusText(mission.status)}
                      </span>
                      {getStatusIcon(mission.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(mission.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{mission.time}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{mission.amount}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                        onClick={() => setLocation(`/missions/${mission.id}`)}
                      >
                        Voir détails
                      </button>
                      {mission.status === "pending" && (
                        <>
                          <button 
                            className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            onClick={() => console.log("Accepter mission", mission.id)}
                          >
                            Accepter
                          </button>
                          <button 
                            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            onClick={() => console.log("Refuser mission", mission.id)}
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      {mission.status === "completed" && (
                        <button 
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          onClick={() => setLocation(`/billing/${mission.id}`)}
                        >
                          Facturer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune mission
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore de missions assignées.
              </p>
              <button 
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                onClick={() => setLocation("/prestataires")}
              >
                Voir les demandes
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 