---
game: Card Duel
status: spec-complete
added: 2026-05-02
---

# Card Duel

Both players arrange a 9-card sequence simultaneously and lock — cards auto-resolve slot by slot. Best-of-3 format: after each game you've seen the opponent's full sequence, and the real opponent-reading begins.

---

## Core Mechanic

Each player holds 3× Rock, 3× Scissors, 3× Paper. Both arrange all 9 into a sequence and lock simultaneously before any reveal — outcome is 100% deterministic from that point. Match is Best-of-3 games. After Game 1, both sequences are fully visible — Game 2 and 3 are where psychology and pattern-reading emerge.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both players commit before either sees the other's move |
| RNG | none — outcome fully deterministic once locked |
| Skill basis | psychology / sequencing / opponent-reading across games |
| Tiebreaker | defined — see Scoring |
| Spillemyndighed | ✅ Provisional pass — sent to lawyer. Sealed sequence + Best-of-3 format confirmed: no RNG, fully deterministic once locked. |

---

## Flow

Each game (of 3):
1. Both players arrange their 9 cards into a sequence and lock simultaneously
2. Sequences reveal together
3. Slots resolve 1→9 automatically

After Game 1: both full sequences visible. Players re-arrange for Game 2. After Game 2 (if tied 1–1): Game 3 decider.

---

## Scoring

**Per game:** Win = 1 point, tie (same type vs same type) = 0 each, loss = 0. Most points after 9 slots wins that game.

**Match:** First to win 2 games wins the match.

**Slot tie (game tied after 9):** Sudden death — each player picks one card (R/S/P) secretly, simultaneous reveal, repeat until broken. Always produces a game winner.

**Match tie (1–1 after 2 games with no Game 3 decider needed):** Cannot happen — Best-of-3 always produces a 2–0 or 2–1 result after Game 3.

---

## Simultaneous Rule

Both players arrange and lock their full 9-card sequence before either is revealed. This applies to every game in the Best-of-3.

---

## Match Screen Visibility

| What | Visible to opponent |
|------|-------------------|
| Your locked slot count | ✅ yes — "X/9 locked" shown |
| Your locked slot moves | ❌ no — shown as ■ (face-down) until reveal |
| Revealed slot moves (resolved slots) | ✅ yes — shown after each slot resolves |
| Previous game sequences | ✅ yes — full sequences visible after each game ends |

---

## Contested Move Rule

Not applicable. Card Duel resolves sequentially — slot 1 vs slot 1 through slot 9. No spatial placement, no cell conflict possible.

---

## Crown Compatibility

Not applicable. No cell or position to claim — Crown mechanic has no mapping onto a sequence arrangement.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **Card Duel** | Neutral / standard | — | Base |
| Blade Duel | Samurai | RPS reskin | Visual only |
| Spell Clash | Fantasy magic | RPS reskin | Visual only |
| Street Fight | Urban | RPS reskin | Visual only |
| War Room | Military | RPS reskin | Visual only |

Cycle diagram (R beats S, S beats P, P beats R) always visible on screen.

---

## Future Formats

| Format | Notes |
|--------|-------|
| Blitz | 6-card variant — 2R/2S/2P per player, faster match |
| FFA | 1v1v1 — highest win-count takes pot, split pot on 3-way tie |

---

## Open Questions

None.
