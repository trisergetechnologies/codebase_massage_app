const env = require("../config/env");

/**
 * Payment abstraction — Razorpay when keys are set, otherwise test capture.
 */
async function capture(booking, providerRef) {
  if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && providerRef) {
    const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const res = await fetch(`https://api.razorpay.com/v1/payments/${providerRef}/capture`, {
      method: "POST",
      headers: {
        authorization: `Basic ${auth}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ amount: booking.pricing.total * 100, currency: "INR" }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`razorpay_capture_failed: ${err}`);
    }
    const data = await res.json();
    return { status: "paid", providerRef: data.id, method: "razorpay" };
  }

  return {
    status: "paid",
    providerRef: providerRef || `test_${Date.now()}`,
    method: "card_test",
  };
}

module.exports = { capture };
