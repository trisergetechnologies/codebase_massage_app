# Project principles

Shared conventions for the **Codebase Massage** monorepo (`backend/`, `expert-app/`, `customer-web/`, `customer-app/`, `admin-web/`). When in doubt, match these patterns before inventing new ones.

---

## 1. Identifier strategy (two IDs, not three)

We deliberately avoid exposing MongoDB `_id` outside the server.

| Layer | Identifier | Example | Used for |
|---|---|---|---|
| **Database (internal)** | Mongo `_id` | `674a1f…` | Foreign keys, JWT `sub`, expert socket rooms (`expert:{mongoId}`), dispatch internals |
| **API / clients / sockets (external)** | `publicId` (UUID v4) | `a3b2c1d4-…` | Bookings, users, experts in JSON and realtime payloads |
| **Services (catalog)** | `slug` | `swedish-60` | Service `id` in API; stable, human-readable, no extra UUID |

### Rules

1. **Never return `_id` in HTTP responses truncated or otherwise.** Serializers in `backend/src/lib/serialize.js` map documents to `{ id: publicId, … }`.
2. **Route params accept either** `publicId` **or legacy ObjectId** during migration (`findByPublicId` in `backend/src/lib/ids.js`). Prefer public ids in all new client code.
3. **JWT `sub` stays the Mongo `_id`** — auth is server-internal; clients never need to parse it.
4. **Socket.IO booking rooms** use public ids: `booking:{publicId}`. Subscribe/unsubscribe and location fan-out use the same key.
5. **Dispatch offers** emit `bookingId: publicId`. Expert accept/decline sends that id back; the dispatcher resolves it internally.
6. **Services** are referenced by **slug** in booking creation (`serviceIds: ["swedish-60"]`). ObjectIds still work temporarily for backward compatibility.
7. **New models** that face clients should use the `publicIdPlugin` unless they already have a natural public key (like `slug` on Service).

### Migration

Existing data without `publicId`:

```bash
cd backend
npm run backfill-ids
```

Re-run safely anytime. Fresh seeds get `publicId` on insert via the plugin default.

---

## 2. API shape

- **Success responses** use serialized DTOs — no raw Mongoose documents.
- **Errors** use short machine codes: `{ "error": "not_found" }`, `{ "error": "invalid_service" }`.
- **Populated refs** (customer, expert on bookings) are also serialized briefs with `id`, not `_id`.

---

## 3. Realtime (Socket.IO)

- Auth: JWT in `handshake.auth.token`.
- Auto-join on connect: `customer:{mongoId}` or `expert:{mongoId}` (internal — only the server targets these rooms).
- Booking-scoped events: client explicitly `booking:subscribe` with **public** booking id.
- Client → server events: `dispatch:respond`, `expert:location`, `booking:subscribe` / `unsubscribe`.

---

## 4. Dispatch & SLA

- **15-minute SLA** — experts must be reachable within ETA ≤ `DISPATCH_SLA_MINUTES` (default 15).
- **H3 hex indexing** for geo queries; haversine only for scoring within a cell ring.
- **Sequential offers** — one expert at a time, 30s timeout, then next candidate.
- Expert must be **online** and **skill-matched** for all line items in the booking.

---

## 5. Current product focus

| Priority | App | Notes |
|---|---|---|
| Active | `expert-app/` | EAS dev client; Metro reload for JS changes |
| Next | `customer-web/` | Landing + auth shell; wire to same API |
| On hold | `customer-app/` | Reference only; update ids when revived |
| Supporting | `backend/`, `admin-web/` | Shared API and ops |

---

## 6. Local development

```text
Backend:  cd backend && npm run dev          # :4000
Tunnel:   ngrok http 4000                    # HTTPS for physical devices
Expert:   cd expert-app && npx expo start --dev-client --port 8082
Seed:     cd backend && npm run seed
```

- **Dev OTP bypass**: `DEV_BYPASS_OTP=true` — any 6-digit code works.
- **Expert test login**: `+919000000005` (seed expert Kabir J.).
- **API base URL** for expert app: set in `expert-app/src/config.js` (ngrok URL during device testing).

---

## 7. Code conventions

- **Minimize scope** — smallest correct change; don't refactor unrelated code.
- **Match existing patterns** in each app (Expo JS in mobile, Express controllers in backend).
- **Comments** only for non-obvious business logic (dispatch, H3, id migration).
- **No secrets in git** — `.env` locally; ngrok URLs in config are dev-only.

---

## File reference

| Concern | Location |
|---|---|
| ID helpers | `backend/src/lib/ids.js` |
| JSON serializers | `backend/src/lib/serialize.js` |
| Backfill script | `backend/src/scripts/backfill-ids.js` |
| Dispatch | `backend/src/services/dispatcher.js` |
| Sockets | `backend/src/realtime/socket.js` |

When adding a new entity exposed to clients, start here: add `publicIdPlugin`, serializer, `findByPublicId` in routes, and document the `id` field in this file if the rules differ from the table above.
