import { BadgeCheck, Clock, IndianRupee, Shield } from "lucide-react";
import { brand } from "../../content/brand";

const icons = [BadgeCheck, IndianRupee, Clock, Shield];

export function TrustBar() {
  return (
    <section className="relative border-y border-border/80 bg-white" aria-label="Trust indicators">
      <div className="container-premium">
        <div className="grid gap-px md:grid-cols-4 md:gap-0 md:divide-x md:divide-border/80">
          {brand.trustBar.map((item, i) => {
            const Icon = icons[i];
            return (
              <div
                key={item.title}
                className="group flex flex-col items-center px-6 py-10 text-center transition hover:bg-surface/50 md:py-12"
              >
                <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent shadow-sm ring-1 ring-accent/10 transition group-hover:shadow-md group-hover:ring-accent/20">
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="text-base font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 max-w-[220px] text-sm leading-6 text-muted">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
