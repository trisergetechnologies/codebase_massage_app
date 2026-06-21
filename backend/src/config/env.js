require("dotenv").config();

const env = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/codebase_massage",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
  DEV_BYPASS_OTP: (process.env.DEV_BYPASS_OTP || "true") === "true",
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
