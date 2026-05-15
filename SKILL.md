---
name: koosto-design
description: Use this skill to generate well-branded interfaces and assets for Koosto / AlmaDiving, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the DiveWH web app (admin + diver-facing) and the AlmaDiving mobile app.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- `README.md` — company context, content fundamentals, visual foundations, iconography
- `system.md` — exhaustive component patterns, spacing rules, admin hierarchy, hard rules
- `typography-buttons.md` — typography proposals and button system rationale
- `colors_and_type.css` — all CSS vars + font-face declarations (source of truth)
- `fonts/` — self-hosted Manrope, Inter, Switzer, Space Grotesk, RealistNarrow
- `assets/` — Koosto logo mark + wordmark
- `preview/` — 12 design system cards (colors, type, buttons, badges, spacing, elevation, forms, cards)
- `ui_kits/web-diver/index.html` — Diver-facing web app prototype (Discover Trips screen)
- `ui_kits/web-admin/index.html` — Admin dashboard prototype (Planning Organization + Trips + Dashboard)
- `ui_kits/mobile/index.html` — AlmaDiving mobile app prototype (iOS, 5 screens + trip detail)

## Key design rules (never violate)

- Admin: `rounded-lg` buttons only. Flat `ocean-500` CTAs. Borders required. No glass on panels.
- Diver/mobile: `rounded-full` pill CTAs. `ocean-deep→ocean-deep-light` gradient. No 1px border sections.
- Pure black (#000) never used — always `ocean-900` (#0a2540)
- No new accent colors — palette is closed (ocean, teal, status only)
- All fonts self-hosted from `fonts/` — no CDN
- Ionicons for mobile icons (`@expo/vector-icons` / `ionicons`)
- Emoji not used as UI chrome (only in operator-typed content)
