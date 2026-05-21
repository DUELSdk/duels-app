---
game: ShipDuel
status: spec-complete
added: 2026-05-13
---

# ShipDuel

Both players place a fleet simultaneously, then fire simultaneously each round — first to sink all opponent ships wins.

---

## Core Mechanic

8×8 grid. Each player places 4 ships on their own hidden grid simultaneously before the match starts. Then the match runs round by round — both players lock a shot each round simultaneously, reveal together. Skill is in fleet placement (psychology) and shot selection (deduction + pattern-reading). Even in late game when positions are narrowed to a few cells, the final choice is a read on the opponent, not a coin flip.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ fleet placement simultaneous before reveal; shots simultaneous each round |
| RNG | none — all placements and shots are player choices |
| Skill basis | spatial reasoning / deduction / opponent-reading |
| Tiebreaker | damage dealt — see Scoring |
| Spillemyndighed | ✅ Provisional pass — sent to lawyer. Incomplete-information framing confirmed: no RNG, all choices are player decisions. |

**Note on incomplete information:** Early-game shots are made with no information — this is incomplete information, not RNG. No random number generator is involved. Spillemyndighed precedent confirms skill-based games under incomplete information do not require a license.

---

## Fleet

| Ship | Length | Count |
|------|--------|-------|
| Carrier | 4 cells | 1 |
| Cruiser | 3 cells | 1 |
| Destroyer | 2 cells | 1 |
| Scout | 1 cell | 1 |

Total: 10 cells covered on an 8×8 grid (64 cells).

Ships placed horizontally or vertically. No diagonal. Ships may not overlap. Adjacent placement allowed — ships may touch orthogonally.

---

## Flow

1. **Fleet placement (90 seconds):** Both players place their 4 ships on their own hidden grid simultaneously. Timer expires → unplaced ships auto-placed by system in first valid positions.
2. **Round:** Both players lock one shot (cell coordinate) simultaneously. Both reveal together. Hit or miss shown. If a ship is fully sunk, its complete position is revealed to both players.
3. Repeat until one player's fleet is fully sunk.

---

## Scoring

First player to sink all opponent ships wins the match.

**Round limit:** If neither player has sunk all ships after 40 rounds — most ships sunk wins. If equal — most total HP damage dealt wins. If still equal — split pot.

---

## Simultaneous Rule

**Placement:** Both players lock full fleet position before either is revealed. Neither player sees the opponent's grid until a ship is sunk.

**Shots:** Both players lock shot each round before either is revealed. Both shots resolve simultaneously — a player can be hit and score a hit in the same round.

---

## Contested Move Rule

Both players shoot the same cell in the same round: both learn the result (hit or miss) simultaneously. No replay. Normal resolution.

---

## Visibility

| What | Visible to opponent |
|------|-------------------|
| Your fleet positions | ❌ hidden until ship is sunk |
| Sunk ship full position | ✅ revealed when sunk |
| Shot history (their board) | ✅ all hit/miss markers visible |
| Remaining ships (count) | ✅ how many ships left, not where |

---

## Crown Compatibility

✅ Applicable. In mid-to-late game, when few unsearched cells remain and a ship's approximate location is known, the opponent's next shot becomes predictable. Crown maps directly onto shot prediction. Crown does not apply during fleet placement (sealed simultaneous choice).

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **ShipDuel** | Naval / standard | — | Base — static fleet. 3-game match format. |
| **ShipDuel: Phantom** | Naval | See full spec below | Advanced — mobile fleet. 1-game format — ships move so cross-game positional reads don't apply. |
| Submarine Wars | Cold War | All ships length 1–2, 6×6 grid | Faster, closer quarters |
| Fleet Command | Military | 10×10 grid, 6 ships | Extended classic |

---

## Phantom Variant — Full Spec

Ships move. No cell is permanently safe or permanently eliminated. You are hunting a ship that leaves traces but may not be where you last saw it.

### HP System

Each ship has HP equal to its length. A hit deducts 1 HP regardless of the ship's current position. Ship sinks when HP reaches 0.

| Ship | HP |
|------|----|
| Carrier | 4 |
| Cruiser | 3 |
| Destroyer | 2 |
| Scout | 1 |

### Movement Rules

After shots resolve each round, each player may optionally move **one ship** one cell orthogonally (up, down, left, right). Movement is sealed and simultaneous — neither player sees the other's movement. Staying is always a valid choice.

**Movement constraints:**
- Cannot move outside the grid
- Cannot overlap another of your own ships
- **Can** move into previously-shot cells — no cell is permanently eliminated
- Cannot rotate — ships keep their orientation (locked)

**Consecutive move cooldown:**
Moving the same ship 3 rounds in a row triggers a 2-round cooldown — that ship cannot move for the next 2 rounds. Switching to a different ship resets the consecutive counter for the first ship. Cooldown is not visible to the opponent — they must deduce it from behavior.

### Phantom Visibility

| What | Visible to opponent |
|------|-------------------|
| Your fleet positions | ❌ always hidden |
| Sunk ship position | ❌ not revealed — ship moved, position meaningless |
| Sunk ship type | ✅ "SUNK · CARRIER" announced |
| Opponent ship HP bars | ✅ each ship type shown with remaining HP |
| Shot history (hit/miss cells) | ✅ all markers visible — but ship may have left |
| Remaining ships (count) | ✅ |

### Phantom Flow

Each round:
1. Both players lock a shot simultaneously → reveal together → hits deduct HP from ship type
2. If a ship reaches 0 HP → "SUNK · [TYPE]" announced, no position revealed
3. Both players simultaneously and secretly move one ship (or stay)
4. Next round begins

### Phantom Scoring

Same as base: first to sink all opponent ships wins.

**Round limit:** 50 rounds (longer than base to account for evasion). Tiebreaker: most HP damage dealt. Still tied: split pot.

### Phantom Psychology

The core tension:
- You hit a ship → do you shoot adjacent next round (assume it stayed) or predict it moved?
- You were hit → do you move the damaged ship or stay and bait a repeat shot to a now-empty cell?
- Bluffing with movement: moving toward already-shot cells is counterintuitive — opponent won't reshoot there.
- Late game: opponent knows your Carrier has 1 HP left. You need to hide it in an unshot cell. They know every cell they've shot. Read each other.

---

## Future Formats

| Format | Notes |
|--------|-------|
| Blitz | 6×6 grid, 3 ships (3+2+1), faster match |
| Tournament bracket | Standard bracket |

---

## Open Questions

| Question | Priority |
|----------|----------|
| ~~Legal status — confirm incomplete-information mechanic with Spillemyndighed~~ | ✅ Sent to lawyer — provisional pass |
| ~~Phantom: ship rotation on move~~ | ✅ No rotation — orientation locked |
| ~~Phantom: move timer~~ | ✅ 10 seconds |
| Auto-placement logic for expired fleet placement timer | Low — decide at build time |
| ~~Ship touching rule~~ | ✅ Adjacent placement allowed |
