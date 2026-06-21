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
 * Booking lifecycle:
 *   created -> searching (dispatch loop is running)
 *           -> assigned  (an expert accepted; en-route)
 *           -> in_progress (expert reached and started)
 *           -> completed
 *           -> cancelled  (terminal failure path, cancel by user/system)
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
      enum: ["created", "searching", "assigned", "in_progress", "completed", "cancelled"],
      default: "created",
      index: true,
    },

    // Quoted ETA snapshot at assignment-time (minutes).
    quotedEtaMin: { type: Number, default: null },

    pricing: {
      subtotal: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },

    payment: {
      status: {
        type: String,
        enum: ["unpaid", "authorized", "paid", "refunded", "failed"],
        default: "unpaid",
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

bookingSchema.methods.recomputePricing = function () {
  const subtotal = this.items.reduce((sum, it) => sum + (it.price || 0), 0);
  const tax = Math.round(subtotal * 0.05);
  this.pricing.subtotal = subtotal;
  this.pricing.tax = tax;
  this.pricing.total = subtotal + tax;
  return this.pricing;
};

module.exports = mongoose.model("Booking", bookingSchema);
