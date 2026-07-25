import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 1000, suffix: "+", label: "sessions done" },
  { value: 4.8, suffix: "★", label: "avg rating", decimals: 1 },
  { value: 15, prefix: "<", suffix: " min", label: "avg arrival" },
];

function useCountUp(target, active, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVal(target);
      return undefined;
    }
    const start = performance.now();
    const duration = 1500;
    let frame;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      setVal(decimals ? Number((target * eased).toFixed(decimals)) : Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, decimals]);
  return val;
}

function Stat({ stat, active }) {
  const val = useCountUp(stat.value, active, stat.decimals);
  return (
    <div className="text-center">
      <p className="font-display text-4xl font-light tabular-nums text-ink">
        {stat.prefix}
        {stat.decimals ? val.toFixed(stat.decimals) : val}
        {stat.suffix}
      </p>
      <p className="mt-2 type-caption text-muted">{stat.label}</p>
    </div>
  );
}

export function LandingProof() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-sand py-16 md:py-20">
      <div className="page-gutter content-max">
        <div className="grid gap-10 md:grid-cols-3">
          {STATS.map((s) => (
            <Stat key={s.label} stat={s} active={active} />
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-xl text-center type-body text-sub">
          Every expert is background-checked, trained, and rated by real customers before arriving at
          your door.
        </p>
      </div>
    </section>
  );
}
