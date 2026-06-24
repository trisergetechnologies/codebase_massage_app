const ERROR_MAP = {
  "Failed to fetch":
    "Cannot reach the server. Start the backend (cd backend && npm run dev) on port 4000, then refresh.",
  phone_and_role_required: "Please enter a valid phone number.",
  missing_fields: "Please complete all required fields.",
  invalid_or_expired_otp: "OTP verification failed. Please try again.",
  profile_fields_required: "Please complete your profile.",
  invalid_registration_token: "Your session expired. Please verify your phone again.",
  missing_token: "Please sign in to continue.",
  invalid_token: "Your session expired. Please sign in again.",
  serviceIds_required: "Please add at least one service.",
  location_required: "Please select a delivery address.",
  no_valid_services: "One or more services are no longer available.",
  address_fields_required: "Please complete the address details.",
  location_required: "Please enable your location before saving this address.",
  geolocation_denied: "Location permission was denied. Enable it in your browser settings.",
  geolocation_unavailable: "Location is not available on this device.",
  geolocation_failed: "Could not get your location. Try again.",
  no_expert_in_sla: "No expert was available nearby. Check your location or try again shortly.",
  address_not_found: "Address not found.",
  not_found: "We could not find what you were looking for.",
};

const CANCEL_REASON_MAP = {
  no_expert_in_sla: ERROR_MAP.no_expert_in_sla,
  user_cancelled: "This booking was cancelled.",
};

export function friendlyError(codeOrMessage) {
  if (!codeOrMessage) return "Unable to complete the request. Please try again.";
  return ERROR_MAP[codeOrMessage] || "Unable to complete the request. Please try again.";
}

export function cancelReasonMessage(reason) {
  if (!reason) return "This booking was cancelled.";
  return CANCEL_REASON_MAP[reason] || friendlyError(reason);
}

export const toastMessages = {
  cartAdded: "Order added to cart.",
  cartRemoved: "Item removed from cart.",
  bookingConfirmed: "Booking confirmed successfully.",
  addressSaved: "Address saved.",
  addressDeleted: "Address removed.",
  profileSaved: "Profile updated.",
  findingExperts: "Finding nearby experts...",
};
