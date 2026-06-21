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
    const bounds = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }, [map, points]);
  return null;
}

export function BookingMap({ booking, expertLocation }) {
  const customer = booking?.location;
  const expert =
    expertLocation ||
    (booking?.expert?.lastLocation?.lat != null
      ? {
          lat: booking.expert.lastLocation.lat,
          lng: booking.expert.lastLocation.lng,
        }
      : null);

  const customerPos =
    customer?.lat != null && customer?.lng != null
      ? { lat: customer.lat, lng: customer.lng }
      : null;

  const distanceKm = useMemo(() => {
    if (booking?.distanceKm != null) return booking.distanceKm;
    if (!customerPos || !expert) return null;
    return Math.round(haversineKm(customerPos, expert) * 10) / 10;
  }, [booking?.distanceKm, customerPos, expert]);

  if (!customerPos) {
    return (
      <div className="flex h-60 items-center justify-center rounded-2xl bg-[#f4f5f7] text-sm text-muted sm:h-80">
        Location unavailable
      </div>
    );
  }

  const center = [customerPos.lat, customerPos.lng];
  const points = [center];
  if (expert) points.push([expert.lat, expert.lng]);

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-border/70">
      <div className="border-b border-border bg-white px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Live map</p>
        {expert && distanceKm != null ? (
          <p className="mt-1 text-sm font-medium text-ink">{formatAerialDistance(distanceKm)}</p>
        ) : (
          <p className="mt-1 text-sm text-sub">Expert location will appear when assigned</p>
        )}
      </div>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="h-60 w-full sm:h-80"
        aria-label="Booking location map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        <CircleMarker
          center={center}
          radius={10}
          pathOptions={{ color: "#0f766e", fillColor: "#0f766e", fillOpacity: 1, weight: 2 }}
        />
        {expert && (
          <>
            <CircleMarker
              center={[expert.lat, expert.lng]}
              radius={10}
              pathOptions={{ color: "#111827", fillColor: "#111827", fillOpacity: 1, weight: 2 }}
            />
            <Polyline
              positions={[
                [customerPos.lat, customerPos.lng],
                [expert.lat, expert.lng],
              ]}
              pathOptions={{ color: "#0f766e", weight: 2, dashArray: "6 8", opacity: 0.7 }}
            />
          </>
        )}
      </MapContainer>
      <p className="bg-[#fafafa] px-3 py-2 text-center text-[11px] text-muted">
        Green dot: your address · Black dot: expert · Line is straight-line distance
      </p>
    </div>
  );
}
