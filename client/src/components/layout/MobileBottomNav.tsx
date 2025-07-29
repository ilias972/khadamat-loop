import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  MessageCircle, 
  Home, 
  Users, 
  User 
} from "lucide-react";

export default function MobileBottomNav() {
  const [location, setLocation] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    {
      icon: Users,
      label: t("nav.providers"),
      path: "/prestataires",
      key: "providers"
    },
    {
      icon: MessageCircle,
      label: t("nav.messages"),
      path: "/messages",
      key: "messages"
    },
    {
      icon: Home,
      label: t("nav.home"),
      path: "/",
      key: "home"
    },
    {
      icon: Crown,
      label: t("nav.club_pro"),
      path: "/club-pro",
      key: "club-pro"
    },
    {
      icon: User,
      label: t("nav.profile"),
      path: "/profile",
      key: "profile"
    }
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-orange-100 z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-1 px-2 py-3 h-auto min-w-0 flex-1 transition-all duration-200 ${
                active 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-600 hover:text-orange-500 hover:bg-orange-50/50"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
              <span className="text-xs font-medium truncate w-full text-center leading-tight">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}