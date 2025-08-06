import { useState, useEffect } from "react";

interface GeolocationState {
  city: string;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    city: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Vérifier si la géolocalisation est supportée
        if (!navigator.geolocation) {
          setState({
            city: "Casablanca",
            isLoading: false,
            error: "Géolocalisation non supportée",
          });
          return;
        }

        // Demander la position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              
              // Utiliser l'API Nominatim pour le géocodage inverse
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
              );
              
              if (!response.ok) {
                throw new Error("Erreur lors du géocodage");
              }
              
              const data = await response.json();
              const city = data.address?.city || 
                          data.address?.town || 
                          data.address?.village || 
                          data.address?.municipality ||
                          "Casablanca";
              
              setState({
                city,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              console.error("Erreur géocodage:", error);
              setState({
                city: "Casablanca",
                isLoading: false,
                error: "Erreur lors de la détection de la ville",
              });
            }
          },
          (error) => {
            console.error("Erreur géolocalisation:", error);
            let errorMessage = "Erreur de géolocalisation";
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Permission de géolocalisation refusée";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Position non disponible";
                break;
              case error.TIMEOUT:
                errorMessage = "Délai de géolocalisation dépassé";
                break;
            }
            
            setState({
              city: "Casablanca",
              isLoading: false,
              error: errorMessage,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000, // 10 minutes
          }
        );
      } catch (error) {
        console.error("Erreur détection localisation:", error);
        setState({
          city: "Casablanca",
          isLoading: false,
          error: "Erreur lors de la détection de la localisation",
        });
      }
    };

    detectUserLocation();
  }, []);

  return state;
} 