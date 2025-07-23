import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const isArabic = language === "ar";
  
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium transition-colors ${!isArabic ? 'text-orange-500' : 'text-gray-400'}`}>
        FR
      </span>
      
      <button 
        onClick={toggleLanguage}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${
          isArabic ? 'bg-orange-500' : 'bg-gray-300'
        }`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
          isArabic ? 'left-0.5' : 'right-0.5'
        }`} />
      </button>
      
      <span className={`text-sm font-medium transition-colors ${isArabic ? 'text-orange-500' : 'text-gray-400'}`}>
        AR
      </span>
    </div>
  );
}