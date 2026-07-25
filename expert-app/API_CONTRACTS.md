# Expert app API contracts

Base URL: `expert-app/src/config.js` → `/api`

Auth: `Authorization: Bearer <accessToken>` (expert role). Access JWT `sub` is internal Mongo id.
Access tokens expire quickly (~15m); clients refresh via `refreshToken`.

---

## Auth

### `POST /auth/request-otp`
```json
{ "phone": "+919000000005", "role": "expert" }
```
Response: `{ "ok": true }` (dev: any 6-digit code works)

### `POST /auth/verify-otp`
```json
{ "phone": "+919000000005", "code": "123456", "role": "expert", "name": "Kabir" }
```
Response:
```json
{
  "accessToken": "jwt…",
  "refreshToken": "opaque…",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "token": "jwt…",
  "role": "expert",
  "principal": { "id": "uuid", "name": "…", "phone": "…", "status": "offline", "trainingStatus": "pending", … }
}
```
(`token` is a legacy alias of `accessToken`.)

### `POST /auth/refresh`
```json
{ "refreshToken": "opaque…" }
```
Response: same shape as login token fields (`accessToken`, `refreshToken`, `expiresIn`, …).
Errors: `401 { "error": "invalid_refresh_token" }` (also on refresh-token reuse after rotation).

### `POST /auth/logout`
```json
{ "refreshToken": "opaque…" }
```
Response: `{ "ok": true }` (idempotent).

### Auth errors on protected routes
- `401 missing_token`
- `401 token_expired` — client should refresh then retry once
- `401 invalid_token` — do not refresh; force re-login
- `403 wrong_role`

---

## Expert

### `GET /expert/me`
Expert profile (`id` = public UUID).

### `GET /expert/dashboard`
```json
{
  "today": { "orders": 2, "earnings": 1200, "completed": 1 },
  "earnings": { "today": {…}, "week": {…}, "month": {…} },
  "recentOrders": [ /* serialized bookings */ ]
}
```

### `GET /expert/earnings?period=today|week|month`
```json
{
  "period": "today",
  "orderCount": 3,
  "commission": 2100,
  "baseSalary": 0,
  "bonus": 150,
  "total": 2250
}
```

### `POST /expert/online` — `{ "lat": 12.97, "lng": 77.64 }`
### `POST /expert/offline`

---

## Bookings (expert)

### `GET /bookings?scope=today|history`
- `today`: bookings created today for this expert
- `history`: completed + cancelled

### `GET /bookings/:id`
Includes `sessionOtp.startCode` / `endCode` for active expert (dev + partner flow).

### `POST /bookings/:id/arrived`
### `POST /bookings/:id/start` — `{ "otp": "1234" }`
### `POST /bookings/:id/complete` — `{ "otp": "5678" }`

---

## Socket.IO

- `dispatch:offer` — incoming order (30s timer)
- `dispatch:respond` — `{ bookingId, accepted }`
- `booking:subscribe` / `booking:unsubscribe`

Offer payload includes: `customerName`, `serviceName`, `durationMin`, `distanceKm`, `etaMin`, `pickupLocation`, `total`.
