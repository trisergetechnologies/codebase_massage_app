import { Clock, HeartHandshake, IndianRupee, Sparkles } from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

const icons = [Clock, Sparkles, IndianRupee, HeartHandshake];

export function WhySection() {
  return (
    <section className="section-pad bg-surface">
      <div className="container-premium">
        <SectionHeader
          label="Why customers choose us"
          title="Fast physical relief at home"
          description={brand.longDescription}
          align="left"
          className="max-w-4xl"
        />

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {brand.whyChoose.map((item, i) => {
            const Icon = icons[i];
            return (
              <article key={item.title} className="card-premium flex gap-5 p-6 md:p-8">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent ring-1 ring-accent/10">
                  <Icon size={26} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-7 text-sub">{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
