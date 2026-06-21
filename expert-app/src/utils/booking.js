export const EXPERT_JOURNEY_STEPS = [
  { key: "assigned", label: "Accepted", desc: "Job is yours — head to the customer." },
  { key: "en_route", label: "On the way", desc: "Navigate to the pickup address." },
  { key: "arrived", label: "Arrived", desc: "You're at the location." },
  { key: "in_progress", label: "In service", desc: "Perform the booked massages." },
  { key: "completed", label: "Done", desc: "Mark complete and go online again." },
];

export function getExpertJourneyIndex(booking) {
  if (!booking) return -1;
  if (booking.status === "completed" || booking.status === "cancelled") return 4;
  if (booking.status === "in_progress") return 3;
  if (booking.timeline?.startedAt) return 3;
  if (booking.timeline?.arrivedAt) return 2;
  if (booking.status === "assigned") return 1;
  return 0;
}

export function getStatusLabel(status, timeline = {}) {
  if (status === "assigned" && timeline.arrivedAt && !timeline.startedAt) return "At customer";
  if (status === "assigned") return "Heading to customer";
  if (status === "in_progress") return "Service in progress";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  if (status === "searching") return "Searching expert";
  return status;
}

export function getNextExpertAction(booking) {
  if (!booking || booking.status === "completed" || booking.status === "cancelled") return null;
  if (booking.status === "in_progress") {
    return { label: "Complete service", step: "complete" };
  }
  if (booking.status === "assigned" && booking.timeline?.arrivedAt) {
    return { label: "Start service", step: "start" };
  }
  if (booking.status === "assigned") {
    return { label: "I've arrived", step: "arrived" };
  }
  return null;
}

export function isActiveBooking(status) {
  return status === "assigned" || status === "in_progress";
}

export function formatRupee(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

export function formatWhen(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
