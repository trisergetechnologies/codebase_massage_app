const { Server } = require("socket.io");
const { verifyAccessToken } = require("../middleware/auth");
const Expert = require("../models/Expert");
const dispatcher = require("../services/dispatcher");
const geo = require("../services/geo");
const { loadExpertFromAuth } = require("../lib/expertAuth");
const { trackExpertConnection, untrackExpertConnection } = require("../realtime/connections");

/**
 * Socket.IO surface
 *
 *   Client connects with `auth.token` (JWT) at handshake. Once authenticated,
 *   we auto-join the principal's role-room:
 *     - customers join `customer:{id}`
 *     - experts join `expert:{id}`  (used by dispatcher offers)
 *
 *   Booking-scoped rooms (`booking:{id}`) are joined explicitly via the
 *   `booking:subscribe` event so both sides can stream tracking updates.
 *
 * Events (server -> client):
 *   - dispatch:offer              expert receives a new job offer
 *   - booking:assigned            customer learns who's coming
 *   - booking:status              status transitions
 *   - booking:expert_location     live tracking pings (every ~3s)
 *   - booking:addon               new add-on inserted into in-progress booking
 *   - booking:arrived             expert reached pickup
 *   - booking:failed              dispatch couldn't find anyone in SLA
 *
 * Events (client -> server):
 *   - booking:subscribe           join `booking:{id}` room
 *   - booking:unsubscribe         leave room
 *   - dispatch:respond            expert accept/decline
 *   - expert:location             expert sends a GPS ping while on a job
 */
function setupSocket(server, corsOrigins) {
  const io = new Server(server, {
    cors: { origin: corsOrigins, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("unauthorized"));
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    let { sub, role } = socket.user;
    if (role === "expert") {
      const expert = await loadExpertFromAuth(socket.user);
      if (!expert) {
        socket.disconnect(true);
        return;
      }
      sub = expert._id.toString();
      socket.user = { ...socket.user, sub };
      trackExpertConnection(sub, socket.id);
      console.log(`[socket] expert connected ${sub}`);
    }
    socket.join(`${role}:${sub}`);

    socket.on("booking:subscribe", ({ bookingId }) => {
      if (bookingId) socket.join(`booking:${bookingId}`);
    });

    socket.on("booking:unsubscribe", ({ bookingId }) => {
      if (bookingId) socket.leave(`booking:${bookingId}`);
    });

    socket.on("dispatch:respond", async ({ bookingId, accepted }) => {
      if (role !== "expert") return;
      await dispatcher.handleExpertResponse(bookingId, sub, !!accepted);
    });

    socket.on("expert:location", async ({ lat, lng, bookingId }) => {
      if (role !== "expert") return;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      // Persist roughly every ping but throttle DB writes to once / ~3s would
      // be ideal in production; for MVP we just write through.
      try {
        await Expert.updateOne(
          { _id: sub },
          {
            lastLocation: { lat, lng, updatedAt: new Date() },
            h3Index: geo.toCell(lat, lng),
          }
        );
      } catch (err) {
        console.warn("[socket] location write failed", err.message);
      }

      // Fan out to anyone watching this booking.
      if (bookingId) {
        io.to(`booking:${bookingId}`).emit("booking:expert_location", {
          lat,
          lng,
          at: Date.now(),
        });
      }
    });

    socket.on("disconnect", () => {
      if (role === "expert") untrackExpertConnection(sub, socket.id);
    });
  });

  return io;
}

module.exports = { setupSocket };
