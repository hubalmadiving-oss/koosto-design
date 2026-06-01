# Equipment module — design decisions

> Synthesis of every design decision taken for the **Koosto Equipment module** during the conversation thread that produced the current screens.
> Audience: dev team implementing the production code at `apps/web/src/`. Pair with `Components Review.html` (visual primitives) and the page JSX (reference structure).

Last updated: 2026-05-31

---

## 1 · Scope of the module

The Equipment module is the source of truth for every piece of physical gear the dive center owns. It feeds three other modules:

- **Planning** — gear assignment, spare-reg reservation, tank-blend availability.
- **Booking** — implicit (equipment availability gates trip sales).
- **Finance** — purchase cost and lifecycle for depreciation reports.

It owns four screens (subnav under "Equipment"):

| Screen | Purpose | Status |
|---|---|---|
| `Equipment · Inventory` | Operational state of every item RIGHT NOW (lend, return, swap, flag broken/lost/maintenance). | Drafted |
| `Equipment · Stock` | Quantity, lifecycle, purchases. Add unit, assemble a set, restock, audit, retire. | Drafted |
| `Equipment · Log` | Chronological event log. | Placeholder |
| `Equipment · Analytics` | Lifecycle, depreciation, breakage, EOL projections. | Placeholder |

The catalog that powers the dropdowns in Stock lives one level up, in `Settings · Equipment · Definitions`. Inventory-wide settings (numbering format, service intervals) live in `Settings · Equipment · Settings`.

---

## 2 · Core conceptual model

Every piece of equipment is one of two kinds. The kind dictates the data shape, the UI, and the operational vocabulary.

### Indexed items
Individually-serialized — each unit has a unique code (`BCD-12`, `CPU-03`, `SET-008`).
- BCD
- Regulator Set (composite — see § 4)
- Dive Computer
- Tank (see § 5 for the "indexed-but-batch-managed" pattern)

Indexed items live in `equipment_items` rows.

### Non-indexed (bulk) items
Tracked per brand/model/(thickness or volume)/size — quantities only, no per-unit identity.
- Wetsuit · Fins · Mask · Snorkel · Compass · Torch
- 1st Stage · 2nd Stage · Gauge (regulator components — see § 4)
- Weight Belt
- Weights (special — see § 6)

Non-indexed items live in `equipment_stock_batches` rows. One row per purchase batch. Multiple batches per SKU coexist (powers FIFO rotation).

**Decision rule:** if you can't physically tell two units apart at a glance, they're non-indexed. If service dates, customer attribution, or individual loan history matter for that gear category, they're indexed.

---

## 3 · Catalog model (Settings · Definitions)

The catalog defines **what models exist** independent of stock counts.

```
Brand  ── (global, flat list)
   │
   ↓
Catalog entry  (type, brand, model, attrs)
   │
   ↓
Stock  (batches or indexed units pointing to a catalog entry)
```

### Brands
Single global list. No per-type variant. A brand only matters if it has at least one model attached in the catalog. Disabling a brand isn't a concept — deleting it cascades through the catalog (with confirm).

### Types
Closed list (today: 14 types). Each type declares its **attribute schema** — the per-model fields the operator picks when adding a model.

| Type | Per-model attributes | Notes |
|---|---|---|
| BCD | — | indexed in stock |
| Regulator · 1st stage | `connector: DIN \| INT` | non-indexed component pool |
| Regulator · 2nd stage | `role: primary \| octopus` | non-indexed component pool |
| Gauge | — | non-indexed component pool |
| Tank | `volume`, `gas`, `activities[]` | **special** — see § 5 |
| Wetsuit | `thickness: 3mm \| 5mm \| 7mm`, `activities[]` | non-indexed |
| Fins | `activities[]` | non-indexed |
| Mask | `activities[]` | non-indexed |
| Snorkel | `activities[]` | non-indexed |
| Weight Belt | — | non-indexed, unisize |
| Weights | (kg catalog, not brand-keyed) | **special** — see § 6 |
| Dive Computer | — | indexed in stock |
| Torch | — | non-indexed |
| Compass | — | non-indexed |

**System rule — attribute-to-dropdown propagation.** Every attribute declared in Definitions surfaces as a filter step in Stock's restock dropdown chain. Example:
- Wetsuit chain: `Type → Brand → Thickness → Model → Size`
- Tank chain:    `Type → Brand → Volume → Gas → Model`
- Fins chain:    `Type → Brand → Model → Size`
- Mask chain:    `Type → Brand → Model` (no size)

Don't hand-roll dropdown chains per type — derive them from the catalog schema.

### What Definitions does NOT own
- Sizes live in Stock (per batch).
- Quantities live in Stock.
- Service intervals live in `Settings · Equipment · Settings` (TBD with product team).
- Index numbering format lives in `Settings · Equipment · Settings`.

---

## 4 · Regulator Sets — composite indexed item

A regulator set is an indexed item assembled from up to 4 components, all of which are **non-indexed stock** in their own right:

```
SET-001
 ├── 1st stage   ← 1× from equipment_stock_batches (type=reg1)
 ├── 2nd stage primary  ← 1× from equipment_stock_batches (type=reg2)
 ├── 2nd stage octopus  ← 1× from equipment_stock_batches (type=reg2)  [OPTIONAL — sets can be 3-component]
 └── gauge       ← 1× from equipment_stock_batches (type=gauge)        [OPTIONAL]
```

### Assembly modes — hybrid pricing

Sets can be created in two ways, each producing the same indexed item. Distinguishable in the data, both rendered side-by-side in the Stock table.

#### Mode A — Assembled
Operator picks one of each component from stock. Components are deducted atomically. The set has **no own** `unit_cost` — its cost is *derived* as the sum of its components' batch unit costs.

#### Mode B — Purchased
Operator received a pre-packaged set with a single price tag (factory-built). Operator enters one `unit_cost` for the whole set. The component breakdown still exists (for service tracking) but components are *not* deducted from stock — they entered as part of the set purchase.

In the Stock table, mode is shown via a small badge on each set row:
- `Σ €640` — assembled, sum of components
- `€780`   — purchased, single price

### Lifecycle — swap component

Real dive-shop behavior: when a component fails (e.g. one 2nd stage free-flows), the operator pulls only that part. The set stays in inventory; just the failed component goes to maintenance.

**Swap Component action (Inventory):**

1. Operator clicks `⋯ → Swap component` on a regulator-set row.
2. Modal lists the 4 (or 3) slots with current brand/model and service-due chips.
3. Operator picks a slot.
4. Picks a reason: Service / Broken / Lost.
5. Picks a replacement from available stock:
   - For **2nd stage** swaps: show ALL 2nd stages in stock with their primary/octopus tag chips. Sort so the matching role is first. Allow override — operator can fit a primary as an octopus or vice versa if stock is short (rare but real).
   - For **1st stage / gauge** swaps: show all matching type, brand-grouped, sorted by age.
   - Or leave the slot empty (set becomes "incomplete" — visible amber state in Inventory).
6. Confirm — the failed component goes to maintenance pool / broken pool / lost pool; the spare is consumed from stock; the set is updated.

---

## 5 · Tanks — indexed but batch-managed

Tanks are special. Operationally they're treated like bulk stock (you do annual visual inspections in a single sweep, 5-year hydro tests in batches), but each tank needs a unique identity for traceability when one fails.

**Resolution:** tanks are **indexed** in the data model (each has a code, e.g. `TNK-014`), but Inventory exposes a generic **Batch service** action (see § 7) that lets the operator select N tanks at once, filtered by volume + gas, for a chosen service rule (visual inspection / hydro test). The batch action is not tank-specific code — it's driven by any service rule flagged `batchOperable` (§ Settings). Tanks are simply the most common case.

So the data carries individual identity (a single tank can fail its hydro and be retired without affecting the rest), while the day-to-day UI doesn't force per-tank clicking.

### Tank attributes
- `volume` — comes from `Settings · Planning · Settings` (per-center configurable). Common values: 8L, 10L, 12L, 15L.
- `gas` — comes from `Settings · Planning · Settings`. Common: Air, Nitrox 32, Nitrox 36.
- **No activity attribute** — tanks are diving-only by definition (removed 2026-05-27; the activity chips were dropped from the Add-tank modal and the catalog row).

**Why volume + gas live in Planning settings**, not Definitions: tank planning is driven by trip type (Nitrox dives, deep dives need 15L), so the source list lives where it's most often configured. Definitions reads from it.

---

## 6 · Weights & Weight Belts — special pair

### Weights
Inert lead. No brand. No model. Defined as a **catalog of kg values** (e.g. `1 kg, 1.5 kg, 2 kg, 3 kg, 4 kg, 5 kg`). Lives as a special block inside Settings · Definitions (not inside the "Brands × Models" structure).

In Stock, weights have no `Brand · Model` columns — only `Size (kg) · Available · Acquired · …`.

In Inventory, weights cannot be sent to maintenance (they're indestructible) — the action menu omits "Send to maintenance". They can only be marked lost or broken (broken being rare — a cracked weight or torn pouch).

### Weight Belts
Tracked as a regular non-indexed item in the catalog: `Brand · Model`, unisize. They have their own batches in Stock.

### Pairing — Weight ↔ Belt loss propagation

In real life, weights and belts often disappear together. Inventory acknowledges this without forcing a strict pair model in the data:

- **Marking weights lost** — the modal offers an optional checkbox: *"☐ Mark a weight belt as lost and retire it from inventory"*. Default unchecked. If checked, the operator picks a belt SKU.
- **Marking a weight belt lost** — the modal offers an optional checkbox: *"☐ Mark weights as lost and retire them from inventory"*. Default unchecked. If checked, the operator enters a per-kg quantity (`N × 1kg, N × 2kg, …`).

No "pair" entity is created. The propagation is operator-driven, recorded in the audit log as two linked events.

---

## 7 · Operational actions — the action menu pattern

The Inventory `⋯` dropdown is the canonical interaction. Actions are context-conditional — visibility depends on the item's current state and type.

| Action | When visible | Effect |
|---|---|---|
| **Lend out…** | status = available | Marks unavailable for trip planning. |
| **Mark returned** | status = lent / maintenance / service / **lost** | Returns to available. Lost is recoverable — things get found; status is decoupled from stock so a found item returns cleanly. |
| **Send to service…** | type has a service rule; status = available **or broken** | Pre-fills the rule label. Logs notes (provider, reason). |
| **Send to maintenance…** | always except weights (inert); status = available **or broken** | Goes to maintenance pool. Logs reason. |
| **Swap components…** | type = regulator_set only | The distinctive set action — opens the multi-select component modal (§ 4 / § 7b). |
| **Mark broken…** | status = available | Hidden once broken. |
| **Mark lost…** | status = available | Hidden once broken/out. |
| **View history / Edit details** | always (permanent, below separator) | |

**State-conditional collapse (worst-wins):**
- **available** → full menu (lend, service, maintenance, swap, broken, lost).
- **lent / maintenance / service / lost** → only **Mark returned** + permanent View/Edit. These are recoverable holding states.
- **broken** → only the repair routes: **Send to service · Send to maintenance · Swap components** (sets) + permanent View/Edit. No lend/broken/lost — a broken item must be routed to a fix or scrapped, not re-lent.

**Action menu rendering.** The `⋯` dropdown renders in a **fixed-position layer** anchored to the trigger via `getBoundingClientRect`, not as an absolutely-positioned child. This escapes the section card's `overflow:hidden` (which was clipping the menu behind rows below — the v2 z-depth bug). The menu closes on scroll/resize/outside-click.

**Batch service (generic).** Any section whose type has a `batchOperable` service rule shows a **Batch service** button in its header. Opens a modal: pick the service rule, filter candidates (tanks → volume + gas), multi-select with select-all, enter inspector + date. One pass resets every selected unit's next-due date. Not tank-specific — driven entirely by the rule's `batchOperable` flag set in Settings.

### State-change modals with smart customer attribution

The **Mark broken** and **Mark lost** modals propose recent divers who had the item assigned, derived from pax-equipment history:
- Show the **last 3 assignments** (most recent first), as a Recent tab.
- A Search tab looks up any member by name or dive ID.
- If the item was never assigned, the picker opens straight on Search.

This replaces the free-text "Customer involved" field from the earlier design.

### Service-due + EOL surfacing

Rows read their service and EOL state live from the rules in `Settings · Equipment · Settings`:
- **Service:** an available/lent item within a rule's `reminderLeadDays` of its `serviceDue` date shows the advisory **"Service due in N d"** text (orange) in the Current-state column. **No SERVICE status chip** — it would overload the status column and muddy the semantics (available is available; in-service is in-service). Overdue under a `block` policy escalates the text to red.
- **EOL:** an item past (or within the grace window of) its EOL threshold shows an `EOL` chip.
- **"In service" is a real status** distinct from "In maintenance" (`service` vs `maintenance`). Both are amber, both unavailable, but they read differently and capture different intent (routine service vs repair).
- The **issues callout** (rendered **above** the condition strip) and the **condition strip** aggregate service-due and EOL counts alongside maintenance/broken/lost.
- Pip precedence (worst-wins): broken/lost > EOL > maintenance/service > lent > available.

### Customer search rule

The Search tab in the customer picker triggers autocomplete only at **≥ 3 characters** (shows "Type at least 3 characters to search" below the threshold). Narrows results and avoids per-keystroke DB load. Same rule applies anywhere member lookup appears.

### Retirement as wrap, not standalone

Retirement is **not** a top-level action in Inventory. It's a *modal checkbox* on the state-change reason. Logic:

- **Mark broken** modal includes: `☐ Retire from inventory now (unfixable)`. Default unchecked → goes to maintenance pool. Checked → retired immediately. The broken-note is preserved either way.
- **Mark lost** modal — losing it is effectively retiring it; the wrap is automatic. The operator just sees the modal, fills in reason + customer + (for weights only) the paired belt option.

The standalone "Retire from inventory" action is therefore gone from the menu. Retirement only happens through:
1. A state-change reason (broken+unfixable, lost)
2. A deliberate retire from `Equipment · Stock` for aging stock decisions

---

## 7b · Assembled items & the Maintenance pool

### The `isAssembly` property (must be backed by code)

Most catalog types are atomic — a BCD, a wetsuit, a tank is one trackable object (indexed or non-indexed). One type is different: **regulator_set is an assembly compounded from other stock items** (1st stage + 2nd stage primary + [octopus] + gauge, each a non-indexed component in stock).

This should be a first-class catalog-type property, not a `regulator_set` hard-code:

```
catalog_type.isAssembly   : boolean
catalog_type.composedOf   : [{ slot, componentType, required }]
   regulator_set →
     [ { slot:"stage1",  componentType:"reg1",  required:true  },
       { slot:"stagePr", componentType:"reg2",  required:true  },
       { slot:"stageOc", componentType:"reg2",  required:false },   // 3-comp sets
       { slot:"gauge",   componentType:"gauge", required:false } ]
```

When a future assembly type is added to the catalog, the swap/maintenance-pool machinery activates automatically off this flag. **This is the deep functionality to document + implement** so adding an assembly type doesn't require new bespoke code.

### Why the pool exists (assembly-scoped, not global)

Atomic items never need a pool: a BCD that goes to service *is itself* the tracked unit — it flips status and returns. Clean.

An assembly is different. When a faulty component is **swapped out** of a set:
- the set keeps running (spare fitted) or goes incomplete (slot left empty),
- the **pulled component** becomes a homeless object — not in stock, not in a set, not individually indexed.

The **Maintenance pool** is the holding area that catches these orphaned components and drives their resolution back into component stock (once serviced/repaired) or to scrap (unfixable). It is **scoped per assembly type** — never a global junk drawer — so the "which set / which assembly did this leave" context is preserved as new assembly types appear.

### Broken-component limbo (the real problem the pool solves)

A pulled component can be in one of two intents:
- **Service / maintenance** → enters the pool with a clear return path ("mark serviced → back to component stock").
- **Broken** → a *limbo within the limbo*. It's not available, not in maintenance, just "broken" and awaiting an operator decision:
  - **Scrap it** (garbage) — already handled by the `☐ Retire now (unfixable)` checkbox on the Mark-components-broken modal, OR
  - **Send to maintenance** (warranty repair / outsourced fix) — it then joins the pool's normal resolution flow.

So the pool must render broken components as an explicit **decision-required** state, not a passive holding row.

### Assembly status derivation

A set's status is **derived from its components**:
- Any component broken (not yet swapped) → set status = **broken**, unavailable to the gear engine.
- Any component pulled to service/maintenance with no replacement → set status = **in maintenance / in service**, unavailable.
- Component swapped for a spare → set returns to **available** (engine can assign it again).
- This mirrors how atomic items flag available/unavailable to the planning gear-assignment engine.

### Placement decision (open)

The pool lives **on the Inventory screen** (it's the consequence of actions taken there). A top-bar **Maintenance pool** button (next to Filter / Find, with a count badge) is the agreed entry point. The exact surface — dedicated section vs. per-assembly scoped panel vs. modal — is **still under discussion**; the button is shipped without an action until decided. The user rejected a cramped right-side slide-over. Leading candidate: a focused view (section or modal) grouped per assembly type, each pulled part showing `which set · reason · when · note` with a primary **Return to stock** / **Scrap** action and an explicit broken-decision treatment.

---

## 7c · Top bar, filtering & pagination

### Top-bar trio (Inventory)
`Filter` · `Find item` · `Maintenance pool` (with waiting-count badge). These are screen-level utilities, distinct from per-row/section actions.

- **Filter** — dropdown of grouped axes (not yet wired): *service due · service due < 30 days · EOL status · in maintenance · lent to pax · lent to other centers*. Multi-select within the dropdown; applies across all sections.
- **Find item** — opens an inline search field with built-in autocomplete (≥ 3 chars) to jump to a specific item by code / brand / model across every section.
- **Maintenance pool** — entry point to the assembly maintenance pool (§ 7b). Badge shows count of components awaiting resolution. Action deferred pending pool design.

### Pagination
Each section renders **25 rows**, then a **"Load N more · M hidden"** button appends another 25. Applies to every section; matters most for Tanks and Regulator Sets at large centers (100+ units). Keeps the page scannable.

### Cross-cutting filter (top bar) vs in-section status chips
Two complementary filtering systems, not redundant:

- **In-section status chips** (each indexed section header): `All · Avail. · Lent · Service · Maint. · Broken · Lost` with live counts; only render when that status has items. Clicking isolates ONE status inside ONE section. State is **local to the section** — chips in BCD don't affect Tanks.
- **Top-bar Filter** (cross-cutting): a dropdown of operational views that span **all** sections at once. Selecting one shows a summary bar (count + Clear) and narrows every section to matching indexed items (non-indexed sections collapse, since these axes are unit-level). Current set:
  - Lent to other dive centers · Lent to divers (pax) · Service due ≤ 30 days · Service overdue (blocking) · End-of-life reached/near · In maintenance · in service · Broken — awaiting decision · Never serviced · Idle — not assigned in 90 days.

**Tank exclusion rule:** tanks are mixed/fungible — never assigned to a specific diver in practice. So `lent_pax`, `lent_external`, and `idle_90` explicitly exclude tanks to avoid false positives (the engine flags tank counts in aggregate, not per-unit loans).

### Find item (inline autocomplete)
The `Find item` top-bar button opens an inline search field. **Minimum 3 characters** before results appear (narrows search, avoids per-keystroke compute). Matches across **code · brand · model · variant**. Picking a result clears active filters, scrolls the matching row (`data-inv-code` anchor) into view, and pulses it. Same ≥3-char rule as the customer-attribution search.

---

### Pagination
High-count sections (Tanks, Regulator Sets) default to **25 rows** with a **Load more** control that reveals the next 25. Load-more keeps the page light without forcing a separate paginated route. Dev note: server-side this should be a paged query, not a client slice.

---

## 7d · Dynamic value sources (no hard-coding)

Several pickers must read their option lists from configuration, never hard-coded constants:
- **Weight kg values** — the per-kg quantity inputs (weight↔belt loss pairing) and the Stock weights SKU list come from the **Weights catalog** in `Settings · Equipment · Definitions`.
- **Tank volume + gas** — from `Settings · Planning · Settings`.
- **Catalog dropdown chains** (Stock restock) — every attribute declared on a catalog type becomes a filter step (§ 3).
- **Service / EOL rules** — from `Settings · Equipment · Settings`.

---

## 8 · Stock screen architecture

### Top utilities (not per-item actions)
A single utility strip at the top: an **inventory-reconciliation** summary (last audit date / lines / variances) + **Audit log** link + **Export CSV** + primary **Run inventory count**. All Add / Restock CTAs live in their section headers, not at the top — the top stays about reconciliation + export only.

### Per-section breakdown
1. **Top utilities** — reconciliation summary + audit log + export + run count.
2. **Stock Alerts** — Low stock / Aging stock / Last audit summary (to be refined in a later turn).
3. **Indexed sections** — one per indexed type (BCD, Tanks, Dive Computer). Each header carries its own `+ Add …` CTA.
4. **Regulator Sets** — indexed section with hybrid pricing; header carries **Assemble a set** + **Add purchased set**.
5. **Regulator components** — 3 first-class sub-sections (1st Stages · 2nd Stages · Gauges) rendered as non-indexed stock.
6. **Non-indexed sections** — one per bulk type (Wetsuits · Fins · Mask · Snorkel · Weight Belts · Weights). Each header carries `+ Restock`.

### Table consistency
Indexed and non-indexed share a column rhythm. Non-indexed drops the Code column (batches have no per-unit code) and adds a **Qty** column between Model and Variant:

```
Indexed:     Code · Brand · Model · Variant · Acquired · Supplier · Age · Unit cost · ⋯
Non-indexed: Brand · Model · Qty · Variant · Acquired · Supplier · Age · Unit cost · ⋯
```

Non-indexed rows are grouped by `(brand, model, [thickness|volume], size)`. **Each batch is one row.** No "initial count" column — only current Qty (deeper history lives in Log / Analytics). FIFO is signaled by a `FIFO` tag on the oldest batch of a SKU.

### Per-row action menu (Stock)
Same `⋯` pattern as Inventory, granular by kind:
- **Indexed unit:** Edit · Retire
- **Non-indexed batch:** Adjust quantity (±N) · Edit batch · Remove batch (data correction)

### Adjust vs Remove batch
- **Adjust quantity (±N)** — between-audit correction. Direction + qty + required reason, logged as `MANUAL ADJUSTMENT`. Covers donations (+), audit remediation (−), and partial aging-stock write-offs (− N of a batch).
- **Remove batch (data correction)** — type-to-confirm deletion of a whole batch entered by mistake (wrong supplier/date/duplicate). **Not** retirement; explicitly framed so operators don't use it to write off real stock.

**Source-of-truth rule:** the **Inventory Count** (its own dedicated screen, built by the dev team) is the authoritative reconciliation. Adjust is for between-audit corrections only.

**Retirement boundary:** indexed-item retirement happens through Inventory state changes (broken+unfixable, lost), never from Stock. Stock only removes *bad data*, not real units.

### Pending Disposal — the Inventory→Stock bridge
When a **non-indexed** unit is flagged broken/lost in Inventory, the available count drops there immediately, but the physical unit still sits in a batch in Stock until written off. The bridge keeps the two screens from silently diverging:

1. Each Inventory broken/lost flag on a bulk unit creates a **pending-disposal record** (`equipment_pending_disposal`: type, brand, model, variant, qty, reason, note, flagged_by, since, suggested_batch).
2. A red-accented **Pending disposal card** renders near the top of Stock (only when non-empty), listing each flagged SKU with reason chip + note + who/when.
3. **Resolve** opens a modal: confirm context + a **batch picker** (matching batches, oldest **FIFO · NEXT OUT** suggested, overridable; batches without enough qty disabled).
4. One confirm — **"Write off N units · decrements batch · clears the Inventory flag"** — does both halves atomically.

This is why "Adjust −N" and "disposal" stay distinct: Adjust is a free correction (donation, miscount); disposal flows from a real operational flag, so it never double-counts. The matcher keys on brand + model + variant (size/thickness), not model alone.

### Multi-batch grouping (non-indexed)
When a SKU (same computed brand/model/variant) has **more than one batch**, the section renders a **group header row** (brand · model · variant · total qty · "N batches · oldest first") followed by indented `↳ batch` rows that show only batch-distinct data (qty, acquired, supplier, age, unit cost), oldest tagged FIFO. Single-batch SKUs render as one flat row. This makes "one reference, several purchases at different dates/prices" legible without repeating brand/model on every line.

---

## 9 · Restock chain — dropdown rules

Restock is the bulk-add flow. Selects are **catalog-backed**, no free text:

```
1. Type
2. Brand   (only brands attached to this type)
3. Attribute(s) declared on this type, in catalog order:
     wetsuit → Thickness
     tank    → Volume, Gas
     fins/mask/snorkel/etc. → (none)
4. Model   (filtered by previous picks)
5. Size    (situational — only if the catalog model carries sizes)
6. Acquisition · Inventory:  Quantity
7. Acquisition · Financial:  Supplier · Unit cost · Acquired on
```

**Form rules** (locked in Components Review § Dialogs):
- One column. No side-by-side fields.
- Uppercase eyebrow + 1px hairline separator between sections.
- The **Financial** subsection is toggleable via the Tweaks panel (`financialFields`) so the prototype can preview a center without the Finance module.

---

## 10 · Activity colors

A first-class three-color palette outside the design system, because activity is a cross-cutting concept that touches the fitting engine, equipment catalog, trip cards, member profiles.

- **Diving** — ocean-deep blue (`#1e6091`)
- **Freediving** — slate cyan (`#0e7c8a`)
- **Snorkeling** — warm coral (`#d97742`)

Tokens live in `styles/activity-colors.css`. Two reusable classes: `.act-chip` (toggleable) and `.act-tag` (read-only). Documented in Components Review § Activity colors.

**Hard rule.** Never hardcode hex for an activity. Always go through the token (`--activity-diving`, etc.) or the canonical chip/tag class.

Applies to the fitting engine's matching of models → trip activity types. Tanks are diving-only and therefore carry **no** activity attribute.

---

## 10b · Service & EOL rules (Settings · Equipment · Settings)

Two rule families, both per equipment type, configured in `Settings · Equipment · Settings` and consumed by Inventory + Stock + Analytics.

### Service rules (multi-rule per type)
Each type can carry several service rules (tanks: visual inspection + hydro test; regulators: annual service). Rule shape:

```
{ id, label, frequencyMonths, reminderLeadDays, overduePolicy: 'warn'|'block'|'none', batchOperable: bool }
```

- Rendered as a natural-language sentence + chips so it reads/edits like prose.
- `batchOperable` is the parametric switch that enables the generic **Batch service** action in Inventory for that type.
- `overduePolicy: block` means the unit can't be assigned by Planning until serviced.

### Where the per-item service-type list comes from (dev contract)
When the operator sends an item (or assembly component) to service/maintenance, the **service-type dropdown** in that action is **derived from the service rules** of that item's type — NOT a hard-coded list. Tanks offer "Visual inspection / Hydro test" because those are their two service rules; a regulator offers "Annual service". This makes the choice parametric and operator-configurable: add a service rule in Settings and it appears in the action automatically. Maintenance (repair) actions take a free-text note instead, since repairs aren't scheduled rules.

---

## 10c · Analytics — metrics, data sources & formulas (dev contract)

Every Analytics metric is either a **flow** (windowed by the period selector) or a **balance/all-time** snapshot. The page never replays the event log on load — all heavy metrics read pre-aggregated columns/snapshots (see caching note at the end).

### Page controls
- **Period** — `1M · 1Q · 1Y`. Governs flow metrics only.
- **Activity filter** — `All · Diving · Freediving · Snorkeling`. The only screen where activity is a page filter. Activities are parametric (center config); a disabled activity renders its dependent cards in a **locked/greyed state** (see § Component: dependency-gated card). Selecting an activity scopes KPIs + cost-per-use to that activity's required kit (`ACTIVITY_KIT[activity]`, itself derived from catalog activity tags).

### Operational KPI row (per period × activity)
| KPI | Formula | Basis |
|---|---|---|
| Utilization rate | `Σ unit-days assigned ÷ Σ unit-days available` over window | flow |
| Customer lending rate | `Σ units lent to pax ÷ total units` (avg over window) | flow |
| Outage rate | `Σ unit-days in maintenance/service/broken ÷ Σ unit-days` | flow (lower = better) |
| Inventory variation | net unit count change over window (`+N / −N`) | flow |

### Finance KPI row (gated by Finance module)
| KPI | Formula | Basis |
|---|---|---|
| Total fleet value | `Σ (acq_cost − depreciation)` across active units | all-time · now |
| Spent this period | `Σ acq_cost of batches/units acquired in window` | flow |
| Loss value | `Σ residual_value of units lost/broken-retired in window` | flow |
| Cost per activity-use | diving headline of § Cost-per-use | rolling |

### Cost per use (the centerpiece)
Computed **per item**, aggregated **per type** for display. Diving customer gear only; tanks optional (excluded unless owned).

```
realized_cpu(item)  = (acq_cost + service_to_date) / uses_to_date
trailing_rate r     = uses_in_trailing_12m / 12          # months; deseasonalizes
remaining_life L     = max(0, EOL_age_months − current_age_months)   # age-based EOL
projected_uses U*   = uses_to_date + r · L
projected_cpu(item) = (acq_cost + projected_service) / U*

type_realized  = Σ(acq+service)_type / Σ(uses)_type
type_projected = Σ(acq+projected_service)_type / Σ(U*)_type
```

**Convergence property (what the chart shows):** as `current_age → EOL_age`, `L → 0`, so `U* → uses_to_date` and `projected_cpu → realized_cpu`. The two curves provably meet at EOL. The gap between them is forecast uncertainty.

**Confidence / forecast band:** band half-width ≈ `k · SD(r) · L`, and `SD(r) ∝ 1/√uses`. So the band narrows every milestone as observations accumulate. Displayed confidence `= 1 − band_now / band_at_first_milestone`.

**Milestone cadence** (when forecast snapshots are recomputed — slow but meaningful):
`1M · 1Q · 2Q · 1Y · 1Y+2Q · 2Y · 2Y+2Q · 3Y · 3Y+2Q · 4Y · 5Y · …`
Each snapshot stores `{ milestone, realized_cpu, projected_cpu, band }` per type/activity. The chart plots realized only up to NOW (the last reached milestone); projected + band extend to EOL.

### Convergence chart (2/3 · 1/3 layout)
- Left 2/3: Y-axis €/dive, X-axis the milestone cadence, NOW divider between observed (solid realized line + dots) and forecast (dashed projected + shrinking band), ring marker at the EOL meeting point. **Diving only** (the mandatory activity; freediving/snorkeling are optional, so a fleet-wide convergence anchors on diving).
- Right 1/3: the maths in prose + a live model-confidence bar.
- Until 1M is reached the chart is a labelled placeholder (no realized points yet).

### Lifecycle — breakage / loss
All-time baseline `rate = lifetime_events / lifetime_units_of_type` per type, plus a trend sparkline. **No period delta** — a rate only means something against the full history; a windowed breakage % on small counts is noise.

### Stock rotation
All-time. Flags the oldest batch of each multi-batch SKU as `stale` when it has sat unused beyond a threshold (drives the FIFO "next out" hint).

### All-time financials (gated)
`avg_unit_price[type] = Σ acq_cost / count`; `total_invested = Σ acq_cost`. Pure balance — ignores the period selector.

### Caching (dev note, important)
Never replay the log per page load. Maintain rolling per-item columns (`use_count`, `service_cost_total`) incremented on trip-close / service-close. Recompute forecast snapshots only at milestones. Rate SE shrinks ∝ 1/√uses, so refresh frequency can be low without losing accuracy.

### EOL rules (one per type)
```
{ basis: 'age'|'usage'|'manual', thresholdMonths?, thresholdUses?, action: 'flag'|'auto-retire', graceMonths }
```

- `flag` warns in Inventory; `auto-retire` removes the unit when the threshold hits.
- `graceMonths` opens an early-warning window before EOL.
- **Known limitation (deferred):** the current model assumes EOL counts from new. Second-hand equipment added to stock needs a per-unit EOL override or an acquisition-condition input. Flagged for a dedicated discussion; not yet designed.

---

## 11 · Data contract (proposed)

```
equipment_brands
  id, name

equipment_catalog
  id, type, brand_id, model
  attrs JSONB   -- type-aware:
                --   reg1:    { connector }
                --   reg2:    { role }
                --   tank:    { volume, gas }            -- no activities (diving-only)
                --   wetsuit: { thickness, activities[] }
                --   fins/mask/snorkel: { activities[] }

equipment_service_rules    -- per type, multiple rows allowed
  id, type, label, frequency_months, reminder_lead_days,
  overdue_policy 'warn'|'block'|'none', batch_operable BOOLEAN

equipment_eol_rules        -- per type, one row
  type, basis 'age'|'usage'|'manual',
  threshold_months, threshold_uses,
  action 'flag'|'auto-retire', grace_months

equipment_items            -- indexed units
  id, code, type, catalog_id (FK), size,
  acquired_at, retired_at, status,
  components JSONB           -- regulator_set only
  cost_mode 'assembled'|'purchased', unit_cost

equipment_stock_batches    -- non-indexed
  id, type, catalog_id (FK), size,
  acquired_at, qty, qty_initial,
  supplier, unit_cost,
  manual_adjustment BOOLEAN, adjustment_reason TEXT

equipment_weights_catalog  -- special: kg list only
  values[] TEXT  -- e.g. ["1 kg","2 kg","3 kg"]

equipment_audits
  id, started_at, completed_at, by_user
  lines[] { type, brand, model, size, counted, expected, delta }

equipment_log              -- chronological event stream
  id, at, by_user, kind, target_kind, target_id, payload JSONB
  -- kind: lend|return|maintenance|broken|lost|swap|retire|restock|adjust|audit
```

---

## 12 · Decisions log

Concrete decisions taken in this thread. Each is reversible but should be explicitly re-litigated before changing.

| Date | Decision |
|---|---|
| 2026-05-21 | Inventory and Stock are separate screens. Operational events live in Inventory; quantity/lifecycle in Stock. |
| 2026-05-21 | Reg set components (1st/2nd stage, gauge) are non-indexed stock items, not catalog-only entities. |
| 2026-05-21 | The 5-step reg-set wizard is replaced by a single Assemble modal with 4 cards (1st · primary · octopus · gauge, in that order). |
| 2026-05-21 | FIFO rotation hint on every non-indexed SKU's oldest batch. |
| 2026-05-22 | Action menu (`⋯`) replaces the 6-icon-row pattern. Actions are state-and-type conditional. |
| 2026-05-27 | Dialog forms are one-column with uppercase eyebrow + 1px hairline sections. No side-by-side fields. |
| 2026-05-27 | Acquisition is split into Inventory (always shown) and Financial (toggleable, prepares for Finance module split). |
| 2026-05-27 | Activity colors live in their own token file outside the design system. Diving = ocean, Freediving = slate cyan, Snorkeling = warm coral. |
| 2026-05-27 | Settings · Definitions vocabulary is "Brand". Never "Manufacturer". |
| 2026-05-27 | Index numbering format moves from Definitions to `Settings · Equipment · Settings`. |
| 2026-05-28 | Customer attribution in Mark broken/lost: last 3 assignments + lookup. No free text. |
| 2026-05-28 | Retirement is wrapped inside state-change reasons (broken+unfixable, lost), not a standalone action. |
| 2026-05-28 | Weight ↔ Belt loss propagation is an optional modal checkbox, not a data-model pair. |
| 2026-05-28 | Tanks are indexed in data, batch-managed in UI (annual inspection / 5-year hydro as bulk operations). |
| 2026-05-28 | Reg sets support hybrid pricing: `assembled` (sum of components) or `purchased` (single price), per-set choice. |
| 2026-05-28 | Adjust button is a between-audit `±N batch with reason`. Inventory Count remains the source of truth. |
| 2026-05-30 | Lost is a recoverable status (Mark returned available) — status decoupled from stock so found items return cleanly. |
| 2026-05-30 | Broken collapses the action menu to repair routes only (service / maintenance / swap). No re-lend of a broken item. |
| 2026-05-30 | Set service/maintenance/broken open one multi-select component modal; whole-set selection skips swapping and applies the status to the set; CTA adapts ("Send whole set…"). Only **Swap components** keeps the word "components" in the menu. |
| 2026-05-30 | `isAssembly` + `composedOf` is a first-class catalog-type property. The maintenance pool + swap machinery activate off it, not off a `regulator_set` hard-code. |
| 2026-05-30 | Maintenance pool is assembly-scoped (not global), lives on Inventory, entry via top-bar button + count badge. Surface (section/modal) still open; slide-over rejected. |
| 2026-05-30 | Customer search autocompletes at ≥ 3 characters. |
| 2026-05-30 | Sections paginate at 25 rows + "Load more". |
| 2026-05-30 | No SERVICE status chip — service-due is advisory text in Current-state only. "In service" is a distinct real status from "In maintenance". |
| 2026-05-29 | Service & EOL rules live in `Settings · Equipment · Settings`. Service = multi-rule per type with `batchOperable` switch; EOL = one rule per type (age/usage/manual). |
| 2026-05-29 | Batch operations are generic, driven by any `batchOperable` service rule — not tank-specific. |
| 2026-05-29 | Tanks carry no activity attribute (diving-only). Activity chips removed from the tank model. |
| 2026-05-29 | Weights labelled in kg via numeric-only input + fixed `kg` suffix. |
| 2026-05-29 | Stock top simplified to reconciliation + audit-log + export + run-count; Add/Restock CTAs moved into section headers. |
| 2026-05-29 | Stock per-row menu: indexed = Edit/Retire; batch = Adjust/Edit/Remove. "Remove batch" is data-correction only, distinct from retirement. |
| 2026-05-29 | Inventory action menu renders in a fixed layer (escapes `overflow:hidden`) — fixes the z-depth clipping bug. |
| 2026-05-29 | "Mark returned" applies to maintenance/service as well as lent. |
| 2026-05-29 | All page-internal helpers are scope-prefixed (`Inv*`, `Stk*`, `DEF_*`) to avoid the shared-Babel-scope collision class. |

---

| 2026-05-31 | "Acquired on" is an equipment field (drives EOL/age), not financial — moved out of the Finance-gated block into Acquisition · Inventory (always shown). |
| 2026-05-31 | Second-hand gear: no new field. Operator back-dates "Acquired on" to the original first-purchase date; EOL computes from true age. |
| 2026-05-31 | Quantity hints are kind-specific: indexed = "N individually-coded units"; non-indexed = "N units into a new batch". No FIFO jargon in the hint. |
| 2026-05-31 | Pending-disposal bridge: non-indexed broken/lost flags from Inventory create pending records resolved against a batch in Stock (write-off + clear-flag in one pass). Keeps the two screens from diverging. |
| 2026-05-31 | Cross-cutting top-bar Filter (spanning views) is distinct from per-section status chips (local isolation). Tanks excluded from pax/external/idle filters (fungible, never per-unit loaned). |
| 2026-05-31 | Multi-batch SKUs render as a group header + indented `↳ batch` rows; single-batch SKUs stay flat. |

---

## 13 · Open items

These weren't designed in this thread and need product input:

- **Maintenance pool surface** — the focused modal ships (grouped by assembly, broken-on-top). The per-component resolution to component-stock on "Mark returned" is the wiring still owed.
- **Stock alerts refinement** — Low/Aging/Audit cards need a pass to make them situation-aware.
- **Flexible EOL for second-hand equipment** — handled for now by back-dating "Acquired on"; a per-unit EOL override / acquisition-condition input is the proper fix. Dedicated discussion pending. Likely touches Stock.
- **Equipment assignment to weight belts** (Planning) — belts aren't assigned during gear assignment yet; affects whether the weight↔belt loss pairing can pre-fill from trip history.

---

## 14 · Log screen (built)

Chronological event feed — the operator's backtrack tool. Every action that changes an item's **state or quantity** in Inventory or Stock writes one log row.

**Event kinds logged:** lend · return · maintenance · service · broken · lost · swap · retire · restock · adjust · remove-batch · disposal-resolve · audit (inventory count) · batch-service.

**Row shape:** `timestamp · actor · kind chip · target (code or SKU + variant) · human summary · delta (qty/state change)`. Clickable target jumps to the item in Inventory/Stock.

**Filters:** by kind, by type, by actor, by period. The "Audit log" button in Stock's top utilities is a shortcut into this screen pre-filtered to `kind = audit`.

**Inventory-count entries** are logged with extended payload: scope (all / type / flagged), lines checked, variances found, per-line deltas, who ran it, duration. This makes a count fully reconstructable from the log.

---

## 14b · Inventory Count — the three scopes (dev contract)

"Run inventory count" opens a dedicated count workflow (dev-team build; design exposes only the entry modal + scope picker). The three scopes define what the physical count covers:

- **All equipment** — full physical recount of every SKU + indexed unit. The quarterly/annual reconciliation. Longest, most authoritative.
- **Single type** — recount one type (e.g. just wetsuits). For spot-checks or when one category looks off.
- **Flagged only** — re-verify only units currently broken/lost/in-service. Fast confirmation that the system state still matches reality before a decision (e.g. confirm a "lost" item is really gone before retiring).

The count is the **source of truth**: where physical ≠ system, the count writes the correction (adjust ±N) and logs each variance. Industry practice baked in: blind count (counter doesn't see expected qty until after entry), variance threshold flagging, and a sign-off step. Adjust (between-audit) and the count (authoritative) never conflict — adjust is provisional, the count overrides.

---

## 15 · Component: dependency-gated card (design-system pattern)

A reusable state for any card/metric whose value can't be computed because a prerequisite (module, activity, setting) is off. Seen first on Analytics cost-per-use when an activity is disabled.

**Visual:** dashed border · `surface-0` background · ~0.85 opacity · lock icon top-right · muted title · one line explaining *what's missing* and *where to enable it* (link to the relevant Settings screen). No fake numbers, no zeros — the card explicitly states it can't compute.

**Use everywhere a value is conditional:** Finance-gated KPIs, activity-gated cost-per-use, planning-gated tank metrics, etc. → **promote to Components Review + design system** so every screen treats "locked because dependency off" identically.

---

## 16 · Cross-screen flow map

```
Settings · Definitions ── catalog (brands × models × attrs) ──▶ Stock dropdowns
Settings · Settings ───── service rules ─────────▶ Inventory service-due chips + Batch service
                    └──── EOL rules ─────────────▶ Inventory EOL chips · Analytics convergence · Stock aging
Stock ── add/assemble/restock ──▶ creates units/batches ──▶ Inventory shows operational state
Inventory ── broken/lost (bulk) ──▶ pending-disposal ──▶ Stock resolves (write-off + clear flag)
Inventory ── swap/maintenance (assembly) ──▶ Maintenance pool ──▶ back to component stock or scrap
Inventory + Stock ── every state/qty change ──▶ Log
Trip-close / service-close ── increments use_count, service_cost_total ──▶ Analytics (cached)
```
