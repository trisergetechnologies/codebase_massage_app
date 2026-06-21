import { BadgeCheck, MapPin, Navigation } from "lucide-react";

/** Product UI mockup — no stock photography */
export function HeroMockup() {
  return (
    <div
      className="relative w-full max-w-[440px] justify-self-center lg:justify-self-end"
      aria-hidden="true"
    >
      <div className="rounded-2xl border border-border bg-white p-2 shadow-lg">
        <div className="rounded-xl bg-surface p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-medium text-muted">Your booking</p>
              <p className="mt-1 text-lg font-semibold text-ink">Expert assigned</p>
            </div>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              Active
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-white p-4">
            <span className="grid size-12 place-items-center rounded-full bg-accent-muted text-accent">
              <BadgeCheck size={22} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">Verified expert</p>
              <p className="text-sm text-muted">Training completed · ID verified</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-accent/20 bg-accent-soft p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-sub">Arrival ETA</p>
              <p className="text-2xl font-semibold tracking-tight text-accent">12 min</p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Navigation size={16} className="text-accent" />
              <span>On the way to you</span>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm text-sub">
              <MapPin size={16} className="mt-0.5 shrink-0 text-muted" />
              <span>Service at your address</span>
            </div>
            <div className="flex justify-between rounded-lg bg-white px-3 py-3 text-sm">
              <span className="font-medium text-ink">Neck Relief</span>
              <span className="font-semibold text-ink">Transparent price</span>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full w-[72%] rounded-full bg-accent" />
          </div>
          <p className="mt-2 text-center text-xs text-muted">Track arrival in real time</p>
        </div>
      </div>

      <div className="absolute -left-4 top-1/4 hidden rounded-xl border border-border bg-white px-4 py-3 shadow-md md:block">
        <p className="text-xs font-medium text-muted">Status</p>
        <p className="font-semibold text-ink">Matched</p>
      </div>
      <div className="absolute -right-2 bottom-8 hidden rounded-xl border border-border bg-white px-4 py-3 shadow-md md:block">
        <p className="text-xs font-medium text-muted">Next</p>
        <p className="font-semibold text-accent">Feel better</p>
      </div>
    </div>
  );
}
