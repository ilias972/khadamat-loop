import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export function useJoinClubPro() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const checkoutPath = "/club-pro/checkout";

  const handleJoinClubPro = () => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLocation(`/login?next=${encodeURIComponent(checkoutPath)}`);
    } else {
      setLocation(checkoutPath);
    }
  };

  return { handleJoinClubPro, isLoading };
}
