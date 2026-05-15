# AlmaDiving Design System

---

## ⚡ Context Quick Reference

**Read this first.** This project has two distinct design contexts. Identify which one applies before writing any code or making any design decision.

### When designing ADMIN screens (`/admin/*` — operator-facing)

```
Intent:     Dive center operator at a tablet. Organizing trips, assigning guides, validating certs.
            Speed and trust above all. Dense, scannable, no ambiguity.
Feel:       Nautical instrument panel. A dive computer. Clear readouts, professional equipment.
Typography: Headers → Manrope (font-ui). Body/labels → Inter (font-body). Data → system mono.
Palette:    ocean-500 (#2563a8) primary actions. surface-0/1/2/3 for depth. Status colors for signals.
Depth:      Tonal layering + borders. Borders are VALID and REQUIRED in tables, drag zones, form fields.
Surfaces:   surface-0 page → surface-1 panels → surface-2 headers → surface-3 dividers.
Spacing:    4px base. p-4 component, gap-4 card, gap-6 section.
Buttons:    rounded-lg standard. ocean-500 fill primary. NO pill shape. NO gradient CTAs.
Glass:      ONLY on floating elements: modals, Focus Bar, realtime toast. NOT on panels or cards.
```

### When designing DIVER-FACING screens (`/trips`, `/my-bookings`, `/dashboard`, mobile)

```
Intent:     Diver browsing trips or checking bookings. Mobile-first, casual context.
            Feels like a premium dive magazine — editorial, spacious, curated.
Feel:       Nautical Curator. Light-filled, warm cream, expansive whitespace.
Typography: Section headers → RealistNarrow (font-display). Body/labels → Inter (font-body).
Palette:    ocean-deep (#003567) for CTAs. surface-0 warm cream base. Same status colors.
Depth:      No-line rule. Define sections via background shifts — NOT 1px borders.
Surfaces:   Same surface-0/1/2/3 tokens, but borders replaced by background contrast.
Spacing:    More generous. Increase one scale step vs admin when in doubt (gap-6 vs gap-4).
Buttons:    rounded-full pill shape for primary CTAs. Gradient: #003567 → #034c8e at 135°.
Glass:      Floating headers, modals, sticky nav, hero overlays. More liberal use than admin.
```

---

## 🚫 Hard Rules

These are absolute. They override any general design principle.

**Never do in admin:**
- Pill-shaped buttons — rounded-lg only
- Gradient CTAs — flat ocean-500 fill only
- No-line rule — borders are required for scanability
- Pure black text — use ocean-900 (#0a2540)
- Glassmorphism on non-floating elements (panels, cards, sidebar)

**Never do in diver-facing:**
- 1px solid borders to section content — use background shifts
- Dense row layouts — maintain generous spacing
- Square/rectangular buttons for primary CTAs — use pill shape

**Never do in either context:**
- Arbitrary hex values outside the defined palette
- Mixing depth strategies (borders AND shadows on the same element)
- External font CDN — all fonts self-hosted under `apps/web/public/fonts/`
- `font-display: block` — always use `font-display: swap`
- Adding new accent colors — the palette is closed (ocean, teal, status only)
- Pure black (#000000) anywhere
- Left-border active indicators on nav items (border-left: 2px) — removed from both admin and diver contexts; active state uses background shift only

---

## Intent

**Who:** Two distinct audiences sharing infrastructure:
- **Dive center operators, instructors, divemasters** — use the admin dashboard on tablets at the dive shop and phones on the boat. Need speed, clarity, trust.
- **Divers (end users)** — browse trips, manage bookings, track certifications via user-facing pages and mobile app. Expect a polished, editorial experience.

**What they do (admin):** Organize dives, validate certifications, brief staff, track students, manage equipment.

**What they do (diver):** Discover trips, book dives, view certifications, track dive history.

**Feel (admin):** Nautical instrument panel. Confident, calm, high-contrast. Like a dive computer — clear readouts, no ambiguity, professional equipment you trust your life to.

**Feel (diver-facing):** Nautical Curator. Editorial, premium, light-filled. Like a well-designed dive magazine brought to life — expansive whitespace, curated hierarchy, warm cream tones.

---

## Typography

All fonts are **self-hosted** under `apps/web/public/fonts/` via `@font-face` with `font-display: swap`. No CDN dependency.

### Font Roles

| Role | Font | Context |
|------|------|---------|
| **Section headers** (diver-facing) | Space Grotesk | `/trips`, `/my-bookings`, `/dashboard`, diver gallery pages |
| **Section headers** (admin) | Manrope | `/admin/*` — all operator-facing panels, tabs, group headers |
| **Body & labels** (both) | Inter | All body text, labels, form fields, badges, metadata |
| **Course/long-form reading** | Switzer | Course content, long descriptions, briefing text |
| **Data readouts** | System mono | Times, counts, dive IDs, tank numbers, depths |

### Implementation Notes

- **Current state (2026-03-20):** Inter is the **active default body font** (`body` in `index.css`). Manrope is self-hosted and active via the `.font-ui` CSS class and `--font-ui` Tailwind token. Switzer is the reader font. Merriweather Sans remains declared as `@font-face` for legacy compatibility but is no longer the default — it can be retired once confirmed unused.
- RealistNarrow is **self-hosted** (`fonts/RealistNarrow.otf`) and is the **primary display font** for diver-facing section headers. Space Grotesk is the fallback.
- Manrope 800 (ExtraBold) is **self-hosted** (`fonts/Manrope-ExtraBold.ttf`) — used for workspace row names (`font-weight: 800`). No CDN dependency.
- **Data readouts use Inter with `font-variant-numeric: tabular-nums`** — not system monospace. `--font-mono` maps to Inter for product UI. SF Mono / Fira Code reserved for code blocks only.
- Tailwind tokens: `font-ui` → Manrope (admin headers, active), `font-body` → Inter (body, active default), `font-reader` → Switzer (course content), `font-mono` → system mono.
- Admin pages apply `font-ui` at the layout root or per-heading. Diver pages use `font-body` as default.
- **Loaded files:** `apps/web/public/fonts/manrope/` (400/500/600/700 woff2), `apps/web/public/fonts/inter/` (400/500/600/700 woff2).

### Named Scale

Use this scale consistently. Never use arbitrary sizes outside it.

| Level | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `display-lg` | 3.5rem (56px) | 700 | Space Grotesk / Manrope | Hero numbers, large stats (diver dashboard totals) |
| `display-sm` | 2.25rem (36px) | 700 | Space Grotesk / Manrope | Page heroes, section anchors |
| `headline` | 1.5rem (24px) | 600 | Space Grotesk / Manrope | Section headers ("Upcoming Trips", "Your Certifications") |
| `title-lg` | 1.125rem (18px) | 600 | Inter / Manrope | Card titles, panel headers |
| `title-sm` | 1rem (16px) | 600 | Inter | Sub-section titles, modal headers |
| `body` | 0.875rem (14px) | 400 | Inter | Default body text, row content |
| `label` | 0.75rem (12px) | 500 | Inter | Badges, form labels, metadata |
| `caption` | 0.625rem (10px) | **700** | Inter/Manrope | Data chips: cert, gas, gear, style — **always uppercase + tracking-wide** |
| `mono-data` | 0.875rem (14px) | 700 | System mono | Times, IDs, counts, tank volumes |
| `row-name` | 0.8125rem (13px) | **800** | Manrope (font-ui) | Primary identifier in workspace rows (name) — extrabold, full ocean-900 |
| `row-meta` | 0.6875rem (11px) | 400 | Inter | Secondary row text (role, count, subtitle) — thin, ocean-400 |

---

## Palette

### Foundation Surfaces

The surface stack defines depth through background shifts — no heavy shadows. The cream-warm base reduces eye strain for all-day use.

```
surface-0    #f7f5f0   Page background (warm sand)
surface-1    #ffffff   Cards, panels, primary containers
surface-2    #f0ede6   Secondary surfaces, panel headers, hover states
surface-3    #e8e4db   Borders, dividers, input backgrounds
```

**Extended tonal stack** (from Stitch design system — additive, for elevated contexts):
```
surface-mid  #efeee9   Between surface-2 and surface-3 — nested card headers
surface-high #e9e8e3   Deepest nested surface before border territory
```

These extended tokens appear in contexts where 3 levels of nesting are needed — e.g., a card header inside a panel inside a modal.

### Ocean (Primary)

```
ocean-900   #0a2540   Abyss — headings, high-emphasis text
ocean-700   #1a3a5c   Deep water — secondary text, labels
ocean-500   #2563a8   Mid-depth — primary actions, links, active states
ocean-400   #3b82c6   Surface shimmer — hover states
ocean-100   #dbeafe   Shallows — selected backgrounds, info badges
ocean-50    #eff6ff   Surface light — subtle highlights, active row backgrounds
```

**Deep primary** (from Stitch — for premium CTAs and gradient buttons):
```
ocean-deep        #003567   Deep sea — authority primary (deeper than ocean-500)
ocean-deep-light  #034c8e   Deep sea lit — gradient end / container
```

Use `ocean-deep` only for high-authority surfaces: primary gradient CTAs, the Focus Bar accent, modal headers. Regular actions use `ocean-500`.

### Status

```
safety-green      #16a34a   Verified, completed, autonomous, own gear
safety-green-bg   #dcfce7
amber-alert       #d97706   Attention, pending, teaching trips, day-off conflicts
amber-alert-bg    #fef3c7
red-critical      #dc2626   Danger, rejected, action required
red-critical-bg   #fee2e2
```

### Accents

```
accent-teal      #0d9488   Nitrox blends, specialty certs, secondary actions
accent-teal-bg   #ccfbf1
```

### Dark mode — token inversion rules

In dark mode (`[data-theme="dark"]` on `.app`) several text/heading tokens **invert their luminance** to stay readable. This is the source of every dark-mode regression we've shipped — get this rule right and the rest of the system follows.

**The invertible tokens (light value → dark value):**

| Token | Light | Dark | Semantic meaning |
|-------|-------|------|------------------|
| `--ocean-900` | `#0a2540` | `#f1f5fa` | High-emphasis text / headings |
| `--ocean-700` | `#1a3a5c` | `#c5d4e6` | Secondary text / labels |
| `--ocean-50` / `--ocean-100` | very light blues | translucent ocean tints | Selected-row backgrounds |

**The fixed tokens (same dark blue in both modes):**

| Token | Light | Dark | Use for |
|-------|-------|------|---------|
| `--ocean-500` | `#2563a8` | `#3b82c6` | Primary action color (mid-blue stays mid-blue) |
| `--ocean-deep` | `#003567` | `#1a4d8e` | Dark stamps, gradients, inverse surfaces |
| `--ocean-deep-light` | `#034c8e` | `#2e6bb0` | Gradient endpoint paired with `--ocean-deep` |
| Status colors (`amber-alert`, `safety-green`, `red-critical`) | fixed | fixed | Meaning never changes |

#### Hard rule — never use an invertible token as a background under fixed-color content

```css
/* ❌ BROKEN in dark mode — bg becomes light, white text disappears */
.day-tag-ocean { background: var(--ocean-900); color: white; }
.tooltip       { background: var(--ocean-900); color: white; }

/* ✅ Correct — fixed dark blue under fixed white content */
.day-tag-ocean { background: var(--ocean-deep);  color: white; }
.tooltip       { background: var(--ocean-deep);  color: white; }
```

If the element is **brand-fixed** (the app icon ground, the rail logo K) and must look identical regardless of theme, hard-code the literal hex `#0a2540` — *don't* use `var(--ocean-900)`. Brand identity is theme-independent; tokens are not.

If you need to keep the historical light-mode look unchanged (e.g. the `.day-tag-ocean` pill was already a very dark navy stamp), add a `[data-theme="dark"]` override instead of swapping the base color:

```css
.day-tag-ocean { background: var(--ocean-900); color: white; }
[data-theme="dark"] .day-tag-ocean { background: var(--ocean-deep); }
```

#### Audit checklist (apply when adding a new component)

1. Does any rule use `background: var(--ocean-900)` (or `--ocean-700`, `--ocean-50`, `--ocean-100`) with hard-coded `color: white` / `#fff` on top? → fix per above.
2. Does any rule use `border: 1px solid var(--ocean-900)` to draw a dark outline? → use `var(--ocean-deep)` or a literal.
3. Does a custom illustration / SVG embed a hex that should follow theme? → expose it via `currentColor` and let the parent set color via a token.
4. Open the prototype, toggle dark mode, walk every state of the new component. The bug always surfaces on one specific element — find it before review.

---

## Depth & Elevation

### Tonal Layering (primary system)

Depth is created by stacking surface tokens — not by shadow intensity. Think sheets of fine paper stacked on a desk.

```
Page             surface-0  (#f7f5f0)   — base, never a card
Section wrapper  surface-2  (#f0ede6)   — panel background, sidebar, header
Card             surface-1  (#ffffff)   — primary container, lifts off the page
Card header      surface-2  (#f0ede6)   — header strip within a card
Nested element   surface-mid (#efeee9)  — inner card or row within a card
```

### Shadow scale (supplementary)

Shadows are used sparingly — only when tonal layering alone doesn't communicate floating.

```
Level 1  (cards)      none — tonal layering handles it
Level 2  (raised)     0 1px 2px rgba(10,37,64,0.06)
Level 3  (modals)     0 4px 12px rgba(10,37,64,0.10)
Level 4  (floating)   0 8px 32px -4px rgba(3,76,142,0.12)   ← ocean-deep tinted
```

Level 4 uses an `ocean-deep` tint (`#034c8e` at 12% opacity) rather than black, which creates a cohesive nautical feel instead of a generic shadow.

### No-Line Rule (elevated contexts)

In high-information-density panels where traditional borders create noise, define boundaries through **background shifts only** — no `border` property. Apply this rule in:
- Diver-facing pages (trips gallery, dashboard)
- Modals and drawers
- Focus Bar (trip summary bar in Organization tab)

**Do not apply in:** Admin tables, form fields, drag-drop zones — these need border definition for clarity.

### Ghost Border (same-surface fallback)

When two containers share the same background color and neither can shift, use a ghost border:
```css
border: 1px solid rgba(232, 228, 219, 0.15);  /* surface-3 at 15% opacity */
```
It is felt rather than seen — used only as a last resort.

---

## Glassmorphism

For **floating** elements that sit above scrollable content. Creates depth and visual separation without blocking context.

### When to use

| Element | Use glassmorphism |
|---------|------------------|
| Focus Bar (trip selected bar, Organization tab) | Yes — floats above the 3-column layout |
| Modals | Yes — sits above page content |
| Realtime toast | Yes — floating notification |
| Sticky panel headers (on scroll) | Yes — when content scrolls beneath |
| Regular panel surfaces | No — they are not floating |
| Inline cards | No |

### Recipe

```css
background: rgba(247, 245, 240, 0.82);  /* surface-0 at 82% opacity */
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(232, 228, 219, 0.40);  /* surface-3 at 40% */
```

**Browser support:** All modern browsers. `backdrop-filter` requires the element to be on top of rendered content — works correctly in fixed/sticky positioned elements and modals.

**Performance:** Acceptable on modern tablets and laptops. If jank is detected on older Android hardware, fall back to `background: rgba(247, 245, 240, 0.96)` (near-opaque, no blur).

---

## Iconography

The admin console ships its own custom glyph set — **not** Lucide, Feather, Heroicons, or Ionicons. Every `<Icon name="…" size={…}/>` in the admin app resolves to an inline SVG defined in **`design/icons.jsx`** (mounted into the React tree as `window.Icon`). The diver-facing app (`/trips`, `/my-bookings`, mobile) uses **Ionicons via the web-component** (`<ion-icon name="…">`) and that pairing is intentional — see "Context separation" below.

### The drawing contract (every glyph)

Every icon in `design/icons.jsx` is built on the **same five rules**. New glyphs MUST match all five or they will look foreign next to the existing set:

```
viewBox        "0 0 24 24"          ← 24×24 abstract canvas, never 16 or 32
fill           "none"                ← outline only, never filled shapes
stroke         "currentColor"        ← inherits color: from parent — never hard-code a color
strokeWidth    1.7                   ← thinner than Lucide (2.0), heavier than Feather (1.5)
strokeLinecap  "round"               ← every endpoint
strokeLinejoin "round"               ← every corner
```

The `<Icon>` component re-applies these props on every render — you only supply the path data:

```jsx
// In design/icons.jsx
const paths = {
  my_new_glyph: <><circle cx="12" cy="12" r="8"/><path d="M9 12h6"/></>,
  // …
};
```

**Why these specific values.** 1.7px stroke at 24px viewBox is the exact weight that holds up at every size we use it (11px → 18px) without the smaller sizes turning into mush or the larger sizes feeling too delicate next to Manrope's 700-weight headings. Round caps + round joins is what keeps the system feeling "engineered, not corporate" — the same hand the buttons and chips are drawn with. A 2.0 weight (Lucide's default) is too heavy at 11–12px and clashes with the 1px hairlines on chips and table dividers.

### Color behavior

Because every glyph uses `stroke="currentColor"`, the icon inherits the parent's `color`. This is why you'll see icons used inside chips, badges, buttons, and table cells without ever specifying a color on the `<Icon>` itself — the wrapper sets the color and the icon follows.

```jsx
// Correct — icon picks up the chip's amber color
<span className="chip chip-amber"><Icon name="bell" size={12}/> Pending</span>

// Wrong — hard-coding a color breaks dark-mode and re-themes
<Icon name="bell" size={12} style={{stroke: "#ea580c"}}/>
```

If you need to colorize an icon outside any parent that already sets color, wrap it in a span: `<span style={{color: "var(--red-critical)"}}><Icon name="x"/></span>`. Never pass `stroke` or `fill` overrides to `<Icon>`.

### Canonical size scale

Glyph sizes are tied to the size of the **container** they sit in, not to the size of the adjacent text. There are five canonical sizes; do not introduce in-between values.

| Size | Use cases | Pairs with |
|------|-----------|-----------|
| **`size={11}`** | val-strip squares, micro-pills (10px text), validation glyphs, dense table cells | 18×18 — 22×22 touch targets |
| **`size={12}`** | `btn-sm` icons, breadcrumb chevrons, chip glyphs, inline meta rows | 11–12px text, 24px button height |
| **`size={13}`** | Inline status hints ("Changes save automatically"), `btn-sm` with text, small section headers | 12px text |
| **`size={14}`** | `btn-md` icons (Save changes, Add base…), section-card action buttons | 13–14px text, 32px button height |
| **`size={16}`** | Subpanel nav rows, form-field affixes, large chip groups, `btn-lg` icons | 14px text, 36px+ row height |
| **`size={18}`** | Default — topbar action buttons, large CTAs, standalone glyphs | 15–16px text, 40px button height |

**Rule of thumb:** `glyph size = button height ÷ 2.3`. A 32px `btn-md` → 14px glyph. A 24px `btn-sm` → 12px glyph. A 40px topbar button → 18px glyph.

**Never** set size via CSS `width`/`height` on the rendered `<svg>` — pass the `size` prop. The component derives width, height, and stroke calibration from it; bypassing it produces icons with the wrong proportions.

### Inventory (60 glyphs, grouped by intent)

The current library covers the admin console's complete information architecture. Group names below are documentation conventions — they're not encoded in the component.

**Navigation & chrome** — used in the rail, subpanel, breadcrumb, topbar
`dashboard` · `users` · `book` · `equipment` · `calendar` · `bookings` · `finance` · `settings` · `home` · `panel_left` · `search` · `bell` · `message` · `moon` · `sun`

**Direction & flow** — chevrons, action arrows
`chevron_down` · `chevron_right` · `chevron_left` · `arrow_up_right`

**Object actions** — applied to rows, cards, forms
`plus` · `x` · `check` · `edit` · `trash` · `download` · `refresh` · `filter` · `sparkle`

**Operations domain** — diving-specific
`boat` · `map_pin` · `diving` · `tank` · `shirt` · `waves` · `tag` · `award` · `package`

**Identity & comms** — for people, contacts, files
`user` · `users` · `mail` · `phone` · `id` · `file` · `globe` · `key`

**Status & meta** — for warnings, info, security
`shield` · `lock` · `bolt` · `info` · `clock` · `activity`

**Data & layout** — for tables, charts, view toggles
`chart` · `trending` · `layers` · `grid` · `list` · `palette` · `branch` · `plug`

**Commerce** — finance, billing, payouts
`bank` · `receipt` · `finance`

### Chrome-specific assignments (must not drift)

The admin shell binds specific glyphs to specific zones. Frontend integration MUST use these exact names — if a developer can't find the right meaning in the table below, that's a signal to add a new glyph (see "Adding a new glyph"), not to substitute.

**Rail (Zone 1) — section buttons, top → bottom**

| Section | Glyph | Notes |
|---------|-------|-------|
| Dashboard | `dashboard` | Asymmetric 4-tile rect group |
| Members | `users` | Two figures, the back one offset |
| Planning | `calendar` | Plain calendar grid |
| Bookings | `bookings` | Clipboard with checkmark |
| Equipment | `equipment` | Wrench (single tool, not crossed) |
| Finance | `finance` | Dollar with stem |
| Settings | `settings` | Gear with 8 teeth |

Utility buttons at the bottom of the rail use `moon`/`sun` (dark-mode toggle) and `bell` (notifications). Help/docs uses `info`.

**Subpanel (Zone 2) — `subnav-item` rows.** Every row leads with a 16px icon. Glyph choice should match the **noun** the row represents: a "Bases" row uses `map_pin`, an "Auto-validation" row uses `check`, a "Cancellation policy" row uses `x`, etc. Avoid using the same glyph twice within a single subpanel — the eye uses icon shape, not label, to find the right row.

**Topbar (Zone 3)**

| Slot | Glyph | Size |
|------|-------|------|
| Subpanel toggle (leftmost) | `panel_left` | 14 |
| Omnisearch (inside input) | `search` | 15* |
| Refresh action | `refresh` | 16 |
| Messages | `message` | 16 |
| Notifications | `bell` | 16 |
| Profile chevron | `chevron_down` | 12 |

\* The omnisearch icon is the one exception to the canonical scale — it's 15px because the input is 40px tall and the search glyph reads better at the half-step than at 14 or 16. This is documented in "Omnisearch" above.

### Adding a new glyph

Follow this checklist when the existing inventory genuinely doesn't cover a new concept. Default to **reusing an existing glyph with a different label** before drawing a new one — the inventory is intentionally compact so operators can learn it.

1. **Confirm absence.** Search the inventory list above. `Ctrl-F` the file. 90% of the time the right glyph is already there under a name you didn't think to try.
2. **Draw on a 24×24 grid.** Keep the visual mass between `x=3, y=3` and `x=21, y=21` — leave a 3px breathing margin so the icon doesn't collide with adjacent text or borders at small sizes.
3. **Match the family.** Compare to 3–4 neighboring glyphs in the same intent group. Stroke weight, corner radius, and how much detail you include should feel like a sibling, not a cousin. If your glyph needs internal details, simplify until it doesn't — at 11px those details vanish anyway.
4. **Test at every size.** Render the glyph at 11, 12, 13, 14, 16, and 18px side by side. If 11px turns into a blob, the path is too complex; if 18px looks empty, the path is too sparse.
5. **No fills, no gradients, no embedded color.** A glyph that breaks the contract above is rejected at PR time — it will not match the rest of the system under dark mode, hover states, or theming.
6. **Use only `<circle>`, `<rect>`, `<line>`, `<path>`, `<polyline>`.** Avoid `<polygon>` (causes uneven corners at small sizes) and `<g>` wrappers (they're never necessary in 24×24 glyphs).
7. **Name it `snake_case`.** Match existing conventions: `map_pin` not `mapPin`, `chevron_right` not `chevronRight`, `arrow_up_right` not `arrow-up-right`. Names are nouns where possible (`receipt`, `boat`, `award`) and verbs only when the glyph is action-only (`download`, `refresh`, `edit`).
8. **Register it.** Add the entry to the `paths` object in `design/icons.jsx`, alphabetized within its intent group (comment groups are welcome — see the existing file).
9. **Document it.** Append the name to the corresponding row in the inventory above, with one sentence on its intended meaning. If the glyph is admin-shell-bound (rail or topbar), also update the chrome assignment table.

### What NOT to do

- **Don't substitute Ionicons in admin.** The `<ion-icon>` web-component is reserved for diver-facing screens. Using it in admin breaks the stroke-weight rhythm and ships an unnecessary 100KB+ runtime to the admin bundle.
- **Don't substitute emoji.** Emoji are platform-dependent, can't inherit `currentColor`, and clash with the stroke aesthetic. The one explicit exception is the day-tile weather glyph (🌧 ☀ ⛅) — that's tonal flavor, not UI iconography, and it lives in the diver-facing kit.
- **Don't introduce filled variants.** The system is single-style on purpose. If you need to communicate "active vs inactive" with the same glyph, use color (`ocean-500` vs `ocean-700`) or a chip background, not a filled twin.
- **Don't draw icons inline in feature code.** Every glyph belongs in `design/icons.jsx`. One-off inline SVGs accumulate inconsistencies and can't be re-themed centrally.
- **Don't resize via CSS.** Pass the `size` prop. `transform: scale()` blurs strokes; `width`/`height` on the SVG breaks the stroke calibration.
- **Don't pass `strokeWidth` overrides.** The 1.7 weight is calibrated for the whole scale. If a particular glyph looks too heavy at 11px, redraw it with less detail — don't thin the stroke.

### Context separation (admin vs diver-facing)

| Surface | Library | Why |
|---------|---------|-----|
| `/admin/*` (operator console) | Custom `<Icon>` from `design/icons.jsx` | Minimal, calibrated weight, no runtime cost, themeable via `currentColor` |
| `/trips`, `/my-bookings`, `/dashboard`, mobile web | `<ion-icon>` (Ionicons 7.4 via web-component) | Larger, more recognizable, consumer-friendly silhouettes — divers are not power users |

**Do not cross the streams.** An admin screen that imports `<ion-icon>` will fail design review. A diver-facing screen that imports `design/icons.jsx` will look austere and out of place.

### Frontend integration notes

- **Component path.** `design/icons.jsx` exposes `Icon` on `window` (see the end of the file: `window.Icon = Icon;`). When the frontend team migrates from the prototype to the production stack, this component should move to `src/admin/components/Icon.tsx` and be imported normally — the props API (`name`, `size`, `className`, `style`) is the public contract and should not change.
- **Tree-shaking.** Because every glyph lives in a single `paths` object, the current implementation is **not** tree-shakeable. For production, refactor to one file per glyph (`src/admin/icons/check.tsx`, etc.) with a barrel `index.tsx` — the API stays identical, but unused glyphs drop from the bundle.
- **TypeScript.** The `name` prop should be typed as `keyof typeof paths` so missing glyphs fail at compile time, not at render. Add a Storybook page that enumerates the inventory at every canonical size — this is the source-of-truth visual reference for the team.
- **Accessibility.** Icons are decorative by default. When an icon is the **only** content of a button (rail buttons, refresh, profile chevron), the button must carry an `aria-label`. The `<Icon>` itself should render with `aria-hidden="true"` — add this to the component when porting.

---

## Component Patterns

### Card

```
Container:   bg-surface-1 border border-surface-3 rounded-lg
Header:      px-4 py-3 border-b border-surface-3 bg-surface-2
Title:       text-base font-semibold text-ocean-900  (font-ui / Manrope admin, font-display / Space Grotesk diver)
Body:        p-4
```

### Form Field (Admin)

```
input / select / textarea:
  border border-surface-3/70 rounded-lg bg-surface-0
  focus:ring-2 focus:ring-ocean-500 focus:border-transparent
  text-ocean-900 placeholder-ocean-400

On surface-1 backgrounds (inline edit rows):
  Same but bg-surface-1, focus:ring-1

Rationale: border at 70% opacity lets the warm bg-surface-0 background
provide definition — less harsh than a full-opacity border, without removing
the border entirely (required for admin scanability per hard rules).

Vessel / boat select (exception):
  bg-ocean-100 instead of bg-surface-0
  Rationale: ocean-100 (#dbeafe) matches Stitch secondary_container (#c7e3ff),
  visually distinguishing the vessel field from free-text inputs. Signals
  "choose from a list" vs "type freely" at a glance.
```

### Button System

Buttons use a **depth shadow technique** — a subtle bottom shadow creates the illusion of the button sitting raised from the surface. On hover it lifts 1px; on active/press it returns to baseline. This gives buttons a physical "click into place" feel consistent with the nautical instrument panel metaphor.

**Size scale — strict 3 tiers, no exceptions:**

| Size | Height | Padding | Font | Radius | Usage |
|------|--------|---------|------|--------|-------|
| `sm` | ~30px | py-1.5 px-3 | 12px / 500 | 6px | Inline actions, table row buttons |
| `md` | ~36px | py-2 px-4 | 14px / 500 | 8px | Default for all main actions |
| `lg` | ~44px | py-2.5 px-5 | 15px / 500 | 8px | Auth pages, forms, hero CTAs |

**Variants:**

| Variant | Admin | Diver-facing |
|---------|-------|--------------|
| Primary | `bg-ocean-500` + depth shadow, rounded-lg | Not used |
| Secondary | `bg-surface-1 border-surface-3` + depth shadow, rounded-lg · active: `bg-surface-3` (neutral grey press, not warm surface-2) | Not used |
| Ghost | Flat, no shadow, hover:bg-surface-2, **active:bg-surface-3** | Not used |
| Danger | `bg-red-critical` + red-tinted shadow, rounded-lg | Not used |
| Diver CTA | Never used in admin | `ocean-deep → ocean-deep-light` gradient, `rounded-full` pill, opacity-90 hover |
| Text link | `text-ocean-500 hover:text-ocean-400 hover:underline underline-offset-2` · danger: `text-red-critical hover:#c52222` | Same |
| Icon | 32×32px, rounded-lg, ghost hover | Same |

**Focus rings:** `focus-visible:ring-2 focus-visible:ring-ocean-500/40 focus-visible:ring-offset-0` — no gap, keyboard-only.

**Transition:** `transition: all 150ms ease-out` — covers color, shadow, transform together.

**Shadow tokens (locked):**
```css
--btn-shadow-primary:        0 1px 0 0 rgba(26,58,92,0.25), 0 1px 3px 0 rgba(10,37,64,0.08);
--btn-shadow-primary-hover:  0 2px 0 0 rgba(26,58,92,0.25), 0 2px 6px 0 rgba(10,37,64,0.10);
--btn-shadow-primary-active: 0 0 0 0 transparent,           0 1px 2px 0 rgba(10,37,64,0.06);
--btn-shadow-secondary:      0 1px 0 0 rgba(232,228,219,0.8);
--btn-shadow-danger:         0 1px 0 0 rgba(153,27,27,0.35), 0 1px 3px 0 rgba(153,27,27,0.12);
```

### Reader (Course Content)

Switzer font, line-height 1.85 for medium body, 1.9 for large. Locked decisions:

| Role | Spec |
|------|------|
| Lesson title | Switzer 22px / 700 / tracking-tight / line-height 1.2 |
| Body small | Switzer 14px / 400 / line-height 1.8 |
| Body medium | Switzer 16px / 400 / **line-height 1.85** — key change from 1.625 |
| Body large | Switzer 18px / 400 / line-height 1.9 |

The jump from 1.625 → 1.85 is the single most impactful readability improvement. The reader must feel noticeably more breathable than the rest of the app.

### Badge

```
rounded-full px-2 py-0.5 text-xs font-medium
Status variants use status colors with -bg pair
Used in DIVER-FACING context only — pill shape is valid there.
```

### Chip (admin status/cert/role label)

Chips are **rectangular** — `border-radius: 4px` (`rounded`). Never pill/rounded-full in admin.

The shape signals "encoded data" vs "friendly tag". AOWD, DM, NITROX, INSTR are qualification codes, not social labels.

```
rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide
```

**font-bold (700), not font-medium (500).** Uppercase at small size loses contrast quickly — bold weight compensates and makes codes scannable at a glance. `font-medium` looked flat in practice; `font-bold uppercase` is the confirmed correct combination.

Color variants:
```
Cert (standard):   bg-surface-2 (#f0ede6)  text-ocean-700     ← neutral, data field
Cert (Nitrox/NX):  bg-accent-teal-bg        text-accent-teal   ← teal = non-standard gas
Role (INSTR, DC):  bg-ocean-100             text-ocean-500      ← blue = staff function
Status (DAY OFF):  bg-amber-alert-bg        text-amber-alert    ← amber = attention
Status (AVAILABLE): bg-safety-green-bg      text-safety-green
Neutral state:     bg-surface-mid (#efeee9) text-ocean-700
```

**Why not pill in admin:** Pill shapes (`rounded-full`) read as "consumer UI" — social tags, app chips, CTA buttons. In an admin tool, rectangular chips with small radius read as data identifiers, matching the dense instrument-panel aesthetic. Mixing pill chips into admin tables breaks the operator's cognitive mode.

### Data Readout

```
font-mono font-bold text-ocean-900
tabular-nums (font-variant-numeric: tabular-nums)
Used for: departure times, diver counts, tank numbers, dive IDs, depths
```

### Status Indicator

```
Small dot: w-2 h-2 rounded-full + label text-xs
Colors map directly to status palette
```

### Navigation Tabs (Admin top-nav / sub-nav)

```
Active:   text-white border-b-2 border-ocean-500    (top-nav)
          text-ocean-500 border-b-2 border-ocean-500 (sub-nav)
Inactive: text-white/55 hover:text-white/85          (top-nav)
          text-ocean-700 hover:text-ocean-900         (sub-nav)
```

### Sidebar Nav Items (Diver-facing)

```
Active:   color: ocean-500, background: ocean-50, font-weight: 600
          NO border-left indicator — removed. Background shift only.
Inactive: color: ocean-700, hover: background ocean-50, color ocean-900
```

No left-border active indicators anywhere in the product. Border-left was removed as a design decision — background shifts are the only active signal.

---

## Admin Page Chrome (Fixed Structure) — LEGACY (pre-v1.3)

> ⚠️ **Superseded by "Admin App Shell (rail + subpanel + topbar)" further down this file.** Kept here for historical context only — do not implement against this section. The current admin shell is a three-zone grid (icon rail · collapsible subpanel · topbar with omnisearch), not the two-tier dark-navy top-nav + sub-nav described below.

Every admin page shares the same outer shell. The content area varies by screen type (see next section).

```
┌──────────────────────────────────────────────────────────────┐
│  Top nav bar — dark navy                                     │  background: #0a2540 (ocean-900, inline style)
│  [AlmaDiving Admin ██] [Users] [Planning●] [Courses] [...]  │  Title: Manrope extrabold 18px white
│                                                              │  Active tab: white text + border-b-2 ocean-500
│                                                              │  Inactive tab: text-white/55 hover:text-white/85
├──────────────────────────────────────────────────────────────┤
│  Sub-nav tabs — sand/cream                                   │  bg-surface-1, border-b border-surface-3
│  [Tab A]  [Tab B●]  [Tab C]                                  │  Active: text-ocean-500 + border-b-2 border-ocean-500
│                                                              │  Inactive: text-ocean-700 hover:text-ocean-900
│                                                              │  Font: font-ui (Manrope) font-semibold text-[13px]
├──────────────────────────────────────────────────────────────┤
│  Context bar  (CONDITIONAL — workspace screens only)         │  Dark navy glassmorphism (see Focus Bar recipe)
│  Appears when an entity is selected. Dismissed on deselect.  │  Floats over content, not a static page header.
├──────────────────────────────────────────────────────────────┤
│  Content area                                                │  bg-surface-0 (#f7f5f0)
└──────────────────────────────────────────────────────────────┘
```

### Top Nav — Exact Specification

```
container:    background: #0a2540  (use inline style — Tailwind bg-ocean-900 may vary by build)
              no border-bottom (the color break is enough)
              px-6, flex items-center gap-8

app title:    font-ui text-[18px] font-extrabold text-white py-3
              (Manrope 800 — same weight family as row names, reads as authority)

tab button:   font-ui font-semibold text-[14px]
              py-3 px-3 border-b-2 transition-colors
active:       text-white border-ocean-500
inactive:     text-white/55 border-transparent hover:text-white/85

badges        (booking pending / waitlisted counts):
              rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
              pending:    bg-amber-alert text-white
              waitlisted: bg-ocean-400 text-white
```

### Sub-Nav — Exact Specification

```
container:    bg-surface-1 border-b border-surface-3
              px-6, flex space-x-1

tab button:   font-ui font-semibold text-[13px]
              py-2.5 px-3 border-b-2 transition-colors
active:       text-ocean-500 border-ocean-500
inactive:     text-ocean-700 border-transparent hover:text-ocean-900
```

### Design Rationale

**Two-tier contrast.** The dark navy top bar creates maximum separation from the page content below. The sand/white sub-nav (`surface-1`) acts as a visual bridge — darker than the page (`surface-0`) but lighter than the header. This three-tone stack (navy → sand → warm cream) reads as a clear hierarchy without any shadows or decorative borders.

**Consistent underline language.** Both nav levels use `border-b-2 border-ocean-500` as the active indicator. The same visual grammar applies to navigation tabs and content tabs elsewhere in the UI — operators learn one pattern.

**Manrope throughout nav.** `font-ui` (Manrope) is used for both the app title and all tab labels. Inter (`font-body`) is reserved for content. Navigation is chrome — it should feel distinct from data.

**No border on the top bar.** The ocean-900 → surface-1 color break is self-evident. Adding `border-b` would create visual noise at the most prominent edge of the UI.

---

## Admin Screen Types

Admin screens are not all the same. Identify which type you're designing before choosing layout, density, and heading levels.

### Type 1 — Workspace
*Multi-panel, drag-and-drop, real-time state. Operator is actively manipulating objects.*

Examples: Planning Organization, future Equipment Assignment, Staff Scheduling.

```
Layout:    2–3 fixed-width panels side by side, separated by borders.
           Each panel is independently scrollable.
Density:   Highest. Rows 34–36px. No generous whitespace.
Hierarchy: All 4 levels may appear. See Heading Hierarchy section.
Context bar: YES — shows the entity being organized (e.g. selected trip).
Borders:   Required as structural grid lines between panels and between rows.
```

### Type 2 — Data Table / List
*Flat or lightly grouped list of entities. Operator reads, filters, and acts on rows.*

Examples: Trips Manager, Users Hub, Equipment Inventory, Bookings list.

```
Layout:    Full-width table or card list. Toolbar (filters + actions) above.
Density:   Dense. Rows 38–42px (slightly taller than workspace — items are standalone).
Hierarchy: L1 (page title in toolbar area) + L3 (group header if grouped) + L4 (row).
           L2 section dividers only if rows are grouped into named categories.
Context bar: NO — use inline row actions or a slide-out drawer instead.
Borders:   Table borders on rows. Section group headers use surface-2 background.
```

### Type 3 — Dashboard / Overview
*Summary of state. Operator reads KPIs, spots issues, navigates to detail.*

Examples: Planning Dashboard, future Financial Summary.

```
Layout:    Card grid. Stat cards + summary tables + action shortcuts.
Density:   Medium. Cards with p-4 padding. Gap-4 between cards.
Hierarchy: L1 (card title, Manrope) + L4 (values, data readouts).
           L2 and L3 rarely needed — cards themselves provide the grouping.
Context bar: NO.
Borders:   Card borders (border-surface-3). Minimal internal borders.
Shadows:   Level 2 shadows acceptable on stat cards to lift them off surface-0.
```

### Type 4 — Form / Editor
*Structured input. Operator creates or edits a single entity.*

Examples: Trip edit modal, Add Group, Course editor, User profile form.

```
Layout:    Single column (modal) or two-column (full page).
           Fields grouped into sections with clear label headings.
Density:   Most spacious in admin. py-3 on fields (but not diver-facing generous).
           Gap-4 between field groups. Gap-2 between label and input.
Hierarchy: L1 (modal/section title, Manrope) + field labels (Inter 12px/500 ocean-700).
           L2/L3 only for multi-section forms with named groups of fields.
Context bar: NO — the form IS the focused context.
Borders:   Input borders required (see Form Field recipe). No row-grid borders.
```

---

## Page Skeleton (admin)

Every admin page is assembled from the same skeleton of chrome elements. This section is the **single canonical reference** — if it isn't listed here, it isn't part of the page chrome. When something feels off on a new page, the answer is almost always "we drifted from the skeleton"; fix the page, not the rule.

```
┌─ Topbar (chrome — defined once in the shell) ─────────────────────────┐
│  [⇆ toggle]  Section › Subsection           [ ⌕ Omnisearch ⌘K ]  ⟲ ✉ 🔔  [Profile ⌄] │
├───────────────────────────────────────────────────────────────────────┤
│  ┌─ .page-head ────────────────────────────────────────────────────┐  │
│  │  H1 page-title                                  [Page actions]  │  │
│  │  Page subtitle                                                  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Page body (cards, tables, workspace panels — see Screen Types)       │
│                                                                       │
│  ┌─ .page-foot (only when a table paginates) ───────────────────────┐ │
│  │  Showing 1–25 of 142          ← Prev   1 2 3 …   Next →   25 ▾  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

### Hard rules (apply to every admin page, no exceptions)

1. **Single breadcrumb.** The topbar breadcrumb (`Section › Subsection`) is the only location indicator. **Never** render a second breadcrumb above the page title. The topbar already says where you are; restating it inside the content is redundant, eats vertical space, and breaks the "topbar = chrome, content = work" mental model.
2. **One H1 per page.** `<h1 className="page-title">` lives inside `.page-head`, in the content area, never in the topbar. Manrope 800 / 26px / `ocean-900` / `letter-spacing: -0.02em`.
3. **Subtitle is mandatory.** `.page-sub` below the H1: Inter 13px / `ocean-700` / `opacity: 0.75`. One sentence, sentence case, no terminal period. States *what this screen is for*, not *what is on it*. Never empty.
4. **Actions on the right.** `.page-actions` is the only home for page-scoped controls (filters, density toggle, segmented view switcher, primary CTA). Right-aligned, `gap: 8px`. Maximum **one** `.btn-primary`; everything else is `.btn-secondary` or a `.seg`.
5. **No page-level icons in the heading.** Don't decorate the H1 with an icon. The rail and subpanel already carry the section glyph.
6. **No back button in the chrome.** Topbar breadcrumb + browser back are the only navigation back. Detail/edit screens get an explicit "Cancel" / "Done" pair inside the form, not a `<` in the topbar.

### .page-head — title + subtitle + actions

```jsx
<div className="page-head">
  <div>
    <h1 className="page-title">{title}</h1>
    <div className="page-sub">{subtitle}</div>
  </div>
  <div className="page-actions">
    {/* segmented · secondary · secondary · primary  — at most one primary */}
  </div>
</div>
```

| Token | Value |
|-------|-------|
| `.page-head` | `display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 20px;` |
| `.page-title` | Manrope 800 · 26px · `ocean-900` · `letter-spacing: -0.02em` · `margin: 0 0 4px` |
| `.page-sub` | Inter 13px · `ocean-700` · `opacity: 0.75` |
| `.page-actions` | `display: flex; gap: 8px;` — right-aligned by the `.page-head` flex |

**Sub-page titles inside Settings (and similar nested IA).** When a parent screen (e.g. Settings) lists many sub-pages in the subpanel, each sub-page uses the sub-page's own short name as the H1 — **not** the parent name, **not** a "Parent — Child" concatenation. The topbar breadcrumb already carries the parent.

> ✅ H1 "Staff Rights" · subtitle "Roles and per-feature permissions"
> ❌ H1 "Settings · Staff Rights" · subtitle "…" *(redundant — topbar already shows "Settings › Staff Rights")*
> ❌ Inline breadcrumb "SETTINGS › APP › STAFF RIGHTS" above the H1 *(same redundancy, plus eats vertical space)*

### Inline status hint (optional, in `.page-actions`)

When a screen auto-saves or has a global page state, surface it as a quiet hint inside `.page-actions`, **not** as its own row. Manrope 12px / `ocean-700` at 0.65 opacity, prefixed by a 13px icon (`check` for saved, `clock` for syncing). Example: "Changes save automatically".

### .page-foot — pagination (tables only)

Every paginated table uses the same footer strip. **No bespoke pagers** — variants drift and the operator has to relearn each one.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Showing 1–25 of 142          ← Prev   1 2 3 … 6   Next →   25 ▾    │
└──────────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Container | `display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-top: 1px solid var(--surface-3); background: var(--surface-1);` — sits **inside** the same card as the table, never floats below it |
| Range label | Inter 12px · `ocean-700` · `opacity: 0.75` · tabular-nums on the numbers. Format: *"Showing {start}–{end} of {total}"* |
| Page buttons | 28×28 square · 8px radius · Inter 13px / 500 · `ocean-700`. Current page: `surface-2` background · `ocean-900` text. Disabled: 0.35 opacity, no hover. |
| Prev / Next | Same 28px button + 12px chevron + label. Label hides below 480px container width — icon only. |
| Page size | Trailing `.seg`-style dropdown, options **10 · 25 · 50 · 100**. Default 25. Stored per-table in user prefs, not URL. |
| Truncation | When pages > 7, show `1 2 3 … N-1 N` (or `1 … N-2 N-1 N`). The `…` is a non-interactive span, `ocean-700` at 0.4 opacity. |

**When tables don't paginate.** Tables ≤ 50 rows render in full with no pager. A short *"42 results"* count strip replaces `.page-foot` — same container chrome, just no controls.

**Loading & empty.** While loading, the range label reads *"Loading…"* and page buttons render disabled. Empty state pulls the table card's own empty composition (illustration + line of copy + optional CTA) — the pager is hidden entirely, not shown with zeros.

### Visual helpers (illustrations, empty states, onboarding cards)

A *visual helper* is any non-data visual that explains state: empty states, zero results, first-run prompts, "feature is off" placeholders, success confirmations.

**Placement rule.** Visual helpers live **inside the card or panel whose state they describe** — never floating in the page background, never above `.page-head`. If the helper belongs to the whole page (e.g. "You haven't created any trips yet"), it sits in a single full-width card directly below `.page-head`, occupying the place the table or workspace would.

| Slot | Used for |
|------|----------|
| **Card-internal empty state** | Empty tables, empty group cards, empty workspace panels. Centered in the card body. Min-height 200px so the card doesn't collapse. |
| **Page-level zero state** | Entire feature unused yet ("No bookings yet"). Single card directly under `.page-head`, full content width. |
| **Inline hint strip** | Conditional helper above a complex form section ("Validation is off — turn it on to see results here"). 1-line strip, `surface-2` bg, `info` icon, 10px radius, no border. Below the section heading, above the fields. |
| **Tooltip / popover** | Per-field clarifications. Never used to deliver primary content — if the operator needs to read it to act, it's a `.help` line under the input instead. |

**Anatomy of an empty/zero state (the canonical one):**

```
   ┌─ Illustration / icon (48–64px, ocean-700 at 0.35) ─┐
   │                                                    │
   │   Title — Manrope 700 · 15px · ocean-900           │
   │   Body  — Inter 13px · ocean-700 · max-width 360   │
   │   [Primary CTA]   [Secondary link]                 │
   └────────────────────────────────────────────────────┘
```

- **Icon, not illustration.** Use a single outline icon from the existing library (`info`, `package`, `boat`, `users`, etc.) at 48–64px in `ocean-700` at 0.35 opacity. Custom illustrations are not part of the system.
- **One CTA max.** The primary action is the obvious next step ("Create trip", "Add member"). A secondary link is allowed for docs/help; never a second button.
- **Copy.** Title = the *fact* ("No trips scheduled"). Body = the *next move* ("Create your first trip to see it here"). Never apologize. Never use exclamation marks.

### Page-skeleton checklist (use when building any new admin page)

1. Does the page have exactly **one** H1 inside `.page-head`?
2. Is there **no** inline breadcrumb above the H1?
3. Does the subtitle state the screen's *purpose* in one sentence?
4. Are page actions in `.page-actions`, right-aligned, with at most one `.btn-primary`?
5. If the body has a paginated table, does it use `.page-foot` with the canonical pager?
6. Are empty states **inside** the card/panel whose data is empty?
7. Do you use the existing icon library (no new glyphs) and no custom illustrations?

If any answer is no, fix the page before adding new patterns.

---

## Admin Heading Hierarchy

Four levels. Which levels appear depends on screen type — not all screens use all four.

```
L1  Section / panel title    Manrope  15px / 600   ocean-900
    The named context of a panel, card, or page area.
    Examples: "Passengers", "Equipment", "Trip Details", "Week of March 19"
    Appears in: panel header strip (workspace), card header (dashboard),
                toolbar area (table), modal title (form).

L2  Category marker          Inter    10px / 500   ocean-700   UPPERCASE  tracking-wide
    A scan-path divider — groups rows into named sub-categories.
    NOT a heading. It is a spreadsheet column group label.
    Examples: "CONFIRMED PAX", "UNASSIGNED", "THIS WEEK", "PENDING REVIEW"
    Appears in: workspace panels (when rows split into sub-groups),
                data tables (when rows are grouped), NOT in forms or dashboards.
    Background: surface-2/50. Padding: py-1.

L3  Named entity / group     Inter    13px / 600   ocean-900
    The first named item inside a group: a group card title, a table section header,
    a form section name.
    Examples: "Advanced Explorers", "Morning Reef Dive", "Certification Details"
    Appears in: workspace group cards, form section headings.
    Background: surface-2. Padding: py-2.

L4  Row / field content      Inter    13px / 400   ocean-900
    Everything inside a row or below a form label. The default text level.
    Numeric data uses font-mono font-bold (times, IDs, counts, depths).
    Appears in: all screen types.

    **Exception — workspace primary identifier (name):**
    In workspace row grids (PaxItem, StaffRow), the person's name is the
    primary identifier and gets Manrope extrabold (800) at 13px ocean-900.
    This is NOT a heading — it is a data field, but it carries the most
    visual weight in the row to anchor the operator's scan path.
    Rule: `font-ui text-[13px] font-extrabold text-ocean-900`

    **Paired secondary text** (role subtitle, dive count, gear icon label):
    Drops to `font-normal text-ocean-400` — genuinely thin, visually receded.
    The extrabold/thin contrast is the mechanism that creates the "instrument
    panel" bold/quiet balance. Do not use font-semibold or font-medium for
    secondary row text — it collapses the contrast.
```

**How the levels collapse by screen type:**

| Screen type | Levels used | Note |
|-------------|-------------|------|
| Workspace   | L1 + L2 + L3 + L4 | Full stack. Groups within groups. |
| Data table  | L1 + (L2) + L4 | L2 only if rows are grouped. |
| Dashboard   | L1 + L4 | Cards handle grouping visually. |
| Form/modal  | L1 + field labels + L4 | Field labels are Inter 12px/500, not L2. |

**Visual gap logic (true for all screen types):**
```
L1 → L2: Large jump — size (15→10px) + UPPERCASE treatment signals context shift.
L2 → L3: Medium jump — same size (13px), weight (400→600) signals named entity.
L3 → L4: Subtle — same size, weight drops (600→400), hierarchy via weight only.
```

---

## Admin Density

"Nautical instrument panel" is a feel — here is what it translates to per screen type.

| Element | Workspace | Data Table | Dashboard | Form |
|---------|-----------|------------|-----------|------|
| Row height | 34–36px | 38–42px | n/a (cards) | n/a (fields) |
| Panel/card padding | px-3 py-2 | px-4 py-2 | p-4 | p-4 p-5 (modal) |
| Gap between items | gap-2 (8px) | gap-0 (borders) | gap-4 (16px) | gap-3 (12px) |
| Gap between groups | gap-2 | gap-4 | gap-4 | gap-6 |
| Font body | 13px | 13px | 14px | 14px |
| Font labels | 10px (L2) | 10px (L2) | 12px | 12px |

**Two rules that never change regardless of screen type:**

1. **Borders are structural, not decorative.** In workspaces and tables, borders define scan paths — like grid lines on a dive computer. Use them freely. They are REQUIRED, not optional polish.

2. **Status colors carry meaning.** Green, amber, red are reserved for operational state (verified, attention, danger). Never use them for visual interest, category color-coding, or brand accent. Every non-neutral color must answer: *"what does the operator need to do about this?"*

---

## Specific Patterns

### Gas/Tank Badges

```
Air (default):     bg-surface-2 text-ocean-700           ← neutral, not highlighted
Nitrox blend:      bg-accent-teal-bg text-accent-teal    ← teal signals non-standard gas
Non-standard tank: bg-ocean-50 text-ocean-500            ← blue signals non-standard size
```

When only one Nitrox blend is configured: label "NX". When multiple: "NX32", "NX36", etc.

### Trip Cards (Day Tile Slider)

```
Regular:        transparent bg, border-surface-3, hover:bg-ocean-50
Private trip:   bg-purple-50/50 tint on the card button
Teaching trip:  amber-alert border-left accent (2px), amber-alert-bg header
Night dive:     🌙 prefix on name
Overbooked:     text-amber-alert font-medium on pax line, ⚠ prefix
```

### Focus Bar (Organization tab — Trip Selected)

Dark navy glassmorphism — NOT the light surface-0 recipe. The bar collapses the day tile slider and anchors the operator in trip context.

```css
background: rgba(10, 37, 64, 0.95);   /* ocean-900 near-opaque */
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.10);
box-shadow: 0 4px 24px -4px rgba(3, 76, 142, 0.30);
border-radius: 0.5rem;
padding: 8px 16px;
```

All text is white on dark navy. Two weight tiers:
- **Primary** (trip name, date, time, dive count, boat name): `text-white font-bold` or `text-white/80 font-semibold` — `text-[13px]` or `text-[17px]` for name
- **Secondary** (site names, teaching badge): `text-white/70 font-normal` — `text-[12px]`

Content layout line 1: `[anchor icon] [Trip Name] [Boat icon + name] · [📅 Date] [🕐 Time] [〜 Dive count]`
Content layout line 2: `[📍 Site names] [Teaching badge if applicable]`
Right side: `[Pax count chip] [Refresh] [Change trip] [Done ✓]`

### Group Headers (Organization tab)

```
bg-surface-2 px-3 py-2
Group name: font-medium text-sm text-ocean-900
No guide: text-xs text-amber-alert  ← amber, not red — attention, not danger
Guide badge: Badge variant="success" (green)
Delete: text-xs text-red-critical
```

### Pax Row (PaxItem — workspace table grid)

Grid: `grid-cols-[160px_240px_80px_80px_52px_1fr_112px_24px]`
Col 1 Name | Col 2 Cert (240px) | Col 3 Gear (80px) | Col 4 Style (80px, centered) | Col 5 Req (52px) | Col 6 spacer 1fr | Col 7 Gas (112px, centered) | Col 8 Action (24px)

```
Row:     border-b border-surface-3 px-3 py-1.5 cursor-grab hover:bg-surface-0
Name:    font-ui text-[13px] font-extrabold text-ocean-900   ← Manrope 800
Cert:    font-ui text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-surface-2 text-ocean-700
Gear:    text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded  (color by status)
Style:   text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-ocean-50 text-ocean-700
Gas:     text-[10px] font-bold uppercase tracking-wide px-1 py-0.5 rounded    (color by blend)
Empty —: text-[11px] text-ocean-400 (centered in cell via flex justify-center items-center)
```

Column headers: `font-ui text-[10px] font-bold uppercase tracking-wide text-ocean-700`
Centered columns (Style, Gas): both header (`text-center block`) and data cell (`flex justify-center items-center`) must be explicitly centered.

### Staff Row (Right panel)

```
px-3 py-2 border-b border-surface-3/60
Name:    font-ui text-[13px] font-extrabold text-ocean-900   ← same as pax name
Role:    text-[11px] font-normal text-ocean-400              ← thin, receded
Guiding: bg-ocean-50/40 tint, not draggable, "· Guiding" in text-safety-green
Day-off: opacity-70, amber badge: bg-amber-alert-bg text-amber-alert border border-amber-alert/30
Panel header: font-ui text-[15px] font-semibold text-ocean-900 text-center
```

### Group Guide Row (inline in group header)

Guide name badge: `bg-ocean-100 text-ocean-500 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide`
Gas/tank badges appear inline after the name badge — same style as pax gas badges.
Guide gas/tank is stored on `trip_groups.guide_gas_blend` / `guide_tank_volume` — updated via `updateTripGroup`.

### Validation Controls

```
Unchecked:   ghost button with border
Completed:   safety-green fill
No-show:     red-critical outline
```

### Print Briefing

High contrast for outdoor reading. Black on white, larger font, bold section headers. Tank summary in bordered box.

---

## Context Separation

### Admin (`/admin/*`)

```
Font headers:  Manrope (font-ui)
Font body:     Inter (font-body)
Font data:     System mono (font-mono)
Surface base:  surface-0 page, surface-1 panels
Depth:         Tonal layering + borders (no-line rule NOT applied globally)
Buttons:       rounded-lg standard
CTAs:          ocean-500 fill
Glassmorphism: Focus Bar, modals, toasts only
```

### Diver-facing (`/trips`, `/my-bookings`, `/dashboard`, mobile web)

```
Font headers:  Space Grotesk (font-display)
Font body:     Inter (font-body)
Font data:     System mono (font-mono)
Surface base:  surface-0 page (same warm cream)
Depth:         No-line rule applied — background shifts only, minimal borders
Buttons:       rounded-full pill (gradient for primary CTAs)
CTAs:          ocean-deep gradient (#003567 → #034c8e)
Glassmorphism: Floating elements, sticky headers, modals
```

---

## Depth Stack (Elevation)

| Level | Element | Background | Border | Shadow |
|-------|---------|------------|--------|--------|
| 0 | Page | surface-0 | none | none |
| 1 | Panels, cards | surface-1 | surface-3, 1px | none |
| 2 | Raised cards, focused panels | surface-1 | surface-3, 1px | Level 2 |
| 3 | Modals, drawers | surface-1 | surface-3, 1px | Level 3 |
| 4 | Floating (glassmorphic) | surface-0 @ 82% + blur(24px) | surface-3 @ 40% | Level 4 |

---

## Migration Notes

### Font migration status (as of 2026-03-21)

✅ Inter is the active body default (`body` in `index.css`)
✅ Manrope self-hosted woff2 (400/500/600/700) wired to `--font-ui` / `.font-ui` Tailwind token
✅ Both declared in `apps/web/src/index.css` with `font-display: swap`
✅ **Manrope 800 (extrabold)** loaded via Google Fonts CDN in `index.html` — used for `font-extrabold` on workspace row names
⬜ Manrope 800 woff2: self-host when possible (add `manrope-800.woff2` to `/fonts/manrope/` and add `@font-face` block in index.css — then remove the CDN `<link>` from index.html)
⬜ Space Grotesk: not yet self-hosted — needed only for diver-facing `font-display` headers
⬜ Merriweather Sans: still declared in `index.css`, can be retired — confirm no active usage with `grep -r "MerriweatherSans\|merriweather-sans" apps/web/src` before removing


### Token additions — COMPLETE

All extended tokens (`surface-mid`, `surface-high`, `ocean-deep`, `ocean-deep-light`) are **already in `index.css`** as of 2026-03-20. No action needed.

```css
/* Already live in @theme block */
--color-surface-mid:       #efeee9;
--color-surface-high:      #e9e8e3;
--color-ocean-deep:        #003567;
--color-ocean-deep-light:  #034c8e;

/* Already live in :root block */
--surface-mid:       #efeee9;
--surface-high:      #e9e8e3;
--ocean-deep:        #003567;
--ocean-deep-light:  #034c8e;
```

### Glassmorphism implementation order

Apply to floating elements only. Start with:
1. Modals (highest impact, contained scope)
2. Realtime toast
3. Focus Bar (Organization tab)
4. Sticky headers on scroll (if added)

---

## v1.1 Pattern Catalog

Patterns built during v1.1 (Phases 39–64). Document what exists — do not redesign. Use as reference for v1.3 UI revamp and Stitch.

---

### 1. Specialty Pill Styles

**Context:** Admin planning workspace — user card rows in left panel (diver search results, recent users). Components: `apps/web/src/features/admin/planning/PlanningOrganization.tsx`.

**Approved specialties (from `specialties[]`):**

Teal pill — signals a full verified specialty certification:

```html
<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-teal-bg text-accent-teal">
  {specialty label}
</span>
```

Classes: `text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-teal-bg text-accent-teal`

- `bg-accent-teal-bg` = `#ccfbf1`
- `text-accent-teal` = `#0d9488`
- Only first 2 specialties rendered; overflow shown as `+N` in `text-[10px] text-ocean-700`

**Intro specialties (from `intro_specialties[]`):**

Amber pill — signals supervised-only access (not full certification):

```html
<span
  class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-alert-bg text-amber-alert"
  title="Nitrox intro only — instructor guide required"
>
  NX intro
</span>
```

Classes: `text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-alert-bg text-amber-alert`

- `bg-amber-alert-bg` = `#fef3c7`
- `text-amber-alert` = `#d97706`
- Currently only `nitrox_intro` is displayed; other intro specialties may be added later

**When to use teal vs amber:**
- Teal = full cert in `specialties[]` — operator can trust the diver unsupervised
- Amber = intro cert in `intro_specialties[]` — operator must assign an instructor guide

**Note:** These pills use `rounded` (4px), NOT `rounded-full`. They sit in an admin workspace context, not diver-facing. The chip shape rule applies.

---

### 2. Cert Badge System

**Context:** Admin planning left panel user cards, admin user search results. Components: `apps/web/src/features/admin/planning/PlanningOrganization.tsx`, `apps/web/src/features/admin/UserSearch.tsx`.

**Cert-verified green check (cert_verified = true):**

In PlanningOrganization left panel — compact circular icon badge:

```html
<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-safety-green flex-shrink-0">
  <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <!-- checkmark path -->
  </svg>
</span>
```

Classes: `inline-flex items-center justify-center w-4 h-4 rounded-full bg-safety-green flex-shrink-0`

- Solid `bg-safety-green` (#16a34a) circle, white checkmark inside
- 16×16px, appears inline next to cert level chip in diver card line 2

**In UserSearch — text Badge component:**

```tsx
{result.cert_verified ? (
  <Badge variant="success" size="sm">{t('admin.users.search.certVerified')}</Badge>
) : (
  <Badge variant="default" size="sm">{t('admin.users.search.certNotVerified')}</Badge>
)}
```

Badge component renders as `rounded-full` with `inline-flex items-center font-medium`:
- `success` variant: `bg-safety-green-bg text-safety-green` + `px-2 py-0.5 text-xs`
- `default` variant: `bg-surface-2 text-ocean-700` + `px-2 py-0.5 text-xs`

Note: The Badge component uses `rounded-full` (pill). This is an intentional exception — cert verification is a trust signal, not a data chip. The pill shape reads as "status" rather than "data code".

**OCR confidence (ManageCertifications detail modal):**

Inline banner, not a badge:

```html
<div class="text-sm px-3 py-2 rounded-lg bg-safety-green-bg text-safety-green">
  <!-- high confidence (>0.9) -->
</div>
<div class="text-sm px-3 py-2 rounded-lg bg-amber-alert-bg text-amber-alert">
  <!-- lower confidence -->
</div>
```

Source: `apps/web/src/features/admin/ManageCertifications.tsx`

**Cert level chip (in pax cards and user cards):**

```html
<span class="font-ui text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-surface-2 text-ocean-700">
  AOWD
</span>
```

This is the standard Chip pattern applied to cert level codes.

---

### 3. Planning Panel Card Conventions

**Context:** Planning Organization workspace left panel (diver pool, search results). Components: `apps/web/src/features/admin/planning/PlanningOrganization.tsx`.

**Diver card structure (3 lines):**

```
┌─────────────────────────────────────────────────────┐
│  Line 1: [Name (extrabold)] ──────── [Add button]   │
│  Line 2: [CERT CHIP]  [✓ verified badge]            │
│  Line 3: [dive count] [gear icon] [GEAR] [SP][SP]+N │
└─────────────────────────────────────────────────────┘
```

Container: `px-3 py-1.5 border-b border-surface-3 transition-colors`
Draggable state: `cursor-grab hover:bg-surface-0`
Already-added state: `opacity-40`

Line 1 — Name:
```html
<span class="font-ui text-[13px] font-extrabold text-ocean-900 truncate">
  {displayName}
</span>
```

Line 2 — Cert chip + verified:
```html
<div class="flex items-center gap-1 mt-0.5">
  <span class="font-ui text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-surface-2 text-ocean-700">AOWD</span>
  <!-- cert_verified green check badge if applicable -->
</div>
```

Line 3 — Stats + specialty pills:
```html
<div class="flex items-center gap-1 mt-0.5">
  <!-- dive count: text-[10px] text-ocean-400 tabular-nums font-normal -->
  <!-- gear icon + GearBadge component -->
  <!-- teal specialty pills (up to 2) -->
  <!-- amber NX intro pill if applicable -->
  <!-- overflow count: text-[10px] text-ocean-700 -->
</div>
```

**DayTileSlider day tile structure:**

Source: `apps/web/src/features/admin/planning/DayTileSlider.tsx`

Container: `flex flex-col border-r last:border-r-0 border-surface-3`
Today ring: `ring-1 ring-inset ring-ocean-500`

Date header:
```html
<div class="px-3 py-2 border-b border-surface-3 text-center flex-shrink-0 bg-surface-2">
  <!-- Today: bg-ocean-900 instead of bg-surface-2 -->
  <span class="text-[11px] font-ui font-semibold text-ocean-700">
    <!-- Today: text-white -->
    {formatted date with weekday prefix}
  </span>
</div>
```

Trip items area:
```html
<div class="flex-1 min-h-[100px] max-h-[280px] overflow-y-auto bg-surface-0">
  <!-- renderItems callback -->
</div>
```

Left control column (prev / calendar nav / next):
```html
<div class="flex-shrink-0 w-14 flex flex-col items-center justify-between border-r border-surface-3 bg-surface-2 py-2 rounded-l-lg">
```

---

### 4. Nitrox Gate UI Pattern

**Context:** Gas blend field gating in booking forms and pax row visual indicators. Components: `apps/web/src/features/admin/planning/DiverRow.tsx`, `apps/web/src/features/admin/planning/PlanningOrganization.tsx`.

**Gas blend gating logic:**

```typescript
const hasNitroxAccess =
  specialties.includes('nitrox') || intro_specialties.includes('nitrox_intro');
```

When `hasNitroxAccess` is false, nitrox/EAN gas blend options are filtered out of the dropdown before rendering. Filter regex: `/ean|nitrox|enriched/i`.

**NX teal badge (full nitrox cert):**

Shown in DiverRow when `gasBlend === 'nitrox'`:

```html
<span class="text-[10px] font-medium bg-accent-teal-bg text-accent-teal px-1 py-0.5 rounded flex-shrink-0">
  Nx
</span>
```

Classes: `text-[10px] font-medium bg-accent-teal-bg text-accent-teal px-1 py-0.5 rounded flex-shrink-0`

**NX warning amber badge (intro only, not full cert):**

Shown in DiverRow when `gasBlend === 'nitrox' AND introSpecialties?.includes('nitrox_intro')`:

```html
<span
  class="text-[10px] font-medium bg-amber-alert-bg text-amber-alert px-1 py-0.5 rounded flex-shrink-0"
  title="Nitrox intro only — instructor guide required"
>
  NX⚠
</span>
```

Classes: `text-[10px] font-medium bg-amber-alert-bg text-amber-alert px-1 py-0.5 rounded flex-shrink-0`

**NX intro pill in left panel (PlanningOrganization):**

Shown when `introSpecialtiesMap[user.id].includes('nitrox_intro')`:

```html
<span
  class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-alert-bg text-amber-alert"
  title="Nitrox intro only — instructor guide required"
>
  NX intro
</span>
```

Note: DiverRow shows `NX⚠` (compact, inline gas badge) while PlanningOrganization left panel shows `NX intro` (diver card specialty pill). Same colors, slightly different label and padding to match their context.

**introSpecialtiesMap propagation:**

`PlanningOrganization` batch-fetches `intro_specialties` from `user_hub_data` view, stores in `introSpecialtiesMap` state. Props: `PlanningOrganization → DiverRow` via prop threading through `TripCard → TripGroupBlock → DiverRow`. The prop is typed as `introSpecialties?: string[]` (optional) to avoid breaking existing call sites.

---

### 5. Admin Dark Glass Header Convention

**Context:** Full-screen admin sub-sections that need visual separation from the admin nav. Applied to course editor screens after Phase 24 redesign. Components: `apps/web/src/features/admin/courses/CoursesList.tsx`, `apps/web/src/features/admin/courses/CourseImageManager.tsx`.

**Dark glass header recipe (admin):**

```html
<div class="bg-ocean-900/95 backdrop-blur-md h-16 px-6 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
  <h1 class="text-lg font-semibold text-white font-manrope tracking-tight">
    Screen Title
  </h1>
  <!-- right-side actions -->
</div>
```

Key classes: `bg-ocean-900/95 backdrop-blur-md h-16 px-6 border-b border-white/10 sticky top-0 z-40`

- `bg-ocean-900/95` = near-opaque ocean-900 dark navy
- `backdrop-blur-md` = 12px blur
- `border-b border-white/10` = barely-visible white separator (ghost border on dark)
- `sticky top-0 z-40` = stays fixed on scroll, content scrolls beneath
- Height: `h-16` (64px fixed)

**Title style inside dark glass header:**

```html
<h1 class="text-lg font-semibold text-white font-manrope tracking-tight">
```

Note: `font-manrope` is a direct Tailwind utility class (mirrors `font-ui`). Used here instead of `font-ui` — both map to Manrope. In CoursesList, the class name is `font-manrope tracking-tight`; in CourseImageManager the comment is `{/* Dark glass header */}` with the same visual pattern.

**Back button in dark glass header:**

```html
<button class="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
```

**Where used:**
- `CoursesList` — courses list with create button
- `CourseImageManager` — course image upload screen

**Where NOT used:**
- `LessonEditor` — uses a standard `bg-surface-1 border-b border-surface-3/50` header, not dark glass
- `SectionQuizEditor` — no sticky header; card-based layout with `rounded-xl` cards
- Admin panels, tables, dashboards — standard surface-1/surface-2 headers apply

**Difference from Focus Bar glassmorphism:**

| | Dark Glass Header | Focus Bar |
|---|---|---|
| Background | `ocean-900/95` (dark, near-opaque) | `ocean-900/95` (identical) |
| Blur | `backdrop-blur-md` (12px) | `backdrop-blur-[12px]` |
| Border | `border-white/10` | `border-white/10` |
| Position | `sticky top-0` (not floating) | `fixed`/absolute (floating) |
| Purpose | Screen-level nav context | Trip selection context bar |

Both use the same dark navy glassmorphism recipe. The key difference is the Focus Bar floats above scrollable content while the dark glass header sticks to the top of the scrollable area.

---

## Admin App Shell (rail + subpanel + topbar) — v1.3 (2026-05)

The admin chrome was rebuilt for v1.3. **This section supersedes "Admin Page Chrome (Fixed Structure)" above.** For glyph names referenced throughout, see **`## Iconography`** above — the rail, subpanel, and topbar use the custom `<Icon>` library exclusively, and the chrome-zone assignments are codified there. The old top-nav-over-sub-nav split-tier is replaced by a three-zone grid: an always-visible icon **Rail**, a collapsible textual **Subpanel**, and a persistent **Topbar** with omnipresent search.

### Grid

```css
.app {
  display: grid;
  grid-template-columns: 76px 232px 1fr;   /* rail · subpanel · main */
  gap: 12px;
  padding: 12px;
  height: 100vh;
  background: var(--surface-2);
  transition: grid-template-columns 200ms ease-out;
}
.app[data-subpanel="hidden"] {
  grid-template-columns: 76px 0 1fr;       /* subpanel collapses to zero */
}
```

The 12px gutter between zones (and 12px page padding) makes each zone read as its own **floating card** on the `surface-2` page — not as walls of a single chrome. This is intentional: it's the same depth philosophy as the rest of the system (tonal layering + rounded surfaces over hard borders), applied to navigation.

### Zone 1 — Rail (76px, always visible)

```
Width        76px (44px buttons + padding)
Background   linear-gradient(160deg, --ocean-deep 0%, --ocean-deep-light 100%)
Radius       16px
Border       none (gradient + inner highlight is enough)
Inner light  radial gradient overlay at 30% 30%, 6% white
```

Contents, top → bottom:
1. **Logo mark** — 44×44, `ocean-500` fill, `border-radius: 12px`, the "α" glyph in Manrope 800.
2. **Divider** — 28px × 1px, `rgba(255,255,255,0.08)`.
3. **Section buttons** — one per top-level area (Dashboard, Members, Planning, Bookings, Equipment, Settings…). 44×44, `border-radius: 12px`. Default `color: rgba(255,255,255,0.55)`. Hover `rgba(255,255,255,0.06)` background + white icon. Active `rgba(255,255,255,0.10)` background + 1px inner highlight `rgba(255,255,255,0.08)` + a **3px × 22px white tab marker** absolutely positioned at `left: -10px` (it bleeds into the 12px gutter, anchoring the active section visually to the subpanel).
4. **Spacer** — `flex: 1`.
5. **Utility buttons** — dark-mode toggle, help/docs. Same chrome as section buttons, no active state.

Tooltips: each rail button carries a `.rail-tooltip` absolutely positioned at `left: calc(100% + 16px)`, shown on hover. Dark navy pill, white text, 0.2 shadow. This is the only place in admin where pill tooltips are allowed.

Badges on rail buttons (e.g. unread count) sit at `top: 6px; right: 6px`, 16×16 minimum, `var(--red-critical)` background with a `2px solid var(--ocean-900)` halo so they read against the gradient.

**Do not** add labels to rail buttons. The rail is icon-only by contract — labels belong in the subpanel.

### Zone 2 — Subpanel (232px, collapsible)

```
Width        232px expanded · 0 collapsed (animated 200ms)
Background   var(--surface-1)
Radius       16px
Border       1px solid var(--surface-3)
Padding      16px
```

Three parts stacked vertically:

1. **Header** — `subpanel-title` in Manrope 700, 15px, `ocean-900`. Optional `subpanel-subtitle` in Inter 12px `ocean-700`. Bottom border `1px solid var(--surface-3)`.
2. **Sections** — each section has a `subpanel-section` label (Manrope 10px, uppercase, `0.08em` tracking, `ocean-700` at 0.55 opacity) followed by `subnav-item` rows. Rows are: 16px icon · label · optional count chip. Active row uses a `surface-2` background — **no left-border accent** (this is one of the hard rules: the left-border active indicator was removed system-wide).
3. **Bottom card** — a single promotional/help card with the ocean-deep gradient. This is the **one place** in the admin app where the diver-facing gradient (`ocean-deep → ocean-deep-light`) is allowed, because it's a tip card, not a CTA.

**Collapsing.** The toggle button lives in the topbar (leftmost), not in the subpanel itself. When `data-subpanel="hidden"` is set on `.app`, the grid column animates to 0 and `.subpanel` gets `padding: 0; border: none;`. Content inside should be `overflow: hidden` on the parent during transition — we don't fade the contents, we clip them.

**Breadcrumb (single source of location).** The topbar breadcrumb is the **only** location indicator in the admin app — no page-level breadcrumb is ever rendered above the H1. When the subpanel is expanded, the breadcrumb reads `Section › Subsection` with the section dimmed (the subpanel title carries it) and the subsection bold. When the subpanel is collapsed, the section name swaps to bold so the operator never loses location context. Format never changes beyond that — no third level, no icons between segments other than `chevron_right` size 12. See **Page Skeleton** for the full rule and what *not* to put in `.page-head`.

### Zone 3 — Main column (topbar + content)

```
.main {
  background: var(--surface-1);
  border-radius: 16px;
  border: 1px solid var(--surface-3);
  display: flex; flex-direction: column;
  overflow: hidden;
}
```

Topbar height: **56px**, flex-shrink: 0, internal padding 12px. Contains, left → right:

1. **Subpanel toggle** — square 34×34 ghost button, `panel_left` icon.
2. **Breadcrumb** — single, `Section › Subsection`. See "Breadcrumb (single source of location)" above and **Page Skeleton** for the system-wide rule.
3. **Omnisearch** — `flex: 1; max-width: 560px;`. See below.
4. **Topbar actions** — refresh, messages (with `.badge-num`), notifications (with `.dot`), profile button (avatar + name + role + chevron).

Content below the topbar fills the remaining height and **scrolls inside the rounded card** (`overflow: auto` on `.content.scroll`). The rounded corners of the main card are never broken by full-bleed children — give 16px+ internal padding or accept the radius clip.

### Omnisearch (always present)

The search bar is **omnipresent** — visible on every admin screen, in the topbar, not behind a slash key or a button. It is the primary jump-to-anything affordance for operators.

```
Height       40px
Background   var(--surface-2)         (hover/idle)
             var(--surface-1)         (focus)
Border       1px solid surface-3      (idle)
             1px solid ocean-500      (focus)
Shadow       0 0 0 4px rgba(59,130,198,0.10)   (focus halo)
Radius       10px
Icon         search, 15px, ocean-700/0.55, absolute left 12px
Kbd hint     ⌘K in two <kbd> pills, absolute right 10px, hidden when open
Placeholder  "Search members, trips, settings…"
```

**Behavior**

- `⌘K` / `Ctrl+K` focuses the input from anywhere in the admin.
- `Escape` closes the results dropdown.
- On focus the dropdown opens; on blur (180ms delay so clicks register) it closes.
- Results render as **grouped rows** (`omni-group` with `omni-group-label` in Manrope 10px uppercase). Each row: 32×32 colored avatar tile (square 8px radius, NOT a circle — this is admin) · title with `<mark>` highlight of the query in `amber-alert-bg` · subtitle · meta chip · `arrow_up_right` icon.
- A results header shows count + the literal query in tabular monospace + a keyboard-hint line ("↑↓ navigate · ⏎ open · esc close").
- A filter footer offers `All / Members / Trips / Settings` as ocean chips.

**Why omnipresent and not modal.** Operators on a tablet spend the whole day jumping between a member, a trip, and a setting. A modal palette breaks the spatial mental model (you lose where you were). Keeping the search inline in the topbar keeps the rest of the screen visible underneath the dropdown, so the operator never loses their bearings while searching.

**Highlight color.** Query matches inside result titles use `background: var(--amber-alert-bg); color: var(--amber-alert)` — this is the only place amber is used for non-status emphasis. It works because amber is the system's "attention" hue and search hits ARE attention.

### Why this shell (rationale)

- **Rail-first.** The rail is the only nav surface that never moves. Operators learn the icon positions kinesthetically and stop reading them within a day. The dark navy gradient sets it apart from every other surface so the eye finds it without scanning.
- **Subpanel is optional.** Power users (DM, owner) collapse the subpanel and live in the rail + breadcrumb. Reception staff keep it open. The toggle is one tap and the layout adapts instantly.
- **Topbar is thin.** 56px keeps maximum vertical room for the data-dense content below. Profile/notifications/refresh sit far-right because they're rare — search and breadcrumb take the prime real estate.
- **No global page header.** The H1 lives inside the content area (`.page-head`), not the chrome. This is intentional — pages own their own headers (e.g. Planning's "Day overview" with section toolbar) instead of inheriting a generic title bar. And critically: there is **no second breadcrumb** inside the content. Topbar breadcrumb is the only one; see **Page Skeleton**.

---

## v1.3 Patterns (Planning Overview — 2026-05)

The Planning Overview rebuild introduces several patterns that should propagate into the rest of the admin app. Document them here; don't redesign them.

### Day Tag Pills (Today / Tomorrow / Past)

The day-block header is anchored by a chunky uppercase **day tag** + the ISO date in tabular numerals + a long-form date below. The tag color is the day's temporal status.

```css
.day-tag {
  font-family: var(--font-ui);   /* Manrope */
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.12em;
  padding: 4px 10px;
  border-radius: 5px;
  text-transform: uppercase;
}
.day-tag-ocean   { background: var(--ocean-900);  color: white; }  /* TOMORROW */
.day-tag-amber   { background: var(--amber-alert); color: white; } /* TODAY */
.day-tag-neutral { background: var(--surface-2);  color: var(--ocean-700); } /* PAST */
```

| Day | Tag | Meaning |
|---|---|---|
| **Tomorrow** | `day-tag-ocean` (navy `--ocean-900` fill, white text) | Plan-mode. The operator is preparing gear. Calm authority, not urgent. |
| **Today** | `day-tag-amber` (`--amber-alert` fill, white text) | Action-mode. The operator is validating dives in progress. Amber = "act now". |
| **Past** | `day-tag-neutral` (`--surface-2` fill, ocean-700 text) | Read-only. Quiet, dimmed. Use for any historical/locked context. |

**Why amber for Today (instead of ocean-500).** The operator opens this page first thing in the morning and last thing at night. The amber tag is the visual cue that **this is the row that needs decisions today** — and it pairs with the amber "validation mode" badge below it. Ocean-500 would read as just-another-link; amber reads as the active row.

**Why ocean-900 (not ocean-500) for Tomorrow.** Tomorrow is authoritative-but-not-urgent. The deep navy reads "structural / committed" while ocean-500 is for interactive primary actions. Don't conflate the two.

This pattern generalizes: any UI that contrasts a **prepare / act / review** triad should use **ocean-900 / amber / neutral surface-2** in that order.

### Tank Pills

Compact pill that pairs a count and a gas/volume code. Used in the day stats row and inside trip cards.

```css
.tank-pill {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 7px;
  border-radius: 5px;
  background: var(--surface-2);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.tank-pill-sm { font-size: 10.5px; padding: 2px 6px; }      /* inside trip cards */
.tank-n { font-weight: 800; }                                 /* count */
.tank-k { font-weight: 600; opacity: 0.85; }                  /* gas/vol code */
.tank-spare {
  display: inline-flex; align-items: center;
  padding: 2px 7px; border-radius: 5px;
  background: var(--amber-alert-bg); color: var(--amber-alert);
  font-size: 11px; font-weight: 700;
}
```

Markup:

```html
<span class="tank-pill">
  <span class="tank-n tabular">22×</span>
  <span class="tank-k">Air 12L</span>
</span>
<span class="tank-spare tabular">+3 spare</span>
```

**Rules**

- Always render the count first, with the `×` glued to the number (not the gas code). The eye reads "22×" as a quantity, "Air 12L" as a kind.
- The spare-tank chip uses `amber-alert-bg` because spares are **buffer**, not a problem — amber communicates "noteworthy, not blocking". Do not use red here.
- Tank pills are `surface-2` (not white) because they're inline data inside a header strip; white would create unwanted card-on-card depth.

### Equipment Pills (BCD / REG / FINS / SUIT / MASK)

Gear pills carry two stacked pieces of information: an **equipment kind** (3–4-letter Manrope 800 tag) and an **inventory ID** (Manrope 600). They have three visual states matching the gear-assignment lifecycle.

```css
.gear-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; border-radius: 5px;
  font-size: 10.5px; font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.gear-pill .gear-kind {
  font-family: var(--font-ui); font-weight: 800; font-size: 8.5px;
  letter-spacing: 0.06em; opacity: 0.6;
}
.gear-pill .gear-id { font-family: var(--font-ui); font-weight: 600; }

.gear-pill-assigned   { background: var(--ocean-50);  color: var(--ocean-500); border: 1px solid var(--ocean-100); }
.gear-pill-draft      { background: transparent;       color: var(--ocean-700); border: 1px dashed var(--ocean-100); }
.gear-pill-unassigned { display: none; }                      /* literally hidden — empty slot reads as missing */
```

| State | Visual | Meaning |
|---|---|---|
| **Assigned** | Solid `ocean-50` fill, `ocean-500` text, solid `ocean-100` border | Operator has confirmed this gear for this diver. Locked in. |
| **Draft** | Transparent fill, **dashed** `ocean-100` border, `ocean-700` text | Auto-matched by the system; operator hasn't reviewed yet. |
| **Unassigned** | Not rendered | Empty slot is communicated by its absence (and the diver status indicator turning orange). |

**Markup**

```html
<span class="gear-pill gear-pill-assigned">
  <span class="gear-kind">BCD</span>
  <span class="gear-id">BCD-24</span>
</span>
```

**Why dashed for Draft.** Dashed is the universal "tentative / not committed" stroke — it visually pre-announces "you still need to confirm this". Solid border = decided; dashed border = pending decision. Don't invent a third stroke style.

**Why kind is opacity 0.6 and smaller than ID.** The ID is the unique data — that's what the operator scans for. The kind is the category — context, not content. Sizing them differently lets a row of mixed gear pills be parsed in one sweep.

### Diver Gear Status Indicator (3 states, pulsing orange)

The 22×22 square at the start of every diver row in a trip card. **Three states only** — no fourth. Each combines a color and a glyph; the orange state additionally pulses.

```css
.diver-status {
  width: 22px; height: 22px;
  border-radius: 5px;
  display: grid; place-items: center;
  color: #fff;
  border: 0; padding: 0; cursor: pointer;
  transition: transform 120ms, filter 120ms;
}
.diver-status:hover { filter: brightness(1.05); transform: translateY(-1px); }

.diver-status-green  { background: var(--safety-green); }              /* check glyph */
.diver-status-amber  { background: var(--amber-alert); }               /* 3 stripes glyph */
.diver-status-orange {
  background: #ea580c;                                                 /* question glyph */
  animation: diver-status-pulse 1.6s ease-in-out infinite;
}
@keyframes diver-status-pulse {
  0%, 100% { box-shadow: 0 0 0 0    rgba(234,88,12,0.55); }
  50%      { box-shadow: 0 0 0 6px  rgba(234,88,12,0);    }
}
```

| State | Color | Glyph | Means |
|---|---|---|---|
| **Green** | `--safety-green` (#15803d) | ✓ check | All required gear is assigned. Operator can move on. |
| **Amber** | `--amber-alert` (#d97706) | ☰ three horizontal stripes | Gear is partially set or still in draft. Needs review. |
| **Orange (pulses)** | `#ea580c` | **?** question mark | Gear not set **and/or** sizing data missing on the diver profile. Demands attention. |

**Why pulse on orange but not amber.** Amber means "review before you depart" — soon, but the operator can finish other rows first. Orange means "you can't even auto-match this person until you go fix something on their profile" — it's a blocker. The 1.6s box-shadow pulse (radiating ring, no scale) draws the eye without nagging. Hover lifts the square 1px to invite the click.

**Why #ea580c and not `--red-critical`.** Red is reserved for **safety-critical** signals (overdue service, cert expired, weather cancel). Missing sizing data is a workflow blocker, not a danger — orange sits between amber and red in semantic weight without crossing into safety territory. Codify: **red = safety; orange = blocker; amber = attention; green = clear.**

**Glyph contract.** The glyph is set as a second class (`diver-status-{check|stripes|question}`) and rendered as an inline 11×11 SVG with `currentColor` stroke. Don't substitute Ionicons here — these glyphs need pixel-perfect alignment in a 22px square, and inline SVG with explicit `stroke-width: 3.2` for the check / `2.6` for the stripes gives the only legible result at this scale.

**Click target.** The whole square is a button that opens the pax assignment panel for that diver. The pulse on orange + the hover lift is what tells the operator "this is interactive" — there's no other affordance.

### Day stats strip (header KPIs)

The horizontal strip below the day tag combines simple `DayStat` blocks (label/value pairs in Manrope), a thin `day-stat-divider` (1px vertical, `surface-3`), and grouped sub-strips for **Tanks** and **Gear**. Treat dividers as gutters between conceptual groups — don't sprinkle them between every pair of stats. The rhythm is: counts · `|` · tanks · `|` · gear status. Three beats, not seven.

The gear-strip status line at the end uses two atoms:

```html
<span class="gear-ready"><svg.../> Equipment ready</span>     <!-- safety-green text -->
<span class="gear-short"><svg.../> Shortage</span>            <!-- amber-alert text -->
```

These are **inline status phrases**, not chips. They sit next to plain-text counts in the gear strip and inherit the strip's 11px size. Don't promote them to chips — the strip would become visually noisy and lose its "instrument-panel readout" feel.

---

### Where to apply these patterns next

When extending the admin app, reuse rather than re-invent:

- **Anywhere you contrast plan/act/review** (other rolled-up day/week views, financial period selectors, course cohort timelines) → use the **day-tag-ocean / day-tag-amber / day-tag-neutral** triad.
- **Anywhere you label a resource by kind + id** (boats, regulators, BCDs, training kits, course cohorts) → use the **gear-pill** structure (Manrope 800 kind tag + Manrope 600 ID, three states for lifecycle).
- **Anywhere a row's readiness is binary-or-warn** (cert review queue, payment status, equipment service queue) → use the **22×22 status square with green/amber/orange + pulse on blocker**.
- **Anywhere you list inventory totals in a header** → use the **tank-pill** count-first construction.

