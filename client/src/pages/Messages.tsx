import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MessageCircle, 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Image, 
  Paperclip, 
  Smile,
  Download,
  Trash2,
  Archive,
  Ban,
  Flag,
  Settings,
  FileText,
  Camera
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'file' | 'document';
    url: string;
    size: string;
  }>;
}

interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
  missionStatus: 'active' | 'completed' | 'cancelled';
  missionTitle: string;
}

export default function Messages() {
  const { t } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Données mockées des conversations
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      providerId: "provider1",
      providerName: "Ahmed Benali",
      providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      lastMessage: "Le devis sera prêt demain",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
      unreadCount: 2,
      isActive: true,
      missionStatus: 'active',
      missionTitle: "Réparation plomberie - Cuisine"
    },
    {
      id: "2",
      providerId: "provider2",
      providerName: "Fatima Zahra",
      providerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      lastMessage: "Parfait, je confirme pour jeudi",
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 jour ago
      unreadCount: 0,
      isActive: true,
      missionStatus: 'active',
      missionTitle: "Nettoyage appartement - 3 pièces"
    },
    {
      id: "3",
      providerId: "provider3",
      providerName: "Mohammed Idrissi",
      providerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      lastMessage: "Photos envoyées",
      lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours ago
      unreadCount: 0,
      isActive: false,
      missionStatus: 'completed',
      missionTitle: "Installation électrique - Bureau"
    }
  ]);

  // Données mockées des messages
  const [messages] = useState<{ [conversationId: string]: Message[] }>({
    "1": [
      {
        id: "1",
        senderId: "provider1",
        senderName: "Ahmed Benali",
        content: "Bonjour, j'ai bien reçu votre demande pour la réparation de plomberie",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: "2",
        senderId: "user",
        senderName: "Vous",
        content: "Merci, quand pouvez-vous passer ?",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: "3",
        senderId: "provider1",
        senderName: "Ahmed Benali",
        content: "Le devis sera prêt demain",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false
      }
    ]
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Ici on ajouterait la logique pour envoyer le message
      console.log("Envoi du message:", newMessage);
      setNewMessage("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulation d'upload de fichier
      console.log("Upload de fichiers:", files);
      // Ici on enverrait les fichiers à l'API /messages/upload
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulation d'upload d'images
      console.log("Upload d'images:", files);
      // Ici on enverrait les images à l'API /messages/upload
    }
  };

  const handleMenuAction = (action: string) => {
    console.log("Action du menu:", action);
    setShowMenu(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    return "À l'instant";
  };

  const filteredConversations = conversations.filter(conv =>
    conv.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.missionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeConversations = filteredConversations.filter(conv => conv.isActive);
  const completedConversations = filteredConversations.filter(conv => !conv.isActive);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)]">
        <div className="bg-white rounded-2xl shadow-lg h-full flex overflow-hidden">
          {/* Liste des conversations */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleMenuAction('search')}>
                      <Search className="w-4 h-4 mr-2" />
                      Recherche avancée
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuAction('archive')}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archiver les conversations
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres de messagerie
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
                />
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
              {/* Conversations actives */}
              {activeConversations.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    Missions en cours
                  </h3>
                  {activeConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        selectedConversation === conversation.id
                          ? 'bg-orange-50 border border-orange-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.providerAvatar || '/default-avatar.png'}
                            alt={conversation.providerName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {conversation.providerName}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {conversation.missionTitle}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Conversations terminées */}
              {completedConversations.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    Missions terminées
                  </h3>
                  {completedConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 opacity-60 ${
                        selectedConversation === conversation.id
                          ? 'bg-gray-100 border border-gray-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.providerAvatar || '/default-avatar.png'}
                            alt={conversation.providerName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {conversation.providerName}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {conversation.missionTitle}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header du chat */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversations.find(c => c.id === selectedConversation)?.providerAvatar || '/default-avatar.png'}
                        alt="Provider"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {conversations.find(c => c.id === selectedConversation)?.providerName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {conversations.find(c => c.id === selectedConversation)?.missionTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-2">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleMenuAction('download')}>
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger la conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction('block')}>
                            <Ban className="w-4 h-4 mr-2" />
                            Bloquer le prestataire
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMenuAction('report')}>
                            <Flag className="w-4 h-4 mr-2" />
                            Signaler un problème
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleMenuAction('delete')}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer la conversation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages[selectedConversation]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === 'user'
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'user' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      title="Joindre un fichier"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => imageInputRef.current?.click()}
                      title="Joindre une image"
                    >
                      <Image className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Prendre une photo"
                    >
                      <Camera className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-300"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1">
                        <Smile className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* État vide */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-gray-600">
                    Choisissez une conversation pour commencer à échanger
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}