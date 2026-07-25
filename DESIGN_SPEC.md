# Relief, Delivered — Production UX Design Specification
## Principal Design Review · Complete Platform Redesign

**Prepared by:** Principal Product Design · UX Architecture · Design Systems  
**Version:** 1.0 Production  
**Scope:** Customer Web · Customer App · Expert App · Design System  

---

> **Design philosophy in one sentence:**  
> Every screen has one story. One hero. One action. Everything else is supporting cast.

---

## Table of Contents

1. [Design System Foundation](#1-design-system-foundation)
2. [Customer Web: Landing Page](#2-customer-web-landing-page)
3. [Customer Web: Services + Cart](#3-customer-web-services--cart)
4. [Customer Web: Booking Flow](#4-customer-web-booking-flow)
5. [Customer Web: Order Tracking](#5-customer-web-order-tracking-world-class)
6. [Customer Web: Dashboard Shell](#6-customer-web-dashboard-shell)
7. [Customer Web: Profile, Addresses, Support](#7-customer-web-profile-addresses-support)
8. [Expert App: Complete Redesign](#8-expert-app-complete-redesign)
9. [Microinteractions & Motion System](#9-microinteractions--motion-system)
10. [Copywriting System](#10-copywriting-system)
11. [Accessibility & Responsiveness](#11-accessibility--responsiveness)
12. [Implementation Notes](#12-implementation-notes)

---

# 1. Design System Foundation

## 1.1 Design Philosophy

**The north star:** A user in physical discomfort booking a service should feel calm, in control, and certain that help is coming. Every design decision is filtered through this lens.

**Three forbidden patterns:**
1. **Status badge redundancy** — never communicate the same status in more than one component simultaneously
2. **Component spam** — never render a component because data exists; render it because it serves the current user need
3. **Dashboard syndrome** — never show everything available; show only what matters right now

**Mental model references:**
- **Zepto/Blinkit** — live delivery tracking: one hero card, one ETA, one action
- **Uber** — driver/rider status: the map IS the story, text supports it
- **Headspace** — calm, warm, distraction-free; the UI disappears into the experience
- **Stripe** — precision typography, no decoration without purpose
- **Linear** — density without clutter; information hierarchy that respects the user's intelligence
- **Apple** — one sentence instead of five; every word earns its space

---

## 1.2 Color System

### Primitives (never use directly in components — use semantics below)

```
Forest-900  #0D1F1A   — near-black green
Forest-800  #1A2E24
Forest-700  #224032
Forest-600  #2E5443
Forest-500  #3A6B55   — primary brand
Forest-400  #5A8F76
Forest-300  #89B8A2
Forest-200  #B8D6C8
Forest-100  #DCE9E3
Forest-50   #F0F6F3

Sand-900    #2C2418
Sand-800    #4A3D2A
Sand-700    #6B5A3E
Sand-600    #8C7556
Sand-500    #A8906E   — warm accent
Sand-400    #C4AD92
Sand-300    #DDD0BC
Sand-200    #EDE5D8
Sand-100    #F5F0E8
Sand-50     #FAF8F4   — warm white surface

Slate-900   #0F1419
Slate-800   #1C2430
Slate-700   #2A3444
Slate-600   #3B4A5C
Slate-500   #526070
Slate-400   #7A8A97
Slate-300   #A3ADB8
Slate-200   #CBD0D8
Slate-100   #E5E8EC
Slate-50    #F4F5F7

Amber-500   #D97706
Amber-100   #FEF3C7
Amber-50    #FFFBEB

Red-500     #DC2626
Red-50      #FEF2F2

Success-500 #16A34A
Success-50  #F0FDF4
```

### Semantic Tokens

```
/* Backgrounds */
--bg-canvas       : Sand-50   (#FAF8F4)  — page background
--bg-surface      : #FFFFFF              — cards, modals, drawers
--bg-surface-2    : Sand-100  (#F5F0E8)  — secondary surfaces
--bg-surface-3    : Sand-200  (#EDE5D8)  — tertiary / dividers
--bg-hero         : Forest-900 (#0D1F1A) — dark hero sections
--bg-hero-2       : Forest-800 (#1A2E24) — gradient stop

/* Text */
--text-primary    : Slate-900 (#0F1419)  — primary body
--text-secondary  : Slate-600 (#3B4A5C)  — secondary
--text-muted      : Slate-400 (#7A8A97)  — hints, labels, captions
--text-inverse    : #FFFFFF              — on dark
--text-inverse-2  : Forest-200 (#B8D6C8) — muted on dark
--text-brand      : Forest-500 (#3A6B55) — brand emphasis
--text-warning    : Amber-500 (#D97706)
--text-error      : Red-500   (#DC2626)
--text-success    : Success-500 (#16A34A)

/* Interactive */
--color-primary        : Forest-500 (#3A6B55)
--color-primary-hover  : Forest-600 (#2E5443)
--color-primary-press  : Forest-700 (#224032)
--color-accent         : Sand-500   (#A8906E)  — warm, calm secondary

/* Status (semantic, not decorative) */
--status-live     : #16A34A  — live tracking only
--status-warning  : #D97706  — pay before session ends
--status-error    : #DC2626  — cancelled / failure
--status-neutral  : Slate-400

/* Borders */
--border-subtle   : Sand-200 (#EDE5D8)
--border-default  : Sand-300 (#DDD0BC)
--border-strong   : Slate-300 (#A3ADB8)
--border-brand    : Forest-300 (#89B8A2)

/* Elevation (shadows) */
--shadow-xs  : 0 1px 2px rgba(15,20,25,0.04)
--shadow-sm  : 0 2px 8px rgba(15,20,25,0.06)
--shadow-md  : 0 4px 16px rgba(15,20,25,0.08)
--shadow-lg  : 0 8px 32px rgba(15,20,25,0.12)
--shadow-xl  : 0 16px 48px rgba(15,20,25,0.16)
```

---

## 1.3 Typography

### Typeface Decisions

**Display / Hero:** `Fraunces` (variable, optical size 144–9)  
*Why:* Warm, slightly organic serif. Conveys calm authority. Unique to wellness without feeling medical. Headspace-adjacent without being derivative.

**Body / UI:** `Inter` (variable)  
*Why:* Maximum legibility at small sizes. Trusted. Disappears correctly.

**Numeric / Mono data (ETAs, prices, timers):** `Inter` with `font-variant-numeric: tabular-nums`  
*Why:* Numbers must never shift layout. Timer counts must feel smooth.

### Type Scale

```
/* Display — landing, hero states only */
--type-display-xl  : Fraunces 64px / 68px  weight 300  letterSpacing -0.02em
--type-display-lg  : Fraunces 48px / 52px  weight 300  letterSpacing -0.02em
--type-display-md  : Fraunces 36px / 42px  weight 400  letterSpacing -0.01em
--type-display-sm  : Fraunces 28px / 34px  weight 400

/* Heading — sections, screen titles */
--type-h1  : Inter 24px / 30px  weight 600  letterSpacing -0.01em
--type-h2  : Inter 20px / 26px  weight 600
--type-h3  : Inter 17px / 24px  weight 600
--type-h4  : Inter 15px / 22px  weight 600

/* Body */
--type-body-lg  : Inter 17px / 26px  weight 400
--type-body     : Inter 15px / 23px  weight 400
--type-body-sm  : Inter 13px / 20px  weight 400

/* UI Utility */
--type-label    : Inter 11px / 14px  weight 600  letterSpacing 0.06em  UPPERCASE
--type-caption  : Inter 12px / 18px  weight 400
--type-button   : Inter 15px / 20px  weight 600
--type-button-sm: Inter 13px / 18px  weight 600

/* Numeric */
--type-price-lg : Inter 28px / 32px  weight 700  tabular-nums
--type-price    : Inter 20px / 24px  weight 700  tabular-nums
--type-timer    : Fraunces 48px / 52px  weight 300  tabular-nums
```

---

## 1.4 Spacing System

Base unit: `4px`

```
--space-1   : 4px
--space-2   : 8px
--space-3   : 12px
--space-4   : 16px
--space-5   : 20px
--space-6   : 24px
--space-8   : 32px
--space-10  : 40px
--space-12  : 48px
--space-16  : 64px
--space-20  : 80px
--space-24  : 96px
--space-32  : 128px

/* Layout tokens */
--page-gutter-mobile  : 20px
--page-gutter-tablet  : 32px
--page-gutter-desktop : 48px
--content-max-width   : 1200px
--card-radius         : 16px
--card-radius-sm      : 12px
--button-radius       : 12px
--input-radius        : 10px
--chip-radius         : 100px  (pill)
--modal-radius        : 24px   (top corners only on mobile sheets)
```

---

## 1.5 Component Tokens

### Buttons

```
Primary Button
  bg        : --color-primary
  bg-hover  : --color-primary-hover
  bg-press  : --color-primary-press
  text      : white
  height    : 52px (mobile) / 48px (desktop)
  min-width : 120px
  radius    : --button-radius
  padding   : 0 24px
  font      : --type-button
  shadow    : --shadow-sm
  
  States:
    hover   : bg-hover + translateY(-1px) + shadow-md
    press   : bg-press + translateY(0) + shadow-xs
    loading : opacity 0.7 + spinner (no text change — avoids layout shift)
    disabled: opacity 0.38 (WCAG compliant) + cursor not-allowed

Secondary Button
  bg        : transparent
  border    : 1.5px solid --border-default
  text      : --text-primary
  hover     : bg Sand-100, border --border-brand
  
Ghost Button
  bg        : transparent
  text      : --text-brand
  hover     : bg Forest-50 @ 60%
  
Danger Button
  bg        : Red-500
  text      : white

Sizes:
  lg  : height 52px, font --type-button
  md  : height 44px, font --type-button-sm
  sm  : height 36px, font --type-button-sm
  
Touch targets (mobile): minimum 44×44px (Apple HIG, WCAG 2.5.5)
```

### Cards

```
Surface Card
  bg      : --bg-surface
  radius  : --card-radius
  shadow  : --shadow-sm
  border  : 1px solid --border-subtle
  padding : 20px

Hero Card (dark)
  bg      : linear-gradient(160deg, Forest-800 0%, Forest-900 100%)
  radius  : 20px
  padding : 24px
  
Status Chip
  padding : 4px 10px
  radius  : --chip-radius
  font    : --type-label
  
  live    : bg Success-50, text Success-500
  warning : bg Amber-50, text Amber-500
  muted   : bg Slate-100, text Slate-500
```

### Inputs

```
Input Field
  height     : 52px
  bg         : --bg-surface
  border     : 1.5px solid --border-default
  border-focus: --color-primary
  radius     : --input-radius
  padding    : 0 16px
  font       : --type-body-lg
  
  States:
    default : border --border-default
    focused : border --color-primary + ring 3px Forest-100
    error   : border Red-500 + ring 3px Red-50
    filled  : border --border-strong
    
OTP Input
  Each digit: 56px × 64px box
  Large font: 28px weight 600
  Gap: 8px between boxes
  Radius: 10px
  bg: Sand-50
  border focused: 2px --color-primary
```

### Bottom Sheets (mobile)

```
Handle bar : 4px × 36px, radius 2px, color Slate-200, centered, 8px from top
Top radius : 24px
bg         : --bg-surface
max-height : 92vh
shadow     : --shadow-xl
Drag area  : 48px (handle + padding)
Snap points: 40%, 75%, 92%
Backdrop   : rgba(0,0,0,0.32), blur(2px)
```

---

## 1.6 Motion System

```
/* Durations */
--duration-instant  : 80ms    — microinteractions (button press feedback)
--duration-fast     : 150ms   — chip states, icon swaps
--duration-default  : 220ms   — most transitions
--duration-moderate : 350ms   — bottom sheets, modals
--duration-slow     : 500ms   — page-level transitions, map reveals

/* Easing */
--ease-out      : cubic-bezier(0.16, 1, 0.3, 1)   — most things entering
--ease-in-out   : cubic-bezier(0.45, 0, 0.55, 1)  — reversible transitions
--ease-spring   : cubic-bezier(0.34, 1.56, 0.64, 1) — bouncy, celebratory
--ease-decel    : cubic-bezier(0.0, 0.0, 0.2, 1)  — elements settling

/* Principles */
Enter : fast. Elements appear quickly. Slow-in creates latency perception.
Exit  : very fast. 150ms max. Users shouldn't watch things leave.
Spatial: motion direction follows spatial meaning.
  Sheet rises from bottom → slides down to dismiss.
  Modal from center → fades to center.
  List item tapped → scales destination into view.

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  All transitions: 0ms
  Animations: opacity only, 150ms
  No transforms
}
```

### Skeleton Loading System

```
Shimmer:
  background: linear-gradient(
    90deg,
    Sand-100 0%,
    Sand-50 50%,
    Sand-100 100%
  )
  background-size: 200% 100%
  animation: shimmer 1.4s ease-in-out infinite
  
Rule: Skeleton must match EXACT layout of loaded content.
  — Same height as text it replaces
  — Same width ranges
  — Same card dimensions
  — Users should feel 0 layout shift on load
  
Never use spinner for content that has a known skeleton.
Spinner only: button loading states, initial auth check.
```

---

# 2. Customer Web: Landing Page

## 2.1 Current Problems

**Critical issues with existing implementation:**

1. **Marquee pill bar** — "Long work hours, Screen strain, Travel fatigue…" is visual noise disguised as information. Nobody reads a scrolling marquee. It communicates nothing beyond "we serve stressed people" which the hero already does.

2. **Section proliferation** — 8 distinct sections (PainPoints, TrustBar, ServicesSection, HowItWorks, WhySection, SafetySection, Testimonials, ExpertsSection, FAQ, FinalCTA) creates exhaustion. A user who scrolls this has done more work than booking a session should require.

3. **"How It Works" with numbered steps 1-2-3** is the most over-used pattern in consumer apps. Uber doesn't have a "How Uber Works" section. Zepto doesn't explain itself. The product must demonstrate, not explain.

4. **Testimonials with "Working professional / Remote worker / Daily commuter"** placeholder archetypes destroy trust. Empty social proof is worse than no social proof.

5. **Hero mockup complexity** — The decorative "HeroMockup" (booking card, expert assigned, ETA 12 min) inside the hero competes with the headline. Choose: headline communicates or mockup communicates. Not both.

6. **Multiple competing CTAs** — `Book Now` and `How It Works` in hero, then `Explore Services` in services section, then `Become an Expert` in experts section, then `Book A Session` in final CTA. Dilution.

7. **Landing page not personalizing on return visits** — an authenticated user sees the full marketing site. They should be redirected (this exists) but the redirect should be instant, not a flash of the landing.

8. **Legal/disclaimer copy in services section** — "Not a spa. Not luxury. Not medical treatment…" placed inline in the marketing section creates anxiety at exactly the wrong moment.

---

## 2.2 Redesigned Landing Page

### Design Principles

1. **Demonstrate, don't explain.** Show an order being tracked live. Don't say "Here's how it works in 3 steps."
2. **One CTA, everywhere.** The action is always "Book a session." Everything leads there.
3. **Trust through specificity.** Real numbers, real process details, real categories. Not "verified experts."
4. **Calm pace.** Health = calm. Aggressive CTAs, fear-of-missing-out copywriting, and busy layouts contradict the product.
5. **Mobile-first, hero-first.** 60%+ of users on mobile. The hero must convert. Everything below is for the unconvinced.

### Section Architecture (Ruthlessly Culled)

```
1. NAV           — minimal, transparent
2. HERO          — one headline, one sub, one CTA, live mockup
3. SERVICES      — 5 service cards. That's it.
4. PROOF         — 3 real stats + 1 trust statement
5. PROCESS       — shown via animation, not list
6. FAQ           — 5 questions. Accordion. Below fold.
7. FINAL CTA     — repeat of hero CTA
8. FOOTER        — minimal

Removed:
× PainPoints marquee
× TrustBar (merged into stats)
× HowItWorks numbered steps
× WhySection (redundant with hero)
× SafetySection (merged into proof)
× TestimonialsSection (placeholders destroy trust)
× ExpertsSection (separate /experts page)
```

---

### Section 1: Navigation

```
LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Logo: R · Relief]                    [Services]  [Book now →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEHAVIOR
- position: fixed, top: 0, z-index: 50
- Default (scroll < 80px): transparent bg, white text
- Scrolled (≥ 80px): bg white with shadow-sm, text primary
  Transition: 220ms ease-out
- Mobile: logo + hamburger only
  Drawer: full-height right slide-in, 80% width
  Drawer items: Services, Book Now (primary button)

COPYWRITING
Logo: "R · Relief, Delivered" — the brand name does the work
Nav item: "Services" not "Browse services"
CTA: "Book now" not "Book A Session" (shorter, more action-y)

DESKTOP CTA
Primary button (Forest-500), height 40px, "Book now"
On landing = scrolls to services section
On /services = opens cart/booking

AUTHENTICATED STATE
Redirect immediately on auth check. No flash.
```

---

### Section 2: Hero

**The only job of this section:** Make someone book in the next 30 seconds.

```
MOBILE LAYOUT (375px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
safe area top
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                              ← 80px nav space
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                              ← padding-top 64px

[chip: ◉ Live · Delhi NCR]                    ← 12px label, Forest-500

Feel better in                                ← Fraunces 52px weight 300
 minutes.                                     ← line 2 (Forest-500 color)

At-home wellness by verified experts.         ← Inter 17px Slate-600
 Usually here within 15 minutes.              ← 2 lines max

                                              ← 32px gap

[    Book a session →    ]                    ← Primary button full width 52px

                                              ← 24px gap

[Live mockup card]                            ← See below
  Expert assigned
  Ravi K. · ETA 8 min · 2.3 km away
  ████████░░░░░░░ Progress bar (65%)

                                              ← padding-bottom 40px
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```
DESKTOP LAYOUT (1280px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Left: 55%]                         [Right: 45%]
                                    
  ◉ Live · Delhi NCR                [Live Tracking Mockup]
                                     Full card, animated
  Feel better in                     
  minutes.                          [Expert Photo Ring]
                                    [Name: Ravi K.]
  At-home wellness by verified      [ETA: 8 min away]
  experts. Usually within           [Map: dot moving]
  15 minutes.                       
                                    
  [ Book a session → ]  ☎ Call us  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Background: white (#FFFFFF), not Forest-900
The dark hero pattern (Forest-900 bg, white text) is reserved for the TRACKING screen.
Landing should feel light, accessible, approachable.
```

**The Live Mockup Card — Design Decision**

This is the single memorable element of the landing page. It must feel real.

```
MOCKUP CARD SPEC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg: Forest-900 (dark, contrasting)
radius: 20px
padding: 20px
shadow: --shadow-xl
width: 280px (mobile: full width of section)

TOP ROW:
  [●] Expert assigned          [Live ·]
  green dot, animated pulse    green chip

MIDDLE:
  [Avatar: RK]  Ravi Kumar
               ★ 4.8 · Head & Shoulder Relief
               
ETA ROW:
  🕐  8 min away  ·  2.3 km

PROGRESS:
  Session starts soon
  ████████████░░░ (80% progress, animated)

All text: white/Forest-200
Animated: the progress bar pulses subtly
         the dot blinks every 2s
         the ETA counts down (8 → 7 → 6 min, loops)

PURPOSE: User sees the END STATE before booking.
         They understand exactly what they'll get.
         Trust through demonstration, not description.
```

**Background treatment:**

```
bg: #FFFFFF
Below hero: subtle gradient overlay from white → Sand-50
No dark background on landing. Reserve dark for tracking.
```

---

### Section 3: Services

**Philosophy:** 5 cards. No filters needed on landing. Filters live on /services.

```
SECTION HEADER
  [label: WHAT WE OFFER — Forest-500 --type-label]
  Relief for where it hurts today
  [Fraunces 36px/42px weight 400]

SERVICE CARDS GRID
Mobile: single column, horizontal scroll snap
Tablet: 2×3 grid
Desktop: 5 columns

SERVICE CARD SPEC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg: white
border: 1px solid --border-subtle
radius: 16px
padding: 20px
height: auto (content-driven)

TOP: [Emoji icon]  [Category: BACK RELIEF — label]

Name: Back & Lower Back Relief
      [Inter 17px weight 600]

Desc: One or two lines max. Specific.
      "Targets the lumbar and mid-back
       tension from desk work."
      [Inter 14px Slate-500]

BOTTOM:
  ₹499          [Add →]
  [price-sm]    [ghost button, 36px]

HOVER (desktop):
  border-color: --border-brand
  shadow: --shadow-md
  translateY: -2px
  transition: 220ms ease-out

PRESSED (mobile):
  scale: 0.98, 80ms
```

**Bottom of section:**

```
[center-aligned]
Looking for something specific?  [Browse all services →]
[Slate-500 body]                 [brand text-link]
```

---

### Section 4: Proof (Stats + Trust)

**Not "trust signals" — proof.**

```
LAYOUT: 3 stats + 1 statement

[     1,000+     ]   [     4.8★     ]   [    <15 min    ]
[  sessions done  ]   [  avg rating  ]   [  avg arrival  ]
[Fraunces 36 num  ]   [              ]   [               ]

Below, full width, centered:
"Every expert is background-checked, trained, and rated
 by real customers before arriving at your door."
[Inter 15px Slate-600 max-width 560px]

Background: Sand-50 (warm, distinct from white sections)
```

**What we removed:** "4 TrustBar items" with verbose descriptions. Numbers are more trustworthy than adjectives.

---

### Section 5: Process (Animated, not listed)

**Kill the "How It Works" numbered steps.** Show it.

```
ANIMATED SEQUENCE
  Auto-plays on scroll entry, loops every 8s

  State 1 (2s): Service selection screen mockup
                "Choose relief"
  
  State 2 (2s): "Finding experts…" animation
                dots expanding
                "Matched in seconds"
  
  State 3 (2s): Expert card appears with ETA
                "Expert on the way"
  
  State 4 (2s): Session complete card
                "Done. Relief found."

REDUCED MOTION:
  Static 4-step icon row instead
  No animation

HEADING:
  "From booking to relief,
   in under 15 minutes."
  [Fraunces 32px]
```

---

### Section 6: FAQ (Accordion)

```
5 questions only:
1. "Is this medical treatment?" — No. (leads with what it's NOT)
2. "How quickly can someone arrive?"
3. "What's included in a session?"
4. "How do you verify experts?"
5. "What if I'm not happy with the session?"

DESIGN:
Each Q: 56px row, full-width border-bottom divider
Answer: slides down, Inter 15px Slate-600
Chevron: rotates 90° on open, 220ms ease-out
Only one open at a time
```

---

### Section 7: Final CTA + Footer

```
FINAL CTA SECTION
bg: Forest-900
padding: 80px 20px

Heading: "Ready for relief?"
         [Fraunces 48px white]

Sub: "Book in 60 seconds. Expert at your door."
     [Inter 17px Forest-200]

Button: "Book a session →" [white bg, Forest-900 text]
        width: 240px, height: 52px

FOOTER (minimal)
bg: Forest-900 (continuous from CTA section)
Content: Logo | Support | Terms | Privacy
Copyright: "© 2025 Relief, Delivered"
No elaborate column system. One row. Mobile: stacked.
```

---

## 2.3 Landing Page Animations

```
SCROLL REVEAL SYSTEM:
  Each section fades in + rises 24px
  Duration: 500ms --ease-out
  Stagger: 80ms between children
  Trigger: 15% of element in viewport (IntersectionObserver)

  Reduced motion: no transform, opacity only

HERO:
  Chip: fade in, 0ms delay
  Headline: fade in + rise, 100ms delay
  Sub: fade in, 200ms delay
  Button: fade in, 300ms delay
  Mockup card: fade in + rise 40px, 400ms delay

SERVICE CARDS:
  Stagger: 60ms per card
  Direction: left to right

STAT NUMBERS:
  Count up from 0 to value on scroll entry
  Duration: 1500ms, ease-out
  (disabled with prefers-reduced-motion)
```

---

# 3. Customer Web: Services + Cart

## 3.1 Services Page — Current Problems

1. **Filter pills + count text** creates information hierarchy confusion. The pill filters compete with the service cards for attention.
2. **"Couldn't load sessions / Check that the backend is running"** — technical error message exposed to users. Never acceptable in production.
3. **ServiceBookingCard has benefit tags** (Screen fatigue, Desk work, Stress relief) that duplicate information already in the service name/description. Remove.
4. **`{brand.disclaimer}`** on ServiceDetailPage interrupts the booking flow at a critical decision moment.

## 3.2 Redesigned Services Page

```
MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Nav — sticky]

[Sticky filter bar — horizontal scroll, no overflow indicator]
  All  ·  Head & Neck  ·  Shoulders  ·  Back  ·  Legs

[Service grid — 1 col mobile, 2 col tablet, 3 col desktop]
  [Service Card]
  [Service Card]
  ...

[Floating cart bar — above bottom of viewport, z-index 40]
  "2 services  ·  ₹998"      [View cart]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Service Card Redesign

```
SERVICE CARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Top: full-width subtle illustration or gradient — 120px]
  (No stock photos. Minimal abstract illustration. Or color block.)

Category: BACK RELIEF [label color: Forest-500]
Name: Back & Lower Back Relief [h3]
Duration: 60 min [caption Slate-500]

Description: 1 sentence. Max 80 characters.
             No benefit tags. The name IS the benefit.

Bottom:
[₹499]              [+ Add]
[price-lg]          [primary button sm, 36px]

Added state:
[₹499]   [− 1 +]
          [quantity controls, animated in]

CARD HEIGHT: content-driven, no fixed height
CARD RADIUS: 16px
CARD BORDER: 1px solid --border-subtle

HOVER:
  shadow-md + border-brand transition 220ms
```

### Loading State

```
SKELETON (matches card exactly):
  Top color block: Sand-200 shimmer 120px
  Text lines: 2 lines, varying widths
  Price row: 1 line
  
COUNT: Do NOT show "5 session(s)" — not useful.
       Just show the grid. User can count.

ERROR STATE:
  Do NOT show "Check that the backend is running"
  
  [Illustration: simple icon, not stock art]
  "Couldn't load services"
  "Check your connection and try again."
  [Try again →]  [small secondary button]
  
EMPTY FILTER:
  [Icon]
  "Nothing under {filter name}"
  "Try a different category."
```

---

## 3.3 Cart Drawer

**Current problems:** "Your booking" as the drawer title is confusing — it's a cart, not a booking yet. "Continue booking" is vague.

```
CART DRAWER REDESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEADER
  [×]  Your cart
       [2 sessions selected]     ← body-sm Slate-500

DIVIDER ─────────────────────────────────

ITEMS (scrollable if overflow)
  [Session name]           [×]
  60 min  ·  ₹499

  [Session name]           [×]
  45 min  ·  ₹349

DIVIDER ─────────────────────────────────

SUMMARY
  Duration         1h 45m
  Total           ₹848

DIVIDER ─────────────────────────────────

STICKY BOTTOM
  [   Book now — ₹848   ]    ← Primary, full width
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMPTY STATE
  [Cart icon illustration]
  "Your cart is empty"
  [Browse sessions →]

ENTRY ANIMATION:
  Slides in from right (desktop) or bottom (mobile)
  Backdrop: rgba 0.32, blur 2px
  Duration: 350ms --ease-out

EXIT:
  Reverse direction, 200ms

ITEM REMOVE:
  Height collapses + opacity fades, 220ms
  Brief "Item removed" toast bottom-center, 2s
```

---

## 3.4 Floating Cart Bar

```
REDESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Cart icon]  2 sessions · ₹848    [Book now →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bg: Forest-900
text: white
height: 60px
bottom: 16px + safe area
left/right: 16px
radius: 16px
shadow: --shadow-xl

BEHAVIOR:
  Appears when cart has ≥ 1 item
  Entry: slides up 24px + fade, 300ms
  Exit: slides down + fade, 200ms

MOBILE:
  Acts as sticky CTA — most users will book from here
  Takes full viewport width minus 32px margin

DESKTOP:
  Hidden — cart drawer always accessible from nav
```

---

# 4. Customer Web: Booking Flow

## 4.1 Address + Booking Modal — Current Problems

1. **"Select address" + address cards + GPS warning + order summary + payment section** all in one modal is too much. This is a multi-step flow crammed into one screen.
2. **"When would you like to pay?"** with "Pay to confirm and find your expert" / "Find expert first, pay anytime before session ends" — these are confusing. Users don't understand what "dispatch" means.
3. **GPS warning "Some saved addresses are missing GPS coordinates"** is technical. Users understand "We need a precise location."

## 4.2 Redesigned Booking Flow (Multi-Step Bottom Sheet)

Replace the single modal with a 3-step bottom sheet flow.

```
STEP INDICATOR (top of sheet)
●●○  Step 1 of 3  [progress dots, not numbers]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Handle bar
[Where should we come?]  ← h2, 22px

[Address cards — scrollable list]

  ┌─────────────────────────────────────┐
  │ ● Home                    Default  │  ← selected state
  │   42, Vasant Vihar...              │
  └─────────────────────────────────────┘
  
  ┌─────────────────────────────────────┐
  │ ○ Office                           │  ← unselected
  │   14th Floor, Tower B...           │
  └─────────────────────────────────────┘

[+ Add a new address]  ← ghost link, Forest-500

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[   Continue →   ]  ← primary, sticky bottom
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```
STEP 2: PAYMENT TIMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Handle bar
[Pay now or later?]  ← h2

OPTION CARD A (selected by default):
┌─────────────────────────────────────┐
│ ● Pay now  ₹848                    │
│   Confirms your booking instantly.  │
│   Experts are notified right away.  │
└─────────────────────────────────────┘

OPTION CARD B:
┌─────────────────────────────────────┐
│ ○ Pay after the session             │
│   Book now, pay when it's done.     │
│   No card needed yet.               │
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[   Continue →   ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```
STEP 3: CONFIRM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Handle bar
[Looks good?]  ← h2

SUMMARY:
  [📍] 42, Vasant Vihar, New Delhi

  SESSIONS
  Back & Lower Back Relief     ₹499
  Head & Neck Relief           ₹349
  ─────────────────────────────────
  Total                        ₹848

  PAYMENT
  Pay now  [change]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[   Confirm — ₹848   ]     ← primary
 No card details stored without consent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Note at bottom: --type-caption Slate-400
"Sessions are non-medical. See our FAQ."
(moved disclaimer here, out of product detail page)
```

**Step transitions:**

```
Entering step: new content slides in from right, 300ms
Back: slides from left
Sheet height: animates to content height, 350ms ease-out
Never jumps — smooth height interpolation
```

**GPS Missing State:**

```
INSTEAD OF:
"Some saved addresses are missing GPS coordinates"

SHOW:
  [🎯 icon]
  "We need your precise location"
  "Turn on location access so we can find nearby experts
   and give you accurate arrival times."
  [Allow location →]  [Skip — use this address]
```

---

# 5. Customer Web: Order Tracking (World-Class)

This is the most critical screen in the product. A user who just booked a session and is waiting for their expert is anxious. The tracking screen's job is to **eliminate that anxiety**.

## 5.1 Current Problems — Brutal Assessment

**The current tracking screen has an architectural flaw:** It has too many concurrent components all saying the same thing.

```
Current state "assigned":
  - Hero headline: "Expert assigned"     ← status #1
  - Subcopy: "Ravi is on the way"        ← status #2  
  - Live chip: "Live"                    ← status #3
  - Timeline: step "Expert Assigned" = current  ← status #4
  - Expert card: shows expert name       ← status #5
  - Meta card: "ETA ~8 min · 2.3 km"   ← status #6
  - Map: Live (shows expert moving)      ← status #7

The user is being told the same thing 7 different ways.
This is cognitive overload disguised as informative design.
```

**Specific problems:**

1. **Timeline component during live states** — a vertical step-by-step timeline during "assigned" status tells the user about the future while they're living the present. It pulls attention away from the map and ETA which are the only things that matter.

2. **Hero owns the "narrative" but map also competes** — the forest-green hero card AND the full map AND the expert card all fight for visual dominance. There is no clear hierarchy.

3. **Cancel button visible on same screen as map** — this creates anxiety. "Should I cancel? When should I cancel?" The cancel option should be accessible but not prominent.

4. **"Session in progress" state shows timeline** — during a session, the timeline steps are completely irrelevant. The only thing that matters is "your session is happening."

5. **Pay banner in hero card** — the amber "Pay before your session ends" urgency placed inside the hero tracking card mixes two concerns: "where is my expert?" and "you owe money."

6. **Completed state shows expert card** — after a session ends, the user wants a receipt. Not to see the expert's card.

## 5.2 Redesigned Tracking Page — State by State

### Design Principle for Tracking

**The map IS the story when movement is relevant. The hero IS the story when waiting.**

```
STATUS → PRIMARY VISUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
awaiting_payment  → Payment hero (no map)
created           → Warm waiting state (no map)
searching         → Search animation (no map)
assigned          → FULL-SCREEN MAP + bottom sheet
in_progress       → Session timer full-screen
completed         → Completion celebration
cancelled         → Cancellation summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### State 1: `awaiting_payment`

**User emotion:** Slight uncertainty — did I book properly?

```
MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
← Back             Your booking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Full width hero: Forest-900 bg, 240px height]

  ⏸  Booking held               ← icon (pause, not X)

  Complete payment to            ← Fraunces 28px white
  find your expert.              

  Experts are ready. We just    ← Forest-200 14px
  need payment confirmation.    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM SHEET (peek: 64%, full: 90%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Handle ─────────────────────────────────────

SESSION SUMMARY (collapsed, expandable)
  Back Relief · Head Relief
  ₹848 total                  [→ expand]

─────────────────────────────────────────────

[   Pay ₹848 →   ]            ← Primary full width
                               height: 56px (larger for payment)
[Cancel booking]               ← Ghost, smaller, below

─────────────────────────────────────────────
Note: "Payment is secure. Session not started yet."
[--type-caption Slate-400, centered]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S ABSENT:
× Map (no reason to show it — expert not assigned)
× Timeline (premature)
× Expert card (no expert yet)
× Status badge (hero communicates status)
× Live chip (nothing is live)
```

---

### State 2: `created` / `searching`

**User emotion:** Mild anticipation. "Is someone coming?"

This is the most anxiety-producing wait. The screen must feel alive without being noisy.

```
MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
← Back

[Hero: Forest-900, full width, 280px]

  [Animated search visual — NOT a spinner]
  
  Three concentric circles expanding from center:
  Forest-600 → Forest-400 → Forest-200
  opacity: 1 → 0.6 → 0.2
  scale: 1 → 1.4 → 1.8 (loops every 2.4s)
  This visually communicates "searching radius expanding"
  
  Finding someone nearby.        ← Fraunces 26px white
  Usually takes under 2 minutes. ← Forest-200 14px
  
  [candidateEtaMin exists]:
  Experts ~{eta} min away        ← Forest-400 small, centered
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM SHEET (fixed at 45% height)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Handle ─────────────────────────────────────

42, Vasant Vihar, New Delhi    ← address, 1 line, body
Back Relief · Head Relief      ← sessions summary, caption

─────────────────────────────────────────────

[   Cancel booking   ]         ← Secondary/ghost only
                               (no primary action — just wait)

─────────────────────────────────────────────
PAY LATER REMINDER (only if pay_later + unpaid):

  "Remember to pay before your session ends."
  [Pay ₹848 →]  ← but smaller, not alarming
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S ABSENT:
× Map (expert not assigned, map of empty pins is useless)
× Timeline (telling user "7 steps to go" increases anxiety)
× Expert card (no expert yet)
× Status badge (the search animation IS the status)

STATUS TRANSITION ANIMATION (searching → assigned):
  Hero bg: scales out as map slides up
  Map fills screen from bottom, 500ms
  Bottom sheet appears simultaneously
  Expert card enters from bottom, 350ms
  Haptic: success pattern (mobile only)
```

---

### State 3: `assigned` — THE CRITICAL STATE

**User emotion:** Relief. Anticipation. "Where are they now?"

**This is the Uber moment. The map owns the experience.**

```
MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
safe area top
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
← [semi-transparent back button, overlaid on map]

[MAP — fills top 55% of viewport]
  Customer marker: Forest-500 pin with white circle
  Expert marker: Forest-900 filled circle, animated movement
  Route line: dashed Forest-400
  
  [Top of map: transparent gradient fade to black]
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM SHEET (snapped at 48% = shows expert info)
Draggable to 75% (shows address + sessions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Handle ─────────────────────────────────────

ETA ROW:                               [● Live]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  8 min away                           ← type-display-sm / Fraunces 32px Forest-900
  2.3 km · Vasant Vihar route          ← caption Slate-500

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERT ROW:
  [Avatar: initials/photo, 48px ring]
  Ravi Kumar                           ← body 600 weight
  ★ 4.8 · Head & Shoulder Relief       ← caption Slate-500
                            [Call]     ← ghost button sm, right

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Expanded area — visible on drag to 75%]
  
  YOUR ADDRESS
  42, Vasant Vihar, New Delhi          ← body Slate-600

  SESSIONS
  Back & Lower Back Relief     ₹499
  Head & Neck Relief           ₹349
  ─────────────────────────────────────
  Total                        ₹848

  [Cancel booking]  ← ghost, small, at bottom of expanded

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAY LATER ONLY (amber strip, below handle):
  "Pay before your session ends  →  Pay ₹848"
  bg: Amber-50, border-bottom: 1px Amber-200
  Tappable: opens payment sheet
```

**Key design decisions:**

1. **ETA as the headline** — not "Expert assigned" — the user knows an expert is assigned; what they want to know is WHEN. ETA is the only number that matters.
2. **Live chip** — small, top-right, Forest-900 bg. One instance. Not in hero AND sheet AND badge.
3. **Expert name** — shown but not the primary element. ETA is.
4. **Cancel** — accessible but only on expand. Not on the main state.
5. **Map occupies 55% minimum** — this IS the communication.

```
DESKTOP LAYOUT (1280px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Sidebar 380px fixed]        [Map — fills remaining width]
                             
  ← My Orders                  
                             [Map full height]
  8 min away        [● Live]   
  2.3 km                    [Customer pin + Expert pin + route]
  ─────────────────────────
  [Avatar] Ravi Kumar          
  ★ 4.8     [Call]             
  ─────────────────────────    
  YOUR ADDRESS                 
  42, Vasant Vihar             
  ─────────────────────────    
  Back Relief         ₹499     
  Head Relief         ₹349     
  Total               ₹848     
  ─────────────────────────    
  [Cancel booking]             
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### State 4: `in_progress` — Session Running

**User emotion:** Calm. Trusting. Maybe a little sleepy (that's good).

```
MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Hero: Forest-900 full height, 300px]

  IN PROGRESS                    ← label Forest-400, small
  
  24:18                          ← Fraunces 56px white
                                   SESSION TIMER (elapsed)
  
  of 60 min booked               ← Forest-200 14px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM SHEET (fixed 40%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Handle ─────────────────────────────────────

[Avatar] Ravi Kumar              ← expert row
★ 4.8 · Head & Shoulder Relief

─────────────────────────────────────────────

Progress bar: elapsed/booked minutes
[████████████░░░░░░░] 40%        ← Forest-500 on Sand-200

─────────────────────────────────────────────

[only if pay_later + unpaid:]
  [Pay ₹848]  ← amber tinted button, primary
  "Session ends in ~36 min"

[if paid:]
  (nothing — just enjoy the session)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S ABSENT:
× Map (they're in your home — map is useless)
× Timeline (nobody cares about "Session Started" step while IN session)
× Cancel button (cannot cancel mid-session)
× Status badge (the timer IS the status)
× Expert phone number (they're in your home)

TIMER DESIGN:
  Large monospaced: Fraunces works for this in light weight
  Updates every second
  MM:SS format
  When time exceeds booked: subtle red tint on timer only
  No alarm, no urgency, just information
  
SESSION COMPLETE transition:
  Timer freezes, then brief celebration:
  Confetti from top (200ms burst, then fades)
  Haptic: success pattern
  Screen transitions to Completed state
```

---

### State 5: `completed` — Session Complete

**User emotion:** Satisfied. Possibly relaxed (that's a win). Now they want a receipt.

```
MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
← My Orders

[Hero: compact, 200px, Forest-900]

  ✓  Session complete.            ← checkmark icon + Fraunces 28px white
  
  Wednesday, 21 June · 60 min    ← Forest-200 14px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM SHEET (scrollable content)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Avatar] Ravi Kumar
★ 4.8 expert         [Rate this session]  ← right ghost button

─────────────────────────────────────────────
RECEIPT

  Back & Lower Back Relief     ₹499
  Head & Neck Relief           ₹349
  ─────────────────────────────────────
  Total                        ₹848
  
  [Paid via UPI — Jun 21, 10:42 am]   OR
  [Pay ₹848 →]  ← if unpaid

─────────────────────────────────────────────

[Book another session →]  ← secondary, full width
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLETION ANIMATION:
  On state transition to completed:
  Confetti burst (subtle — not carnival, this is wellness)
  Colors: Forest-300, Sand-300, white
  Duration: 1200ms, particles fall and fade
  
WHAT'S ABSENT:
× Map (session done)
× ETA (done)
× Timeline (nobody wants to revisit the journey)
× Live chip (nothing is live)
× Cancel button (cannot cancel completed session)

RATING FLOW:
  "Rate this session" tapped → inline rating sheet
  5 stars (tap to select)
  Optional: 1-line text field "What went well?"
  [Submit rating]
  On submit: star fills with Forest-500, "Thanks for your feedback" toast
```

---

### State 6: `cancelled`

**User emotion:** Disappointment, possibly frustration.

```
MOBILE LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
← My Orders

[Hero: Slate-700 bg, 200px — neutral, not alarming red]

  ✕  Booking cancelled           ← × icon + Fraunces 28px white

  [reason — specific, warm]:
  "No experts were available nearby."  ← Forest-200 14px
  — or —
  "You cancelled this booking."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM SHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  What was booked:
  Back & Lower Back Relief     ₹499
  Head & Neck Relief           ₹349

  [no_expert_in_sla only:]
  ─────────────────────────────────────────────
  "Try booking again in a few minutes,
   or choose a different service."

─────────────────────────────────────────────

[Try again →]                  ← Primary (pre-fills same services)
[Back to orders]               ← Ghost

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S ABSENT:
× Map
× Timeline
× Expert card
× Live chip
× Anything suggesting ongoing activity

REFUND NOTE (if payment was made):
  "Your refund of ₹848 will appear in 3–5 days."
  [caption, Slate-500]
```

---

### Real-time Toast System for Tracking

```
TOAST DESIGN
Position: top-center, safe area top + 12px
Max width: min(480px, 100vw - 32px)
Radius: 12px
Shadow: --shadow-lg

Toast variants:
┌─────────────────────────────────────────┐
│ ✓  Expert assigned  ·  Ravi K. · 8 min │  ← success (Forest-900 bg)
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓  Payment confirmed                    │  ← success
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✗  Booking cancelled — no expert nearby │  ← neutral (Slate-900)
└─────────────────────────────────────────┘

Auto-dismiss: 4s (success), 6s (error — give more time to read)
Animation: slide in from top, 300ms ease-out
           slide out to top, 200ms ease-in
Never stack more than 2 toasts
```

---

# 6. Customer Web: Dashboard Shell

## 6.1 Current Problems

1. **Sidebar logo block "R · Relief, Delivered · Your account"** — "Your account" is redundant in a dashboard.
2. **Mobile header: "Hi, {firstName}" + page title** — two separate pieces of context when one suffices.
3. **Bottom nav: Orders / Addresses / Account / Support** — "Account" and "Profile" are often confused. Users expect "Profile."
4. **Desktop sidebar nav occupies full left side always** — creates wasted space on smaller desktops.

## 6.2 Redesigned Dashboard Shell

### Desktop Sidebar (280px fixed)

```
SIDEBAR LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[R · Relief, Delivered]   ← Logo, 56px top
                          → links to /services
────────────────────────────────────────
[Avatar: user initials, 40px]
Milind                    ← name
+91 98765 43210           ← phone, caption

────────────────────────────────────────

NAV ITEMS (each 44px touch target):

  [package icon]  My Sessions     ← "Orders" renamed
  [home icon]     Addresses
  [user icon]     Profile         ← "Account" renamed
  [help icon]     Support

────────────────────────────────────────

[Book a session →]         ← primary button, 40px

────────────────────────────────────────
[sign out →]               ← ghost, small, bottom
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTIVE STATE:
  Left border: 3px Forest-500
  bg: Forest-50
  text: Forest-700 weight 600

HOVER:
  bg: Sand-50
  
Nav item height: 44px
Padding: 12px 16px
Radius on right: 8px (pill-right effect)
```

### Mobile Bottom Nav

```
BOTTOM NAV (60px + safe area bottom)

  [Sessions]  [Profile]  [Support]

3 items only (mobile). Drop "Addresses" — accessible from Profile.

Active: Forest-500 icon + label + top indicator line (2px)
Inactive: Slate-400 icon + Slate-500 label
Label: --type-caption weight 500

The "Orders tracking" screen hides bottom nav (already implemented).
```

### Mobile Header

```
Header (56px):
  [← back icon if depth > 1]   [Page Title]   [search/action if needed]

  NOT: "Hi Milind" + page title
  Just the page title.
  User name lives in the Profile tab.
  
  bg: white
  border-bottom: 1px --border-subtle
  shadow: none (use border instead — cleaner)
```

---

# 7. Customer Web: Profile, Addresses, Support

## 7.1 Orders List Page

**Current design:** Tabs (Active/Past/Cancelled) with OrderCard rows.

**Problems:**
1. Three tabs is unnecessary fragmentation. Users scroll, they don't tab-navigate order history.
2. OrderCard shows: avatar letter + title + date + status badge + price + chevron + secondary line + live chip = 7 elements on one card.

**Redesigned Orders Page:**

```
HEADER:
  My Sessions

NO TABS. Single scrollable list.
Group by status (active first, then past, then cancelled):

ACTIVE SECTION (if any):
  [label: ACTIVE — --type-label Forest-500]
  [OrderCard × n — highlighted with Forest-50 bg]

PAST SECTION:
  [label: PAST — --type-label Slate-400]
  [OrderCard × n]

[no separate cancelled section — show as grey cards in Past]

ORDER CARD REDESIGN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg: white, radius 12px, shadow-xs
padding: 16px

TOP ROW:
  Back & Shoulder Relief         [● Live]
  [Inter 15px 600]               [only if live]

BOTTOM ROW:
  Wed, 21 Jun · ₹848       [In progress]
  [caption Slate-400]       [status chip — ONE place only]

No avatar letter. No chevron (the whole card taps). No secondary line.
Status is communicated ONCE, as a chip on the right.

HEIGHT: 76px (fixed, comfortable density)
DIVIDER: none (cards have gaps, not borders between them)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMPTY STATE:
  [Illustration: simple icon]
  "No sessions yet"
  "Book your first at-home relief session."
  [Book now →]

LOADING:
  4 skeleton cards
  Shimmer animation

ACTIVE CARD:
  bg: Forest-50
  border: 1px Forest-200
  Live chip: appears
```

## 7.2 Addresses Page

```
HEADER: Where to come?   ← more human than "My Addresses"

INTRO: "Your saved locations for at-home sessions."
       [removed from intro — moved to empty state only]

ADDRESS CARDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [📍]  Home                    [Default]
        42, Vasant Vihar, New Delhi

  [Actions: Set as default  ·  Remove]   ← shown below card, tap-to-expand

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[+ Add a new address]   ← primary ghost button, bottom

GPS WARNING:
  NOT: "Missing location" amber badge
  Instead: small info icon, tooltip on tap
  "Tap to update location for this address"
  One orange dot on the address card, subtle

EMPTY STATE:
  [Location icon illustration]
  "No saved addresses"
  "Add a home address so your expert knows where to come."
  [+ Add address →]
```

## 7.3 Profile Page

```
HEADER: Your profile

USER BLOCK:
  [Avatar: initials, 64px ring]
  Milind Sharma
  +91 98765 43210
  
SETTINGS ROWS (each 52px, dividers):
  Personal details        →   ← taps to edit sheet
  Notifications           →
  Payment methods         →
  
BOTTOM:
  [Sign out]   ← red text, ghost, full width
               Confirmation: "Sign out?" bottom sheet with [Yes, sign out] + [Cancel]
```

## 7.4 Support Page

```
HEADER: Help

LAYOUT:
  Quick actions first:
  [📧  Email us]          → mail:
  [💬  Chat with us]      → optional live chat
  
  FREQUENTLY ASKED:
  [FAQ accordion — same 5 questions from landing]
  
  [Browse all sessions →]  ← ghost, at bottom

  Design: simple, not call-center looking.
  No "We're here to help" corporate language.
```

---

# 8. Expert App: Complete Redesign

## 8.1 Design Philosophy for Expert App

**Reference:** Uber Driver app, Rapido Captain, Blinkit Partner.

**Key principles:**
1. **Large touch targets — always.** Expert is using the app one-handed, possibly while walking or driving.
2. **Minimum cognitive load.** Expert should never have to think about what to do next. The next action must be unmistakable.
3. **Night mode first.** Experts work evenings/nights. Dark mode is not an option, it's a requirement.
4. **Status clarity.** The expert must always know: am I online? Is a job coming? What do I do next?
5. **Earn focus.** Earnings motivation is key to expert retention. Make it visible, celebrate it.

## 8.2 Design System Additions (Expert App)

```
EXPERT APP PALETTE (dark-first):

Surface-0  : #0A0E12  — true dark, main bg
Surface-1  : #141A21  — elevated bg (cards)
Surface-2  : #1C2430  — secondary cards
Surface-3  : #232E3E  — hover/selected states
Border     : #2A3444  — subtle borders
Border-2   : #374659  — visible borders

Text-1     : #F0F4F8  — primary text
Text-2     : #94A3B0  — secondary
Text-3     : #5E7388  — muted/disabled

Online     : #22C55E  — online indicator
Job-active : #3B82F6  — active job blue
Earn       : #F59E0B  — earnings amber
Error      : #EF4444

TYPOGRAPHY SCALE (larger, field-optimized):
  Screen title  : Inter 22px 700
  Section title : Inter 18px 600
  Body          : Inter 16px 400
  Caption       : Inter 14px 400
  Label         : Inter 12px 600 UPPERCASE
  
  OTP digits    : Inter 40px 700
  ETA           : Inter 48px 300 (bold number, light weight)
  Earnings      : Inter 36px 700

TOUCH TARGETS: minimum 56px (larger than consumer app)
BUTTON HEIGHT: 60px (primary actions)
ICON SIZE: 28px (larger than web)
```

## 8.3 Expert App: Login Screen

**Current problem:** Default phone "+919000000005" hardcoded. Dev artifacts in UI.

```
LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[bg: Surface-0, full height]
Safe area top

[Top section: 40% height]
  [Logo: R mark, 64px, white]
  Relief, Delivered
  Partner app

[Form section: 60% height, white card, top-radius 32px]
  
  Welcome back.            ← screen title, Text-1
  Enter your phone to sign in.   ← Text-2
  
  ─────────────────────────────────────────
  
  PHONE STAGE:
  [+91]  [          phone number          ]
         height: 60px, large keyboard type
  
  [Send OTP →]   ← Primary, 60px height, full width
  
  OTP STAGE:
  Enter the code we just sent you.
  ← +91 99999 99999  [Change number]
  
  [OTP boxes: 4 large boxes, 72×80px each]
  [Auto-focus, auto-advance on each digit]
  
  [First time only:]
  Your name
  [Input, 60px]
  
  [Verify & continue →]  ← Primary, full width 60px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OTP AUTO-DETECT:
  If SMS OTP readable, auto-fill and auto-submit
  Show: "Verifying…" state (spinner in button)
  
ERROR TOAST:
  Bottom toast, not alert dialog
  "Wrong code — try again"  [Resend]
  
RESEND:
  Countdown timer: "Resend in 42s"
  After 0: "Resend code →" tappable
```

## 8.4 Expert App: Home Screen

**Current problem:** Toggle + status card + stat cards + recent orders on one screen creates visual noise. The MOST important element (online/offline toggle) is buried.

**Redesign philosophy:** The home screen IS the online toggle. Everything else is secondary.

```
LAYOUT — ONLINE STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg: Surface-0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HEADER (56px)
  Relief Partner         [Settings gear]
  ──────────────────────────────────────

HERO SECTION (280px, full width)
  bg: Surface-1, radius-bottom 28px
  
  ONLINE STATE:
    [●] You're online
        [Online-green dot, 12px, pulsing]
    
    "You'll receive jobs nearby."
    [Text-2]
    
    [Large toggle switch — custom design]
    Width: 160px, height: 64px
    Thumb: 56px circle
    Track when ON: Online-green
    Text inside thumb: "Online" when on, "Go online" when off
    
    Haptic on toggle: medium impact
    
  OFFLINE STATE:
    [○] You're offline
    "Turn on to receive jobs."
    [Same toggle, greyed]

──────────────────────────────────────────

TODAY'S SUMMARY (4 stat row):
  bg: Surface-1, radius 16px, margin: 16px
  
  [5]          [₹1,250]      [4.9★]      [12]
  Sessions     Earned        Rating      All time

  Each stat: label above (caption Text-3), value below (Inter 22px 700 Text-1)
  No borders between stats — dividers are tabular
  
  [Today ▼]  ← period selector, top-right corner, small

──────────────────────────────────────────

RECENT ORDERS (scrollable)
  Section label: RECENT
  
  [OrderCard]
  [OrderCard]
  [OrderCard]

  Empty:
    "No sessions today."
    [Body, Text-2, centered]

──────────────────────────────────────────

ON JOB STATE (overlay changes):
  HERO becomes:
  bg: Job-active tint (#0F172A → #1E3A5F gradient)
  
  [→] Active job
  Customer name
  [Open active order]    ← Primary button, 60px
  
  Toggle is DISABLED (greyed, cannot go offline mid-job)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 8.5 Expert App: Incoming Offer Modal

**This is the most critical expert UX moment. It must be impossible to miss and impossible to accidentally tap.**

```
FULL SCREEN MODAL (presentationStyle: fullScreen)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg: Surface-0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[TOP: Countdown ring — circular progress]
  Outer ring: Job-active blue, depleting
  Center: Large countdown number
  [30]                     ← Inter 48px 700 Text-1
  seconds to accept

──────────────────────────────────────────

[NEW JOB badge — Job-active chip, top]

CUSTOMER:
  Milind S.                ← Inter 24px 600 Text-1
  
SERVICE:
  Back & Lower Back Relief ← Inter 18px Text-2
  60 min                   ← Inter 16px Text-3

──────────────────────────────────────────

LOCATION ROW:
  [📍] 42, Vasant Vihar    ← Text-1 body
       2.4 km · ETA 9 min  ← Text-3 caption

──────────────────────────────────────────

EARNINGS (most prominent):
  You'll earn              ← label, Text-3
  ₹560                    ← Inter 48px 700 Earn-amber
                           (largest text on screen)

──────────────────────────────────────────

ACTIONS:
  [     Accept     ]       ← Primary, 64px height, full width
                             bg: Online-green, radius 16px
                             Inter 18px 700
                             Haptic on tap: heavy impact
  
  [  Decline  ]            ← Secondary, 48px, below
                             Text-3, ghost
                             Haptic on tap: light impact

──────────────────────────────────────────

BELOW BUTTONS:
  "Declining too often reduces offer frequency."
  [Caption, Text-3, centered]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENTRY ANIMATION:
  Modal: slide up from bottom, 400ms ease-out
  Content: staggers in, 60ms per element
  Countdown ring: starts filling immediately
  
  Sound (optional, only if device not on silent):
  2 short notification tones on entry
  
COUNTDOWN:
  At 10s: ring color shifts to Earn-amber (urgency)
  At 5s: ring color shifts to Error-red
  At 0: modal dismisses automatically
        "Offer expired" toast (brief, 2s)
  
ACCEPT BUTTON:
  On tap: immediate feedback (scale 0.96 + haptic)
  Then: loading state in button (spinner)
  Then: modal dismisses, ActiveOrder opens
  
  ACCIDENT PREVENTION:
  Decline button is 48px (vs 64px Accept)
  Decline is bottom, smaller, less color
  Swipe-to-decline is NOT implemented
  (accidental swipes during handling would be catastrophic)

WAKE SCREEN:
  When offer arrives, if screen is off/locked:
  App should trigger notification that shows offer countdown
  (Requires push notification + native code)
```

## 8.6 Expert App: Active Order Screen

**Think Uber Driver navigation screen. Clear steps, unmistakable next action.**

```
SCREEN ARCHITECTURE:
  The active order screen is a state machine with 6 states.
  Only ONE state is visible at a time.
  The step indicator dots communicate "you are here."

PERSISTENT HEADER (60px):
  [←]  Active order         [●]
                             dot: Job-active blue, pulsing
                             
CUSTOMER INFO BAR (persistent across all steps):
  bg: Surface-1
  Milind S. · Back & Shoulder Relief · 60 min
  [Inter 16px Text-1]
  
  NOT shown:
  × Customer phone (shown only in navigating step, as action)
  × Pricing (shown only in complete step)

STEP DOTS (persistent):
  ●──●──○──○──○
  Navigate  Arrived  OTP  Session  End OTP
  5 dots, active = Job-active, done = green, upcoming = Surface-3
  Height: 40px total, 8px dots, thin lines
```

### Step: Navigating

```
STATE: navigating
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAP (full screen behind header):
  [Map with customer pin]
  [Expert pin: your location]
  [Route: active navigation line]
  Height: 56% of screen

────────────────────────────────────────
BOTTOM CARD (Surface-1, top-radius 24px)

ETA ROW:
  [🕐] 9 min away · 2.4 km    ← Text-1 Inter 20px 600

ADDRESS:
  📍 42, Vasant Vihar, New Delhi   ← Text-2

────────────────────────────────────────

[   Navigate →   ]            ← Primary 60px full width
                                "Opens Google Maps"

[   I've arrived   ]          ← Secondary 56px full width

────────────────────────────────────────
bg: transparent overlay on map
Step dots visible at top
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S ABSENT:
× Customer pricing
× Session details (only in info bar)
× Earnings (save for completion)
```

### Step: Arrived

```
STATE: arrived
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[No map — you're here]

CENTER CONTENT:
  [✓ icon, 64px, Online-green]
  
  You're here.             ← Fraunces 32px Text-1
  
  Ask the customer for     ← Text-2 Inter 16px
  their start code.        
  
  ──────────────────────────────
  
  [   Enter start code   ]  ← Primary, 60px
                              Tap opens OTP step
  
  ──────────────────────────────
  
  [📞 Call customer]        ← ghost button
  [customer phone if available]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Haptic: success pattern on entering this state
        (confirms arrival is recorded)
```

### Step: Start OTP

```
STATE: start_otp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Enter the customer's start code."   ← Text-2

OTP INPUT:
  4 boxes:  [  8  ]  [  3  ]  [  1  ]  [  7  ]
  
  Each box: 72×88px
  Font: Inter 40px 700 Text-1
  bg: Surface-2
  Border: Border-2 default, Job-active when focused
  Gap: 12px
  
  Keyboard: numeric, auto-shows
  
DEV HINT:
  [only in __DEV__]
  bg: Earn-amber opacity 0.15
  "Dev code: {startCode}"
  tap to auto-fill

[   Verify & start   ]      ← Primary 60px
  disabled until 4 digits entered
  loading state: "Verifying…"
  
error:
  boxes shake (translate X -8px → +8px → 0, 300ms)
  "Incorrect code — try again"
  toast from bottom, 3s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step: Session Running

```
STATE: session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIMER (dominant):
  [  42:18  ]              ← Fraunces 56px Text-1 (monospaced)
  elapsed
  
  [progress bar]
  ████████████████░░░░░░░░ (elapsed / booked)
  70%  ·  60 min booked
  [caption Text-3]

──────────────────────────────────────────

[If add-ons exist:]
  bg: Surface-2, radius 12px, padding 12px
  "Customer added services"
  [addon name × n]

──────────────────────────────────────────

[   End session   ]         ← Primary 60px
                              Tap opens confirmation then OTP

──────────────────────────────────────────

END CONFIRMATION:
  Before end OTP, brief bottom sheet:
  "Ready to end the session?"
  Customer's booked time was 60 min.
  You've been here 42 min.
  
  [Yes, end session]   [Not yet]
  
  WHY: Prevents accidental session end taps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step: End OTP

```
STATE: end_otp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Enter the customer's end code."    ← Text-2

[Same OTP input as start_otp]

[   Complete session   ]    ← Primary 60px (green)
  loading: "Wrapping up…"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step: Complete (Earnings Celebration)

```
STATE: complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENTRY ANIMATION:
  Confetti burst (amber + green, subtle)
  Haptic: success notification pattern (strong)

LAYOUT:
  [★ Award icon, 64px, Earn-amber]
  
  Great work.              ← Fraunces 32px Text-1
  
  ─────────────────────────────
  
  You earned               ← label Text-3
  ₹560                     ← Inter 56px 700 Earn-amber
  
  ─────────────────────────────
  
  Session: 60 min
  Back & Lower Back Relief
  Wednesday, 21 Jun · 10:30–11:30am
  [all: Text-3 caption]
  
  ─────────────────────────────
  
  [   Back to receiving jobs   ]   ← Primary 60px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTE: Customer price is never shown. Only expert earning.
```

## 8.7 Expert App: Orders Screen

```
HEADER:
  My jobs                 ← "Orders" renamed

TABS:
  Today  ·  All

TODAY TAB:
  Groups by shift (Morning / Afternoon / Evening)
  if < 3 jobs: no grouping, just list
  
  Empty: 
    [Icon]
    "No jobs today"
    "You'll see new jobs here when they come in."
    [Pull to refresh]

HISTORY (All) TAB:
  Reverse chronological
  Infinite scroll
  [OrderCard × n]

ORDER CARD (Expert, redesigned):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bg: Surface-1, radius 14px
padding: 16px

TOP ROW:
  Milind S.                      Completed
  [Text-1 16px 600]              [green chip]

MIDDLE:
  Back & Lower Back Relief · 60 min
  [Text-2 14px]

BOTTOM ROW:
  Wed, 21 Jun · 10:30am          ₹560
  [Text-3 caption]               [Earn-amber, 600]

HEIGHT: 88px
PRESSED: scale 0.98 + bg Surface-2, 80ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 8.8 Expert App: Earnings Screen

```
HEADER:
  Earnings

PERIOD SELECTOR:
  [Today]  [This week]  [This month]
  Pill tabs, Job-active when selected

HERO:
  bg: Surface-1, radius 20px, padding 24px
  
  Total earned             ← label, Text-3
  ₹12,450                  ← Inter 40px 700 Earn-amber
  
  This month  ·  23 sessions  ← caption Text-3

BREAKDOWN:
  Base        ₹9,800
  Bonus       ₹1,200
  Tips        ₹1,450
  ───────────────────
  Total       ₹12,450
  
  [each row: 52px, bg Surface-1, dividers]

RECENT SESSIONS:
  [last 5 order cards, simplified]
  [View all →]
```

## 8.9 Expert App: Profile Screen

```
HEADER:
  My profile

USER BLOCK:
  [Avatar: photo or initials, 72px, border Online-green if online]
  Ravi Kumar
  ★ 4.8  ·  82 sessions
  +91 99999 99999

MENU ROWS (each 56px):
  Training status       [In progress →]
  KYC & documents       [Complete →]
  Support               →
  ──────────────────
  Sign out              ← red text

TRAINING STATUS:
  NOT alert dialog.
  Instead: opens a bottom sheet with progress:
  
  Training progress
  ████████████████░░░░  80%
  
  Module 1: Customer service   ✓
  Module 2: Safety protocols   ✓
  Module 3: Technique basics   ○ In progress
  
  [Continue training →]

OFFLINE INDICATOR:
  If offline:
  Small banner below header:
  "You're offline — check your connection."
  bg: Error-red opacity 0.15
  text: Error-red
  
  Auto-dismisses when reconnected
  (Brief success toast: "Back online")
```

## 8.10 Expert App: Offline & Error States

```
SOCKET DISCONNECTION:
  Persistent bottom banner (NOT modal):
  "Connection lost — reconnecting…"
  bg: Error-red opacity 0.15
  Height: 48px, stuck to top (below header)
  Spinner: small, left side
  
  On reconnect: banner animates away
  Toast: "Connected"
  
LOCATION PERMISSION DENIED:
  Bottom sheet (not alert):
  [📍 icon, 32px, Error-red]
  "Location access needed"
  "We need your location to match you with
   nearby customers and track your arrival."
  [Allow location →]   [Not now]
  
  "Not now" closes sheet, user stays offline

GOING ONLINE ERROR:
  Toast: "Couldn't go online — try again"
  [Retry] link in toast

OFFER RESPONSE ERROR:
  Toast: "Couldn't respond — {message}"
  User can retry from toast

GPS ACCURACY:
  If accuracy > 100m:
  Subtle indicator: "Low GPS accuracy"
  in status bar area
  Not blocking — just informational

BACKGROUND STATE:
  When app is backgrounded mid-session:
  Persistent notification:
  "Active session — tap to return"
  Timer: shows elapsed time in notification
```

---

# 9. Microinteractions & Motion System

## 9.1 Transition Catalogue

```
PAGE TRANSITIONS
  Dashboard navigation: 
    Content fades + slides 16px horizontal
    Duration: 220ms
    New page: fade in + rise 8px
    Old page: fade out
    
  Tracking page:
    Special: scales from order card
    (Hero expand from card position)
    Duration: 400ms ease-out
    
  Bottom sheet:
    Open: slide up 350ms ease-out
    Close: slide down 200ms ease-in
    Backdrop: 220ms fade

STATE TRANSITIONS (tracking)
  created → searching:
    Hero animates: text fade + search rings appear
    Duration: 500ms
    
  searching → assigned:
    Dramatic.
    Map slides up from bottom (500ms ease-out)
    Hero compresses to be behind bottom sheet
    Expert card animates in from bottom (350ms)
    Haptic: success pattern
    
  assigned → in_progress:
    Map fades out (300ms)
    Timer counts up from 00:00
    Progress bar fills from 0 (300ms)
    
  in_progress → completed:
    Timer freezes
    Hero transitions: Forest-900 → dim checkmark state
    Confetti particles (1200ms)
    Haptic: celebration pattern (2 short + 1 long)
```

## 9.2 Haptic System (Mobile)

```
CUSTOMER APP:
  Booking confirmed: medium impact × 1
  Expert assigned: success notification (medium × 2)
  Payment confirmed: medium × 1
  Session complete: success × 1 + soft × 1 (delay 100ms)
  Error: error notification
  
EXPERT APP:
  New offer arrives: heavy impact × 3 (120ms intervals)
  Offer accepted: heavy × 1
  OTP verified: medium × 1
  Session complete: success × 2 + heavy × 1 (celebration)
  Offer expired: soft × 1

iOS: Use UIImpactFeedbackGenerator and UINotificationFeedbackGenerator
Android: Use HapticFeedbackConstants.CONFIRM / LONG_PRESS / REJECT
```

## 9.3 Loading State Hierarchy

```
RULE: match the skeleton to the exact layout of loaded content.

Order: never show spinner when skeleton is possible.

Spinner → only for:
  1. Auth check (app startup, fullscreen)
  2. Button submit states
  3. Socket initial connection

Skeleton → for all list/grid/card content

SKELETON SPEC:
  Shimmer color: alternates between bg + 8% lighter
  Animation: 1.4s ease-in-out infinite
  Border radius: matches actual content
  
  Order list skeleton:
    4 cards × 76px height
    Each: 40% text placeholder + 60% text placeholder + small chip
  
  Services grid skeleton:
    120px image block + 2 text lines + price row
  
  Tracking skeleton:
    260px hero block + 3 info rows in sheet
    (even hero has skeleton — dark shimmer on Forest-900)
```

## 9.4 Toast System

```
TOAST PLACEMENT:
  Customer web: top-center, 16px from top (or from header bottom)
  Expert app: bottom-center, 16px from bottom safe area

TOAST ANATOMY:
  Height: 48px (single line) / 64px (two lines)
  Max-width: min(480px, 100% - 32px)
  Radius: 12px
  Padding: 12px 16px
  Shadow: --shadow-lg
  
  [Icon 20px] [Message] [optional: action link]
  
VARIANTS:
  success : bg Forest-900, text white, icon: ✓ white
  error   : bg Slate-900, text white, icon: ✕ red
  info    : bg Slate-900, text white, icon: ℹ white
  warning : bg Amber-50, text Amber-800, border: 1px Amber-200
  
AUTO-DISMISS:
  Success: 3s
  Error: 6s (more time to read)
  Warning: 8s (most important)
  
  On dismiss: slide back to placement direction + fade
  
MAX CONCURRENT: 2 toasts (queue, don't stack beyond 2)
```

---

# 10. Copywriting System

## 10.1 Voice & Tone

**Voice:** Calm, direct, specific. Like a knowledgeable friend, not a corporate chatbot.

**Anti-patterns to eliminate:**
- "We're preparing your request" → too passive
- "Unable to complete the request. Please try again." → vague
- "Booking requested" → corporate
- "Payment pending" → bank-speak
- "Couldn't load sessions / Check that the backend is running" → developer leak

**Tone per context:**
```
Waiting states  : Reassuring ("You're next.")
Live states     : Efficient ("8 min away.")
Success states  : Warm ("Done. You're all set.")
Error states    : Specific + actionable ("No experts nearby. Try again in a few minutes.")
Payment states  : Neutral + clear ("₹848 total. Pay when ready.")
Completion      : Warm + memorable ("Hope you feel better.")
```

---

## 10.2 Status-to-Copy Map (All States, All Surfaces)

### Customer Tracking States

```
AWAITING_PAYMENT:
  Hero headline : "Confirm to book"
  Subcopy       : "Pay to get an expert on the way."
  CTA           : "Pay ₹848"
  Cancel link   : "Cancel this booking"

CREATED:
  Hero headline : "Booking saved"
  Subcopy       : "We're getting things ready."
  (no CTA needed)

SEARCHING:
  Hero headline : "Finding someone nearby"
  Subcopy       : "Usually takes under 2 minutes."
  If ETA:       + "Experts about {eta} min away."
  Cancel link   : "Can't wait? Cancel"

ASSIGNED:
  Hero headline : "{eta} min away"    ← ETA IS the headline
  Subcopy       : "{name} is heading to you · {distance} km"
  Cancel        : hidden (only on expand)

IN_PROGRESS:
  Hero headline : [timer: 24:18]
  Subcopy       : "of 60 min booked"
  Pay banner    : "Pay ₹848 before your session ends."

COMPLETED:
  Hero headline : "Session complete."
  Subcopy       : "Wednesday, 21 Jun · 60 min"
  Receipt note  : "Hope you feel better."

CANCELLED (no_expert):
  Hero headline : "No one available"
  Subcopy       : "No experts were near you right now."
  Action        : "Try again later →"
  Refund note   : "You weren't charged."

CANCELLED (user):
  Hero headline : "Booking cancelled"
  Subcopy       : "You cancelled this booking."
  Action        : "Book again →"
```

### Customer App Toasts

```
CURRENT → BETTER:

cartAdded          : "Added to cart"   (was: "Order added to cart.")
cartRemoved        : "Removed"         (was: "Item removed from cart.")
bookingConfirmed   : "Booking confirmed"
bookingRequested   : "Booking saved — expert search starting"
paymentSuccess     : "Paid. Finding your expert…"
addressSaved       : "Address saved"
addressDeleted     : "Address removed"
profileSaved       : "Profile updated"
findingExperts     : "Looking for experts nearby…"

assignedToast      : "Expert assigned — {name} · {eta} min"  ← NEW (real-time)
sessionComplete    : "Session complete. Hope you feel better."  ← NEW
```

### Order Card Labels

```
CURRENT → BETTER:

awaiting_payment   : "Pay to start"      (was: "Payment pending")
created            : "Confirming…"       (was: "Booking requested")
searching          : "Finding expert…"   (was: "Finding expert")
assigned           : "~{eta} min away"   (was: "Expert assigned")
in_progress        : "Session running"   (was: "In progress")
completed          : "Done"              (was: "Completed")
cancelled          : "Cancelled"         (same)
```

### Expert App Copy

```
HOME SCREEN:
  Online  : "You're online — receiving jobs nearby."
  Offline : "You're offline."
  On job  : "You're on a job — finish before going offline."

OFFER MODAL:
  Title    : "New job"             (was: "New order")
  Earn     : "You'll earn ₹560"   (same, but amber highlight)
  Decline  : "Not now"            (was: "Decline" — softer)
  Accept   : "Accept"             (same)
  Expire   : "Offer expired"

ACTIVE ORDER STEPS:
  navigating  : "Head to the customer"
  arrived     : "You're here — ask for their start code"
  start_otp   : "Enter the start code"
  session     : "Session running"
  end_otp     : "Enter the end code"
  complete    : "Great work."

OTP:
  Start code prompt : "Ask {name} for their 4-digit start code."
  End code prompt   : "Ask {name} for their end code to finish."
  Error             : "Wrong code — ask the customer again."

COMPLETION:
  Header     : "Great work."
  Earn label : "You earned"
  CTA        : "Back to receiving jobs"
```

### Error Messages

```
NEVER:
  × "Unable to complete the request. Please try again."
  × "Something went wrong"
  × "Error 404"
  × "Check that the backend is running"
  × "An unexpected error occurred"

ALWAYS:
  ✓ Specific about what failed
  ✓ Tells user what to do
  ✓ Human tone

ERROR MAP:
  Network error       : "Can't reach the server. Check your connection."
  Session not found   : "This session isn't available anymore."
  Address missing GPS : "We need a precise location. Tap to update."
  Payment failed      : "Payment didn't go through. Try a different method."
  OTP wrong (expert)  : "Wrong code — ask the customer again."
  OTP wrong (customer): "That code didn't work. Try again."
  Booking failed      : "Couldn't save your booking. Try again."
  Expert offline      : "Your expert went offline. We're finding another."
  Offer expired       : "That offer expired. Another may come soon."
  Location denied     : "Location access needed to find nearby experts."
  Socket disconnect   : "Connection lost — trying to reconnect…"
  No experts          : "No one available nearby right now. Try in a few minutes."
```

---

# 11. Accessibility & Responsiveness

## 11.1 Accessibility Requirements

```
WCAG 2.1 AA compliance minimum. Targets AA+.

COLOR CONTRAST:
  Primary text on white:   Slate-900 on white = 16.5:1 ✓
  Secondary text on white: Slate-600 on white = 5.8:1 ✓
  Muted text on white:     Slate-400 on white = 3.2:1 (large text only)
  White on Forest-900:     21:1 ✓
  Forest-500 on white:     4.6:1 ✓ (meets AA)
  
  All interactive elements: min 4.5:1

TOUCH TARGETS:
  Minimum: 44×44px (Apple HIG + WCAG 2.5.5)
  Expert app: 56×56px minimum
  Buttons: always minimum 44px height
  Nav items: 48px height minimum

FOCUS INDICATORS:
  Custom focus ring: 3px Forest-500, offset 2px
  Never remove outline: 0 without replacement
  Keyboard nav: full support on web
  Tab order: logical, matches visual order

ARIA:
  Cart count: aria-label="Cart, {n} items"
  Toggle: aria-checked, role=switch
  Modal: role=dialog, aria-modal, aria-labelledby
  Toast: role=status (success) / role=alert (error)
  Map: role=img, aria-label="Live tracking map"
  Status chip: aria-label="{status}"
  OTP input: aria-label="Digit {n} of 4"
  Timer: aria-live=polite, aria-atomic=true (updates on minute change only)
  Skeleton: aria-busy=true, aria-label="Loading…"

SCREEN READER:
  Maps: provide text alternative when map shown
    "Expert is 2.3 km away, estimated 8 minutes"
  Status changes: announce via aria-live
  Bottom sheets: announce when open (focus trap)
  Expert name: always in text form, not just avatar initial

REDUCED MOTION:
  @media (prefers-reduced-motion: reduce)
    All CSS transitions: 0ms
    All JS animations: disabled
    Shimmer: replaced by static grey block
    Confetti: disabled
    Counter animations: jump to final value
    Map: static view (no smooth pan)
```

## 11.2 Responsive Breakpoints

```
BREAKPOINTS:
  xs  : 320px  — smallest supported phone
  sm  : 375px  — iPhone SE / most Android base
  md  : 430px  — iPhone Plus / large Android
  lg  : 768px  — tablet portrait
  xl  : 1024px — tablet landscape / small laptop
  2xl : 1280px — desktop standard
  3xl : 1440px — wide desktop

LAYOUT BEHAVIOR:

CUSTOMER WEB:

Landing hero:
  xs-md  : single column, stacked
  lg+    : 2-column, text left / mockup right

Services grid:
  xs-sm  : 1 column
  md-lg  : 2 columns
  xl+    : 3 columns

Tracking page:
  xs-lg  : bottom sheet over map (mobile)
  xl+    : sidebar + full-map (desktop)

Cart drawer:
  xs-md  : bottom sheet (slides up)
  lg+    : right panel (slides in from right)

EXPERT APP (React Native — adapts to phone size):
  All layouts use flex, percentage widths
  OTP boxes: [screen width - 96px] / 4 per box
  Fonts: scaled with system font size (accessibilityFontScale)
  Touch targets: static 56px+ regardless of font scale

SAFE AREAS:
  All screens: safe area insets via SafeAreaProvider
  Bottom sheets: extra padding for home indicator (iOS)
  Dynamic island: top padding adjustment on iPhone 14 Pro+

KEYBOARD BEHAVIOR (web):
  OTP input fields: keyboard slides up, content scrolls
  Address form: bottom CTA moves above keyboard
  Implementation: CSS env(keyboard-inset-height) + scroll-into-view

LANDSCAPE MODE (mobile web):
  Tracking page: map takes right 60%, sheet takes left 40%
  (auto-adapts via window.matchMedia)
```

---

# 12. Implementation Notes

## 12.1 Critical Architectural Decisions

```
CUSTOMER WEB

1. BOOKING FLOW — MULTI-STEP SHEET
   Current: single modal (AddressBookingModal)
   Proposed: multi-step sheet (3 steps)
   
   Implement as: single component with step state
   URL: modal state in URL params (?book=1&step=2) for deep-link support
   
2. TRACKING PAGE — SOCKET HANDLING
   Status sequence: mount → fetch → subscribe socket
   On socket event: optimistic UI update → confirm with re-fetch
   
   State machine: use React Context + useReducer
   Actions: STATUS_CHANGE, EXPERT_LOCATION, PAYMENT_CONFIRMED
   
3. MAP COMPONENT
   Show only: mode === "live" OR mode === "address"
   Lazy load: map library (Leaflet ~150kb) only when needed
   Skeleton: show 260px grey block while map initializes
   
4. SKELETON LOADING
   Replace all spinner-loading with skeleton
   Skeleton renders same component tree with placeholder data
   
5. TOAST SYSTEM
   Centralize: one portal at app root
   Queue: max 2 concurrent
   Priority: error > warning > success > info

EXPERT APP

6. OFFER MODAL — WAKE SCREEN
   When offer arrives and app backgrounded:
   React Native: push notification with custom category
   Action buttons in notification: "Accept" | "Decline"
   (Requires APNs + FCM integration)
   
7. ACTIVE ORDER — LOCATION TRACKING
   Start tracking: on offer accept
   Stop tracking: on session complete
   Update interval: every 5s when navigating
   Battery optimization: increase to 15s interval on slow movement
   
8. DARK MODE
   Expert app: dark mode first (already designed above)
   Customer web: support system dark mode
   CSS: @media (prefers-color-scheme: dark) { [dark tokens] }
   React Native: useColorScheme hook
   
9. OFFLINE DETECTION
   Expert app: NetInfo library
   On disconnect: show persistent banner
   On reconnect: re-subscribe socket, refresh current screen
   Queue: don't show "connected" toast if was offline < 3s (brief flicker)

10. OTP INPUT
    Auto-advance: on each digit
    Auto-submit: when last digit entered (if in auto-detect mode)
    Paste: parse 4-digit string, fill all boxes
    Backspace: clear current, focus previous
```

## 12.2 Component Priority for Build

```
PHASE 1 — Tracking page (highest impact):
  1. BookingJourneyHero (state-aware, no redundant status)
  2. AssignedState (map + bottom sheet)
  3. InProgressState (timer dominant)
  4. CompletedState (receipt + celebration)
  5. Real-time toast system

PHASE 2 — Expert app:
  1. IncomingOrderModal (countdown ring)
  2. ActiveOrderScreen (step machine)
  3. OTP input component
  4. Home screen (online toggle hero)

PHASE 3 — Customer web:
  1. Multi-step booking sheet
  2. Redesigned landing page
  3. Redesigned order list
  4. Toast + skeleton system

PHASE 4 — Polish:
  1. Animations (state transitions)
  2. Haptic system
  3. Dark mode
  4. Reduced motion
  5. Accessibility audit
```

## 12.3 Performance Budget

```
Customer Web:
  LCP (Largest Contentful Paint): < 2.5s
  FID (First Input Delay): < 100ms
  CLS (Cumulative Layout Shift): < 0.1
  
  Bundle targets:
    Initial JS: < 150kb gzipped
    Map (Leaflet): lazy loaded, not in initial bundle
    Fonts (Fraunces): preload, subset latin only
    Images: WebP, lazy load below fold
    Skeletons: zero additional load (render in JS, no images)

Expert App:
  App launch to Home: < 2s
  Offer modal appear: < 300ms from socket event
  OTP verification response: < 1s (show optimistic UI immediately)
  Map initial render: < 1s (cached tiles)

Animations:
  All at 60fps minimum
  Use CSS transforms (not width/height/top/left)
  Use will-change sparingly (only for map animations)
  GPU-composite properties only: transform, opacity
```

---

## 12.4 What to Delete (Hard List)

```
CUSTOMER WEB:
  × PainPoints marquee section (landing)
  × TrustBar as separate section (merge into stats)
  × "How It Works" numbered-step section
  × WhySection (redundant)
  × SafetySection (merge into proof section)
  × Placeholder testimonials (delete entirely)
  × ExpertsSection from landing (separate /experts page)
  × brand.disclaimer from ServiceDetailPage (move to FAQ/checkout)
  × Avatar letter from OrderCard (not useful)
  × "Order added to cart." toast (too verbose)
  × SessionTimeline during assigned/in_progress states
  × Duplicate status badge in meta card (hero owns status)
  × "Live" chip from both hero AND meta card — pick one
  × `DashboardHomePage.jsx` orphan file
  × `ProfileCompleteModal.jsx` orphan (duplication)
  
EXPERT APP:
  × `JobsScreen` (legacy, not routed)
  × `JobScreen` (legacy, not routed)
  × `OfferModal` (legacy, replaced by IncomingOrderModal)
  × Default phone "+919000000005" hardcoded in LoginScreen
  × Alert dialogs (replace with bottom sheets + toasts)
  × "Contact ops@codebasemassage.com" hardcoded in Support
```

---

*End of Design Specification — Version 1.0*

*Next steps: Component library implementation → Design token CSS file → Figma component kit → Storybook stories → Accessibility audit → User testing on tracking screen state transitions*
