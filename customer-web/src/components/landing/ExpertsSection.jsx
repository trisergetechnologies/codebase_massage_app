import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Droplets,
  UserCheck,
  ClipboardList,
  Lock,
  Award,
} from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

const STANDARD_META = [
  {
    Icon: Clock3,
    body: "Reliable arrival windows so customers can plan their day with confidence.",
  },
  {
    Icon: Droplets,
    body: "Clean tools, fresh linens, and hygiene habits that protect every session.",
  },
  {
    Icon: UserCheck,
    body: "Respectful conduct and calm communication from first knock to last goodbye.",
  },
  {
    Icon: ClipboardList,
    body: "Every visit follows the same clear service playbook — no improvising standards.",
  },
  {
    Icon: Lock,
    body: "Home is private. Experts protect customer space, data, and dignity.",
  },
  {
    Icon: Award,
    body: "The same quality of care on the first booking and the fiftieth.",
  },
];

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

function StepCard({ title, body, Icon, align = "left", revealed, delay }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-premium sm:p-6 ${
        align === "right" ? "md:text-right" : ""
      } ${revealed ? "animate-fade-up" : "opacity-0"}`}
      style={revealed ? { animationDelay: delay } : undefined}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent opacity-80"
        aria-hidden
      />
      <div
        className={`relative flex gap-4 ${
          align === "right" ? "md:flex-row-reverse" : ""
        }`}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10 transition duration-300 group-hover:bg-accent group-hover:text-white">
          <Icon size={20} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-sub">{body}</p>
        </div>
      </div>
    </article>
  );
}

export function ExpertsSection() {
  const [ref, inView] = useInView({ once: true, threshold: 0.12 });

  return (
    <section id="experts" className="section-pad relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute left-1/2 top-24 size-72 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="container-premium relative">
        <SectionHeader
          label="Expert network"
          title="Every expert represents the brand"
          description="All experts must be trained, verified, and accountable. Relief should be available when it is needed."
        />

        <div ref={ref} className="relative mx-auto max-w-4xl">
          <ol className="relative list-none">
            {/* Desktop center rail */}
            <div
              className={`pointer-events-none absolute bottom-4 left-1/2 top-4 hidden w-px -translate-x-1/2 bg-gradient-to-b from-accent/10 via-accent/40 to-accent/10 md:block ${
                inView ? "animate-fade-up" : "opacity-0"
              }`}
              aria-hidden
            />
            {/* Mobile left rail */}
            <div
              className={`pointer-events-none absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-accent/10 via-accent/40 to-accent/10 md:hidden ${
                inView ? "animate-fade-up" : "opacity-0"
              }`}
              aria-hidden
            />

            {brand.expertStandards.map((title, index) => {
              const { Icon, body } = STANDARD_META[index];
              const number = String(index + 1).padStart(2, "0");
              const isLeft = index % 2 === 0;
              const delay = `${0.12 + index * 0.08}s`;

              return (
                <li
                  key={title}
                  className="relative grid grid-cols-[32px_1fr] gap-4 pb-8 last:pb-0 md:grid-cols-[1fr_40px_1fr] md:gap-0 md:pb-10"
                >
                  {/* Mobile node */}
                  <div className="relative z-10 flex justify-center pt-5 md:hidden">
                    <span
                      className={`grid size-8 place-items-center rounded-full bg-accent font-display text-[11px] font-bold text-white shadow-sm ring-4 ring-white ${
                        inView ? "animate-fade-up" : "opacity-0"
                      }`}
                      style={inView ? { animationDelay: delay } : undefined}
                    >
                      {number}
                    </span>
                  </div>

                  {/* Desktop left cell */}
                  <div className="hidden md:block md:pr-8">
                    {isLeft ? (
                      <StepCard
                        title={title}
                        body={body}
                        Icon={Icon}
                        align="right"
                        revealed={inView}
                        delay={delay}
                      />
                    ) : null}
                  </div>

                  {/* Desktop center node */}
                  <div className="relative z-10 hidden justify-center pt-5 md:flex">
                    <span
                      className={`grid size-9 place-items-center rounded-full bg-accent font-display text-[11px] font-bold text-white shadow-sm ring-4 ring-white ${
                        inView ? "animate-fade-up" : "opacity-0"
                      }`}
                      style={inView ? { animationDelay: delay } : undefined}
                    >
                      {number}
                    </span>
                  </div>

                  {/* Desktop right cell / Mobile card */}
                  <div className="md:pl-8">
                    {!isLeft ? (
                      <StepCard
                        title={title}
                        body={body}
                        Icon={Icon}
                        align="left"
                        revealed={inView}
                        delay={delay}
                      />
                    ) : (
                      <div className="md:hidden">
                        <StepCard
                          title={title}
                          body={body}
                          Icon={Icon}
                          align="left"
                          revealed={inView}
                          delay={delay}
                        />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div
            className={`mt-14 border-t border-border/70 pt-10 text-center ${
              inView ? "animate-fade-up" : "opacity-0"
            }`}
            style={inView ? { animationDelay: "0.65s" } : undefined}
          >
            <p className="mx-auto max-w-xl text-[15px] leading-7 text-sub">
              {brand.vision}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:experts@relief.local"
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-base font-bold text-white shadow-md transition hover:bg-accent-hover hover:shadow-lg"
              >
                Become an Expert
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#safety"
                className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-sub transition hover:text-accent"
              >
                Learn about standards
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
