import { Check } from "lucide-react";
import { getTrackingSteps } from "../../lib/bookingStatus";
import { LIVE_TRACKING_STATUSES } from "../../lib/bookingJourney";

export function SessionTimeline({ booking, embedded = false }) {
  const steps = getTrackingSteps(booking);
  const isLive = LIVE_TRACKING_STATUSES.includes(booking?.status);

  const content = (
    <>
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
              {step.sublabel && step.state !== "upcoming" ? (
                <p
                  className={`mt-0.5 text-xs ${
                    step.state === "current" ? "text-accent" : "text-muted"
                  }`}
                >
                  {step.state === "current" ? step.sublabel : step.sublabel}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </>
  );

  if (embedded) return content;

  return (
    <div className="rounded-xl border border-border bg-white p-6">{content}</div>
  );
}
