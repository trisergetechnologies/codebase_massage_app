import { getJourneyVisibility } from "../../lib/bookingJourney";
import { getJourneyCopy } from "../../lib/bookingStatus";
import { formatCurrency } from "../../lib/dashboardStats";

export function BookingJourneyHero({ booking, candidateEtaMin, onPay, paying }) {
  const { headline, subcopy, showSearchPulse } = getJourneyCopy(booking, { candidateEtaMin });
  const visibility = getJourneyVisibility(booking);
  const isAwaiting = booking?.status === "awaiting_payment";
  const showPayBanner = onPay && visibility.needsPayment;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-forest to-forest-mid p-6 text-white shadow-md lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
            {headline}
          </h2>
          {subcopy ? (
            <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">{subcopy}</p>
          ) : null}
        </div>
        {showSearchPulse ? (
          <span
            className="relative mt-1 grid size-12 shrink-0 place-items-center rounded-full bg-white/10"
            aria-hidden
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-teal-400/30" />
            <span className="relative size-3 rounded-full bg-teal-300" />
          </span>
        ) : null}
      </div>

      {booking?.pricing?.total != null && visibility.showPayPrimary ? (
        <p className="mt-5 text-lg font-semibold text-white/90">
          {formatCurrency(booking.pricing.total)}
        </p>
      ) : null}

      {showPayBanner ? (
        <div
          className={`mt-6 rounded-xl border p-4 backdrop-blur-sm ${
            isAwaiting
              ? "border-white/15 bg-white/10"
              : "border-amber-200/30 bg-amber-400/10"
          }`}
        >
          <p className="text-sm text-white/80">
            {isAwaiting
              ? "Payment is required before we can find an expert."
              : booking?.status === "in_progress"
                ? "Pay before your session ends."
                : "Pay anytime before your session ends."}
          </p>
          <button
            type="button"
            onClick={onPay}
            disabled={paying}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-forest transition hover:bg-sand disabled:opacity-60 sm:w-auto"
          >
            {paying ? "Processing…" : `Pay ${formatCurrency(booking.pricing?.total)}`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
