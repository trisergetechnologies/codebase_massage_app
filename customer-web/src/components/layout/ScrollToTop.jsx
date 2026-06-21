import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reset scroll position on route change (prevents landing mid-page / at footer). */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
