---
game: WallDuel
status: spec-complete
added: 2026-05-02
---

# WallDuel

Both players sprint to the other side of a 9×9 grid while placing permanent walls in each other's path — simultaneously every turn.

---

## Core Mechanic

Each player has a pawn and 10 permanent walls. Both choose one action per turn simultaneously: move one step or place a 2-cell wall segment anywhere on the board. Walls are permanent once placed. Server enforces that a valid path to each player's goal always exists — complete blocking is illegal. First pawn to reach the opponent's starting row wins. No draws possible.

Per-move time limit enforced. Expires → pawn moves one step toward goal along current shortest path. Deterministic regardless of path quality.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both actions committed before either is revealed each turn |
| RNG | none — all moves and wall placements are player choices; default move is deterministic |
| Skill basis | spatial reasoning / pathfinding / opponent-reading |
| Tiebreaker | not needed — draws are not possible |

---

## Flow

1. Both players choose one action simultaneously: Move (1 step in any cardinal direction) OR Place wall (2-cell segment between any two adjacent cells)
2. Actions reveal together
3. **Pawn conflict** (both move to same cell): blocked — neither moves, both replay that turn
4. **Wall conflict — same segment**: one wall exists, no replay needed. Both players chose the same wall, wall is placed, game continues
5. **Wall conflict — combined blocking**: different segments that together leave opponent no valid path → both walls rejected, both segments on 2-turn cooldown (neither player can place those specific segments for 2 turns), both players replay with different placements
6. Server validates combined result after each simultaneous reveal
7. Repeat until one pawn reaches the opponent's starting row

---

## Scoring

Win = first pawn to reach opponent's starting row. Match over immediately.

---

## Simultaneous Rule

Both players choose and lock their action before either is revealed. No turn order — both commit at the same time every turn.

---

## Contested Move Rule

| Conflict | Resolution |
|----------|-----------|
| Both move to same cell | Blocked — neither moves, both replay |
| Both place same wall segment | Wall exists — one wall placed, game continues, no replay |
| Different segments that together block | Both rejected — both specific segments on 2-turn cooldown, both players replay |

Pawn contesting is a valid strategy — sacrifice your move to deny their advance. Same-segment wall "conflict" is not a conflict, it is agreement.

---

## Crown Compatibility

✅ Applicable in series format. Spatial board with readable movement patterns — opponent's likely next step or wall placement is often inferable from the board state. Crown predictions on a critical wall placement are high-value.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **WallDuel** | Neutral / standard | — | Base |
| WallDuel Blitz | Neutral speed | 5 walls each, 7×7 board | Fewer walls, faster decisions |
| WallDuel Open | Neutral | 0 walls each, 9×9 | Pure movement race, no walls |
| Siege | Neutral variant | 15 walls each, 9×9 | More walls, more maze-building |

---

## Future Formats

| Format | Notes |
|--------|-------|
| Tournament bracket | Standard bracket |
| Crown variant | Series format with Crown active |

---

## Open Questions

| Question | Priority |
|----------|----------|
| Per-move time limit duration — decide at build time | Low |
