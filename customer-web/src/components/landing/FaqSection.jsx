import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

export function FaqSection() {
  return (
    <section id="faq" className="section-pad bg-white">
      <div className="container-premium">
        <SectionHeader
          label="FAQ"
          title="Common questions"
          description="Quick answers about booking, experts, and what to expect."
        />
        <div className="mx-auto max-w-3xl divide-y divide-border/80 overflow-hidden rounded-3xl border border-border/80 bg-white shadow-premium">
          {brand.faq.map((item) => (
            <details key={item.q} className="group px-6 py-5 transition hover:bg-surface/50">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold tracking-tight text-ink marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-accent text-xl font-light transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 pb-2 text-[15px] leading-7 text-sub">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
