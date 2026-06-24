const Booking = require("../models/Booking");
const geo = require("./geo");

/**
 * Surge multiplier based on active demand in the booking's H3 cell.
 * 1.0 = normal; up to 1.5 at peak.
 */
async function getMultiplier(lat, lng) {
  const h3Index = geo.toCell(lat, lng);
  const activeCount = await Booking.countDocuments({
    "location.h3Index": h3Index,
    status: { $in: ["searching", "assigned", "in_progress"] },
  });

  if (activeCount >= 8) return 1.5;
  if (activeCount >= 5) return 1.35;
  if (activeCount >= 3) return 1.2;
  if (activeCount >= 1) return 1.1;
  return 1.0;
}

module.exports = { getMultiplier };
