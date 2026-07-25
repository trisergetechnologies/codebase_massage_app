require("dotenv").config();

const env = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/codebase_massage",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_me",
  /** @deprecated use JWT_ACCESS_EXPIRES_IN */
  JWT_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "15m",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  DEV_BYPASS_OTP: (process.env.DEV_BYPASS_OTP || "true") === "true",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
  EXPO_PUSH_ENABLED: (process.env.EXPO_PUSH_ENABLED || "false") === "true",
  MSG91_API_KEY: process.env.MSG91_API_KEY || "",
  MSG91_SENDER: process.env.MSG91_SENDER || "",
  MSG91_OTP_TEMPLATE: process.env.MSG91_OTP_TEMPLATE || "",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_FROM: process.env.TWILIO_FROM || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  COUPON_CODES: process.env.COUPON_CODES || "WELCOME10:10,RELAX20:20",
  H3_RESOLUTION: parseInt(process.env.H3_RESOLUTION || "8", 10),
  DISPATCH_SLA_MINUTES: parseInt(process.env.DISPATCH_SLA_MINUTES || "15", 10),
  DISPATCH_OFFER_TIMEOUT_SEC: parseInt(process.env.DISPATCH_OFFER_TIMEOUT_SEC || "30", 10),
  EXPERT_AVG_SPEED_KMPH: parseFloat(process.env.EXPERT_AVG_SPEED_KMPH || "22"),
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

module.exports = env;
