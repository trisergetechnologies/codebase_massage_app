import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { brand } from "../../content/brand";

const FAQ = [
  {
    q: "Is this medical treatment?",
    a: "No. Our services are for general wellness and relaxation — not medical treatment, diagnosis, or emergency care.",
  },
  {
    q: "How quickly can someone arrive?",
    a: "Most experts arrive within 15 minutes, depending on availability near your address.",
  },
  {
    q: "What's included in a session?",
    a: "A trained expert at your home for the booked duration, using defined service standards for your chosen relief session.",
  },
  {
    q: "How do you verify experts?",
    a: "Every expert completes training and verification before becoming active on the platform.",
  },
  {
    q: "What if I'm not happy with the session?",
    a: "Contact support after your session. We take ratings and feedback seriously.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-canvas py-16 md:py-20">
      <div className="page-gutter content-max max-w-2xl">
        <h2 className="type-h1 text-ink">Common questions</h2>
        <div className="mt-8 divide-y divide-border">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left type-body font-semibold text-ink"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-muted transition-transform duration-default ease-out ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen ? (
                  <p className="pb-4 type-body text-sub">{item.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
