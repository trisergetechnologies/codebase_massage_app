const mongoose = require("mongoose");
const { publicIdPlugin } = require("../lib/ids");

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    line1: String,
    line2: String,
    city: String,
    pincode: String,
    lat: Number,
    lng: Number,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false }
);

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say", ""],
      default: "",
    },
    dateOfBirth: { type: Date, default: null },
    email: { type: String, default: "" },
    addresses: { type: [addressSchema], default: [] },
    pushToken: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.plugin(publicIdPlugin);

module.exports = mongoose.model("User", userSchema);
