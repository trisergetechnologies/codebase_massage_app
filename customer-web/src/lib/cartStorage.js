const CART_KEY = "relief_cart_v1";
const PENDING_BOOKING_KEY = "relief_pending_booking";

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item?.service?.id &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function saveCart(items) {
  try {
    if (!items?.length) {
      localStorage.removeItem(CART_KEY);
      return;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

export function setPendingBooking() {
  try {
    sessionStorage.setItem(PENDING_BOOKING_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function consumePendingBooking() {
  try {
    const v = sessionStorage.getItem(PENDING_BOOKING_KEY);
    sessionStorage.removeItem(PENDING_BOOKING_KEY);
    return v === "1";
  } catch {
    return false;
  }
}

export function hasPendingBooking() {
  try {
    return sessionStorage.getItem(PENDING_BOOKING_KEY) === "1";
  } catch {
    return false;
  }
}
