import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { getBenefitTags } from "../../lib/serviceFilters";

export function ServiceBookingCard({ service, onAdd, featured = false }) {
  const tags = getBenefitTags(service);
  const detailPath = `/services/${service.id}`;

  return (
    <article
      className={`group flex flex-col rounded-2xl bg-white transition-all duration-200 ${
        featured
          ? "p-7 ring-1 ring-border/80 shadow-sm hover:shadow-md"
          : "p-6 ring-1 ring-border/70 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:ring-border"
      }`}
    >
      <Link to={detailPath} className="block min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg">
        <h3
          className={`font-semibold tracking-tight text-ink group-hover:text-accent transition-colors ${
            featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
          }`}
        >
          {service.name}
        </h3>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-sub">
          <Clock size={15} className="text-muted" />
          {service.durationMin} min
        </p>
        <p
          className={`mt-3 font-semibold text-ink ${featured ? "text-2xl" : "text-xl"}`}
        >
          ₹{service.price?.toLocaleString("en-IN")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[#f4f5f7] px-2.5 py-1 text-xs font-medium text-sub"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onAdd(service)}
        className={`mt-6 w-full rounded-xl bg-accent font-semibold text-white transition hover:bg-[#0d6b63] active:scale-[0.99] ${
          featured ? "min-h-12 text-base" : "min-h-11 text-sm"
        }`}
      >
        Add to cart
      </button>
    </article>
  );
}
