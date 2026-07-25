import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/** Landing gallery tiles — replace image URLs later with your own assets */
const GALLERY = [
  {
    name: "Quick Boost",
    description: "Fast reset for head and neck strain.",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
    className: "min-h-[280px] sm:col-span-2 sm:row-span-2 sm:min-h-0",
  },
  {
    name: "Power Up",
    description: "Energy for shoulders and upper body.",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80",
    className: "min-h-[220px] sm:col-span-2 sm:min-h-0",
  },
  {
    name: "Desk Detox",
    description: "Undo the posture fatigue from screens.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80",
    className: "min-h-[220px] sm:min-h-0",
  },
  {
    name: "Deep Unplug",
    description: "Full-body calm and stress relief.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=700&q=80",
    className: "min-h-[220px] sm:min-h-0",
  },
];

function GalleryTile({ service }) {
  const { name, description, image, className } = service;

  return (
    <Link
      to="/services"
      className={`group relative block overflow-hidden rounded-2xl bg-surface ring-1 ring-border/60 ${className}`}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        loading="lazy"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/5"
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-[1.35rem]">
              {name}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm leading-5 text-white/80">
              {description}
            </p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-ink">
            <ArrowUpRight size={16} />
          </span>
        </div>
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
          description="Short at-home wellness sessions — head, neck, shoulder, back, and leg — designed to be simple, convenient, and easy to book."
        />

        {/*
          Gallery bento:
          mobile  — stacked
          sm+     — 4-col × 2-row fixed canvas
                    [ Quick Boost 2×2 ] [ Power Up 2×1 ]
                    [                 ] [ Desk 1 ][ Deep 1 ]
        */}
        <div className="grid grid-cols-1 gap-3 sm:h-[520px] sm:grid-cols-4 sm:grid-rows-2 sm:gap-4 lg:h-[580px]">
          {GALLERY.map((service) => (
            <GalleryTile key={service.name} service={service} />
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
