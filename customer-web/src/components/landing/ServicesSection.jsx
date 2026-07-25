import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/** Landing bento only — replace Unsplash URLs later with brand assets */
const U = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const BENTO_SERVICES = [
  {
    name: "Quick Boost",
    description: "Fast reset for head and neck strain.",
    image: U("photo-1515377905703-c4788e51af15"),
    span: "lg:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    name: "Power Up",
    description: "Energy for shoulders and upper body.",
    image: U("photo-1600334129128-685c5582fd35"),
    span: "",
  },
  {
    name: "Desk Detox",
    description: "Undo the posture fatigue from screens.",
    image: U("photo-1571019614242-c5c5dee9f50e"),
    span: "",
  },
  {
    name: "Recovery Mode",
    description: "Legs and lower body after a long day.",
    image: U("photo-1519415510236-718bdfcd89c8"),
    span: "lg:col-span-2",
  },
  {
    name: "Deep Unplug",
    description: "Full-body calm and stress relief.",
    image: U("photo-1544161515-4ab6ce6db874"),
    span: "",
  },
];

function BentoCard({ service }) {
  const { name, description, image, span, featured } = service;

  return (
    <Link
      to="/services"
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/70 transition duration-300 hover:-translate-y-1 hover:shadow-premium hover:ring-accent/25 ${span}`}
    >
      <div
        className={`relative overflow-hidden bg-surface ${
          featured ? "min-h-[200px] flex-1 sm:min-h-[240px]" : "aspect-[4/3]"
        }`}
      >
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
        <ArrowUpRight
          size={18}
          className="absolute right-4 top-4 text-white/80 opacity-0 transition group-hover:opacity-100"
        />
      </div>

      <div className={`relative ${featured ? "absolute inset-x-0 bottom-0 p-6 sm:p-8" : "p-5"}`}>
        <h3
          className={`font-display font-bold tracking-tight ${
            featured ? "text-2xl text-white sm:text-3xl" : "text-lg text-ink"
          }`}
        >
          {name}
        </h3>
        <p
          className={`mt-1.5 text-sm leading-6 ${
            featured ? "max-w-sm text-white/85" : "text-sub"
          }`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="section-pad bg-sand">
      <div className="container-premium">
        <SectionHeader
          label="What we offer"
          title="Targeted relief for the discomfort you feel today"
          description="Short at-home wellness sessions designed to be simple, convenient, and easy to book."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(160px,auto)]">
          {BENTO_SERVICES.map((service) => (
            <BentoCard key={service.name} service={service} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Not a spa. Not luxury. Not medical treatment — everyday wellness and relaxation at home.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/services"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-8 text-base font-bold text-white shadow-md transition hover:bg-accent-hover hover:shadow-lg"
          >
            Explore more
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
