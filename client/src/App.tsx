import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileTabBar from "@/components/layout/MobileTabBar";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ScrollManager from "@/components/ui/ScrollManager";

// Pages
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import Providers from "@/pages/Providers";
import ClubPro from "@/pages/ClubPro";
import ClubProCheckout from "@/pages/ClubProCheckout";
import Project from "@/pages/Project";
import SOS from "@/pages/SOS";
// Auth pages imported below with aliases
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Profile from "@/pages/Profile";
import ProfileInfo from "@/pages/ProfileInfo";
import Reglages from "@/pages/Reglages";
import ProfileClient from "@/pages/ProfileClient";
import ProfileClientInfo from "@/pages/ProfileClientInfo";
import ProfileClientSecurity from "@/pages/ProfileClientSecurity";
import ProfileClientNotifications from "@/pages/ProfileClientNotifications";
import ProfileProvider from "@/pages/ProfileProvider";
import Messages from "@/pages/Messages";
import PostService from "@/pages/PostService";
import FAQ from "@/pages/FAQ";

import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Careers from "@/pages/Careers";
import Partners from "@/pages/Partners";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import SecurityDashboard from "@/pages/SecurityDashboard";
import IdentityVerification from "@/pages/IdentityVerification";
import Prestataires from "@/pages/Prestataires";
import ProviderProfile from "@/pages/ProviderProfile";
import NotFound from "@/pages/not-found";
import Orders from "@/pages/Orders";
import Favorites from "@/pages/Favorites";
import Missions from "@/pages/Missions";
import Parametre from "@/pages/Parametre";
import MesReservations from "@/pages/MesReservations";
import ReservationDetails from "@/pages/ReservationDetails";
import MesFavoris from "@/pages/MesFavoris";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollManager />
      <ScrollToTop />
      <Header />
      <MobileHeader />
      <main className="pb-20 md:pb-0">
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/services" component={Services} />
          <Route path="/providers" component={Providers} />
          <Route path="/club-pro" component={ClubPro} />
          <Route path="/club-pro/checkout" component={ClubProCheckout} />
          <Route path="/project" component={Project} />
          <Route path="/sos" component={SOS} />
          {/* Auth routes handled below */}
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
                      <Route path="/profile" component={Profile} />
            <Route path="/profile/info" component={ProfileInfo} />
            <Route path="/reglages" component={Reglages} />
            <Route path="/profil/client" component={ProfileClient} />
          <Route path="/profil/client/info" component={ProfileClientInfo} />
          <Route path="/profil/client/securite" component={ProfileClientSecurity} />
          <Route path="/profil/client/notifications" component={ProfileClientNotifications} />
          <Route path="/profil/prestataire" component={ProfileProvider} />
          <Route path="/messages" component={Messages} />
          <Route path="/post-service" component={PostService} />
          <Route path="/faq" component={FAQ} />

          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/careers" component={Careers} />
          <Route path="/partners" component={Partners} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/security" component={SecurityDashboard} />
          <Route path="/identity-verification" component={IdentityVerification} />
          <Route path="/prestataires" component={Prestataires} />
          <Route path="/providers/:id" component={ProviderProfile} />
          
          {/* Routes utilisateur */}
          <Route path="/mes-commandes" component={Orders} />
          <Route path="/favoris" component={Favorites} />
          <Route path="/mes-reservations" component={MesReservations} />
          <Route path="/reservations/:id" component={ReservationDetails} />
          <Route path="/mes-favoris" component={MesFavoris} />
          <Route path="/mes-missions" component={Missions} />
          <Route path="/reglages" component={Parametre} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
