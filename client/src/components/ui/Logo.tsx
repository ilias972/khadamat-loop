import logoSrc from "@assets/Symbole abstrait sur fond orange_1753291962087.png";

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export default function Logo({ 
  className = "w-8 h-8", 
  textClassName = "text-xl font-bold text-gray-900" 
}: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <img 
        src={logoSrc} 
        alt="Khadamat" 
        className={`${className} rounded-lg`}
      />
      <span className={textClassName}>Khadamat</span>
    </div>
  );
}