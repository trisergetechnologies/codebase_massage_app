import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { brand } from "../../content/brand";
import { Button } from "../ui/Button";
import { HeroMockup } from "../mockups/HeroMockup";

const heroStats = [
  { icon: ShieldCheck, label: "Verified experts" },
  { icon: Clock, label: "15-min arrival" },
  { icon: Sparkles, label: "Transparent pricing" },
];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-forest text-white"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-hero-mesh" aria-hidden />
      <div className="landing-noise pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-20 size-[480px] rounded-full bg-teal-400/15 blur-3xl animate-pulse-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 size-[400px] rounded-full bg-gold/10 blur-3xl animate-pulse-glow"
        aria-hidden
      />

      <div className="relative container-premium pb-12 pt-8 md:pb-16 md:pt-12 lg:pt-16">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div className="animate-fade-up max-w-xl">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md">
              <span className="size-2 rounded-full bg-teal-300 shadow-glow" />
              {brand.mission}
            </p>

            <h1
              id="hero-heading"
              className="font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-tight md:text-[3.85rem] lg:text-[4.35rem]"
            >
              <span className="block text-white">{brand.headlines.primary}</span>
              <span className="mt-2 block text-gradient-accent">{brand.headlines.secondary}</span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-white/70 md:text-xl md:leading-9">
              {brand.headlines.supporting}
            </p>

            <div className="mt-9 flex flex-wrap gap-2.5">
              {heroStats.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur-sm"
                >
                  <Icon size={15} className="text-teal-300" strokeWidth={2.25} />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/services" className="btn-premium-primary group">
                Book a session
                <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Button
                variant="secondary"
                href="#how-it-works"
                className="min-h-14 border-white/20 bg-white/8 px-8 text-base font-semibold text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/12"
              >
                How it works
              </Button>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-teal-400/10 blur-2xl"
                aria-hidden
              />
              <HeroMockup variant="hero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
