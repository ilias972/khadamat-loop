import React from 'react';

interface ServiceIconProps {
  serviceName: string;
  className?: string;
}

const iconMap: Record<string, string> = {
  'plomberie': '/src/assets/icons/plumbing.svg',
  'electricite': '/src/assets/icons/electricity.svg',
  'nettoyage': '/src/assets/icons/cleaning.svg',
  'jardinage': '/src/assets/icons/gardening.svg',
  'peinture': '/src/assets/icons/painting.svg',
  'reparation': '/src/assets/icons/repair.svg',
  'climatisation': '/src/assets/icons/air-conditioning.svg',
  'securite': '/src/assets/icons/security.svg',
  // Fallbacks pour les noms en français
  'Plomberie': '/src/assets/icons/plumbing.svg',
  'Électricité': '/src/assets/icons/electricity.svg',
  'Nettoyage': '/src/assets/icons/cleaning.svg',
  'Jardinage': '/src/assets/icons/gardening.svg',
  'Peinture': '/src/assets/icons/painting.svg',
  'Réparation': '/src/assets/icons/repair.svg',
  'Climatisation': '/src/assets/icons/air-conditioning.svg',
  'Sécurité': '/src/assets/icons/security.svg',
};

export default function ServiceIcon({ serviceName, className = "w-8 h-8" }: ServiceIconProps) {
  const iconPath = iconMap[serviceName.toLowerCase()] || iconMap[serviceName];
  
  if (iconPath) {
    return (
      <img 
        src={iconPath} 
        alt={`Icône ${serviceName}`}
        className={className}
        onError={(e) => {
          // Fallback vers une icône par défaut si l'image ne charge pas
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    );
  }
  
  // Fallback vers une icône par défaut
  return (
    <div className={`${className} bg-orange-500 rounded-lg flex items-center justify-center text-white`}>
      <span className="text-xs font-bold">?</span>
    </div>
  );
} 