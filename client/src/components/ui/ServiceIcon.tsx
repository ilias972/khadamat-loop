import React from 'react';

interface ServiceIconProps {
  serviceName: string;
  className?: string;
}

const iconMap: Record<string, string> = {
  // Services principaux (minuscules)
  'plomberie': './assets/icons/plumbing.svg',
  'electricite': './assets/icons/electricity.svg',
  'nettoyage': './assets/icons/cleaning.svg',
  'jardinage': './assets/icons/gardening.svg',
  'peinture': './assets/icons/painting.svg',
  'reparation': './assets/icons/repair.svg',
  'climatisation': './assets/icons/air-conditioning.svg',
  'securite': './assets/icons/security.svg',
  
  // Fallbacks pour les noms français (avec accents)
  'Plomberie': './assets/icons/plumbing.svg',
  'Électricité': './assets/icons/electricity.svg',
  'Nettoyage': './assets/icons/cleaning.svg',
  'Jardinage': './assets/icons/gardening.svg',
  'Peinture': './assets/icons/painting.svg',
  'Réparation': './assets/icons/repair.svg',
  'Climatisation': './assets/icons/air-conditioning.svg',
  'Sécurité': './assets/icons/security.svg',
  
  // Services supplémentaires
  'menage': './assets/icons/cleaning.svg',
  'Ménage': './assets/icons/cleaning.svg',
  'maçonnerie': './assets/icons/gardening.svg',
  'Maçonnerie': './assets/icons/gardening.svg',
  'menuiserie': './assets/icons/repair.svg',
  'Menuiserie': './assets/icons/repair.svg',
  'serrurerie': './assets/icons/security.svg',
  'Serrurerie': './assets/icons/security.svg',
  
  // Correspondances supplémentaires pour les catégories
  'plumbing': './assets/icons/plumbing.svg',
  'electricity': './assets/icons/electricity.svg',
  'cleaning': './assets/icons/cleaning.svg',
  'gardening': './assets/icons/gardening.svg',
  'painting': './assets/icons/painting.svg',
  'repair': './assets/icons/repair.svg',
  'air-conditioning': './assets/icons/air-conditioning.svg',
  'security': './assets/icons/security.svg',
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