import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Heart, 
  FileText, 
  Star, 
  MapPin,
  Phone,
  Mail,
  Edit,
  Shield,
  CreditCard
} from "lucide-react";

export default function Profile() {
  const { t } = useLanguage();

  const userStats = [
    {
      icon: FileText,
      label: t("profile.stats.projects"),
      value: "12",
      color: "text-blue-600"
    },
    {
      icon: Star,
      label: t("profile.stats.rating"),
      value: "4.8",
      color: "text-yellow-600"
    },
    {
      icon: Heart,
      label: t("profile.stats.favorites"),
      value: "24",
      color: "text-red-600"
    }
  ];

  const menuItems = [
    {
      icon: Edit,
      label: t("profile.menu.edit_profile"),
      description: t("profile.menu.edit_profile_desc"),
      action: "edit-profile"
    },
    {
      icon: Shield,
      label: t("profile.menu.verification"),
      description: t("profile.menu.verification_desc"),
      action: "verification",
      badge: t("profile.verified")
    },
    {
      icon: CreditCard,
      label: t("profile.menu.payments"),
      description: t("profile.menu.payments_desc"),
      action: "payments"
    },
    {
      icon: Settings,
      label: t("profile.menu.settings"),
      description: t("profile.menu.settings_desc"),
      action: "settings"
    }
  ];

  return (
    <div className="min-h-screen pt-16 pb-20 md:pt-20 md:pb-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                    KA
                  </div>
                  <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white">
                    {t("profile.verified")}
                  </Badge>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Khalid Alami
                  </h1>
                  <p className="text-gray-600 mb-3">
                    {t("profile.member_since")} Mars 2023
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{t("cities.casablanca")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>+212 6XX XXX XXX</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>khalid@email.com</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center md:justify-start space-x-6">
                    {userStats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="text-center">
                          <div className={`flex items-center justify-center space-x-1 ${stat.color}`}>
                            <Icon className="w-4 h-4" />
                            <span className="font-bold text-lg">{stat.value}</span>
                          </div>
                          <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <User className="w-6 h-6 mr-3 text-orange-500" />
                {t("profile.account_settings")}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-orange-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {item.label}
                            </h4>
                            {item.badge && (
                              <Badge variant="secondary" className="bg-green-100 text-green-600 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-orange-600">
                          {t("common.configure")}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}