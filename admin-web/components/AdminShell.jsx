"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminToken, logoutAdmin } from "@/lib/api";

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/login";

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!getAdminToken()) router.replace("/login");
  }, [ready, isLogin, router]);

  async function logout() {
    await logoutAdmin();
    router.replace("/login");
  }

  if (isLogin) return children;

  if (!ready) return null;

  return (
    <>
      <header className="topbar">
        <div className="brand">Codebase&nbsp;Massage</div>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/services">Services</Link>
          <Link href="/experts">Experts</Link>
          <Link href="/bookings">Bookings</Link>
          <Link href="/reviews">Reviews</Link>
          <button
            type="button"
            onClick={logout}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", font: "inherit" }}
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
