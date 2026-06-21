# Expert Journey

End-to-end flow for a therapist using the expert app.

## Journey map

```
Login → Home (offline)
         ↓ toggle online + GPS
       Home (online, waiting)
         ↓ dispatch:offer (socket, any tab)
       Offer modal → Accept / Decline (30s)
         ↓ accept
       Job screen (assigned)
         ↓ Navigate → I've arrived
       Job (at customer)
         ↓ Start service
       Job (in_progress) — add-ons may appear live
         ↓ Complete service
       Home (online again) + job in Jobs history
```

## Where each step lives in the app

| Step | Screen | What the expert sees |
|---|---|---|
| Sign in | **Login** | Phone OTP |
| Go online | **Home** | Availability switch, waiting pulse |
| Receive order | **Offer modal** (global) | ETA, services, total, accept/decline |
| Active job | **Job** | Map, customer, journey stepper, action button |
| Job list | **Jobs** | Active + history, tap to reopen |
| Profile / sign out | **Profile** | Stats, skills, logout |

## Job screen actions (backend)

| UI button | API | Booking state after |
|---|---|---|
| I've arrived | `POST /bookings/:id/arrived` | Still `assigned`, `timeline.arrivedAt` set |
| Start service | `POST /bookings/:id/start` | `in_progress` |
| Complete service | `POST /bookings/:id/complete` | `completed`, expert back to `online` |

## Realtime events (expert side)

- `dispatch:offer` — new job offer while online
- `booking:addon` — customer added a service mid-session (Job screen refreshes)
- `booking:status` — status changes
- `expert:location` — expert sends GPS while online / on job

## Test flow (dev)

1. Backend + ngrok + Metro running
2. Expert app: login `+919000000005`, go **online** on Home
3. Customer app/web: book a massage near the expert
4. Expert gets offer modal → **Accept**
5. Job screen → **Navigate** → **I've arrived** → **Start** → **Complete**
6. Check **Jobs** tab for completed booking
