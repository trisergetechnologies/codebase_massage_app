import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-pad bg-white">
      <div className="container-premium">
        <SectionHeader
          label="How it works"
          title="Simple, convenient, and easy to book"
          description="Each session is designed to be simple, convenient, and easy to book."
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {brand.howItWorksSimple.map((step, index) => (
            <article key={step.title} className="card-premium group p-8 hover:-translate-y-1">
              <span className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-forest to-forest-mid font-display text-lg font-bold text-white shadow-sm">
                {index + 1}
              </span>
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-4 flex-1 text-[15px] leading-7 text-sub">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
