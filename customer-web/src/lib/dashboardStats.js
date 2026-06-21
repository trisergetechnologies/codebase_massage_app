import {
  ACTIVE_STATUSES,
  COMPLETED_STATUSES,
  CANCELLED_STATUSES,
} from "./bookingStatus";

export function sessionTitle(booking) {
  return booking?.items?.map((i) => i.name).join(", ") || "Wellness session";
}

export function formatSessionDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount) {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function computeDashboardStats(bookings, addressCount = 0) {
  const completed = bookings.filter((b) => COMPLETED_STATUSES.includes(b.status));
  const active = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const cancelled = bookings.filter((b) => CANCELLED_STATUSES.includes(b.status));

  const totalSpend = completed.reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
  const totalMinutes = completed.reduce(
    (sum, b) => sum + (b.items || []).reduce((s, i) => s + (i.durationMin || 0), 0),
    0
  );

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const lastSession = sorted.find((b) => COMPLETED_STATUSES.includes(b.status));

  return {
    completedCount: completed.length,
    activeCount: active.length,
    cancelledCount: cancelled.length,
    totalSpend,
    totalMinutes,
    addressCount,
    lastSessionDate: lastSession?.createdAt || null,
    activeSessions: active,
    recentSessions: sorted.slice(0, 8),
  };
}
