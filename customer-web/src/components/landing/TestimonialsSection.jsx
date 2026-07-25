import { Star } from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

const pillars = [
  { stat: "15 min", label: "Typical expert arrival window" },
  { stat: "100%", label: "Experts verified before going live" },
  { stat: "₹699+", label: "Affordable session pricing" },
];

export function TestimonialsSection() {
  return (
    <section className="section-pad bg-premium-gradient" aria-label="Why customers trust us">
      <div className="container-premium">
        <SectionHeader
          label="Trust & quality"
          title="Built for everyday relief, delivered professionally"
          description="Every session follows defined service standards. Professional conduct is mandatory during every interaction."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.label} className="card-premium p-8 text-center">
              <p className="font-display text-4xl font-extrabold tracking-tight text-accent">
                {p.stat}
              </p>
              <p className="mt-3 text-sm font-medium leading-6 text-sub">{p.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {brand.principles.slice(0, 3).map((principle) => (
            <div
              key={principle}
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-white/80 p-6 shadow-sm"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft">
                <Star size={18} className="text-accent" fill="currentColor" />
              </span>
              <div>
                <p className="font-semibold text-ink">{principle}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {brand.whyChoose.find((w) =>
                    w.title.toLowerCase().includes(principle.toLowerCase())
                  )?.body || brand.customerPromise[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
