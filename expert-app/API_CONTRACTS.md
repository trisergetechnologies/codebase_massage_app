# Expert app API contracts

Base URL: `expert-app/src/config.js` → `/api`

Auth: `Authorization: Bearer <jwt>` (expert role). JWT `sub` is internal Mongo id.

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
  "token": "jwt…",
  "role": "expert",
  "principal": { "id": "uuid", "name": "…", "phone": "…", "status": "offline", "trainingStatus": "pending", … }
}
```

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
