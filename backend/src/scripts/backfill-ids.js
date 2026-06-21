/**
 * Backfill `publicId` on existing User, Expert, and Booking documents.
 * Safe to run multiple times.
 *
 * Usage: npm run backfill-ids
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Expert = require("../models/Expert");
const Booking = require("../models/Booking");
const env = require("../config/env");
const { backfillPublicIds } = require("../lib/backfillPublicIds");

async function run() {
  await mongoose.connect(env.MONGO_URI);
  console.log("[backfill-ids] connected");
  await backfillPublicIds([User, Expert, Booking]);
  await mongoose.disconnect();
  console.log("[backfill-ids] done");
}

run().catch((err) => {
  console.error("[backfill-ids]", err);
  process.exit(1);
});
