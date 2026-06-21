import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { formatStatus, ACTIVE_STATUSES } from "../../lib/bookingStatus";
import {
  sessionTitle,
  formatSessionDate,
  formatCurrency,
} from "../../lib/dashboardStats";
import { SessionTimeline } from "../../components/dashboard/SessionTimeline";
import { BookingMap } from "../../components/tracking/BookingMap";
import { Skeleton } from "../../components/ui/Skeleton";
import { friendlyError, cancelReasonMessage, toastMessages } from "../../lib/messages";
import { useToast } from "../../context/ToastContext";
import { getSocket } from "../../socket";

const MAP_STATUSES = ["assigned", "in_progress"];

export function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [booking, setBooking] = useState(null);
  const [expertLoc, setExpertLoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = useCallback(async () => {
    const b = await bookingService.get(id);
    setBooking(b);
    if (b.expert?.lastLocation?.lat != null) {
      setExpertLoc({
        lat: b.expert.lastLocation.lat,
        lng: b.expert.lastLocation.lng,
      });
    }
    return b;
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    let socket;

    async function init() {
      try {
        const b = await loadBooking();
        if (cancelled) return;

        try {
          socket = await getSocket();
          socket.emit("booking:subscribe", { bookingId: id });

          socket.on("booking:status", (payload) => {
            setBooking((prev) => (prev ? { ...prev, status: payload.status } : prev));
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

          socket.on("booking:failed", ({ reason }) => {
            toast.error(cancelReasonMessage(reason));
            loadBooking().catch(() => {});
          });
        } catch {
          /* socket optional — polling still works */
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
        socket.off("booking:failed");
      }
    };
  }, [id, loadBooking, toast]);

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
  const isCancelled = booking.status === "cancelled";

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
      {isSearching && (
        <p className="mt-2 text-sm text-sub">{toastMessages.findingExperts}</p>
      )}
      {isCancelled && (
        <p className="mt-2 text-sm text-sub">{cancelReasonMessage(booking.cancelReason)}</p>
      )}
      <p className="mt-2 text-lg font-semibold text-ink lg:text-2xl">
        {formatCurrency(booking.pricing?.total)}
      </p>
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
                <span className="text-sub">{item.name}</span>
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
          {showMap && (
            <BookingMap booking={booking} expertLocation={expertLoc} />
          )}
          {isSearching && booking.location?.lat != null && (
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
    </div>
  );
}
