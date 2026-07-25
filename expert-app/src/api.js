/** @deprecated Import from services/ — kept for gradual migration */
export { setToken, setTokens, getToken, getAccessToken, request, logoutRemote } from "./services/apiClient";
export { authService } from "./services/authService";
export { expertService } from "./services/expertService";
export { bookingService } from "./services/bookingService";
export { earningsService } from "./services/earningsService";
import { authService } from "./services/authService";
import { expertService } from "./services/expertService";
import { bookingService } from "./services/bookingService";

export const api = {
  requestOtp: authService.requestOtp,
  verifyOtp: authService.verifyOtp,
  me: expertService.me,
  dashboard: expertService.dashboard,
  goOnline: expertService.goOnline,
  goOffline: expertService.goOffline,
  listBookings: bookingService.list,
  getBooking: bookingService.get,
  arrived: bookingService.arrived,
  start: bookingService.start,
  complete: bookingService.complete,
};
