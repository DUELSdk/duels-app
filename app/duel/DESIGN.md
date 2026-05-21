# DUELS — Design Document

Platform name: **DUELS**. Always ALL CAPS in UI.

**Visual source of truth:** `/Design/style-guide.html` — design system, tokens, components, voice. Read before building any page. The hifi bundle (`/Design/hifi/`) is historical reference only — superseded by the style guide.

---

## Vision

The duel is the product. Every design choice reinforces two sides facing off — but barely. No crossed swords, no corny VS screens. Small details that reward attention without announcing themselves.

- **Feel:** A library of confrontations. You browse, you pick, you commit.
- **Not:** Pitch black gamer aesthetic. Neon. Overwrought. Decorated.
- **Yes:** Bone paper with breathing room. Red as tension, not decoration. Structure that feels earned.
- **Duel details:** Underdo. A split line here, a mirrored element there. If you have to point it out, it's too much.

---

## Design Surfaces

Two surfaces. Never mix them on the same screen.

### BROADCAST — platform, marketing, lobby, library

Paper background. Ink text. Sports-editorial feel. This is the face of DUELS outside the match.

| Token | Value | Usage |
|---|---|---|
| `--bone` | `#efece4` | Page background |
| `--bone-2` | `#e6e2d6` | Secondary surface, section fills |
| `--bone-3` | `#d8d3c2` | Tertiary surface |
| `--ink` | `#0d0d0d` | Primary text, borders, rules |
| `--ink-soft` | `#4a4845` | Secondary text |
| `--ink-faint` | `#807c74` | Tertiary text, labels |
| `--ink-ghost` | `#b8b3a4` | Disabled, empty states |
| `--rule-soft` | `rgba(13,13,13,0.14)` | Soft dividers |
| `--alarm` | `#ef0000` | CTAs, live indicators, tension |
| `--money` | `#1d8a3a` | Win states, live positive |
| `--accent` | `#1d4ed8` | Danish Blue — rare brand hits |

### BUNKER — match only

Concrete black. The room temperature drops when you enter. This is the match.

| Token | Value | Usage |
|---|---|---|
| `--concrete` | `#0a0a0a` | Match background |
| `--concrete-2` | `#131311` | Header bar, raised surfaces |
| `--concrete-3` | `#1c1b18` | Mid-level surface |
| `--concrete-4` | `#2a2926` | Elevated panels |
| `--bone-on-dark` | `#f0ede4` | Primary text on dark |
| `--bone-faint` | `#8a8780` | Secondary text on dark |
| `--bone-ghost` | `#5a5853` | Tertiary text on dark |
| `--alarm` | `#ef0000` | Timer, danger, active state |
| `--money` | `#1d8a3a` | Win confirmation |

---

## Game Identity Tiers

Not every game follows the same visual rules. Three tiers:

### Platform layer — always locked
Nav, entry flow, typography base, token variables, rule lines, live dots. Every game lives inside this container. Non-negotiable.

### The Big Three — brothers
Card Duel, CycleDuel, DropDuel. Same presentation language. Same color treatment. Same motion feel. If you've seen one, you recognize the others. They set the visual standard for *each other*, not for the platform at large.

- Match surface: BUNKER (concrete + alarm red)
- Accent: `--alarm` (#ef0000)
- Match structure: BunkerTop → timer → 3-column board layout
- Piece style: flat, typographic

### New games — own identity within the container
ShipDuel, HexDuel, and future games are not required to look like the Big Three. They share the platform layer (nav, entry flow, match screen structure) but can own:

- Accent color (ShipDuel can use blue, not alarm red)
- Board aesthetic and piece design
- Match surface treatment (still BUNKER structure, different feel)
- Animation style and timing character

**Rule:** Platform structure = locked. Match skin = per game. Decide the identity before building.

---

## Typography

Three fonts. Each has a role. Never substitute.

| Font | Variable | Usage |
|---|---|---|
| Barlow Condensed | `--font-display` | All display text — headings, titles, scores, labels in ALL CAPS |
| Inter | `--font-body` | Body copy, descriptions, form fields |
| JetBrains Mono | `--font-mono` | Counters, codes, tags, metadata, eyebrows |

### Type classes (defined in globals.css)

| Class | Description |
|---|---|
| `.t-mega` | Barlow 800, -0.02em tracking, 0.85 line-height, uppercase — hero titles |
| `.t-display` | Barlow 700, -0.01em tracking, 0.92 line-height, uppercase — section titles, player names |
| `.t-cond` | Barlow 600, 0.01em tracking, uppercase — secondary display labels |
| `.t-mono` | JetBrains Mono — all metadata, counts, eyebrows |
| `.t-eyebrow` | Mono 11px, 500w, +0.12em tracking, uppercase, `--ink-soft` color |
| `.num-mega` | Barlow 800, -0.03em tracking, tabular-nums — big numbers (scores, pots, timers) |

**Rule:** Large type always uses tight or negative tracking. Never default tracking on display sizes.

---

## Layout

| Page type | Width | Horizontal padding |
|---|---|---|
| Full-width pages (library, landing) | Full width | 56px |
| Focused pages (wallet, profile, auth) | Max 768px centered | 24px |
| Match pages | Full width, flex column | 28px |

- Section gap: 56px between major sections
- Within a section: 24–32px
- Small item gap: 8–12px

---

## Components

### BroadcastNav
Sticky. Bone background. Bottom rule (`--ink`, 1px). Left: DUELS wordmark (Barlow 800). Center/right: nav links in mono. Right: balance + profile.

### StadiumStrip
Top-of-page accent band. Bone-2 background with ticker content. Sits above BroadcastNav.

### LiveTicker
Scrolling strip. Mono text. Rule-bordered items. Animates continuously at 60s loop.

### BunkerTop (match header)
3-column grid. `--concrete-2` background. Bottom dark rule (`rgba(240,237,228,0.14)`).
- Left: match ID + game name in mono bone-faint
- Center: active phase label in alarm mono
- Right: meta info

### Buttons

Zero border-radius. No pill shapes. No rounded corners anywhere.

| Class | Description |
|---|---|
| `.btn` | Transparent fill, `--ink` border 1.5px. Hover: ink fill, bone text |
| `.btn.primary` | Ink fill, bone text. Hover: `--ink-2` |
| `.btn.alarm` | Alarm fill, white text |
| `.btn.ghost` | No border, no fill. Hover: alarm text |
| `.btn.bunker-alarm` | Match CTA — alarm fill, Barlow display, ALL CAPS |
| `.btn.lg / .sm` | Size variants |
| `.btn.block` | Full width |

### Rules and dividers

| Class | Description |
|---|---|
| `.rule` | 1px ink horizontal rule |
| `.rule.soft` | 1px rule-soft |
| `.rule.thick` | 2px ink |
| `.rule.dark` | 1px `rgba(240,237,228,0.14)` — for use on bunker surface |
| `.vrule` | 1px ink vertical rule |

### Live dot
`.live-dot` — 8px circle, alarm red, pulsing glow animation. Add `.money` class for green variant.

### Thinking dots
`.thinking` — three dots cycling opacity. Used to show opponent is active.

---

## Game Library

A catalog of disciplines, not a menu. The library is a schedule board — think departures, not app store.

### Layout
Flat numbered list. Not Netflix rows. Each game row:
- Left: number (mono faint) + game name (Barlow 700, 28px) + one-line description
- Center: format label (mono faint)
- Right: live count (num-mega, alarm if live) + today count + stake range + ENTER →

Filter tabs above list: ALL · CARD · BOARD · SPEED. Active tab has alarm underline, not fill.

---

## Writing

- Brand name: **DUELS** — always ALL CAPS
- Page titles: direct, no punctuation at end (`Card Duel` not `Card Duel.`)
- Eyebrow labels: ALL CAPS (`YOUR SEQUENCE`, `BLOCK 2`)
- Standard button labels: Title Case (`Enter`, `Lock In`)
- Game action labels: ALL CAPS (`LOCK IN`, `PLAY AGAIN`)
- Descriptions: one sharp sentence. No padding. Describe stakes not features.
- Currency: Danish format (`1.000 kr` not `1,000 kr`)
- No exclamation marks anywhere — broadcaster voice is declarative, not celebratory
- CTAs: action words. "Enter." "Pick a side." "Lock in."

### Broadcaster voice (in-game)

DUELS narrates the match like a broadcaster reporting the game — not like the platform talking to the player. Third-person throughout all match narration.

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
