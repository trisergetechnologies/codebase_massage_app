import { useEffect, useRef, useState } from "react";
import { Sparkles, MapPin, HeartHandshake } from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

const STEP_STYLES = [
  {
    Icon: Sparkles,
    ghost: "01",
    delay: "animate-delay-1",
    wash: "from-accent-soft/90 via-white to-white",
    badge: "from-accent to-forest-mid shadow-glow",
    chip: "bg-accent-soft text-accent ring-accent/20",
    halo: "bg-accent/30",
    rail: "bg-accent",
  },
  {
    Icon: MapPin,
    ghost: "02",
    delay: "animate-delay-2",
    wash: "from-[#fbf6e8] via-white to-white",
    badge: "from-gold to-[#a8841a] shadow-[0_0_28px_rgba(201,162,39,0.35)]",
    chip: "bg-[#fbf6e8] text-[#a8841a] ring-gold/25",
    halo: "bg-gold/35",
    rail: "bg-gold",
  },
  {
    Icon: HeartHandshake,
    ghost: "03",
    delay: "animate-delay-3",
    wash: "from-accent-muted/80 via-white to-white",
    badge: "from-forest to-forest-mid shadow-glow",
    chip: "bg-accent-muted text-forest ring-forest/15",
    halo: "bg-forest/25",
    rail: "bg-forest",
  },
];

function useInView({ once = true, threshold = 0.2 } = {}) {
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

function StepCard({ step, style, index, revealed }) {
  const { Icon, ghost, delay, wash, badge, chip, halo } = style;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-white p-7 shadow-premium transition duration-300 hover:-translate-y-1.5 hover:border-border hover:shadow-premium-lg sm:p-8 ${
        revealed ? `animate-fade-up ${delay}` : "opacity-0"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${wash}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/90 via-white/40 to-transparent opacity-80 transition duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-white/50 blur-2xl transition duration-500 group-hover:bg-white/80"
        aria-hidden
      />

      <span
        className="pointer-events-none absolute -right-1 -top-4 select-none font-display text-[7rem] font-bold leading-none text-ink/[0.05]"
        aria-hidden
      >
        {ghost}
      </span>

      <div className="relative flex flex-1 flex-col">
        <div className="relative mb-6 inline-flex self-start md:mb-8">
          <span
            className={`absolute inset-0 scale-[1.55] rounded-2xl ${halo} blur-lg animate-pulse-glow`}
            aria-hidden
          />
          <span
            className={`relative z-[1] inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${badge} text-white ring-1 ring-white/25 transition duration-300 group-hover:scale-105`}
          >
            <Icon size={22} strokeWidth={2.1} />
          </span>
          <span
            className={`absolute -bottom-1.5 -right-1.5 z-[2] grid size-6 place-items-center rounded-full text-[11px] font-bold shadow-sm ring-2 ring-white ${chip}`}
          >
            {index + 1}
          </span>
        </div>

        <h3 className="font-display text-xl font-bold tracking-tight text-ink">
          {step.title}
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-7 text-sub">{step.body}</p>
      </div>
    </article>
  );
}

export function HowItWorksSection() {
  const [ref, inView] = useInView({ once: true, threshold: 0.2 });

  return (
    <section id="how-it-works" className="section-pad relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-accent/10 blur-3xl animate-pulse-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-8 size-80 rounded-full bg-gold/10 blur-3xl animate-pulse-glow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-muted/40 blur-3xl"
        aria-hidden
      />

      <div className="container-premium relative">
        <SectionHeader
          label="How it works"
          title="Simple, convenient, and easy to book"
          description="Each session is designed to be simple, convenient, and easy to book."
        />

        <div ref={ref} className="relative">
          {/* Desktop connector through icon row */}
          <div
            className="pointer-events-none absolute left-[calc(16.666%+1.75rem)] right-[calc(16.666%+1.75rem)] top-[3.5rem] z-0 hidden h-0.5 md:block"
            aria-hidden
          >
            <div className="h-full w-full rounded-full bg-gradient-to-r from-accent/50 via-gold/55 to-forest/50" />
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-white/70" />
          </div>

          {/* Mobile vertical connector (outside cards) */}
          <div
            className="pointer-events-none absolute bottom-8 left-[11px] top-8 w-0.5 rounded-full bg-gradient-to-b from-accent/50 via-gold/55 to-forest/50 md:hidden"
            aria-hidden
          />

          <ol className="relative grid list-none gap-5 pl-8 md:grid-cols-3 md:gap-8 md:pl-0">
            {brand.howItWorksSimple.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  className={`absolute -left-8 top-8 z-10 size-3 rounded-full ring-4 ring-white md:hidden ${STEP_STYLES[index].rail} animate-pulse-glow`}
                  aria-hidden
                />

                <StepCard
                  step={step}
                  style={STEP_STYLES[index]}
                  index={index}
                  revealed={inView}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
