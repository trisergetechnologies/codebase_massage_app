import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { ScrollToTop } from "../components/layout/ScrollToTop";
import { CartDrawer } from "../components/cart/CartDrawer";
import { FloatingCartBar } from "../components/cart/FloatingCartBar";
import { AddressBookingModal } from "../components/booking/AddressBookingModal";
import { LoginModal } from "../components/auth/LoginModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import {
  consumePendingBooking,
  hasPendingBooking,
  setPendingBooking,
} from "../lib/cartStorage";

export function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { items, clear, isEmpty } = useCart();
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fromRouteState = Boolean(location.state?.openBooking);
    const fromSession = hasPendingBooking();

    if ((fromRouteState || fromSession) && items.length > 0) {
      if (fromSession) consumePendingBooking();
      setBookingOpen(true);
      if (fromRouteState) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [
    authLoading,
    isAuthenticated,
    location.state,
    location.pathname,
    items.length,
    navigate,
  ]);

  function handleProceed() {
    if (items.length === 0) return;
    if (!isAuthenticated) {
      setPendingBooking();
      openLogin({ from: location.pathname, intent: "booking" });
      return;
    }
    if (items.length > 0) setBookingOpen(true);
  }

  function onBooked(booking) {
    consumePendingBooking();
    clear();
    navigate(`/app/orders/${booking.id}`);
  }

  const showFooter =
    location.pathname === "/" || location.pathname === "/services";

  const showFloatingCart = location.pathname.startsWith("/services");

  return (
    <>
      <ScrollToTop />
      <Nav />
      <div className={showFloatingCart && !isEmpty ? "pb-24 lg:pb-0" : undefined}>
        <Outlet />
      </div>
      {showFooter ? <Footer /> : null}
      <CartDrawer onProceed={handleProceed} />
      {showFloatingCart ? <FloatingCartBar /> : null}
      <LoginModal />
      <AddressBookingModal
        open={bookingOpen}
        serviceIds={items.flatMap((i) => Array(i.quantity).fill(i.service.id))}
        onClose={() => setBookingOpen(false)}
        onBooked={onBooked}
      />
    </>
  );
}
