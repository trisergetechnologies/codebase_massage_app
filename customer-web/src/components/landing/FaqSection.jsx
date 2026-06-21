import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

export function FaqSection() {
  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeader
          label="FAQ"
          title="Common questions"
          description="Quick answers about booking, experts, and what to expect."
        />
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border">
          {brand.faq.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="cursor-pointer list-none text-lg font-semibold text-ink marker:content-none">
                {item.q}
              </summary>
              <p className="mt-3 pb-2 text-[15px] leading-7 text-sub">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
