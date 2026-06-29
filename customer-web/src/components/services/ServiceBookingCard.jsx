import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { getBenefitTags } from "../../lib/serviceFilters";

export function ServiceBookingCard({ service, onAdd, featured = false }) {
  const tags = getBenefitTags(service);
  const detailPath = `/services/${service.id}`;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ${
        featured
          ? "p-7 shadow-premium ring-1 ring-border/80 hover:shadow-premium-lg"
          : "p-6 shadow-sm ring-1 ring-border/70 hover:-translate-y-1 hover:shadow-premium hover:ring-accent/20"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0 opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />

      <Link
        to={detailPath}
        className="block min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg"
      >
        <h3
          className={`font-display font-bold tracking-tight text-ink transition-colors group-hover:text-accent ${
            featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
          }`}
        >
          {service.name}
        </h3>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-sub">
          <Clock size={15} className="text-muted" />
          {service.durationMin} min session
        </p>
        <p className={`mt-4 font-display font-bold text-ink ${featured ? "text-2xl" : "text-xl"}`}>
          ₹{service.price?.toLocaleString("en-IN")}
          <span className="ml-1 text-sm font-normal text-muted">all-in</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-surface px-2.5 py-1 text-xs font-medium text-sub ring-1 ring-border/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onAdd(service)}
        className={`mt-6 w-full rounded-xl bg-accent font-semibold text-white shadow-sm transition hover:bg-accent-hover hover:shadow-md active:scale-[0.99] ${
          featured ? "min-h-12 text-base" : "min-h-11 text-sm"
        }`}
      >
        Add to cart
      </button>
    </article>
  );
}
