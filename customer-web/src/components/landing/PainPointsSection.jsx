import { brand } from "../../content/brand";

const triggers = [
  "Long work hours",
  "Screen strain",
  "Travel fatigue",
  "Daily stress",
  "Neck stiffness",
  "Shoulder tension",
  "Back discomfort",
  "Post-day recovery",
];

export function PainPointsSection() {
  const doubled = [...triggers, ...triggers];

  return (
    <section
      className="relative overflow-hidden border-b border-white/10 bg-forest-mid py-5"
      aria-label="Everyday discomfort we address"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-forest-mid to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-forest-mid to-transparent md:w-24" />

      <div className="flex animate-marquee items-center gap-3 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80"
          >
            <span className="size-1.5 rounded-full bg-teal-300" aria-hidden />
            {item}
          </span>
        ))}
      </div>

      <p className="sr-only">{brand.longDescription}</p>
    </section>
  );
}
