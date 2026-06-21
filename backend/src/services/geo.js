const h3 = require("h3-js");
const env = require("../config/env");

/**
 * Geospatial utilities built around Uber's H3 hexagonal index.
 *
 * Why H3?
 *   - O(1) point -> cell ID at any resolution.
 *   - O(k^2) k-ring expansion to find neighbouring cells, much cheaper than a
 *     KNN over GPS pairs because we filter candidates by indexed `h3Index`
 *     (Mongo B-tree on a string equals = great).
 *   - Predictable hex edge length per resolution (res 8 ~= 460 m edge,
 *     ~0.74 km^2 area), which makes the "k-ring radius" intuitive.
 *
 * The dispatcher iteratively grows k = 0, 1, 2, ... until it has at least one
 * eligible expert OR until the ETA at the ring boundary exceeds the SLA.
 */

// Approx average hex edge length per resolution, in km. Lookup table from H3 docs.
const HEX_EDGE_KM = {
  6: 3.229,
  7: 1.220,
  8: 0.461,
  9: 0.174,
  10: 0.066,
};

function toCell(lat, lng, res = env.H3_RESOLUTION) {
  return h3.latLngToCell(lat, lng, res);
}

function ringCells(lat, lng, k, res = env.H3_RESOLUTION) {
  const origin = h3.latLngToCell(lat, lng, res);
  return h3.gridDisk(origin, k);
}

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function etaMinutes(distanceKm, speedKmph = env.EXPERT_AVG_SPEED_KMPH) {
  if (speedKmph <= 0) return Infinity;
  return (distanceKm / speedKmph) * 60;
}

// k-ring outer radius approximation: edge_len * k * sqrt(3) (apothem-style).
function approxRingRadiusKm(k, res = env.H3_RESOLUTION) {
  const edge = HEX_EDGE_KM[res] ?? 0.461;
  return edge * Math.max(1, k) * Math.sqrt(3);
}

function maxK(slaMin, speedKmph = env.EXPERT_AVG_SPEED_KMPH, res = env.H3_RESOLUTION) {
  // Largest k such that travel time at the ring boundary still <= SLA.
  const maxKm = (speedKmph * slaMin) / 60;
  const edge = HEX_EDGE_KM[res] ?? 0.461;
  return Math.max(1, Math.ceil(maxKm / (edge * Math.sqrt(3))));
}

module.exports = {
  toCell,
  ringCells,
  haversineKm,
  etaMinutes,
  approxRingRadiusKm,
  maxK,
};
