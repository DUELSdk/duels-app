# Solo Tournament Formats

No teams. Payout determined entirely by your own win ratio. Zero teammate dependency.

Both formats run on the same proven math. Variables (entry fee, match count, cutoff, player count) are set per event. Mix and match formats across different events on the platform.

**Legal status:** Pure individual skill, no RNG, no collective dependency. Very low Spillemyndigheden risk.

---

## The Variables

| Variable | What it is | Typical range |
|----------|-----------|---------------|
| N | Player count in event | 20–500 |
| F | Entry fee | 10kr–500kr |
| M | Matches per player | 5, 7, or 10 |
| rake | Platform cut | 15% (locked) |
| P | Winner cutoff (Threshold only) | 20–30% |

Pot = N × F × 0.85

---

## Format 1 — Proportional

Every win earns a fixed slice. Pot splits across all players by win count.

```
Payout per win = 2 × F × 0.85 / M
```

Per-win value is constant regardless of player count — only entry fee and match count matter.

**Example — F=100kr, M=10:**

| Wins | Payout | Net |
|------|--------|-----|
| 10/10 | 170kr | +70kr |
| 8/10 | 136kr | +36kr |
| 5.9/10 | 100kr | break-even |
| 5/10 | 85kr | −15kr |
| 0/10 | 0kr | −100kr |

**Best for:** casual events, lower-stakes lobbies, new players. Soft landing — partial recovery even on bad sessions.

---

## Format 2 — Threshold

Top P% by win ratio split the entire pot. Everyone below gets nothing.

```
Your share = your wins / total wins of all qualifying players × pot
```

Tie-breaking at cutoff: split equally. No time-weighting.

**Example — F=100kr, M=10, N=100:**

Pot = 8,500kr

| Cutoff | Winners | Avg payout | Top player (9W) net |
|--------|---------|------------|---------------------|
| Top 10% | 10 | 850kr | ~+750kr |
| Top 20% | 20 | 425kr | ~+325kr |
| Top 30% | 30 | 283kr | ~+219kr |
| Top 50% | 50 | 170kr | ~+70kr (≈ proportional) |

**Best for:** competitive events, higher-stakes lobbies, skilled player retention. Top players extract from the full losing field — 3–5x upside vs proportional at equivalent stake.

---

## Matchmaking Constraint (both formats)

- No player meets the same opponent twice
- Minimum viable pool: 3×M players
- Odd player mid-event: bye = win (needs product confirmation)

---

## Live Ticker (both formats)

- Proportional: current projected payout after each match
- Threshold: live cutoff line ("Top 30% = 6+ wins — you're IN / OUT") + pot size + time remaining

---

## Open Questions

- [ ] Match count M — 5, 7, or 10 per event type?
- [ ] Minimum pool size before event starts
- [ ] Bye rule for odd player counts
- [ ] Which format runs at launch vs post-launch?
- [ ] Legal review — confirm tournament classification under Danish law
