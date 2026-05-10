---
game: Card Duel
status: spec-complete
added: 2026-05-02
---

# Card Duel

Both players arrange a 9-card sequence simultaneously and lock — cards auto-resolve slot by slot. Pure psychology, zero information.

---

## Core Mechanic

Each player holds 3× Rock, 3× Scissors, 3× Paper. In Sealed mode, both arrange all 9 into a sequence and lock simultaneously before any reveal — outcome is 100% deterministic from that point. In Phase mode, players pick one card per round from their remaining hand, locking simultaneously each round. Used cards are always visible to both players throughout.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both players commit before either sees the other's move |
| RNG | none — outcome fully deterministic once locked |
| Skill basis | psychology / sequencing / opponent-reading |
| Tiebreaker | defined per format — see Scoring |

---

## Flow

**Sealed mode:**
1. Both players arrange their 9 cards into a sequence and lock simultaneously
2. Sequences reveal together
3. Slots resolve 1→9 automatically

**Phase mode:**
1. Both players pick one card from remaining hand and lock simultaneously
2. Both reveal — slot resolves
3. Repeat for all 9 rounds (used cards always visible)
4. Per-round time limit enforced. Expires → first card in hand played automatically, in type order (Rock → Scissors → Paper)

---

## Scoring

Win = 1 point, tie (same type vs same type) = 0 each, loss = 0. Most points after 9 rounds wins.

**Tiebreakers:**

| Format | Tiebreaker |
|--------|-----------|
| Sealed | Sudden death — each player picks one card (R/S/P) secretly, simultaneous reveal, repeat until broken. Always produces a winner. |
| Phase | Rematch — new hands, same pot, no new entry fee; if rematch ties → split pot |

---

## Simultaneous Rule

**Sealed:** Both players arrange and lock their full 9-card sequence before either is revealed.

**Phase:** Both players pick and lock one card per round before either is revealed.

---

## Match Screen Visibility

| What | Visible to opponent |
|------|-------------------|
| Your locked slot count | ✅ yes — "X/9 locked" shown |
| Your locked slot moves | ❌ no — shown as ■ (face-down) until reveal |
| Revealed slot moves (resolved rounds) | ✅ yes — shown after each round resolves |
| Your remaining hand (card counts) | ✅ yes — used cards always visible |

Slots reveal one at a time as each round resolves, not all at once at the end.

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

| Question | Priority |
|----------|----------|
| Legal status of Sealed mode (simultaneous sealed sequence) — needs Spillemyndighed opinion | High |
