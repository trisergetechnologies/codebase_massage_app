import { Check } from "lucide-react";
import { getTrackingSteps } from "../../lib/bookingStatus";
import { ACTIVE_STATUSES } from "../../lib/bookingStatus";

export function SessionTimeline({ booking }) {
  const steps = getTrackingSteps(booking);
  const isLive = ACTIVE_STATUSES.includes(booking?.status);

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Session progress
        </h2>
        {isLive && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Live
          </span>
        )}
      </div>
      <ol className="space-y-0">
        {steps.map((step, i) => (
          <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                  step.state === "complete" ? "bg-accent" : "bg-border"
                }`}
              />
            )}
            <span
              className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full ${
                step.state === "complete"
                  ? "bg-accent text-white"
                  : step.state === "current"
                    ? "border-2 border-accent bg-white text-accent"
                    : "border border-border bg-white text-muted"
              }`}
            >
              {step.state === "complete" ? <Check size={14} strokeWidth={3} /> : null}
            </span>
            <div className="pt-0.5">
              <p
                className={`text-sm font-medium ${
                  step.state === "upcoming" ? "text-muted" : "text-ink"
                }`}
              >
                {step.label}
              </p>
              {step.state === "current" && (
                <p className="mt-0.5 text-xs text-accent">In progress</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
