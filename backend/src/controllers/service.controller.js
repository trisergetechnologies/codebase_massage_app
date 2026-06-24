const asyncHandler = require("express-async-handler");
const Service = require("../models/Service");
const { isMongoObjectId } = require("../lib/ids");
const { serializeService } = require("../lib/serialize");

async function findService(paramId) {
  if (isMongoObjectId(paramId)) return Service.findById(paramId);
  return Service.findOne({ slug: paramId });
}

const list = asyncHandler(async (req, res) => {
  const filter = { active: true };
  if (req.query.category) {
    filter.categories = req.query.category;
  }
  const services = await Service.find(filter).sort({ createdAt: 1 });
  res.json(services.map(serializeService));
});

const get = asyncHandler(async (req, res) => {
  const svc = await findService(req.params.id);
  if (!svc) return res.status(404).json({ error: "not_found" });
  res.json(serializeService(svc));
});

const reviews = asyncHandler(async (req, res) => {
  const svc = await findService(req.params.id);
  if (!svc) return res.status(404).json({ error: "not_found" });

  const Booking = require("../models/Booking");
  const bookings = await Booking.find({
    "items.serviceId": svc._id,
    "rating.stars": { $ne: null },
  })
    .sort({ updatedAt: -1 })
    .limit(20)
    .populate("customer", "name publicId");

  const stars = bookings.map((b) => b.rating.stars);
  const avg = stars.length ? stars.reduce((a, s) => a + s, 0) / stars.length : null;

  res.json({
    serviceId: svc.slug,
    averageRating: avg,
    count: bookings.length,
    reviews: bookings.map((b) => ({
      stars: b.rating.stars,
      comment: b.rating.comment || "",
      customerName: b.customer?.name || "Customer",
      createdAt: b.updatedAt,
    })),
  });
});

const create = asyncHandler(async (req, res) => {
  const svc = await Service.create(req.body);
  res.status(201).json(serializeService(svc));
});

const update = asyncHandler(async (req, res) => {
  const existing = await findService(req.params.id);
  if (!existing) return res.status(404).json({ error: "not_found" });
  const svc = await Service.findByIdAndUpdate(existing._id, req.body, { new: true });
  res.json(serializeService(svc));
});

const remove = asyncHandler(async (req, res) => {
  const existing = await findService(req.params.id);
  if (!existing) return res.status(404).json({ error: "not_found" });
  await Service.findByIdAndUpdate(existing._id, { active: false });
  res.json({ ok: true });
});

module.exports = { list, get, reviews, create, update, remove };
