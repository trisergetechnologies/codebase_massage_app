import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

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

export function FaqSection() {
  const [ref, inView] = useInView({ once: true, threshold: 0.15 });

  return (
    <section id="faq" className="section-pad relative overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute left-1/2 top-20 size-72 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="container-premium relative">
        <SectionHeader
          label="FAQ"
          title="Common questions"
          description="Quick answers about booking, experts, and what to expect."
        />

        <div
          ref={ref}
          className={`relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-white/80 shadow-premium backdrop-blur-sm ${
            inView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent"
            aria-hidden
          />

          <div className="relative divide-y divide-border/70">
            {brand.faq.map((item, index) => (
              <details
                key={item.q}
                className={`group transition-colors duration-300 hover:bg-surface/60 open:bg-accent-soft/40 ${
                  inView ? "animate-fade-up" : "opacity-0"
                }`}
                style={inView ? { animationDelay: `${0.12 + index * 0.07}s` } : undefined}
              >
                <summary className="cursor-pointer list-none px-6 py-5 marker:content-none sm:px-8 sm:py-6">
                  <span className="flex items-center justify-between gap-4">
                    <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                      {item.q}
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent ring-1 ring-accent/10 transition duration-300 group-open:bg-accent group-open:text-white group-open:ring-accent/30">
                      <ChevronDown
                        size={18}
                        strokeWidth={2.1}
                        className="transition duration-300 group-open:rotate-180"
                      />
                    </span>
                  </span>
                </summary>
                <p className="px-6 pb-6 text-[15px] leading-7 text-sub sm:px-8 sm:pb-7">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
