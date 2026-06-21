const Booking = require("../models/Booking");
const geo = require("../services/geo");
const { isProfileComplete } = require("./profile");

function toPlain(doc) {
  if (!doc) return null;
  return doc.toObject ? doc.toObject({ virtuals: true }) : { ...doc };
}

function serializeUserBrief(user) {
  if (!user) return null;
  const o = toPlain(user);
  return {
    id: o.publicId,
    name: o.name,
    phone: o.phone,
  };
}

function serializeExpertBrief(expert) {
  if (!expert) return null;
  const o = toPlain(expert);
  return {
    id: o.publicId,
    name: o.name,
    rating: o.rating,
    photoUrl: o.photoUrl,
    phone: o.phone,
    lastLocation: o.lastLocation,
  };
}

function serializeService(svc) {
  if (!svc) return null;
  const o = toPlain(svc);
  return {
    id: o.slug,
    slug: o.slug,
    name: o.name,
    categories: o.categories || [],
    skillTag: o.skillTag,
    description: o.description,
    imageUrl: o.imageUrl,
    durationMin: o.durationMin,
    price: o.price,
    addOnEligible: o.addOnEligible,
    active: o.active,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

function computeBookingDistanceKm(booking) {
  const loc = booking.location;
  const expert = booking.expert;
  if (!loc?.lat || !loc?.lng || !expert?.lastLocation?.lat || !expert?.lastLocation?.lng) {
    return null;
  }
  if (!["assigned", "in_progress"].includes(booking.status)) return null;
  const km = geo.haversineKm(
    { lat: expert.lastLocation.lat, lng: expert.lastLocation.lng },
    { lat: loc.lat, lng: loc.lng }
  );
  return Math.round(km * 10) / 10;
}

function serializeBooking(booking) {
  if (!booking) return null;
  const o = toPlain(booking);
  const distanceKm = computeBookingDistanceKm(o);
  const out = {
    id: o.publicId,
    status: o.status,
    cancelReason: o.cancelReason || null,
    items: (o.items || []).map((it) => ({
      id: it._id?.toString(),
      name: it.name,
      skillTag: it.skillTag,
      durationMin: it.durationMin,
      price: it.price,
      isAddOn: it.isAddOn,
      addedAt: it.addedAt,
    })),
    location: o.location,
    quotedEtaMin: o.quotedEtaMin,
    distanceKm,
    pricing: o.pricing,
    payment: o.payment,
    timeline: o.timeline,
    rating: o.rating,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    sessionOtp: o.sessionOtp
      ? {
          startVerified: !!o.sessionOtp.startVerifiedAt,
          endVerified: !!o.sessionOtp.endVerifiedAt,
          requiresStartOtp: o.status === "assigned" && !!o.sessionOtp.startCode,
          requiresEndOtp: o.status === "in_progress" && !!o.sessionOtp.endCode,
        }
      : null,
    expertEarning: o.expertEarning,
    expert: serializeExpertBrief(o.expert),
    customer: serializeUserBrief(o.customer),
  };
  return out;
}

async function serializeExpert(expert) {
  if (!expert) return null;
  const o = toPlain(expert);
  let activeBooking = null;
  if (o.activeBooking) {
    const ref = typeof o.activeBooking === "object" ? o.activeBooking._id : o.activeBooking;
    const booking = await Booking.findById(ref).select("publicId").lean();
    activeBooking = booking?.publicId || null;
  }
  return {
    id: o.publicId,
    phone: o.phone,
    name: o.name,
    email: o.email,
    photoUrl: o.photoUrl,
    bio: o.bio,
    skills: o.skills,
    rating: o.rating,
    completedJobs: o.completedJobs,
    status: o.status,
    lastLocation: o.lastLocation,
    activeBooking,
    trainingStatus: o.trainingStatus || "pending",
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

function serializeUser(user) {
  if (!user) return null;
  const o = toPlain(user);
  return {
    id: o.publicId,
    phone: o.phone,
    name: o.name,
    gender: o.gender || "",
    dateOfBirth: o.dateOfBirth || null,
    email: o.email,
    addresses: (o.addresses || []).map((a) => ({
      id: a._id?.toString(),
      label: a.label || "Home",
      line1: a.line1 || "",
      line2: a.line2 || "",
      city: a.city || "",
      pincode: a.pincode || "",
      lat: a.lat,
      lng: a.lng,
      isDefault: !!a.isDefault,
    })),
    profileComplete: isProfileComplete(o),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

module.exports = {
  serializeBooking,
  serializeExpert,
  serializeExpertBrief,
  serializeUser,
  serializeUserBrief,
  serializeService,
};
