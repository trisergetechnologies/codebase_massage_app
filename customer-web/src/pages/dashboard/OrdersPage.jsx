import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../services/bookingService";
import {
  ACTIVE_STATUSES,
  CANCELLED_STATUSES,
  COMPLETED_STATUSES,
} from "../../lib/bookingStatus";
import { OrderCard } from "../../components/dashboard/OrderCard";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";

const FILTERS = [
  { id: "active", label: "Active" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

export function OrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService
      .list()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === "active") {
      return bookings.filter(
        (b) =>
          ACTIVE_STATUSES.includes(b.status) ||
          ["created", "searching"].includes(b.status)
      );
    }
    if (tab === "past") return bookings.filter((b) => COMPLETED_STATUSES.includes(b.status));
    if (tab === "cancelled") return bookings.filter((b) => CANCELLED_STATUSES.includes(b.status));
    return bookings;
  }, [bookings, tab]);

  const emptyCopy = {
    active: {
      title: "No active orders",
      body: "Book a session and your order will show up here.",
    },
    past: {
      title: "No past orders yet",
      body: "Completed sessions will appear here.",
    },
    cancelled: {
      title: "No cancelled orders",
      body: "Cancelled bookings will be listed here.",
    },
  };

  const empty = emptyCopy[tab];

  return (
    <div className="-mx-0 lg:-mx-0">
      <p className="mb-4 hidden text-sm text-sub lg:block">
        Track active sessions, review past visits, and manage cancellations.
      </p>

      <div className="flex gap-2 rounded-2xl border border-border bg-white p-1 lg:max-w-md">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setTab(f.id)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${
              tab === f.id ? "bg-accent text-white shadow-sm" : "text-sub hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-2">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl lg:h-28" />
          ))}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center lg:col-span-2">
            <p className="font-semibold text-ink">{empty.title}</p>
            <p className="mt-2 text-sm text-sub">{empty.body}</p>
            {tab !== "cancelled" && (
              <Button variant="accent" className="mt-6" onClick={() => navigate("/services")}>
                Book a session
              </Button>
            )}
          </div>
        )}

        {!loading &&
          filtered.map((booking) => (
            <OrderCard key={booking.id} booking={booking} className="lg:col-span-1" />
          ))}
      </div>
    </div>
  );
}
