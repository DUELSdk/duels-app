---
title: DUEL Design System — Vault Index
type: reference
updated: 2026-04-26
---

# DUEL Design System

All design files live in the codebase or website prototypes — not duplicated here.

## Files

| File | What it covers |
|------|---------------|
| `app/duel/DESIGN.md` | Master design doc — vision, colors, type, components, copy, animation |
| `app/duel/app/globals.css` | Live CSS tokens and component styles |
| `website/designs/DUEL Hi-Fi.html` | Hi-fi prototype — reference for any page build |
| `website/lo-fi-wireframes/DUEL Wireframes.html` | Lo-fi wireframes — page structure reference |
| `website/mid-fi/pages/` | Mid-fi HTML pages (landing, library, card-duel) |

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
