import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { 
  User, 
  Package, 
  Heart, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronDown,
  Crown,
  FileText
} from "lucide-react";

interface UserProfileMenuProps {
  className?: string;
}

// Hook pour détecter le rôle de l'utilisateur
const useUserRole = () => {
  // Simulation - à remplacer par votre logique d'authentification
  const isClient = true; // ou false selon l'utilisateur connecté
  const isPrestataire = false; // ou true selon l'utilisateur connecté
  
  return { isClient, isPrestataire };
};

export default function UserProfileMenu({ className = "" }: UserProfileMenuProps) {
  const { t } = useLanguage();
  const { isClient, isPrestataire } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Données mockées de l'utilisateur
  const user = {
    firstName: "Ahmed",
    lastName: "Ben Ali",
    avatar: null
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Logique de déconnexion
    console.log("Déconnexion...");
    setIsOpen(false);
  };

  const menuItems = isClient ? [
    { label: "Profil", icon: User, href: "/profile" },
    { label: "Mes commandes", icon: Package, href: "/orders" },
    { label: "Mes favoris", icon: Heart, href: "/favorites" },
    { label: "Messages", icon: MessageSquare, href: "/messages" },
    { label: "Réglages", icon: Settings, href: "/settings" },
  ] : [
    { label: "Profil", icon: User, href: "/profile" },
    { label: "Mes missions", icon: FileText, href: "/missions" },
    { label: "Club Pro", icon: Crown, href: "/club-pro" },
    { label: "Messages", icon: MessageSquare, href: "/messages" },
    { label: "Réglages", icon: Settings, href: "/settings" },
  ];

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Bouton du menu */}
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu profil utilisateur"
      >
        {/* Avatar ou icône par défaut */}
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-orange-600" />
          )}
        </div>
        
        {/* Nom de l'utilisateur */}
        <span className="text-sm font-medium text-gray-700 hidden md:block">
          {user.firstName} {user.lastName}
        </span>
        
        {/* Icône de flèche */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* En-tête du menu */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {isClient ? "Client" : "Prestataire"}
                </p>
              </div>
            </div>
          </div>

          {/* Liste des options */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <button
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              </Link>
            ))}
            
            {/* Séparateur */}
            <div className="border-t border-gray-100 my-1"></div>
            
            {/* Bouton de déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 