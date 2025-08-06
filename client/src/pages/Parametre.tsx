import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Settings, Bell, Shield, User, Globe, Moon, Sun, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Parametre() {
  const { t, language, toggleLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });



  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Réglages
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Personnalisez votre expérience et gérez vos préférences
            </p>
          </div>
        </div>
      </section>

      {/* Contenu des réglages */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {/* Profil */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Nom complet</h3>
                    <p className="text-sm text-gray-500">Ahmed Ben Ali</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLocation("/profil/client/info")}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Modifier
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-500">ahmed.benali@email.com</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLocation("/profil/client/info")}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Modifier
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Téléphone</h3>
                    <p className="text-sm text-gray-500">+212 6 12 34 56 78</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setLocation("/profil/client/info")}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Modifier
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications par email</h3>
                    <p className="text-sm text-gray-500">Recevoir les mises à jour par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications SMS</h3>
                    <p className="text-sm text-gray-500">Recevoir les alertes par SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications push</h3>
                    <p className="text-sm text-gray-500">Recevoir les notifications sur le navigateur</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Langue et thème */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Préférences</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Langue</h3>
                    <p className="text-sm text-gray-500">Choisir la langue d'affichage</p>
                  </div>
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {language === 'fr' ? 'Français' : 'العربية'}
                    </span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Mode sombre</h3>
                    <p className="text-sm text-gray-500">Activer le thème sombre</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
              </div>
              
              <div className="space-y-4">
                <Button 
                  variant="ghost"
                  className="w-full flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-3 transition-colors"
                  onClick={() => setLocation("/profil/client/securite")}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">Changer le mot de passe</h3>
                    <p className="text-sm text-gray-500">Mettre à jour votre mot de passe</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Button>
                
                <Button 
                  variant="ghost"
                  className="w-full flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-3 transition-colors"
                  onClick={() => setLocation("/profil/client/securite")}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                    <p className="text-sm text-gray-500">Ajouter une couche de sécurité</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Button>
                
                <Button 
                  variant="ghost"
                  className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors"
                  onClick={() => setLocation("/profil/client/securite")}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">Sessions actives</h3>
                    <p className="text-sm text-gray-500">Gérer vos connexions</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 