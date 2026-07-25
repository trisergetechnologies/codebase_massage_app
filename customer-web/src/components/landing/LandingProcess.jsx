import { useEffect, useState } from "react";

const STEPS = [
  { title: "Choose relief", caption: "Matched in seconds" },
  { title: "Finding experts…", caption: "Usually under 2 minutes" },
  { title: "Expert on the way", caption: "Track arrival live" },
  { title: "Done. Relief found.", caption: "Rate your session" },
];

export function LandingProcess() {
  const [index, setIndex] = useState(0);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % STEPS.length), 2000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="page-gutter content-max text-center">
        <h2 className="type-display-md text-ink">
          From booking to relief,
          <br />
          in under 15 minutes.
        </h2>

        <div className="mx-auto mt-12 max-w-md rounded-card border border-border bg-surface-2 p-8">
          {reduced ? (
            <div className="flex justify-center gap-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="text-center">
                  <div className="mx-auto grid size-10 place-items-center rounded-full bg-accent text-sm font-semibold text-white">
                    {i + 1}
                  </div>
                  <p className="mt-2 type-caption text-muted">{s.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[120px]">
              <p className="type-h2 text-ink">{STEPS[index].title}</p>
              <p className="mt-2 type-body text-muted">{STEPS[index].caption}</p>
              {index === 1 ? (
                <div className="mt-6 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-3 animate-search-ring rounded-full bg-brand"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
