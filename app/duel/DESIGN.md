# DUEL — Design Document

Platform name: **DUEL**. Always ALL CAPS in UI.

---

## Vision

The duel is the product. Every design choice reinforces two sides facing off — but barely. No crossed swords, no corny VS screens. Small details that reward attention without announcing themselves.

- **Feel:** A library of confrontations. You browse, you pick, you commit.
- **Not:** Pitch black gamer aesthetic. Neon. Overwrought. Decorated.
- **Yes:** Dark charcoal with breathing room. Red as tension, not decoration. Structure that feels intentional.
- **Duel details:** Underdo. A split line here, a mirrored element there. If you have to point it out, it's too much.

---

## Color

### Platform (pages, nav, UI)

| Role | Value | Usage |
|---|---|---|
| Background | `#18181b` (zinc-900) | Every page — dark charcoal, not pitch black |
| Surface | white at 4% opacity | Cards, panels |
| Surface dim | white at 2% opacity | Empty states, locked sections |
| Border | white at 10% opacity | Default card/panel borders |
| Border dim | white at 6% opacity | Subtle dividers, nav border |
| Border hover | white at 20% opacity | On hover |
| Text — primary | white | Headings, labels |
| Text — secondary | white at 50% opacity | Body, descriptions |
| Text — tertiary | white at 30% opacity | Breadcrumbs, hints |
| Text — disabled | white at 20% opacity | Locked UI |
| Accent | `#dc2626` (red-600) | Primary CTAs, brand highlights |
| Accent hover | `#ef4444` (red-500) | Button hover |
| Accent dim | red at 10% opacity | Callout backgrounds |
| Win | `#34d399` (emerald-400) | Win states |
| Loss | `#f87171` (red-400) | Loss states only — never use for CTAs |
| Neutral result | white at 40% opacity | Draw / tie |

### In-game only (game boards, pieces — never platform UI)

| Role | Value | Usage |
|---|---|---|
| Player piece | `#f59e0b` (amber-500) | Player 1 game piece |
| Win highlight | `#fbbf24` (amber-400) | Winning move, score emphasis |
| Tie result | `#facc15` (yellow-400) | Tie result screen |

> **Rule:** Red is the platform accent. Amber is in-game only. Never mix.

---

## Typography

| Element | Size | Weight | Other |
|---|---|---|---|
| Hero title | fluid — min 5rem, max 12rem, scales with viewport | Black (900) | Tight tracking, no line gap |
| Page title | 2.25rem (36px) | Bold | Tight tracking |
| Section title | 1.25rem (20px) | Bold or Semibold | — |
| Eyebrow / label | 0.75rem (12px) | Regular | ALL CAPS, wide letter-spacing, white at 30% |
| Body | 0.875rem (14px) | Regular | white at 50%, relaxed line height |
| Small / hint | 0.75rem (12px) | Regular | white at 30% |
| Monospace tag | 0.75rem (12px) | Monospace | For counts, codes |
| Nav brand | 1rem (16px) | Black (900) | Tight tracking |
| Nav link | 0.875rem (14px) | Regular | white at 40%, white on hover |

Headings always use tight or tighter tracking. Never default tracking on large type.

---

## Layout

| Page type | Width | Padding |
|---|---|---|
| Content pages (games, library) | Full width | 24px sides, 48px vertical |
| Focused pages (wallet, profile) | Max 768px centered | 24px sides, 48px vertical |
| Game / demo pages | Max 672px centered | 24px sides, 40px vertical |

- Section gap (between major sections): 56px
- Gap within a section: 24px
- Gap between small items: 12px
- Nav height: 48px

---

## Radius

| Element | Radius |
|---|---|
| Large card | 16px |
| Medium card | 12px |
| Small element | 8px |
| Pill / badge | Full (9999px) |
| Button | 8px |

---

## Components

### Nav

Sticky. 48px tall. Dark charcoal background at 95% opacity with blur behind it. Bottom border at white 6% opacity.

Left: **DUEL** brand mark — black weight, tight tracking. Red on hover.
Center/right links: Games, Tournaments.
Right: balance pill (border only, no fill), profile avatar (border only, no fill).

---

### Page Header

Left-aligned. Eyebrow label sits above the title with spacing below it. Title is large and tight. One-line description beneath — one sharp sentence, no padding. Optional CTA or status badge floats to the right on wide screens.

---

### Cards

Three variants:

- **Standard:** white at 4% fill, white at 10% border. On hover: border lifts to white at 20%.
- **Dim / locked:** white at 2% fill, white at 6% border. No hover state.
- **Accent callout:** red at 5% fill, red at 15% border.

---

### Buttons

| Type | Description |
|---|---|
| Primary | Red-600 fill, white text, bold. Hover: red-500. Height 48px. |
| Secondary | No fill, white at 8% border, white at 60% text. Hover: white text, white at 20% border. Height 40px. |
| Disabled | No fill, white at 6% border, white at 20% text. Not interactive. |
| Game action (in-game only) | Amber fill, black text, ALL CAPS, wide tracking. Hover: amber lighter. Active: slight scale down. |

---

### Badges / Tags

- **Status (coming soon, locked):** white at 5% fill, white at 30% text, white at 10% border. Pill shape.
- **Accent tag:** red at 10% fill, red-400 at 80% text, red at 20% border. Small rounded.
- **Bot label:** white at 5% fill, white at 40% text, white at 10% border. Pill shape.

---

### Empty State

Centered inside a dim card. One line of secondary text. One smaller hint line beneath. Red text link CTA at the bottom.

---

## Game Library

### Philosophy

Not a list. A library. You browse rows, each row is a different lens on the catalog. The games don't sell themselves with imagery — the name and one sharp line do the work. Thumbnails are intentionally blank.

### Categories

| Category | Logic |
|---|---|
| Classic | Base games in their purest form — one per engine |
| Built on [Game Name] | Variants derived from a base game |
| 3-Player | Games that support 1v1v1 format only |
| Block Games | Games where placement or blocking is core |

Categories are not mutually exclusive. A game can appear in multiple rows. More categories added as catalog grows.

### Layout

Netflix-style rows, stacked vertically. Each row:

- Left-anchored category label in eyebrow style: `CLASSIC · 3`
- Cards scroll horizontally on overflow — no pagination
- First card in each row is slightly wider (featured position — no other visual difference)
- Blank thumbnail: dark fill, no text, no icon

### Game Card

- Thumbnail area: 16:9 ratio, dark fill — intentionally empty
- Below thumbnail: game name (small, semibold) + one-line description (xs, white at 40%)
- On hover: border lifts from white at 10% to white at 20%
- Standard width: ~192px. Featured (first in row): ~256px.

---

## Writing

- Brand name: **DUEL** — always ALL CAPS
- Page titles: direct, no punctuation at end (`Card Duel` not `Card Duel.`)
- Eyebrow labels: ALL CAPS (`YOUR SEQUENCE`, `BLOCK 2`)
- Standard button labels: Title Case (`Enter`, `Lock In`)
- Game action labels: ALL CAPS (`LOCK IN`, `PLAY AGAIN`)
- Descriptions: one sharp sentence. No padding. Describe stakes not features.
- Currency: Danish format (`1.000 kr` not `1,000 kr`)
- No exclamation marks anywhere — broadcaster voice is declarative, not celebratory
- CTAs: action words. "Enter." "Pick a side." "Lock in."

### Broadcaster voice (in-game)

DUEL narrates the match like a broadcaster reporting the game — not like the platform talking to the player. Third-person throughout all match narration.

**Rule:** Narration = third-person. Instructions = second-person.

| Type | Voice | Example |
|------|-------|---------|
| Match result | Third-person | `Silas wins` not `You win` |
| Round result | Third-person | `Round 3 goes to Silas` not `You won round 3` |
| Action announcement | Third-person | `Silas plays Strike` not `You played Strike` |
| Player instruction | Second-person | `Lock in your sequence` / `Your turn` |
| CTA buttons | Second-person | `Enter` / `Pick a side` |

**Why:** The platform broadcasts the duel. Players are participants in something being reported, not users being addressed. This makes every match feel like an event, not a UI interaction.

**Use display name always** — `[Username] wins`, not `Player 1 wins`. Fall back to `Player 1` / `Player 2` only if username is unavailable.

---

## Animation

Two libraries. Both installed. Use both — correctly.

### Which library for what

**Framer Motion** — React component animations. Use when the thing being animated is a React element and the trigger is state/prop change.
- Page/section entrances
- Card placements, sequence slots, score displays
- Hover and tap micro-interactions (`whileHover`, `whileTap`)
- Enter/exit transitions (`AnimatePresence`)
- Element morphing and shared layout (`layoutId`)
- Staggered children via `variants` + `staggerChildren`

**Anime.js** — DOM-targeted and timeline-sequenced animations. Use when you need precise multi-step choreography or CSS selector targeting across many elements.
- Impact moments: clash flash, board shake, sudden death slam
- Sequential reveals with exact timing (card A slides in → pause → card B → flash)
- Number count-up on score changes
- Staggered CSS class targets (`.board-cell`, `.seq-slot`)
- Win cell pulse chains

### Rules

**Platform UI (nav, pages, lobby):** Framer only. Subtle. Entrance fades and spring pops. No looping animations. Nothing moves unless the user did something or a state changed.

**In-game:** Both libraries. This is where animation earns its place. Every dramatic game moment should feel different from a quiet one. The clash reveal, the lock-in, the win — these are not the same as a fade-in.

**What's allowed in-game:**
- Multi-step Anime.js timelines on high-stakes moments (clash, lock, sudden death, win)
- Framer spring physics on interactive elements (hand cards, slot placement)
- Number rolls on score updates
- Stagger effects on groups of elements resolving simultaneously
- Impact flashes (short, max 150ms, then gone)

**What's never allowed:**
- Looping idle animations on platform pages
- Animations longer than 600ms unless it's a full-screen game transition
- Bouncing or wobbling elements during passive states
- Animation on every click — only on meaningful game events
- Two simultaneous competing animations on the same element

### Timing reference

| Type | Duration | Easing |
|------|----------|--------|
| Micro (tap, hover) | 80–120ms | easeOut |
| Card placement | 200–280ms | spring (stiffness 400–500, damping 20–25) |
| Reveal / flip | 280–400ms | easeOutBack or spring |
| Impact flash | 80–150ms | linear |
| Sequence / stagger | 300–600ms total | easeOutQuad with stagger 40–80ms |
| Page entrance | 350–500ms | [0.16, 1, 0.3, 1] (custom ease) |
| Full transition | max 600ms | easeInOut |
