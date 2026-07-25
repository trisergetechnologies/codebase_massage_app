/**
 * Tiny notification fan-out abstraction.
 *
 * Real-time, in-app delivery happens over Socket.IO rooms. For "background"
 * pushes we'd talk to Expo Push (https://exp.host/--/api/v2/push/send) — the
 * call is stubbed below so the system runs offline; flip the `try` block on
 * once you're ready to ship to TestFlight / Play.
 */

const env = require("../config/env");

async function expoPush(token, title, body, data = {}) {
  if (!token) return;
  const payload = { to: token, sound: "default", title, body, data };
  try {
    if (env.EXPO_PUSH_ENABLED) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      console.log("[notify] (stubbed) push ->", token, title, body);
    }
  } catch (err) {
    console.warn("[notify] push failed", err.message);
  }
}

function emitToRoom(io, room, event, payload) {
  if (!io) return;
  io.to(room).emit(event, payload);
}

module.exports = { expoPush, emitToRoom };
