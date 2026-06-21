import { SectionHeader } from "../ui/SectionHeader";

/** Layout placeholders — no fabricated quotes */
const placeholders = [
  { role: "Working professional", location: "Urban area" },
  { role: "Remote worker", location: "Suburban area" },
  { role: "Daily commuter", location: "Metro area" },
];

export function TestimonialsSection() {
  return (
    <section className="bg-surface py-20 md:py-28" aria-label="Customer stories">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeader
          label="Experiences"
          title="Consistent experience, every session"
          description="Every session follows defined service standards. Professional conduct is mandatory during every interaction."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {placeholders.map((p, i) => (
            <article
              key={i}
              className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-dashed border-border bg-white p-8"
            >
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-surface" />
                <div className="h-3 w-[90%] rounded bg-surface" />
                <div className="h-3 w-[75%] rounded bg-surface" />
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-sm font-semibold text-ink">{p.role}</p>
                <p className="text-sm text-muted">{p.location}</p>
                <p className="mt-2 text-xs text-muted">Testimonial placeholder</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
