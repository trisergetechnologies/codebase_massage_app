const env = require("../config/env");

/**
 * Send OTP via MSG91 (India) or Twilio when configured; otherwise log in dev.
 */
async function sendOtp(phone, code) {
  if (env.MSG91_API_KEY && env.MSG91_SENDER) {
    const url = new URL("https://control.msg91.com/api/v5/flow/");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authkey: env.MSG91_API_KEY,
      },
      body: JSON.stringify({
        template_id: env.MSG91_OTP_TEMPLATE || undefined,
        recipients: [{ mobiles: phone.replace(/\D/g, ""), var: code }],
      }),
    });
    if (!res.ok) throw new Error(`msg91_${res.status}`);
    return;
  }

  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM) {
    const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString("base64");
    const body = new URLSearchParams({
      To: phone,
      From: env.TWILIO_FROM,
      Body: `Your Codebase Massage code is ${code}. Valid for 5 minutes.`,
    });
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
      { method: "POST", headers: { authorization: `Basic ${auth}` }, body }
    );
    if (!res.ok) throw new Error(`twilio_${res.status}`);
    return;
  }

  console.log(`[sms] (dev) OTP for ${phone}: ${code}`);
}

module.exports = { sendOtp };
