import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Star } from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { catalogService } from "../../services/catalogService";
import { formatStatus, ACTIVE_STATUSES } from "../../lib/bookingStatus";
import {
  sessionTitle,
  formatSessionDate,
  formatCurrency,
} from "../../lib/dashboardStats";
import { SessionTimeline } from "../../components/dashboard/SessionTimeline";
import { BookingMap } from "../../components/tracking/BookingMap";
import { Skeleton } from "../../components/ui/Skeleton";
import { Button } from "../../components/ui/Button";
import { SlideOver } from "../../components/dashboard/SlideOver";
import { friendlyError, cancelReasonMessage, toastMessages } from "../../lib/messages";
import { useToast } from "../../context/ToastContext";
import { getSocket } from "../../socket";

const MAP_STATUSES = ["assigned", "in_progress"];
const ADDON_STATUSES = ["assigned", "in_progress"];

export function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [booking, setBooking] = useState(null);
  const [expertLoc, setExpertLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [addonOpen, setAddonOpen] = useState(false);
  const [addonServices, setAddonServices] = useState([]);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  const loadBooking = useCallback(async () => {
    const b = await bookingService.get(id);
    setBooking(b);
    if (b.expert?.lastLocation?.lat != null) {
      setExpertLoc({
        lat: b.expert.lastLocation.lat,
        lng: b.expert.lastLocation.lng,
      });
    }
    if (b.rating?.stars) setRatingStars(b.rating.stars);
    if (b.rating?.comment) setRatingComment(b.rating.comment);
    return b;
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    let socket;

    async function init() {
      try {
        await loadBooking();
        if (cancelled) return;

        try {
          socket = await getSocket();
          socket.emit("booking:subscribe", { bookingId: id });

          socket.on("booking:status", () => {
            loadBooking().catch(() => {});
          });

          socket.on("booking:assigned", (data) => {
            loadBooking().catch(() => {});
            if (data.expert?.location) setExpertLoc(data.expert.location);
            toast.success("Expert assigned");
          });

          socket.on("booking:expert_location", ({ lat, lng }) => {
            setExpertLoc({ lat, lng });
          });

          socket.on("booking:addon", () => {
            loadBooking().catch(() => {});
            toast.success("Add-on added to your session");
          });

          socket.on("booking:failed", ({ reason }) => {
            toast.error(cancelReasonMessage(reason));
            loadBooking().catch(() => {});
          });
        } catch {
          /* socket optional */
        }
      } catch (e) {
        if (!cancelled) toast.error(friendlyError(e.message));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    const interval = setInterval(() => {
      loadBooking().catch(() => {});
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (socket) {
        socket.emit("booking:unsubscribe", { bookingId: id });
        socket.off("booking:status");
        socket.off("booking:assigned");
        socket.off("booking:expert_location");
        socket.off("booking:addon");
        socket.off("booking:failed");
      }
    };
  }, [id, loadBooking, toast]);

  async function openAddOns() {
    setBusy(true);
    try {
      const all = await catalogService.listServices();
      setAddonServices(all.filter((s) => s.addOnEligible));
      setAddonOpen(true);
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setBusy(false);
    }
  }

  async function pickAddOn(svc) {
    setAddonOpen(false);
    setBusy(true);
    try {
      await bookingService.addOn(id, svc.id);
      await loadBooking();
      toast.success("Add-on added");
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setBusy(false);
    }
  }

  async function payNow() {
    setBusy(true);
    try {
      await bookingService.pay(id);
      await loadBooking();
      toast.success("Payment successful");
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setBusy(false);
    }
  }

  async function submitRating() {
    setBusy(true);
    try {
      await bookingService.rate(id, ratingStars, ratingComment);
      await loadBooking();
      toast.success("Thanks for your feedback!");
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setBusy(false);
    }
  }

  async function cancelBooking() {
    if (!window.confirm("Cancel this booking? You won't be charged.")) return;
    setBusy(true);
    try {
      await bookingService.cancel(id);
      toast.success("Booking cancelled");
      navigate("/app/orders");
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 lg:grid lg:grid-cols-5 lg:gap-8 lg:space-y-0">
        <Skeleton className="h-8 w-40 lg:col-span-5" />
        <Skeleton className="h-64 rounded-2xl lg:col-span-3" />
        <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
      </div>
    );
  }

  if (!booking) {
    return (
      <p className="text-sub">
        Order not found.{" "}
        <Link to="/app/orders" className="font-medium text-accent">
          Back to My Orders
        </Link>
      </p>
    );
  }

  const title = sessionTitle(booking);
  const isLive = ACTIVE_STATUSES.includes(booking.status);
  const showMap = MAP_STATUSES.includes(booking.status);
  const isSearching = booking.status === "searching";
  const isScheduled = booking.status === "scheduled";
  const isCancelled = booking.status === "cancelled";
  const canAddOn = ADDON_STATUSES.includes(booking.status);
  const needsPay = booking.status === "completed" && booking.payment?.status !== "paid";
  const canRate = booking.status === "completed" && !booking.rating?.stars;
  const canCancel = !["completed", "cancelled"].includes(booking.status);

  const summaryCard = (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink lg:text-xl">{title}</h2>
          <p className="mt-1 text-sm text-sub">{formatSessionDate(booking.createdAt)}</p>
        </div>
        {isLive && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            Live
          </span>
        )}
      </div>
      <p className="mt-3 text-base font-medium text-accent">
        {formatStatus(booking.status)}
        {booking.quotedEtaMin && booking.status === "assigned"
          ? ` · ~${booking.quotedEtaMin} min`
          : ""}
      </p>
      {isScheduled && booking.scheduledFor && (
        <p className="mt-2 text-sm text-sub">
          Scheduled for {new Date(booking.scheduledFor).toLocaleString()}
        </p>
      )}
      {isSearching && (
        <p className="mt-2 text-sm text-sub">{toastMessages.findingExperts}</p>
      )}
      {isCancelled && (
        <p className="mt-2 text-sm text-sub">{cancelReasonMessage(booking.cancelReason)}</p>
      )}
      <p className="mt-2 text-lg font-semibold text-ink lg:text-2xl">
        {formatCurrency(booking.pricing?.total)}
      </p>
      {booking.pricing?.surgeMultiplier > 1 && (
        <p className="mt-1 text-xs text-muted">
          Includes surge pricing ({booking.pricing.surgeMultiplier}×)
        </p>
      )}
      {booking.pricing?.discount > 0 && (
        <p className="mt-1 text-xs text-accent">
          Coupon {booking.couponCode} saved {formatCurrency(booking.pricing.discount)}
        </p>
      )}
    </div>
  );

  const actionCard = (canAddOn || needsPay || canRate || canCancel) && (
    <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Actions</p>
      {canAddOn && (
        <Button variant="secondary" className="w-full" onClick={openAddOns} disabled={busy}>
          <Plus size={18} />
          Add another session
        </Button>
      )}
      {needsPay && (
        <Button variant="accent" className="w-full" onClick={payNow} disabled={busy}>
          Pay {formatCurrency(booking.pricing?.total)}
        </Button>
      )}
      {canRate && (
        <div className="space-y-3 rounded-xl bg-surface/80 p-4">
          <p className="text-sm font-medium text-ink">Rate your session</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRatingStars(n)}
                className="p-1"
                aria-label={`${n} stars`}
              >
                <Star
                  size={28}
                  className={n <= ratingStars ? "fill-gold text-gold" : "text-border"}
                />
              </button>
            ))}
          </div>
          <textarea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Optional feedback…"
            rows={2}
            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/20"
          />
          <Button variant="primary" className="w-full" onClick={submitRating} disabled={busy}>
            Submit rating
          </Button>
        </div>
      )}
      {booking.rating?.stars && (
        <p className="text-sm text-sub">
          You rated this {booking.rating.stars}★
          {booking.rating.comment ? ` — "${booking.rating.comment}"` : ""}
        </p>
      )}
      {canCancel && (
        <Button variant="ghost" className="w-full text-red-600" onClick={cancelBooking} disabled={busy}>
          Cancel booking
        </Button>
      )}
    </div>
  );

  const detailsCards = (
    <>
      {booking.expert?.name && (
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Expert</p>
          <p className="mt-2 font-semibold text-ink">{booking.expert.name}</p>
          {booking.expert.phone && (
            <p className="mt-1 text-sm text-sub">{booking.expert.phone}</p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-white p-5 lg:p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Address</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {booking.location?.address || "Address on file"}
        </p>
      </div>

      {(booking.items || []).length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Services</p>
          <ul className="mt-3 space-y-2">
            {booking.items.map((item) => (
              <li key={item.id || item.name} className="flex justify-between text-sm">
                <span className="text-sub">
                  {item.name}
                  {item.isAddOn ? " (add-on)" : ""}
                </span>
                <span className="font-medium text-ink">{formatCurrency(item.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <div className="-mt-2 lg:mt-0">
      <button
        type="button"
        onClick={() => navigate("/app/orders")}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-accent lg:mb-6"
      >
        <ArrowLeft size={18} />
        My Orders
      </button>

      <div className="lg:grid lg:grid-cols-5 lg:gap-8">
        <div className="space-y-4 lg:col-span-3">
          {summaryCard}
          {actionCard}
          {showMap && <BookingMap booking={booking} expertLocation={expertLoc} />}
          {(isSearching || isScheduled) && booking.location?.lat != null && (
            <BookingMap booking={booking} expertLocation={null} />
          )}
          <div className="rounded-2xl border border-border bg-white p-5 lg:p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">
              Progress
            </p>
            <SessionTimeline booking={booking} />
          </div>
        </div>

        <div className="mt-4 space-y-4 lg:col-span-2 lg:mt-0">{detailsCards}</div>
      </div>

      <SlideOver open={addonOpen} onClose={() => setAddonOpen(false)} title="Add a session">
        <div className="space-y-2">
          {addonServices.length === 0 ? (
            <p className="text-sm text-sub">No add-ons available right now.</p>
          ) : (
            addonServices.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => pickAddOn(s)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-left hover:bg-surface"
              >
                <div>
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-sub">{s.durationMin} min</p>
                </div>
                <span className="font-semibold text-ink">{formatCurrency(s.price)}</span>
              </button>
            ))
          )}
        </div>
      </SlideOver>
    </div>
  );
}
