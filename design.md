---
title: DUEL Design System — Vault Index
type: reference
updated: 2026-04-26
---

# DUEL Design System

All design files live in the codebase — not duplicated here.

**Root:** `C:\Users\sylva\OneDrive\Skrivebord\DUEL\app\duel\`

## Files

| File | What it covers |
|------|---------------|
| `DESIGN.md` | **Direction 1: Underground** — master doc, vision, colors, type, components, copy rules |
| `design/DESIGN-arena.md` | **Direction 2: Arena** — alternative concept, not implemented |
| `design/SITEMAP.md` | Full site IA — every page, user journeys, responsive nav |
| `design/WIREFRAMES.md` | Low-fi sketches for every page (landing, lobby, match, wallet, profile, 404) |
| `design/tokens.css` | Single source of truth for all design tokens (colors, spacing, radii, motion) |
| `design/base.css` | Full component library in CSS |
| `design/pages/landing.html` | HTML mockup — landing page |
| `design/pages/library.html` | HTML mockup — game library |
| `design/pages/card-duel.html` | HTML mockup — card duel page |

## Directions

| Layer | Visual system | Feel |
|-------|--------------|------|
| Platform (all pages outside match) | Underground — `#18181b` charcoal, red accent, bone text | Confrontational, restrained, library of duels |
| In-game (match screens only) | True black `#000000`, amber accent, same type system | Arena floor — darker, more intense, no platform UI chrome |

Arena as a separate named direction is retired. The distinction is now platform vs in-game, not two competing themes.

## Key decisions

- **Platform vs in-game:** Platform pages use Underground. Match screens use true black + amber. Never mix — the visual shift from lobby to match is intentional.
- **Colors:** Platform accent = red (`#dc2626`). In-game accent = amber (`#f59e0b`). Red never in-game, amber never on platform.
- **Aesthetic:** Dark charcoal (`#18181b`), not pitch black. Red as tension, not decoration. "Library of confrontations."
- **Typography:** Hero fluid clamp(5rem–12rem), font-black, tight tracking. Monospace only for counts/timers/codes.
- **Copy rules:** Short, aggressive, direct. Stakes over features. No exclamation marks except win states. ALL CAPS for eyebrow labels and game actions only.
- **Game library:** Flat numbered list with filter tabs and live player counts — not Netflix rows. Stake range visible per game. Decided 2026-04-30.
- **Duel details:** Underdo — split lines, mirrored layouts. If you have to point it out, it's too much.
- **Transitions:** Finding opponent → match needs intentional motion — hard cuts not acceptable at this boundary.

## Links

- [[duel_product|DUEL Product Note]]
- [[_context|DUEL Context]]
