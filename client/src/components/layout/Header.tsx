import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [location] = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 glassmorphism border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Khadamat</span>
        </div>
        
        {/* Navigation centrale - TOUS ALIGNÉS */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            href="/" 
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            Accueil
          </Link>
          <Link 
            href="/club-pro" 
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            Club Pro
          </Link>
          <Link 
            href="/project" 
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105"
          >
            Projet
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
          
          {/* Sélecteur de langue */}
          <div className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
            <Globe className="w-4 h-4 text-gray-500" />
            <select 
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={language}
              onChange={(e) => toggleLanguage()}
            >
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
          </div>
          
          {/* Connexion avec même animation */}
          <Link href="/login">
            <button className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-all font-medium rounded-lg hover:shadow-md hover:bg-orange-50 transform hover:scale-105">
              Connexion
            </button>
          </Link>
          
          {/* Bouton CTA */}
          <Link href="/register">
            <button className="gradient-orange text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md">
              S'inscrire
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
