"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [services, setServices] = useState([]);
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.listServices(), api.listExperts()])
      .then(([s, e]) => {
        setServices(s);
        setExperts(e);
      })
      .catch((err) => setError(err.message));
  }, []);

  const online = experts.filter((e) => e.status === "online").length;
  const onJob = experts.filter((e) => e.status === "on_job").length;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {error && (
        <div className="card" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          {error}
        </div>
      )}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">Active services</div>
          <div className="value">{services.length}</div>
        </div>
        <div className="kpi">
          <div className="label">Experts online</div>
          <div className="value" style={{ color: "var(--accent-2)" }}>{online}</div>
        </div>
        <div className="kpi">
          <div className="label">On a job</div>
          <div className="value" style={{ color: "var(--warn)" }}>{onJob}</div>
        </div>
        <div className="kpi">
          <div className="label">Total experts</div>
          <div className="value">{experts.length}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>Quick links</h2>
        <p style={{ color: "var(--muted)" }}>
          Manage <Link href="/services" style={{ color: "var(--accent)" }}>services</Link>, view{" "}
          <Link href="/experts" style={{ color: "var(--accent)" }}>experts</Link>, watch{" "}
          <Link href="/bookings" style={{ color: "var(--accent)" }}>bookings</Link>, and read{" "}
          <Link href="/reviews" style={{ color: "var(--accent)" }}>reviews</Link>.
        </p>
      </div>
    </div>
  );
}
