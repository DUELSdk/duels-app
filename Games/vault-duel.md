---
game: VaultDuel
status: spec-complete
added: 2026-05-18
updated: 2026-05-18
---

# Vault Duel

Both players secretly pick a dice configuration from a shared pool, then bid on the combined count of a forced face value — reading the opponent's option through bid patterns to call bluffs or stay safe.

---

## Core Mechanic

Each match, both players see the same pool of curated options — each a fixed set of dice faces. Both pick one simultaneously and secretly, locking it for the match. A face value is forced each round; both bid a count ("I think there are X dice showing face Y across both our combined options"). Both then simultaneously CALL or STAND. The skill is in reading which option the opponent picked from their bid behaviour across rounds, and using that to decide when to call a bluff.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ option pick, bid, and call/stand are all simultaneous sealed commitments |
| RNG | none — options are curated presets drawn from a pool, not randomly generated |
| Skill basis | estimation / deduction / opponent-reading / psychology |
| Tiebreaker | see Scoring |
| Spillemyndighed | ✅ Provisional pass — sent to lawyer. Preset options framing confirmed: no random generation, all bids and decisions are player choices. |

---

## Options

Each match draws **4 options** from a large curated pool (50+ options). Both players see the same 4. Options are never labelled by strength — just shown as dice configurations.

**Option design rules:**
- 10–12 dice per option
- Max 3 of any single face value per option
- No option has a higher guaranteed scoring ceiling than any other by more than 1 die on any face
- Pool contains enough variety that no single option is recognisably dominant across all face schedules

Options are designed so that strength is schedule-dependent — an option strong on face 5 is not strong on face 2. No option wins all rounds. The "best" option in any match is the one that fits the round schedule AND the opponent's tendencies, not a fixed answer.

Pool is intentionally large (50+). Since only 4 options are ever shown per match, players never need to memorize the full pool — variety ensures fresh matchups without cognitive overload.

---

## Round Face Schedule

Each match runs **5 rounds**. Before both players pick their options, the full face schedule is revealed — one face value per round, no repeats.

Example schedule:
| Round | Target face |
|-------|------------|
| 1 | 4 |
| 2 | 6 |
| 3 | 2 |
| 4 | 5 |
| 5 | 3 |

**Schedule source:** Selected from a large preset pool of curated schedules using the match ID as seed — deterministic (auditable, reproducible) and varied (pool large enough that players cannot memorize common sequences). Both players see the full schedule before picking options. Option selection is the first major strategic decision: which of the 4 options gives the best combined strength across the rounds that matter most to win.

---

## Flow

**Match start:**
1. Round face schedule revealed to both players
2. Both players simultaneously pick one option from the pool (sealed)

**Each round:**
1. Target face for this round is shown
2. Both players simultaneously submit a bid: X = "I think there are X dice showing face [Y] across both our combined options"
3. Both bids revealed simultaneously
4. Both players simultaneously decide: **CALL** or **STAND**
5. Resolve (see Resolution)
6. Point awarded

**After resolution:**
- Both STAND → options stay hidden, same options kept for next round
- Anyone CALLS → both options fully revealed to both players, both pick new options before next round

**Match ends** when one player reaches 3 points.

---

## Resolution

**Validity:** A bid is valid if the actual combined count of the target face across both options is ≥ the bid count.

**Scoring:** Highest valid bid wins the point. Score = bid count. Ties on count broken by: player whose option contributed more of that face wins. If still tied: point split (each player gets 0.5).

**Call/Stand matrix:**

| P1 | P2 | Revealed | Outcome |
|----|-----|----------|---------|
| STAND | STAND | Combined count of target face only | Higher valid bid wins. Tied valid bids → split (0.5 each). Options stay hidden. |
| CALL | STAND | Both options fully revealed | Both bids checked. Higher valid bid wins. |
| STAND | CALL | Both options fully revealed | Both bids checked. Higher valid bid wins. |
| CALL | CALL | Both options fully revealed | Both bids checked. Higher valid bid wins. |

**Both invalid (any scenario):** Lower bid wins (less wrong). Equal invalid bids → split (0.5 each).

**STAND deduction:** On a STAND round, the combined count is shown — e.g. "combined had 5 fours." A player who knows their own option can deduce their opponent's contribution on that face (combined − own = opponent's). Partial information, not full option reveal.

---

## Deduction Arc

After a call, both options are revealed. Neither player picks the same option again — both pick fresh from the pool. However, the revealed option informs the read going forward: not "they'll pick Option X next" but "they tend toward options with high face-4 concentration" or "they go for spread configurations under pressure." The read is on the player's style, not a specific option.

Over a match, bid patterns from STAND rounds also carry signal: high bids on specific faces suggest concentration there, conservative bids suggest spread options or bluffing. Skilled players build a profile of the opponent's tendencies across rounds.

---

## Scoring

**Within a match:** First player to 3 points wins the match.

**Series:** Best of 3 matches — first to win 2 matches wins the series and takes the purse.

**Maximum rounds:** 5 per match (if it reaches 2–2 before a player hits 3). Up to 3 matches = 15 rounds max.

**Tiebreaker (series tied 1–1):** Third match played to 3 points. No split — play until decided.

---

## Simultaneous Rule

All three decisions are simultaneous and sealed:
1. **Option pick** — both lock before either is shown
2. **Bid** — both submit count before bids are revealed
3. **Call/Stand** — both decide after seeing bids, before resolution

No turn order at any stage.

---

## Contested Move Rule

Not applicable. Players bid independently on their own count estimate — there is no shared cell or move to contest.

---

## Crown Compatibility

Not applicable. Crown maps onto predicting an opponent's exact spatial move. Vault Duel has no board or cell — bids are counts on a continuous scale, not discrete positional choices.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **Vault Duel** | Neutral / standard | — | Base |
| Vault Blitz | Speed | 3 rounds per match, 8 dice per option | Faster, less deduction |
| Deep Vault | Extended | 7 rounds per match, 12 dice per option | Longer arc, more information |
| Fog Vault | Hidden schedule | Round faces hidden until round starts | No pre-pick schedule strategy — pure adaptation |

---

## Future Formats

| Format | Notes |
|--------|-------|
| Tournament bracket | Standard bracket |
| Team variant | 2v2 — teammates see each other's options, not opponents' |

---

## Open Questions

| Question | Priority |
|----------|----------|
| ~~How many options shown per match~~ | ✅ 4 options per match |
| ~~How many rounds in the face schedule~~ | ✅ 5 rounds, no repeats |
| ~~How is the face schedule determined per match~~ | ✅ Preset pool, match ID as seed — deterministic + varied |
| ~~How many options in the curated pool~~ | ✅ 50+ — pool size is free since players only ever see 4 |
| Timer per phase — option pick, bid, call/stand each need separate timers | Medium — decide at build time |
| ~~Legal review — present to Spillemyndighed alongside existing ruling~~ | ✅ Sent to lawyer — provisional pass |
| ~~Training gate~~ | ✅ Soft gate — guided tutorial prompted before first real-money entry, skippable |
