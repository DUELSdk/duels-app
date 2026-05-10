---
game: DropDuel
status: spec-complete
added: 2026-05-02
---

# DropDuel

Two-phase Connect Four — both players secretly block one cell before the game starts, then play on the modified board.

---

## Core Mechanic

Standard Connect Four on a 6×7 board, but before play begins both players secretly and simultaneously place one blocked cell. Blocks are revealed at game start — no two games have the same board configuration. Eliminates memorised opening theory. Phase 2 is standard Connect Four play with a per-move time limit.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both block placements committed before either is revealed; per-move play has per-move time limit |
| RNG | none — all placements are player choices |
| Skill basis | spatial reasoning / Connect Four strategy / opponent-reading (block placement) |
| Tiebreaker | board fills with no winner → split pot |

---

## Flow

1. **Phase 1 — Block placement (15 seconds):** Both players secretly and simultaneously choose one cell to block. Blocks reveal together when time expires.
2. **Phase 2 — Play:** Standard Connect Four on the modified 6×7 board. Players alternate dropping pieces. Per-move time limit enforced — if time expires, system auto-places in first available column from right to left.
3. First to connect four wins. Board fills with no winner → split pot.

---

## Scoring

Win = match over. No point accumulation. Draw (full board, no four-in-a-row) = split pot, no rake.

---

## Simultaneous Rule

Phase 1: both players choose and lock their block cell before either is revealed. Phase 2: standard alternating play — not simultaneous per move.

---

## Contested Move Rule

Not applicable to Phase 2 (alternating play). Phase 1 block placement: if both players block the same cell, both blocks land on that cell (treated as a single blocked cell — no replay, no advantage to either).

---

## Crown Compatibility

✅ Applicable in series format. Predicting opponent's column drop during Phase 2 play is a direct mapping — board state makes the "obvious" move readable, which is exactly what makes Crown powerful here.

Crown does not apply to Phase 1 block placement (simultaneous sealed choice, nothing to steal).

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **DropDuel** | Neutral / standard | — | Base |
| Trench War | Military | Drop grenades | Visual reskin |
| Virus Spread | Sci-fi/bio | 7×8 board, 2 blocks each | Larger board, more disruption |
| Crystal Cave | Fantasy | 6×7, win with 5 in a row | Win condition change |

---

## Future Formats

| Format | Notes |
|--------|-------|
| 1v1v1 | Wider board, three players |
| Tournament bracket | Standard bracket |

---

## Open Questions

| Question | Priority |
|----------|----------|
| Legal status needs Spillemyndighed opinion | High |
