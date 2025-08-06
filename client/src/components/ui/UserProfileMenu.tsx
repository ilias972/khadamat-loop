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
  // Vous pouvez passer ces props depuis le Header ou utiliser un contexte d'auth
  const isClient = true; // ou false selon l'utilisateur connecté
  const isPrestataire = false; // ou true selon l'utilisateur connecté
  
  return { isClient, isPrestataire };
};

export default function UserProfileMenu({ className = "" }: UserProfileMenuProps) {
  const { t } = useLanguage();
  const { isClient, isPrestataire } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'right' | 'left'>('right');
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
    if (!isOpen) {
      // Vérifier la position avant d'ouvrir le menu
      const button = menuRef.current?.querySelector('button');
      if (button) {
        const rect = button.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const menuWidth = 256; // w-64 = 16rem = 256px
        
        if (rect.right + menuWidth > windowWidth) {
          setMenuPosition('left');
        } else {
          setMenuPosition('right');
        }
      }
    }
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Logique de déconnexion
    console.log("Déconnexion...");
    setIsOpen(false);
  };

  const menuItems = isClient ? [
    { label: t("profile.menu.profile"), icon: User, href: "/profile" },
    { label: t("profile.menu.reservations"), icon: Package, href: "/mes-reservations" },
    { label: t("profile.menu.favorites"), icon: Heart, href: "/mes-favoris" },
    { label: t("profile.menu.messages"), icon: MessageSquare, href: "/messages" },
    { label: t("profile.menu.settings"), icon: Settings, href: "/reglages" },
  ] : [
    { label: t("profile.menu.profile"), icon: User, href: "/profile" },
    { label: t("profile.menu.missions"), icon: FileText, href: "/missions" },
    { label: t("profile.menu.club_pro"), icon: Crown, href: "/club-pro" },
    { label: t("profile.menu.messages"), icon: MessageSquare, href: "/messages" },
    { label: t("profile.menu.settings"), icon: Settings, href: "/reglages" },
  ];

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Bouton du menu */}
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:shadow-md transform hover:scale-105"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu profil utilisateur"
      >
        {/* Avatar ou icône par défaut */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm">
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
        <div className={`absolute ${menuPosition === 'right' ? 'right-0' : 'left-0'} mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in max-h-96 overflow-y-auto`}>
          {/* En-tête du menu */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm">
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
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {isClient ? (
                    <>
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {t("profile.role.client")}
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      {t("profile.role.provider")}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Liste des options */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-150 rounded-lg mx-2"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            ))}
            
            {/* Séparateur */}
            <div className="border-t border-gray-100 my-2 mx-2"></div>
            
            {/* Bouton de déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 rounded-lg mx-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">{t("profile.menu.logout")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 