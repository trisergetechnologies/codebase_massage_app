import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

async function loadDashboard() {
  try {
    const [services, experts] = await Promise.all([api.listServices(), api.listExperts()]);
    return { services, experts };
  } catch (err) {
    return { services: [], experts: [], error: err.message };
  }
}

export default async function DashboardPage() {
  const { services, experts, error } = await loadDashboard();
  const online = experts.filter((e) => e.status === "online").length;
  const onJob = experts.filter((e) => e.status === "on_job").length;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {error && (
        <div className="card" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          Backend unreachable: {error}
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
          Manage <a href="/services" style={{ color: "var(--accent)" }}>services</a>, view{" "}
          <a href="/experts" style={{ color: "var(--accent)" }}>experts</a>, and watch live{" "}
          <a href="/bookings" style={{ color: "var(--accent)" }}>bookings</a>.
        </p>
      </div>
    </div>
  );
}
