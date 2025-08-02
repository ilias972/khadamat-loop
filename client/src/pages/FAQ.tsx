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
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Foire Aux Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                {openQuestion === index ? (
                  <ChevronUp className="w-6 h-6 text-orange-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>
              {openQuestion === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}