const mongoose = require("mongoose");
const { publicIdPlugin } = require("../lib/ids");

/**
 * An Expert is a service professional (massage therapist).
 * Location is kept "live" via socket pings; we also persist the last known fix
 * with its H3 cell index so we can do fast geospatial dispatch using k-ring expansion.
 *
 * status state machine:
 *   offline -> online (ready to receive offers)
 *   online  -> on_job (currently fulfilling a booking)
 *   on_job  -> online (booking completed)
 */
const expertSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    bio: { type: String, default: "" },

    // Skill tags map to Service.skillTag — used to match offers to qualified experts.
    skills: { type: [String], default: [], index: true },

    rating: { type: Number, default: 5.0 },
    completedJobs: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["offline", "online", "on_job"],
      default: "offline",
      index: true,
    },

    // Last known live location.
    lastLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      updatedAt: { type: Date, default: null },
    },

    // H3 cell at configured resolution. Indexed for O(log n) lookups by cell.
    h3Index: { type: String, default: null, index: true },

    activeBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },

    pushToken: { type: String, default: "" },

    trainingStatus: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

expertSchema.plugin(publicIdPlugin);

module.exports = mongoose.model("Expert", expertSchema);
