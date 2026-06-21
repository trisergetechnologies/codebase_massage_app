import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { brand } from "../../content/brand";
import { Button } from "../ui/Button";
import { HeroMockup } from "../mockups/HeroMockup";

const heroStats = [
  { icon: ShieldCheck, label: "Verified experts" },
  { icon: Clock, label: "Fast arrival" },
  { icon: Sparkles, label: "Transparent pricing" },
];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-forest text-white"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-hero-mesh" aria-hidden />
      <div className="landing-noise pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-teal-400/20 blur-3xl animate-pulse-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 size-[360px] rounded-full bg-amber-300/15 blur-3xl animate-pulse-glow"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-4 pb-8 pt-6 md:px-8 md:pb-12 md:pt-10 lg:pt-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div className="animate-fade-up max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
              <span className="size-2 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
              {brand.mission}
            </p>

            <h1
              id="hero-heading"
              className="font-display text-[2.65rem] font-extrabold leading-[1.02] tracking-tight md:text-[3.75rem] lg:text-[4.25rem]"
            >
              <span className="block text-white">{brand.headlines.primary}</span>
              <span className="mt-1 block text-gradient-accent">{brand.headlines.secondary}</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/75 md:text-xl md:leading-9">
              {brand.headlines.supporting}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {heroStats.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-2 text-sm font-medium text-white/85 backdrop-blur-sm"
                >
                  <Icon size={15} className="text-teal-300" strokeWidth={2.25} />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/services"
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-bold text-forest shadow-lg shadow-black/20 transition hover:bg-sand hover:shadow-xl"
              >
                Book Now
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
              <Button
                variant="secondary"
                href="#how-it-works"
                className="min-h-14 border-white/25 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/15"
              >
                How It Works
              </Button>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-2 flex justify-center lg:justify-end">
            <HeroMockup variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
