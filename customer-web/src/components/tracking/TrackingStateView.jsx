import { useEffect, useMemo, useState } from "react";
import { formatCurrency, sessionTitle } from "../../lib/dashboardStats";
import { getJourneyCopy } from "../../lib/bookingStatus";
import { getJourneyVisibility } from "../../lib/bookingJourney";
import { journeyMessages } from "../../lib/messages";
import { BookingMap } from "./BookingMap";
import { Chip } from "../ui/Chip";
import { Button } from "../ui/Button";

function SearchRings() {
  return (
    <div className="relative mx-auto grid size-32 place-items-center" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-0 rounded-full border border-forest-400/40 animate-search-ring"
          style={{ animationDelay: `${i * 0.8}s` }}
        />
      ))}
      <span className="size-4 rounded-full bg-forest-300" />
    </div>
  );
}

function SessionTimer({ startedAt, bookedMin }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) return undefined;
    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  const display = `${m}:${String(s).padStart(2, "0")}`;
  const overBooked = bookedMin > 0 && elapsed > bookedMin * 60;

  return (
    <p
      className={`type-timer text-white ${overBooked ? "text-red-300" : ""}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {display}
    </p>
  );
}

function ExpertRow({ expert, showCall = false }) {
  if (!expert?.name) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-12 place-items-center rounded-full bg-forest-50 text-sm font-semibold text-brand ring-2 ring-forest-100">
        {expert.name.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="type-h3 text-ink">{expert.name}</p>
        <p className="type-caption text-muted">
          ★ {(expert.rating ?? 0).toFixed(1)} · Head & Shoulder Relief
        </p>
      </div>
      {showCall && expert.phone ? (
        <a href={`tel:${expert.phone}`} className="type-button-sm text-brand">
          Call
        </a>
      ) : null}
    </div>
  );
}

function ReceiptBlock({ booking }) {
  return (
    <div>
      <p className="type-label text-muted">Receipt</p>
      <ul className="mt-3 space-y-2">
        {(booking.items || []).map((item) => (
          <li key={item.id || item.name} className="flex justify-between type-body-sm">
            <span className="text-sub">{item.name}</span>
            <span className="font-medium tabular-nums text-ink">{formatCurrency(item.price)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between border-t border-border pt-4 type-h3">
        <span>Total</span>
        <span className="tabular-nums">{formatCurrency(booking.pricing?.total)}</span>
      </p>
    </div>
  );
}

export function TrackingStateView({
  booking,
  candidateEtaMin,
  expertLoc,
  onPay,
  paying,
  onCancel,
  cancelling,
}) {
  const visibility = getJourneyVisibility(booking);
  const copy = getJourneyCopy(booking, { candidateEtaMin });
  const eta = booking.liveEtaMin ?? booking.quotedEtaMin ?? candidateEtaMin;
  const title = sessionTitle(booking);
  const status = booking.status;

  const payBanner = visibility.needsPayment && onPay && (
    <div className="mb-4 rounded-card border border-amber-200 bg-warning-bg px-4 py-3">
      <p className="type-body-sm text-warning">
        {status === "in_progress"
          ? journeyMessages.payBeforeSessionEnds
          : journeyMessages.payLaterBanner}
      </p>
      <Button
        variant="primary"
        size="md"
        className="mt-3 w-full"
        onClick={onPay}
        loading={paying}
      >
        Pay {formatCurrency(booking.pricing?.total)}
      </Button>
    </div>
  );

  if (status === "assigned") {
    return (
      <div className="relative -mx-4 flex min-h-[calc(100dvh-56px)] flex-col lg:mx-0 lg:min-h-[70vh] lg:flex-row">
        <div className="relative h-[55vh] min-h-[280px] lg:h-auto lg:flex-1">
          <BookingMap booking={booking} expertLocation={expertLoc} mode="live" fullscreen />
        </div>
        <div className="relative z-10 -mt-6 flex-1 rounded-t-modal bg-surface px-5 pb-8 pt-3 shadow-xl lg:mt-0 lg:max-w-[380px] lg:rounded-none lg:shadow-none">
          <div className="mx-auto mb-3 h-1 w-9 rounded-sm bg-slate-200" />
          {visibility.showPaySecondary ? payBanner : null}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[2rem] font-light tabular-nums text-ink">
                {eta != null ? `${eta} min away` : "On the way"}
              </p>
              <p className="mt-1 type-caption text-muted">
                {booking.distanceKm != null ? `${booking.distanceKm} km` : ""}
                {booking.location?.address ? ` · ${booking.location.address.split(",")[0]}` : ""}
              </p>
            </div>
            <Chip variant="live" pulse>
              Live
            </Chip>
          </div>
          <div className="mt-6 border-t border-border pt-6">
            <ExpertRow expert={booking.expert} showCall />
          </div>
          <details className="mt-6 group">
            <summary className="cursor-pointer type-body-sm font-semibold text-brand">
              Session & address details
            </summary>
            <div className="mt-4 space-y-4">
              <p className="type-body-sm text-sub">{booking.location?.address}</p>
              <ReceiptBlock booking={booking} />
              {visibility.showCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={cancelling}
                  className="type-body-sm text-muted hover:text-error"
                >
                  {cancelling ? "Cancelling…" : "Cancel booking"}
                </button>
              ) : null}
            </div>
          </details>
        </div>
      </div>
    );
  }

  if (status === "in_progress") {
    const bookedMin = copy.bookedMin || 60;
    const elapsedSec =
      booking.timeline?.startedAt
        ? Math.floor((Date.now() - new Date(booking.timeline.startedAt)) / 1000)
        : 0;
    const progress = Math.min(100, bookedMin > 0 ? (elapsedSec / (bookedMin * 60)) * 100 : 0);

    return (
      <div className="space-y-0">
        <div className="hero-card-dark px-6 py-12 text-center">
          <p className="type-label text-forest-400">In progress</p>
          <div className="mt-4">
            <SessionTimer startedAt={booking.timeline?.startedAt} bookedMin={bookedMin} />
          </div>
          <p className="mt-3 type-body-sm text-forest-200">
            of {bookedMin} min booked
          </p>
        </div>
        <div className="rounded-t-modal bg-surface px-5 py-6 shadow-xl">
          <div className="mx-auto mb-4 h-1 w-9 rounded-sm bg-slate-200" />
          <ExpertRow expert={booking.expert} />
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-sand-deep">
            <div
              className="h-full rounded-full bg-accent transition-all duration-default"
              style={{ width: `${progress}%` }}
            />
          </div>
          {payBanner}
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="space-y-0">
        <div className="hero-card-dark px-6 py-10">
          <p className="flex items-center gap-2 font-display text-2xl font-light text-white">
            <span aria-hidden>✓</span> {copy.headline}
          </p>
          <p className="mt-2 type-body-sm text-forest-200">{copy.subcopy}</p>
        </div>
        <div className="rounded-t-modal bg-surface px-5 py-6">
          <div className="flex items-start justify-between gap-3">
            <ExpertRow expert={booking.expert} />
            <button type="button" className="type-button-sm text-brand">
              Rate this session
            </button>
          </div>
          <div className="mt-6">
            <ReceiptBlock booking={booking} />
          </div>
          {visibility.needsPayment && onPay ? (
            <Button className="mt-6 w-full" onClick={onPay} loading={paying}>
              Pay {formatCurrency(booking.pricing?.total)}
            </Button>
          ) : (
            <p className="mt-4 type-caption text-muted">Paid</p>
          )}
          <Button variant="secondary" className="mt-4 w-full" href="/services">
            Book another session →
          </Button>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="space-y-0">
        <div className="rounded-[20px] bg-slate-700 px-6 py-10 text-white">
          <p className="flex items-center gap-2 font-display text-2xl font-light">
            <span aria-hidden>✕</span> {copy.headline}
          </p>
          <p className="mt-2 type-body-sm text-forest-200">{copy.subcopy}</p>
        </div>
        <div className="mt-4 rounded-card bg-surface p-5">
          <p className="type-label text-muted">What was booked</p>
          <ReceiptBlock booking={booking} />
          {copy.isNoExpert ? (
            <p className="mt-4 type-body-sm text-sub">
              Try booking again in a few minutes, or choose a different service.
            </p>
          ) : null}
          <Button className="mt-6 w-full" href="/services">
            Try again →
          </Button>
          <Button variant="ghost" className="mt-2 w-full" href="/app/orders">
            Back to orders
          </Button>
        </div>
      </div>
    );
  }

  if (status === "awaiting_payment") {
    return (
      <div className="space-y-0">
        <div className="hero-card-dark min-h-[240px] px-6 py-10">
          <p className="text-2xl" aria-hidden>
            ⏸
          </p>
          <h2 className="mt-4 font-display text-[1.75rem] font-light text-white">
            Complete payment to find your expert.
          </h2>
          <p className="mt-3 type-body-sm text-forest-200">
            Experts are ready. We just need payment confirmation.
          </p>
        </div>
        <div className="rounded-t-modal bg-surface px-5 py-6 shadow-xl">
          <div className="mx-auto mb-4 h-1 w-9 rounded-sm bg-slate-200" />
          <p className="type-body font-semibold text-ink">{title}</p>
          <p className="mt-1 type-price tabular-nums">{formatCurrency(booking.pricing?.total)}</p>
          <ReceiptBlock booking={booking} />
          <Button className="mt-6 h-14 w-full" onClick={onPay} loading={paying}>
            Pay {formatCurrency(booking.pricing?.total)} →
          </Button>
          {visibility.showCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={cancelling}
              className="mt-4 w-full type-body-sm text-muted hover:text-ink"
            >
              {cancelling ? "Cancelling…" : "Cancel booking"}
            </button>
          ) : null}
          <p className="mt-4 text-center type-caption text-muted">
            {journeyMessages.awaitingPaymentNote}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="hero-card-dark min-h-[280px] px-6 py-10 text-center">
        {visibility.showSearchAnimation ? <SearchRings /> : null}
        <h2 className="mt-6 font-display text-[1.625rem] font-light text-white">{copy.headline}</h2>
        <p className="mt-3 type-body-sm text-forest-200">{copy.subcopy}</p>
      </div>
      <div className="rounded-t-modal bg-surface px-5 py-6 shadow-xl">
        <div className="mx-auto mb-4 h-1 w-9 rounded-sm bg-slate-200" />
        <p className="type-body text-ink">{booking.location?.address}</p>
        <p className="mt-1 type-caption text-muted">{title}</p>
        {payBanner}
        {visibility.showCancel ? (
          <Button variant="secondary" className="mt-6 w-full" onClick={onCancel} loading={cancelling}>
            Cancel booking
          </Button>
        ) : null}
      </div>
    </div>
  );
}
