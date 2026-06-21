# Expert App — Setup Plan & Progress

## Goal

Polish the expert (therapist) mobile app into a product-ready client: premium UI, tab navigation, job map, history, profile, push-ready dispatch alerts — using **one EAS development build**, then JS-only daily dev (fast refresh).

**Conventions:** see monorepo [PRINCIPLES.md](../PRINCIPLES.md) — API uses public `id` (UUID), not Mongo `_id`.

## Platform priority (aligned with team)

| Surface | Status | Next |
|---|---|---|
| **Expert app** (this folder) | Packages + config ready | **You:** EAS dev build → then UI/features |
| **Customer web** | Landing + auth UI shell | Wire API, booking flow |
| **Customer mobile** | On hold | Reference only |
| **Backend** | MVP working | Extend as web/app need it |

---

## Target screens (after dev build)

| Screen | Purpose | Backend wired? |
|---|---|---|
| Login | Phone OTP | Yes |
| Dashboard (Home tab) | Availability, stats, dispatch offer | Yes |
| Active Job | Status steps, map, navigate | Partial |
| Job History (Jobs tab) | Past bookings | Yes (`GET /bookings`) |
| Profile (Profile tab) | Edit profile, sign out | Partial (`PATCH /expert/me`) |

---

## What's already done

- [x] All Tier 1–5 packages in `package.json` (dev client, navigation, maps, push, fonts, etc.)
- [x] `app.json` — plugins: `expo-dev-client`, location, font, notifications; Android `POST_NOTIFICATIONS`
- [x] `babel.config.js` — Reanimated plugin
- [x] `App.js` — gesture-handler + SafeAreaProvider bootstrap
- [x] `eas.json` — `development` profile (APK, dev client)
- [x] `.gitignore` — `android/` / `ios/` excluded (EAS prebuilds fresh)
- [x] Removed broken local `android/` folder from failed local Gradle attempts
- [x] Splash screen fix — `expo-splash-screen` plugin + `assets/`
- [x] Expert journey — Home · Jobs · Profile tabs, offer modal, Job map + stepper
- [ ] Push notification wiring
- [ ] Profile edit (`PATCH /expert/me`)

---

## Packages installed (Expo SDK 51)

| Tier | Packages |
|---|---|
| Dev shell | `expo-dev-client` |
| Navigation & UI | `react-native-gesture-handler`, `react-native-reanimated`, `@react-navigation/bottom-tabs`, `expo-font`, `@expo-google-fonts/plus-jakarta-sans`, `expo-linear-gradient`, `expo-haptics` |
| Maps | `expo-location`, `react-native-webview`, `react-native-leaflet-view` |
| Push (wire later) | `expo-notifications`, `expo-device`, `expo-constants` |
| Utils | `dayjs`, `socket.io-client`, `@react-native-async-storage/async-storage` |

**Deferred:** `expo-task-manager`, `expo-secure-store`, `expo-image-picker`, `@gorhom/bottom-sheet`

---

## EAS development build (your next step)

Local Gradle hit SSL issues on this machine — **EAS cloud build is the intended path.**

```powershell
cd expert-app
npm install                                    # if not done ($env:NODE_OPTIONS="--use-system-ca" if npm SSL fails)

npm install -g eas-cli
eas login
eas init                                       # links Expo project, writes real projectId to app.json
eas build --profile development --platform android
```

Install the APK on your phone or emulator. Then daily dev:

```powershell
cd expert-app
npx expo start --dev-client --port 8082
```

Open the installed dev client → scans Metro → fast refresh on JS changes.

### When to rebuild via EAS

| Change | Rebuild? |
|---|---|
| Edit screens / components / theme | No |
| Add/remove native package or change `app.json` plugins | Yes — new EAS dev build |
| Expo SDK upgrade | Yes |

### API URL on a physical phone

`app.json` → `extra.apiBase` defaults to `http://10.0.2.2:4000` (Android emulator → host). For a **real device**, set your laptop LAN IP, e.g. `http://192.168.1.x:4000`, then rebuild or override via EAS env.

---

## Daily workflow (after APK installed)

```powershell
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — expert app Metro
cd expert-app && npx expo start --dev-client --port 8082
```

Expert login (seeded): `+919000000005` · any 6-digit OTP in dev.

---

## Side-by-side with customer app

| App | Bundle ID | Metro port |
|---|---|---|
| Customer mobile | `com.codebase.massage.customer` | 8081 |
| Expert dev client | `com.codebase.massage.expert` | 8082 |

---

## Coding roadmap (after dev build)

1. Tab navigator — Home · Jobs · Profile
2. Plus Jakarta Sans + shared theme tokens
3. Job screen — Leaflet pickup map + open in Maps
4. History tab — `api.listBookings()`
5. Profile tab — `PATCH /expert/me`
6. Push tokens — `POST /me/push-token` (backend stub exists)

---

## Optional: local Android build

Only if you fix Java SSL on this PC. See `scripts/seed-expert-android-build.ps1` (local Gradle zip + truststore). Not required when using EAS.

---

## npm SSL note (this machine)

If `npm install` fails with certificate errors:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
npm install
```
