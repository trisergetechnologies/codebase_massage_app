"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setAdminTokens } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(password);
      setAdminTokens(res.accessToken || res.token, res.refreshToken);
      router.replace("/");
    } catch (err) {
      setError("Invalid password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h1 style={{ marginTop: 0 }}>Admin sign in</h1>
      <p style={{ color: "var(--muted)" }}>
        Default dev password is <code>admin123</code> (set <code>ADMIN_PASSWORD</code> in backend).
      </p>
      <form onSubmit={submit} className="card" style={{ marginTop: 24 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          style={{ width: "100%", marginBottom: 16 }}
          autoComplete="current-password"
        />
        {error && <p style={{ color: "var(--danger)", fontSize: 14 }}>{error}</p>}
        <button type="submit" className="btn primary" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
