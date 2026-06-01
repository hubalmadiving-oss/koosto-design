# ROADMAP / Backlog

> Queued work, in rough priority order. Each item: what it is, where it lives, and
> what's needed to close it. Move items to "Done" (bottom) when shipped, with a date.
> This is the running memory of "what's left" — keep it honest.

_Last updated: 2026-06-01._

---

## Near-term (designed-but-unwired, or one focused turn each)

### 1. Maintenance-pool resolution wiring
- **What:** the Maintenance Pool modal lists parked items (broken-on-top, grouped by assembly). The resolution action — broken component → **"Mark returned to component stock"** (back to available, re-usable by the fitting engine) — is the last unwired piece. Broken→service/maintenance is already a status flip + toast (no modal, by decision).
- **Where:** `src/pages/equipment/inventory.jsx` + `inventory-modals.jsx`. Concept doc: `docs/equipment-module.md §7b`.
- **Needed:** wire the "Mark returned" action so a serviced/repaired spare re-enters the component stock pool and the set can re-assemble.

### 2. Second-hand EOL
- **What:** EOL currently assumes brand-new acquisition. For used gear, the **"Acquired on" date** in the Stock add/restock modal drives EOL backward from a past date. Agreed approach: a hint on the date field ("if second-hand, set the original purchase date") + move "Acquired on" **out** of the finance-gated acquisition block (it's equipment data, not financial).
- **Where:** Stock add/restock modal in `src/pages/equipment/stock.jsx`. Concept: `docs/equipment-module.md` (EOL rules §10b).
- **Needed:** its own focused turn — touches the modal layout + EOL compute note in docs.

### 3. Card-variant grammar — RULES UNDER DISCUSSION
- **What:** the Card-variants section in Components Review documents anatomy (label·context·value·visual·footer) and visual types (line/bar/ring). Open question: **govern the variants** so KPI / progress / chart cards don't drift in height or value-position. Proposed rules (awaiting sign-off): (a) the anchor map is invariant — `value` never moves across variants; (b) a closed set of height tiers (compact / standard / tall) instead of ad-hoc heights; (c) variation lives ONLY in the `visual` slot; (d) each context→variant pairing documented. **Do not implement until the human signs off on the rule set.**
- **Where:** `Components Review.html` (Card variants section). Pattern doc: `docs/equipment-module.md §15` (dependency-gated card).

### 4. Dependency-gated card → design system
- **What:** the "value can't be computed because a prerequisite is off" card state (greyed, explains why). Documented in `docs/equipment-module.md §15` and shown on Analytics. Should be promoted into the design-system proper (root) and the Components Review as a locked pattern, alongside the card-variant grammar above.

---

## Mid-term

### 5. Lock the inline primitives
- **What:** several primitives still live as inline demos in Components Review and should be extracted to real `src/components/<Name>.jsx` (lifecycle in `design/README.md`). Candidates already designed: **ModalShell, StatusPip + StatusChip, ActionMenu, Toast, Card**. Only **Button** and **Chip** are locked so far.
- **Needed:** per-primitive sign-off ("lock the X"), then extract + adopt across pages.

### 6. Equipment · Inventory Count workflow
- **What:** "Run inventory count" exposes only the entry modal + scope picker (all equipment / single type / flagged only) in design. The actual count workflow (put stock in count mode, adjust ± against physical, write variance to log) is a **dev-team build**. Three scopes defined in `docs/equipment-module.md §14b`.
- **Needed:** dev spec; design may draft the count screen later.

### 7. Tank cost-per-use line in Analytics
- **What:** the CPU table is activity-aware and excludes tanks for now (tanks are often rented-in, not owned; assignment isn't per-unit). Adding a tank line is a **complex code change** — deferred pending a dev-team discussion.

### 8. Top-level section main pages (not yet designed)
- **Dashboard** (currently placeholder), **Courses, Staff, Bookings, Finance** — nav stubs only in `nav.jsx`. Each needs: owner jsx, screen plate, README index entry, Console wiring.

---

## Backlog (big / needs product input)

### 9. Spare-parts stock taxonomy
- **What:** a "real" spare-parts inventory distinct from diving items — regulator hoses, BCD inflators, o-rings, anything used to *repair* an item rather than rent it. Different taxonomy from the current rentable-gear model. Flagged during the maintenance-pool discussion as a separate, sizeable concept.
- **Needed:** taxonomy design + product input. Not started.

### 10. Weight ↔ belt assignment in Planning
- **What:** weights and weight belts pair (1 belt + N weights). The Inventory flag modal already handles the loss-pairing (mark weights lost → optional belt; mark belt lost → optional per-kg weights, kg list dynamic from Definitions). But **belt assignment in the gear-assignment / fitting flow** isn't designed — cross-module into Planning.

### 11. Non-indexed retirement ↔ stock linkage
- **What:** marking a non-indexed unit broken in Inventory decrements the on-shelf count, but linking that specific physical removal to a **specific batch** in Stock (so the right batch is debited) is a combined UI/UX/code topic. Pending-disposal bridge is the current half-answer.

---

## Done (shipped this thread)

- Equipment module: Inventory, Stock, Log, Analytics fully built; Settings · Definitions + Settings · Equipment · Settings (service/EOL rules) built.
- Inventory: action-menu pattern, context-conditional actions, flag modals (broken/lost/maintenance/service), reg-set component swap, maintenance-pool modal, top-bar Filter (cross-cutting views) + Find (≥3-char autocomplete), pagination (25 + load-more).
- Stock: batch model, FIFO next-out tagging, restock (catalog-backed dropdown chains), assemble-set modal, pending-disposal bridge, situation-aware stock alerts.
- Analytics: activity-aware cost-per-use table, convergence/forecast model (milestone snapshots), financial KPIs gated by finance module.
- Components Review: dependency-gated card, full card-variant anatomy + visual-types grammar, toast redesign.
- Users · Diver Profile: role chips, single-cert mock, promote-to-staff modal.
- Docs: `equipment-module.md` §1–16; this ROADMAP; `HANDOFF.md`.
