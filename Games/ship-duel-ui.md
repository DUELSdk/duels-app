---
game: ShipDuel
type: ui-spec
status: draft
added: 2026-05-14
---

# ShipDuel — UI Spec

Read `ship-duel.md` for rules before touching this file. This spec covers visual identity, screen states, components, and animation. Always read both before building.

---

## Visual Identity

ShipDuel is not a Big Three game. It has its own identity within the platform container.

**Surface:** BUNKER (concrete) — same as all match screens. Non-negotiable.

**Accent:** `--accent` (#1d4ed8, Danish Blue) replaces `--alarm` as the primary game accent.
- Hit markers: `--alarm` (#ef0000) — naval convention, red pegs
- Miss markers: bone-ghost circle, no fill
- Ship fills: `--accent` (blue) for your fleet, `--concrete-4` for outline/ghost
- Active shot selection: `--accent` border + glow
- Timer (critical <10s): switches to `--alarm`
- CTA button: blue variant (see Components)

**Feel:** Cold. Tactical. Sparse. The grid dominates. Nothing decorates. Every cell has meaning — show that through restraint, not visual noise. This is a war room, not a game board.

**Wireframe mock:** `Design/ship-duel.html` — read before building.

---

## Fonts & Type

Same type system as platform. No exceptions.
- Grid coordinates: `.t-mono` — `A–H` columns, `1–8` rows
- Ship labels: `.t-eyebrow` — `CARRIER · 4`, `CRUISER · 3`, etc.
- Announcement text: `.t-display` or `.t-mega` depending on weight of moment
- Round counter, HP, shot count: `.num-mega .tabnums`

---

## Screen States

### 1. Fleet Placement

**Duration:** 90 seconds. Timer counts down. At 0, unplaced ships auto-placed by system.

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ BunkerTop: FLEET PLACEMENT · CARD DUEL → SHIP DUEL  │
│ Left: SHIP DUEL · {kr} KR ROOM                      │
│ Center: ● FLEET PLACEMENT                            │
│ Right: match ID                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  YOUR FLEET                    SHIP DOCK             │
│  8×8 grid (left, ~60% width)   remaining ships right │
│                                                      │
│  Timer: num-mega, bone-on-dark, bottom center        │
│  Alarm red when < 10s                                │
│                                                      │
│  [LOCK FLEET →] — disabled until all 4 ships placed  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Ship dock:** Right panel. Lists unplaced ships as rectangular blocks matching their length. Each ship: eyebrow label + length indicator + rotation hint. Click to select, click grid to place. Or drag. `R` key or rotate button to flip orientation.

**Grid cells:** 40×40px minimum. 1px dark rule borders (`rgba(240,237,228,0.14)`). Empty cells have no fill. Selected ship preview shows in accent blue at 40% opacity as cursor moves over valid placement zones. Invalid zones show no preview.

**Placed ships:** Accent blue fill (`--accent`), 1px bone-on-dark border. Ship label shown inside if space allows (Carrier yes, Scout no).

**Touching/overlap feedback:** Invalid placement — cell flashes alarm briefly, ship snaps back.

**LOCK FLEET button:** `.btn.bunker-alarm` variant but in accent blue (override border-color and background to `--accent`). Full width at bottom. Disabled state: bone-ghost text, no fill, soft border.

**Waiting state:** After locking — replace grid with "FLEET LOCKED" large display text. Thinking dots + "Waiting for opponent." Opponent progress indicator: "OPPONENT · X / 4 SHIPS PLACED" updates live. No opponent grid shown.

---

### 2. Match Round — Shot Selection

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ BunkerTop: ROUND {n} OF 40 · SHIP DUEL                   │
│ Left: SHIP DUEL · {kr} KR ROOM                           │
│ Center: ● LOCK YOUR SHOT                                  │
│ Right: match ID                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  YOUR FLEET      │  STATUS COLUMN  │  THEIR WATERS       │
│  (your ships,    │  (center strip) │  (where you shoot)  │
│  opp shot marks) │                 │                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**YOUR FLEET (left grid, ~38% width):**
- Your ships shown in accent blue
- Opponent's hits on your fleet: alarm red fill on hit cells
- Opponent's misses: bone-ghost small dot in cell center
- Ships with hits show damage — hit cells turn from accent blue to `--concrete-3` with alarm dot

**STATUS COLUMN (center strip, ~20% width):**
- Your ships remaining (count + type icons)
- Opponent ships remaining (count only — no type until sunk)
- Round counter: `ROUND · {n}` mono eyebrow
- Spacer
- Shot timer: countdown, num-mega. Alarm red when < 10s.

**THEIR WATERS (right grid, ~38% width):**
- All cells open unless previously shot
- Hit cells: alarm red fill, × mark
- Miss cells: bone-ghost dot
- Sunk ship: full ship silhouette overlaid on revealed cells, alarm red at 60% opacity
- Hovering unshot cell: accent blue border glow, cursor crosshair
- Selected shot: accent blue fill at 30%, solid accent border
- "LOCK SHOT →" button below grid — accent blue, full width. Disabled until cell selected.

**After locking shot:**
- YOUR WATERS panel dims slightly
- Center status: "SHOT LOCKED · WAITING" with thinking dots
- THEIR WATERS: selected cell pulses accent border slowly
- Cannot change selection

---

### 3. Round Reveal

Both shots reveal simultaneously. Sequential animation, max 600ms total.

**Sequence:**
1. (0ms) Flash — both grids pulse briefly (bone-on-dark at 20% flash)
2. (80ms) Your shot resolves on THEIR WATERS — hit or miss marker appears
3. (80ms) Opponent's shot resolves on YOUR FLEET simultaneously
4. (160ms) If ship sunk — "SUNK · CARRIER" announcement slams in (`.t-mega`, alarm red, full width overlay for 1.2s)
5. (320ms) Sunk ship position revealed on THEIR WATERS (silhouette fades in over 400ms)
6. Center column updates: ship count adjusts

**Hit animation (Anime.js):** Cell background flashes from `--alarm` to `--concrete-3` over 300ms. Then settles to alarm fill.

**Miss animation:** Small dot fades in at bone-ghost color, 200ms.

**Sunk announcement:** Full-width overlay on THEIR WATERS. `.t-mega` text, alarm red. Silhouette reveal beneath. Auto-dismisses after 1.2s, match continues.

---

### 4. Waiting for Next Round

Between reveal and next round lock (brief — ~500ms breathing room):
- Center status updates
- Both grids show current state
- Round counter increments
- New BunkerTop phase label: `● LOCK YOUR SHOT` resets

---

### 5. Match End

**Winner:**
Full-screen BUNKER overlay. `.t-mega` announcement:
```
[USERNAME] SINKS THE FLEET.
```
Pot counter below in `.num-mega .c-money`. Purse number counts up.

**Round limit reached — most ships sunk:**
```
[USERNAME] WINS · SHIPS SUNK: 3–2
```

**Split pot:**
```
FLEETS STAND. SPLIT POT.
```
Both players' amounts shown.

Transition to standard result screen after 2s.

---

## Phantom Variant — UI Additions

Phantom changes the match round screen and reveal sequence. Everything else (placement, result) stays the same.

### HP Bars (STATUS COLUMN)

Replace ship count with HP bar display for each ship type.

Your ships (left side of status column):
```
CARRIER   ████░  4/4 HP
CRUISER   ███░░  2/3 HP  ← damaged
DESTROYER ██░░   0/2 HP  ← sunk
SCOUT     █░░░   1/1 HP
```

Opponent ships (right side of status column):
- Same structure BUT: HP visible (from hits), type visible (from sunk announcement)
- Position never shown — only HP state
- Sunk ships greyed out

HP bars: accent blue fill for full/healthy, alarm red fill when < 50%, bone-ghost for missing HP. `.num-mega` numbers for HP count.

### Movement Phase

After reveal, before next round: movement phase.

**Duration:** 15 seconds (open question — see `ship-duel.md`)

**Center status column changes to:**
```
● MOVE A SHIP OR STAY
[15s countdown]
```

**YOUR FLEET grid:** Ship cells become selectable. Click a ship to select it (accent border glow). Directional arrows appear on adjacent valid cells. Click arrow cell to move. "STAY" button always available.

**THEIR WATERS:** Dims to 40% opacity during movement phase — focus is on your fleet.

**Movement locked:** Both players confirm move simultaneously (or timer expires — stay = default). Then next round begins.

**Phantom reveal difference:** No sunk ship position reveal. Only:
```
SUNK · CARRIER
```
No silhouette. No position. Ship could have been anywhere.

---

## Components Unique to ShipDuel

### GridCell

```
size: 40×40px (desktop), 32×32px (mobile)
border: 1px rgba(240,237,228,0.14)
states:
  empty:      no fill
  ship:       --accent fill, 0.9 opacity
  hit:        --alarm fill, × marker
  miss:       no fill, bone-ghost dot 6px centered
  sunk-cell:  --concrete-3 fill, alarm silhouette overlay
  hover:      --accent border, 2px
  selected:   --accent fill 30%, --accent border 2px solid
  invalid:    no change (no preview rendered)
```

### ShipBlock (dock / placed ship)

Rectangle matching ship length × 1 cell. Accent blue fill. Eyebrow label above (if space). Drag handle implied by cursor.

### HP Bar

```
height: 4px
width: proportional to ship length (16px per HP)
filled: --accent or --alarm if < 50%
empty: --concrete-4
gap between segments: 2px
```

### SunkAnnouncement

Full-width overlay on THEIR WATERS. `.t-mega` at 64px. Alarm red. Auto-dismiss 1.2s. No close button.

### BunkerTop (ShipDuel variant)

Same structure as platform BunkerTop. Phase label colors:
- `● FLEET PLACEMENT` — bone-faint (not alarm)
- `● LOCK YOUR SHOT` — alarm red
- `● SHOT LOCKED` — money green
- `● MOVE A SHIP` (Phantom only) — accent blue

---

## Mobile

Same layout intent, compressed:

- **Placement:** Grid stacks top. Ship dock scrolls horizontally below.
- **Match:** Tab between YOUR FLEET and THEIR WATERS. Status strip at top below BunkerTop. LOCK SHOT button fixed at bottom.
- **Reveal:** Same animation, same timing.

Grid cell size: 32×32px minimum on mobile. 8×8 = 256px — fits comfortably in 320px+ width with 8px padding each side.

---

## What to Read Before Building

1. `Games/ship-duel.md` — rules, visibility, Phantom spec
2. This file — UI states, components, animation
3. `Design/ship-duel.html` — wireframe mock
4. `app/duel/DESIGN.md` — platform rules and game identity tiers
