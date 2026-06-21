export function formatRupee(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

export function formatWhen(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function serviceSummary(items = []) {
  if (!items.length) return "Service";
  return items.map((i) => i.name).join(", ");
}

export function totalDurationMin(items = []) {
  return items.reduce((s, i) => s + (i.durationMin || 0), 0);
}

export function orderStatusLabel(status, timeline = {}) {
  const map = {
    assigned: timeline.arrivedAt ? "Arrived" : "Navigating",
    in_progress: "In session",
    completed: "Completed",
    cancelled: "Cancelled",
    searching: "Searching",
    created: "Created",
  };
  return map[status] || status;
}

/** @returns {'navigating'|'start_otp'|'session'|'end_otp'|'done'} */
export function getActiveOrderStep(booking) {
  if (!booking) return "navigating";
  if (booking.status === "completed" || booking.status === "cancelled") return "done";
  if (booking.status === "in_progress") return "session";
  if (booking.status === "assigned") {
    if (!booking.timeline?.arrivedAt) return "navigating";
    return "start_otp";
  }
  return "navigating";
}

export function isActiveOrder(status) {
  return status === "assigned" || status === "in_progress";
}
