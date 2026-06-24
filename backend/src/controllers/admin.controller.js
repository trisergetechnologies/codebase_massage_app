const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Expert = require("../models/Expert");
const env = require("../config/env");
const { signToken } = require("../middleware/auth");
const { serializeBooking } = require("../lib/serialize");
const { serializeExpert } = require("../lib/serialize");

const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const expected = env.ADMIN_PASSWORD || "admin123";
  if (!password || password !== expected) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  const token = signToken({ sub: "admin", role: "admin" });
  res.json({ token, role: "admin" });
});

const listBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("expert", "name rating phone publicId")
    .populate("customer", "name phone publicId");

  res.json(bookings.map(serializeBooking));
});

const listReviews = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ "rating.stars": { $ne: null } })
    .sort({ updatedAt: -1 })
    .limit(100)
    .populate("expert", "name publicId")
    .populate("customer", "name publicId");

  res.json(
    bookings.map((b) => {
      const s = serializeBooking(b);
      return {
        id: s.id,
        stars: s.rating?.stars,
        comment: s.rating?.comment || "",
        customer: s.customer,
        expert: s.expert,
        items: s.items,
        createdAt: s.createdAt,
        completedAt: s.timeline?.completedAt,
      };
    })
  );
});

const listExperts = asyncHandler(async (req, res) => {
  const experts = await Expert.find().sort({ updatedAt: -1 }).limit(200);
  const out = [];
  for (const e of experts) out.push(await serializeExpert(e));
  res.json(out);
});

module.exports = { login, listBookings, listReviews, listExperts };
