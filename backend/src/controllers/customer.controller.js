const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { serializeUser } = require("../lib/serialize");

function serializeAddress(addr) {
  const o = addr.toObject ? addr.toObject() : addr;
  return {
    id: o._id?.toString(),
    label: o.label || "Home",
    line1: o.line1 || "",
    line2: o.line2 || "",
    city: o.city || "",
    pincode: o.pincode || "",
    lat: o.lat,
    lng: o.lng,
    isDefault: !!o.isDefault,
  };
}

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, gender, dateOfBirth } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = String(name).trim();
  if (email !== undefined) updates.email = String(email).trim();
  if (gender !== undefined) updates.gender = gender;
  if (dateOfBirth !== undefined) {
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      return res.status(400).json({ error: "invalid_date_of_birth" });
    }
    updates.dateOfBirth = dob;
  }

  const user = await User.findByIdAndUpdate(req.auth.sub, updates, { new: true });
  if (!user) return res.status(404).json({ error: "not_found" });
  res.json({ principal: serializeUser(user) });
});

const addAddress = asyncHandler(async (req, res) => {
  const { label, line1, line2, city, pincode, lat, lng, isDefault } = req.body;
  if (!line1?.trim() || typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "address_fields_required" });
  }

  const user = await User.findById(req.auth.sub);
  if (!user) return res.status(404).json({ error: "not_found" });

  const makeDefault = isDefault || user.addresses.length === 0;
  if (makeDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  user.addresses.push({
    label: label || "Home",
    line1: line1.trim(),
    line2: line2 || "",
    city: city || "",
    pincode: pincode || "",
    lat,
    lng,
    isDefault: makeDefault,
  });
  await user.save();
  res.status(201).json({ addresses: user.addresses.map(serializeAddress) });
});

const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.sub);
  if (!user) return res.status(404).json({ error: "not_found" });

  const addr = user.addresses.id(req.params.addressId);
  if (!addr) return res.status(404).json({ error: "address_not_found" });

  const { label, line1, line2, city, pincode, lat, lng, isDefault } = req.body;
  if (label !== undefined) addr.label = label;
  if (line1 !== undefined) addr.line1 = line1;
  if (line2 !== undefined) addr.line2 = line2;
  if (city !== undefined) addr.city = city;
  if (pincode !== undefined) addr.pincode = pincode;
  if (lat !== undefined) addr.lat = lat;
  if (lng !== undefined) addr.lng = lng;

  if (isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
    addr.isDefault = true;
  }

  await user.save();
  res.json({ addresses: user.addresses.map(serializeAddress) });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.sub);
  if (!user) return res.status(404).json({ error: "not_found" });

  const addr = user.addresses.id(req.params.addressId);
  if (!addr) return res.status(404).json({ error: "address_not_found" });

  const wasDefault = addr.isDefault;
  addr.deleteOne();
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  res.json({ addresses: user.addresses.map(serializeAddress) });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.sub);
  if (!user) return res.status(404).json({ error: "not_found" });

  const addr = user.addresses.id(req.params.addressId);
  if (!addr) return res.status(404).json({ error: "address_not_found" });

  user.addresses.forEach((a) => {
    a.isDefault = false;
  });
  addr.isDefault = true;
  await user.save();
  res.json({ addresses: user.addresses.map(serializeAddress) });
});

module.exports = {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
