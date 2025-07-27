import React from 'react';

interface ServiceIconProps {
  serviceName: string;
  className?: string;
}

const iconMap: Record<string, string> = {
  // Services principaux (minuscules) - pour la page d'accueil
  'plomberie': '/icons/plumbing.svg',
  'electricite': '/icons/electricity.svg',
  'nettoyage': '/icons/cleaning.svg',
  'jardinage': '/icons/gardening.svg',
  'peinture': '/icons/painting.svg',
  'reparation': '/icons/repair.svg',
  'climatisation': '/icons/air-conditioning.svg',
  'securite': '/icons/security.svg',
  
  // Noms français avec majuscules - pour la page Services
  'Plomberie': '/icons/plumbing.svg',
  'Électricité': '/icons/electricity.svg',
  'Nettoyage': '/icons/cleaning.svg',
  'Jardinage': '/icons/gardening.svg',
  'Peinture': '/icons/painting.svg',
  'Réparation': '/icons/repair.svg',
  'Climatisation': '/icons/air-conditioning.svg',
  'Sécurité': '/icons/security.svg',
  
  // Catégories (pour ServiceCard)
  'plumbing': '/icons/plumbing.svg',
  'electricity': '/icons/electricity.svg',
  'cleaning': '/icons/cleaning.svg',
  'gardening': '/icons/gardening.svg',
  'painting': '/icons/painting.svg',
  'repair': '/icons/repair.svg',
  'air-conditioning': '/icons/air-conditioning.svg',
  'security': '/icons/security.svg',
  
  // Fallbacks supplémentaires
  'menage': '/icons/cleaning.svg',
  'Ménage': '/icons/cleaning.svg',
  'maçonnerie': '/icons/gardening.svg',
  'Maçonnerie': '/icons/gardening.svg',
  'menuiserie': '/icons/repair.svg',
  'Menuiserie': '/icons/repair.svg',
  'serrurerie': '/icons/security.svg',
  'Serrurerie': '/icons/security.svg',
};

export default function ServiceIcon({ serviceName, className = "w-8 h-8" }: ServiceIconProps) {
  const iconPath = iconMap[serviceName.toLowerCase()] || iconMap[serviceName];
  
  // Debug temporaire
  console.log('ServiceIcon Debug:', { 
    serviceName, 
    iconPath, 
    availableKeys: Object.keys(iconMap),
    lowerCaseMatch: iconMap[serviceName.toLowerCase()],
    exactMatch: iconMap[serviceName]
  });
  
  if (iconPath) {
    return (
      <img 
        src={iconPath} 
        alt={`Icône ${serviceName}`}
        className={className}
        onError={(e) => {
          console.error('Erreur de chargement de l\'icône:', iconPath, 'pour service:', serviceName);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
        onLoad={() => {
          console.log('Icône chargée avec succès:', iconPath, 'pour service:', serviceName);
        }}
      />
    );
  }
  
  // Fallback vers une icône par défaut
  console.warn('Aucune icône trouvée pour:', serviceName);
  return (
    <div className={`${className} bg-orange-500 rounded-lg flex items-center justify-center text-white`}>
      <span className="text-xs font-bold">?</span>
    </div>
  );
} 