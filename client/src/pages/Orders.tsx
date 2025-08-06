import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Orders() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Données mockées pour les commandes
  const orders = [
    {
      id: 1,
      service: "Plomberie",
      provider: "Ahmed Ben Ali",
      date: "2024-01-15",
      status: "completed",
      amount: "500 DH",
      description: "Réparation fuite robinet cuisine"
    },
    {
      id: 2,
      service: "Électricité",
      provider: "Mohammed El Hassani",
      date: "2024-01-20",
      status: "pending",
      amount: "800 DH",
      description: "Installation prise électrique salon"
    },
    {
      id: 3,
      service: "Ménage",
      provider: "Fatima Zahra",
      date: "2024-01-25",
      status: "cancelled",
      amount: "300 DH",
      description: "Nettoyage appartement 3 pièces"
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
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "pending":
        return "En cours";
      case "cancelled":
        return "Annulé";
      default:
        return "En attente";
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
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mes commandes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Suivez l'état de vos commandes et gérez vos services
            </p>
          </div>
        </div>
      </section>

      {/* Liste des commandes */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {order.service}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {order.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Prestataire : <span className="font-medium">{order.provider}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {getStatusIcon(order.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Date : {new Date(order.date).toLocaleDateString('fr-FR')}</span>
                      <span>Montant : <span className="font-semibold text-gray-900">{order.amount}</span></span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                        onClick={() => setLocation(`/orders/${order.id}`)}
                      >
                        Voir détails
                      </button>
                      {order.status === "pending" && (
                        <button 
                          className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          onClick={() => console.log("Annuler commande", order.id)}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore passé de commande.
              </p>
              <button 
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                onClick={() => setLocation("/services")}
              >
                Découvrir nos services
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 