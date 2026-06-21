import { BadgeCheck, Clock, IndianRupee, Shield } from "lucide-react";
import { brand } from "../../content/brand";

const icons = [BadgeCheck, IndianRupee, Clock, Shield];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface" aria-label="Trust indicators">
      <div className="mx-auto grid max-w-[1200px] gap-px bg-border md:grid-cols-4">
        {brand.trustBar.map((item, i) => {
          const Icon = icons[i];
          return (
            <div
              key={item.title}
              className="flex flex-col items-center bg-white px-6 py-8 text-center md:py-10"
            >
              <span className="mb-4 grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon size={22} strokeWidth={2} />
              </span>
              <h3 className="text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 max-w-[200px] text-sm leading-6 text-muted">{item.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
