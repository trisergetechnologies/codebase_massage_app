import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, CheckCircle2, HeartHandshake, ShieldCheck } from "lucide-react";
import { brand } from "../content/brand";

/** Add real roles here when hiring — the list UI maps this array. */
const openRoles = [];

const HOW_WE_WORK = [
  {
    Icon: CheckCircle2,
    title: "Reliable",
    body: "Clear standards, consistent delivery, and accountability in every role.",
  },
  {
    Icon: ShieldCheck,
    title: "Safe",
    body: "Verification, training, and professional conduct come first.",
  },
  {
    Icon: HeartHandshake,
    title: "Respectful",
    body: "Privacy, dignity, and care for customers and teammates alike.",
  },
];

export function CareersPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-sand">
        <div
          className="pointer-events-none absolute -right-20 top-0 size-80 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 size-72 rounded-full bg-gold/10 blur-3xl"
          aria-hidden
        />
        <div className="container-premium relative py-16 md:py-24">
          <p className="eyebrow">Careers at ReliefHai</p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-ink md:text-[3.25rem]">
            Build everyday relief{" "}
            <span className="text-accent">with us</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-sub">
            {brand.vision}
          </p>
          <div className="mt-8">
            <Link
              to="/support"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-white px-8 text-base font-bold text-ink shadow-sm transition hover:border-accent/30 hover:shadow-md"
            >
              Contact
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="container-premium py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">How we work</p>
          <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
            Principles that shape the team
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-sub">{brand.shortDescription}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {HOW_WE_WORK.map(({ Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm sm:p-7"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10">
                <Icon size={20} strokeWidth={1.9} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-sub">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-surface py-14 md:py-20">
        <div className="container-premium">
          <div className="max-w-2xl">
            <p className="eyebrow">Open roles</p>
            <h2 className="mt-3 font-display text-[1.75rem] font-extrabold tracking-tight text-ink md:text-4xl">
              Current openings
            </h2>
          </div>

          <div className="mt-8">
            {openRoles.length > 0 ? (
              <ul className="space-y-3">
                {openRoles.map((role) => (
                  <li
                    key={role.id || role.title}
                    className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-display text-base font-bold text-ink">{role.title}</p>
                      {role.location ? (
                        <p className="mt-1 text-sm text-sub">{role.location}</p>
                      ) : null}
                    </div>
                    {role.href ? (
                      <Link
                        to={role.href}
                        className="mt-2 text-sm font-semibold text-accent hover:text-accent-hover sm:mt-0"
                      >
                        View role
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent"
                  aria-hidden
                />
                <span className="relative mx-auto grid size-12 place-items-center rounded-2xl bg-surface text-muted ring-1 ring-border/80">
                  <Briefcase size={22} strokeWidth={1.75} />
                </span>
                <h3 className="relative mt-5 font-display text-xl font-bold tracking-tight text-ink">
                  No open roles right now
                </h3>
                <p className="relative mx-auto mt-2 max-w-md text-[15px] leading-7 text-sub">
                  We&apos;re not hiring for office roles at the moment. Check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-premium py-14 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-forest px-6 py-12 text-center shadow-premium-lg sm:px-10 md:py-16">
          <div
            className="pointer-events-none absolute -left-16 top-0 size-64 rounded-full bg-accent/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-12 bottom-0 size-72 rounded-full bg-gold/15 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              Wellness experts
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join as a verified expert
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-white/70">
              {brand.trustStatement}
            </p>
            <Link
              to="/how-it-works"
              className="group mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-bold text-forest shadow-md transition hover:bg-white/90"
            >
              Learn how it works
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
