import React from 'react';

interface ServiceIconProps {
  serviceName: string;
  className?: string;
}

const iconMap: Record<string, string> = {
  // Services principaux (minuscules)
  'plomberie': '/icons/plumbing.svg',
  'electricite': '/icons/electricity.svg',
  'nettoyage': '/icons/cleaning.svg',
  'jardinage': '/icons/gardening.svg',
  'peinture': '/icons/painting.svg',
  'reparation': '/icons/repair.svg',
  'climatisation': '/icons/air-conditioning.svg',
  'securite': '/icons/security.svg',
  
  // Fallbacks pour les noms français (avec accents)
  'Plomberie': '/icons/plumbing.svg',
  'Électricité': '/icons/electricity.svg',
  'Nettoyage': '/icons/cleaning.svg',
  'Jardinage': '/icons/gardening.svg',
  'Peinture': '/icons/painting.svg',
  'Réparation': '/icons/repair.svg',
  'Climatisation': '/icons/air-conditioning.svg',
  'Sécurité': '/icons/security.svg',
  
  // Services supplémentaires
  'menage': '/icons/cleaning.svg',
  'Ménage': '/icons/cleaning.svg',
  'maçonnerie': '/icons/gardening.svg',
  'Maçonnerie': '/icons/gardening.svg',
  'menuiserie': '/icons/repair.svg',
  'Menuiserie': '/icons/repair.svg',
  'serrurerie': '/icons/security.svg',
  'Serrurerie': '/icons/security.svg',
  
  // Correspondances supplémentaires pour les catégories
  'plumbing': '/icons/plumbing.svg',
  'electricity': '/icons/electricity.svg',
  'cleaning': '/icons/cleaning.svg',
  'gardening': '/icons/gardening.svg',
  'painting': '/icons/painting.svg',
  'repair': '/icons/repair.svg',
  'air-conditioning': '/icons/air-conditioning.svg',
  'security': '/icons/security.svg',
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