# Typography & Button Proposals — AlmaDiving

## Current State Assessment

### What Works
- Color palette is strong and cohesive (ocean tones, warm surfaces)
- Status colors (green/amber/red) are clear and well-applied
- Card borders + surfaces create good depth without heavy shadows
- Reader 3-theme system (light/dark/sepia) is solid

### What's Missing
- **Typography has no rhythm.** Every heading looks like every other heading. `font-semibold` is used on 90% of text, creating flatness. There's no hierarchy ladder — a card title, a page heading, and a section label all feel the same weight.
- **Buttons are functional but lifeless.** They change color on hover and that's it. No depth, no physical response. For a "nautical instrument panel" metaphor, buttons should feel like switches and controls — satisfying to press, with subtle physical cues.
- **Inconsistent sizing.** Some buttons use `rounded`, others `rounded-lg`. Some are `py-2`, others `py-1.5` or `py-1`. Admin delete links have no padding at all. There's no button size "contract."
- **No typographic distinction between contexts.** The user dashboard, the course reader, and the admin panel all use the same system font at the same weights. They should have distinct moods.

---

## Proposal A: Typography Scale

### The Principle
Three typographic moods, one font stack. Differentiation comes from **weight**, **letter-spacing**, **line-height**, and **size ratios** — not from loading extra fonts.

### A1. User-Facing (Dashboard, Profile, Certifications, Courses Grid)

**Mood:** Warm, approachable, spacious. Like a resort lobby sign — clear and welcoming.

| Role | Current | Proposed | Why |
|------|---------|----------|-----|
| Page heading | `text-2xl font-bold` | `text-2xl font-semibold tracking-tight` | Bold → semibold reduces heaviness. `tracking-tight` (-0.025em) adds polish. |
| Section heading | `text-lg font-semibold` | `text-lg font-semibold` | Keep as-is — it works. |
| Card title | `text-lg font-semibold` | `text-base font-semibold` | One step down from section heading. Card titles shouldn't compete with section headers. |
| Body text | `text-sm text-ocean-700` | `text-sm text-ocean-700 leading-relaxed` | Add breathing room. Currently text feels dense. |
| Labels (above inputs) | `text-sm font-medium text-ocean-900` | `text-xs font-medium text-ocean-700 uppercase tracking-wide` | Labels should be quieter. Uppercase + tracking makes them scannable without competing with values. |
| Helper/meta text | `text-sm text-ocean-700` | `text-xs text-ocean-700` | Smaller for secondary info — creates better hierarchy. |
| Data values (dive counts, dates) | `text-sm` or `text-base` | `font-mono text-sm font-semibold text-ocean-900` | Monospace for data. Makes numbers scannable and distinct from labels. |

**CSS addition to `index.css`:**
```css
/* User-facing typography refinement */
.tracking-tight { letter-spacing: -0.025em; }
```
(Tailwind v4 may already include this — verify before adding.)

### A2. Course Reader (Light/Dark/Sepia)

**Mood:** Focused, bookish, distraction-free. Like a high-quality textbook.

| Role | Current | Proposed | Why |
|------|---------|----------|-----|
| Lesson title | `text-2xl font-bold` | `text-xl font-bold tracking-tight leading-tight` | Slightly smaller, tighter — the reader should feel intimate, not billboard-like. |
| Body (small) | `text-sm leading-relaxed` | `text-sm leading-relaxed` | Good as-is. |
| Body (medium) | `text-base leading-relaxed` | `text-base leading-[1.8]` | Increase line-height from 1.625 to 1.8. Reading long-form content needs air between lines. |
| Body (large) | `text-lg leading-loose` | `text-lg leading-[1.9]` | Even more generous. Large font readers often have vision needs. |
| Section cover title | on background image | `text-3xl font-bold tracking-tight` | Bolder for the "chapter start" moment. |
| Section cover objectives | rendered markdown | Add `leading-relaxed` to the goals container | More breathing room for bullet lists. |
| Quiz question | `text-lg font-medium` | `text-lg font-medium leading-snug` | Questions should feel compact and direct. |
| Quiz option text | inherits from parent | `text-base leading-normal` | Comfortable reading for answer options. |

**Key change:** Reader body `leading-relaxed` → `leading-[1.8]` for medium size. This is the single most impactful readability improvement. The reader should feel noticeably more breathable than the rest of the app.

### A3. Admin Panel

**Mood:** Dense, efficient, scannable. Like a flight operations board — maximum information density with clear hierarchy.

| Role | Current | Proposed | Why |
|------|---------|----------|-----|
| Page heading (e.g., "Admin") | `text-lg font-bold` | `text-base font-bold uppercase tracking-wide text-ocean-900` | Uppercase + tracking signals "system" context. Smaller because space is premium. |
| Section heading (card titles) | `text-base font-semibold` | `text-sm font-semibold uppercase tracking-wide text-ocean-700` | Uppercase labels for admin sections. Reads like instrument panel labels. |
| Sub-tab labels | `text-xs font-medium` | `text-xs font-semibold tracking-wide` | Slightly heavier for tab navigation. |
| Table headers | varies (often `text-xs text-ocean-700`) | `text-[11px] font-semibold uppercase tracking-wider text-ocean-700` | Classic table header pattern. `tracking-wider` for readability at small sizes. |
| Table data | `text-sm` | `text-sm tabular-nums` | `tabular-nums` aligns columns of numbers. Critical for trip counts, pax numbers. |
| Status text (small) | `text-xs text-ocean-700` | `text-xs text-ocean-700` | Good as-is — it's quiet. |
| Data readouts (dashboard stats) | `text-2xl font-bold text-ocean-500` | `text-2xl font-bold font-mono text-ocean-900` | Monospace for instrument-panel feel. Dark color for emphasis. |

**CSS addition:**
```css
/* Tabular numbers for aligned data columns */
.tabular-nums { font-variant-numeric: tabular-nums; }
```

### Summary: The Typography Ladder

```
                User-Facing           Reader              Admin
                ───────────           ──────              ─────
Mood:           Warm, spacious        Bookish, calm       Dense, efficient
Heading:        Semibold, tight       Bold, tight          Bold, UPPERCASE, tracked
Body:           Relaxed leading       Extra-relaxed (1.8)  Standard leading
Labels:         Uppercase, tracked    N/A                  Uppercase, wider tracking
Data:           Mono, semibold        N/A                  Mono, tabular-nums
Size range:     2xl → xs              3xl → sm             base → [11px]
```

---

## Proposal B: Button System

### The Principle
Buttons should feel like physical controls on a well-made instrument. Not skeuomorphic, but with subtle physical cues: a gentle bottom border that mimics depth (like a key on a keyboard), a smooth press response, and consistent proportions. The "missing something" is **tactile depth** — pure flat color swaps feel digital and cheap.

### B1. The Depth Border Technique

Add a subtle `box-shadow` or `border-bottom` that creates the illusion of a button sitting slightly raised from the surface. On hover, it lifts slightly more. On active/press, the border compresses — the button "pushes in."

**Primary button:**
```
Default:    bg-ocean-500, 1px bottom shadow (ocean-700 at 30% opacity)
Hover:      bg-ocean-400, subtle translateY(-1px), shadow extends 1px more
Active:     bg-ocean-500, translateY(0), shadow shrinks to 0 — "pressed"
Disabled:   opacity-50, no shadow, no hover
```

**CSS implementation:**
```css
/* Button depth system */
.btn-depth {
  box-shadow: 0 1px 0 0 rgba(26, 58, 92, 0.3),     /* ocean-700 at 30% — bottom edge */
              0 1px 3px 0 rgba(10, 37, 64, 0.08);    /* subtle ambient */
  transition: all 150ms ease;
}
.btn-depth:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 0 0 rgba(26, 58, 92, 0.3),
              0 2px 6px 0 rgba(10, 37, 64, 0.10);
}
.btn-depth:active {
  transform: translateY(0);
  box-shadow: 0 0 0 0 transparent,
              0 1px 2px 0 rgba(10, 37, 64, 0.06);
}
```

This is subtle — 1px of travel. But it makes buttons feel solid. Nautical instruments don't bounce, they click into place.

### B2. Size Scale (Strict)

Replace the current loose sizing with 3 non-negotiable tiers:

| Size | Height | Padding | Font | Radius | Usage |
|------|--------|---------|------|--------|-------|
| `sm` | 30px (py-1.5) | px-3 | text-xs font-medium | rounded-md (6px) | Inline actions, table row buttons, pill toggles |
| `md` | 36px (py-2) | px-4 | text-sm font-medium | rounded-lg (8px) | Default for all main actions |
| `lg` | 44px (py-2.5) | px-5 | text-base font-medium | rounded-lg (8px) | Auth pages, forms, hero CTAs |

**The rule:** No other sizes exist. `py-1`, `py-3`, `px-2`, `px-6` — all eliminated. Every button fits one of these three slots.

**Radius consistency:** `rounded-md` for `sm` (smaller buttons need smaller radius). `rounded-lg` for `md` and `lg`. Never `rounded` (4px is too small), never `rounded-xl` (too playful for instruments).

### B3. Variant Refinements

| Variant | Current | Proposed | The change |
|---------|---------|----------|------------|
| **Primary** | `bg-ocean-500 hover:bg-ocean-400` | `bg-ocean-500 hover:bg-ocean-400` + depth shadow + press animation | Add physicality. Color is correct. |
| **Secondary** | `bg-surface-2 text-ocean-900 hover:bg-surface-3` | `bg-surface-1 text-ocean-700 border border-surface-3 hover:border-ocean-400 hover:text-ocean-900` + depth shadow | Give it a visible border. Currently blends into the card background. On hover, the border tints toward ocean — shows interactivity. |
| **Outline** | `border-2 border-ocean-500 text-ocean-500 hover:bg-ocean-50` | `border border-ocean-500 text-ocean-500 hover:bg-ocean-50 hover:border-ocean-400` | `border-2` → `border` (2px → 1px). Thinner border is more refined. |
| **Danger** | `bg-red-critical hover:bg-red-critical` (no hover change!) | `bg-red-critical hover:bg-red-600` + depth shadow (red-tinted) | Current danger has NO hover feedback. Fix. Darker red on hover. |
| **Ghost** | `bg-transparent text-ocean-700 hover:bg-surface-2` | `bg-transparent text-ocean-700 hover:bg-surface-2 active:bg-surface-3` | Add active state for press feedback. No depth shadow — ghost is meant to be flat. |
| **Text link** (new) | N/A (inline `<button>` with `text-ocean-500`) | `text-ocean-500 hover:text-ocean-400 underline-offset-2 hover:underline` | For inline text actions like "Delete", "Edit", "View all". Currently these are unstyled text buttons with no consistent pattern. The underline-on-hover signals interactivity. |

### B4. Icon Buttons (New Pattern)

Many buttons are icon-only (close, settings, menu, arrows). Currently they have no consistent treatment.

| Variant | Spec | Usage |
|---------|------|-------|
| **Icon default** | `w-8 h-8 rounded-lg flex items-center justify-center text-ocean-700 hover:bg-surface-2 hover:text-ocean-900 active:bg-surface-3` | Top bar actions, close buttons, navigation arrows |
| **Icon on dark** | `w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-gray-100` | Reader dark mode, dark overlays |
| **Icon danger** | Same as default but `hover:bg-red-critical-bg hover:text-red-critical` | Delete icons, remove from list |

### B5. Transition Timing

Current: `transition-colors` (Tailwind default: 150ms ease).

Proposed: `transition-all duration-150 ease-out` — covers color, shadow, and transform together. `ease-out` feels snappier on release (instrument controls snap back).

### B6. Focus Rings

Current: `focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500` — works but the ring-offset creates a white gap that looks odd on warm surface-0 background.

Proposed: `focus-visible:ring-2 focus-visible:ring-ocean-500/40 focus-visible:ring-offset-0` — no gap, softer ring (40% opacity), and only on keyboard focus (not mouse click).

---

## Proposal C: Concrete Button Component Update

Putting B1-B6 together, the Button component would become:

```tsx
const baseStyles = `
  inline-flex items-center justify-center font-medium
  transition-all duration-150 ease-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500/40
  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none
`;

const variants = {
  primary: `
    bg-ocean-500 text-white
    shadow-[0_1px_0_0_rgba(26,58,92,0.3),0_1px_3px_0_rgba(10,37,64,0.08)]
    hover:bg-ocean-400 hover:-translate-y-px
    hover:shadow-[0_2px_0_0_rgba(26,58,92,0.3),0_2px_6px_0_rgba(10,37,64,0.10)]
    active:translate-y-0 active:shadow-[0_0_0_0_transparent,0_1px_2px_0_rgba(10,37,64,0.06)]
  `,
  secondary: `
    bg-surface-1 text-ocean-700 border border-surface-3
    shadow-[0_1px_0_0_rgba(232,228,219,0.8)]
    hover:border-ocean-400 hover:text-ocean-900 hover:-translate-y-px
    hover:shadow-[0_2px_0_0_rgba(232,228,219,0.8),0_1px_3px_0_rgba(10,37,64,0.06)]
    active:translate-y-0 active:shadow-none active:bg-surface-2
  `,
  outline: `
    border border-ocean-500 text-ocean-500 bg-transparent
    hover:bg-ocean-50 hover:border-ocean-400
    active:bg-ocean-100
  `,
  danger: `
    bg-red-critical text-white
    shadow-[0_1px_0_0_rgba(153,27,27,0.4),0_1px_3px_0_rgba(153,27,27,0.12)]
    hover:bg-[#c52222] hover:-translate-y-px
    hover:shadow-[0_2px_0_0_rgba(153,27,27,0.4),0_2px_6px_0_rgba(153,27,27,0.15)]
    active:translate-y-0 active:shadow-[0_0_0_0_transparent]
  `,
  ghost: `
    bg-transparent text-ocean-700
    hover:bg-surface-2 hover:text-ocean-900
    active:bg-surface-3
  `,
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',     // 30px height
  md: 'px-4 py-2 text-sm rounded-lg',        // 36px height
  lg: 'px-5 py-2.5 text-base rounded-lg',    // 44px height
};
```

---

## Visual Summary

```
BEFORE (current):
┌────────────────────┐   Flat color swap. No depth.
│    Save Changes    │   No distinction between hover/press.
└────────────────────┘   Blends into the card surface.

AFTER (proposed):
┌────────────────────┐
│    Save Changes    │   1px bottom shadow = raised from surface
│   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄ │   ← subtle bottom edge
└────────────────────┘

HOVER:
┌────────────────────┐
│    Save Changes    │   Lifts 1px (-translate-y-1px)
│                    │   Shadow extends slightly
│   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄ │
└────────────────────┘

ACTIVE (pressed):
┌────────────────────┐
│    Save Changes    │   Returns to baseline, shadow compresses
└────────────────────┘   Feels "clicked into place"
```

---

## Implementation Priority

1. **Button component update** (high impact, 1 file) — the depth shadow + press animation transforms every button in the app instantly
2. **Button size normalization** (medium effort) — grep+replace all inline `py-1`, `py-3`, `rounded` to the 3-tier system
3. **Reader line-height** (1 line change, huge readability win)
4. **Admin typography (uppercase labels, tabular-nums)** — incremental, can be done per-page
5. **User-facing typography (tracking-tight, label hierarchy)** — incremental

Each change is independent. You could ship just the button depth and it would already feel dramatically better.
