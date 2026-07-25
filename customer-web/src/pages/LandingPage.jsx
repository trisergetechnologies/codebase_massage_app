import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingServices } from "../components/landing/LandingServices";
import { LandingProof } from "../components/landing/LandingProof";
import { LandingProcess } from "../components/landing/LandingProcess";
import { LandingFaq } from "../components/landing/LandingFaq";
import { LandingFinalCta } from "../components/landing/LandingFinalCta";
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
      <LandingHero />
      <LandingServices />
      <LandingProof />
      <LandingProcess />
      <LandingFaq />
      <LandingFinalCta />
      <LandingStickyCta />
    </div>
  );
}
