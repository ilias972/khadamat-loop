import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Pages
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import Providers from "@/pages/Providers";
import ClubPro from "@/pages/ClubPro";
import Project from "@/pages/Project";
import SOS from "@/pages/SOS";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />
      <main className="pb-20 md:pb-0">
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/services" component={Services} />
          <Route path="/providers" component={Providers} />
          <Route path="/club-pro" component={ClubPro} />
          <Route path="/project" component={Project} />
          <Route path="/sos" component={SOS} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <MobileTabBar />
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
