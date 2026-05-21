---
game: ReverseDuel
status: spec-complete
added: 2026-05-02
---

# ReverseDuel

Othello with one twist — both players secretly block one cell before the match starts, killing memorised opening books.

---

## Core Mechanic

Standard Othello / Reversi on an 8×8 board. Before play begins, both players simultaneously place one blocked cell — revealed at game start. Eliminates all memorised opening theory since no opening book covers every 2-block combination. Per-move time limit enforced throughout — if time expires, system auto-places the first legal move in scan order (top-left to bottom-right, row by row).

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ block placements committed simultaneously before reveal |
| RNG | none — all placements are player choices; default move is deterministic scan order |
| Skill basis | spatial reasoning / Othello strategy / opponent-reading (block placement) |
| Tiebreaker | equal piece count when board fills or time runs out → split pot |

---

## Flow

1. **Pre-game:** Both players secretly and simultaneously choose one cell to block. Blocks reveal together.
2. **Play:** Standard Othello on the modified 8×8 board. Per-move time limit enforced. Time expires → system plays first legal move in top-left to bottom-right scan order.
3. **Pass rule:** If a player has no legal move (no placement flips at least one opponent piece), their turn is skipped automatically. If both players have no legal move simultaneously, game ends immediately.
4. Game ends when board fills, no legal moves remain for either player, or both pass simultaneously. Most pieces wins.

---

## Scoring

Win = most pieces when game ends. Equal pieces = split pot. No rake on split.

---

## Simultaneous Rule

Pre-game block placement: both players choose and lock before either is revealed. In-game play: standard alternating turns — not simultaneous per move.

---

## Contested Move Rule

Pre-game block placement only: if both players block the same cell, both blocks land on that cell (treated as a single blocked cell — no replay, no advantage to either).

In-game: standard Othello — alternating turns, no conflict possible.

---

## Crown Compatibility

✅ Applicable in series format. Spatial board with clear "best move" reads — predicting opponent's placement is a natural fit. Crown does not apply to pre-game block placement (sealed simultaneous choice).

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **ReverseDuel** | Neutral / standard | — | Base |
| Territory War | Military | 8×8, 1 block each | Visual reskin |
| Plague | Bio/sci-fi | 8×8, 2 blocks each | More disruption |
| Realm | Medieval fantasy | 10×10, 2 blocks each | Longer, wider strategic range |
| Blitz Flip | Neutral speed | 8×8, 1 block each | Shorter per-move timer |

---

## Future Formats

| Format | Notes |
|--------|-------|
| Tournament bracket | Standard bracket |

---

## Open Questions

| Question | Priority |
|----------|----------|
| Per-move time limit duration — decide at build time (likely 10–15s) | Low |
