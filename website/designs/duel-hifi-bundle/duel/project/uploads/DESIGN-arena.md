# DUEL — Design Direction: Arena

Alternative to `../DESIGN.md`. Not implemented. Concept only.

**Concept:** Open stadium, not fight club. Loud numbers, broadcast energy, electric contrast. The duel is a public event — players are athletes, the platform is the arena.

---

## Vision

Everything here is visible. High stakes played in the open, under stadium lights. Scores are the hero. The platform doesn't whisper — it announces.

- **Feel:** Championship scoreboard. Sports broadcast. F1 timing screen.
- **Not:** Underground, moody, intimate.
- **Yes:** True black and white with one electric accent. Numbers huge. Stats everywhere. Unashamed.
- **Duel details:** Symmetry is architectural — two halves of the screen, mirrored, always equal weight.

---

## Color

### Platform

| Role | Value | Usage |
|---|---|---|
| Background | `#000000` | True black — stadium lights pop harder against it |
| Surface | white at 5% opacity | Cards, panels |
| Surface dim | white at 2% opacity | Empty states, locked sections |
| Border | white at 12% opacity | Default card/panel borders |
| Border hover | white at 30% opacity | On hover |
| Text — primary | `#ffffff` | Headings, scores, key data |
| Text — secondary | white at 60% opacity | Body, descriptions |
| Text — tertiary | white at 35% opacity | Hints, labels |
| Text — disabled | white at 20% opacity | Locked UI |
| Accent | `#2563EB` (blue-600) | Primary CTAs, highlights, live indicators |
| Accent bright | `#3B82F6` (blue-500) | Hover, active |
| Accent dim | blue at 10% opacity | Callout backgrounds |
| Win | `#22C55E` (green-500) | Win states |
| Loss | `#EF4444` (red-500) | Loss states |
| Live | `#EF4444` (red-500) | Live match indicator — pulse animation |
| Neutral result | white at 40% opacity | Draw / tie |

### In-game only

| Role | Value | Usage |
|---|---|---|
| Player 1 | `#2563EB` (blue-600) | Player 1 game pieces |
| Player 2 | `#F59E0B` (amber-500) | Player 2 game pieces |
| Win highlight | `#22C55E` (green-500) | Winning move |

> **Rule:** Blue is the platform accent. Player pieces use blue vs amber for clear side identity. Never use accent blue for game pieces outside the match view.

---

## Typography

| Element | Size | Weight | Other |
|---|---|---|---|
| Score / hero number | fluid — min 6rem, max 16rem | Black (900) | Tabular nums, no tracking adjustment |
| Page title | 2.5rem (40px) | Black (900) | Tight tracking, ALL CAPS |
| Section title | 1.125rem (18px) | Bold | ALL CAPS, wide tracking |
| Eyebrow / label | 0.6875rem (11px) | Bold | ALL CAPS, very wide tracking, white at 35% |
| Body | 0.875rem (14px) | Regular | white at 60%, relaxed line height |
| Small / hint | 0.75rem (12px) | Regular | white at 35% |
| Monospace | 0.875rem (14px) | Monospace | Scores, timers, counts, ratings — use often |
| Nav brand | 1.25rem (20px) | Black (900) | Tight tracking, ALL CAPS |

Numbers are first-class citizens. Scores, streaks, purse sizes — make them big. Monospace on all numeric data so columns align.

Page titles and section titles: ALL CAPS. This direction is louder.

---

## Layout

| Page type | Width | Padding |
|---|---|---|
| Content pages | Full width | 24px sides, 48px vertical |
| Focused pages (wallet, profile) | Max 800px centered | 24px sides, 48px vertical |
| Game pages | Max 720px centered | 24px sides, 40px vertical |

- Section gap: 64px — more air between sections
- Gap within a section: 24px
- Gap between items: 16px
- Nav height: 56px — taller, more presence

### Split layouts

Where DESIGN.md uses subtle split lines, Arena uses architectural symmetry — two-column layouts at match level, score flanked by player names, clear left/right ownership at all times.

---

## Radius

| Element | Radius |
|---|---|
| Large card | 4px — sharper, harder edges |
| Medium card | 4px |
| Small element | 2px |
| Pill / badge | Full (9999px) |
| Button | 4px |

Less rounding = more authority. Circles and pills still used for tags and status indicators.

---

## Components

### Nav

Sticky. 56px tall. True black at 98% opacity — no blur. 1px bottom border at white 15%.

Left: **DUEL** — black weight, ALL CAPS, tight tracking. White always (no hover color shift).
Center/right: GAMES, TOURNAMENTS in ALL CAPS small.
Right: balance pill (blue border, blue text), profile avatar (white border only).

The nav reads like a scoreboard header — no softness.

---

### Score display

The hero element on match pages and anywhere a result is shown.

- Two columns, equal width, player names at top (small, white 40%)
- Score in the center — massive, tabular, white
- A thin 1px vertical rule divides the two halves — the only decorative element
- Win side: score pulses green briefly on point scored
- Live matches: red dot + "LIVE" label in eyebrow style, pulsing

---

### Cards

Two variants:

- **Standard:** white at 5% fill, white at 12% border. Hover: border lifts to white at 30%.
- **Dim / locked:** white at 2% fill, white at 6% border. No hover.

No accent callout card variant — blue callouts are reserved for live match state only.

---

### Buttons

| Type | Description |
|---|---|
| Primary | Blue-600 fill, white text, black weight, ALL CAPS. Hover: blue-500. Height 48px. Radius 4px. |
| Secondary | No fill, white at 10% border, white at 60% text, ALL CAPS. Hover: white text, white at 25% border. Height 40px. |
| Disabled | No fill, white at 6% border, white at 20% text. Not interactive. |
| Live CTA | Blue fill with red LIVE dot prepended. "ENTER LIVE MATCH" — reserved for live match entry only. |
| Game action (in-game) | White fill, black text, black weight, ALL CAPS, wide tracking. Hover: white at 85%. |

---

### Badges / Tags

- **Status:** white at 8% fill, white at 40% text, white at 12% border. ALL CAPS. Pill.
- **Live:** red at 15% fill, red-400 text, red at 25% border. Pulsing dot. Pill.
- **Accent tag:** blue at 12% fill, blue-400 text, blue at 20% border. Small, sharp corners.

---

### Stats strip

Horizontal row of 4 key platform stats — displayed prominently on landing, shown at top of profile.

Each stat: large monospace number, small ALL CAPS label below it. Separated by 1px vertical rules. No card background — stats float directly on the page surface.

---

## Game Library

### Philosophy

A catalog of events, not a menu of options. Each game is a discipline. The library is a schedule board — think airport departures, not app store.

### Layout

Flat list — no Netflix rows. Games listed vertically with a horizontal rule between each. Each row:

- Left: game name (bold, medium size) + one-line description
- Center: live count ("3 LIVE") in blue monospace if matches active, otherwise blank
- Right: purse range ("10–500 kr") in monospace + "ENTER →" CTA

No thumbnails. No images. Pure information.

---

## Writing

- Brand name: **DUEL** — always ALL CAPS
- Page titles: ALL CAPS, no punctuation
- Section titles: ALL CAPS
- Body copy: sentence case, measured tone — not aggressive, but direct
- Numbers: always monospace, always tabular
- CTAs: ALL CAPS action words (`ENTER`, `LOCK IN`, `JOIN`)
- Currency: Danish format (`1.000 kr`)
- No exclamation marks except win states (`YOU WIN`)
- Live indicators: always present tense (`3 LIVE`, `MATCH IN PROGRESS`)
- Describe the event, not the feature: "250kr purse, 2 players" not "competitive matchmaking"
