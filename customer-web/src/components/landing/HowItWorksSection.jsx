import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeader
          label="How it works"
          title="Simple, convenient, and easy to book"
          description="Each session is designed to be simple, convenient, and easy to book."
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {brand.howItWorksSimple.map((step, index) => (
            <article
              key={step.title}
              className="group flex flex-col rounded-2xl border border-border bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-ink text-lg font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-4 flex-1 text-[15px] leading-7 text-sub">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
