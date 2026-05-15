# Koosto / AlmaDiving Design System

> Design system for the **AlmaDiving** / **DiveWH** / **Koosto** B2B SaaS dive platform.

---

## Company & Product Context

**Koosto** is the B2B SaaS brand. Dive center operators pay for a dedicated **DiveWH** instance — its own Supabase database, Vercel deployment, and domain. The **AlmaDiving Hub** is shared infrastructure owning diver identity, certifications, affiliations, and licensing across all center deployments.

**Codebase:** `github.com/erqz0/divewh` (private — monorepo)
**Logo assets:** `assets/koosto-logo.png` (navy, light bg) · `assets/koosto-logo-white.png` (white, dark bg) · `assets/koosto-logo-ocean-deep.png` (ocean-blue, mid-tone bg)

---

## Products

### 1. DiveWH Web App (`apps/web/`)
React 19 + Vite + Tailwind CSS v4. Serves **two audiences at the same domain**:

| Audience | Routes | Feel |
|---|---|---|
| **Center Operators** (admin) | `/admin/*` | Nautical instrument panel — dense, data-rich, trust-first |
| **Divers** (end-users) | `/trips`, `/my-bookings`, `/dashboard` | Nautical Curator — editorial, spacious, warm cream |

### 2. Mobile App (`apps/mobile/`)
React Native + Expo SDK 55. **Diver-only** in V1. Screens: Home (identity card + trips + bookings), Trips list + detail + booking flow, Certifications, Profile, Courses.

### 3. AlmaDiving Hub (separate repo `HubAlmaDiving`)
Shared identity, cert, affiliation, licensing infrastructure. Hub admin app only. Not represented in this codebase.

---

## CONTENT FUNDAMENTALS

**Tone:** Professional but approachable. Concise and action-oriented. Not chatty. No filler text.

**Casing:**
- UI labels, nav items, buttons: Sentence case ("Book this trip", not "Book This Trip")
- Data chips/badges: ALL CAPS with tracking ("AOWD", "DM", "NX32")
- Section headers: Title case for major sections ("Upcoming Trips")
- Error messages: Sentence case, plain language

**Voice:** Direct and clear. Operator-facing copy reads like equipment labels — no ambiguity. Diver-facing copy is warmer but still concise. No marketing hyperbole in UI.

**Emoji:** Not used in UI. Reserved for operator-typed notes/messages only (e.g. "🌙 Night dive" in trip names typed by operators).

**Numbers:** Tabular monospace for all data readouts (times, counts, IDs, depths). Formatted with locale separators.

**i18n:** 5 languages (EN, FR, ES, DE, IT, PT, NL, JA, ZH). All strings via i18next. Never hardcode UI strings. Translations via DeepL API — never LLM translation.

**Examples of copy style:**
- "Find your dive center" (not "Connect with your diving community")
- "Add an emergency contact" (not "Stay safe — tell us who to call")
- "Payment due at center" (not "We'll handle billing at the dive shop")
- "Trip Full" / "Almost full" / "2 spots left" — direct capacity language

---

## VISUAL FOUNDATIONS

### Colors
Two-tier palette: **Ocean** (primary authority) + **Surface** stack (depth via tonal layering).

**Surface stack** (depth through background shifts, not shadows):
- `surface-0` `#f7f5f0` — page background, warm sand. Reduces eye strain for all-day use.
- `surface-1` `#ffffff` — cards, panels, primary containers
- `surface-2` `#f0ede6` — panel headers, hover states, sidebar
- `surface-3` `#e8e4db` — borders, dividers, input backgrounds
- `surface-mid` `#efeee9` / `surface-high` `#e9e8e3` — deep nesting

**Ocean palette:**
- `ocean-900` `#0a2540` — headings, high-emphasis (pure black is never used)
- `ocean-700` `#1a3a5c` — secondary text, labels
- `ocean-500` `#2563a8` — primary actions, links, active states
- `ocean-400` `#3b82c6` — hover states
- `ocean-100` `#dbeafe` — selected backgrounds, info badges
- `ocean-50` `#eff6ff` — subtle highlights
- `ocean-deep` `#003567` — premium gradient CTAs (diver-facing only)
- `ocean-deep-light` `#034c8e` — gradient end

**Status:** `safety-green` / `amber-alert` / `red-critical` — operational meaning only, never decorative.

**Accent:** `accent-teal` `#0d9488` — Nitrox gas blends, specialty certs only.

### Typography
Four font roles, all self-hosted in production (`apps/web/public/fonts/`):
- **Manrope** (`font-ui`) — Admin headers, workspace row names (800 extrabold for names)
- **Inter** (`font-body`) — Body text, labels, form fields, badges — the default
- **Space Grotesk** (`font-display`) — Diver-facing section headers (not yet self-hosted, falls back to Manrope)
- **Switzer** (`font-reader`) — Course content, long-form reading
- **System mono** (`font-mono`) — Data: times, IDs, counts, depths, tank volumes

Scale runs from `display-lg` (56px/700) down to `caption` (10px/700 uppercase).

### Backgrounds
Warm cream `surface-0` as the base everywhere. No full-bleed hero images in the codebase (image CDN via Cloudinary, but no fixed brand imagery). No gradient backgrounds on content areas. No decorative gradients on admin CTAs (flat `ocean-500` only). Diver-facing CTAs use `ocean-deep → ocean-deep-light` gradient at 135° on pill-shaped buttons.

### Animation
Minimal. Button press: `translateY(-1px)` lift on hover, `translateY(0)` on active — 150ms `ease-out`. Card flip: opacity cross-fade at 300ms (no 3D rotation — avoids React Native perspective quirks). No bounces. No spring animations in the web admin — this is instrument-panel territory.

### Hover & Press States
- **Admin buttons (primary):** `bg-ocean-400` + `-translate-y-1px` hover; `translate-y-0` active
- **Admin rows:** `hover:bg-surface-0` (subtle surface shift, no border added)
- **Ghost buttons:** `hover:bg-surface-2`
- **Diver CTA pills:** `opacity-90` hover, no translate

### Borders
**Admin:** Required. Borders are structural scan-path guides ("like grid lines on a dive computer"). `border-surface-3` on tables, panels, inputs. Never skip borders in admin.

**Diver-facing (web + mobile):** No 1px line rule. Define sections via background color shifts only. Exception: ghost border `rgba(232,228,219,0.15)` when two same-background containers must separate.

### Shadows
Sparse. Tonal layering (surfaces) does the heavy lifting. Shadows used only when floating is needed:
- Level 2 (raised): `0 1px 2px rgba(10,37,64,0.06)`
- Level 3 (modals): `0 4px 12px rgba(10,37,64,0.10)`
- Level 4 (floating): `0 8px 32px -4px rgba(3,76,142,0.12)` — ocean-deep tint

### Corner Radii
- Chips (admin data codes): `border-radius: 4px` (`rounded`) — rectangular, signals "encoded data"
- Buttons (admin): `rounded-lg` (8px)
- Buttons (diver primary CTA): `rounded-full` (pill)
- Cards, modals, panels: `rounded-lg` (8px) / `rounded-xl` (12px) for mobile cards
- Badges (diver): `rounded-full` (pill)

### Cards
**Admin:** `bg-surface-1 border border-surface-3 rounded-lg` + header strip `bg-surface-2`. No shadow — tonal layering suffices.
**Mobile:** `backgroundColor: #fff, borderRadius: 12, shadow*: small` — slight shadow since no border.

### Glassmorphism
Used only on floating elements: modals, Focus Bar (trip selection bar), realtime toasts, sticky scroll headers.
- Light glass (diver/modal): `rgba(247,245,240,0.82)` + `blur(24px)` + `border: rgba(232,228,219,0.40)`
- Dark glass (admin Focus Bar, course headers): `rgba(10,37,64,0.95)` + `blur(12px)` + `border: rgba(255,255,255,0.10)`

### Imagery
Cloudinary CDN. No fixed brand illustrations or stock photos in the codebase. Profile photos validated client-side with face-api.js (exactly one face). Trip card headers use `ocean-700` navy backgrounds with white text — no imagery required.

### Color vibe of imagery
Warm, nautical. When operators upload trip imagery, it should feel like dive magazine photography — light-filled blues, warm skin tones, honest underwater documentation. No heavy filters.

---

## ICONOGRAPHY

**System used:** `@expo/vector-icons` → **Ionicons** in the mobile app. This is the primary icon system.

**Web app:** No icon font in use. Inline SVGs used for specific icons (spinner, close, checkmark in modal/button). No Lucide, no Heroicons library — icons are written inline where needed.

**CDN link for design tooling:**
```html
<link rel="stylesheet" href="https://unpkg.com/ionicons@7.4.0/dist/css/ionicons.min.css">
```
Or load via the Ionicons script:
```html
<script type="module" src="https://unpkg.com/ionicons@7.4.0/dist/ionicons/ionicons.esm.js"></script>
```

**Common icons used in the app:**
- `information-circle-outline` — card flip / info reveal
- `arrow-back-outline` — back navigation
- `checkmark-circle` — cert verified
- `phone-portrait-outline`, `logo-whatsapp`, `mail-outline` — contact info
- `chevron-forward`, `chevron-back` — navigation arrows

**Web admin SVGs:** Hand-rolled inline. Checkmark (certification verified), X (close), spinner (loading state). See `Button.tsx` for spinner SVG.

---

## ADMIN APP SHELL (v1.3 · 2026-05)

Every admin screen renders inside a **three-zone grid** on a `surface-2` page. Each zone is a rounded floating card — no full-bleed walls.

```
┌──────┬──────────────┬──────────────────────────────────────────────┐
│      │              │  Topbar  [⇆] Breadcrumb  [ ⌕ Search ⌘K ]  ⟲ ✉ 🔔 ⌄ │
│ Rail │  Subpanel    ├──────────────────────────────────────────────┤
│ 76px │  232px       │                                              │
│      │  collapsible │  Content                                     │
│      │              │                                              │
└──────┴──────────────┴──────────────────────────────────────────────┘
```

**Zone 1 — Rail** (76px, always visible). Dark navy gradient `ocean-deep → ocean-deep-light`, 16px radius. Icon-only section buttons (Dashboard / Members / Planning / Bookings / Equipment / Settings…). Active state: 10% white fill + a 3px × 22px white tab marker bleeding into the gutter at `left: -10px`. Tooltips appear on hover at `calc(100% + 16px)`.

**Zone 2 — Subpanel** (232px, collapsible to 0). `surface-1` card with sectioned text nav for the active rail section. Header (Manrope 700 15px title + Inter 12px subtitle) → labelled section groups → bottom promotional card with the `ocean-deep` gradient (the only place that gradient appears in admin chrome). Collapsing animates the grid column over 200ms. When collapsed, the topbar breadcrumb leads with the section name so context is never lost.

**Zone 3 — Main** (flex 1). 56px topbar (subpanel toggle · breadcrumb · omnisearch · actions · profile) over a scrolling content card. Both inside one `surface-1` rounded container.

**Omnipresent search.** The search bar lives in the topbar on **every** admin screen — never behind a slash key or a modal. `⌘K` focuses from anywhere; `Esc` closes. Inline dropdown of grouped results (Members / Trips / Pages / Settings) with `<mark>` query highlight in amber, square 8px-radius avatar tiles (not circles — this is admin), and a filter footer. Inline (not modal) so the operator never loses spatial context while jumping between a member, a trip and a setting.

**Full specification, rationale and CSS:** see `system.md → "Admin App Shell (rail + subpanel + topbar) — v1.3"`. The earlier two-tier `dark-navy-top-nav + sub-nav` chrome documented in `system.md → "Admin Page Chrome (Fixed Structure)"` is **superseded** and kept only for historical reference.

### Planning Overview — new patterns to reuse

The Planning Overview rebuild introduces four reusable patterns. Don't reinvent these elsewhere — apply them.

- **Day tag pills (Today / Tomorrow / Past).** Chunky uppercase Manrope-800 13px pills, 5px radius, 0.12em tracking. `day-tag-amber` (TODAY, `--amber-alert` fill, white text) · `day-tag-ocean` (TOMORROW, `--ocean-900` fill, white text) · `day-tag-neutral` (PAST, `surface-2` fill, ocean-700 text). The triad encodes **act / prepare / review**. Reuse anywhere that ordering applies (period selectors, course cohorts).
- **Tank pills.** `surface-2` background, 5px radius. Count first (`22×` in Manrope 800) then gas/volume code (`Air 12L` in Manrope 600 at 0.85 opacity). Sibling `+N spare` chip uses `amber-alert-bg` — spares are buffer, not alarms.
- **Equipment pills (BCD / REG / FINS / SUIT / MASK).** Two stacked pieces: tiny Manrope-800 8.5px kind tag at 0.6 opacity + Manrope-600 ID. Three lifecycle states: **assigned** = solid `ocean-50` fill + solid `ocean-100` border; **draft** = transparent fill + **dashed** `ocean-100` border (universal "tentative" stroke); **unassigned** = not rendered at all (absence + the diver status indicator carries the meaning).
- **Diver gear status (3 states, pulsing orange).** 22×22 rounded square at the start of every diver row. **Green-check** = all gear set · **Amber-stripes** = partial/draft · **Orange-?** = not set and/or sizing data missing, with a 1.6s `box-shadow` ring pulse to demand attention. Hover lifts 1px. The pulse is reserved for the **blocker** state only — amber doesn't pulse because it's "review before depart", orange pulses because it's "you literally can't continue until you fix this". Codifies the system's semantic ladder: **red = safety · orange = blocker · amber = attention · green = clear.**

Full CSS, markup, and "where to apply next" guidance lives in `system.md → "v1.3 Patterns (Planning Overview)"`.

---

**Emoji:** Not used as icons. Operators can type emoji in trip names (🌙 Night dive) — these appear as data, not UI chrome.

**No brand illustrations.** The system uses data readouts, status badges, and color coding to communicate state — not decorative illustrations.

---

## File Index

```
/
├── README.md                        ← this file
├── colors_and_type.css              ← CSS vars for all colors + typography scale
├── SKILL.md                         ← agent skill configuration
│
├── assets/
│   ├── koosto-logo.png              ← Koosto wordmark — navy, for light backgrounds
│   ├── koosto-logo-white.png        ← Koosto wordmark — white, for dark backgrounds (rail, headers)
│   └── koosto-logo-ocean-deep.png   ← Koosto wordmark — ocean-blue, for mid-tone backgrounds
│
├── preview/
│   ├── colors-surface.html          ← Surface stack color swatches
│   ├── colors-ocean.html            ← Ocean palette swatches
│   ├── colors-status.html           ← Status + accent color swatches
│   ├── type-scale-admin.html        ← Admin typography scale (Manrope + Inter)
│   ├── type-scale-diver.html        ← Diver typography scale (Space Grotesk + Inter)
│   ├── type-specimens.html          ← Real text specimens in context
│   ├── spacing-tokens.html          ← Spacing, radii, shadow tokens
│   ├── elevation-system.html        ← Tonal layering + glassmorphism
│   ├── buttons-admin.html           ← Admin button variants + states
│   ├── buttons-diver.html           ← Diver-facing pill CTAs
│   ├── badges-chips.html            ← Badges, chips, status indicators
│   ├── form-fields.html             ← Input, select, form field states
│   └── cards-patterns.html          ← Card, pax row, focus bar patterns
│
├── ui_kits/
│   ├── web-admin/
│   │   ├── README.md
│   │   └── index.html              ← Admin dashboard interactive prototype
│   ├── web-diver/
│   │   ├── README.md
│   │   └── index.html              ← Diver trips/bookings portal prototype
│   └── mobile/
│       ├── README.md
│       └── index.html              ← Mobile app prototype (iOS frame)
```
