---
game: BlottoDuel
status: spec-complete
added: 2026-05-02
---

# BlottoDuel

Both players secretly distribute 10 units across 5 battlefields simultaneously — higher allocation wins the field. Three rounds. Previous allocations always visible.

---

## Core Mechanic

Colonel Blotto format. Each player has 10 units to distribute across 5 battlefields in any combination (0–10 per field, must total 10). Both distribute secretly, lock simultaneously, reveal together. Higher allocation wins the field — tied field goes to nobody. Most fields won across 3 rounds wins the match. Full allocation history visible after each round — rounds 2 and 3 are as much psychology as math.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both allocations committed before either is revealed each round |
| RNG | none |
| Skill basis | psychology / math / opponent-reading |
| Tiebreaker | sudden death round — same mechanic |

---

## Flow

1. Both players secretly distribute 10 units across 5 fields and lock simultaneously
2. Allocations reveal together — each field resolved (higher wins, tie = nobody)
3. Tally fields won for round 1
4. Round 1 allocations now fully visible to both players
5. Repeat for rounds 2 and 3
6. Most total fields won across 3 rounds wins

**Timer default:** If allocation timer expires with units still unplaced, all remaining units dumped into field 1 automatically. Deterministic.

---

## Scoring

Each field won = 1 point per round. Total across 3 rounds determines winner.

**Sudden death (no split pot — play until winner):**
1. SD at 3 fields, 10 units — play up to 2 rounds. Still tied after both →
2. SD at 2 fields, 10 units — repeat until decisive. No round limit. No split.

---

## Simultaneous Rule

Both players lock their full unit distribution before either allocation is revealed. No turn order — both think and commit at the same time every round.

---

## Contested Move Rule

Not applicable. BlottoDuel has no shared board or cell — each player allocates independently across their own distribution. Tied battlefield = neither player wins it (built into core scoring).

---

## Crown Compatibility

Not applicable. No spatial board or shared cell to claim — Crown has no mapping onto simultaneous unit distribution.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **BlottoDuel** | Neutral / standard | — | Base |
| Blitz Blotto | Neutral speed | 7 units, 3 fields, 1 round | Fast single-round variant |
| Deep Blotto | Neutral extended | 15 units, 7 fields, 5 rounds | Longer match |
| Fog of War | Military | 10 units, 5 fields, 6 battles (3 Wars × 2) | Commit 2-battle plan per War sealed. Between Wars: after-action report shows field W/L only — no enemy unit numbers. Full reveal at match end. Deduction replaces direct read. |
| Escalating | Neutral | 10/15/20 units, 5 fields, 3 rounds | Unit pool grows each round |

---

## Future Formats

| Format | Notes |
|--------|-------|
| FFA | 3 players, same fields |
| Tournament bracket | Standard bracket |

---

## Open Questions

None.
