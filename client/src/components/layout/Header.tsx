import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";

export default function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [location] = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 glassmorphism border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        
        {/* Navigation centrale - TOUS ALIGNÉS */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            href="/" 
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            {t("nav.home")}
          </Link>
          <Link 
            href="/club-pro" 
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            {t("nav.club_pro")}
          </Link>
          <Link 
            href="/project" 
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            {t("nav.project")}
          </Link>
        </nav>
        
        {/* Actions droite - TOUS ALIGNÉS */}
        <div className="flex items-center space-x-4">
          {/* Bouton SOS à gauche (sans clignotement) */}
          <Link 
            href="/sos" 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md border border-red-400"
          >
            🚨 SOS 24/7
          </Link>
          
          <LanguageToggle />
          
          {/* Connexion avec même animation */}
          <Link href="/login">
            <button className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105">
              {t("nav.login")}
            </button>
          </Link>
          
          {/* Bouton CTA */}
          <Link href="/register">
            <button className="gradient-orange text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md">
              {t("nav.register")}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
