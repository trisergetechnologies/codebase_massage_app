import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from "react-leaflet";
import { haversineKm, formatAerialDistance } from "../../lib/geo";

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [48, 48], maxZoom: 16 }
    );
  }, [map, points]);
  return null;
}

export function BookingMap({ booking, expertLocation, mode = "live", fullscreen = false }) {
  const customer = booking?.location;
  const expert =
    mode === "live"
      ? expertLocation ||
        (booking?.expert?.lastLocation?.lat != null
          ? {
              lat: booking.expert.lastLocation.lat,
              lng: booking.expert.lastLocation.lng,
            }
          : null)
      : null;

  const customerPos =
    customer?.lat != null && customer?.lng != null
      ? { lat: customer.lat, lng: customer.lng }
      : null;

  const distanceKm = useMemo(() => {
    if (mode !== "live") return null;
    if (booking?.distanceKm != null) return booking.distanceKm;
    if (!customerPos || !expert) return null;
    return Math.round(haversineKm(customerPos, expert) * 10) / 10;
  }, [mode, booking?.distanceKm, customerPos, expert]);

  if (!customerPos) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-2 text-sm text-muted ${
          fullscreen ? "h-full w-full" : "h-60 rounded-card sm:h-80"
        }`}
      >
        Location unavailable
      </div>
    );
  }

  const center = [customerPos.lat, customerPos.lng];
  const points = [center];
  if (expert) points.push([expert.lat, expert.lng]);

  const mapHeight = fullscreen ? "h-full w-full min-h-[280px]" : "h-60 w-full sm:h-80";

  if (fullscreen) {
    return (
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className={mapHeight}
        aria-label="Live tracking map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        <CircleMarker
          center={center}
          radius={10}
          pathOptions={{ color: "#3a6b55", fillColor: "#3a6b55", fillOpacity: 1, weight: 2 }}
        />
        {expert && (
          <>
            <CircleMarker
              center={[expert.lat, expert.lng]}
              radius={10}
              pathOptions={{ color: "#0d1f1a", fillColor: "#0d1f1a", fillOpacity: 1, weight: 2 }}
            />
            <Polyline
              positions={[
                [customerPos.lat, customerPos.lng],
                [expert.lat, expert.lng],
              ]}
              pathOptions={{ color: "#5a8f76", weight: 2, dashArray: "6 8", opacity: 0.7 }}
            />
          </>
        )}
      </MapContainer>
    );
  }

  const headerTitle = mode === "address" ? "Service address" : "Live map";
  const headerSub =
    mode === "address"
      ? "Expert will appear here once assigned"
      : expert && distanceKm != null
        ? formatAerialDistance(distanceKm)
        : "Expert location will appear when assigned";

  return (
    <div className="overflow-hidden rounded-card ring-1 ring-border/70">
      <div className="border-b border-border bg-surface px-4 py-3">
        <p className="type-label text-muted">{headerTitle}</p>
        <p className="mt-1 type-body-sm text-sub">{headerSub}</p>
      </div>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className={mapHeight}
        aria-label={mode === "address" ? "Service address map" : "Live booking map"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        <CircleMarker
          center={center}
          radius={10}
          pathOptions={{ color: "#3a6b55", fillColor: "#3a6b55", fillOpacity: 1, weight: 2 }}
        />
        {expert && (
          <>
            <CircleMarker
              center={[expert.lat, expert.lng]}
              radius={10}
              pathOptions={{ color: "#0d1f1a", fillColor: "#0d1f1a", fillOpacity: 1, weight: 2 }}
            />
            <Polyline
              positions={[
                [customerPos.lat, customerPos.lng],
                [expert.lat, expert.lng],
              ]}
              pathOptions={{ color: "#5a8f76", weight: 2, dashArray: "6 8", opacity: 0.7 }}
            />
          </>
        )}
      </MapContainer>
      {mode === "live" ? (
        <p className="bg-canvas px-3 py-2 text-center text-[11px] text-muted">
          Green dot: your address · Black dot: expert · Line is straight-line distance
        </p>
      ) : null}
    </div>
  );
}
