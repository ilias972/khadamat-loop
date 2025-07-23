import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";

export default function MobileTabBar() {
  const { t } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: t("mobile.home"), href: "/" },
    { icon: Search, label: t("mobile.search"), href: "/services" },
    { icon: Plus, label: t("mobile.post"), href: "/post-service" },
    { icon: MessageCircle, label: t("mobile.messages"), href: "/messages" },
    { icon: User, label: t("mobile.profile"), href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-40 glassmorphism">
      <div className="flex justify-around">
        {navItems.map((item, index) => {
          const isActive = location === item.href;
          return (
            <Link key={index} href={item.href}>
              <button className="flex flex-col items-center space-y-1 py-2 px-3 rounded-xl hover:bg-orange-50 transition-colors">
                <item.icon 
                  className={`w-6 h-6 ${
                    isActive ? 'text-orange-500' : 'text-gray-400'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium ${
                    isActive ? 'text-orange-500' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
