"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listReviews().then(setReviews).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="card" style={{ borderColor: "var(--danger)" }}>{error}</div>;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Reviews & ratings</h1>
      <p style={{ color: "var(--muted)" }}>{reviews.length} customer review(s)</p>
      <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
        {reviews.map((r) => (
          <div key={r.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong>{r.customer?.name || "Customer"}</strong>
              <span style={{ color: "var(--accent)" }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
            </div>
            {r.comment && <p style={{ margin: "8px 0 0" }}>{r.comment}</p>}
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
              Expert: {r.expert?.name || "—"} · {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No reviews yet — they appear after customers rate completed sessions.</p>
        )}
      </div>
    </div>
  );
}
