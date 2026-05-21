---
game: HexDuel
status: spec-complete
added: 2026-05-02
updated: 2026-05-14
---

# HexDuel

Simultaneous Hex — both players pick a hex cell at the same time. First to form an unbroken chain across the board wins. No draws possible.

---

## Core Mechanic

Standard Hex on a 9×9 rhombus grid, played simultaneously. Red connects left and right edges. Blue connects top and bottom edges. Both players choose a hex each turn, lock simultaneously, reveal together. Contested hex (both choose same cell) = dead zone — cell permanently removed from play, neither piece placed. Simultaneous play breaks all memorised Hex theory — you predict, not react. No draws are mathematically possible in Hex.

Per-move time limit: **20 seconds**. Expires → first available cell in scan order (top-left to bottom-right of the rhombus grid). Deterministic.

---

## Legal Basis

| Check | Status |
|-------|--------|
| Simultaneous decisions | ✅ both placements committed before either is revealed each turn |
| RNG | none |
| Skill basis | spatial reasoning / connection strategy / opponent-reading |
| Tiebreaker | dead-zone split — see Scoring |
| Spillemyndighed | ✅ Provisional pass — sent to lawyer. Simultaneous incomplete-information mechanic flagged alongside ShipDuel review: no RNG, all placements are player choices. |

**First-player advantage eliminated:** Standard Hex is mathematically proven to be a first-player win under perfect play (strategy-stealing argument, Nash 1948). HexDuel's simultaneous rule eliminates this entirely — there is no first player. Both commit blind every turn. This is a structural fairness improvement over original Hex and strengthens the skill-only legal position.

**Dead-zone and no-draw:** The Hex Theorem (no draws) assumes a fully filled board. Dead zones remove cells rather than fill them. If enough critical cells are dead-zoned, neither chain may be completable — handled by split pot rule below.

---

## Board

**Size:** 9×9 rhombus grid (81 cells).

Variants use different sizes — see Themes & Variants. The 9×9 base is chosen for match length: ~15–25 moves to win, fast enough for real-money sessions without dragging.

---

## Flow

1. Both players choose a hex cell and lock simultaneously (20s timer)
2. Placements reveal together
3. Contested cell (both chose same): **dead zone** — cell permanently removed, neither piece placed. Both choose again next turn.
4. Repeat until one player forms an unbroken chain connecting both their edges — that player wins
5. If board reaches a state where neither chain is completable: split pot (see Scoring)

---

## Scoring

Win = first unbroken chain across both player edges. No point accumulation.

**Dead-zone split:** If the board reaches a state where neither player can complete a chain (all remaining cells are isolated from viable paths for both sides) — split pot. Entry fee kept by platform. No refund on rake.

This is a strategic outcome, not RNG. A player who dead-zones aggressively risks creating a split — sacrificing prize probability for board control. The trade-off is intentional.

---

## Simultaneous Rule

Both players choose and lock their hex cell before either placement is revealed. No turn order — both commit at the same time every move.

---

## Contested Move Rule

**Dead zone** — neither piece placed, cell permanently removed from play. Both players choose a new cell next turn.

Contesting intentionally is a valid strategy — sacrifice your move to permanently destroy a cell critical to opponent's chain. No infinite loops possible since the cell no longer exists after one contest.

---

## Training Gate

HexDuel uses a soft gate — players are prompted to complete the guided tutorial before entering real-money rooms, but can skip. The Big Three (Card Duel, CycleDuel, DropDuel) are pick-up-and-play. HexDuel's connection strategy is not immediately obvious — training protects players who want it and demonstrates platform due diligence.

**Format: guided tutorial, not a bot match.** Interactive walkthrough — shows the board, explains edge connections, walks through an example chain, presents a few positions and asks the player to choose the right move. Player thinks for themselves; the guide confirms or corrects. No adversarial match. No win/loss anxiety.

**Soft gate flow:** Before entering a real-money room for the first time, player sees a prompt: "HexDuel has a learning curve. Complete the guide first? [Take the guide] [Skip]". Either path continues to the room. One-time prompt per account.

**Platform note:** Soft training gate is still a responsible gaming argument — platform offered the player a chance to understand the game. Document in `Company/compliance.md`.

---

## Crown Compatibility

✅ Applicable in series format. Spatial board with clear connection-path reads — opponent's "obvious" next cell is often visible from the board state, making Crown predictions high-value and high-risk. Crown does not apply when replaying a contested turn.

---

## Bot Notes (build reference)

Standard Hex bots use MCTS (Monte Carlo Tree Search) with virtual connection heuristics — scoring cells by how critical they are to both players' shortest paths.

| Bot tier | Behaviour | Used for |
|----------|-----------|---------|
| Ranked bot | Deeper MCTS, virtual connections, dead-zone aware | Optional practice (no training bot — replaced by guided tutorial) |

Key Hex concepts for bot implementation:
- **Virtual connections** — two cells are virtually connected if they can be joined regardless of opponent's single move
- **Dead-cell analysis** — cells irrelevant to either player's path can be deprioritised
- **Bridge pattern** — two pieces with a shared virtual connection form a bridge; a strong bot protects bridges

For simultaneous play, the bot must predict likely opponent cells rather than react to placed pieces. Training bot can skip prediction — just plays own strategy naively.

---

## Themes & Variants

| Name | Theme | Setup changes | Notes |
|------|-------|--------------|-------|
| **HexDuel** | Neutral / standard | 9×9 | Base |
| HexDuel Blitz | Neutral speed | 7×7 board, 15s timer | Smaller board, faster chain |
| HexDuel Deep | Neutral extended | 11×11 board, 20s timer | Classic Hex size, longer match |
| Dead Zones | Neutral variant | 9×9, contested = both pieces placed | Contested cells filled with neutral pieces — same strategic effect, different visual |

---

## Future Formats

| Format | Notes |
|--------|-------|
| Tournament bracket | Standard bracket |
| Crown-only variant | Series format with Crown active from game 1 |

---

## Open Questions

| Question | Priority |
|----------|----------|
| Per-move time limit confirmed at 20s — revisit post-launch if matches feel rushed | Low |
| Dead-zone split detection — server must evaluate chain-possibility after each dead zone. Define algorithm at build time. | Medium |
| ~~Training bot win rate target~~ | ✅ Replaced by guided tutorial — no bot, no win/loss metric |
| ~~Legal confirmation — simultaneous incomplete-information mechanic~~ | ✅ Sent to lawyer alongside ShipDuel review — provisional pass |
