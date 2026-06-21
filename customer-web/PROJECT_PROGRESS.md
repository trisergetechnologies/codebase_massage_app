# Customer Web Progress

## Project Intent

Build a customer-facing web frontend for Codebase Massage, aligned with the existing MVP principle: an on-demand massage marketplace centered on a 15-minute expert dispatch guarantee.

## Current Status

- Created a new isolated Vite React project in `customer-web`.
- Reworked the landing page into a more customer-friendly premium Tailwind-based web experience.
- Kept the existing backend, admin web, customer mobile app, expert app, and scripts untouched.
- Chose Vite over Next.js for a lightweight customer-web surface that can grow into a booking web app later.
- Dependency installation was attempted again after adding Tailwind, but npm registry access still timed out in this environment.
- Vite production build now passes.
- Vite dev server starts successfully on `http://127.0.0.1:5173`.

## Implemented

- Tailwind utility-based layout using the Tailwind browser CDN while npm package installation is unreliable.
- Premium landing hero for Codebase Massage.
- User-friendly service preview cards for Swedish, Deep Tissue, and Aromatherapy.
- Trust section focused on verified therapists, clean home setup, and live updates.
- SLA-first dispatch explanation section with H3-style visual.
- MVP booking flow section.
- Next-milestone CTA for full customer web booking flow.
- Minimal footer with product/account/status links.
- Single customer access screen: phone number -> OTP -> complete profile only for new customers.
- Refined the phone input into a modern taller field with country-code segment and clearer focus state.
- Tuned the site toward calmer Notion-like UI: softer rounded panels, cleaner borders, stronger spacing, and less noisy controls.
- Responsive Tailwind layout for desktop and mobile.
- Visual assets use remote massage/wellness photography.

## Not Yet Done

- Local Tailwind/PostCSS package installation is not active because npm package installation timed out.
- Browser visual verification is pending because no browser automation tool was available in this turn.
- Single OTP access screen is UI-only and not connected to the auth API yet.
- No live catalog fetch, cart, booking, or live tracking web flow yet.

## Location & dispatch (lat/lon MVP)

GPS-based addresses, H3 dispatch with skill+distance ranking, OSM tracking map on order detail, and expert Google Maps deep link (no map API keys).

### End-to-end test

1. **Backend:** `cd backend && npm run seed` (experts online near Bengaluru `12.9716, 77.6411`)
2. **Run:** backend `:4000`, customer-web `npm run dev` `:5173`
3. **CORS:** include `http://localhost:5173` in `CORS_ORIGINS` if using a custom `.env`
4. **Expert app:** login `+919000000005`, toggle **Online** with GPS near seed area
5. **Customer web:** login, **My Addresses** → add address (auto GPS), book a service
6. **Expert:** accept offer within 30s → customer order page shows map + straight-line km
7. **Expert:** **Go to location** opens Google Maps; complete arrived → start → complete

**Note:** Browser geolocation requires `https` or `localhost`. Customer GPS must be near seeded experts for dispatch to succeed (or re-seed `CENTRE` in `backend/src/scripts/seed.js`).

## Next Step

Verify full booking flow in browser after backend + expert app are running.
