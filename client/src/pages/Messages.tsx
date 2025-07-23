import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Clock,
  CheckCheck
} from "lucide-react";

export default function Messages() {
  const { t } = useLanguage();

  const conversations = [
    {
      id: 1,
      name: "Ahmed Bennani",
      service: t("services.plumbing"),
      lastMessage: t("messages.last_message_1"),
      time: "14:30",
      unread: 2,
      online: true,
      avatar: "AB"
    },
    {
      id: 2,
      name: "Fatima Alaoui",
      service: t("services.cleaning"),
      lastMessage: t("messages.last_message_2"),
      time: "13:15",
      unread: 0,
      online: false,
      avatar: "FA"
    },
    {
      id: 3,
      name: "Youssef Tazi",
      service: t("services.electricity"),
      lastMessage: t("messages.last_message_3"),
      time: "11:45",
      unread: 1,
      online: true,
      avatar: "YT"
    }
  ];

  return (
    <div className="min-h-screen pt-16 pb-20 md:pt-20 md:pb-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4">
            {t("messages.badge")}
          </Badge>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {t("messages.title")}
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("messages.description")}
          </p>
        </div>
      </section>

      {/* Messages List */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-xl border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-orange-500" />
                {t("messages.conversations")}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {t("messages.no_conversations")}
                  </h3>
                  <p className="text-gray-500">
                    {t("messages.start_conversation")}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {conversation.avatar}
                          </div>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {conversation.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {conversation.time}
                              </span>
                              {conversation.unread > 0 && (
                                <Badge className="bg-orange-500 text-white px-2 py-1 text-xs">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-orange-600 font-medium mb-1">
                                {conversation.service}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-4">
                              <Button variant="ghost" size="sm" className="p-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="p-2">
                                <Video className="w-4 h-4 text-gray-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="p-2">
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}