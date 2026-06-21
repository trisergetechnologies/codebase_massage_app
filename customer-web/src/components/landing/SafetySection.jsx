import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

export function SafetySection() {
  return (
    <section id="safety" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeader
          label="Safety & trust"
          title="Trained, verified, and accountable"
          description={brand.trustStatement}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {brand.safety.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-border bg-white p-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-ink">{card.title}</h3>
              <p className="mt-4 text-[15px] leading-7 text-sub">{card.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-accent/20 bg-accent-soft p-8 md:p-10">
          <h3 className="text-lg font-semibold text-ink">Customer promise</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brand.customerPromise.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[15px] text-sub">
                <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
