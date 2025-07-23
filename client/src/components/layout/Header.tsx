import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [location] = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 glassmorphism bg-white/80 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8 rtl:space-x-reverse">
          <Link href="/">
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <Link 
              href="/services" 
              className={`text-gray-700 hover:text-orange-500 transition-colors font-medium ${
                location === "/services" ? "text-orange-500" : ""
              }`}
            >
              {t("nav.services")}
            </Link>
            <Link 
              href="/providers" 
              className={`text-gray-700 hover:text-orange-500 transition-colors font-medium ${
                location === "/providers" ? "text-orange-500" : ""
              }`}
            >
              {t("nav.providers")}
            </Link>
            <Link 
              href="/club-pro" 
              className={`text-gray-700 hover:text-orange-500 transition-colors font-medium ${
                location === "/club-pro" ? "text-orange-500" : ""
              }`}
            >
              {t("nav.club_pro")}
            </Link>
            <Link 
              href="/sos" 
              className={`text-gray-700 hover:text-orange-500 transition-colors font-medium ${
                location === "/sos" ? "text-orange-500" : ""
              }`}
            >
              SOS
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Language Toggle */}
          <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 rounded-lg p-1">
            <button 
              onClick={toggleLanguage}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === "fr" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              FR
            </button>
            <button 
              onClick={toggleLanguage}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === "ar" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              AR
            </button>
          </div>
          
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium hidden md:inline-flex"
            >
              {t("nav.login")}
            </Button>
          </Link>
          
          {/* CTA Button */}
          <Link href="/register">
            <Button className="gradient-orange text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border-0">
              {t("common.join")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
