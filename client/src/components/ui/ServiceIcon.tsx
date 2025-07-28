import React from 'react';

interface ServiceIconProps {
  serviceName: string;
  className?: string;
}

// Icônes SVG inline - Correspondant exactement à l'image fournie
const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  // Plomberie - Design exact correspondant à l'image fournie
  'plomberie': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Robinet principal - forme stylisée */}
      <path d="M8 6 L8 10 L6 12 L6 14 L8 16 L8 18 L10 18 L10 16 L12 14 L12 12 L10 10 L10 6 Z" fill="#60A5FA" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Base du robinet */}
      <rect x="6" y="4" width="8" height="4" rx="2" fill="#60A5FA" stroke="#374151" strokeWidth="1.5"/>
      {/* Goutte d'eau principale - plus grande et plus stylisée */}
      <path d="M14 16 C14 17.5 15.5 19 17 19 C18.5 19 20 17.5 20 16 C20 14.5 18.5 13 17 13 C15.5 13 14 14.5 14 16 Z" fill="#38BDF8" stroke="#374151" strokeWidth="1.5"/>
      {/* Goutte d'eau secondaire - plus petite */}
      <path d="M12 14 C12 15.5 13.5 17 15 17 C16.5 17 18 15.5 18 14 C18 12.5 16.5 11 15 11 C13.5 11 12 12.5 12 14 Z" fill="none" stroke="#374151" strokeWidth="1.5"/>
    </svg>
  ),
  
  // Électricité - Design moderne avec clé, tournevis et éclair
  'electricite': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clé à molette */}
      <path d="M6 12 L10 8 L14 12 L12 16 L8 12 Z" fill="#6B7280" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10" y="8" width="4" height="4" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="1.5"/>
      <rect x="11" y="9" width="2" height="2" rx="1" fill="#4B5563"/>
      {/* Tournevis */}
      <path d="M16 8 L18 10 L16 12 L14 10 Z" fill="#6B7280" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="17" y="9" width="2" height="6" rx="1" fill="#FBBF24" stroke="#374151" strokeWidth="1.5"/>
      <rect x="16" y="10" width="4" height="1" rx="0.5" fill="#374151"/>
      <rect x="16" y="12" width="4" height="1" rx="0.5" fill="#374151"/>
      <rect x="16" y="14" width="4" height="1" rx="0.5" fill="#374151"/>
      {/* Éclair jaune */}
      <path d="M13 6 L11 12 L15 10 L13 18 L17 12 L15 14 Z" fill="#FBBF24" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  // Nettoyage - Pelle grise avec manche marron, terre et feuilles
  'nettoyage': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pelle */}
      <path d="M8 8 L12 4 L16 8 L14 12 L10 12 Z" fill="#9CA3AF" stroke="#374151" strokeWidth="1"/>
      {/* Manche */}
      <rect x="11" y="8" width="2" height="6" rx="1" fill="#8B5A2B" stroke="#374151" strokeWidth="1"/>
      {/* Terre */}
      <ellipse cx="12" cy="16" rx="4" ry="2" fill="#8B5A2B" stroke="#374151" strokeWidth="1"/>
      {/* Feuilles vertes */}
      <path d="M14 14 L15 12 L16 14 L15 16 Z" fill="#22C55E" stroke="#374151" strokeWidth="1"/>
      <path d="M10 14 L11 12 L12 14 L11 16 Z" fill="#22C55E" stroke="#374151" strokeWidth="1"/>
    </svg>
  ),
  
  // Jardinage - Terre marron avec pousses vertes
  'jardinage': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Terre */}
      <ellipse cx="12" cy="16" rx="5" ry="3" fill="#8B5A2B" stroke="#374151" strokeWidth="1"/>
      {/* Pousses vertes */}
      <path d="M10 14 L11 12 L12 14 L11 16 Z" fill="#22C55E" stroke="#374151" strokeWidth="1"/>
      <path d="M12 14 L13 12 L14 14 L13 16 Z" fill="#22C55E" stroke="#374151" strokeWidth="1"/>
    </svg>
  ),
  
  // Peinture - Pinceau avec manche marron et poils jaunes + gouttes rouges
  'peinture': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Manche du pinceau */}
      <rect x="8" y="6" width="2" height="8" rx="1" fill="#8B5A2B" stroke="#374151" strokeWidth="1"/>
      {/* Poils du pinceau */}
      <path d="M6 6 L10 2 L14 6 L12 10 L8 10 Z" fill="#FBBF24" stroke="#374151" strokeWidth="1"/>
      {/* Gouttes de peinture rouges */}
      <path d="M14 16 L12 20 L16 20 Z" fill="#EF4444" stroke="#374151" strokeWidth="1"/>
      <path d="M16 18 L14 22 L18 22 Z" fill="#EF4444" stroke="#374151" strokeWidth="1"/>
    </svg>
  ),
  
  // Réparation - Clé et tournevis croisés (sans éclair)
  'reparation': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clé */}
      <path d="M6 12 L10 8 L14 12 L12 16 L8 12 Z" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <rect x="10" y="8" width="4" height="4" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <rect x="11" y="9" width="2" height="2" rx="1" fill="#4B5563"/>
      {/* Tournevis */}
      <path d="M16 8 L18 10 L16 12 L14 10 Z" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <rect x="17" y="9" width="2" height="6" rx="1" fill="#FBBF24" stroke="#374151" strokeWidth="1"/>
      <rect x="16" y="10" width="4" height="1" rx="0.5" fill="#374151"/>
      <rect x="16" y="12" width="4" height="1" rx="0.5" fill="#374151"/>
      <rect x="16" y="14" width="4" height="1" rx="0.5" fill="#374151"/>
    </svg>
  ),
  
  // Climatisation - Unité bleue avec lignes ondulées et goutte
  'climatisation': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Unité de climatisation */}
      <rect x="4" y="8" width="12" height="6" rx="1" fill="#60A5FA" stroke="#374151" strokeWidth="1"/>
      <rect x="5" y="9" width="10" height="4" rx="0.5" fill="#93C5FD"/>
      {/* Lignes ondulées */}
      <path d="M6 16 L8 18 L6 20" stroke="#6B7280" strokeWidth="1" strokeLinecap="round"/>
      <path d="M8 16 L10 18 L8 20" stroke="#6B7280" strokeWidth="1" strokeLinecap="round"/>
      <path d="M10 16 L12 18 L10 20" stroke="#6B7280" strokeWidth="1" strokeLinecap="round"/>
      {/* Goutte d'eau */}
      <path d="M16 18 L16 20 L18 19 Z" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
    </svg>
  ),
  
  // Sécurité - Bouclier jaune avec cadenas gris
  'securite': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bouclier */}
      <path d="M12 2 L16 4 L16 8 L12 10 L8 8 L8 4 Z" fill="#FBBF24" stroke="#374151" strokeWidth="1"/>
      {/* Cadenas */}
      <rect x="9" y="6" width="6" height="8" rx="1" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <rect x="10" y="7" width="4" height="6" rx="0.5" fill="#4B5563"/>
      <circle cx="12" cy="10" r="1" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <path d="M11 11 L12 12 L13 11" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Mappings pour les noms avec majuscules
const iconMap: Record<string, string> = {
  // Services principaux (minuscules) - pour la page d'accueil
  'plomberie': 'plomberie',
  'electricite': 'electricite',
  'nettoyage': 'nettoyage',
  'jardinage': 'jardinage',
  'peinture': 'peinture',
  'reparation': 'reparation',
  'climatisation': 'climatisation',
  'securite': 'securite',
  
  // Noms français avec majuscules - pour la page Services
  'Plomberie': 'plomberie',
  'Électricité': 'electricite',
  'Nettoyage': 'nettoyage',
  'Jardinage': 'jardinage',
  'Peinture': 'peinture',
  'Réparation': 'reparation',
  'Climatisation': 'climatisation',
  'Sécurité': 'securite',
  
  // Catégories (pour ServiceCard)
  'plumbing': 'plomberie',
  'electricity': 'electricite',
  'cleaning': 'nettoyage',
  'gardening': 'jardinage',
  'painting': 'peinture',
  'repair': 'reparation',
  'air-conditioning': 'climatisation',
  'security': 'securite',
  
  // Fallbacks supplémentaires
  'menage': 'nettoyage',
  'Ménage': 'nettoyage',
  'maçonnerie': 'jardinage',
  'Maçonnerie': 'jardinage',
  'menuiserie': 'reparation',
  'Menuiserie': 'reparation',
  'serrurerie': 'securite',
  'Serrurerie': 'securite',
};

export default function ServiceIcon({ serviceName, className = "w-12 h-12" }: ServiceIconProps) {
  const iconKey = iconMap[serviceName.toLowerCase()] || iconMap[serviceName];
  
  if (iconKey && iconComponents[iconKey]) {
    const IconComponent = iconComponents[iconKey];
    return <IconComponent className={className} />;
  }
  
  // Fallback vers une icône par défaut
  return (
    <div className={`${className} bg-orange-500 rounded-lg flex items-center justify-center text-white`}>
      <span className="text-xs font-bold">?</span>
    </div>
  );
} 