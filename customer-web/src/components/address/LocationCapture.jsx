import { useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from "../../hooks/useGeolocation";
import { friendlyError } from "../../lib/messages";
import { Button } from "../ui/Button";

export function LocationCapture({ onCoords, autoCapture = true }) {
  const { coords, loading, error, capture } = useGeolocation();

  useEffect(() => {
    if (autoCapture) capture();
  }, [autoCapture, capture]);

  useEffect(() => {
    if (coords) onCoords?.(coords);
  }, [coords, onCoords]);

  return (
    <div className="rounded-xl border border-border bg-[#fafafa] p-4">
      <div className="flex items-start gap-3">
        {loading ? (
          <Loader2 size={20} className="mt-0.5 shrink-0 animate-spin text-accent" />
        ) : (
          <MapPin
            size={20}
            className={`mt-0.5 shrink-0 ${coords ? "text-accent" : "text-muted"}`}
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">
            {loading
              ? "Getting your location…"
              : coords
                ? "Location captured"
                : "Location required"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {coords
              ? "We use GPS so a nearby expert can reach you. Your pin is not shown on a map here."
              : "Allow location access, or tap below to try again."}
          </p>
          {error && (
            <p className="mt-2 text-xs text-red-600">{friendlyError(error)}</p>
          )}
        </div>
      </div>
      {!loading && (
        <Button
          variant="secondary"
          type="button"
          className="mt-3 w-full"
          onClick={capture}
        >
          <MapPin size={16} />
          {coords ? "Refresh location" : "Use current location"}
        </Button>
      )}
    </div>
  );
}
