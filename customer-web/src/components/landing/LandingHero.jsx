import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { LiveTrackingMockup } from "./LiveTrackingMockup";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-10 md:pb-16 md:pt-12">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-canvas" />
      <div className="page-gutter content-max">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="animate-fade-up max-w-xl">
            <p className="type-label text-brand">
              <span className="mr-2 inline-block size-2 animate-pulse-live rounded-full bg-success align-middle" />
              Live · Delhi NCR
            </p>

            <h1 className="mt-5 font-display text-[2.75rem] font-light leading-[1.05] tracking-tight text-ink md:text-[3.25rem]">
              Feel better in
              <br />
              <span className="text-brand">minutes.</span>
            </h1>

            <p className="mt-6 type-body-lg text-sub">
              At-home wellness by verified experts.
              <br />
              Usually here within 15 minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/services" className="w-full sm:w-auto">
                Book a session <ArrowRight size={18} />
              </Button>
              <a href="tel:+911800000000" className="type-body font-semibold text-brand hover:underline">
                Call us
              </a>
            </div>
          </div>

          <div className="animate-fade-up animate-delay-4 lg:justify-self-end">
            <LiveTrackingMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
