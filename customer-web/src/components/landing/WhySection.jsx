import { Clock, HeartHandshake, IndianRupee, Sparkles } from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

const icons = [Clock, Sparkles, IndianRupee, HeartHandshake];

export function WhySection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
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
              <article
                key={item.title}
                className="flex gap-5 rounded-2xl border border-border p-6 md:p-8"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-surface text-accent">
                  <Icon size={26} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
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
