const asyncHandler = require("express-async-handler");

const User = require("../models/User");

const Expert = require("../models/Expert");

const Otp = require("../models/Otp");

const { signToken, verifyToken } = require("../middleware/auth");

const env = require("../config/env");

const { serializeUser, serializeExpert } = require("../lib/serialize");

const { isProfileComplete } = require("../lib/profile");

const { loadExpertFromAuth } = require("../lib/expertAuth");



function genCode() {

  return String(Math.floor(100000 + Math.random() * 900000));

}



function normalizePhone(phone) {

  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 10) return `+91${digits}`;

  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;

  if (String(phone || "").startsWith("+")) return String(phone).trim();

  return phone;

}



const requestOtp = asyncHandler(async (req, res) => {

  const phone = normalizePhone(req.body.phone);

  const { role } = req.body;

  if (!phone || !["customer", "expert"].includes(role)) {

    return res.status(400).json({ error: "phone_and_role_required" });

  }



  if (env.DEV_BYPASS_OTP) {

    return res.json({

      ok: true,

      devCode: "000000",

      message: "DEV_BYPASS_OTP=true — any 6-digit code is accepted on verify.",

    });

  }



  const code = genCode();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.create({ phone, code, role, expiresAt });

  return res.json({ ok: true });

});



const verifyOtp = asyncHandler(async (req, res) => {

  const phone = normalizePhone(req.body.phone);

  const { code, role, name } = req.body;

  if (!phone || !code || !role) {

    return res.status(400).json({ error: "missing_fields" });

  }



  if (!env.DEV_BYPASS_OTP) {

    const otp = await Otp.findOne({ phone, role, consumed: false }).sort({ createdAt: -1 });

    if (!otp || otp.code !== code || otp.expiresAt < new Date()) {

      return res.status(400).json({ error: "invalid_or_expired_otp" });

    }

    otp.consumed = true;

    await otp.save();

  }



  if (role === "customer") {

    const existing = await User.findOne({ phone });

    if (!existing || !isProfileComplete(existing)) {

      const registrationToken = signToken(

        { phone, role: "registration", sub: phone },

        { expiresIn: "15m" }

      );

      return res.json({

        needsProfile: true,

        isNew: !existing,

        phone,

        registrationToken,

      });

    }



    const token = signToken({ sub: existing._id.toString(), role: "customer" });

    return res.json({

      token,

      role: "customer",

      principal: serializeUser(existing),

      needsProfile: false,

      isNew: false,

    });

  }



  const principal = await Expert.findOneAndUpdate(

    { phone },

    { $setOnInsert: { phone, name: name || "New Expert", skills: ["head_upper_body", "back_core"] } },

    { upsert: true, new: true }

  );

  const token = signToken({
    sub: principal._id.toString(),
    role: "expert",
    phone: principal.phone,
  });

  const serialized = await serializeExpert(principal);

  return res.json({

    token,

    role: "expert",

    principal: serialized,

    needsProfile: false,

  });

});



const completeProfile = asyncHandler(async (req, res) => {

  const { name, gender, dateOfBirth } = req.body;

  const header = req.headers.authorization || "";

  const [, token] = header.split(" ");

  if (!token) return res.status(401).json({ error: "missing_token" });



  let decoded;

  try {

    decoded = verifyToken(token);

  } catch {

    return res.status(401).json({ error: "invalid_token" });

  }

  if (decoded.role !== "registration" || !decoded.phone) {

    return res.status(403).json({ error: "invalid_registration_token" });

  }



  if (!name?.trim() || !gender || !dateOfBirth) {

    return res.status(400).json({ error: "profile_fields_required" });

  }



  const allowedGender = ["male", "female", "other", "prefer_not_to_say"];

  if (!allowedGender.includes(gender)) {

    return res.status(400).json({ error: "invalid_gender" });

  }



  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) {

    return res.status(400).json({ error: "invalid_date_of_birth" });

  }



  const phone = decoded.phone;

  const principal = await User.findOneAndUpdate(

    { phone },

    { phone, name: name.trim(), gender, dateOfBirth: dob },

    { upsert: true, new: true, setDefaultsOnInsert: true }

  );



  const authToken = signToken({ sub: principal._id.toString(), role: "customer" });

  return res.json({

    token: authToken,

    role: "customer",

    principal: serializeUser(principal),

    needsProfile: false,

    isNew: true,

  });

});



const me = asyncHandler(async (req, res) => {

  const principal =
    req.auth.role === "customer"
      ? await User.findById(req.auth.sub)
      : await loadExpertFromAuth(req.auth);

  if (!principal) return res.status(404).json({ error: "not_found" });

  const serialized =

    req.auth.role === "customer"

      ? serializeUser(principal)

      : await serializeExpert(principal);

  res.json({

    role: req.auth.role,

    principal: serialized,

    needsProfile: req.auth.role === "customer" ? !isProfileComplete(principal) : false,

  });

});



const updatePushToken = asyncHandler(async (req, res) => {

  const { pushToken } = req.body;

  if (req.auth.role === "customer") {

    await User.findByIdAndUpdate(req.auth.sub, { pushToken });

  } else {

    const expert = await loadExpertFromAuth(req.auth);

    if (expert) await Expert.findByIdAndUpdate(expert._id, { pushToken });

  }

  res.json({ ok: true });

});



module.exports = { requestOtp, verifyOtp, completeProfile, me, updatePushToken };

