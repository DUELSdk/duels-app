---
game: HexDuel
status: spec-complete
added: 2026-05-02
---

# HexDuel

Simultaneous Hex — both players pick a hex cell at the same time. First to form an unbroken chain across the board wins. No draws possible.

---

## Core Mechanic

Standard Hex on a 9×9 rhombus grid, played simultaneously. Red connects left and right edges. Blue connects top and bottom edges. Both players choose a hex each turn, lock simultaneously, reveal together. Contested hex (both choose same cell) = removed from play — neither piece placed, cell permanently unavailable to both players. Simultaneous play breaks all memorised Hex theory — you predict, not react. No draws are mathematically possible in Hex.

Per-move time limit enforced. Expires → first available cell in scan order (top-left to bottom-right of the rhombus grid). Deterministic.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both placements committed before either is revealed each turn |
| RNG | none |
| Skill basis | spatial reasoning / connection strategy / opponent-reading |
| Tiebreaker | not needed — draws are mathematically impossible in Hex |

---

## Flow

1. Both players choose a hex cell and lock simultaneously
2. Placements reveal together
3. Contested cell (both chose same): cell removed from play — neither piece placed, cell permanently gone, both choose again on next turn
4. Repeat until one player forms an unbroken chain connecting both their edges
5. That player wins

---

## Scoring

Win = match over. First unbroken chain across both player edges wins. No point accumulation, no draws.

---

## Simultaneous Rule

Both players choose and lock their hex cell before either placement is revealed. No turn order — both commit at the same time every move.

---

## Contested Move Rule

- **Dead zone** — neither piece placed, cell permanently removed from play. Both players choose a new cell next turn. Contesting intentionally is a valid strategy — sacrifice your move to permanently destroy a cell critical to opponent's chain. No infinite loops possible since the cell no longer exists after one contest.

---

## Crown Compatibility

✅ Applicable in series format. Spatial board with clear connection-path reads — opponent's "obvious" next cell is often visible from the board state, making Crown predictions high-value and high-risk. Crown does not apply when replaying a contested turn.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **HexDuel** | Neutral / standard | — | Base |
| HexDuel Blitz | Neutral speed | 7×7 board | Smaller board, faster chain |
| HexDuel Deep | Neutral extended | 11×11 board | Classic Hex size, longer match |
| Dead Zones | Neutral variant | 9×9, contested = both pieces placed | Contested cells filled with neutral pieces visible on board — visually distinct from base game's removed cells, same strategic effect |

---

## Future Formats

| Format | Notes |
|--------|-------|
| Tournament bracket | Standard bracket |
| Crown-only variant | Series format with Crown active from game 1 |

---

## Open Questions

| Question | Priority |
|----------|----------|
| Per-move time limit duration — decide at build time | Low |
