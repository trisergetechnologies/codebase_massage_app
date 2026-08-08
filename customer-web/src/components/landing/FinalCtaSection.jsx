import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { brand } from "../../content/brand";

export function FinalCtaSection() {
  return (
    <section className="section-pad bg-sand">
      <div className="container-premium">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-12 text-center shadow-premium-lg md:px-12 md:py-16">
          <div className="absolute inset-0 bg-cta-glow opacity-70" aria-hidden />
          <div className="landing-noise pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-teal-400/20 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <p className="eyebrow-light">{brand.cta.headline}</p>
            <h2 className="mt-4 font-display text-section font-extrabold tracking-tight text-white md:text-section-lg">
              Feel better in minutes, at home
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/70 md:text-xl">
              {brand.shortDescription}
            </p>
            <Link to="/services" className="btn-premium-primary mt-8">
              {brand.cta.primary}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
