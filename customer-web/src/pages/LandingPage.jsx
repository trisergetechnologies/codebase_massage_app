import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeroSection } from "../components/landing/HeroSection";
import { PainPointsSection } from "../components/landing/PainPointsSection";
import { TrustBar } from "../components/landing/TrustBar";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { ServicesSection } from "../components/landing/ServicesSection";
import { WhySection } from "../components/landing/WhySection";
import { SafetySection } from "../components/landing/SafetySection";
import { ExpertsSection } from "../components/landing/ExpertsSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { FinalCtaSection } from "../components/landing/FinalCtaSection";
import { FaqSection } from "../components/landing/FaqSection";
import { LandingStickyCta } from "../components/landing/LandingStickyCta";

export function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/services" replace />;
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
