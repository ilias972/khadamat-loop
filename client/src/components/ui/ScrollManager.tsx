import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollManager() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll automatique vers le haut à chaque changement de route
    window.scrollTo(0, 0);
  }, [location]);

  return null;
} 