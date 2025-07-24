import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { 
  Menu, 
  UserPlus, 
  LogIn, 
  AlertTriangle,
  X,
  Info
} from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/Symbole abstrait sur fond orange_1753291962087.png";

export default function MobileHeader() {
  const { t, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSOSClick = () => {
    // SOS functionality would be implemented here
    alert(t("header.sos_alert"));
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-orange-100 z-50 md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img 
            src={logoImage} 
            alt="Khadamat Logo" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl font-bold text-gray-900">
            Khadamat
          </h1>
        </div>

        {/* Menu Button */}
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-56 mt-2 bg-white/95 backdrop-blur-md border border-orange-100"
            sideOffset={4}
          >
            <Link href="/register">
              <DropdownMenuItem 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 focus:bg-orange-50"
              >
                <UserPlus className="w-5 h-5 text-orange-600" />
                <span className="font-medium">{t("header.register")}</span>
              </DropdownMenuItem>
            </Link>
            
            <Link href="/login">
              <DropdownMenuItem 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 focus:bg-orange-50"
              >
                <LogIn className="w-5 h-5 text-orange-600" />
                <span className="font-medium">{t("header.login")}</span>
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator className="bg-orange-100" />
            
            <Link href="/about">
              <DropdownMenuItem 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 focus:bg-orange-50"
              >
                <Info className="w-5 h-5 text-orange-600" />
                <span className="font-medium">{t("nav.about")}</span>
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator className="bg-orange-100" />
            
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {t("header.language")}
                </span>
                <LanguageToggle />
              </div>
            </div>
            
            <DropdownMenuSeparator className="bg-orange-100" />
            
            <DropdownMenuItem 
              onClick={handleSOSClick}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 focus:bg-red-50"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">{t("header.sos")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}