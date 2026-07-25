import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { friendlyError, cancelReasonMessage, toastMessages } from "../../lib/messages";
import { useToast } from "../../context/ToastContext";
import { getSocket } from "../../socket";
import { SkeletonTracking } from "../../components/ui/Skeleton";
import { TrackingStateView } from "../../components/tracking/TrackingStateView";

export function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [booking, setBooking] = useState(null);
  const [expertLoc, setExpertLoc] = useState(null);
  const [candidateEtaMin, setCandidateEtaMin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
        await loadBooking();
        if (cancelled) return;

        try {
          socket = await getSocket();
          socket.emit("booking:subscribe", { bookingId: id });

          socket.on("booking:status", (payload) => {
            setBooking((prev) =>
              prev
                ? {
                    ...prev,
                    status: payload.status,
                    cancelReason: payload.cancelReason ?? prev.cancelReason,
                  }
                : prev
            );
            loadBooking().catch(() => {});
          });

          socket.on("booking:assigned", (data) => {
            setCandidateEtaMin(null);
            loadBooking().catch(() => {});
            if (data.expert?.location) setExpertLoc(data.expert.location);
            const name = data.expert?.name || "Expert";
            const eta = data.etaMin ?? data.expert?.etaMin ?? "—";
            toast.success(`Expert assigned · ${name} · ${eta} min`);
          });

          socket.on("booking:searching", ({ candidateEtaMin: eta }) => {
            if (eta != null) setCandidateEtaMin(eta);
          });

          socket.on("booking:payment", () => {
            loadBooking().catch(() => {});
            toast.success(toastMessages.paymentSuccess);
          });

          socket.on("booking:expert_location", ({ lat, lng }) => {
            setExpertLoc({ lat, lng });
            loadBooking().catch(() => {});
          });

          socket.on("booking:arrived", () => {
            loadBooking().catch(() => {});
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
        socket.off("booking:searching");
        socket.off("booking:payment");
        socket.off("booking:expert_location");
        socket.off("booking:arrived");
        socket.off("booking:failed");
      }
    };
  }, [id, loadBooking, toast]);

  async function handlePay() {
    setPaying(true);
    try {
      const updated = await bookingService.pay(id);
      setBooking(updated);
      toast.success(toastMessages.paymentSuccess);
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setPaying(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(true);
    try {
      await bookingService.cancel(id);
      await loadBooking();
      toast.success("Booking cancelled.");
    } catch (e) {
      toast.error(friendlyError(e.message));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return <SkeletonTracking />;
  }

  if (!booking) {
    return (
      <p className="type-body text-sub">
        Order not found.{" "}
        <Link to="/app/orders" className="font-medium text-brand">
          Back to My Orders
        </Link>
      </p>
    );
  }

  const backLabel = booking.status === "completed" || booking.status === "cancelled"
    ? "My Orders"
    : "Back";

  return (
    <div className="-mt-2 lg:mt-0">
      <button
        type="button"
        onClick={() => navigate("/app/orders")}
        className="mb-4 flex min-h-11 items-center gap-2 type-body font-medium text-brand lg:mb-6"
      >
        <ArrowLeft size={18} />
        {backLabel}
      </button>

      <TrackingStateView
        booking={booking}
        candidateEtaMin={candidateEtaMin}
        expertLoc={expertLoc}
        onPay={handlePay}
        paying={paying}
        onCancel={handleCancel}
        cancelling={cancelling}
      />
    </div>
  );
}
