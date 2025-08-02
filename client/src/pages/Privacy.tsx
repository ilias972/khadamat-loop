import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Politique de Confidentialité
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Collecte des Données</h2>
              <p className="text-gray-600 leading-relaxed">
                Khadamat collecte les données personnelles nécessaires au fonctionnement de la plateforme :
              </p>
              <ul className="text-gray-600 space-y-2 mt-4">
                <li>• Informations d'inscription (nom, email, téléphone)</li>
                <li>• Données de localisation pour la recherche de services</li>
                <li>• Historique des interactions sur la plateforme</li>
                <li>• Documents de vérification pour les prestataires Club Pro</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Utilisation des Données</h2>
              <p className="text-gray-600 leading-relaxed">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="text-gray-600 space-y-2 mt-4">
                <li>• Faciliter la mise en relation entre clients et prestataires</li>
                <li>• Améliorer nos services et personnaliser votre expérience</li>
                <li>• Assurer la sécurité et prévenir les fraudes</li>
                <li>• Vous envoyer des communications importantes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Partage des Données</h2>
              <p className="text-gray-600 leading-relaxed">
                Khadamat ne vend jamais vos données personnelles. Nous pouvons partager certaines 
                informations uniquement dans les cas suivants :
              </p>
              <ul className="text-gray-600 space-y-2 mt-4">
                <li>• Avec votre consentement explicite</li>
                <li>• Pour faciliter la prestation de services demandés</li>
                <li>• Avec nos partenaires techniques (hébergement, paiement)</li>
                <li>• Si requis par la loi ou les autorités compétentes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Sécurité des Données</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
                appropriées pour protéger vos données contre l'accès non autorisé, la perte, 
                la destruction ou la divulgation accidentelle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Vos Droits</h2>
              <p className="text-gray-600 leading-relaxed">
                Conformément à la loi marocaine sur la protection des données personnelles, vous disposez des droits suivants :
              </p>
              <ul className="text-gray-600 space-y-2 mt-4">
                <li>• Droit d'accès à vos données personnelles</li>
                <li>• Droit de rectification et de mise à jour</li>
                <li>• Droit d'effacement de vos données</li>
                <li>• Droit de limitation du traitement</li>
                <li>• Droit à la portabilité des données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela 
                peut affecter certaines fonctionnalités du site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Conservation des Données</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous conservons vos données personnelles uniquement pendant la durée nécessaire 
                aux finalités pour lesquelles elles ont été collectées, ou selon les exigences légales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour exercer vos droits ou pour toute question concernant cette politique de confidentialité, 
                contactez notre délégué à la protection des données : 
                <a href="mailto:privacy@khadamat.ma" className="text-orange-500"> privacy@khadamat.ma</a>
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