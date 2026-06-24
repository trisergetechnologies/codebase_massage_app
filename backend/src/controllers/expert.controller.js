const asyncHandler = require("express-async-handler");
const Expert = require("../models/Expert");
const Booking = require("../models/Booking");
const geo = require("../services/geo");
const earningsService = require("../services/earnings");
const { serializeExpert, serializeBooking } = require("../lib/serialize");
const { loadExpertFromAuth } = require("../lib/expertAuth");

async function requireExpert(req, res) {
  const expert = await loadExpertFromAuth(req.auth);
  if (!expert) {
    res.status(404).json({ error: "not_found" });
    return null;
  }
  return expert;
}

const me = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  res.json(await serializeExpert(expert));
});

const updateProfile = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const allowed = ["name", "email", "photoUrl", "bio", "skills"];
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
  const updated = await Expert.findByIdAndUpdate(expert._id, patch, { new: true });
  res.json(await serializeExpert(updated));
});

const goOnline = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const { lat, lng } = req.body;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "lat_lng_required" });
  }
  const updated = await Expert.findByIdAndUpdate(
    expert._id,
    {
      lastLocation: { lat, lng, updatedAt: new Date() },
      h3Index: geo.toCell(lat, lng),
      ...(expert.status === "offline" ? { status: "online" } : {}),
    },
    { new: true }
  );
  res.json(await serializeExpert(updated));
});

const goOffline = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const updated = await Expert.findByIdAndUpdate(expert._id, { status: "offline" }, { new: true });
  res.json(await serializeExpert(updated));
});

const list = asyncHandler(async (_req, res) => {
  const experts = await Expert.find().sort({ createdAt: -1 }).limit(200);
  const out = await Promise.all(experts.map((e) => serializeExpert(e)));
  res.json(out);
});

const dashboard = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const expertId = expert._id.toString();
  const data = await earningsService.getDashboard(expertId);
  const recent = await Booking.find({ expert: expert._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("customer", "name phone publicId");
  res.json({
    ...data,
    recentOrders: recent.map(serializeBooking),
  });
});

const earnings = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const period = req.query.period || "today";
  const data = await earningsService.getEarnings(expert._id.toString(), period);
  res.json(data);
});

const pendingOffer = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const dispatcher = require("../services/dispatcher");
  res.json(dispatcher.getPendingOffer(expert._id.toString()));
});

const respondOffer = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const { bookingId, accepted } = req.body;
  if (!bookingId) return res.status(400).json({ error: "bookingId_required" });
  const dispatcher = require("../services/dispatcher");
  const ok = await dispatcher.handleExpertResponse(
    bookingId,
    expert._id.toString(),
    !!accepted
  );
  res.json({ ok });
});

const submitKyc = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const { note } = req.body;
  const updated = await Expert.findByIdAndUpdate(
    expert._id,
    {
      kycStatus: "submitted",
      kycNote: note || "",
      kycSubmittedAt: new Date(),
    },
    { new: true }
  );
  res.json(await serializeExpert(updated));
});

const updateTraining = asyncHandler(async (req, res) => {
  const expert = await requireExpert(req, res);
  if (!expert) return;
  const { status } = req.body;
  const allowed = ["pending", "in_progress", "completed"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "invalid_training_status" });
  }
  const updated = await Expert.findByIdAndUpdate(
    expert._id,
    { trainingStatus: status },
    { new: true }
  );
  res.json(await serializeExpert(updated));
});

module.exports = {
  me,
  updateProfile,
  goOnline,
  goOffline,
  list,
  dashboard,
  earnings,
  pendingOffer,
  respondOffer,
  submitKyc,
  updateTraining,
};
