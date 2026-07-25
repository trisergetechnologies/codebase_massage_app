export const LIVE_TRACKING_STATUSES = ["searching", "assigned", "in_progress"];

export const OPEN_BOOKING_STATUSES = [
  "awaiting_payment",
  "created",
  "searching",
  "assigned",
  "in_progress",
];

function isUnpaid(booking) {
  return booking?.payment?.status !== "paid";
}

export function getMapMode(booking) {
  const status = booking?.status;
  if (!status || ["awaiting_payment", "created", "cancelled", "completed", "in_progress"].includes(status)) {
    return "hidden";
  }
  if (status === "searching") return "address";
  if (status === "assigned") return "live";
  return "hidden";
}

export function getJourneyVisibility(booking) {
  const status = booking?.status;
  const timing = booking?.payment?.timing || "pay_later";

  return {
    showLiveBadge: LIVE_TRACKING_STATUSES.includes(status),
    mapMode: getMapMode(booking),
    showExpertCard: ["assigned", "in_progress", "completed"].includes(status),
    showTimeline:
      status !== "cancelled" &&
      status !== "awaiting_payment" &&
      status !== "completed",
    showCancel: ["awaiting_payment", "created", "searching"].includes(status),
    showEta: ["searching", "assigned"].includes(status),
    needsPayment:
      (status === "awaiting_payment" && isUnpaid(booking)) ||
      (timing === "pay_later" && isUnpaid(booking) && OPEN_BOOKING_STATUSES.includes(status)) ||
      (status === "completed" && isUnpaid(booking)),
  };
}

export function getScreenTitle(status) {
  const map = {
    awaiting_payment: "Complete payment",
    created: "Finding your expert",
    searching: "Finding your expert",
    assigned: "Expert on the way",
    in_progress: "Session in progress",
    completed: "Session complete",
    cancelled: "Booking cancelled",
  };
  return map[status] || "Booking";
}
