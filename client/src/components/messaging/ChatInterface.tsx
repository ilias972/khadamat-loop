import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Video, Paperclip, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isSent: boolean;
  timestamp: string;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ChatInterfaceProps {
  contact: Contact;
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

export default function ChatInterface({ contact, messages, onSendMessage }: ChatInterfaceProps) {
  const { t } = useLanguage();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white rounded-t-2xl">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img 
            src={contact.avatar} 
            alt={contact.name}
            className="w-12 h-12 rounded-full object-cover" 
          />
          <div>
            <h4 className="font-semibold text-gray-900">{contact.name}</h4>
            <span className={`text-sm flex items-center space-x-1 rtl:space-x-reverse ${
              contact.isOnline ? 'text-green-500' : 'text-gray-500'
            }`}>
              {contact.isOnline && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-subtle"></div>
              )}
              <span>{contact.isOnline ? t("providers.online") : "Hors ligne"}</span>
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button size="sm" variant="ghost" className="p-3 hover:bg-orange-100 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-orange-500" />
          </Button>
          <Button size="sm" variant="ghost" className="p-3 hover:bg-orange-100 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-orange-500" />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex animate-fade-in ${
              message.isSent ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`max-w-xs px-4 py-3 rounded-2xl ${
              message.isSent 
                ? 'chat-bubble-sent text-white rounded-br-md shadow-sm' 
                : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100'
            }`}>
              <p className="text-sm">{message.text}</p>
              <span className={`text-xs mt-1 block ${
                message.isSent ? 'opacity-75' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button size="sm" variant="ghost" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-400" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={t("chat.input_placeholder")}
          />
          <Button 
            onClick={handleSendMessage}
            size="sm"
            className="p-2 gradient-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
