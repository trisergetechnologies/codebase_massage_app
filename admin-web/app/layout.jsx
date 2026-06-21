import "./globals.css";

export const metadata = {
  title: "Codebase Massage — Admin",
  description: "Manage services, experts and live bookings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="brand">Codebase&nbsp;Massage</div>
          <nav>
            <a href="/">Dashboard</a>
            <a href="/services">Services</a>
            <a href="/experts">Experts</a>
            <a href="/bookings">Bookings</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
