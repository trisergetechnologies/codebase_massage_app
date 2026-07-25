import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  HeartHandshake,
  Clock3,
  BadgeIndianRupee,
  Home,
  Radar,
  ShieldCheck,
  GraduationCap,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { brand } from "../content/brand";

const STEPS = [
  {
    Icon: Sparkles,
    title: "Choose your session",
    body: "Pick a short wellness session built for everyday discomfort — head, neck, shoulder, back, or legs.",
  },
  {
    Icon: MapPin,
    title: "Get matched nearby",
    body: "Set your address and we match you with a trained, verified expert close to you for a quick arrival.",
  },
  {
    Icon: HeartHandshake,
    title: "Relax and feel better",
    body: "Track arrival in real time, enjoy your session at home, then rate your experience.",
  },
];

const EXPECT = [
  {
    Icon: Clock3,
    title: "Short sessions",
    body: "Focused 30–90 minute sessions that fit into a busy day.",
  },
  {
    Icon: BadgeIndianRupee,
    title: "Transparent pricing",
    body: "See the all-in price before you book. No hidden charges.",
  },
  {
    Icon: Home,
    title: "At-home comfort",
    body: "Experts bring the essentials — you relax in your own space.",
  },
  {
    Icon: Radar,
    title: "Real-time tracking",
    body: "Follow your expert’s arrival with live updates and ETAs.",
  },
];

const SAFETY_ICONS = [ShieldCheck, GraduationCap, BadgeCheck];

function useInView({ once = true, threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  return [ref, inView];
}

export function HowItWorksPage() {
  const [stepsRef, stepsInView] = useInView();

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
          <p className="eyebrow">How it works</p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-ink md:text-[3.25rem]">
            Relief in three simple steps
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-sub">
            {brand.mission}
          </p>
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

      {/* Steps */}
      <section className="container-premium py-14 md:py-20">
        <div ref={stepsRef} className="grid gap-5 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, index) => {
            const { Icon, title, body } = step;
            const delay =
              index === 0
                ? "animate-delay-1"
                : index === 1
                  ? "animate-delay-2"
                  : "animate-delay-3";
            return (
              <article
                key={title}
                className={`relative flex h-full flex-col rounded-2xl border border-border/70 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-premium sm:p-7 ${
                  stepsInView ? `animate-fade-up ${delay}` : "opacity-0"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-accent to-forest-mid text-white shadow-glow ring-1 ring-white/20">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-muted">
                    Step {index + 1}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                  {title}
                </h2>
                <p className="mt-2.5 text-[15px] leading-7 text-sub">{body}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-surface py-14 md:py-20">
        <div className="container-premium">
          <div className="max-w-2xl">
            <p className="eyebrow">What to expect</p>
            <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
              Simple, convenient, and clear
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {EXPECT.map(({ Icon, title, body }) => (
              <article
                key={title}
                className="flex gap-4 rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent ring-1 ring-accent/10">
                  <Icon size={22} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-7 text-sub">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & trust */}
      <section className="container-premium py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Safety &amp; trust</p>
          <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
            Trained, verified, and accountable
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-sub">{brand.trustStatement}</p>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm">
          {brand.safety.map((card, index) => {
            const Icon = SAFETY_ICONS[index];
            return (
              <div
                key={card.title}
                className={`flex gap-4 px-6 py-5 sm:gap-5 sm:px-8 sm:py-6 ${
                  index > 0 ? "border-t border-border/70" : ""
                }`}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10">
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-7 text-sub">{card.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-14 md:py-20">
        <div className="container-premium">
          <div className="max-w-2xl">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm">
            <div className="divide-y divide-border/70">
              {brand.faq.slice(0, 4).map((item) => (
                <details
                  key={item.q}
                  className="group transition-colors duration-300 hover:bg-surface/60 open:bg-accent-soft/40"
                >
                  <summary className="cursor-pointer list-none px-6 py-5 marker:content-none sm:px-8">
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-display text-base font-semibold tracking-tight text-ink">
                        {item.q}
                      </span>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition group-open:bg-accent group-open:text-white">
                        <ChevronDown
                          size={16}
                          className="transition duration-300 group-open:rotate-180"
                        />
                      </span>
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-[15px] leading-7 text-sub sm:px-8">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
          <p className="mt-5 text-sm text-sub">
            More questions?{" "}
            <Link to="/support" className="font-semibold text-accent hover:text-accent-hover">
              Visit support
            </Link>
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-premium py-14 md:py-20">
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
