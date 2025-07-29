import { Clock, Award, CheckCircle } from "lucide-react";

interface StatsSectionProps {
  missionsCompleted: number;
  experience: number;
  responseTime: string;
  isVerified?: boolean;
  isPro?: boolean;
}

export default function StatsSection({
  missionsCompleted,
  experience,
  responseTime,
  isVerified = false,
  isPro = false
}: StatsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques</h2>
      
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {isVerified && (
          <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Vérifié</span>
          </div>
        )}
        {isPro && (
          <div className="flex items-center space-x-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
            <Award className="w-4 h-4" />
            <span>Pro</span>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-500 mb-1">
            {missionsCompleted}
          </div>
          <div className="text-sm text-gray-600">Missions réalisées</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-500 mb-1">
            {experience} ans
          </div>
          <div className="text-sm text-gray-600">Expérience</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-500 mb-1 flex items-center justify-center">
            <Clock className="w-5 h-5 mr-1" />
            {responseTime}
          </div>
          <div className="text-sm text-gray-600">Temps de réponse</div>
        </div>
      </div>
    </div>
  );
} 