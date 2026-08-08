import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { brand } from "../../content/brand";
import { Button } from "../ui/Button";

/** Replace later with your own asset / CDN URL */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80";

const HERO_IMAGE_SECONDARY =
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80";

const trustItems = ["Verified experts", "15-min arrival", "Transparent pricing"];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 size-[420px] rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 size-[320px] rounded-full bg-sand-deep/40 blur-3xl"
        aria-hidden
      />

      <div className="relative container-premium pb-10 pt-8 md:pb-14 md:pt-10 lg:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="animate-fade-up max-w-xl">
            <p className="eyebrow mb-5 inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              {brand.mission}
            </p>

            <h1
              id="hero-heading"
              className="font-display text-[2.65rem] font-extrabold leading-[1.05] tracking-tight text-ink md:text-[3.75rem] lg:text-[4.15rem]"
            >
              <span className="block">{brand.headlines.primary}</span>
              <span className="mt-2 block text-accent">{brand.headlines.secondary}</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-sub md:text-xl md:leading-9">
              {brand.headlines.supporting}
            </p>

            <p className="mt-5 text-sm font-medium tracking-wide text-muted">
              {trustItems.join(" · ")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/services"
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-base font-bold text-white shadow-sm transition hover:bg-accent-hover hover:shadow-md"
              >
                Book a session
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
              <Button
                variant="secondary"
                href="#how-it-works"
                className="min-h-14 px-8 text-base font-semibold"
              >
                How it works
              </Button>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-2 relative mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-premium ring-1 ring-border/60 sm:aspect-[3/4] lg:aspect-[4/5]">
              <img
                src={HERO_IMAGE}
                alt="At-home wellness session bringing calm and relief"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="absolute bottom-3 left-3 hidden w-[min(42%,11rem)] overflow-hidden rounded-2xl shadow-premium ring-1 ring-border/50 sm:block md:bottom-4 md:left-4">
              <img
                src={HERO_IMAGE_SECONDARY}
                alt="Peaceful moment of rest at home"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
