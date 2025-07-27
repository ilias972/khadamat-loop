import React from 'react';

interface ServiceIconProps {
  serviceName: string;
  className?: string;
}

// Icônes SVG inline
const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  // Plomberie
  'plomberie': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="16" y="32" width="20" height="16" rx="2" fill="#D1D5DB" stroke="#374151" strokeWidth="1.5"/>
      <rect x="18" y="34" width="16" height="12" rx="1" fill="#F3F4F6" stroke="#374151" strokeWidth="1"/>
      <ellipse cx="26" cy="40" rx="6" ry="3" fill="#374151" stroke="#374151" strokeWidth="1"/>
      <ellipse cx="26" cy="40" rx="4" ry="2" fill="#1F2937"/>
      <rect x="40" y="20" width="12" height="16" rx="2" fill="#60A5FA" stroke="#374151" strokeWidth="1.5"/>
      <line x1="42" y1="24" x2="50" y2="32" stroke="white" strokeWidth="1.5"/>
      <line x1="42" y1="32" x2="50" y2="24" stroke="white" strokeWidth="1.5"/>
      <circle cx="44" cy="26" r="1" fill="white"/>
      <circle cx="48" cy="30" r="0.8" fill="white"/>
      <circle cx="46" cy="34" r="0.6" fill="white"/>
    </svg>
  ),
  
  // Électricité
  'electricite': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <path d="M20 44 L28 36 L32 40 L24 48 L20 44 Z" fill="#6B7280" stroke="#374151" strokeWidth="1.5"/>
      <rect x="28" y="36" width="8" height="8" rx="4" fill="#6B7280" stroke="#374151" strokeWidth="1.5"/>
      <rect x="30" y="38" width="4" height="4" rx="2" fill="#4B5563"/>
      <path d="M32 20 L28 32 L36 28 L32 44 L36 32 L28 36 Z" fill="#FBBF24" stroke="#374151" strokeWidth="1"/>
      <path d="M30 22 L26 34 L34 30 L30 42 L34 30 L26 34 Z" fill="#F59E0B"/>
    </svg>
  ),
  
  // Nettoyage
  'nettoyage': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <ellipse cx="32" cy="40" rx="12" ry="8" fill="#EF4444" stroke="#374151" strokeWidth="1.5"/>
      <ellipse cx="32" cy="40" rx="10" ry="6" fill="#DC2626"/>
      <rect x="28" y="32" width="8" height="8" rx="4" fill="#EF4444" stroke="#374151" strokeWidth="1.5"/>
      <rect x="20" y="20" width="16" height="12" rx="2" fill="#F59E0B" stroke="#374151" strokeWidth="1"/>
      <rect x="22" y="22" width="12" height="8" rx="1" fill="#FBBF24"/>
      <circle cx="44" cy="24" r="1" fill="#60A5FA"/>
      <circle cx="48" cy="28" r="0.8" fill="#60A5FA"/>
      <circle cx="46" cy="32" r="0.6" fill="#60A5FA"/>
      <circle cx="42" cy="36" r="0.7" fill="#60A5FA"/>
    </svg>
  ),
  
  // Jardinage
  'jardinage': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <ellipse cx="32" cy="40" rx="10" ry="6" fill="#D97706" stroke="#374151" strokeWidth="1.5"/>
      <ellipse cx="32" cy="40" rx="8" ry="4" fill="#F59E0B"/>
      <rect x="28" y="34" width="8" height="6" rx="4" fill="#D97706" stroke="#374151" strokeWidth="1.5"/>
      <rect x="20" y="20" width="4" height="16" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <path d="M18 20 L26 20 L24 24 L20 24 Z" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <rect x="40" y="32" width="12" height="6" fill="#8B5CF6" stroke="#374151" strokeWidth="1"/>
      <rect x="42" y="38" width="8" height="4" fill="#A78BFA" stroke="#374151" strokeWidth="1"/>
      <rect x="44" y="42" width="4" height="3" fill="#C4B5FD" stroke="#374151" strokeWidth="1"/>
    </svg>
  ),
  
  // Peinture
  'peinture': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="24" y="28" width="16" height="12" rx="2" fill="#FBBF24" stroke="#374151" strokeWidth="1.5"/>
      <rect x="26" y="30" width="12" height="8" rx="1" fill="#F59E0B"/>
      <rect x="30" y="26" width="4" height="4" rx="2" fill="#FBBF24" stroke="#374151" strokeWidth="1"/>
      <path d="M32 40 L30 44 L34 44 Z" fill="#EF4444" stroke="#374151" strokeWidth="1"/>
      <path d="M30 44 L28 48 L32 48 Z" fill="#EF4444" stroke="#374151" strokeWidth="1"/>
      <rect x="40" y="20" width="6" height="16" rx="3" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <rect x="42" y="18" width="2" height="4" rx="1" fill="#4B5563"/>
      <rect x="41" y="22" width="4" height="12" rx="2" fill="#D1D5DB" stroke="#374151" strokeWidth="1"/>
    </svg>
  ),
  
  // Réparation
  'reparation': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="20" y="32" width="24" height="16" rx="2" fill="#8B5CF6" stroke="#374151" strokeWidth="1.5"/>
      <rect x="22" y="34" width="20" height="12" rx="1" fill="#A78BFA"/>
      <rect x="24" y="36" width="16" height="8" rx="1" fill="#C4B5FD"/>
      <rect x="28" y="30" width="8" height="4" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
      <rect x="26" y="38" width="12" height="2" rx="1" fill="#374151"/>
      <rect x="26" y="42" width="8" height="2" rx="1" fill="#374151"/>
      <rect x="26" y="46" width="10" height="2" rx="1" fill="#374151"/>
    </svg>
  ),
  
  // Climatisation
  'climatisation': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="16" y="24" width="32" height="16" rx="2" fill="#60A5FA" stroke="#374151" strokeWidth="1.5"/>
      <rect x="18" y="26" width="28" height="12" rx="1" fill="#93C5FD"/>
      <rect x="20" y="28" width="24" height="2" rx="1" fill="#1E40AF"/>
      <rect x="20" y="32" width="24" height="2" rx="1" fill="#1E40AF"/>
      <rect x="20" y="36" width="24" height="2" rx="1" fill="#1E40AF"/>
      <path d="M44 20 L42 24 L46 24 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="1"/>
      <path d="M46 18 L44 22 L48 22 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="1"/>
      <path d="M48 16 L46 20 L50 20 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="1"/>
    </svg>
  ),
  
  // Sécurité
  'securite': ({ className }) => (
    <svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="24" y="20" width="16" height="20" rx="2" fill="#10B981" stroke="#374151" strokeWidth="1.5"/>
      <rect x="26" y="22" width="12" height="16" rx="1" fill="#34D399"/>
      <circle cx="32" cy="30" r="4" fill="#10B981" stroke="#374151" strokeWidth="1"/>
      <circle cx="32" cy="30" r="2" fill="#34D399"/>
      <path d="M30 34 L32 36 L34 34" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 16 L32 14 L36 16 L36 20 L28 20 Z" fill="#10B981" stroke="#374151" strokeWidth="1"/>
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

export default function ServiceIcon({ serviceName, className = "w-8 h-8" }: ServiceIconProps) {
  const iconKey = iconMap[serviceName.toLowerCase()] || iconMap[serviceName];
  
  // Debug temporaire
  console.log('ServiceIcon Debug:', { 
    serviceName, 
    iconKey, 
    availableKeys: Object.keys(iconMap),
    hasComponent: !!iconComponents[iconKey]
  });
  
  if (iconKey && iconComponents[iconKey]) {
    const IconComponent = iconComponents[iconKey];
    return <IconComponent className={className} />;
  }
  
  // Fallback vers une icône par défaut
  console.warn('Aucune icône trouvée pour:', serviceName);
  return (
    <div className={`${className} bg-orange-500 rounded-lg flex items-center justify-center text-white`}>
      <span className="text-xs font-bold">?</span>
    </div>
  );
} 