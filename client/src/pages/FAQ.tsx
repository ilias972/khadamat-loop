import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const { t } = useLanguage();
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: "Comment puis-je trouver un prestataire de confiance ?",
      answer: "Tous nos prestataires sont vérifiés. Consultez leurs profils, leurs avis clients et leur statut Club Pro pour faire le meilleur choix."
    },
    {
      question: "Que signifie le badge Club Pro ?",
      answer: "Le badge Club Pro garantit que le prestataire a été vérifié : documents professionnels, assurance, et reconnaissance faciale validés."
    },
    {
      question: "Comment publier un projet ?",
      answer: "Cliquez sur 'Publier un projet', décrivez vos besoins, votre budget et votre localisation. Les prestataires vous contacteront avec leurs propositions."
    },
    {
      question: "Les paiements sont-ils sécurisés ?",
      answer: "Oui, tous les paiements sont sécurisés et protégés. Nous utilisons les dernières technologies de chiffrement."
    },
    {
      question: "Comment contacter le support ?",
      answer: "Vous pouvez nous contacter via la page Contact ou utiliser le chat en ligne disponible 24/7."
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Foire Aux Questions
          </h1>
          <p className="text-xl text-gray-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
              >
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                {openQuestion === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {openQuestion === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}