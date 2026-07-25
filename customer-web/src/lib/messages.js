const ERROR_MAP = {
  "Failed to fetch":
    "Cannot reach the server. Start the backend (cd backend && npm run dev) on port 4000, then refresh.",
  phone_and_role_required: "Please enter a valid phone number.",
  missing_fields: "Please complete all required fields.",
  invalid_or_expired_otp: "That code didn't work. Try again.",
  profile_fields_required: "Please complete your profile.",
  invalid_registration_token: "Your session expired. Please verify your phone again.",
  missing_token: "Please sign in to continue.",
  invalid_token: "Your session expired. Please sign in again.",
  token_expired: "Your session expired. Please sign in again.",
  invalid_refresh_token: "Your session expired. Please sign in again.",
  wrong_role: "Please sign in with the correct account.",
  serviceIds_required: "Please add at least one service.",
  location_required: "We need a precise location. Tap to update.",
  no_valid_services: "One or more services are no longer available.",
  address_fields_required: "Please complete the address details.",
  geolocation_denied: "Location access needed to find nearby experts.",
  geolocation_unavailable: "Location is not available on this device.",
  geolocation_failed: "Could not get your location. Try again.",
  no_expert_in_sla: "No one available nearby right now. Try in a few minutes.",
  address_not_found: "Address not found.",
  not_found: "This session isn't available anymore.",
  already_paid: "This booking is already paid.",
  payment_required: "Payment didn't go through. Try a different method.",
  network_error: "Can't reach the server. Check your connection.",
  booking_failed: "Couldn't save your booking. Try again.",
  expert_offline: "Your expert went offline. We're finding another.",
  offer_expired: "That offer expired. Another may come soon.",
};

const CANCEL_REASON_MAP = {
  no_expert_in_sla: "No experts were near you right now.",
  user_cancelled: "You cancelled this booking.",
};

export function friendlyError(codeOrMessage) {
  if (!codeOrMessage) return "Can't reach the server. Check your connection.";
  if (ERROR_MAP[codeOrMessage]) return ERROR_MAP[codeOrMessage];
  if (typeof codeOrMessage === "string" && codeOrMessage.toLowerCase().includes("network")) {
    return ERROR_MAP.network_error;
  }
  return ERROR_MAP[codeOrMessage] || "Can't reach the server. Check your connection.";
}

export function cancelReasonMessage(reason) {
  if (!reason) return "This booking was cancelled.";
  return CANCEL_REASON_MAP[reason] || friendlyError(reason);
}

export const toastMessages = {
  cartAdded: "Added to cart",
  cartRemoved: "Removed",
  bookingConfirmed: "Booking confirmed",
  bookingRequested: "Booking saved — expert search starting",
  bookingPayNowToast: "Booking saved. Complete payment to find your expert.",
  paymentSuccess: "Paid. Finding your expert…",
  addressSaved: "Address saved",
  addressDeleted: "Address removed",
  profileSaved: "Profile updated",
  findingExperts: "Looking for experts nearby…",
  assignedToast: (name, eta) => `Expert assigned — ${name} · ${eta} min`,
  sessionComplete: "Session complete. Hope you feel better.",
};

export const journeyMessages = {
  awaitingPaymentHeadline: "Confirm to book",
  awaitingPaymentSubcopy: "Pay to get an expert on the way.",
  awaitingPaymentCta: "Pay",
  awaitingPaymentCancel: "Cancel this booking",
  awaitingPaymentNote: "Payment is secure. Session not started yet.",

  createdHeadline: "Booking saved",
  createdSubcopy: "We're getting things ready.",

  searchingHeadline: "Finding someone nearby",
  searchingSubcopy: "Usually takes under 2 minutes.",
  searchingCancel: "Can't wait? Cancel",

  assignedSubcopy: (name, distance) =>
    name ? `${name} is heading to you · ${distance} km` : "",

  inProgressSubcopy: "of {minutes} min booked",
  payBeforeSessionEnds: "Pay before your session ends.",

  completedHeadline: "Session complete.",
  completedSubcopy: "Hope you feel better.",

  cancelledNoExpertHeadline: "No one available",
  cancelledNoExpertSubcopy: "No experts were near you right now.",
  cancelledUserHeadline: "Booking cancelled",
  cancelledUserSubcopy: "You cancelled this booking.",
  cancelledRefund: "You weren't charged.",
  cancelledTryAgain: "Try again later →",

  payNowCta: "Pay now",
  payLaterBanner: "Remember to pay before your session ends.",
};
