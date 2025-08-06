import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";
import UserProfileMenu from "@/components/ui/UserProfileMenu";
import { useUnreadMessages } from '@/hooks/use-unread-messages';
import { Menu, X, AlertTriangle } from "lucide-react";

export default function Header() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const hasUnread = useUnreadMessages();
  const isRTL = language === 'ar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user authentication state - à remplacer par votre logique d'auth
  const isUserLoggedIn = true; // Changez ceci selon votre logique d'authentification

  const navigationItems = [
    { href: "/", label: t("nav.home") },
    { href: "/prestataires", label: t("nav.providers") },
    { href: "/club-pro", label: t("nav.club_pro") },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50 glassmorphism border-b border-orange-100">
      <div className={`max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative`}>
        {/* Logo + Titre (Gauche) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Navigation centrale - Desktop */}
        <nav className="hidden lg:flex items-center gap-3">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105 relative"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Droite) - Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Menu profil utilisateur ou boutons de connexion */}
          {!isUserLoggedIn ? (
            <>
              <Link href="/login">
                <button className="px-3 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105">
                  {t("nav.login")}
                </button>
              </Link>
              
              <Link href="/register">
                <button className="gradient-orange text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md">
                  {t("nav.register")}
                </button>
              </Link>
            </>
          ) : (
            <UserProfileMenu />
          )}
          
          {/* Sélecteur de langue */}
          <LanguageToggle />
          
          {/* SOS - Mis en évidence avec triangle d'alerte */}
          <Link href="/sos">
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-all font-medium rounded-lg shadow-md transform hover:scale-105 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              SOS
            </button>
          </Link>
        </div>

        {/* Menu Burger - Mobile */}
        <div className="lg:hidden flex items-center gap-2">
          {/* SOS - Toujours visible sur mobile */}
          <Link href="/sos">
            <button className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white transition-all font-medium rounded-lg shadow-md flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              SOS
            </button>
          </Link>
          
          {/* Bouton Menu Burger */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-orange-500 transition-all rounded-lg hover:bg-orange-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-orange-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Navigation Mobile */}
              <nav className="space-y-2 mb-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:bg-orange-50"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Actions Mobile */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-gray-600">Langue</span>
                  <LanguageToggle />
                </div>
                
                {!isUserLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:bg-orange-50"
                    >
                      {t("nav.login")}
                    </Link>
                    
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 gradient-orange text-white rounded-lg font-semibold transition-all text-center"
                    >
                      {t("nav.register")}
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:bg-orange-50"
                  >
                    {t("nav.profile")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
