const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Expert = require("../models/Expert");
const geo = require("../services/geo");
const dispatcher = require("../services/dispatcher");
const notify = require("../services/notify");
const { findByPublicId, isMongoObjectId, bookingRoomId } = require("../lib/ids");
const { serializeBooking } = require("../lib/serialize");
const { serializeBookingForExpert } = require("../lib/serializeExpertBooking");
const { genSessionOtp } = require("../lib/otp");
const earningsService = require("../services/earnings");
const { loadExpertFromAuth } = require("../lib/expertAuth");

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

async function loadBooking(paramId, extraFilter = {}) {
  return findByPublicId(Booking, paramId, extraFilter);
}

async function loadBookingPopulated(paramId, extraFilter = {}) {
  const filter = isMongoObjectId(paramId)
    ? { _id: paramId, ...extraFilter }
    : { publicId: paramId, ...extraFilter };

  return Booking.findOne(filter)
    .populate("expert", "name rating photoUrl phone lastLocation publicId")
    .populate("customer", "name phone publicId");
}

async function resolveServices(serviceIds) {
  const slugs = serviceIds.filter((id) => !isMongoObjectId(id));
  const mongoIds = serviceIds.filter(isMongoObjectId);
  const or = [];
  if (slugs.length) or.push({ slug: { $in: slugs } });
  if (mongoIds.length) or.push({ _id: { $in: mongoIds } });
  if (or.length === 0) return [];
  return Service.find({ active: true, $or: or });
}

/**
 * POST /api/bookings
 * Body: { serviceIds: string[], location: { lat, lng, address }, paymentTiming?: 'pay_now'|'pay_later' }
 * serviceIds: service slugs (preferred) or legacy ObjectIds.
 */
const create = asyncHandler(async (req, res) => {
  const { serviceIds, location, paymentTiming } = req.body;
  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    return res.status(400).json({ error: "serviceIds_required" });
  }
  if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
    return res.status(400).json({ error: "location_required" });
  }

  const timing = paymentTiming === "pay_now" ? "pay_now" : "pay_later";

  const services = await resolveServices(serviceIds);
  if (services.length === 0) return res.status(400).json({ error: "no_valid_services" });

  const items = services.map((s) => ({
    serviceId: s._id,
    name: s.name,
    skillTag: s.skillTag,
    durationMin: s.durationMin,
    price: s.price,
    isAddOn: false,
  }));

  const booking = new Booking({
    customer: req.auth.sub,
    items,
    location: {
      address: location.address || "",
      lat: location.lat,
      lng: location.lng,
      h3Index: geo.toCell(location.lat, location.lng),
    },
    status: timing === "pay_now" ? "awaiting_payment" : "created",
    payment: {
      status: "unpaid",
      timing,
    },
  });
  booking.recomputePricing();
  await booking.save();

  if (timing === "pay_later") {
    setImmediate(() => dispatcher.runDispatch(req.app.get("io"), booking._id));
  }

  res.status(201).json(serializeBooking(booking));
});

async function expertFilter(req) {
  if (req.auth.role !== "expert") return {};
  const expert = await loadExpertFromAuth(req.auth);
  if (!expert) return { expert: null };
  return { expert: expert._id };
}

const list = asyncHandler(async (req, res) => {
  const filter = {};
  const scope = req.query.scope;

  if (req.auth.role === "customer") filter.customer = req.auth.sub;
  if (req.auth.role === "expert") {
    const ef = await expertFilter(req);
    if (!ef.expert) return res.json([]);
    filter.expert = ef.expert;
    if (scope === "today") {
      filter.createdAt = { $gte: startOfDay() };
    } else if (scope === "history") {
      filter.status = { $in: ["completed", "cancelled"] };
    }
  }

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .limit(scope === "history" ? 100 : 50)
    .populate("expert", "name rating photoUrl phone lastLocation publicId")
    .populate("customer", "name phone publicId");
  res.json(bookings.map(serializeBooking));
});

const get = asyncHandler(async (req, res) => {
  const extraFilter =
    req.auth.role === "expert"
      ? await expertFilter(req)
      : req.auth.role === "customer"
        ? { customer: req.auth.sub }
        : {};
  if (req.auth.role === "expert" && !extraFilter.expert) {
    return res.status(404).json({ error: "not_found" });
  }
  const booking = await loadBookingPopulated(req.params.id, extraFilter);
  if (!booking) return res.status(404).json({ error: "not_found" });
  let payload = serializeBooking(booking);
  if (req.auth.role === "expert") {
    payload = serializeBookingForExpert(booking, payload);
  }
  res.json(payload);
});

const cancel = asyncHandler(async (req, res) => {
  const booking = await loadBooking(req.params.id, { customer: req.auth.sub });
  if (!booking) return res.status(404).json({ error: "not_found" });
  if (["completed", "cancelled"].includes(booking.status)) {
    return res.status(400).json({ error: "already_terminal" });
  }
  booking.status = "cancelled";
  booking.cancelReason = "user_cancelled";
  booking.timeline.cancelledAt = new Date();
  await booking.save();
  dispatcher.abortDispatch(booking._id);
  if (booking.expert) {
    await Expert.updateOne(
      { _id: booking.expert },
      { status: "online", activeBooking: null }
    );
  }
  notify.emitToRoom(req.app.get("io"), `booking:${bookingRoomId(booking)}`, "booking:status", {
    status: "cancelled",
    cancelReason: "user_cancelled",
  });
  res.json(serializeBooking(booking));
});

const addAddOn = asyncHandler(async (req, res) => {
  const booking = await loadBooking(req.params.id);
  if (!booking) return res.status(404).json({ error: "not_found" });
  if (booking.status !== "in_progress" && booking.status !== "assigned") {
    return res.status(400).json({ error: "addons_only_during_active_booking" });
  }
  if (req.auth.role === "customer" && booking.customer.toString() !== req.auth.sub) {
    return res.status(403).json({ error: "forbidden" });
  }

  let svc = null;
  const sid = req.body.serviceId;
  if (isMongoObjectId(sid)) svc = await Service.findById(sid);
  else svc = await Service.findOne({ slug: sid });

  if (!svc || !svc.active) return res.status(400).json({ error: "invalid_service" });
  if (!svc.addOnEligible) return res.status(400).json({ error: "service_not_add_on_eligible" });

  booking.items.push({
    serviceId: svc._id,
    name: svc.name,
    skillTag: svc.skillTag,
    durationMin: svc.durationMin,
    price: svc.price,
    isAddOn: true,
  });
  booking.recomputePricing();
  await booking.save();

  notify.emitToRoom(req.app.get("io"), `booking:${bookingRoomId(booking)}`, "booking:addon", {
    item: booking.items[booking.items.length - 1],
    pricing: booking.pricing,
  });

  res.json(serializeBooking(booking));
});

const confirmPayment = asyncHandler(async (req, res) => {
  const booking = await loadBooking(req.params.id, { customer: req.auth.sub });
  if (!booking) return res.status(404).json({ error: "not_found" });
  if (booking.payment.status === "paid") {
    return res.status(400).json({ error: "already_paid" });
  }

  booking.payment.status = "paid";
  booking.payment.providerRef = `test_${Date.now()}`;
  const io = req.app.get("io");
  const room = bookingRoomId(booking);
  const timing = booking.payment.timing || "pay_later";

  if (booking.status === "awaiting_payment" && timing === "pay_now") {
    booking.status = "created";
    await booking.save();
    notify.emitToRoom(io, `booking:${room}`, "booking:payment", {
      status: "paid",
      timing,
    });
    notify.emitToRoom(io, `booking:${room}`, "booking:status", { status: "created" });
    setImmediate(() => dispatcher.runDispatch(io, booking._id));
    return res.json(serializeBooking(booking));
  }

  await booking.save();
  notify.emitToRoom(io, `booking:${room}`, "booking:payment", {
    status: "paid",
    timing,
  });
  res.json(serializeBooking(booking));
});

const rate = asyncHandler(async (req, res) => {
  const { stars, comment } = req.body;
  const booking = await loadBooking(req.params.id);
  if (!booking) return res.status(404).json({ error: "not_found" });
  if (booking.status !== "completed") {
    return res.status(400).json({ error: "not_completed" });
  }
  booking.rating = { stars, comment };
  await booking.save();
  if (booking.expert) {
    const expert = await Expert.findById(booking.expert);
    if (expert) {
      const total = expert.rating * expert.completedJobs + stars;
      const jobs = expert.completedJobs + 1;
      expert.rating = total / jobs;
      await expert.save();
    }
  }
  res.json(serializeBooking(booking));
});

const expertArrived = asyncHandler(async (req, res) => {
  const ef = await expertFilter(req);
  if (!ef.expert) return res.status(404).json({ error: "not_found" });
  const booking = await loadBooking(req.params.id, { expert: ef.expert });
  if (!booking) return res.status(404).json({ error: "not_found" });
  booking.timeline.arrivedAt = new Date();
  await booking.save();
  notify.emitToRoom(req.app.get("io"), `booking:${bookingRoomId(booking)}`, "booking:arrived", {});
  res.json(serializeBooking(booking));
});

const expertStart = asyncHandler(async (req, res) => {
  const ef = await expertFilter(req);
  if (!ef.expert) return res.status(404).json({ error: "not_found" });
  const booking = await loadBooking(req.params.id, { expert: ef.expert });
  if (!booking) return res.status(404).json({ error: "not_found" });
  if (booking.status !== "assigned") {
    return res.status(400).json({ error: "invalid_status" });
  }
  const { otp } = req.body;
  if (!otp || booking.sessionOtp?.startCode !== String(otp).trim()) {
    return res.status(400).json({ error: "invalid_otp" });
  }
  booking.sessionOtp.startVerifiedAt = new Date();
  booking.status = "in_progress";
  booking.timeline.startedAt = new Date();
  await booking.save();
  notify.emitToRoom(req.app.get("io"), `booking:${bookingRoomId(booking)}`, "booking:status", {
    status: "in_progress",
  });
  const payload = serializeBookingForExpert(booking, serializeBooking(booking));
  res.json(payload);
});

const expertComplete = asyncHandler(async (req, res) => {
  const ef = await expertFilter(req);
  if (!ef.expert) return res.status(404).json({ error: "not_found" });
  const booking = await loadBooking(req.params.id, { expert: ef.expert });
  if (!booking) return res.status(404).json({ error: "not_found" });
  if (booking.status !== "in_progress") {
    return res.status(400).json({ error: "invalid_status" });
  }
  if (booking.payment?.timing === "pay_later" && booking.payment?.status !== "paid") {
    return res.status(402).json({ error: "payment_required" });
  }
  const { otp } = req.body;
  if (!otp || booking.sessionOtp?.endCode !== String(otp).trim()) {
    return res.status(400).json({ error: "invalid_otp" });
  }
  booking.sessionOtp.endVerifiedAt = new Date();
  booking.status = "completed";
  booking.timeline.completedAt = new Date();
  booking.expertEarning = Math.round((booking.pricing?.subtotal || 0) * earningsService.COMMISSION_RATE);
  await booking.save();

  await Expert.updateOne(
    { _id: ef.expert },
    { status: "online", activeBooking: null, $inc: { completedJobs: 1 } }
  );
  notify.emitToRoom(req.app.get("io"), `booking:${bookingRoomId(booking)}`, "booking:status", {
    status: "completed",
  });
  res.json(serializeBooking(booking));
});

module.exports = {
  create,
  list,
  get,
  cancel,
  addAddOn,
  confirmPayment,
  rate,
  expertArrived,
  expertStart,
  expertComplete,
};
