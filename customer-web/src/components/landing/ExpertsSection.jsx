import { Check } from "lucide-react";
import { brand } from "../../content/brand";

export function ExpertsSection() {
  return (
    <section id="experts" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-white to-accent-soft">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-14">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Expert network
              </p>
              <h2 className="mt-4 font-display text-section font-extrabold tracking-tight text-ink md:text-section-lg">
                Every expert represents the brand
              </h2>
              <p className="mt-6 text-lg leading-8 text-sub">
                All experts must be trained, verified, and accountable. Relief should be available
                when it is needed.
              </p>
              <p className="mt-4 text-sm text-muted">{brand.vision}</p>
              <a
                href="mailto:experts@relief.local"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-forest bg-forest px-6 text-[15px] font-bold text-white transition hover:bg-forest-mid"
              >
                Become an Expert
              </a>
            </div>

            <div className="border-t border-border bg-white p-8 md:p-12 lg:border-l lg:border-t-0 lg:p-14">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                Expert standards
              </h3>
              <ul className="mt-6 space-y-4">
                {brand.expertStandards.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-7 text-sub">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-2">
                {brand.principles.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
