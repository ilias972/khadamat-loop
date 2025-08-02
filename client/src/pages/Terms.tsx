import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Conditions d'Utilisation
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Objet</h2>
              <p className="text-gray-600 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Khadamat, 
                service de mise en relation entre clients et prestataires de services professionnels au Maroc.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Définitions</h2>
              <ul className="text-gray-600 space-y-2">
                <li><strong>Plateforme :</strong> Le site web et l'application mobile Khadamat</li>
                <li><strong>Utilisateur :</strong> Toute personne utilisant la plateforme</li>
                <li><strong>Client :</strong> Utilisateur recherchant un service</li>
                <li><strong>Prestataire :</strong> Professionnel proposant ses services</li>
                <li><strong>Club Pro :</strong> Programme de vérification premium pour prestataires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Inscription et Comptes</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                L'inscription sur Khadamat est gratuite pour les clients. Les prestataires peuvent s'inscrire 
                gratuitement ou choisir l'abonnement Club Pro pour des fonctionnalités premium.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Chaque utilisateur s'engage à fournir des informations exactes et à maintenir 
                la confidentialité de ses identifiants de connexion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Services Proposés</h2>
              <p className="text-gray-600 leading-relaxed">
                Khadamat met à disposition une plateforme de mise en relation. Nous ne sommes pas prestataires 
                de services et n'intervenons pas dans l'exécution des prestations convenues entre clients et prestataires.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Responsabilités</h2>
              <p className="text-gray-600 leading-relaxed">
                Les utilisateurs sont seuls responsables de leurs interactions sur la plateforme. 
                Khadamat décline toute responsabilité concernant la qualité des services fournis 
                ou les litiges entre clients et prestataires.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Paiements</h2>
              <p className="text-gray-600 leading-relaxed">
                Les transactions financières s'effectuent directement entre clients et prestataires. 
                Khadamat peut percevoir des commissions sur les transactions réalisées via la plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Propriété Intellectuelle</h2>
              <p className="text-gray-600 leading-relaxed">
                Tous les éléments de la plateforme Khadamat (marques, logos, contenus) sont protégés 
                par les droits de propriété intellectuelle et demeurent la propriété exclusive de Khadamat.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Modification des CGU</h2>
              <p className="text-gray-600 leading-relaxed">
                Khadamat se réserve le droit de modifier les présentes CGU à tout moment. 
                Les utilisateurs seront informés des modifications par notification sur la plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant ces conditions d'utilisation, 
                contactez-nous à : <a href="mailto:legal@khadamat.ma" className="text-orange-500">legal@khadamat.ma</a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
            Dernière mise à jour : 24 janvier 2025
          </div>
        </div>
      </div>
    </div>
  );
}