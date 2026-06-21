import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

/** Opens login modal and returns user to their previous page (or home). */
export function LoginRedirect() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      openLogin(location.state || {});
    }
  }, [loading, isAuthenticated, location.state, openLogin]);

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/services" replace />;
  }

  const from = location.state?.from;
  const back =
    !from || from === "/login" ? "/" : from.startsWith("/app") ? "/services" : from;
  return <Navigate to={back} replace />;
}
