import { Link } from "react-router-dom";
import { ArrowUpRight, Brain, Footprints, Hand, PersonStanding, Sparkles } from "lucide-react";
import { brand } from "../../content/brand";
import { SectionHeader } from "../ui/SectionHeader";

const serviceMeta = [
  { icon: Brain, tone: "from-violet-100 to-white", accent: "text-violet-700", span: "lg:col-span-2 lg:row-span-2" },
  { icon: PersonStanding, tone: "from-sky-100 to-white", accent: "text-sky-700", span: "" },
  { icon: Hand, tone: "from-amber-100 to-white", accent: "text-amber-800", span: "" },
  { icon: Sparkles, tone: "from-teal-100 to-white", accent: "text-accent", span: "lg:col-span-2" },
  { icon: Footprints, tone: "from-rose-100 to-white", accent: "text-rose-700", span: "" },
];

export function ServicesSection() {
  return (
    <section id="services" className="section-pad bg-sand">
      <div className="container-premium">
        <SectionHeader
          label="What we offer"
          title="Targeted relief for the discomfort you feel today"
          description="Short at-home wellness sessions — head, neck, shoulder, back, and leg — designed to be simple, convenient, and easy to book."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(140px,auto)]">
          {brand.services.map((service, i) => {
            const meta = serviceMeta[i];
            const Icon = meta.icon;
            return (
              <article
                key={service.name}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-premium ${meta.span}`}
              >
                <div
                  className={`mb-5 flex items-center justify-between rounded-xl bg-gradient-to-br ${meta.tone} p-4 ${meta.span.includes("row-span") ? "min-h-[120px]" : ""}`}
                >
                  <span
                    className={`grid size-12 place-items-center rounded-2xl bg-white/80 shadow-sm ${meta.accent}`}
                  >
                    <Icon size={24} strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-muted opacity-0 transition group-hover:opacity-100"
                  />
                </div>
                <h3 className="font-display text-xl font-bold text-ink">{service.name}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-7 text-sub">{service.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">
                  Book in minutes
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Not a spa. Not luxury. Not medical treatment — everyday wellness and relaxation at home.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/services"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-base font-bold text-white shadow-md transition hover:bg-accent-hover hover:shadow-lg"
          >
            Explore Services
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
