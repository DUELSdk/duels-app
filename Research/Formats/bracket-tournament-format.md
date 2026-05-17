# Bracket Tournament Format

Single-elimination bracket. One pot. Last player standing takes everything after rake.

**Legal status:** Pure individual skill, no RNG, no collective dependency. Confirmed under Spilleloven — journal 26-632347.

---

## Core Formulas

```
rounds     = log₂(seatsTotal)                  — must be integer → seatsTotal must be power of 2
pool       = seatsTotal × fee × 0.85            — 15% rake locked
winner_kr  = pool                               — full pot to winner, no consolation prizes
est_min    = rounds × 4 + 5                     — 4 min per round (all matches parallel) + 5 min buffer
```

**Seat count rule:** seatsTotal must be a power of 2 (8, 16, 32, 64, 128). Non-power-of-2 breaks bracket pairing.

---

## Standard Tier Table

Derived from the formulas. These are defaults — custom tournaments can override any variable.

| Fee | Seats | Rounds | Winner takes | Est. time | Notes |
|-----|-------|--------|-------------|-----------|-------|
| 10 KR | 64 | 6 | 544 KR | ~29 min | Entry-level, large field |
| 25 KR | 64 | 6 | 1.360 KR | ~29 min | |
| 50 KR | 64 | 6 | 2.720 KR | ~29 min | Marquee default |
| 100 KR | 32 | 5 | 2.720 KR | ~25 min | Smaller field, same prize as 50 KR |
| 250 KR | 16 | 4 | 3.400 KR | ~21 min | Elite, fast |
| 500 KR | 16 | 4 | 6.800 KR | ~21 min | Max tier |

**Design principle:** seat count scales inversely with fee. High fee = small field, fast resolution, high prize per player. Low fee = full bracket, big headline number, longer session.

**Minimum prize target:** winner should take ≥ 40× their entry fee. Below that the prize card doesn't look compelling next to a 1v1 duel.

```
min_seats = smallest power of 2 where (seats × fee × 0.85) / fee ≥ 40
          = smallest power of 2 ≥ 48
          = 64
```

Exception: high fee tiers (≥ 250 KR) can use 16 seats — the absolute prize number is large enough without needing a full 64-seat field.

---

## Time Estimate per Round Count

| Seats | Rounds | est_min formula | Display |
|-------|--------|----------------|---------|
| 8 | 3 | 3×4+5 | ~17 min |
| 16 | 4 | 4×4+5 | ~21 min |
| 32 | 5 | 5×4+5 | ~25 min |
| 64 | 6 | 6×4+5 | ~29 min |
| 128 | 7 | 7×4+5 | ~33 min |

**Round time assumption:** 60s lock window + 9 card reveals at ~1s each + ~60s transition = ~3-4 min per round. All matches in a round run simultaneously. The 4 min figure includes a light buffer. Total buffer (+5) accounts for late-start and bracket freeze delay.

---

## Custom Tournament Rules

Any variable can be overridden for special events. Document the override reason in the tournament record.

| Variable | Default | Override allowed | Example |
|----------|---------|-----------------|---------|
| seatsTotal | per tier table | Yes — must still be power of 2 | 128-seat special event |
| fee | per tier table | Yes | Mid-week 75 KR event |
| rake | 15% | No — locked | — |
| format | single-elim | Yes — double-elim supported | Double-elim weekly |
| invite-only | No | Yes | CD500 invite bracket |

**Double elimination:** two losses to eliminate. Rounds ≈ 2×log₂(N) − 1. Time estimate doubles roughly. Prize formula unchanged — same pool, same rake.

---

## Bracket Integrity Rules

- Bracket pairs randomised at lock time, not at registration
- Bracket freezes the moment the start time hits — no late entries
- Bye slots: if seats don't fill, remaining open seats are given byes in round 1 (advance automatically)
- A player who forfeits a match loses that match; opponent advances. No re-seeding.

---

## Open Questions

- [ ] Bye rule: auto-advance or collapse bracket to next power of 2?
- [ ] Double-elim: winners bracket vs losers bracket UI — how to display?
- [ ] Spectator mode: does the bracket update live for observers?
- [ ] Player bracket path shown to seated players before start?
