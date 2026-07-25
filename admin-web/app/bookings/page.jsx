"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await api.listBookings();
        if (!cancelled) setBookings(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const t = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  if (loading) return <p style={{ color: "var(--muted)" }}>Loading bookings…</p>;
  if (error) return <div className="card" style={{ borderColor: "var(--danger)" }}>{error}</div>;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Live bookings</h1>
      <p style={{ color: "var(--muted)" }}>
        {bookings.length} booking(s) · refreshes every 8s
      </p>
      <div className="card" style={{ marginTop: 16, overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Expert</th>
              <th>Total</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td><code>{b.id?.slice(0, 8)}…</code></td>
                <td>{b.status}</td>
                <td>{b.customer?.name || b.customer?.phone || "—"}</td>
                <td>{b.expert?.name || "—"}</td>
                <td>₹{b.pricing?.total}</td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p style={{ color: "var(--muted)", padding: 16 }}>No bookings yet.</p>
        )}
      </div>
    </div>
  );
}
