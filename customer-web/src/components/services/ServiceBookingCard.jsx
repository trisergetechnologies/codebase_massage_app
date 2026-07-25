import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { getBenefitTags, isPopularService } from "../../lib/serviceFilters";
import { getServiceImage } from "../../lib/serviceImages";

export function ServiceBookingCard({ service, onAdd }) {
  const tags = getBenefitTags(service);
  const detailPath = `/services/${service.id}`;
  const image = getServiceImage(service);
  const popular = isPopularService(service);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-white transition duration-200 hover:border-accent">
      <Link
        to={detailPath}
        className="relative block aspect-[4/3] overflow-hidden bg-surface outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        <img
          src={image}
          alt={service.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        {popular && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent shadow-xs ring-1 ring-accent/15">
            Popular
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Link
          to={detailPath}
          className="flex items-start justify-between gap-2 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md"
        >
          <h3 className="font-display text-sm font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent sm:text-[15px]">
            {service.name}
          </h3>
          <ArrowRight
            size={16}
            className="mt-0.5 shrink-0 text-ink transition group-hover:text-accent"
          />
        </Link>

        <p className="mt-2 inline-flex items-center gap-1 text-xs text-sub">
          <Clock size={12} className="text-muted" />
          {service.durationMin} min
        </p>

        <p className="mt-1.5 font-display text-base font-bold text-ink sm:text-lg">
          ₹{service.price?.toLocaleString("en-IN")}
          <span className="ml-1 text-xs font-normal text-muted">all-in</span>
        </p>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-sub ring-1 ring-border/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onAdd(service)}
          className="mt-3.5 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.99]"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
