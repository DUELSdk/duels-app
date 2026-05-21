---
game: CycleDuel
status: spec-complete
added: 2026-05-02
---

# CycleDuel

Both players pick from a 5-type cycle hand across 3 blocks — each block starts with a peek at the opponent's first card before locking a 3-card sequence.

---

## Core Mechanic

5 types in a cycle: Feint, Guard, Strike, Rush, Grab. Each beats 2, loses to 2, ties same. Players hold 2 of each type (10 cards). Match runs 3 blocks of 3 rounds — 9 rounds total. At the start of each block, both players see each other's first card as a peek before locking their 3-card sequence for that block. Used cards are always visible throughout. Block 3 forces a bench: 4 cards remain, player picks 3 to play and leaves 1 out.

```
Feint  beats Guard and Strike
Guard  beats Strike and Rush
Strike beats Rush and Grab
Rush   beats Grab and Feint
Grab   beats Feint and Guard
```

Cycle diagram always on screen — no memorisation required.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both players lock 3-card sequence before either is revealed each block |
| RNG | none |
| Skill basis | deduction / opponent-reading / card management |
| Tiebreaker | sudden death — see Scoring |

---

## Flow

1. **Block 1:** Both see each other's first card → each locks a 3-card sequence simultaneously → auto-resolve slots 1–3. Timer expires → first 3 cards in hand played in type order (Feint → Guard → Strike → Rush → Grab)
2. **Block 2:** Both see each other's first card → each locks 3 from remaining 7 simultaneously → auto-resolve slots 4–6. Timer expires → first 3 remaining cards in type order
3. **Block 3:** Both see each other's first card → each picks 3 from remaining 4 (bench 1) and locks simultaneously → auto-resolve slots 7–9. Timer expires on bench choice → first card in type order is benched automatically

---

## Scoring

Win = 1 point, tie (same type vs same type) = 0 each, loss = 0. Most points after 9 rounds wins.

**Tiebreaker:** Sudden death — each player picks one of the 5 types secretly, simultaneous reveal. Repeat until broken. No new entry fee.

**Note:** Deliberately playing the same type as opponent is a valid strategic move — burns their card, preserves your counters for later blocks.

---

## Simultaneous Rule

Both players lock their full 3-card sequence for the block before either sequence is revealed. The peek (opponent's first card of the block) is visible to both before locking.

---

## Contested Move Rule

Not applicable. CycleDuel resolves sequentially — slot by slot within each block. No spatial placement, no cell conflict possible.

---

## Crown Compatibility

Not applicable. No board position or cell to claim — Crown mechanic has no mapping onto a sequence arrangement.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **CycleDuel** | Neutral / standard | — | Base |
| Faction War | Medieval | 5-type reskin | Visual only |
| Cyber Clash | Sci-fi | 5-type reskin | Visual only |
| ElementDuel | Elements | 7 types — Fire/Water/Earth/Air/Lightning/Ice/Thunder | Expanded cycle |
| Beast War | Animals | 7 types | Expanded cycle |
| Blind Duel | Neutral | No peek — pure sealed format | No block peek mechanic |

---

## Future Formats

| Format | Notes |
|--------|-------|
| FFA | 3-player variant — same engine |
| Tournament bracket | Standard bracket format |

---

## Open Questions

None.
