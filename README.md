# Codebase Massage

An Urban Company-style on-demand **massage** marketplace, focused on a **15-minute service guarantee**. The platform consists of four apps in this monorepo:

> **Project conventions:** see [PRINCIPLES.md](./PRINCIPLES.md) — identifier strategy (`publicId` / `slug`), API shape, realtime rooms, dispatch SLA, and dev workflow.

| App | Tech | Folder | Default port |
|---|---|---|---|
| Backend API + realtime | Node.js, Express, Mongoose, Socket.IO, h3-js | `backend/` | 4000 |
| Admin web | Next.js 14 (App Router) | `admin-web/` | 3000 |
| Customer mobile | Expo (React Native) | `customer-app/` | 8081 / Expo |
| Expert mobile | Expo (React Native) | `expert-app/` | 8081 / Expo |

## Features

1. **Booking** — phone-OTP login, location-aware checkout, real-time status updates.
2. **Combine services into one booking** — multi-select cart, single booking record, single expert handles all line items.
3. **Add-ons during a running booking** — customer can append a new massage (e.g. foot reflexology) while service is in progress; pricing is live-recomputed.
4. **Live tracking with Leaflet + OpenStreetMap** — no API keys, free tiles. The expert app streams GPS over Socket.IO and the customer app renders a moving marker.
5. **15-minute SLA via H3 dispatch** — the dispatcher uses Uber's H3 hexagonal index to find qualified online experts within an ETA-bounded ring (k-ring growth), offers the job to the best one, and reassigns on decline/timeout.
6. **Notifications** — Socket.IO rooms for in-app realtime + an Expo Push abstraction (stubbed for offline dev, ready to flip on).

## How the 15-minute dispatch works

```
booking.created
   |
   v
[ runDispatch(io, bookingId) ]
   |
   v   k = 0
   |   gridDisk(booking.h3Index, k) -> set of cells
   |   query: experts where status=online AND skills include all required AND h3Index in cells
   |   filter: ETA = haversine / avg_speed_kmph * 60  <=  15 min
   |   sort:   ETA asc, then rating desc
   |
   v   pick top -> emit `dispatch:offer` to `expert:{id}` room
   |   wait `DISPATCH_OFFER_TIMEOUT_SEC` (30s default)
   |
   ?-- expert accepts -> atomic claim (status: online -> on_job) -> assign
   ?-- declined / timed out -> add to declinedBy[] -> next candidate
   ?-- no candidates -> grow k by 1 (or wait 5s if ring empty), repeat
   |
   v   exhausted -> booking.status = cancelled, emit `booking:failed`
```

H3 is great here because:
- Point→cell is O(1) at any resolution.
- `gridDisk` returns a flat cell set you can index with a Mongo `$in` over an indexed `h3Index` field — much cheaper than haversine over every expert.
- Ring radius scales predictably with hex edge length, so the SLA caps the maximum k.

## Project layout

```
codebase_massage_app/
├── backend/
│   └── src/
│       ├── server.js            # Express + Socket.IO bootstrap
│       ├── routes/index.js      # All HTTP routes
│       ├── controllers/         # auth, services, bookings, experts
│       ├── models/              # Mongoose: User, Expert, Service, Booking, Otp
│       ├── services/
│       │   ├── geo.js           # H3 helpers, haversine, ETA, ring growth
│       │   ├── dispatcher.js    # The dispatch state machine
│       │   └── notify.js        # Socket fan-out + Expo push (stub)
│       ├── realtime/socket.js   # Socket.IO auth + event handlers
│       ├── middleware/          # auth (JWT), error handlers
│       ├── config/              # env + db
│       └── scripts/seed.js      # Seed services + sample experts
├── admin-web/                   # Next.js admin
├── customer-app/                # Expo customer
├── expert-app/                  # Expo expert
└── PRINCIPLES.md                # Shared conventions (IDs, API, dispatch, dev)
```

## Quick start

You need **Node.js 18+**, **MongoDB 6+ running locally**, and the **Expo CLI** (or just use `npx expo`).

> **Already set up on this machine** (see *Android emulator* section below): Android Studio 2025.3, Android SDK at `%LOCALAPPDATA%\Android\Sdk`, Android 14 (API 34) system image, AVD `pixel_dev`, hardware acceleration via WHPX. Total ~5.4 GB.

### 1. Backend

```bash
cd backend
cp .env.example .env       # adjust MONGO_URI if needed
npm install
npm run seed               # populates 6 massages + 5 sample experts (online)
npm run dev                # http://localhost:4000
```

Health check: `curl http://localhost:4000/health`

### 2. Admin web

```bash
cd admin-web
cp .env.local.example .env.local
npm install
npm run dev                # http://localhost:3000
```

### 3. Customer app

```bash
cd customer-app
npm install
npx expo start             # press w (web), i (iOS sim), a (Android emulator)
```

Login with any phone (e.g. `+919999999999`), any 6-digit OTP works in dev.

### 4. Expert app

```bash
cd expert-app
npm install
npx expo start
```

Login as a seeded expert, e.g. `+919000000005` (Kabir J., all skills). Toggle **Availability** to *online*, then create a booking from the customer app — you should receive a **dispatch offer** within ~5 seconds.

## Android emulator

The emulator is fully bootstrapped on this machine. Helper scripts in `scripts/`:

| Script | Purpose |
|---|---|
| `scripts/setup-android.ps1` | One-shot bootstrap (already run). Re-run safely if you reformat the box. |
| `scripts/run-emulator.ps1` | Boots `pixel_dev` and waits for full boot. |
| `scripts/start-all.ps1` | Spins up backend + admin + both Expo apps in 4 PowerShell windows. |

```powershell
# Boot the emulator (only needed once per session)
pwsh -ExecutionPolicy Bypass -File scripts/run-emulator.ps1

# In another terminal:
cd customer-app ; npx expo start --port 8081   # press 'a' to install on emulator

# In another terminal (note the different port):
cd expert-app   ; npx expo start --port 8082   # press 'a' to install on the same emulator
```

Both APKs install side-by-side on the same emulator (different bundle IDs: `com.codebase.massage.customer` and `com.codebase.massage.expert`) — switch between them via the launcher.

**Running both apps without two emulators:** since two real-time roles (customer + expert) need to be tested simultaneously, the most ergonomic combo is:

- **Emulator** runs one role (e.g. customer)
- **Expo Go** on your physical phone runs the other (scan the QR Expo prints in the terminal)

That avoids the RAM cost of a second AVD entirely. The backend is reachable from the phone if your laptop and phone are on the same Wi-Fi — point the phone's Expo at `exp://<your-laptop-LAN-IP>:8082`.

### Useful manual commands

```powershell
# List AVDs
& "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds

# Connected devices
& "$env:ANDROID_HOME\platform-tools\adb.exe" devices

# Cold-boot (wipe data — useful if storage gets corrupted)
pwsh -ExecutionPolicy Bypass -File scripts/run-emulator.ps1 -ColdBoot
```

## End-to-end demo flow

1. Boot backend, seed it, then start the customer and expert apps.
2. Log into the expert app as `+919000000005`, flip the availability switch ON. The dashboard shows status `online`.
3. Log into the customer app, add 1–2 services, tap **Book now**.
4. The expert receives a slide-up offer card — tap **Accept**.
5. Customer screen flips to *Live booking*, showing the expert's position on the Leaflet map. Move the device (or simulate GPS in your emulator) — the customer sees the expert move in real time.
6. Expert taps **I have arrived** → **Start service** → eventually **Complete service**.
7. While `in_progress`, the customer can tap **+ Add another massage** to drop in an add-on; the new line item appears immediately on both sides and the total updates.
8. After completion, customer pays (test) and rates.

## Configuration knobs

All in `backend/.env`:

| Var | Default | Notes |
|---|---|---|
| `H3_RESOLUTION` | `8` | Hex edge ≈ 460 m. Lower = bigger cells (faster but coarser). |
| `DISPATCH_SLA_MINUTES` | `15` | Hard cap for ETA. Beyond this, dispatch fails. |
| `DISPATCH_OFFER_TIMEOUT_SEC` | `30` | Auto-decline if expert doesn't respond. |
| `EXPERT_AVG_SPEED_KMPH` | `22` | Used in ETA = distance / speed. |
| `DEV_BYPASS_OTP` | `true` | Any 6-digit OTP works. **Disable in production.** |

## What's stubbed vs production-ready

- **OTP delivery** — currently dev-bypass. Wire Twilio / MSG91 in `auth.controller.requestOtp`.
- **Push notifications** — Expo Push call is commented out in `services/notify.js`. Flip the `try` block back on once you have device tokens.
- **Payments** — `POST /api/bookings/:id/payment` just marks the record `paid`. Replace with a Stripe / Razorpay PaymentIntent + webhook.
- **Admin auth** — admin pages currently hit unauthenticated `/admin/*` routes. Add a `requireAuth("admin")` middleware backed by an admin JWT before shipping.
- **Multi-instance scaling** — the dispatcher's pending-offer map is in-process. For HA, swap `Map` for Redis pub/sub so any node can route accept/decline.

## Roadmap

- Reviews & ratings tab in admin
- Expert earnings ledger
- Surge pricing per H3 cell at peak demand
- Time-window bookings (schedule for later, not just now)
- KYC & background-check workflow for new experts
