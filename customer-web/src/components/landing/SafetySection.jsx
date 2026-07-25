import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  GraduationCap,
  BadgeCheck,
  IndianRupee,
  Sparkles,
  UserCheck,
  Clock3,
  Headphones,
} from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

const SAFETY_ICONS = [ShieldCheck, GraduationCap, BadgeCheck];

const PROMISE_ICONS = [IndianRupee, Sparkles, UserCheck, Clock3, Headphones];

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

export function SafetySection() {
  const [ref, inView] = useInView({ once: true, threshold: 0.15 });

  return (
    <section id="safety" className="section-pad relative overflow-hidden bg-sand">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent-soft/40 to-transparent"
        aria-hidden
      />

      <div className="container-premium relative">
        <SectionHeader
          label="Safety & trust"
          title="Trained, verified, and accountable"
          description={brand.trustStatement}
        />

        <div ref={ref} className="mt-2">
          {/* Trust pillars — medallion cards with gradient crown edge */}
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {brand.safety.map((card, index) => {
              const Icon = SAFETY_ICONS[index];
              const delayClass =
                index === 0
                  ? "animate-delay-1"
                  : index === 1
                    ? "animate-delay-2"
                    : "animate-delay-3";

              return (
                <article
                  key={card.title}
                  className={`group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-border/70 bg-white px-6 pb-8 pt-10 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-premium ${
                    inView ? `animate-fade-up ${delayClass}` : "opacity-0"
                  }`}
                >
                  {/* Crown edge */}
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0 opacity-70 transition duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  {/* Soft radial glow behind medallion */}
                  <span
                    className="pointer-events-none absolute -top-10 left-1/2 size-44 -translate-x-1/2 rounded-full bg-accent/[0.07] blur-2xl transition duration-500 group-hover:bg-accent/15"
                    aria-hidden
                  />

                  {/* Concentric medallion */}
                  <span className="relative mb-6 grid size-20 place-items-center">
                    <span
                      className="absolute inset-0 rounded-full border border-accent/15 transition duration-500 group-hover:scale-105 group-hover:border-accent/30"
                      aria-hidden
                    />
                    <span
                      className="absolute inset-2 rounded-full border border-accent/20 transition duration-500 group-hover:scale-105"
                      aria-hidden
                    />
                    <span className="relative grid size-12 place-items-center rounded-full bg-accent-soft text-accent ring-1 ring-accent/15 transition duration-300 group-hover:bg-accent group-hover:text-white group-hover:ring-accent/40">
                      <Icon size={22} strokeWidth={1.9} />
                    </span>
                  </span>

                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Standard {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink">
                    {card.title}
                  </h3>
                  <span
                    className="mt-4 h-px w-10 bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-all duration-300 group-hover:w-16"
                    aria-hidden
                  />
                  <p className="mt-4 text-[15px] leading-7 text-sub">{card.body}</p>
                </article>
              );
            })}
          </div>

          {/* Forest manifesto — Customer Promise */}
          <div
            className={`relative mt-10 overflow-hidden rounded-3xl bg-forest px-6 py-10 shadow-premium-lg sm:px-10 sm:py-12 md:px-12 md:py-14 ${
              inView ? "animate-fade-up animate-delay-3" : "opacity-0"
            }`}
          >
            {/* Soft gold edge + inner glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-gold/25"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-accent/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-gold/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              aria-hidden
            />

            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12 lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                  Customer promise
                </p>
                <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  What you can always count on
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-7 text-white/70">
                  Relief at home only works when trust comes first. These are the
                  standards we hold ourselves to — every booking, every visit.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {brand.customerPromise.map((item, i) => {
                  const Icon = PROMISE_ICONS[i];
                  return (
                    <li
                      key={item.title}
                      className={`group/chip flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold/35 hover:bg-white/[0.16] ${
                        i === brand.customerPromise.length - 1 ? "sm:col-span-2" : ""
                      } ${inView ? "animate-fade-up" : "opacity-0"}`}
                      style={
                        inView ? { animationDelay: `${0.4 + i * 0.08}s` } : undefined
                      }
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold ring-1 ring-white/10 transition group-hover/chip:bg-gold/20 group-hover/chip:text-white">
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-display text-[15px] font-bold text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-white/65">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
