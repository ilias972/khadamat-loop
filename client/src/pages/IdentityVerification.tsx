import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  IdCard, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  FileText,
  Eye,
  Lock,
  Scale
} from "lucide-react";
import { Link } from "wouter";

export default function IdentityVerification() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 px-4 mt-[54px] mb-[54px]">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mt-[4px] mb-[4px]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <IdCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vérification d'identité obligatoire
          </h1>
          <p className="text-gray-600">
            Pourquoi nous demandons une pièce d'identité marocaine
          </p>
        </div>

        {/* Alerte réglementaire */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <Scale className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Obligation légale :</strong> Conformément à la directive Bank Al Maghrib n°G/2021/02 
            et à la loi 05-20 relative à la cybersécurité, tous les prestataires de services numériques 
            au Maroc doivent vérifier l'identité de leurs utilisateurs.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pourquoi cette obligation */}
          <Card className="glassmorphism shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-500" />
                Pourquoi cette vérification ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Protection contre la fraude</h4>
                    <p className="text-sm text-gray-600">
                      Éviter l'usurpation d'identité et les comptes frauduleux
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Sécurité des transactions</h4>
                    <p className="text-sm text-gray-600">
                      Garantir la sécurité des paiements et des échanges financiers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Conformité réglementaire</h4>
                    <p className="text-sm text-gray-600">
                      Respect des lois marocaines sur les services numériques
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Transparence du marché</h4>
                    <p className="text-sm text-gray-600">
                      Assurer la confiance entre clients et prestataires
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents acceptés */}
          <Card className="glassmorphism shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Documents acceptés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Carte nationale */}
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-800">Carte nationale marocaine</h4>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    Document d'identité officiel délivré par les autorités marocaines
                  </p>
                  <div className="text-xs text-green-600">
                    <strong>Format :</strong> A123456 ou AB123456<br/>
                    <strong>Exemples :</strong> A789123, BC456789
                  </div>
                </div>

                {/* Passeport */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Passeport marocain</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Passeport biométrique délivré par le Royaume du Maroc
                  </p>
                  <div className="text-xs text-blue-600">
                    <strong>Format :</strong> AB123456 (2 lettres + 6 chiffres)<br/>
                    <strong>Exemples :</strong> MA789123, AB456789
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité des données */}
          <Card className="glassmorphism shadow-xl border-0 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                Protection de vos données personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Chiffrement AES-256</h4>
                  <p className="text-sm text-gray-600">
                    Vos données d'identité sont chiffrées avec le standard militaire
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Accès limité</h4>
                  <p className="text-sm text-gray-600">
                    Seuls les agents autorisés peuvent accéder à vos informations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Conformité RGPD</h4>
                  <p className="text-sm text-gray-600">
                    Respect des normes internationales de protection des données
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Références légales */}
          <Card className="glassmorphism shadow-xl border-0 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-500" />
                Cadre légal et réglementaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Bank Al Maghrib</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Directive G/2021/02 sur la lutte contre le blanchiment d'argent
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Article 4 - KYC obligatoire
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Loi 05-20</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Cybersécurité et protection des systèmes d'information
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Chapitre III - Identification
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">CNDP</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Commission Nationale de Protection des Données
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Loi 09-08 modifiée
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">ANRT</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Régulation des services de communication électronique
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Décision ANRT/DG/2021
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center mt-8 space-y-4">
          <Link href="/register">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              Continuer l'inscription
            </Button>
          </Link>
          
          <div className="text-sm text-gray-600">
            <p>Des questions ? Contactez notre support au +212 5XX-XXXXXX</p>
            <p>ou consultez notre <Link href="/faq" className="text-orange-600 hover:underline">FAQ</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}