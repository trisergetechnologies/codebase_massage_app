"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try { setExperts(await api.listExperts()); }
    catch (e) { setError(e.message); }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h1>Experts</h1>
      <div className="card">
        <h2>Roster <span style={{ color: "var(--muted)", fontSize: 13, fontWeight: 400 }}>(auto-refresh 5s)</span></h2>
        {error && <div style={{ color: "var(--danger)" }}>{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Phone</th><th>Skills</th><th>Status</th>
              <th>Rating</th><th>Jobs</th><th>H3 cell</th><th>Last seen</th>
            </tr>
          </thead>
          <tbody>
            {experts.map((e) => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td>{e.phone}</td>
                <td>{(e.skills || []).map((s) => <span key={s} className="badge" style={{ marginRight: 4 }}>{s}</span>)}</td>
                <td><span className={`badge ${e.status}`}>{e.status}</span></td>
                <td>{e.rating?.toFixed(1) ?? "-"}</td>
                <td>{e.completedJobs}</td>
                <td style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}>{e.h3Index || "-"}</td>
                <td style={{ color: "var(--muted)" }}>
                  {e.lastLocation?.updatedAt ? new Date(e.lastLocation.updatedAt).toLocaleTimeString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
