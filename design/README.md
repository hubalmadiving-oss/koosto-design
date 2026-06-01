# Koosto · design/

Working design system + interactive prototype for the **Koosto Console** (the dive-center admin web app, codename "DiveWH"). This folder is the **source of truth for visual decisions**; the production codebase at `github.com/erqz0/divewh` mirrors what's locked here.

> **New here / resuming?** Read **`HANDOFF.md`** first (project-wide orientation), then this file. Deep domain logic for the Equipment module is in **`docs/equipment-module.md`**; the backlog is **`docs/ROADMAP.md`**.

---

## How this folder is organized

```
design/
├── README.md                        ← you are here
├── HANDOFF.md                       ← ★ read first: project-wide orientation + continuity
├── Koosto Console.html              ← full app, navigable. Loads everything in src/
├── Components Review.html           ← design-system spec — every recurring primitive lives here
│
├── docs/
│   ├── equipment-module.md          ← ★ full Equipment-module logic, formulas, data contract (§1–16)
│   └── ROADMAP.md                   ← backlog / queued items
│
├── screens/                         ← one HTML "plate" per screen, for focused review
│   ├── Dashboard.html
│   ├── Users - Diver Profile.html
│   ├── Planning - Dashboard.html
│   ├── Planning - Spec.html
│   └── Settings/
│       └── … 12 settings sub-page plates
│
├── src/                             ← single source of truth for every page & component
│   ├── shell.jsx                    ← rail + subpanel + topbar + omnisearch + mount
│   ├── nav.jsx                      ← NAV, SUBNAV, SEARCH_RESULTS
│   ├── icons.jsx                    ← icon library (57 outline glyphs)
│   │
│   ├── tweaks/
│   │   └── tweaks-panel.jsx         ← reusable floating-panel framework
│   │   # Per-page tweaks land here as <page>.tweaks.jsx when added
│   │
│   ├── pages/
│   │   ├── dashboard.jsx
│   │   ├── users.jsx                ← diver profile (5 tabs)
│   │   ├── planning.jsx             ← live planning dashboard
│   │   ├── planning-spec.jsx        ← design proposal (sibling, not buried)
│   │   └── settings/
│   │       ├── _shared.jsx          ← helpers (SectionCard, Field, Row, …) — loads first
│   │       ├── index.jsx            ← router that picks the active sub-page
│   │       ├── app-general.jsx
│   │       ├── app-center.jsx
│   │       ├── app-staff-rights.jsx
│   │       ├── notifications.jsx          (app-wide — was under Booking)
│   │       ├── planning-destinations.jsx
│   │       ├── planning-boats.jsx
│   │       ├── planning-settings.jsx
│   │       ├── equipment-definitions.jsx
│   │       ├── equipment-matching.jsx
│   │       ├── equipment-settings.jsx     (placeholder — awaiting design)
│   │       ├── booking-settings.jsx       (was booking-flow)
│   │       └── finance-settings.jsx       (was financial)
│   │
│   └── components/                  ← grows as Components Review locks patterns
│       └── (empty for now)
│
├── styles/
│   ├── tokens.css                   ← colors / type / radii — mirrors prod @theme
│   ├── shell.css                    ← rail, subpanel, topbar
│   ├── components.css               ← buttons, cards, chips, avatars, tables …
│   └── planning.css                 ← day blocks, trip cards, gear pills, diver rows
│
├── assets/                          ← logos (5 PNGs)
├── fonts/                           ← Manrope, Inter, Switzer, Space Grotesk, RealistNarrow
│
└── _archive/                        ← old versions worth keeping but not loaded
    ├── Planning Backup.html
    ├── page-planning.locked.jsx
    └── styles-planning-locked.css
```

A side folder `design_bak/` at the project root holds the **pre-refactor monolith** (`Koosto Console.html` with everything inlined + the stale `page-*.jsx` snapshots). Keep it as the safety net.

---

## The three rules (please hold me to them)

1. **Editing a screen → edit `src/pages/<x>.jsx`.** Never the HTML. Console + plates are mount-points, not sources. The previous mess (4,700-line monolith, drifting orphan `.jsx` files) happened because this rule didn't exist.
2. **Editing a shared primitive → edit `src/components/<Name>.jsx` AND update its card in `Components Review.html`.** Both move together.
3. **Renaming, moving, or adding a screen → update this README's screen index AND the `screens/<X>.html` plate, in the same commit.** Zero drift policy.

---

## Screen index

| Screen | Status | Page file | Plate |
|---|---|---|---|
| Dashboard | placeholder | `src/pages/dashboard.jsx` | `screens/Dashboard.html` |
| Users · Diver Profile | drafted (5 tabs) | `src/pages/users.jsx` | `screens/Users - Diver Profile.html` |
| Planning · Dashboard | built, current canonical design | `src/pages/planning/dashboard.jsx` | `screens/Planning - Dashboard.html` |
| Settings · App · General | drafted | `src/pages/settings/app-general.jsx` | `screens/Settings/App - General.html` |
| Settings · App · Center | drafted | `src/pages/settings/app-center.jsx` | `screens/Settings/App - Center.html` |
| Settings · App · Staff Rights | drafted | `src/pages/settings/app-staff-rights.jsx` | `screens/Settings/App - Staff Rights.html` |
| Settings · App · Notifications | drafted (was under Booking) | `src/pages/settings/notifications.jsx` | `screens/Settings/App - Notifications.html` |
| Settings · Planning · Destinations | drafted | `src/pages/settings/planning-destinations.jsx` | `screens/Settings/Planning - Destinations.html` |
| Settings · Planning · Boats | drafted | `src/pages/settings/planning-boats.jsx` | `screens/Settings/Planning - Boats.html` |
| Settings · Planning · Settings | drafted | `src/pages/settings/planning-settings.jsx` | `screens/Settings/Planning - Settings.html` |
| Settings · Equipment · Definitions | drafted | `src/pages/settings/equipment-definitions.jsx` | `screens/Settings/Equipment - Definitions.html` |
| Settings · Equipment · Matching | drafted | `src/pages/settings/equipment-matching.jsx` | `screens/Settings/Equipment - Matching.html` |
| Settings · Equipment · Settings | built (service + EOL rules) | `src/pages/settings/equipment-settings.jsx` | `screens/Settings/Equipment - Settings.html` |
| Settings · Booking · Settings | drafted | `src/pages/settings/booking-settings.jsx` | `screens/Settings/Booking - Settings.html` |
| Settings · Finance · Settings | drafted | `src/pages/settings/finance-settings.jsx` | `screens/Settings/Finance - Settings.html` |
| Equipment · Inventory | drafted | `src/pages/equipment/inventory.jsx` | `screens/Equipment/Inventory.html` |
| Equipment · Stock | drafted | `src/pages/equipment/stock.jsx` | `screens/Equipment/Stock.html` |
| Equipment · Log | built | `src/pages/equipment/log.jsx` | (loaded via Console) |
| Equipment · Analytics | built (activity-aware CPU, convergence model) | `src/pages/equipment/analytics.jsx` | (loaded via Console) |

> Equipment-module deep logic (indexed vs non-indexed, reg-set composites, maintenance pool, FIFO, service/EOL rules, analytics formulas) is documented exhaustively in **`docs/equipment-module.md`**. Read it before touching any equipment screen.

Top-level sections **Courses · Equipment · Staff · Bookings · Finance** are stub entries in `nav.jsx` — their main pages haven't been designed yet. When you commission one: add `src/pages/<x>.jsx`, add a screen plate, list it above, and load it from `Koosto Console.html`.

> **Filename note.** The system normalizes `·` to `-` in filenames. The visible label inside each plate still uses `·` — only the file path uses `-`.

---

## Plates vs. Console — which to open

- **`Koosto Console.html`** — full app, real shell (rail + subpanel + topbar), all navigation works, Tweaks panel available. Use this for **flow review** ("does this feel like the real product?").
- **`screens/<X>.html`** — single-screen plate, no chrome, no Tweaks. Use this for **focused design review** of one screen (comments attach to a stable URL, no nav distraction).

The plate's top bar links back to the Console (full context) and to the Components Review.

---

## Script-load order (important if anything breaks)

Each `.jsx` file lives in its own Babel scope. Cross-file references go through `window`:

```
icons.jsx                       → window.Icon
nav.jsx                         → window.NAV, SUBNAV, SEARCH_RESULTS
tweaks/tweaks-panel.jsx         → window.TweaksPanel, useTweaks, Tweak…
pages/settings/_shared.jsx      → window.SectionCard, Field, Row, SidebarRow, Toggle   ← MUST load before any settings sub-page
pages/settings/<sub-page>.jsx   → window.Settings<X>                                   ← each sub-page
pages/settings/index.jsx        → window.SettingsPage                                  ← MUST load AFTER all sub-pages
pages/dashboard.jsx             → window.DashboardPage
pages/users.jsx                 → window.UsersPage
pages/planning.jsx              → window.PlanningPage
shell.jsx                       → MUST load LAST. Destructures everything from window and mounts <App/>.
```

Each consumer file destructures what it needs at the top:
```jsx
const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;
```

If you see "X is not defined" in the console, you've either loaded files out of order or forgotten to put X on `window` at the end of its source file.

---

## Tweaks architecture

Global console tweaks (dark mode, density, active section) live inside `src/shell.jsx`'s `<TweaksPanel>`. They persist via the host's `__edit_mode_set_keys` protocol — the JSON between the `/*EDITMODE-BEGIN*/ … /*EDITMODE-END*/` markers gets rewritten on disk when a tweak changes.

**Per-page tweaks** are scaffolded but not wired in yet. When a page wants its own controls:

1. The page exports `window.<Page>Tweaks = { defaults: {...}, render: (t, setTweak) => <>…</> }`.
2. `shell.jsx`'s TweaksPanel checks for `<active-page>Tweaks` on every render and slots its controls in below the global block.
3. Defaults from each page get merged into the master TWEAK_DEFAULTS so persistence works the same way.

For now: Planning's per-page tweaks (mode / gear / pax / columns) live in `shell.jsx`'s `TWEAK_DEFAULTS` as a transitional measure. They'll move into `src/tweaks/planning.tweaks.jsx` when we touch that next.

---

## Components Review contract

`Components Review.html` is the catalog. Each card represents a primitive (button, counter, alert, tooltip, dialog, …) and carries three things:

- **The demo** — hand-rolled HTML showing the visual.
- **The `PROD` block** — `apps/web/src/components/ui/<Name>.tsx` path, the suggested props API, and the Tailwind v4 class string a frontend agent would output.
- **A `proposed` / verified status.** `proposed` means the production file doesn't exist yet (or hasn't been audited against this design); when it lands in code, remove the tag.

### Lifecycle of a component

1. **Inline demo** — drawn directly in `Components Review.html` for review (today's state for most primitives).
2. **Locked** — when you approve a primitive, I extract it to `src/components/<Name>.jsx` (a real React component) and replace the inline demo with `<Name {...exampleProps} />`. The card becomes a live render.
3. **Adopted** — consumers across pages (Suspend modal, Notes composer, rail badges, etc.) get migrated to use the real component. The `proposed` tag on the PROD block goes away.

---

## Decisions log (locked patterns)

- **Counter pills are two primitives**, not one with a `showNumber` prop: numeric counter + indicator dot.
- **Destructive actions are two-stage**: outlined button to start, solid red to confirm.
- **Orange = blocker, amber = attention.** Only orange pulses. Status ladder: red (safety) · orange (blocker) · amber (attention) · green (clear).
- **`alert_triangle` + `alert_circle`** are now real icons. Use them for warn/error so the warning iconography stops being ambiguous with info.
- **`data-screen-label`** is set on every top-level page wrapper. Review comments inherit the screen name via DOM ancestry.
- **Modal backdrop** = 135° ocean-tinted blur (matches Suspend modal).
- **Notifications is app-wide**, lives under Settings · App (not Booking).
- **Tokens mirror.** `styles/tokens.css` is the source for production `apps/web/src/styles/tokens.css` `@theme` block.
- **Planning Spec promoted to canonical (2026-05-17).** The `page-planning-spec.jsx` design replaced the older `page-planning.jsx` as the Planning Dashboard. Older version archived at `_archive/planning.older.jsx`. The spec's CSS (originally `styles-planning-locked.css`) is now merged into `styles/planning.css`.
- **Equipment split into Inventory + Stock (2026-05-21).** Inventory = operational status (lend, return, flag broken/lost/maintenance, swap reg-set component). Stock = quantity & lifecycle (add unit, assemble reg set, restock batches, run audit, retire). Two clean paths instead of one mixed-concerns screen.
- **Planning split into per-screen folder (2026-05-22).** `src/pages/planning/dashboard.jsx` + 6 placeholder sub-pages + `index.jsx` router. `planningSection` tweak added. Mirrors Equipment / Settings layout.
- **Button + Chip locked as components (2026-05-22).** First two real `src/components/<X>.jsx` extractions. Button takes `variant · size · icon · iconOnly · loading · disabled` props. Chip takes `tone · icon` props. Both are loaded globally via `Koosto Console.html` and ready to be adopted across pages.
- **Inventory action menu replaces the icon row.** The 6-icon row per indexed item became one `⋯`-style dropdown (`<ActionMenu>`) with named, context-conditional actions. Reasoning: icons were ambiguous; named items + conditional visibility (Return only if lent, Swap component only for reg sets) cut both clutter and error rate.
- **Regulator Sets are composite items.** A Set = 1× 1st stage + 2× 2nd stage + 1× gauge. Components are tracked as **stock items** (not indexed), live in `equipment_components_stock`, carry their **own service dates**. Assembling a Set consumes one of each from the component pool; swapping a faulty component (real-life behaviour) returns it to maintenance and pulls a spare from stock without retiring the Set.
- **Indexed vs non-indexed treatment.** Indexed items (BCD, Reg Set, Dive Computer) get per-unit rows with codes + a status pip + action menu. Non-indexed (Wetsuit, Fins, Mask, Snorkel, Compass, Torch, Weights) aggregate as one row per brand/model/size with status-breakdown chips; flagging a unit (broken/lost/maint.) decrements the on-shelf count and writes the reason for downstream modules (Planning, Billing).
- **FIFO rotation hint on non-indexed batches.** Stock displays each SKU as its purchase batches with `acquired` date; oldest batch is tagged `FIFO · NEXT OUT`. Operators rotate stock evenly without manual tracking.
- **5-step reg-set wizard replaced by a single Assemble modal.** All 4 component slots visible at once, each a dropdown of available stock with counts inline, plus a quantity field for batch assembly. Live preview shows the to-be-created set before confirm.
- **Service-due flagging in Inventory.** Reg-set components within 30 days of service due show `Service due in Nd` and an amber status pip. Doesn't block usage — advisory only. Powers a forthcoming Equipment Settings rule (already designed visually in `equipment-definitions.jsx`).

---

## How to prompt me (Claude · Design) when working on a screen

The structure works best when prompts say *what to touch* and *what changes*. Below are the templates I recognize. None of them are mandatory — but the more specific you are, the less I guess.

### Template 1 — Redesign a screen

> "Redesign **Settings · App · General**. Here's a draft / inspiration / Figma frame: \<attachment\>.
> Keep the existing header + sidebar pattern. Focus on the 'Localization' section."

What I do:
1. Read `design/src/pages/settings/app-general.jsx` — the single source of truth for that screen.
2. Read your attachment.
3. Edit that one file in place. Console + plate refresh automatically.
4. If new shared primitives appear, I open a card in `Components Review.html` first.

### Template 2 — Iterate on one element

> "On **Users · Diver Profile**, the 'Emergency contact' section needs a yellow background when the contact is missing. Reuse the `alert-warn` style from Components Review."

What I do:
1. Find the element in `src/pages/users.jsx`.
2. Apply the change using tokens already in `styles/tokens.css`.
3. If the pattern is reusable, surface it as a primitive in Components Review.

### Template 3 — Add a new screen

> "Add a new screen **Equipment · Service Log**. Show recent services per piece of gear, who did it, when it's next due. Reuse the table style from Bookings tab in Users."

What I do:
1. Confirm with you: which NAV section, what sub-routes, what placeholder data.
2. Add `src/pages/equipment/service-log.jsx`.
3. Add a `screens/Equipment - Service Log.html` plate.
4. Update this README's screen index + decisions log.
5. Wire it into `Koosto Console.html` and `nav.jsx`.

### Template 4 — Lock a primitive

> "I approve the **Counter pill** design in Components Review. Lock it."

What I do:
1. Extract `src/components/Counter.jsx` as a real React component matching the demo.
2. Replace the inline HTML demo in `Components Review.html` with `<Counter {...props} />` calls.
3. Update the PROD block (remove `proposed` tag, finalize the props API).
4. Surface usages across pages that should adopt it.

### Template 5 — Variation / Tweak

> "Show me **two variants** of the Dashboard layout — one stat-heavy, one timeline-heavy. Expose them via Tweaks."

What I do:
1. Build both variants in `src/pages/dashboard.jsx` behind a tweak switch.
2. Wire the switch into the Tweaks panel (page-scoped or global, your call).
3. Document the variants in the decisions log when you pick one.

### Things that help me get it right faster

- **Pin the screen.** "Planning · Dashboard" beats "the planning thing".
- **Anchor to the file when you know it.** "`app-staff-rights.jsx` — make the matrix scrollable" is unambiguous.
- **Reference Components Review by section name.** "Use the slim alert-warn style" beats "make it yellow".
- **Attach images for visual direction.** Screenshots, sketches, Figma exports — anything.
- **State the constraint.** "Don't change the header" or "Stay within existing tokens" prevents drift.
- **Use click-comments in the preview.** `data-screen-label` is set on every page wrapper — when you click-comment, the page name comes through automatically.

### Things that don't work well

- *"Make the whole console nicer."* — Too broad. Pick one screen.
- *"Like the live app but better."* — I haven't seen your prod app. Show me a screenshot or a draft.
- *"Add some animations."* — Where? When? Specificity saves iterations.

---

### Where to comment — plate vs. Console

When you click-comment in the preview, the URL you commented on becomes part of my context. Pick the right surface:

**Use the plate** (`screens/<X>.html`) when iterating on **one screen**:

- The URL pins the screen — I know exactly which file owns it.
- `data-screen-label` sits on the page wrapper directly; no rail / subpanel / topbar in the DOM ancestry, so my `<mentioned-element>` block is clean.
- One screen, no distraction. I won't accidentally edit shell chrome thinking it's the page.

**Use the Console** (`Koosto Console.html`) when commenting on:

- **Shell chrome** — rail, subpanel, topbar, omnisearch, notifications bell.
- **A flow** — clicking from Dashboard → Users → Settings.
- **Cross-screen comparisons** — "Settings · App · Center should match Settings · App · General's layout".
- **Global tweaks** — dark mode, density, things the plates don't expose.

Quick reference:

| You're commenting on… | Open this |
|---|---|
| "This card on Users · Diver Profile" | `screens/Users - Diver Profile.html` |
| "Settings · Booking · Settings — this section" | `screens/Settings/Booking - Settings.html` |
| "The notification bell badge in the top-right" | `Koosto Console.html` (shell concern) |
| "When I click from Dashboard to Users, the transition…" | `Koosto Console.html` (flow concern) |
| "The rail icon for Planning needs a tooltip change" | `Koosto Console.html` (chrome concern) |

### Will a plate fix propagate to the Console?

**Yes, for almost everything.** Plates and Console load the same source files. When you comment "make this heading smaller" on a plate, the edit lands in the page jsx or shared CSS, and the Console picks it up automatically.

What's **shared** (any edit propagates to both):

- Page content — `src/pages/<x>.jsx`
- Tokens — `styles/tokens.css`
- Primitives — `styles/components.css`
- Page-specific CSS — `styles/planning.css`
- Icons — `src/icons.jsx`

What's **plate-only** (edits don't reach the Console):

- The breadcrumb bar on top of every plate (`.plate-bar`)
- The plate mount frame (`.plate-mount`)
- Anything inside a plate's inline `<style>` block

What's **Console-only** (edits don't reach plates):

- Rail / subpanel / topbar — `styles/shell.css` + `src/shell.jsx`
- Omnisearch dropdown
- Tweaks panel UI (the panel itself, not what it controls)

**The one caveat — width-sensitive layouts.** Plate is wider than Console's content area (plate ≈ 1480 px; Console content ≈ viewport − 370 px). For most content this doesn't matter. But for grids that wrap (Planning's trip-card grid, the bookings table) and multi-column rows, column widths can differ. If you comment "this column wraps to two lines", that wrapping might exist at one width and not the other. When in doubt, mention which context shows the problem, or open the Console — I'll cross-check the plate before changing.

---

## How the frontend agent (Claude · Code) integrates a page

The design folder hands off to the production repo at `github.com/erqz0/divewh`. Here's the contract.

### What the frontend agent reads

| Source | What it provides |
|---|---|
| `Components Review.html` | Design tokens (colors, spacing, type), recurring primitives with their `PROD` blocks (file path + Tailwind v4 class string + suggested props API). |
| `src/pages/<x>.jsx` | Reference React structure for screen X — DOM hierarchy, semantic classes, state model, interaction wiring. The agent ports this by translating CSS classes to Tailwind utilities. |
| `screens/<X>.html` | Pixel-level visual reference for the screen in isolation. |
| `Koosto Console.html` | Full navigation context — how the screen sits inside rail / subpanel / topbar. |
| `styles/tokens.css` | Authoritative source for tokens. Mirrors prod `apps/web/src/styles/tokens.css` `@theme` block exactly. |
| `README.md` (this file) | Architectural decisions + the screen index. |

### What's sufficient — and what's residual

**Sufficient** (the design folder gives the agent this already):
- Visual fidelity: tokens, layout, type, color, spacing, radii, shadows, glass effects.
- Component structure: which DOM nodes exist, how they nest, what classes carry which job.
- Iconography: every icon used is in `src/icons.jsx` and inventoried in Components Review.
- Interaction *intent*: edit modes, modals, validation states, hover/active styles, transitions.
- Naming and copy: button labels, headers, microcopy — assume intentional unless flagged.
- Tailwind translation: every PROD block carries the proposed Tailwind v4 class string.
- **Field-level data contract** (when annotated — see next section): the production column / table each piece of UI maps to.

**Residual** (bounded engineering, not invention):
- Data fetching — replace mock objects with Supabase queries against the tables the page declares.
- State management — hoist `useState` to React Query / Zustand / URL params where appropriate.
- Floating-UI library — adopt `@radix-ui/react-dialog`, `sonner`, etc. (the mock doesn't portal/escape-trap/focus-trap).
- Form validation — wire Zod / react-hook-form.
- Auth + permissions — enforce server-side; staff-rights checks are visual only.
- i18n — thread `i18next` keys; mock is English-only.
- A11y audit — focus order, keyboard nav, screen-reader labels.
- Performance — memo / virtualize where prod data sizes warrant it.

The closer the design's mock data tracks the real schema, the more "residual" collapses into mechanical wiring. That's the strategy. The next section is how we make that explicit.

---

## Data contract pattern — making the design directly wireable

**Premise:** each visible field, button, and badge in the design corresponds to a real production field, mutation, or derived state. When the correspondence is explicit, the frontend agent doesn't have to guess.

Three levels of mapping. Level 1 is the baseline; Levels 2 and 3 are how we make the agent's job nearly mechanical.

### Level 1 — Mock data uses real schema names

Already mostly in effect. Example: `users.jsx`'s `MEMBER` object uses `first`, `last`, `dob`, `email`, `phone`, `ecName`, `ecPhone`, `allergies`. These should match (or alias to) the actual `users` / `user_emergency_contacts` columns. When in doubt, rename to match prod.

### Level 2 — Page-level `// DATA CONTRACT` comment

A header block at the top of each page jsx, naming the Supabase tables / queries / mutations the screen depends on:

```jsx
// =============================================================
// Users · Diver Profile
//
// DATA CONTRACT
//   READS
//     users                       — id, first_name, last_name, dob, language, email, phone
//     user_addresses              — line1, line2, zip, city, region, country
//     user_certifications [Hub]   — agency, level, issue_date, card_code, primary, specialty
//     user_affiliations           — center_id, status, since
//     trip_attendances            — trip_id, role, dive_count, max_depth, …
//     bookings                    — id, trip_id, status, amount, payment_method, …
//     diver_notes (center-scoped) — author_id, body, pinned, created_at
//     mobile_app_installs         — platform, version, last_seen
//
//   WRITES
//     PATCH users/:id                 — emergency contact, allergies, diet, sizing
//     PATCH user_addresses/:id        — address
//     POST  diver_notes               — add note
//     POST  hub/suspension_requests   — submit suspension to AlmaDiving Hub
//
//   DERIVED
//     total_dives  = SUM(trip_attendances.dive_count) for this user at this center
//     last_dive    = MAX(trip_attendances.date)
//     net_revenue  = SUM(bookings.amount) WHERE status IN ('completed','no-show')
// =============================================================
```

The agent reads this, opens the matching tables in prod, fetches the data, renders it. No reverse-engineering.

### Level 3 — Field-level `data-prod-field` attributes

For ambiguous fields, or when mock naming diverges from prod naming, annotate the rendered element:

```jsx
<input
  className="input"
  defaultValue={m.ecName}
  data-prod-field="users.emergency_contact_name"
/>
<div data-prod-field="users.allergies">{m.allergies || "None on file"}</div>
```

Invisible at runtime, ignored by React, but parsable by the agent. Use sparingly — only where the mapping isn't obvious from variable names.

### How to ask me to add a data contract

> "Add the data contract to **Users · Diver Profile**. The tables are:
> - `users`, `user_addresses` — see `apps/web/src/lib/db/schema.ts` lines 40-120
> - `user_certifications` lives in the Hub repo, mirrored via the `cert_view` materialized view
> - `trip_attendances`, `bookings`, `diver_notes`"

What I do: open the schema you point me at, write a Level 2 contract block at the top of `src/pages/users.jsx`, rename any mock fields that diverge, and add Level 3 attributes where needed.

The contract lives **in code** (the page jsx), not in a separate doc. It can never drift from the design.

---

## Archive policy

Move to `_archive/` when:
- A page has a "locked" snapshot you want to preserve while iterating on a new version.
- A backup is useful for diff but you don't want it loaded.

**Never delete.** If something falls out of relevance, archive it. The cost of keeping it is one folder entry.

---

## Recovering from a broken refactor

If `Koosto Console.html` or any plate stops loading:

1. **Open the browser console.** A `ReferenceError: X is not defined` tells you exactly which export is missing.
2. **Check `window.X`** in dev tools. If it's `undefined`, the file that should set it either didn't load or didn't export.
3. **Check script-load order** in `Koosto Console.html` against the order documented above.
4. **As a last resort:** `design_bak/Koosto Console.html` is the pre-refactor monolith. It still works standalone — open it directly.

---

*Last refactor: 2026-05-17 — monolith split into `src/` files, settings broken into per-sub-page, screen plates introduced. See git history for the change list.*
