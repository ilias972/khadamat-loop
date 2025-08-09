import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [, setLocation] = useLocation();

  // Détecter quand l'utilisateur a scrollé suffisamment
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Remonter en haut lors du changement de route
  useEffect(() => {
    // Scroll automatique vers le haut à chaque changement de route
    window.scrollTo(0, 0);
  }, [setLocation]);

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 z-50 hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label="Remonter en haut de la page"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </>
  );
}