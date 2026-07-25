import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  ShieldCheck,
  BadgeIndianRupee,
  Zap,
  Wallet,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { brand } from "../content/brand";

const PRINCIPLE_COPY = {
  Fast: "Relief when you need it — not days later.",
  Affordable: "Fair, all-in pricing that stays accessible.",
  Reliable: "Clear ETAs and consistent session quality.",
  Safe: "Trained, verified experts you can trust at home.",
  Respectful: "Professional conduct and privacy, every visit.",
};

const PRINCIPLE_ICONS = {
  Fast: Zap,
  Affordable: Wallet,
  Reliable: CheckCircle2,
  Safe: ShieldCheck,
  Respectful: HeartHandshake,
};

const DIFFERENTIATORS = [
  {
    Icon: Clock3,
    title: "Quick Arrival",
    body: "Nearby experts reduce waiting so you feel better sooner.",
  },
  {
    Icon: ShieldCheck,
    title: "Verified Experts",
    body: "Every expert completes training and verification before going live.",
  },
  {
    Icon: BadgeIndianRupee,
    title: "Transparent Pricing",
    body: "See the session cost before you book — no surprise fees.",
  },
];

export function AboutUsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-sand">
        <div
          className="pointer-events-none absolute -right-20 top-0 size-80 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 size-72 rounded-full bg-gold/10 blur-3xl"
          aria-hidden
        />
        <div className="container-premium relative py-16 md:py-24">
          <p className="eyebrow">About ReliefHai</p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-ink md:text-[3.25rem]">
            Everyday relief,{" "}
            <span className="text-accent">delivered home</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-sub">{brand.mission}</p>
          <div className="mt-8">
            <Link
              to="/services"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-base font-bold text-white shadow-md transition hover:bg-accent-hover hover:shadow-lg"
            >
              Book a session
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="container-premium py-14 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
              Built for the discomfort modern life creates
            </h2>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-white p-7 shadow-premium sm:p-9">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent"
              aria-hidden
            />
            <div className="relative space-y-4 text-[15px] leading-7 text-sub">
              <p>
                Long work hours, screen time, and daily stress leave people tired and
                uncomfortable — but booking a spa is rarely practical when you need relief now.
              </p>
              <p>
                ReliefHai connects you with trained local wellness experts for short,
                affordable sessions at your doorstep. Transparent pricing, verified professionals,
                and quick arrival make feeling better simple again.
              </p>
              <p className="font-medium text-ink">{brand.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-surface py-14 md:py-20">
        <div className="container-premium">
          <div className="max-w-2xl">
            <p className="eyebrow">Purpose</p>
            <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
              Mission &amp; vision
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium sm:p-8">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent-soft/80 to-transparent"
                aria-hidden
              />
              <span className="relative inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-forest-mid text-white shadow-glow">
                <Sparkles size={22} strokeWidth={2} />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-bold tracking-tight text-ink">
                Mission
              </h3>
              <p className="relative mt-2.5 text-[15px] leading-7 text-sub">{brand.mission}</p>
            </article>
            <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium sm:p-8">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#fbf6e8] to-transparent"
                aria-hidden
              />
              <span className="relative inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[#a8841a] text-white shadow-[0_0_28px_rgba(201,162,39,0.35)]">
                <HeartHandshake size={22} strokeWidth={2} />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-bold tracking-tight text-ink">
                Vision
              </h3>
              <p className="relative mt-2.5 text-[15px] leading-7 text-sub">{brand.vision}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="container-premium py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">What we believe</p>
          <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
            Principles that guide every session
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brand.principles.map((principle) => {
            const Icon = PRINCIPLE_ICONS[principle] || CheckCircle2;
            return (
              <article
                key={principle}
                className="flex gap-4 rounded-2xl border border-border/70 bg-white p-5 shadow-sm transition hover:border-accent/25 hover:shadow-premium sm:p-6"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10">
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
                    {principle}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-sub">
                    {PRINCIPLE_COPY[principle] || ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Why ReliefHai */}
      <section className="bg-surface py-14 md:py-20">
        <div className="container-premium">
          <div className="max-w-2xl">
            <p className="eyebrow">Why ReliefHai</p>
            <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
              Designed to be simple, trusted, and nearby
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {DIFFERENTIATORS.map(({ Icon, title, body }) => (
              <article
                key={title}
                className="relative overflow-hidden rounded-2xl border border-border/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium sm:p-7"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white to-transparent"
                  aria-hidden
                />
                <span className="relative grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent ring-1 ring-accent/10">
                  <Icon size={22} strokeWidth={1.9} />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-bold tracking-tight text-ink">
                  {title}
                </h3>
                <p className="relative mt-2 text-[15px] leading-7 text-sub">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="container-premium py-14 md:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-white px-6 py-10 shadow-premium sm:px-10 md:px-12">
          <div
            className="pointer-events-none absolute -right-10 top-0 size-48 rounded-full bg-accent/10 blur-3xl"
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow">Trust</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Trained, verified, and accountable
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-sub">{brand.trustStatement}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <Link to="/how-it-works" className="text-accent hover:text-accent-hover">
                How it works
              </Link>
              <Link to="/support" className="text-accent hover:text-accent-hover">
                Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-premium pb-14 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-forest px-6 py-12 text-center shadow-premium-lg sm:px-10 md:py-16">
          <div
            className="pointer-events-none absolute -left-16 top-0 size-64 rounded-full bg-accent/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-12 bottom-0 size-72 rounded-full bg-gold/15 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              {brand.cta.headline}
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Feel better in minutes, at home
            </h2>
            <Link
              to="/services"
              className="group mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-bold text-forest shadow-md transition hover:bg-white/90"
            >
              {brand.cta.primary}
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </Link>
            <p className="mx-auto mt-8 max-w-xl text-xs leading-6 text-white/60">
              {brand.disclaimer}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
