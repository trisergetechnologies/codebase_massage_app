import "./globals.css";
import { AdminShell } from "@/components/AdminShell";

export const metadata = {
  title: "Codebase Massage — Admin",
  description: "Manage services, experts and live bookings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
