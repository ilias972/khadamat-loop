import { Handshake } from "lucide-react";

interface LogoProps {
  isWhite?: boolean;
  className?: string;
}

export default function Logo({ isWhite = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 rtl:space-x-reverse ${className}`}>
      <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center">
        <Handshake className="w-6 h-6 text-white" />
      </div>
      <span className={`text-2xl font-bold ${isWhite ? 'text-white' : 'text-gray-900'}`}>
        Khadamat
      </span>
    </div>
  );
}
