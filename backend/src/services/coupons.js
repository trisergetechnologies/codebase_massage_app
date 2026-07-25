const env = require("../config/env");

/** Parse COUPON_CODES env: "WELCOME10:10,SAVE50:50" → map */
function parseCoupons() {
  const raw = env.COUPON_CODES || "WELCOME10:10,RELAX20:20";
  const map = {};
  for (const part of raw.split(",")) {
    const [code, amount] = part.trim().split(":");
    if (code && amount) map[code.toUpperCase()] = parseInt(amount, 10);
  }
  return map;
}

function validate(code) {
  if (!code) return { valid: false, discount: 0 };
  const coupons = parseCoupons();
  const discount = coupons[String(code).toUpperCase()];
  if (!discount) return { valid: false, discount: 0 };
  return { valid: true, discount, code: String(code).toUpperCase() };
}

module.exports = { validate, parseCoupons };
