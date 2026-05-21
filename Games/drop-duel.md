---
game: DropDuel
status: spec-complete
added: 2026-05-02
---

# DropDuel

Two-phase Connect Four — both players secretly block cells before the game starts, then drop pieces simultaneously each round on the modified board. 3-game match format.

---

## Core Mechanic

6×7 board. Center bottom cell (column 4, row 1) is pre-blocked by the platform — neither player can use it, eliminating first-mover dominance on the dominant opening cell. Before each game, both players secretly and simultaneously place block cells. Blocks reveal together — no two games have the same board. Phase 2: both players drop one piece simultaneously each round, committing column choice before either is revealed.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ block placements sealed before reveal; column drops sealed each round before reveal |
| RNG | none — all placements and drops are player choices |
| Skill basis | spatial reasoning / Connect Four strategy / opponent-reading (block placement + column prediction) |
| Tiebreaker | board fills → overflow column unlocks → threat score → full refund (true tie) |
| Spillemyndighed | ✅ Provisional pass — sent to lawyer. Simultaneous mechanics confirmed: no RNG, all decisions are player choices. |

---

## Flow

1. **Phase 1 — Block placement (15 seconds):** Both players secretly and simultaneously choose cells to block. Blocks reveal together when time expires. Center bottom (column 4, row 1) is pre-blocked by platform before player blocks are placed.
2. **Phase 2 — Play:** Both players simultaneously commit a column drop each round — sealed before either is revealed. Both pieces land together. Per-round time limit enforced — if time expires, system auto-drops in first available column from right to left.
3. First to connect four wins.
4. **Simultaneous win same round:** if both players complete a 4-in-a-row on the same round, the player with more real pieces in their winning sequence wins. If equal — sudden death round.
5. **Overflow:** If main board fills with no winner, a locked 8th column (6 rows) unlocks. Play continues in column 8 only — simultaneous drops, same rules.
6. **Threat score:** If overflow also fills with no winner, count each player's longest unbroken chain of real pieces. Longest wins. Still tied: most chains of length 3+ wins.
7. **True tie** (all above exhausted): full refund to both players. No rake taken.

---

## Scoring

Win = match over. No point accumulation. Draw resolution: overflow column → threat score → full refund (true tie). Platform never takes rake on a refund.

---

## Simultaneous Rule

Phase 1: both players choose and lock block cells before either is revealed. Phase 2: both players commit a column drop each round before either is revealed — fully simultaneous throughout.

---

## Contested Cell Rule

**Phase 1 — block placement:** if both players block the same cell, treated as a single blocked cell. No replay, no advantage.

**Phase 2 — column drops:** if both players drop in the same column, both pieces land on that cell — it becomes a contested cell. Contested cells follow these rules:

- Neither player can WIN on a contested cell — the piece completing the 4-in-a-row must be a real (non-contested) piece dropped that round
- A contested cell CAN be part of a winning sequence — it can occupy any position except the completing piece
- Contested cells occupy space physically — gravity stacks normally above them
- Contested cells are visually distinct (split color) so both players can instantly read which cells are dead for win purposes

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

None.
