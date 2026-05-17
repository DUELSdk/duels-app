---
game: CodeDuel
status: spec-complete
added: 2026-05-02
---

# CodeDuel

Both players set a secret code simultaneously, then race in parallel to crack each other's code in real-time. Fewest guesses wins.

---

## Core Mechanic

Classic Mastermind duel format. Each player sets a 4-slot, 6-color code (repeats allowed) simultaneously before guessing begins. Both then crack each other's code in parallel — guessing in real-time, receiving feedback after each guess. The player who cracks the opponent's code in fewest guesses wins. Per-move time limit enforced — expires → system submits first valid combination (1-1-1-1 in slot order).

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both codes set before either is revealed; guessing runs in parallel |
| RNG | none — all guesses are player choices; default guess is deterministic |
| Skill basis | deduction / logic |
| Tiebreaker | rematch — new codes, same pot, no new entry fee |

---

## Flow

1. Both players set a secret 4-slot code simultaneously and lock
2. Both players begin guessing the opponent's code in parallel, real-time
3. After each guess: black pegs (right color, right position) + white pegs (right color, wrong position)
4. First to crack opponent's code wins. Tie (same guess count) → rematch
5. 10 guesses max with no winner → split pot, no rake

---

## Scoring

Win = crack opponent's code in fewer guesses. Same guess count → rematch (new codes, same pot, no new entry fee). 10 guesses with no crack → split pot — both players lose entry fee.

**Tie resolution order:**
1. Fewer guesses wins
2. Same guess count → rematch (new codes, same pot)
3. 10 guesses, neither cracks → split pot (entry fees kept by platform)

---

## Simultaneous Rule

Both players lock their secret code before any guessing begins. Guessing phase runs in parallel — each player guesses independently in real-time, no waiting for opponent.

---

## Contested Move Rule

Not applicable. Each player guesses against their own target code — no shared board, no conflict possible.

---

## Crown Compatibility

Not applicable. No spatial board or shared position to claim — Crown has no mapping onto parallel code-cracking.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **CodeDuel** | Neutral / standard | — | Base |
| Vault Cracker | Bank heist | 4 colors, repeats allowed | Visual reskin |
| Cipher Agent | Spy | 5 numbers, no repeats | No repeats variant |
| Potion Brewer | Fantasy | 4 slots, 8 possible ingredients | Wider color pool |
| Bomb Squad | Defuse theme | 4 colors, repeats allowed | Race — first to crack wins regardless of guess count |
| Starmap | Sci-fi | 3 slots, 6 symbols | Shorter code |
| Heist | Multi-stage | 3 rounds, new code each round | Best of 3 rounds |

---

## Fraud & Anti-Cheat

See `Company/compliance.md` → Anti-Cheat Policy for full platform policy.

**CodeDuel-specific vectors:**

| Vector | Risk | Mitigation |
|--------|------|------------|
| Bot solver (automated guessing) | Medium | Input fingerprinting — mechanical timing detected |
| Human-assisted solver (bot decides, human types) | Medium | Statistical flagging — near-perfect efficiency across many games |
| Collusion (share codes pre-match) | High | Split pot on same-guess tie = both lose entry fee. No profit motive. |
| Code stored client-side | High | Codes stored server-side only — never sent to client until match ends |

**Legal deterrent:** MitID attaches real CPR to every account. Cheating for financial gain = bedrageri (§279 straffeloven). Confirmed cases referred to Politiet.

---

## Future Formats

| Format | Notes |
|--------|-------|
| Tournament bracket | Standard bracket |

---

## Open Questions

| Question | Priority |
|----------|----------|
| Per-move time limit duration — decide at build time | Low |
