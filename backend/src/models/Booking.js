const mongoose = require("mongoose");
const { publicIdPlugin } = require("../lib/ids");

const lineItemSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    name: String,
    skillTag: String,
    durationMin: Number,
    price: Number,
    addedAt: { type: Date, default: Date.now },
    isAddOn: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false }
);

/**
 * Booking lifecycle (hybrid Zepto + Rapido):
 *   immediate:  created -> searching -> assigned -> in_progress -> completed
 *   scheduled:  scheduled -> searching -> assigned -> in_progress -> completed
 *
 *   created     — brief state before dispatch starts
 *   scheduled   — future booking; dispatch deferred until scheduledFor
 *   searching   — dispatch loop running
 *   assigned    — expert accepted; en-route
 *   in_progress — session started (OTP verified)
 *   completed / cancelled — terminal
 *
 * `addOns` can grow while status === 'in_progress'; the totals are recomputed.
 */
const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expert: { type: mongoose.Schema.Types.ObjectId, ref: "Expert", default: null, index: true },

    items: { type: [lineItemSchema], default: [] },

    location: {
      address: String,
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      h3Index: { type: String, index: true },
    },

    status: {
      type: String,
      enum: ["created", "scheduled", "searching", "assigned", "in_progress", "completed", "cancelled"],
      default: "created",
      index: true,
    },

    scheduledFor: { type: Date, default: null, index: true },
    couponCode: { type: String, default: "" },

    // Quoted ETA snapshot at assignment-time (minutes).
    quotedEtaMin: { type: Number, default: null },

    pricing: {
      subtotal: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      surgeMultiplier: { type: Number, default: 1 },
      total: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },

    payment: {
      status: {
        type: String,
        enum: ["unpaid", "authorized", "paid", "refunded", "failed"],
        default: "unpaid",
      },
      timing: {
        type: String,
        enum: ["pay_now", "pay_later"],
        default: "pay_later",
      },
      method: { type: String, default: "card_test" },
      providerRef: { type: String, default: "" },
    },

    timeline: {
      createdAt: { type: Date, default: Date.now },
      assignedAt: Date,
      arrivedAt: Date,
      startedAt: Date,
      completedAt: Date,
      cancelledAt: Date,
    },

    rating: {
      stars: { type: Number, default: null, min: 1, max: 5 },
      comment: { type: String, default: "" },
    },

    // Session OTPs — customer shares with expert to start/end service.
    sessionOtp: {
      startCode: { type: String, default: null },
      endCode: { type: String, default: null },
      startVerifiedAt: Date,
      endVerifiedAt: Date,
    },

    expertEarning: { type: Number, default: 0 },

    declinedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expert" }],
      default: [],
    },
    cancelReason: { type: String, default: null },
  },
  { timestamps: true }
);

bookingSchema.plugin(publicIdPlugin);

bookingSchema.methods.recomputePricing = function (surgeMultiplier = 1, discount = 0) {
  const base = this.items.reduce((sum, it) => sum + (it.price || 0), 0);
  const subtotal = Math.round(base * surgeMultiplier);
  const tax = Math.round(subtotal * 0.05);
  this.pricing.subtotal = subtotal;
  this.pricing.surgeMultiplier = surgeMultiplier;
  this.pricing.discount = discount;
  this.pricing.tax = tax;
  this.pricing.total = Math.max(0, subtotal + tax - discount);
  return this.pricing;
};

module.exports = mongoose.model("Booking", bookingSchema);
