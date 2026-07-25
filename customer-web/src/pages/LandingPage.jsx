import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeroSection } from "../components/landing/HeroSection";
import { PainPointsSection } from "../components/landing/PainPointsSection";
import { ServicesSection } from "../components/landing/ServicesSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { SafetySection } from "../components/landing/SafetySection";
import { ExpertsSection } from "../components/landing/ExpertsSection";
import { FaqSection } from "../components/landing/FaqSection";
import { FinalCtaSection } from "../components/landing/FinalCtaSection";
import { LandingStickyCta } from "../components/landing/LandingStickyCta";

export function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/services" replace />;
  }

  if (loading) {
    return <div className="min-h-screen bg-white" aria-busy="true" />;
  }

  return (
    <div className="pb-20 md:pb-0">
      <HeroSection />
      <PainPointsSection />
      <ServicesSection />
      <HowItWorksSection />
      <SafetySection />
      <ExpertsSection />
      <FinalCtaSection />
      <LandingStickyCta />
    </div>
  );
}
