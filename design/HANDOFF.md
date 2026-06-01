# HANDOFF — read this first

> **You are resuming an in-flight design project.** This file is the single entry
> point. Read it top to bottom before touching anything. It tells you what this is,
> where everything lives, what's done, what's queued, and the rules that keep the
> work from drifting. Budget 10 minutes here and you'll save hours.

_Last updated: 2026-06-01 (end of the founding design thread, before account migration)._

---

## 0 · 30-second orientation

- This repo has **two layers**:
  1. **Root `/` = the Koosto Design System** (brand, tokens, type, shell spec). Read **`/README.md`** and **`/system.md`**.
  2. **`/design/` = the working prototype** of the Koosto Console admin app (the live, navigable thing). Read **`/design/README.md`**.
- **Most active work happens in `/design/`.** The design-system root is stable reference; the prototype is where screens get built and iterated.
- The biggest body of work is the **Equipment module** (6 screens). Its full design rationale is **`/design/docs/equipment-module.md`** — ~700 lines, the densest and most important doc in the project. Read it before touching any equipment screen.

> ⚠️ **The trap a previous Claude Code session fell into:** it read `/README.md`, didn't notice `/design/` had its own README and a `docs/` folder, and missed 90% of the context. **Don't.** The map below lists every crucial file.

---

## 1 · What this project is

**Koosto** is a B2B SaaS dive-center platform (production codename **DiveWH**). This project is the **design source of truth** for the operator-facing admin web app — the "Koosto Console." It is built as a navigable HTML/JSX prototype, not the production code. The production repo lives separately (see `/README.md` for the GitHub link); this folder hands off to it.

Two consumers read this work:
- **Claude · Design** (you, if resuming design) — iterates on screens.
- **Claude · Code** (the frontend agent) — ports screens to React 19 + Tailwind v4 in the prod repo, using the data contracts and the Components Review's PROD blocks.

---

## 2 · Crucial files — the map

```
/                                   ← DESIGN SYSTEM (stable reference)
├── README.md                       ← brand, palette, type, shell spec, file index
├── system.md                       ← full shell CSS + rationale (rail/subpanel/topbar)
├── colors_and_type.css             ← canonical color + type CSS vars
│
└── design/                         ← THE WORKING PROTOTYPE (active work)
    ├── HANDOFF.md                  ← you are here
    ├── README.md                   ← prototype architecture, workflow, decisions log,
    │                                  "how to prompt me", plate-vs-console, data-contract pattern
    ├── docs/
    │   ├── equipment-module.md     ← ★ MOST IMPORTANT DOC. Every equipment decision,
    │   │                              concept model, formulas, data contract, flow map.
    │   └── ROADMAP.md              ← backlog / queued items / what's next
    │
    ├── Koosto Console.html         ← the full navigable app. Loads everything in src/.
    ├── Components Review.html       ← design-system spec: every recurring primitive + PROD block
    │
    ├── screens/                    ← one HTML "plate" per screen, for focused review
    ├── src/
    │   ├── shell.jsx               ← rail + subpanel + topbar + omnisearch + mount (loads LAST)
    │   ├── nav.jsx                 ← NAV / SUBNAV / SEARCH_RESULTS
    │   ├── icons.jsx               ← icon library
    │   ├── components/             ← LOCKED primitives extracted from Components Review (Button, Chip)
    │   ├── tweaks/                 ← tweaks-panel framework
    │   └── pages/                  ← ★ ONE FILE OWNS EACH SCREEN. Edit here, never the HTML.
    │       ├── dashboard.jsx · users.jsx
    │       ├── equipment/          ← inventory · stock · log · analytics · index · inventory-modals
    │       ├── planning/           ← dashboard · calendar · organize · validation · boats · destinations · logs · index
    │       └── settings/           ← 12 sub-pages + _shared.jsx + index.jsx router
    ├── styles/                     ← tokens.css · shell.css · components.css · planning.css · activity-colors.css
    ├── assets/ · fonts/
    └── _archive/                   ← old versions kept for diff (never deleted)
```

**If you read only three files:** `design/README.md` (workflow + rules), `design/docs/equipment-module.md` (the deep domain logic), and this file.

---

## 3 · Current state — per screen

| Screen | State | Owner file |
|---|---|---|
| Dashboard | **placeholder** | `src/pages/dashboard.jsx` |
| Users · Diver Profile | built (5 tabs, promote-to-staff modal, role chips) | `src/pages/users.jsx` |
| Planning · Dashboard | built — canonical design | `src/pages/planning/dashboard.jsx` |
| Planning · (calendar / organize / validation / boats / destinations / logs) | scaffolded | `src/pages/planning/*` |
| Equipment · Inventory | **built — rich.** Action menus, flag modals, reg-set swap, maintenance pool, top-bar Filter/Find, pagination | `src/pages/equipment/inventory.jsx` + `inventory-modals.jsx` |
| Equipment · Stock | **built — rich.** Batches, FIFO, restock, assemble set, pending-disposal bridge, situation-aware alerts | `src/pages/equipment/stock.jsx` |
| Equipment · Log | built | `src/pages/equipment/log.jsx` |
| Equipment · Analytics | built — activity-aware cost-per-use, convergence model | `src/pages/equipment/analytics.jsx` |
| Settings · (12 sub-pages) | drafted; `equipment-definitions` + `equipment-settings` built rich (catalog, service/EOL rules) | `src/pages/settings/*` |
| Courses · Staff · Bookings · Finance (main pages) | **not designed** — nav stubs only | — |

> The `design/README.md` screen index table is the canonical version; if it disagrees with this, trust whichever was edited more recently and **reconcile them**.

---

## 4 · The non-negotiable rules (why the project stays clean)

1. **Edit `src/pages/<x>.jsx`, never the HTML.** The Console and the plates are mount-points. All three (`README.md` rule #1, this rule, the decisions log) say the same thing because the project's one near-death experience was a 4,700-line monolith that drifted.
2. **Edit a shared primitive → edit it in `Components Review.html` AND (once locked) `src/components/<Name>.jsx`.** They move together.
3. **Add/rename/move a screen → update `design/README.md`'s screen index + the `screens/<X>.html` plate in the same pass.** Zero-drift policy.
4. **Never delete — archive to `_archive/`.**
5. **Design-to-functionality:** mock data uses real schema names; each screen carries (or should carry) a `// DATA CONTRACT` header so the frontend agent wires, not guesses. See `design/README.md → Data contract pattern`.

---

## 5 · Gotchas that will bite you

- **Blank Equipment/Planning screen after an edit = stale script cache.** Page jsx files are loaded with `?v=YYYYMMDD` query strings in `Koosto Console.html`. **When you edit a page file, bump its `?v=` token** or the browser serves the old version and the section renders empty. This recurred many times — it is almost always the cause of "the section won't load."
- **Script-load order is load-bearing.** Each `.jsx` is its own Babel scope; cross-file refs go through `window`. `_shared.jsx` before settings sub-pages; `index.jsx` routers after their sub-pages; `shell.jsx` LAST. Full order in `design/README.md → Script-load order`. A `ReferenceError: X is not defined` = wrong order or a missing `window.X` export.
- **Plates render wider than the Console content area** (~1480px vs viewport−370px). Width-sensitive grids can wrap differently. When a wrap bug is reported, check both surfaces.
- **Plate-only vs shared edits:** page content, tokens, components.css, planning.css, icons → shared (propagate to Console). Plate breadcrumb bar / mount frame / inline `<style>` → plate-only. Rail/subpanel/topbar → Console-only. Table in `design/README.md → Will a plate fix propagate`.

---

## 6 · How to resume work

- **To iterate a screen:** open its plate (`screens/<X>.html`) or the Console, read the owner jsx, edit in place, bump `?v=`. Use the prompt templates in `design/README.md → How to prompt me`.
- **To work on Equipment:** read `docs/equipment-module.md` first — the domain logic (indexed vs non-indexed, reg-set composites, maintenance pool, FIFO, service/EOL rules, analytics formulas) is subtle and fully captured there.
- **To lock a primitive:** follow the lifecycle in `design/README.md → Components Review contract` (inline demo → extract to `src/components/<Name>.jsx` → adopt across pages).
- **What's queued:** `docs/ROADMAP.md`.

---

## 7 · Backup / migration checklist (for the human)

When moving this project to a new account or GitHub:
1. Download the whole project as a zip (root, not just `/design/`).
2. The **two READMEs + `HANDOFF.md` + `docs/`** are the continuity layer — confirm they're in the zip.
3. On the new session, paste the contents of **this file** (or point the agent at `design/HANDOFF.md`) as the very first message.
4. Fonts in `/design/fonts/` and `/fonts/` are self-hosted — they must travel with the zip or type breaks.
5. Re-open `Koosto Console.html`; if a section is blank, it's the cache `?v=` gotcha (§5), not lost work.
