# GAMES.md — DUEL Game Specifications

Full rules for all games. Referenced by CLAUDE.md.

---

## Launch Games

### Card Duel
Sealed sequential RPS. Pure psychology, zero randomness.

**Hand:** 9 cards — 3× Rock, 3× Scissors, 3× Paper (identical for both players)

**Flow:**
1. Both players arrange 9 cards into a sequence and lock simultaneously
2. Cards auto-resolve sequentially — slot 1 vs slot 1 through slot 9
3. Used cards always visible to both players throughout

**Match screen visibility rules:**
- Opponent's locked slots are NEVER shown during locking phase — shown as face-down (■) regardless of how many they have locked
- Slots only reveal one at a time as each round resolves (slot 1 reveals, then slot 2, etc.)
- You can see how many slots the opponent has locked (count), but not which cards

**Scoring:** Win = 1pt, tie (same vs same) = 0 each. Most points wins.
**Tiebreaker:** Sudden death — each player picks one fresh card (R/S/P) secretly, simultaneous reveal, repeat until broken.

**Themes (reskins, same engine):** Blade Duel (samurai) · Spell Clash (fantasy) · Street Fight (urban) · War Room (military)

---

### CycleDuel
5-type cycle card game with information reveals.

**The cycle:**
```
Feint  beats Guard and Strike
Guard  beats Strike and Rush
Strike beats Rush and Grab
Rush   beats Grab and Feint
Grab   beats Feint and Guard
```
Cycle diagram always on screen — no memorisation required.

**Hand:** 2 of each type = 10 cards.
**Format:** 3 blocks of 3 rounds = 9 rounds. 1 card benched in block 3 (player picks which of 4 remaining).

**Flow per block:**
1. Each player reveals one card from their hand (freely chosen — any card, any position in the upcoming sequence)
2. Both see each other's revealed card simultaneously
3. Lock 3-card sequence for this block (revealed card can go in any slot)
4. Auto-resolve

**Peek rule:** The reveal is informational only — position is not fixed. Opponent knows one of your 3 cards but not where it will land. You can show a weak card to bait a counter you're not playing. Pure mind games.

**Scoring:** Same as Card Duel. Tie → sudden death: pick from 5 types secretly, simultaneous reveal.

**Strategic note:** Playing same type as opponent (from peek) is valid — burns their card, preserves your counters. Showing a card you intend to sacrifice is equally valid.

**Themes & variants:**
| Name | Theme | Format |
|------|-------|--------|
| CycleDuel | Combat | 5 types, standard |
| Faction War | Medieval | 5 types, reskin |
| Cyber Clash | Sci-fi | 5 types, reskin |
| ElementDuel | Elements | 7 types (Fire/Water/Earth/Air/Lightning/Ice/Thunder) |
| Beast War | Animals | 7 types |
| Blind Duel | Neutral | 5 types, no peek — pure sealed |

---

### DropDuel
Two-phase Connect Four. Under 60 seconds per match.

**Phase 1 — Block placement (15s):**
Both players secretly and simultaneously place 1 blocked cell. Revealed at game start.

**Block rules:**
- Not bottom row (trivially breaks columns)
- Not top row (no strategic value)
- Solid block — pieces stack on top, permanently occupied
- Low blocks are high value — cut off entire column above

**Phase 2 — Play:**
Standard Connect Four on modified 6×7 board. Per-move time limit — auto-place in first available column right-to-left on timeout.

**Draw:** Board fills with no winner = split pot, no rake.

**Themes & variants:**
| Name | Theme | Board | Blocks | Win |
|------|-------|-------|--------|-----|
| DropDuel | Standard | 6×7 | 1 each | 4-in-a-row |
| Trench War | Military | 6×7 | 1 each | 4-in-a-row |
| Virus Spread | Bio/sci-fi | 7×8 | 2 each | 4-in-a-row |
| Crystal Cave | Fantasy | 6×7 | 1 each | 5-in-a-row |

---

## Post-Launch Games

### ReverseDuel
Classic Othello with pre-game block mechanic. Kills memorized opening books.

**Pre-game:** Each player secretly places 1 blocked cell simultaneously. Revealed at game start.
**Format:** 8×8 board. Shared 60s time pool (chess clock style).
**Tiebreaker:** Equal pieces when time runs out = split pot.

**Themes & variants:**
| Name | Theme | Board | Blocks |
|------|-------|-------|--------|
| ReverseDuel | Neutral | 8×8 | 1 each |
| Territory War | Military | 8×8 | 1 each |
| Plague | Bio/sci-fi | 8×8 | 2 each |
| Realm | Medieval | 10×10 | 2 each |
| Blitz Flip | Speed | 8×8 | 1 each |

---

### CodeDuel (Mastermind)
Both players crack each other's code simultaneously in real-time.

**Code:** 4 slots, 6 colors, repeats allowed.
**Feedback:** Black pegs (right color, right slot) + white pegs (right color, wrong slot).

**Flow:**
1. Both players set a secret code simultaneously
2. Both guess opponent's code in parallel, real-time
3. Fewest guesses wins
4. Tie → rematch, new codes, same pot (no new entry fee)
5. 10 guesses max with no winner → split pot

**Themes & variants:**
| Name | Theme | Format |
|------|-------|--------|
| Vault Cracker | Bank heist | 4 colors, repeats, fewest guesses |
| Cipher Agent | Spy | 5 numbers, no repeats |
| Potion Brewer | Fantasy | 4 slots, 8 ingredients |
| Bomb Squad | Defuse | Race — first to crack wins |
| Starmap | Sci-fi | 3 slots, 6 symbols |
| Heist | Multi-stage | Best of 3 rounds, new code each |

---

## Cross-Game Modes (post all 3 launch games)

### Gauntlet
Best of 3 across launch games. Fixed rotation: Card Duel → CycleDuel → DropDuel. Rake taken once on combined pot. If 1-1 after 2, third game decides.

### Pick & Ban
Each player bans 1 game, remaining game is played. With 4+ games: ban 1 each, pick 1 each, unbanned/unpicked = decider if 1-1. Rewards knowing multiple games.

### Streak (lobby format)
Win to stay on. Loser pays, winner banks. Challenger queues in. House rakes each match individually.

**Launch order:** Gauntlet first. Pick & Ban when 4+ games. Streak as lobby feature post-stability.
