import { useCallback, useState } from "react";

/**
 * Browser geolocation for address capture (requires https or localhost).
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(() => {
    if (!navigator.geolocation) {
      setError("geolocation_unavailable");
      return Promise.resolve(null);
    }
    setLoading(true);
    setError(null);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCoords(next);
          setLoading(false);
          resolve(next);
        },
        (err) => {
          const code =
            err.code === err.PERMISSION_DENIED
              ? "geolocation_denied"
              : "geolocation_failed";
          setError(code);
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });
  }, []);

  const reset = useCallback(() => {
    setCoords(null);
    setError(null);
    setLoading(false);
  }, []);

  return { coords, loading, error, capture, reset, setCoords };
}
