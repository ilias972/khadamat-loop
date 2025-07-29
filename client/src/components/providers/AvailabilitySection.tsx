import { Calendar, Clock } from "lucide-react";

interface Availability {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface AvailabilitySectionProps {
  availability: Availability;
}

const dayNames = {
  monday: "Lundi",
  tuesday: "Mardi", 
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche"
};

export default function AvailabilitySection({ availability }: AvailabilitySectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-orange-500" />
        <h3 className="text-xl font-bold text-gray-900">Disponibilités</h3>
      </div>
      
      <div className="space-y-3">
        {Object.entries(availability).map(([day, slots]) => (
          <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                {dayNames[day as keyof typeof dayNames]}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {slots.length > 0 ? (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {slots.join(", ")}
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  Indisponible
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <p className="text-sm text-orange-700">
          <strong>Note :</strong> Les disponibilités peuvent varier selon les réservations existantes. 
          Contactez le prestataire pour confirmer un créneau spécifique.
        </p>
      </div>
    </div>
  );
} 