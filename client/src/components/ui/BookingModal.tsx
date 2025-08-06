import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, X, Check } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  onConfirm: (date: string, description: string) => void;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  providerName, 
  onConfirm 
}: BookingModalProps) {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState("");
  const [description, setDescription] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Ajouter les jours vides du début
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Ajouter tous les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Vérifier si une date est dans le passé
  const isDateInPast = (date: Date | null | undefined) => {
    if (!date) return true; // Considérer les dates nulles comme dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Formater la date pour l'affichage
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString(t("common.language") === "ar" ? "ar-MA" : "fr-FR", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formater la date pour l'input
  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Changer de mois
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleConfirm = () => {
    if (selectedDate && description.trim()) {
      onConfirm(selectedDate, description.trim());
      onClose();
      setSelectedDate("");
      setDescription("");
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {t("booking.title")} {providerName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Calendrier */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 rotate-45" />
              </button>
              <h3 className="font-semibold text-gray-900">
                {currentMonth.toLocaleDateString(t("common.language") === "ar" ? "ar-MA" : "fr-FR", {
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <button
                onClick={() => changeMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 -rotate-45" />
              </button>
            </div>
            
            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grille des jours */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                                 <button
                   key={index}
                   onClick={() => day && !isDateInPast(day) && setSelectedDate(formatDateForInput(day))}
                   disabled={!day || isDateInPast(day)}
                   className={`
                     p-2 text-sm rounded-lg transition-colors
                     ${!day ? 'invisible' : ''}
                     ${isDateInPast(day) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-orange-50 cursor-pointer'}
                     ${selectedDate === formatDateForInput(day) ? 'bg-orange-500 text-white' : 'text-gray-700'}
                   `}
                 >
                   {day?.getDate() || ''}
                 </button>
              ))}
            </div>
          </div>

          {/* Date sélectionnée */}
          {selectedDate && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  {selectedDate ? formatDate(new Date(selectedDate)) : ''}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("booking.description_label")}
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("booking.description_placeholder")}
              className="w-full min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          {/* Boutons */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !description.trim()}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Check className="w-4 h-4 mr-2" />
              {t("booking.confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 