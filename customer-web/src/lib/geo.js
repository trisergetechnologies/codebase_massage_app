/** Haversine distance (km) — straight-line / aerial, no routing API. */

export function haversineKm(a, b) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatAerialDistance(km) {
  if (km == null || Number.isNaN(km)) return null;
  const rounded = km < 10 ? Math.round(km * 10) / 10 : Math.round(km);
  return `~${rounded} km · straight line`;
}
