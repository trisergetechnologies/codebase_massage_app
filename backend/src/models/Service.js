const mongoose = require("mongoose");

/**
 * A Service is a single bookable massage offering.
 * `skillTag` connects the service to the expert skill required to fulfill it.
 * `addOnEligible` services can be added to an in-progress booking.
 */
const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    /** Category slugs — a service may appear under multiple browse groups. */
    categories: { type: [String], default: [], index: true },
    skillTag: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    durationMin: { type: Number, required: true, min: 15 },
    price: { type: Number, required: true, min: 0 },

    addOnEligible: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
