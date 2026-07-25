const Expert = require("../models/Expert");
const Booking = require("../models/Booking");
const env = require("../config/env");
const geo = require("./geo");
const notify = require("./notify");
const { genSessionOtp } = require("../lib/otp");
const { isMongoObjectId, bookingRoomId } = require("../lib/ids");
const { isExpertConnected } = require("../realtime/connections");
const earningsService = require("./earnings");

/**
 * Dispatcher — H3 k-ring + haversine; rank by skill match then distance.
 */

const pendingOffers = new Map();
const dispatchAborters = new Map();
/** expertId -> { payload, expiresAt } for HTTP poll when socket is down */
const pendingOfferForExpert = new Map();

function getRequiredSkills(booking) {
  const tags = new Set();
  for (const item of booking.items) {
    if (item.skillTag) tags.add(item.skillTag);
  }
  return Array.from(tags);
}

function skillScoreForExpert(expert, requiredSkills) {
  if (!requiredSkills.length) return 1;
  const skills = expert.skills || [];
  let matched = 0;
  for (const tag of requiredSkills) {
    if (skills.includes(tag)) matched += 1;
  }
  return matched / requiredSkills.length;
}

async function findCandidates(booking, requiredSkills) {
  const { lat, lng } = booking.location;
  const slaMin = env.DISPATCH_SLA_MINUTES;
  const maxKm = (env.EXPERT_AVG_SPEED_KMPH * slaMin) / 60;
  const declined = booking.declinedBy || [];

  const experts = await Expert.find({
    status: "online",
    _id: { $nin: declined },
    "lastLocation.lat": { $ne: null },
    "lastLocation.lng": { $ne: null },
  }).lean();

  const scored = experts
    .map((e) => {
      const distance = geo.haversineKm(
        { lat: e.lastLocation.lat, lng: e.lastLocation.lng },
        { lat, lng }
      );
      const eta = geo.etaMinutes(distance);
      const skillScore = skillScoreForExpert(e, requiredSkills);
      return { expert: e, distance, eta, skillScore };
    })
    .filter((c) => c.eta <= slaMin && c.skillScore > 0 && c.distance <= maxKm)
    .sort(
      (a, b) =>
        (isExpertConnected(b.expert._id) ? 1 : 0) - (isExpertConnected(a.expert._id) ? 1 : 0) ||
        b.skillScore - a.skillScore ||
        a.distance - b.distance ||
        (b.expert.rating || 0) - (a.expert.rating || 0)
    );

  return scored;
}

function offerToExpert(io, booking, candidate) {
  return new Promise(async (resolve) => {
    if (!booking.populated?.("customer")) {
      await booking.populate("customer", "name phone");
    }
    const expertId = candidate.expert._id.toString();
    const internalKey = booking._id.toString();
    const publicBookingId = bookingRoomId(booking);
    const timeoutMs = env.DISPATCH_OFFER_TIMEOUT_SEC * 1000;

    const finalize = (accepted) => {
      const entry = pendingOffers.get(internalKey);
      if (entry && entry.timer) clearTimeout(entry.timer);
      pendingOffers.delete(internalKey);
      pendingOfferForExpert.delete(expertId);
      resolve(accepted);
    };

    const timer = setTimeout(() => finalize(false), timeoutMs);

    pendingOffers.set(internalKey, {
      expertId,
      publicId: publicBookingId,
      timer,
      accept: () => finalize(true),
      decline: () => finalize(false),
    });

    const offerPayload = {
      bookingId: publicBookingId,
      customerName: booking.customer?.name || "Customer",
      serviceName: (booking.items || []).map((i) => i.name).join(", ") || "Service",
      durationMin: (booking.items || []).reduce((s, i) => s + (i.durationMin || 0), 0),
      etaMin: Math.round(candidate.eta * 10) / 10,
      distanceKm: Math.round(candidate.distance * 100) / 100,
      pickupLocation: booking.location,
      items: booking.items.map((i) => ({
        name: i.name,
        durationMin: i.durationMin,
        price: i.price,
      })),
      total: booking.pricing.total,
      estimatedEarning: Math.round(
        (booking.pricing?.subtotal || 0) * earningsService.COMMISSION_RATE
      ),
      offerExpiresInSec: env.DISPATCH_OFFER_TIMEOUT_SEC,
    };

    pendingOfferForExpert.set(expertId, {
      payload: offerPayload,
      expiresAt: Date.now() + timeoutMs,
    });

    notify.emitToRoom(io, `expert:${expertId}`, "dispatch:offer", offerPayload);

    notify.expoPush(
      candidate.expert.pushToken,
      "New booking nearby",
      `ETA ${Math.round(candidate.eta)} min · ₹${booking.pricing.total}`,
      { bookingId: publicBookingId, kind: "dispatch_offer" }
    );
  });
}

const scheduledTimers = new Map();

function scheduleDispatch(io, bookingId, scheduledFor) {
  const delay = new Date(scheduledFor).getTime() - Date.now();
  if (delay <= 0) {
    return runDispatch(io, bookingId);
  }
  const timer = setTimeout(() => {
    scheduledTimers.delete(bookingId.toString());
    runDispatch(io, bookingId);
  }, Math.min(delay, 2147483647));
  scheduledTimers.set(bookingId.toString(), timer);
}

function cancelScheduledDispatch(bookingId) {
  const timer = scheduledTimers.get(bookingId.toString());
  if (timer) {
    clearTimeout(timer);
    scheduledTimers.delete(bookingId.toString());
  }
}

async function runDispatch(io, bookingId) {
  const aborter = { aborted: false };
  dispatchAborters.set(bookingId.toString(), aborter);

  try {
    let booking = await Booking.findById(bookingId);
    if (!booking) return;

    if (booking.payment?.timing === "pay_now" && booking.payment?.status !== "paid") {
      return;
    }

    const room = bookingRoomId(booking);

    booking.status = "searching";
    await booking.save();
    notify.emitToRoom(io, `booking:${room}`, "booking:status", { status: "searching" });

    const requiredSkills = getRequiredSkills(booking);

    for (let attempt = 0; attempt < 6; attempt++) {
      if (aborter.aborted) return;

      booking = await Booking.findById(bookingId);
      if (!booking || booking.status === "cancelled") return;

      const candidates = await findCandidates(booking, requiredSkills);
      if (candidates.length === 0) {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      for (const cand of candidates) {
        if (aborter.aborted) return;

        notify.emitToRoom(io, `booking:${bookingRoomId(booking)}`, "booking:searching", {
          attempt: attempt + 1,
          candidateEtaMin: Math.round(cand.eta),
        });

        const accepted = await offerToExpert(io, booking, cand);
        if (!accepted) {
          await Booking.updateOne(
            { _id: bookingId },
            { $addToSet: { declinedBy: cand.expert._id } }
          );
          continue;
        }

        const claimed = await Expert.findOneAndUpdate(
          { _id: cand.expert._id, status: "online" },
          { status: "on_job", activeBooking: bookingId },
          { new: true }
        );
        if (!claimed) continue;

        booking.expert = claimed._id;
        booking.status = "assigned";
        booking.quotedEtaMin = Math.round(cand.eta);
        booking.timeline.assignedAt = new Date();
        booking.sessionOtp = {
          startCode: genSessionOtp(),
          endCode: genSessionOtp(),
        };
        await booking.save();

        notify.emitToRoom(io, `booking:${bookingRoomId(booking)}`, "booking:assigned", {
          status: "assigned",
          expert: {
            id: claimed.publicId,
            name: claimed.name,
            rating: claimed.rating,
            photoUrl: claimed.photoUrl,
            phone: claimed.phone,
            location: claimed.lastLocation,
          },
          quotedEtaMin: booking.quotedEtaMin,
          distanceKm: Math.round(cand.distance * 10) / 10,
        });
        return;
      }
    }

    await Booking.updateOne(
      { _id: bookingId, status: { $ne: "completed" } },
      {
        status: "cancelled",
        cancelReason: "no_expert_in_sla",
        "timeline.cancelledAt": new Date(),
      }
    );
    notify.emitToRoom(io, `booking:${room}`, "booking:failed", {
      reason: "no_expert_in_sla",
    });
    notify.emitToRoom(io, `booking:${room}`, "booking:status", {
      status: "cancelled",
      cancelReason: "no_expert_in_sla",
    });
  } finally {
    dispatchAborters.delete(bookingId.toString());
  }
}

async function resolveInternalBookingKey(bookingIdParam) {
  const key = bookingIdParam.toString();
  if (isMongoObjectId(key)) return key;
  const booking = await Booking.findOne({ publicId: key }).select("_id").lean();
  return booking?._id?.toString() || null;
}

async function handleExpertResponse(bookingIdParam, expertId, accepted) {
  let internalKey = await resolveInternalBookingKey(bookingIdParam);
  if (!internalKey) {
    for (const [k, v] of pendingOffers) {
      if (v.publicId === bookingIdParam?.toString()) {
        internalKey = k;
        break;
      }
    }
  }
  if (!internalKey) return false;

  const entry = pendingOffers.get(internalKey);
  if (!entry) return false;
  if (entry.expertId !== expertId.toString()) return false;
  if (accepted) entry.accept();
  else entry.decline();
  return true;
}

function abortDispatch(bookingId) {
  const aborter = dispatchAborters.get(bookingId.toString());
  if (aborter) aborter.aborted = true;
  const entry = pendingOffers.get(bookingId.toString());
  if (entry) entry.decline();
}

function getPendingOffer(expertId) {
  const entry = pendingOfferForExpert.get(expertId.toString());
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    pendingOfferForExpert.delete(expertId.toString());
    return null;
  }
  const secLeft = Math.max(1, Math.ceil((entry.expiresAt - Date.now()) / 1000));
  return { ...entry.payload, offerExpiresInSec: secLeft };
}

module.exports = {
  runDispatch,
  scheduleDispatch,
  cancelScheduledDispatch,
  handleExpertResponse,
  abortDispatch,
  getPendingOffer,
};
