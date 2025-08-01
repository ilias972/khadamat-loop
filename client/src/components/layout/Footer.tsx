import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "@/components/ui/Logo";
import { Facebook, Instagram, Linkedin, Twitter, Shield } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/khadamat.ma" },
    { icon: Instagram, href: "https://instagram.com/khadamat_ma" },
    { icon: Linkedin, href: "https://linkedin.com/company/khadamat" },
    { icon: Twitter, href: "https://twitter.com/khadamat_ma" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Logo isWhite />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              {t("footer.tagline")}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Company Column */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t("footer.company")}</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">About</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">{t("footer.careers")}</Link></li>
              <li><span className="text-gray-300 text-sm">{t("footer.partners")}</span></li>
              <li><Link href="/club-pro" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">{t("nav.club_pro")}</Link></li>
            </ul>
          </div>
          
          {/* Legal Column - Enhanced */}
          <div>
            <h4 className="text-lg font-bold mb-6">Légal</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">{t("footer.faq")}</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">{t("footer.terms")}</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">{t("footer.privacy")}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0 text-sm">
            &copy; 2024 Khadamat. {t("footer.rights")}
          </p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span className="text-gray-400 text-sm">{t("footer.made_in")}</span>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-xs">{t("footer.secure")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
