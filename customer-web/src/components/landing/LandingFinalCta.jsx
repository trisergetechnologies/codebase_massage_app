import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function LandingFinalCta() {
  return (
    <section className="bg-forest px-5 py-20 text-center text-white md:py-24">
      <div className="content-max">
        <h2 className="font-display text-4xl font-light md:text-5xl">Ready for relief?</h2>
        <p className="mx-auto mt-4 max-w-md type-body-lg text-forest-200">
          Book in 60 seconds. Expert at your door.
        </p>
        <Button href="/services" variant="inverse" className="mx-auto mt-8 w-[240px]">
          Book a session <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}
