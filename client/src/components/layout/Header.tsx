import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";
import { useUnreadMessages } from '@/hooks/use-unread-messages';

export default function Header() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const hasUnread = useUnreadMessages();
  const isRTL = language === 'ar';

  return (
    <header className="fixed top-0 w-full z-50 glassmorphism border-b border-orange-100 hidden md:block">
      <div className={`max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative`}>
        {/* Logo + Titre (Gauche) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Navigation centrale */}
        <nav className={`flex items-center gap-6`}>
          <Link
            href="/"
            className="px-4 py-3 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/prestataires"
            className="px-4 py-3 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            {t("nav.providers")}
          </Link>
          <Link
            href="/club-pro"
            className="px-4 py-3 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            {t("nav.club_pro")}
          </Link>
        </nav>

        {/* Actions (Droite) : SOS, Langue, Connexion, Inscription */}
        <div className="flex items-center gap-4">
          {/* SOS */}
          <Link href="/sos">
            <button className="px-4 py-2 text-red-600 hover:text-red-700 transition-all font-medium rounded-lg hover:shadow-md hover:bg-red-50 transform hover:scale-105">
              SOS
            </button>
          </Link>
          
          {/* Sélecteur de langue */}
          <LanguageToggle />
          
          {/* Messages */}
          <Link
            href="/messages"
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105 relative"
          >
            {t("nav.messages")}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </Link>

          {/* Connexion */}
          <Link href="/login">
            <button className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105">
              {t("nav.login")}
            </button>
          </Link>
          
          {/* Inscription */}
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
