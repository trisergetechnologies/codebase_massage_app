import { cancelReasonMessage, journeyMessages } from "./messages";
import { LIVE_TRACKING_STATUSES, OPEN_BOOKING_STATUSES } from "./bookingJourney";

export const ACTIVE_STATUSES = OPEN_BOOKING_STATUSES;
export { LIVE_TRACKING_STATUSES, OPEN_BOOKING_STATUSES };
export const COMPLETED_STATUSES = ["completed"];
export const CANCELLED_STATUSES = ["cancelled"];

export function formatStatus(status) {
  const map = {
    awaiting_payment: "Pay to start",
    created: "Confirming…",
    searching: "Finding expert…",
    assigned: "Expert assigned",
    in_progress: "Session running",
    completed: "Done",
    cancelled: "Cancelled",
  };
  return map[status] || status;
}

export function formatStatusChip(status, booking) {
  if (status === "assigned") {
    const eta = booking?.liveEtaMin ?? booking?.quotedEtaMin;
    return eta != null ? `~${eta} min away` : "On the way";
  }
  return formatStatus(status);
}

export function getJourneyCopy(booking, { candidateEtaMin } = {}) {
  const status = booking?.status;
  const expertName = booking?.expert?.name;
  const eta = booking?.liveEtaMin ?? booking?.quotedEtaMin ?? candidateEtaMin;
  const distanceKm = booking?.distanceKm;
  const bookedMin = (booking?.items || []).reduce((s, i) => s + (i.durationMin || 0), 0);

  if (status === "awaiting_payment") {
    return {
      headline: journeyMessages.awaitingPaymentHeadline,
      subcopy: journeyMessages.awaitingPaymentSubcopy,
      showSearchPulse: false,
      etaHeadline: null,
    };
  }
  if (status === "created") {
    return {
      headline: journeyMessages.createdHeadline,
      subcopy: journeyMessages.createdSubcopy,
      showSearchPulse: false,
      etaHeadline: null,
    };
  }
  if (status === "searching") {
    const etaHint =
      candidateEtaMin != null ? ` Experts about ${candidateEtaMin} min away.` : "";
    return {
      headline: journeyMessages.searchingHeadline,
      subcopy: `${journeyMessages.searchingSubcopy}${etaHint}`,
      showSearchPulse: true,
      etaHeadline: null,
    };
  }
  if (status === "assigned") {
    const etaHeadline = eta != null ? `${eta} min away` : journeyMessages.searchingHeadline;
    const subcopy =
      expertName && distanceKm != null
        ? journeyMessages.assignedSubcopy(expertName, distanceKm)
        : expertName
          ? `${expertName} is heading to you`
          : "";
    return {
      headline: etaHeadline,
      subcopy,
      showSearchPulse: false,
      etaHeadline,
    };
  }
  if (status === "in_progress") {
    const subcopy =
      booking?.payment?.timing === "pay_later" && booking?.payment?.status !== "paid"
        ? journeyMessages.payBeforeSessionEnds
        : journeyMessages.inProgressSubcopy.replace("{minutes}", String(bookedMin || 60));
    return {
      headline: null,
      subcopy,
      showSearchPulse: false,
      etaHeadline: null,
      showTimer: true,
      bookedMin,
    };
  }
  if (status === "completed") {
    const date = booking?.createdAt
      ? new Date(booking.createdAt).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : "";
    return {
      headline: journeyMessages.completedHeadline,
      subcopy: date ? `${date} · ${bookedMin || 60} min` : journeyMessages.completedSubcopy,
      showSearchPulse: false,
      etaHeadline: null,
    };
  }
  if (status === "cancelled") {
    const isNoExpert = booking?.cancelReason === "no_expert_in_sla";
    return {
      headline: isNoExpert
        ? journeyMessages.cancelledNoExpertHeadline
        : journeyMessages.cancelledUserHeadline,
      subcopy: isNoExpert
        ? journeyMessages.cancelledNoExpertSubcopy
        : journeyMessages.cancelledUserSubcopy,
      showSearchPulse: false,
      etaHeadline: null,
      isNoExpert,
    };
  }
  return { headline: formatStatus(status), subcopy: "", showSearchPulse: false, etaHeadline: null };
}

export function needsPayment(booking) {
  if (!booking || booking.payment?.status === "paid") return false;
  if (booking.status === "awaiting_payment") return true;
  const timing = booking.payment?.timing || "pay_later";
  if (timing === "pay_later" && OPEN_BOOKING_STATUSES.includes(booking.status)) return true;
  if (booking.status === "completed") return true;
  return false;
}

export function getTrackingSteps(booking) {
  const status = booking?.status;
  if (status === "cancelled") {
    return [
      {
        id: "cancelled",
        label: "Booking cancelled",
        sublabel: cancelReasonMessage(booking?.cancelReason),
        state: "current",
      },
    ];
  }
  return [];
}
