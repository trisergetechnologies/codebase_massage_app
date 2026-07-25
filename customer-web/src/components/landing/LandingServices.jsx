import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { brand } from "../../content/brand";
import { Button } from "../ui/Button";

export function LandingServices() {
  return (
    <section className="bg-white py-16 md:py-20" id="services">
      <div className="page-gutter content-max">
        <p className="type-label text-brand">What we offer</p>
        <h2 className="mt-3 type-display-md text-ink">Relief for where it hurts today</h2>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-5">
          {brand.services.map((service) => (
            <article
              key={service.name}
              className="min-w-[260px] snap-start rounded-card border border-border bg-surface p-5 transition-default hover:-translate-y-0.5 hover:border-border-brand hover:shadow-md md:min-w-0"
            >
              <p className="type-label text-brand">{service.name.split(" ")[0]} relief</p>
              <h3 className="mt-2 type-h3 text-ink">{service.name}</h3>
              <p className="mt-2 type-body-sm text-muted">{service.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="type-price text-ink">₹499</span>
                <Button variant="ghost" size="sm" href="/services" className="min-w-0">
                  Add <ArrowRight size={14} />
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center type-body text-muted">
          Looking for something specific?{" "}
          <Link to="/services" className="font-semibold text-brand hover:underline">
            Browse all services →
          </Link>
        </p>
      </div>
    </section>
  );
}
