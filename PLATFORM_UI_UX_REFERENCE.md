# Platform UI/UX Reference — Customer Web & Expert App

Exhaustive inventory of every screen, component, visible string, and conditional rendering rule in the **customer web** (`customer-web/`) and **expert mobile app** (`expert-app/`) as implemented today. API-driven values (service names, prices, customer names, etc.) are noted where they appear but are not listed individually.

For platform vision and high-level summary, see [PLATFORM_OVERVIEW.md](./PLATFORM_OVERVIEW.md).

---

## Table of contents

1. [Customer Web](#customer-web)
   - [Routes & layouts](#1-routes--layouts)
   - [Copy modules (single source of truth)](#2-copy-modules-single-source-of-truth)
   - [Landing page](#3-landing-page)
   - [Authentication](#4-authentication)
   - [Services, cart & booking entry](#5-services-cart--booking-entry)
   - [Dashboard — orders list](#6-dashboard--orders-list)
   - [Dashboard — order tracking](#7-dashboard--order-tracking)
   - [Dashboard — profile, addresses, support](#8-dashboard--profile-addresses-support)
   - [Global shell components](#9-global-shell-components)
2. [Expert App](#expert-app)
   - [Navigation architecture](#1-navigation-architecture)
   - [Login](#2-login)
   - [Home](#3-home)
   - [Orders](#4-orders)
   - [Incoming dispatch offer modal](#5-incoming-dispatch-offer-modal)
   - [Active order (live job)](#6-active-order-live-job)
   - [Order detail (read-only history)](#7-order-detail-read-only-history)
   - [Order card (list item)](#8-order-card-list-item)
   - [Earnings](#9-earnings)
   - [Profile](#10-profile)
   - [Shared UI primitives](#11-shared-ui-primitives)
   - [Status labels & navigation helpers](#12-status-labels--navigation-helpers)
   - [Offer flow (ExpertSessionContext)](#13-offer-flow-expertsessioncontext)
3. [Cross-reference: booking status → UI](#cross-reference-booking-status--ui)

---

# Customer Web

**Tech:** Vite + React + React Router + Tailwind  
**Document title:** `Relief, Delivered — At-home wellness`  
**Brand headline:** `Relief, Delivered.` / `Feel Better In Minutes.`

---

## 1. Routes & layouts

### Router (`src/App.jsx`)

| Path | Layout | Screen | Behaviour |
|------|--------|--------|-----------|
| `/` | `PublicLayout` | `LandingPage` | Redirects to `/services` if authenticated |
| `/services` | `PublicLayout` | `ServicesPage` | Service catalog |
| `/services/:id` | `PublicLayout` | `ServiceDetailPage` | Single service |
| `/support` | `PublicLayout` | `SupportPage` | Public support |
| `/login` | `PublicLayout` | `LoginRedirect` | Opens login modal, redirects |
| `/app` | `ProtectedRoute` → `DashboardLayout` | Redirect | → `/app/orders` |
| `/app/orders` | Dashboard | `OrdersPage` | Order list |
| `/app/orders/:id` | Dashboard | `OrderTrackingPage` | Live tracking (mobile bottom nav hidden) |
| `/app/addresses` | Dashboard | `AddressesPage` | Saved addresses |
| `/app/profile` | Dashboard | `ProfilePage` | Account |
| `/app/support` | Dashboard | `SupportPage` | Embedded support |
| `*` | — | Redirect | → `/` |

**Orphan files (not routed):** `DashboardHomePage.jsx`, `ProfileCompleteModal.jsx` (profile step duplicated inside `LoginModal`).

### `PublicLayout.jsx`

**Always renders:** `ScrollToTop`, `Nav`, `<Outlet>`, `CartDrawer`, `LoginModal`, `AddressBookingModal`

| Condition | UI change |
|-----------|-----------|
| Path is `/` or `/services` | Shows `Footer` |
| Path starts with `/services` | Shows `FloatingCartBar` (if cart not empty) |
| Floating cart visible + cart has items | Extra bottom padding on outlet |
| Authenticated + cart items + (`location.state.openBooking` OR pending booking in session storage) | Auto-opens `AddressBookingModal` |

**Booking flow:** `handleProceed` → if not authenticated: `setPendingBooking()` + `openLogin({ intent: "booking" })`; else opens address modal. On `onBooked`: clears cart, navigates to `/app/orders/{id}`.

### `DashboardLayout.jsx`

**Desktop sidebar text:**
- Logo block: `R`, `Relief, Delivered`, `Your account`
- Nav: `My Orders`, `My Addresses`, `Account`, `Support`
- CTA button: `Book a session`
- User block: initials, name or `Account`, phone
- Link: `Browse services`
- Action: `Sign out`

**Mobile header:** `Hi, {firstName}` or `Welcome`; page title from route

**Bottom nav labels:** `Orders`, `Addresses`, `Account`, `Support`

**Page titles (`dashboardRoutes.js`):** `My Orders`, `My Addresses`, `Account`, `Support`, `Order details`

| Condition | UI change |
|-----------|-----------|
| Path matches `/app/orders/:id` | Hides mobile `BottomNav` |
| Order detail page | No white card wrapper on desktop |
| No user name | Initials show `?` |

---

## 2. Copy modules (single source of truth)

### `src/lib/messages.js`

**`journeyMessages` — hero headlines & subcopy**

| Key | Text |
|-----|------|
| `awaitingPaymentHeadline` | Complete payment to confirm |
| `awaitingPaymentSubcopy` | Your booking is saved. Pay now to start finding a verified expert. |
| `createdHeadline` | Booking requested |
| `createdSubcopy` | We're preparing your request. |
| `searchingHeadline` | Finding an expert for you |
| `searchingSubcopy` | Searching nearby verified experts… |
| `assignedHeadline` | Expert assigned |
| `assignedSubcopy` | Your expert is on the way. |
| `inProgressHeadline` | Session in progress |
| `inProgressSubcopy` | Your expert has arrived. Enjoy your session. |
| `completedHeadline` | Session completed |
| `completedSubcopy` | Thank you for booking with us. |
| `cancelledHeadline` | Booking cancelled |
| `payNowCta` | Pay now |
| `payLaterBanner` | Pay anytime before your session ends. |
| `payBeforeSessionEnds` | Pay before your session ends. |
| `bookingPayNowToast` | Booking saved. Complete payment to find your expert. |

**`toastMessages`**

| Key | Text |
|-----|------|
| `cartAdded` | Order added to cart. |
| `cartRemoved` | Item removed from cart. |
| `bookingConfirmed` | Booking confirmed successfully. |
| `bookingRequested` | Booking requested. |
| `bookingPayNowToast` | Booking saved. Complete payment to find your expert. |
| `paymentSuccess` | Payment received. Finding your expert… |
| `addressSaved` | Address saved. |
| `addressDeleted` | Address removed. |
| `profileSaved` | Profile updated. |
| `findingExperts` | Finding nearby experts... |

**`cancelReasonMessage(reason)`**

| Reason | Text |
|--------|------|
| `no_expert_in_sla` | No expert was available nearby. Check your location or try again shortly. |
| `user_cancelled` | You cancelled this booking. |
| (default) | This booking was cancelled. |

**`friendlyError(code)`** — maps API error codes to user strings; fallback: `Unable to complete the request. Please try again.`

### `src/lib/bookingStatus.js`

**`formatStatus(status)` — badges & order cards**

| Status | Label |
|--------|-------|
| `awaiting_payment` | Payment pending |
| `created` | Booking requested |
| `searching` | Finding expert |
| `assigned` | Expert assigned |
| `in_progress` | In progress |
| `completed` | Completed |
| `cancelled` | Cancelled |

**`getJourneyCopy(booking, { candidateEtaMin })` — conditional subcopy**

| Status | Headline | Subcopy logic | `showSearchPulse` |
|--------|----------|---------------|-------------------|
| `awaiting_payment` | awaitingPaymentHeadline | awaitingPaymentSubcopy | false |
| `created` | createdHeadline | createdSubcopy | false |
| `searching` | searchingHeadline | searchingSubcopy + optional ` · nearby experts ~{candidateEtaMin} min away` | **true** |
| `assigned` | assignedHeadline | `{expertName} is on the way · ~{eta} min · {distanceKm} km` (joined) OR assignedSubcopy | false |
| `in_progress` | inProgressHeadline | `payBeforeSessionEnds` if pay_later + unpaid, else inProgressSubcopy | false |
| `completed` | completedHeadline | completedSubcopy | false |
| `cancelled` | cancelledHeadline | cancelReasonMessage(cancelReason) | false |

**`getTrackingSteps(booking)` — timeline steps**

If `cancelled`: single step — label `Booking cancelled`, sublabel from `cancelReasonMessage`.

Otherwise (payment step only when `payment.timing === "pay_now"`):

| Step id | Label | Sublabel |
|---------|-------|----------|
| `payment` | Payment | Complete payment to start |
| `confirmed` | Booking Requested | Request received |
| `searching` | Finding Expert | Matching nearby experts |
| `assigned` | Expert Assigned | Expert accepted your booking |
| `en_route` | Expert En Route | Expert heading to you |
| `arrived` | Expert Arrived | Expert at your address |
| `started` | Session Started | Session underway |
| `completed` | Session Completed | All done |

Each step has `state`: `complete` | `current` | `upcoming`.

**Current step resolution:** `awaiting_payment` → payment; `created` → confirmed; `searching` → searching; `assigned` → en_route; `arrivedAt` set → arrived; `startedAt` → started; `completedAt` → completed.

### `src/lib/bookingJourney.js`

**`getJourneyVisibility(booking)` — gates every tracking section**

| Flag | When true |
|------|-----------|
| `showLiveBadge` | status ∈ `searching`, `assigned`, `in_progress` |
| `mapMode` | see map table below |
| `showExpertCard` | status ∈ `assigned`, `in_progress`, `completed` |
| `showTimeline` | status NOT `cancelled`, `awaiting_payment`, `completed` |
| `timelineCollapsed` | status === `completed` |
| `showPayPrimary` | `awaiting_payment` AND unpaid |
| `showPaySecondary` | pay_later + unpaid + status ∈ searching/assigned/in_progress |
| `showCancel` | status ∈ `awaiting_payment`, `created`, `searching` |
| `showEta` | status ∈ `searching`, `assigned` |
| `showMetaEta` | status === `assigned` |
| `needsPayment` | awaiting_payment unpaid OR pay_later unpaid in open statuses OR completed unpaid |

**`getMapMode(booking)`**

| Status | Mode |
|--------|------|
| `awaiting_payment`, `created`, `cancelled`, `completed`, `in_progress` | `hidden` |
| `searching` | `address` |
| `assigned` | `live` |

**`getOrderCardSecondaryLine(booking)`**

| Status | Secondary line |
|--------|----------------|
| `awaiting_payment` | Payment due |
| `created` | Confirming… |
| `searching` | Finding expert… |
| `assigned` | `~{eta} min away` if ETA exists, else `Expert on the way` |
| `in_progress` | Session in progress |
| `completed` | Completed |
| `cancelled` | Cancelled |

---

## 3. Landing page

**File:** `src/pages/LandingPage.jsx`  
**Auth redirect:** authenticated users → `/services`

**Section order:**

### `HeroSection`
| Element | Text |
|---------|------|
| Badge | `{brand.mission}` → *Make everyday physical relief accessible, affordable, and available within minutes.* |
| H1 line 1 | `Relief, Delivered.` |
| H1 line 2 | `Feel Better In Minutes.` |
| Supporting | *Quick and affordable wellness sessions delivered at your doorstep by trained and verified experts.* |
| Pills | Verified experts · Fast arrival · Transparent pricing |
| CTAs | `Book Now`, `How It Works` |
| Decorative mockup | `HeroMockup` (booking card, expert assigned, ETA 12 min, etc.) |

### `PainPointsSection`
Marquee pills: Long work hours, Screen strain, Travel fatigue, Daily stress, Neck stiffness, Shoulder tension, Back discomfort, Post-day recovery (duplicated for infinite scroll). Screen-reader: `brand.longDescription`.

### `TrustBar`
Four items from `brand.trustBar`: Verified Experts, Transparent Pricing, Fast Arrival, Professional Service (each title + body).

### `ServicesSection`
| Element | Text |
|---------|------|
| Label | What we offer |
| Title | Targeted relief for the discomfort you feel today |
| Per service card | Head/Neck/Shoulder/Back/Leg Relief name + description + `Book in minutes` |
| Footer note | Not a spa. Not luxury. Not medical treatment… |
| CTA | Explore Services |

### `HowItWorksSection`
Label: `How it works` · Title: `Simple, convenient, and easy to book` · Steps: Choose Service → Get Matched → Feel Better (numbered 1–3).

### `WhySection`
Label: `Why customers choose us` · Title: `Fast physical relief at home` · Four why-choose cards.

### `SafetySection`
Label: `Safety & trust` · Title: `Trained, verified, and accountable` · Safety cards + Customer promise bullet list.

### `TestimonialsSection`
Label: `Experiences` · Title: `Consistent experience, every session` · Placeholder testimonials (Working professional / Remote worker / Daily commuter).

### `ExpertsSection`
Expert network copy, `{brand.vision}`, `Become an Expert` (mailto), Expert standards list, principle pills (Fast, Affordable, Reliable, Safe, Respectful).

### `FaqSection`
Five Q&A pairs from `brand.faq`.

### `FinalCtaSection`
`{brand.cta.headline}` → *Ready For Relief?* · `Feel better in minutes, at home` · `{brand.shortDescription}` · Button: `Book A Session`

### `LandingStickyCta`
| Condition | UI |
|-----------|-----|
| `scrollY > 480` AND mobile (`md:hidden`) | Sticky bar: `{brand.headlines.secondary}`, `At-home · Verified experts`, `Book` button |

---

## 4. Authentication

### `LoginModal.jsx` — steps: `phone` | `otp` | `profile`

| Step | Title | Subtitle |
|------|-------|----------|
| phone | Sign in | We'll text you a one-time code. Your cart stays saved. |
| otp | Enter code | Sent to {phone}. {devHint \|\| "Any 6 digits in dev."} |
| profile | Quick setup | Just the basics — address comes when you book. |

**Brand line:** `Relief, Delivered`

**Fields:** Mobile number (+91 prefix), 6-digit OTP, Full name, Gender (Male / Female / Other / Prefer not to say), Date of birth

**Buttons:** `Send code` · `Verify & sign in` · `Change number` · `Continue` / `Saving…` / `Please wait…`

**Validation errors:**
- `Enter a valid 10-digit mobile number.`
- `Enter the 6-digit code.`
- `Please enter your name.`
- `Please select gender.`
- `Please enter your date of birth.`

**Dev hint:** `Dev: any 6 digits` when API returns `devCode`

**Post-auth routing:**
- `intent === "booking"` → `/services` with `openBooking: true`
- else → `from` path or `/services`

### `ProtectedRoute`
Loading: spinner only. Unauthenticated: redirect to `/login` with `state.from`.

### `LoginRedirect`
Opens modal; if authed → `/services`; else navigates to `from` (default `/`, or `/services` if from was `/app/*`).

---

## 5. Services, cart & booking entry

### `ServicesPage.jsx`

| State | Text |
|-------|------|
| Default H1 | What would you like relief from today? |
| Sub | Verified experts at your door… |
| Loading | Skeleton placeholders |
| Error | Couldn't load sessions / Check that the backend is running. |
| Count | `{n} session(s)` |
| Empty filter | All matching sessions are shown above. |

**Filter pills:** from `FEELING_FILTERS` and `BODY_CATEGORIES` in `serviceFilters.js` (e.g. Screen fatigue, Desk work, etc.)

### `ServiceDetailPage.jsx`

| State | Text |
|-------|------|
| Not found | Session not found · This service may no longer be available. · Browse all services |
| Loaded | `All services` breadcrumb · `{durationMin} minute session` · INCLUDES (3 bullets) · `Session price` · `Add to cart` · `{brand.disclaimer}` |

### `ServiceBookingCard.jsx`
Service name · `{durationMin} min` · price · benefit tags (Screen fatigue, Desk work, Stress relief, Daily recovery, Tension relief, or fallback `At-home relief`) · `Add to cart`

### `CartDrawer.jsx`
`Your booking` · `{count} session(s)` · empty: `Your cart is empty.` · `Remove` · quantity controls · `Total duration` · `Total` · `Continue booking`

### `FloatingCartBar.jsx`
`{n} session(s) selected · ₹{price}` · `View cart` — hidden when cart empty

### `AddressBookingModal.jsx`

| Section | Text |
|---------|------|
| Title | Select address |
| GPS warning | Some saved addresses are missing GPS… |
| Address card | label · `Default` badge · address line |
| Form labels | Label · Address line · City · Pincode |
| Link | + Add new address |
| Order summary | `{n} service(s) selected` · `Total ₹{orderTotal}` |
| Payment section title | When would you like to pay? |
| Pay now option | Pay to confirm and find your expert |
| Pay later option | Find expert first, pay anytime before session ends |
| CTA | `Continue to payment` (pay_now) OR `Confirm & find expert` (pay_later) |

**Toasts on book:** `findingExperts` loading · `bookingConfirmed` (pay_later) · `bookingPayNowToast` (pay_now)

### `LocationCapture.jsx`
`Getting your location…` · `Location captured` · `Location required` · GPS explanation · `Refresh location` / `Use current location` · errors via `friendlyError`

---

## 6. Dashboard — orders list

### `OrdersPage.jsx`

**Desktop intro:** *Track active sessions and revisit past bookings.*

**Tabs:** `Active` · `Past` · `Cancelled`

| Tab | Empty title | Empty body | CTA |
|-----|-------------|------------|-----|
| active | No active orders | Book a session to get started. | Book a session |
| past | No past orders yet | Completed sessions will appear here. | Book a session |
| cancelled | No cancelled orders | Cancelled bookings will appear here. | (none) |

Each row: `OrderCard` → links to `/app/orders/{id}`

### `OrderCard.jsx`

**Always shows:**
- Avatar letter (first char of session title)
- `{sessionTitle}` — joined item names or `Wellness session`
- `{formatSessionDate(createdAt)}`
- `{formatStatus(status)}` — accent color
- `{formatCurrency(pricing.total)}`
- Chevron icon

**Conditional:**
| Condition | UI |
|-----------|-----|
| `getOrderCardSecondaryLine(booking)` non-null | Muted secondary line below status |
| `LIVE_TRACKING_STATUSES.includes(status)` | `Live` chip (top-right) |

---

## 7. Dashboard — order tracking

**File:** `src/pages/dashboard/OrderTrackingPage.jsx`

### Page-level states

| State | UI |
|-------|-----|
| Loading | Skeleton blocks (back link, hero, sidebar) |
| Not found | `Order not found.` + link `Back to My Orders` |
| Loaded | Full layout below |

### Always visible (when loaded)
- Back button: `My Orders` (with arrow)
- Layout: 3-column hero stack (left) + detail cards (right) on desktop

### Realtime toasts (Socket.IO)

| Event | Toast |
|-------|-------|
| `booking:assigned` | Expert assigned |
| `booking:payment` | Payment received. Finding your expert… |
| `booking:failed` | cancelReasonMessage(reason) |
| Manual cancel success | Booking cancelled. |

**Cancel confirm dialog:** `Cancel this booking?`

---

### `BookingJourneyHero.jsx`

**Props:** `booking`, `candidateEtaMin`, `onPay`, `paying`

**Always renders (gradient forest card):**
- `{headline}` from `getJourneyCopy`
- `{subcopy}` if non-empty

| Condition | Additional UI |
|-----------|---------------|
| `showSearchPulse` (searching) | Animated ping dot (top-right) |
| `pricing.total` AND `showPayPrimary` | Price line `{formatCurrency(total)}` |
| `onPay` AND `needsPayment` | Pay banner (see below) |

**Pay banner text:**

| Condition | Banner copy | Styling |
|-----------|-------------|---------|
| `status === awaiting_payment` | Payment is required before we can find an expert. | white/10 border |
| `status === in_progress` | Pay before your session ends. | amber tint |
| else (pay_later mid-journey) | Pay anytime before your session ends. | amber tint |

**Pay button:** `Processing…` OR `Pay {formatCurrency(total)}`

---

### Meta card (inline in OrderTrackingPage)

| Element | Text |
|---------|------|
| Title | `{sessionTitle}` |
| Date | `{formatSessionDate(createdAt)}` |
| Live chip | `Live` (pulsing dot) — when `showLiveBadge` |
| ETA row | `ETA ~{eta} min · {distanceKm} km away` — when `showMetaEta` AND eta exists |

**Note:** Duplicate status badge removed from meta card; hero owns narrative.

---

### `BookingMap.jsx`

**Props:** `booking`, `expertLocation`, `mode` (`live` | `address`)

| Condition | UI |
|-----------|-----|
| No customer coords | `Location unavailable` (grey box) |
| `mode === "address"` | Header: `Service address` · Sub: `Expert will appear here once assigned` · Customer pin only |
| `mode === "live"` + expert + distance | Header: `Live map` · Sub: `formatAerialDistance(km)` |
| `mode === "live"` no expert | Header: `Live map` · Sub: `Expert location will appear when assigned` |
| `mode === "live"` | Footer: `Green dot: your address · Black dot: expert · Line is straight-line distance` |

**Map markers:** Green circle = customer · Black circle = expert · Dashed line between them

**Gating (from OrderTrackingPage):**
- `mapMode === "live"` → live map with `expertLoc` from socket
- `mapMode === "address"` AND `location.lat` → address-only map
- Otherwise map not rendered

---

### `SessionTimeline.jsx`

**Props:** `booking`, `embedded` (default false)

**Header:** `Session progress` · `Live` chip when status ∈ LIVE_TRACKING_STATUSES

**Steps:** from `getTrackingSteps` — each shows label + sublabel (sublabel hidden when `upcoming`)

**Visual states per step:**
- `complete` — filled accent circle with checkmark
- `current` — accent border ring, sublabel in accent color
- `upcoming` — grey border, muted label, no sublabel

**Gating:** only when `visibility.showTimeline` (hidden for awaiting_payment, completed, cancelled)

---

### Expert card (inline — no separate component)

**When:** `showExpertCard` AND `booking.expert?.name`

| Field | Label / text |
|-------|--------------|
| Section label | `Expert` |
| Name | `{expert.name}` |
| Rating | `Rating {rating.toFixed(1)}` — if rating exists |
| Phone | `{expert.phone}` — if phone exists |

---

### Address card
Label: `Address` · `{location.address}` OR `Address on file`

### Services card
Label: `Services` · line items (name + price) · total `{formatCurrency(pricing.total)}`

### Cancel button
**When:** `showCancel`  
**Text:** `Cancelling…` OR `Cancel booking`

---

## 8. Dashboard — profile, addresses, support

### `ProfilePage.jsx`
Name or `—` · email or `No email added` · phone · `Sign out` (mobile + desktop)

### `AddressesPage.jsx`
Intro: *Saved locations for at-home wellness sessions.* · `Add new address` · empty: `No saved addresses` / `Add an address for home sessions` · per address: label, `Default`, address, amber `Missing location` warning · actions: Set default, Remove · confirm: `Remove this address?` · toast: `Default address updated.`

### `SupportPage.jsx`
**Public:** H1 `Support` · *We're here to help…* · `SupportContent` with browse link  
**Embedded:** `SupportContent` only  
**Content:** `Email us` · `support@relief.local` · `Common questions` + brand FAQ · optional `Browse services`

---

## 9. Global shell components

### `Nav.jsx`
Logo: `R` + `Relief, Delivered`  
**Unauthenticated links:** Home, Services  
**Authenticated links:** Services, Support  
Cart aria: `Cart, {count} items`  
Sign in aria-label · Mobile: `Open menu`, drawer title `Menu`  
Drawer (auth): user name/phone, My Orders, My Addresses, Account, Sign out / Login

| Condition | Styling |
|-----------|---------|
| Landing + scrollY < 120 | Transparent hero nav (`heroNav`) |
| Desktop authed | `UserMenu` dropdown |
| Desktop unauthed | Login icon |

### `Footer.jsx`
Brand headline, shortDescription, disclaimer, Company/Support/Legal columns (links → `/support`), copyright with mission

### `UserMenu.jsx`
Initials, name or `Account`, phone, My Orders, My Addresses, Account, Sign out

---

# Expert App

**Tech:** Expo (React Native) + React Navigation  
**Fonts:** Plus Jakarta Sans (400, 600, 700)

---

## 1. Navigation architecture

### Root stack (`App.js`)

| Route | Screen | Header title | Notes |
|-------|--------|--------------|-------|
| `Login` | `LoginScreen` | (hidden) | Initial if no token |
| `MainTabs` | `MainTabs` | (hidden) | Bottom tabs |
| `ActiveOrder` | `ActiveOrderScreen` | **Active order** | Card presentation |
| `OrderDetail` | `OrderDetailScreen` | **Order details** | Card presentation |

**Global overlay:** `IncomingOrderModal` (full-screen when offer active)

**Bootstrap:** `ActivityIndicator` only while fonts/token loading

### Main tabs (`MainTabs.js` + `CustomTabBar.js`)

| Tab | Screen | Icon (Feather) | Visible label |
|-----|--------|----------------|---------------|
| Home | `HomeScreen` | home | (icon only; a11y: "Home") |
| Orders | `OrdersScreen` | package | "Orders" |
| Earnings | `EarningsScreen` | dollar-sign | "Earnings" |
| Profile | `ProfileScreen` | user | "Profile" |

Focused tab: accent color + top accent line.

### Navigation graph

```
Login
MainTabs
  ├── Home ──────► ActiveOrder | OrderDetail
  ├── Orders ────► ActiveOrder | OrderDetail
  ├── Earnings
  └── Profile ───► Logout → Login

IncomingOrderModal (global)
  Accept → ActiveOrder
```

**Legacy (unwired):** `JobsScreen`, `JobScreen`, `OfferModal` — not reachable.

---

## 2. Login

**File:** `src/screens/LoginScreen.js`

| Element | Text |
|---------|------|
| Title | Partner login |
| Subtitle | Enter your phone number to receive an OTP |
| Label | Phone number |
| Label (code stage) | OTP |
| Label (code stage) | Name (first time) |
| Placeholder | 6-digit code |
| Placeholder | Optional |
| Default phone | +919000000005 |

| `stage` | Button | Fields shown |
|---------|--------|--------------|
| `phone` | Send OTP | Phone only |
| `code` | Verify & continue | OTP + Name |

**Alerts:** `Error` / `Verification failed` + API message

---

## 3. Home

**File:** `src/screens/HomeScreen.js`

### Header
`Home` · Toggle label: `Online` / `Offline`

### Status card

| `me.status` | Title | Caption | Icon | Switch |
|-------------|-------|---------|------|--------|
| `on_job` | On active order | Complete the job before going offline. | radio (green) | ON, **disabled** |
| `online` (not on_job) | Receiving orders | Keep this app open — new orders pop up full screen. | radio (green) | ON |
| offline | You are offline | Toggle online to receive nearby bookings. | moon | OFF |

Switch also disabled while `goingOnline`.

### Active order CTA
**When:** `on_job` AND `me.activeBooking`  
**Text:** `Open active order →` → navigates to `ActiveOrder`

### Stat cards

| Label | Value source | Sub |
|-------|--------------|-----|
| Today orders | `dashboard.today.orders` | — |
| Today earnings | `formatRupee(dashboard.today.earnings)` | — |
| Rating | `(me.rating).toFixed(1)` | ★ average |
| Completed | `me.completedJobs` | all time |

### Recent orders
Section: `Recent orders`  
Empty: `No orders yet today.`  
List: `OrderCard` → `navigateToOrder` (active → ActiveOrder, history → OrderDetail)

**Loading:** `LoadingView` default `Loading…` when `loading && !me`

---

## 4. Orders

**File:** `src/screens/OrdersScreen.js`

| Element | Text |
|---------|------|
| Title | Orders |
| Tab today | Today |
| Tab history | History |

**Loading:** `Loading orders…`

| Empty tab | Title | Message |
|-----------|-------|---------|
| today | No orders today | error OR Pull to refresh or tap below to load orders. |
| history | No history | same |

**Action:** `Refresh` button on empty state

**List:** `OrderCard` per order → `navigateToOrder`

---

## 5. Incoming dispatch offer modal

**File:** `src/components/orders/IncomingOrderModal.js`  
**Mounted:** globally in `App.js`  
**Visible when:** `offer != null` (from `ExpertSessionContext`)

| Element | Text / source |
|---------|---------------|
| Countdown | `{secLeft}` |
| Timer suffix | sec left |
| Section | New order |
| Customer | `offer.customerName` OR `Customer` |
| Service | `offer.serviceName` OR first item name OR `Service` + optional ` · {durationMin} min` |
| Distance/ETA | `{distanceKm} km · ETA {etaMin} min` |
| Address | `pickupLocation.address` OR `{lat}, {lng}` (4 decimals) |
| Earnings label | **You'll earn** |
| Earnings amount | `formatRupee(estimatedEarning ?? total)` |
| Decline | Decline |
| Accept | Accept |

**Modal:** `animationType="slide"`, `presentationStyle="fullScreen"`

**Countdown:** starts at `offer.offerExpiresInSec` (default 30s); at 0 modal dismisses

---

## 6. Active order (live job)

**File:** `src/screens/ActiveOrderScreen.js`  
**Header:** Active order  
**Param:** `{ bookingId }`

### Stepper dots (5 visible)
Navigating → Arrived → Start OTP → Session → End OTP  
(Filled through current step index; `Complete` is step 6 but not in dot row)

### Always shown (when booking loaded)

| Element | Text |
|---------|------|
| Label | Active order |
| Customer | `{customer.name}` OR `Customer` |
| Service line | `{serviceSummary(items)} · {bookedMin} min booked` |
| Address | `{location.address}` OR `{lat}, {lng}` |

**Loading:** `Loading order…`

### Step machine

`baseStep = getActiveOrderStep(booking)`  
Overrides:
- `sessionComplete` OR `status === completed` → `complete`
- `arrived` + `startOtpMode` → `start_otp`
- `session` + `endOtpMode` → `end_otp`

---

#### Step: `navigating`

| Condition | UI |
|-----------|-----|
| `etaMin` OR `distanceKm` | Meta row |
| `etaMin` | `ETA ~{rounded} min` |
| `distanceKm` | `{distanceKm} km away` |
| `booking.location` | Leaflet map (📍 marker at customer) |
| always | Button `Go to location` (opens Google Maps) |
| always | Button `I've arrived` → API arrived |

**Alert:** `Could not open maps`

**Hidden:** customer `pricing.total` (not shown during trip)

---

#### Step: `arrived`

| Element | Text |
|---------|------|
| Icon | check-circle (primary) |
| Title | You've arrived |
| Body | Ask the customer for their start OTP when you're ready to begin the session. |
| Button | Enter start OTP → sets `startOtpMode(true)` |

OTP input **not** shown until button tapped.

---

#### Step: `start_otp`

| Element | Text |
|---------|------|
| Body | Enter start OTP from customer |
| Dev hint | `Dev hint: {startCode}` — **only when `__DEV__` AND startCode exists** |
| Input | `OTPInput` placeholder `0000` (4 digits) |
| Button | Verify & start session |

---

#### Step: `session`

| Element | Text |
|---------|------|
| Label | Session running |
| Timer | `{m}:{ss}` elapsed since `timeline.startedAt` |
| Caption | Booked duration: {bookedMin} min |
| Add-on note | Customer add-ons are included in this session. — when any `item.isAddOn` |
| Button | End session — enter OTP → `setEndOtpMode(true)` |

**Socket:** listens for `booking:addon` to refresh items

---

#### Step: `end_otp`

| Element | Text |
|---------|------|
| Body | Enter end OTP from customer |
| Dev hint | `Dev hint: {endCode}` — **`__DEV__` only** |
| Button | Verify & complete order |

On success: loads booking, sets `sessionComplete`, shows completion (no silent goBack).

---

#### Step: `complete`

| Element | Text |
|---------|------|
| Icon | award |
| Title | Session complete |
| Body | Great work — earnings have been recorded. |
| Label | You earned |
| Amount | `formatRupee(expertEarning)` — `expertEarning` or 70% of subtotal |
| Button | Back to receiving orders → `navigation.goBack()` |

---

## 7. Order detail (read-only history)

**File:** `src/screens/OrderDetailScreen.js`  
**Header:** Order details  
**Used for:** completed, cancelled, and other non-active orders from history

| Element | Text |
|---------|------|
| Status badge | `orderStatusLabel(status, timeline)` |
| Customer | `{name}` OR `Customer` |
| Date | `formatWhen(createdAt)` |
| Services label | Services |
| Services value | `{serviceSummary} · {totalDurationMin} min` |
| Address | `{location.address}` — if present |
| Earnings label | You earned — **only if `status === completed`** |
| Earnings amount | `formatRupee(expertEarning)` |
| Cancel label | Cancellation reason — **only if cancelled AND cancelReason** |
| Cancel body | `{cancelReason}` |

**Loading:** `Loading order…`

---

## 8. Order card (list item)

**File:** `src/components/orders/OrderCard.js`

| Row | Content |
|-----|---------|
| Top left | `{customer.name}` OR `Customer` |
| Top right badge | `orderStatusLabel(status, timeline)` |
| Line 2 | `serviceSummary(items)` |
| Bottom left | `formatWhen(createdAt)` |
| Bottom right | `formatRupee(expertEarning ?? subtotal × 0.7)` |

**Pressed state:** opacity 0.92

**Note:** Shows expert earning, not customer total.

---

## 9. Earnings

**File:** `src/screens/EarningsScreen.js`

| Element | Text |
|---------|------|
| Title | Earnings |
| Period tabs | today · week · month (capitalized) |
| Total label | Total earnings |
| Total value | `formatRupee(data.total)` |
| Sub | `{orderCount} completed orders` |
| Breakdown | Base salary · Commission · Bonus |

**Loading:** `Loading earnings…`

---

## 10. Profile

**File:** `src/screens/ProfileScreen.js`

| Element | Text |
|---------|------|
| Title | Profile |
| Name | `{me.name}` |
| Phone | `{me.phone}` |
| Rating line | ★ {rating} · {completedJobs} jobs |
| Training row | Training · value from `TRAINING_LABELS` |
| Support row | Support |
| KYC row | KYC & profile |
| Logout row | Logout (danger color) |

**Training labels:**

| `trainingStatus` | Display |
|------------------|---------|
| pending | Not started |
| in_progress | In progress |
| completed | Completed |

**Alerts (stubs):**
- Training → `Partner training module — coming soon.`
- Support → `Contact ops@codebasemassage.com`
- KYC → `One-go KYC flow — coming soon.`

**Avatar:** `me.photoUrl` image OR user icon fallback

---

## 11. Shared UI primitives

### `AppText` variants
`h1` · `h2` · `h3` · `body` · `caption` · `label` (uppercase, letter-spaced)  
**Colors:** default · `secondary` · `muted`

### `PrimaryButton`
**Props:** `title`, `variant` (primary | outline | danger), `loading`, `disabled`  
**Loading:** shows `ActivityIndicator` instead of title  
**Disabled:** opacity 0.5 when `disabled || loading`

### `OTPInput`
4-digit default, placeholder `0000`, strips non-digits

### `LoadingView`
**Default message:** `Loading…`  
**Custom:** `Loading orders…`, `Loading order…`, `Loading earnings…`

### `EmptyState`
Icon + `title` + optional `message` + optional `PrimaryButton` (`actionLabel`)

### `StatCard`
`label` · `value` · optional `sub`

---

## 12. Status labels & navigation helpers

**File:** `src/utils/order.js`

### `orderStatusLabel(status, timeline)`

| Status | Label |
|--------|-------|
| `assigned` + `timeline.arrivedAt` | Arrived |
| `assigned` (no arrivedAt) | Navigating |
| `in_progress` | In session |
| `completed` | Completed |
| `cancelled` | Cancelled |
| `searching` | Searching |
| `created` | Created |
| other | raw status string |

### `getActiveOrderStep(booking)`

| Condition | Returns |
|-----------|---------|
| no booking | navigating |
| completed / cancelled | done |
| in_progress | session |
| assigned, no arrivedAt | navigating |
| assigned, arrivedAt set | arrived |

### `navigateToOrder(navigation, order)`

| Condition | Destination |
|-----------|-------------|
| `isActiveOrder(status)` — assigned or in_progress | `ActiveOrder` |
| else | `OrderDetail` |

### Format helpers
- `formatRupee(n)` → `₹{en-IN number}`
- `formatWhen(date)` → e.g. `21 Jun, 10:30 am`
- `serviceSummary(items)` → comma names OR `Service`
- `totalDurationMin(items)` → sum of durationMin

---

## 13. Offer flow (ExpertSessionContext)

**File:** `src/context/ExpertSessionContext.js` — no direct UI; drives Home toggle, modal, navigation.

### Offer acquisition
1. Socket `dispatch:offer` → sets `offer`, `secLeft = offerExpiresInSec || 30`
2. Poll fallback every 2s when online and no offer
3. Countdown decrements each second; at 0 clears offer

### `respondToOffer(accepted)`
- Clears offer immediately
- HTTP `respondOffer` + socket `dispatch:respond`
- Error: `Alert: Error` + message
- If accepted: `navigate("ActiveOrder", { bookingId })` + `refreshMe()`

### `setOnline(true)`
- Requests location permission
- `goOnline` API + socket connect
- Location denied: `Location required` / `We need your location to receive and fulfill jobs.`
- Error: `Error` + message

### `setOnline(false)`
- Stops location polling · `goOffline` API

### `me.status` effects on Home UI
| Status | Effect |
|--------|--------|
| online | Toggle on, receiving orders copy |
| on_job | Toggle on but disabled, active order CTA |
| offline | Toggle off |

---

# Cross-reference: booking status → UI

## Customer web — what shows per status

| Status | Hero | Map | Timeline | Expert card | Cancel | Pay banner | Live chip |
|--------|------|-----|----------|-------------|--------|------------|-----------|
| awaiting_payment | Pay headline | hidden | hidden | hidden | yes | primary (required) | no |
| created | Booking requested | hidden | yes | hidden | yes | no | no |
| searching | Finding expert + pulse | address pin | yes | hidden | yes | pay_later only | yes |
| assigned | Expert assigned + ETA | live | yes | yes | no | pay_later only | yes |
| in_progress | Session in progress | hidden | yes | yes | no | urgent if unpaid | yes |
| completed | Session completed | hidden | hidden | yes | no | if unpaid edge | no |
| cancelled | Cancelled + reason | hidden | hidden | hidden | no | no | no |

## Expert app — what shows per step

| Step | Map | Customer total | OTP hints | Primary action |
|------|-----|----------------|-----------|----------------|
| navigating | yes | hidden | — | I've arrived |
| arrived | no | hidden | — | Enter start OTP |
| start_otp | no | hidden | __DEV__ only | Verify & start session |
| session | no | hidden | — | End session — enter OTP |
| end_otp | no | hidden | __DEV__ only | Verify & complete order |
| complete | no | hidden (shows earning) | — | Back to receiving orders |

## Payment timing interactions

| Timing | Customer web behaviour |
|--------|------------------------|
| pay_now | Timeline includes Payment step; dispatch blocked until paid; hero shows pay primary on awaiting_payment |
| pay_later | No payment step in timeline; dispatch immediate; soft/urgent pay banner mid-journey if still unpaid |

---

*Last updated to reflect production booking UX implementation. Customer app (`customer-app/`) mirrors the same visibility contract in `BookingScreen.js` but is outside the scope of this document.*
