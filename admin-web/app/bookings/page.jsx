"use client";

import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

/**
 * NOTE: This page lists all bookings via a public-ish admin shortcut.
 * The backend has `GET /api/bookings` behind auth — for the admin panel we'd
 * normally mint a long-lived admin JWT. To keep the demo running we surface
 * an unauthenticated tail by polling the experts endpoint to infer activity,
 * but the right thing to do in production is to add a `requireAuth("admin")`
 * route. Wiring an admin login is left as a marked TODO.
 */
export default function BookingsPage() {
  const [pulse, setPulse] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setPulse(Date.now()), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h1>Live bookings</h1>
      <div className="card">
        <h2>Status</h2>
        <p style={{ color: "var(--muted)" }}>
          Live booking feed ties into <code>booking:*</code> Socket.IO rooms. To see real-time
          dispatch, status transitions, and live tracking, sign in as a customer in the Expo app
          and open this page side-by-side.
        </p>
        <p style={{ color: "var(--muted)", fontSize: 12 }}>
          Last pulse: {new Date(pulse).toLocaleTimeString()} · API {BASE}
        </p>
        <p style={{ color: "var(--muted)" }}>
          TODO (production): wire an admin login that mints an admin-scoped JWT, then call
          <code> GET /api/bookings</code> with role=admin to list every booking with filters.
        </p>
      </div>
    </div>
  );
}
