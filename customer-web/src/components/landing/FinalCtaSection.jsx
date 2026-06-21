import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { brand } from "../../content/brand";

export function FinalCtaSection() {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest px-8 py-16 text-center md:px-16 md:py-20">
          <div className="absolute inset-0 bg-cta-glow opacity-60" aria-hidden />
          <div className="landing-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">
              {brand.cta.headline}
            </p>
            <h2 className="mt-4 font-display text-section font-extrabold tracking-tight text-white md:text-section-lg">
              Feel better in minutes, at home
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/75 md:text-xl">
              {brand.shortDescription}
            </p>
            <Link
              to="/services"
              className="mt-10 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-10 text-base font-bold text-forest shadow-xl transition hover:bg-sand"
            >
              {brand.cta.primary}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
