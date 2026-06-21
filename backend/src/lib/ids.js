const crypto = require("crypto");
const mongoose = require("mongoose");

/** Generate an opaque external identifier (UUID v4). */
function newPublicId() {
  return crypto.randomUUID();
}

/** True if `value` looks like a MongoDB ObjectId hex string. */
function isMongoObjectId(value) {
  return typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);
}

/**
 * Mongoose plugin: adds `publicId` with UUID default + unique index.
 * Use on entities exposed via HTTP/socket (Booking, User, Expert).
 */
function publicIdPlugin(schema) {
  schema.add({
    publicId: {
      type: String,
      unique: true,
      index: true,
      default: newPublicId,
    },
  });
}

/**
 * Find one document by public id, with optional legacy ObjectId fallback
 * during migration (dev only — remove fallback once data is backfilled).
 */
async function findByPublicId(Model, paramId, extraFilter = {}) {
  if (!paramId) return null;
  if (isMongoObjectId(paramId)) {
    return Model.findOne({ _id: paramId, ...extraFilter });
  }
  return Model.findOne({ publicId: paramId, ...extraFilter });
}

/** Resolve booking room key for Socket.IO (always public id). */
function bookingRoomId(booking) {
  if (!booking) return null;
  return booking.publicId || booking.toString?.();
}

module.exports = {
  newPublicId,
  isMongoObjectId,
  publicIdPlugin,
  findByPublicId,
  bookingRoomId,
};
