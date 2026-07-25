/** Active live tracking — map, pulse, ETA updates */
export const LIVE_TRACKING_STATUSES = ["searching", "assigned", "in_progress"];

/** Open bookings — shown in active orders list */
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

/** @returns {'hidden'|'address'|'live'|'fullscreen'} */
export function getMapMode(booking) {
  const status = booking?.status;
  if (!status || ["awaiting_payment", "created", "cancelled", "completed", "in_progress"].includes(status)) {
    return "hidden";
  }
  if (status === "searching") return "hidden";
  if (status === "assigned") return "fullscreen";
  return "hidden";
}

export function getJourneyVisibility(booking) {
  const status = booking?.status;
  const timing = booking?.payment?.timing || "pay_later";
  const unpaid = booking?.payment?.status !== "paid";
  const isPayLaterUnpaid =
    timing === "pay_later" &&
    unpaid &&
    ["searching", "assigned", "in_progress"].includes(status);

  return {
    showLiveBadge: status === "assigned",
    mapMode: getMapMode(booking),
    showExpertCard: ["assigned", "in_progress"].includes(status),
    showTimeline: false,
    timelineCollapsed: false,
    showPayPrimary: status === "awaiting_payment" && unpaid,
    showPaySecondary: isPayLaterUnpaid,
    showCancel: ["awaiting_payment", "created", "searching"].includes(status),
    showEta: status === "assigned",
    showMetaEta: false,
    showReceipt: status === "completed",
    showSearchAnimation: ["created", "searching"].includes(status),
    showSessionTimer: status === "in_progress",
    needsPayment:
      (status === "awaiting_payment" && isUnpaid(booking)) ||
      (timing === "pay_later" && isUnpaid(booking) && OPEN_BOOKING_STATUSES.includes(status)) ||
      (status === "completed" && isUnpaid(booking)),
  };
}

export function getOrderCardSecondaryLine(booking) {
  const status = booking?.status;
  if (status === "awaiting_payment") return "Pay to start";
  if (status === "searching") return "Finding expert…";
  if (status === "assigned") {
    const eta = booking.liveEtaMin ?? booking.quotedEtaMin;
    return eta != null ? `~${eta} min away` : "On the way";
  }
  if (status === "in_progress") return "Session running";
  if (status === "completed") return "Done";
  if (status === "cancelled") return "Cancelled";
  if (status === "created") return "Confirming…";
  return null;
}
