import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MessageCircle, Phone, Mail, Book, FileText } from "lucide-react";
import { Link } from "wouter";

export default function Help() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Centre d'Aide
          </h1>
          <p className="text-xl text-gray-600">
            Comment pouvons-nous vous aider aujourd'hui ?
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Catégories d'aide */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/faq">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">FAQ</h3>
              <p className="text-gray-600">Questions fréquemment posées</p>
            </div>
          </Link>

          <Link href="/contact">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat Support</h3>
              <p className="text-gray-600">Assistance en temps réel</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Book className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Guides</h3>
            <p className="text-gray-600">Tutoriels et guides d'utilisation</p>
          </div>
        </div>

        {/* Contact rapide */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Besoin d'aide personnalisée ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Appelez-nous</h3>
              <p className="text-gray-600 mb-4">Lun-Ven 9h-18h</p>
              <a href="tel:+212522000000" className="text-orange-500 font-semibold">
                +212 522 00 00 00
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Écrivez-nous</h3>
              <p className="text-gray-600 mb-4">Réponse sous 24h</p>
              <a href="mailto:support@khadamat.ma" className="text-orange-500 font-semibold">
                support@khadamat.ma
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}