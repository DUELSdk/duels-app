---
title: DUEL
type: product
status: in-development
tags: [product, web, mobile, gaming-platform, skill-games]
created: 2026-04-20
updated: 2026-05-09
---

# DUEL

## What It Is
> Online skill-gaming platform where players duel 1v1 or in tournaments for real money — zero casino license required because all games are 100% skill-based.

## Problem It Solves
Competitive players want money on the line with no luck element. Existing platforms are either casinos (luck-based, licensed, restricted) or free (no stakes). DUEL fills the gap: real money, real skill, no gambling law friction.

## Target Customer
Danish (initially) competitive gamers who want fast, low-stakes skill duels. Quick matches under 60 seconds. Ages 18+ (MitID verified).

---

## Business Model

### Entry Fee Model (1v1)

Platform charges a fixed entry fee per match — separate from the stake players put up against each other. Winner takes the full stake pot. Platform never touches the prize money.

**Why entry fee, not rake:** Rake = platform takes a cut from the prize pool → looks like gambling operator. Entry fee = platform charges for a service (matchmaking, hosting, anti-cheat) → tournament organizer framing. Same economics, stronger legal position in every jurisdiction.

- Platform revenue = entry fees only
- Prize pot = fully player-funded, winner takes all
- Platform never at risk — zero exposure

### Tournament
- Fixed entry fee per player — platform keeps fees, prize pool paid out from stakes
- Organizer framing: platform hosts the competition, does not participate in outcomes

**Stakes matching:** No ELO or matchmaking — players match freely based on stake tier.

### Match Tiers

Sliding fee scale — higher purses pay lower % fee. Big players feel respected, still meaningful absolute revenue at every tier.

| Tier | Total paid | Fee % | Stake (each) | Entry fee | Winner gets | Platform earns | Multiplier |
|------|------------|-------|-------------|-----------|-------------|----------------|------------|
| Starter | 10 kr | 10% | 9 kr | 1 kr | 18 kr | 2 kr | 1.8x |
| Standard | 25 kr | 10% | 22 kr | 3 kr | 44 kr | 6 kr | 1.76x |
| Serious | 50 kr | 8% | 46 kr | 4 kr | 92 kr | 8 kr | 1.84x |
| High | 100 kr | 6% | 94 kr | 6 kr | 188 kr | 12 kr | 1.88x |
| Elite | 250 kr | 4% | 240 kr | 10 kr | 480 kr | 20 kr | 1.92x |
| Max | 500 kr | 3% | 485 kr | 15 kr | 970 kr | 30 kr | 1.94x |
| **Big Game** | **1,000 kr** | **2%** | **980 kr** | **20 kr** | **1,960 kr** | **40 kr** | **1.96x** |
| **Grand** | **5,000 kr** | **1%** | **4,950 kr** | **50 kr** | **9,900 kr** | **100 kr** | **1.98x** |

Winner takes full stake pot (both players' stakes). Platform earns entry fees only — never touches the prize pot. Fee percentages tentative — revisit before launch.

Minimum: 10 kr total. Maximum: 500 kr at standard launch. Big Game and Grand tiers unlock after platform maturity — gated behind account history and verified KYC. Fixed tiers only — no custom amount input in the lobby. Players select a tier button; they cannot type an arbitrary purse size.

---

### Matchmaking

Hybrid system — method depends on purse size.

| Purse | System | Why |
|-------|--------|-----|
| Starter / Standard (10–25kr) | Auto-queue | Fast, frictionless, high volume |
| Serious / High (50–100kr) | Auto-queue + optional open challenge | Player choice |
| Elite / Max (250–500kr) | Auto-queue + optional open challenge | Still casual — no Elite Room below 1,000kr |
| Big Game / Grand (1,000kr+) | Elite Room (challenge board only) | Players want to know who they're fighting |

**The Elite Room threshold is 1,000 KR.** Below that: casual purses, auto-queue. The jump from 500 to 1,000 KR is intentional — it marks the line between casual and serious.

**The Marquee** is the broadcast layer on top of the Elite Room. Not a match room — the front of house. Where you go to see what's on: challenges posted, matches live, who's holding a seat. Feeds the landing page jumbotron. Surface: BROADCAST (bone/paper). The Elite Room itself is BUNKER.

#### Sweetened Challenge

Dominant players can post a sweetened challenge — they put up more than the standard stake to attract opponents who would otherwise avoid them. Ties into the Nemesis system.

**Mechanics:**
- Player 1 posts, e.g., 200kr stake. Player 2 enters with 100kr.
- Winner takes the full pot (300kr) regardless of who sweetened.
- Entry fee is based on the symmetric portion only (2× player 2's stake = 200kr pot → Serious tier). No platform fee on the sweetened amount.
- Player 1's structural cost: they risk 200kr to net +100kr on a win. Player 2 risks 100kr to net +200kr. The asymmetric risk is the price of buying action — platform does not add to it.

**Why no rake on the sweetened portion:** Player 1 already takes on negative-EV risk to attract opponents. Raking the extra would punish dominant players twice and kill the feature over time.

---

### Payment Flow

**Framing:** Player sees what they're playing for, not what they're spending. Fee is never hidden.

**Discovery (queue):**
> Join the 92kr purse — pay 50kr

**Discovery (challenge board):**
> 970kr purse — 500kr to enter (15kr fee included)

**Confirmation screen (always shown before payment, every tier):**
> Stake: 46kr
> Entry fee: 4kr
> Total: 50kr
>
> Winner takes: 92kr

Full breakdown at confirmation — non-negotiable. Fee is never a surprise.

**Post-match result screen:**
> You won · Purse: 92kr · Entry fee paid: 4kr · Net gain: +42kr

Shows full math after every win. Reinforces that the fee is small and the model is transparent.

---

## Platform Vocabulary

DUEL uses its own terminology — distinct from gambling language, consistent with competition/skill framing. Use these terms in all docs, UI copy, and legal communications.

| Concept | DUEL term | Locked? |
|---------|-----------|---------|
| Prize pot (what winner takes) | **purse** | Yes |
| What you walk away with | **take** | Yes |
| Tie result | **split** | Yes |
| Match size ("50kr match") | **purse size** | Yes |
| Platform fee per match | **entry** | Yes — locked 2026-05-09 |

### Entry Fee Term — Locked

**Term: "entry"** — locked 2026-05-09. Use "entry" in all UI, internal docs, and legal communications.

---

## Legal Framework

Danish gambling law requires **all three** to trigger license requirement:
1. Player pays an entry fee
2. There is a prize
3. **There is a chance element**

DUEL eliminates point 3 entirely. Spillemyndigheden confirms explicitly: chess, quiz, and similar skill games do not require a license even with money stakes.

**Framing rules (non-negotiable):**
- Platform = gaming/competition platform, never casino
- Never use: "indsats", "jackpot", "bet"
- Always use: "entry fee", "præmie", "konkurrence"

---

## Games

Three games at launch (Card Duel + CycleDuel + Island Duel). Post-launch: ReverseDuel, CodeDuel, DropDuel, HexDuel, WallDuel. More formats and multiplayer modes ongoing.

### Card Duel
Sealed sequential RPS. Pure psychology — zero information.

Each player has 3× Rock, 3× Scissors, 3× Paper (9 cards). Both players arrange their 9 cards into a sequence and lock simultaneously. Cards auto-resolve sequentially — slot 1 vs slot 1 through slot 9. Used cards always visible. Outcome 100% deterministic once locked.

**Scoring:** Win = 1 point, tie (same type vs same type) = 0 each, loss = 0. Most points after 9 rounds wins.

**Tiebreakers (per format):**

| Format | Tiebreaker | Rationale |
|--------|-----------|-----------|
| Sealed (standard) | Sudden death — each player picks one card (R/S/P) secretly, simultaneous reveal, repeat until broken. Always produces a winner. | Decisive, no split possible, same mechanic as main game |
| Blitz (6-card) | Sudden death — same as Sealed | Fast format, quick resolution |
| FFA | Split pot | 3-way tiebreaker is too complex |

**Themes:** Blade Duel (samurai) · Spell Clash (fantasy magic) · Street Fight (urban) · War Room (military) — all RPS-direct reskins, cycle diagram always visible.

**Future formats (post-launch):** FFA (1v1v1, highest win-count takes pot), Blitz (6-card variant — 2R/2S/2P, faster match).

---

### CycleDuel
5-type cycle card game with information reveals. Three blocks, escalating reads.

**The cycle:** 5 types — Feint, Guard, Strike, Rush, Grab. Each beats 2, loses to 2. Same vs same = tie. Cycle always shown on screen — no memorisation required.

```
Feint  beats Guard and Strike
Guard  beats Strike and Rush
Strike beats Rush and Grab
Rush   beats Grab and Feint
Grab   beats Feint and Guard
```

**Hand:** 2 of each type = 10 cards. 3 blocks of 3 rounds = 9 rounds played. 1 card benched naturally in block 3 (player chooses which of their remaining 4 to leave out).

**Flow:**
1. **Block 1:** Each player reveals one card from their hand (any card, freely chosen) → both see each other's reveal → lock 3-card sequence → auto-resolve
2. **Block 2:** Each player reveals one card from remaining 7 (freely chosen) → both see each other's reveal → lock 3 from remaining 7 → auto-resolve
3. **Block 3:** Each player reveals one card from remaining 4 (freely chosen) → both see each other's reveal → pick 3 from remaining 4 (bench 1) → lock → auto-resolve

**Peek rule:** The revealed card is informational only — it can be placed in any slot of that block's sequence. Opponent knows the card exists in your 3-card block but not its position. Deliberate misdirection is a core mechanic.

Used cards always visible to both players throughout.

**Scoring:** Same as Card Duel — win = 1 point, tie = 0 each. Most points after 9 rounds wins. Tie → sudden death: each player picks one fresh card from the 5 types secretly, simultaneous reveal, repeat until broken.

**Deliberate ties:** Playing same type as opponent (knowing from the peek) is a valid strategic move — burns their card, preserves your counters.

**Themes & variants:**
| Name | Theme | Format |
|------|-------|--------|
| **CycleDuel** | Combat / martial arts | 5 types, standard |
| **Faction War** | Medieval | 5 types, faction reskin |
| **Cyber Clash** | Sci-fi | 5 types, cyber reskin |
| **ElementDuel** | Elements | 7 types — Fire/Water/Earth/Air/Lightning/Ice/Thunder |
| **Beast War** | Animals | 7 types |
| **Blind Duel** | Neutral | 5 types, no peek — pure sealed format |

Cycle diagram always visible. All variants run on the same engine.

**Future formats (post-launch):** FFA, tournament bracket.

---

### DropDuel
Two-phase Connect Four. Match over in under 60 seconds.

**Phase 1 — Block placement (15 seconds):** Both players secretly and simultaneously place one cell as blocked on the board. Blocks revealed when game starts.

**Block rules:**
- Cannot be placed in the bottom row (would trivially break columns)
- Cannot be placed in the top row (no strategic value)
- Solid block — pieces stack on top as normal, cell is permanently occupied from start
- Low blocks are high value — they cut off entire column above them

**Phase 2 — Play:** Standard Connect Four on the 6×7 modified board. Per-move time limit — if time expires, system auto-places in first available column from right to left.

No two games have identical board configuration. No bot has a memorized solution for every 2-block combination. Draw (board fills, no winner) = split pot, no rake. Legally clean: all placements are player choices, zero RNG.

**Themes & variants:**
| Name | Theme | Format |
|------|-------|--------|
| **DropDuel** | Neutral/standard | 6×7, 1 block each |
| **Trench War** | Military, drop grenades | 6×7, 1 block each |
| **Virus Spread** | Sci-fi/bio, spread the virus | 7×8, 2 blocks each |
| **Crystal Cave** | Fantasy, place crystals | 6×7, win with 5 in a row |

**Future formats (post-launch):** 1v1v1 on wider board, tournament bracket.

---

### ReverseDuel (post-launch)
Classic Othello with one design tweak: each player secretly and simultaneously places one cell as blocked before the match. Blocks revealed at game start. Kills memorized opening books, forces adaptive play. Consistent with DropDuel's pre-game design language. Real-time, no lookup possible, not solved under time pressure. Shared time pool (chess clock style).

**Tiebreaker (equal pieces, time out):** Split pot. Consistent with DropDuel draw rule — legally clean.

**Themes & variants:**
| Name | Theme | Board | Blocks | Format |
|------|-------|-------|--------|--------|
| **ReverseDuel** | Neutral / standard | 8×8 | 1 each | 60s shared clock |
| **Territory War** | Military — capture enemy ground | 8×8 | 1 each | Reskin only |
| **Plague** | Bio/sci-fi — spread the infection | 8×8 | 2 each | More board disruption |
| **Realm** | Medieval fantasy — conquer kingdoms | 10×10 | 2 each | Longer, wider strategic range |
| **Blitz Flip** | Neutral speed variant | 8×8 | 1 each | 60s shared clock — snap decisions, less theory |

---

### CodeDuel (Mastermind)
Classic Mastermind duel format. Both players crack each other's code simultaneously in real-time.

**Code:** 4 slots, 6 colors, repeats allowed — classic Mastermind standard.

**Feedback:** Black pegs (right color, right position) + white pegs (right color, wrong position).

**Flow:**
1. Both players set a secret code simultaneously
2. Both players guess the opponent's code in parallel, real-time
3. Fewest guesses wins
4. Tie → rematch, new codes, same pot (no new entry fee)
5. 10 guesses max with no winner → split pot, no rake

**Legal:** 100% skill — deduction and logic only, zero RNG. Player sets the code, player makes every guess.

**Theme system:** Same engine, different skins. Format, mode, and theme are all variables on top of the same motor. New "games" are new theme+format combos — no new build required.

| Name | Theme | Format | Mode |
|------|-------|--------|------|
| **Vault Cracker** | Bank heist, crack the combination lock | 4 colors, repeats allowed | Fewest guesses |
| **Cipher Agent** | Spy, decrypt the enemy code | 5 numbers, no repeats | Fewest guesses |
| **Potion Brewer** | Fantasy, guess the ingredient sequence | 4 slots, 8 possible ingredients | Fewest guesses |
| **Bomb Squad** | Defuse before the opponent | 4 colors, repeats allowed | Race — first to crack wins |
| **Starmap** | Sci-fi, map the star system | 3 slots, 6 symbols | Fewest guesses |
| **Heist** | Multi-stage robbery, 3 phases | 3 rounds, new code each round | Best of 3 |

---

---

## Cross-Game Modes (post-launch)

### Gauntlet
Best of 3 across all launch games. Fixed rotation: Card Duel → CycleDuel → DropDuel. If 1-1 after 2, third game decides. Order predetermined — no randomness, fully legal.

Entry fee covers all 3 games. Rake taken once on the combined pot.

### Pick & Ban
Esports format. With 3 games: each player bans 1, remaining game is played. With 4+ games: each player bans 1, picks 1 (their strongest), unbanned/unpicked game is the decider if 1-1.

Rewards knowing multiple games. Zero RNG — fully legal. Best introduced when 4+ games exist.

### Streak (lobby format)
Win to stay on. Loser pays, winner banks. Challenger queues in. House rakes each match individually. Pairs with Pick & Ban — challenger picks the game.

**Launch order:** Gauntlet first (simple to build). Pick & Ban when 4+ games live. Streak as a lobby feature post-stability.

---

### Island Duel (launch)
Colonel Blotto format. Both players simultaneously allocate units across battlefields. Pure psychology and math — zero RNG.

**Setup:** Each player gets 10 units. 5 battlefields on the board. 3 rounds per match.

**Flow:**
1. Both players secretly distribute their 10 units across 5 fields in any combination (0–10 per field, must total 10)
2. Both lock simultaneously — allocations reveal together
3. Each field: higher allocation wins it. Tied field = nobody wins it
4. Tally fields won that round
5. Repeat for rounds 2 and 3 — full previous allocations always visible
6. Most fields won across all 3 rounds wins the match

**Scoring:** Fields won per round accumulate. Match winner = most total fields across 3 rounds. Tie after 3 rounds → sudden death round.

**The read layer:** After round 1 you see exactly how opponent thinks. Did they stack? Did they spread? Do they adjust or repeat? Rounds 2 and 3 are psychology as much as math.

**Simultaneous rule:** Both allocate in secret, lock, reveal together. No turn order — no waiting.

**Themes & variants:**
| Name | Theme | Units | Fields | Rounds | Notes |
|------|-------|-------|--------|--------|-------|
| **Island Duel** | Neutral / standard | 10 | 5 | 3 | Base |
| **Blitz Blotto** | Neutral speed | 7 | 3 | 1 | Single round, fast |
| **Deep Blotto** | Neutral extended | 15 | 7 | 5 | More decisions, longer match |
| **Fog Blotto** | Neutral | 10 | 5 | 3 | Allocations hidden until all 3 rounds done — no read layer |
| **Escalating** | Neutral | 10/15/20 | 5 | 3 | Unit pool grows each round |

**Future formats:** FFA (3 players, same fields), tournament bracket.

---

### HexDuel (post-launch)
Simultaneous territory connection game. Build an unbroken chain across the board before your opponent does.

**Board:** 9×9 rhombus grid of hexagons. 20s per move. Red owns left and right edges. Blue owns top and bottom edges.

**Flow:**
1. Both players choose a hex to place their piece simultaneously (20s timer)
2. Both lock — placements reveal together
3. **Contested hex** (both choose same cell): **dead zone** — cell permanently removed from play, neither piece placed. Both choose again next turn.
4. First player to form an unbroken chain of their pieces connecting both their edges wins
5. If board reaches a state where neither chain is completable: split pot, rake kept

**No draws possible** — mathematically proven. Someone always wins. The simultaneous rule also eliminates the first-player advantage inherent in standard Hex (proven to be a first-player win under perfect play) — both players commit blind, no turn order exists.

**Why simultaneous breaks the game open:** memorized Hex theory assumes you react to your opponent's last move. When both move at once, you're predicting — not reacting. The entire strategy shifts.

**Training gate:** 5 games vs bot, at least 1 win required. Unlocks real-money rooms. One-time per account. HexDuel connection strategy is not immediately obvious — training protects players and demonstrates platform due diligence.

**Crown mechanic:** fully compatible. Predicting opponent's next hex placement and claiming it is one of the most powerful reads on the platform.

**Scoring:** Win = match over. No point accumulation. Dead-zone split: neither chain completable → split pot, rake kept.

**Themes & variants:**
| Name | Theme | Board | Timer | Notes |
|------|-------|-------|-------|-------|
| **HexDuel** | Neutral / standard | 9×9 | 20s | Base — dead zone on contest |
| **HexDuel Blitz** | Neutral speed | 7×7 | 15s | Smaller board, faster chain |
| **HexDuel Deep** | Neutral extended | 11×11 | 20s | Classic Hex size, longer match |
| **Dead Zones** | Neutral variant | 9×9 | 20s | Contested cells: both pieces placed (neutral) instead of removed |

**Future formats:** tournament bracket, Crown-only variant.

---

### WallDuel (post-launch)
Simultaneous maze-building race. Both players sprint to the other side while building walls in each other's path.

**Board:** 9×9 grid. Red starts center of top row, goal is bottom row. Blue starts center of bottom row, goal is top row.

**Setup:** Each player gets 10 walls. Walls are 2-cell segments placed between cells — permanently block movement through that edge.

**Each turn, both players simultaneously choose one action:**
- **Move** — step pawn one cell (up/down/left/right, no diagonal)
- **Place wall** — drop a 2-cell wall segment anywhere on the board

**Rules:**
- Cannot completely block opponent — a valid path to their goal must always exist (server enforced)
- Walls are permanent once placed
- **Pawn conflict** (both move to same cell): Blocked — neither moves, both replay
- **Wall conflict** (both place same segment): Blocked — neither placed, both replay

**Win:** First pawn to reach opponent's starting row wins. No draws.

**The tension:** you think you have a clear path — they drop a wall, you reroute. You burn a wall to slow them — they still get through. Every wall spent is a wall gone forever.

**Scoring:** Win = match over.

**Themes & variants:**
| Name | Theme | Walls | Board | Notes |
|------|-------|-------|-------|-------|
| **WallDuel** | Neutral / standard | 10 each | 9×9 | Base |
| **WallDuel Blitz** | Neutral speed | 5 each | 7×7 | Fewer walls, faster decisions |
| **WallDuel Open** | Neutral | 0 each | 9×9 | No walls — pure movement race, simultaneous pathfinding |
| **Siege** | Neutral variant | 15 each | 9×9 | More walls, more maze-building |

**Future formats:** tournament bracket, Crown variant.

---

### Theme Clusters (cross-game)

Themes that span multiple games. Complete each cluster across all 5 games when designing visuals.

| Cluster | Games covered so far |
|---------|---------------------|
| Military | War Room (Card), Trench War (Drop), Territory War (Reverse) |
| Fantasy | Spell Clash (Card), Crystal Cave (Drop), Realm (Reverse), Potion Brewer (Code) |
| Sci-fi | Cyber Clash (Cycle), Virus Spread (Drop), Cipher Agent (Code) |
| Heist/Crime | Street Fight (Card), Vault Cracker (Code), Heist (Code) |
| Elements/Nature | ElementDuel (Cycle), Beast War (Cycle) |

### Standalone Themes (per-game, no cluster)

Ideas captured for when visual design starts. No cross-game requirement.

- Wild West — duels at dawn, frontier, cowboys (fits platform name perfectly)
- Pirates — naval, treasure, high seas
- Horror — monsters, dark, visceral
- Sports — arena, clean, competitive
- Ancient — Egypt/Rome, stone, empire (historical, not fantasy)
- Underground — MMA, fighting pit, raw (darker than Street Fight)
- Royalty — chess-coded, courts, cold and ceremonial
- Candy/Arcade — bright, casual, different demographic

### Platform Design Rule — Simultaneous Decisions

Every game on DUEL uses simultaneous decision-making. Both players commit their move before either sees the other's. Both think at the same time, lock in, reveal together. No waiting. Faster matches. Prediction layer on top of strategy.

Distinguishes DUEL's versions from original games — memorized solutions and theory break down when you can't react to your opponent's last move.

**Contested cell resolution (when both players choose the same cell):**

| Rule | What happens | Best for |
|------|-------------|---------|
| Blocked | Neither piece placed — both replay that turn. Contesting a cell intentionally becomes a valid strategy — sacrifice your move to deny theirs. | Mind game variants |
| Both placed | Both pieces land. Contested cell counts for neither player as a chain link or territory. Creates a new tactical texture — neutral dead zones. | Territory / chain games |

Different game formats can use different rules — not platform-wide, chosen per game variant.

---

### The Crown

Optional mechanic — off by default. Enabled via room setting or Crown variant. One player holds the Crown at a time. Crown never transfers between different games.

**When it applies:**
- Best-of-X series of the same game, Crown mode enabled only
- Single matches: no Crown
- Standard series (no Crown toggle): no Crown
- Cross-game modes (Gauntlet, Pick & Ban): no Crown — does not transfer between games

**Starting position:**
- Game 1: no Crown — symmetric start
- Game 2+: loser of previous game holds Crown

**How it works:**
- Crown holder can activate it before committing their move
- Activation = predict the exact cell opponent will place on
- Both reveal simultaneously as normal
- **Correct prediction** — Crown holder claims that cell regardless of what they played. Opponent's piece removed. Crown holder keeps the Crown.
- **Wrong prediction** — Crown holder loses their turn. Crown transfers to opponent.

**The mind game:** opponent knows you hold the Crown, so their obvious move becomes dangerous. Do you predict their obvious play or their dodge? Do they play their best move and risk losing it, or play suboptimally to bait a miss?

**Applies to:** spatial games only (HexDuel, DropDuel, WallDuel, ReverseDuel). Not applicable to sequence card games (Card Duel, CycleDuel).

---

### Backlog (not for launch)
- **Quiz Duel** — multiple choice = guessable, knowledge = Googleable, cheating too easy. Revisit post-launch if anti-cheat matures.

---

## Tournament Formats

### Launch (3 formats)

| Format | How it works | Best for |
|--------|-------------|---------|
| Single elimination | Lose once, out | Fast events, large fields |
| Round robin | Everyone plays everyone, most wins advances | Small groups (4–8 players) |
| Double elimination | Lose once → losers bracket, lose twice → out | Competitive events, The Open mid-stage |

### Post-launch

| Format | Notes |
|--------|-------|
| Swiss | Matched by record each round, no elimination until X rounds — large fields |
| Group stage → knockout | Round robin groups feed into single elimination bracket — large events |

### Prize Structures

| Structure | How it works |
|-----------|-------------|
| Winner takes all | Full pot to 1st place |
| Top 3 split | e.g. 60% / 30% / 10% |
| Guaranteed pot | Platform guarantees minimum prize pool regardless of entries |
| Accumulated | Entries pool over time — pot grows, winner takes all |
| Bounty | Each player carries a bounty, eliminator earns it |

---

## The Open

DUEL's flagship monthly event. Multi-game. Phased format — intensity escalates as players advance.

| Stage | Format | Notes |
|-------|--------|-------|
| Entry | Single elimination | Thin the field fast |
| Quarterfinals | Double elimination | Survivors get one safety net |
| Semifinals | Swiss | Every match counts |
| Final | Best of 3, multi-game | Gauntlet rotation at launch, Pick & Ban when 4+ games exist |

Entry fee higher than standard matches. Rake 15%. Prestige event — monthly cadence.

---

## Platform Systems

### Rematch

Always available after any match. No gate.

- **Tickets earned:** 5% of pot, capped at 200 DKK
- **Who earns:** both players on completion
- **Rake:** unchanged

---

### Ticket System

Tickets earned through platform engagement. Face value: 1 ticket = 1 DKK. Not transferable to cash — entry only.

**Ticket 1v1**
- Both players enter with equal ticket amounts
- DUEL seeds the real money prize pool 1:1
- Winner takes seeded pot as real money
- Rake on seeded pot as normal
- Symmetric risk — equal stakes always

**Ticket Tournament**
- Entry in tickets (larger amount than 1v1 equivalent)
- DUEL seeds a larger prize pool — more attractive payout
- Rake: 15–20%
- Bulk ticket consumption — controls circulation

**Ticket Economics**

| Mechanic | Detail |
|----------|--------|
| Expiry | Tickets expire after 30–60 days — expired = zero cost to platform |
| Cosmetic sink | Tickets spent on cosmetics = no seeding cost, pure drain |
| Issuance control | Issued slowly via rematch rewards and missions — liability stays manageable |

**Data task (post-launch):** Track ticket issuance vs redemption vs expiry. Track % of redeemed tickets that convert to real money wins. Determines true cost of ticket system.

---

### Mission System

Play X games → earn tickets. Resets daily or weekly. Not tied to winning — engagement loop. Keeps players active between real money matches. Exact structure TBD at build time.

---

### Cosmetics

Purchasable with tickets only. Skins, themes, card backs, animated boards.

| Tier | Cost | Examples |
|------|------|---------|
| Basic | 1–2 tickets | Color variant, emoji reaction |
| Standard | 3 tickets | Game theme skin |
| Premium | 5 tickets | Animated board, custom card back |

Cap at 5 tickets. Feels like a bonus spend, not a real money purchase.

---

### Bounty System

Win streak activates a public bounty on the player. Any opponent who beats them earns bonus tickets.

- Activates at: 3 consecutive wins
- Bonus scales with streak length — longer streak = bigger bounty
- Visible to all players — creates targets and motivation to challenge

---

### Nemesis System

Tracks head-to-head record between any two players who have matched before.

**Two counters per rivalry:**
- **Streak** — current consecutive result vs this opponent (e.g. *lost 4 in a row*)
- **H2H ratio** — overall record (e.g. *3W – 9L*)

**Revenge bonus:**
- 3+ consecutive losses vs same player → revenge bonus activates
- Win a rematch while active → bonus tickets + celebration UI moment
- Bonus scales with streak length
- Streak activates the bonus — does not gate the rematch

Retention mechanic. Psychological, not financial. The H2H counter is the hook, the revenge win is the payoff.

Connects to the Sweetened Challenge mechanic — dominant players can sweeten a challenge against a specific nemesis to force the confrontation.

---

### The Stage

Featured high-stakes matches section. Marketing layer — no sponsorship, no influencer deals. Platform surfaces big matches organically.

**How it works:**
- Big Game and Grand tier matches auto-featured — no opt-in required
- Elite / Max matches: players can opt in ("Spil åbent") at queue entry
- Series play between recurring rivals builds a named rivalry — both players tracked
- Spectators see live game state as moves resolve — no chat influence, pure observation

**Platform front page:**
- **Featured Tonight** — 2–3 big matches announced for the evening
- **Now Live** — matches running right now
- **Last Night's Biggest** — who won, what was at stake

**Big Game badge:**
- Players who have competed at Big Game or Grand tier earn a visible profile badge
- Badge shows tier reached (Big Game / Grand) and total matches at that level
- Visible on profile and in match lobby — public record of who plays big

**Culture it builds:**
- Players accumulate public records and reputations over time
- Rivalries between recurring opponents become events people follow
- No cameras, no streaming setup — just the game, live

**Marketing angle:**
- Featured matches = TikTok/Instagram content that generates itself
- "Silas har vundet 11 CycleDuel matches på stribe" — platform shows it, not the player
- Big roller energy without casino framing

**Research: Nemesis spectating**
- Regular big games may not warrant live spectating as a feature
- Nemesis matches (recurring rivals, active revenge streak) have built-in narrative — worth investigating as a dedicated spectator event format
- Flag for research: what makes a match worth watching, and does live game state alone create that?

---

### War

Team-based territorial event. Players fight for control of a map — districts, cities, or custom territories. Points win the territory. Territory wins the war. Winners split the pot.

**Format:**
- A war has a map divided into multiple sectors (fronts)
- Two sides compete — players join a side (auto-assigned or pick)
- Each sector is a separate battleground: players fight matches there, wins score points for that sector
- Sector winner = the side with most points in that sector when it closes
- War winner = side that wins the most sectors
- War duration: variable — can be time-based (e.g. 48h) or first to X sectors

**Money:**
- Fixed entry fee per player to join a war — platform keeps the fees (same model as tournaments, not rake)
- All stakes form the pot. Winning side splits the pot equally — one share per player regardless of how many matches they played
- Platform never touches the prize pot

**Sector rewards:**
When a side wins a sector, they earn a tactical reward for the remainder of the war. This adds a strategic layer — which front do you fight on?

Reward options to decide before build:
- Score multiplier on a future sector (their wins count for more)
- Bonus tickets for all players who fought in that sector
- Entry fee reduction for the next sector they enter
- Reinforcement slot — one extra player allowed to join their side

Rewards must be non-monetary and non-game-influencing (can't alter match outcomes — skill-only rule). Tickets and entry credits are cleanest legally.

**Honor system:**
After a war ends, each player gets a fixed number of Honor tokens to give to teammates. You cannot honor yourself.

- Honoring a player sends them a bonus reward (tickets or credits)
- Honor count is public on profile — visible to opponents in future wars
- "Most Honored" shown on the war's final results screen
- Mechanic: recognize contribution that the points system doesn't capture — someone who fought 20 matches and lost most of them still helped. Honor is how teammates acknowledge that

**Invisible push toward fighters:**
The honor UI should surface effort stats alongside results — matches played, sectors fought in — without telling the player who to honor. Let the numbers do the nudging. If someone sees a teammate played 18 matches while they played 4, they'll feel it. No instruction needed. The goal is that honor flows to grinders naturally, not just to the top scorer.

**Map:**
- UI is a map — geography is flexible (Copenhagen, Denmark, EU, custom)
- Each sector is a named territory on the map
- Visual state updates as sectors fall: territory colors shift to winning side
- No fixed geography locked at spec time — map is a skin, mechanic is the same underneath

**Assignment:**
- Default: auto-sort for balance
- Optional: players can pick their side if they want to represent a city or play with friends
- Side-picking opens team coordination outside the platform — marketing upside

**Match caps:**

Two caps run simultaneously:

- **Per-player cap** — hard ceiling on total matches a single player can play in a war (exact number TBD at build). Prevents bot flooding — even at 50% win rate, one account can't carry a sector alone. Entry fees still stack per match, making bot abuse expensive before the cap even kicks in.
- **Per-sector slot cap** — each sector has a finite number of match slots. Once full, the sector locks. This makes sector slots a resource — sides compete to fill them with their best players before the sector closes.

**Leader role:**

The per-sector slot system opens a command layer. Each side has a Leader who manages how sector slots are deployed.

- Leader sees how many slots remain in each open sector
- Leader assigns matches: directs specific players to fight in specific sectors
- Players get a strategy space — a war room visible only to their side — where the leader communicates the plan and players coordinate
- Leader can also play matches, or focus on command — their call

This turns the war into three layers: individual skill (1v1 matches), team coordination (who fights where), and strategic command (leader reading the board and allocating resources).

**Open questions for leader role (decide at build):**
- How is the leader chosen? First to join, elected by side, highest rank, or platform-assigned?
- Can the leader be replaced mid-war if they go inactive?
- Does the leader have veto power over a player's sector choice, or is assignment advisory?

**Legal note:**
Individual matches within a war are identical to standard 1v1 duels — fully skill-based. Team outcome depends on aggregate skill of your side, not individual luck. Entry fee model preserved throughout. Same legal framing as tournament organizer.

**Build timing:** post-launch. Requires stable player base to fill sides. Flag for roadmap.

---

## Anti-Cheat

### Identity

Two-tier verification — method depends on market, same result: one verified identity per account.

| Market | Method | Provider |
|--------|--------|----------|
| Denmark | MitID — one account per CPR | idura (formerly Criipto) |
| All other markets | Passport / national ID + liveness check | Veriff |

**Non-DK KYC flow (via Veriff):**
1. User photographs passport or national ID
2. System reads and validates document (MRZ strip)
3. Liveness check — selfie matched against document photo
4. Sanctions + fraud database cross-reference
5. Pass or flag for manual review

Cost: ~$1–5 per verification. EU-native, covers DK, UK, DE, SE in one integration.

- Payment card tied to verified identity
- Eliminates bots, multi-accounting, minors

### Technical
- Server-side game rendering — game computed on server, not client
- Input fingerprinting — organic mouse movements vs bot-perfect lines
- Timing analysis — humans vary naturally, bots don't
- Canvas obfuscation — makes screen reading harder

### Scaled by Stake
| Stake | Protection |
|-------|-----------|
| Under 50 kr | Behavioral analysis + MitID |
| 50–200 kr | Above + input fingerprinting |
| Over 200 kr | All above + manual review on suspicious behavior |

---

## Compliance (no casino license, but still required)
- **Hvidvaskloven** — KYC procedures and reporting obligations
- **18+ requirement** — verified via MitID
- **Gevinstbeskatning** — players may owe tax on winnings
- **Marketing** — cannot resemble gambling or target minors

---

## Open Questions

| Question | Priority | Notes |
|----------|----------|-------|
| Legal status of Card Duel Sealed mode (simultaneous sealed choices) | High | Needs Spillemyndighed opinion |

---

## What's Missing Before Launch
- [ ] Vejledende udtalelse fra Spillemyndigheden on Card Duel (Sealed + Phase) and DropDuel
- [ ] Spilleretsadvokat review of all rules
- [ ] Hvidvask compliance setup
- [ ] Technical platform built and tested
- [ ] Payment provider integrated

---

## Development Status
- [x] Concept defined
- [x] Legal framework researched
- [x] Core business model defined
- [x] Game concepts designed (3/3 final — Card Duel, CycleDuel, DropDuel)
- [ ] Spillemyndighed opinion obtained
- [ ] Legal review complete
- [ ] MVP built
- [ ] Internal testing
- [ ] Beta
- [ ] Launch

---

## Milestones

| Milestone | Target Date | Done |
|-----------|-------------|------|
| | | |

---

## Tech Stack

| Layer | Decision | Notes |
|-------|----------|-------|
| Platform | Custom-built | Full control required |
| Launch target | Web first, mobile app after | Same codebase where possible |
| Auth / KYC | MitID integration | |
| Payments | MangoPay (escrow/rake flow) + Trustly (player deposits/withdrawals) | Both EU-regulated, both support Dankort via Nets integration. Approach after Spillemyndighed opinion obtained. |
| Game engine | Server-side rendering | Anti-cheat requirement |

---

## Metrics

| Metric | Value | Last Updated |
|--------|-------|-------------|
| Active Players | — | |
| Matches Played | — | |
| Monthly Revenue (DKK) | — | |
| Avg Rake per Match | — | |
| Avg win rate distribution | — | |
| Avg session length (matches) | — | |
| Event dropout rate | — | |
| Threshold hit rate (% players who qualify) | — | |

**Rule:** format variables (cutoff %, match count, fee tiers) must be tuned against real data once available. Pre-launch values are defaults, not decisions.

---

## Design

- [[Products/Web/duel/design|Design System]] — pointer to codebase DESIGN.md

## Research

- [[Products/Web/duel/_context|DUEL Context]]
- [[Research/duel/_context|DUEL Research]]
- [[Research/duel/duel-roadmap_research|DUEL Roadmap]]
- [[Research/duel/launch-strategy_research|Launch Strategy]]

---

## Links

- [[_context|DUEL Context]]
- [[design|Design System]]
- [[Claude-Kanban-Board|Kanban]]
- [[Research/duel-roadmap_research|Roadmap]]
- [[Research/market-legality_research|Market Legality]]
- [[Research/launch-strategy_research|Launch Strategy]]

---

## Update Log

| Date | Update |
|------|--------|
| 2026-04-20 | Product note created — concept imported from business resume |
| 2026-04-21 | ReverseDuel theme variants added. Cross-game modes designed (Gauntlet, Pick & Ban, Streak). |
| 2026-04-24 | Tournament formats designed (launch: single elim, round robin, double elim). The Open structure defined. Platform systems added: rematch credits, ticket system, mission system, cosmetics, bounty, nemesis. BlottoDuel, HexDuel, WallDuel specs written. Simultaneous decision rule and Crown mechanic added as platform design principles. |
| 2026-04-26 | Card Duel tiebreakers defined per format — sudden death single-card (Sealed/Blitz), rematch (Phase), split pot (FFA). Open Questions cleaned up. |
| 2026-05-02 | The Stage added — featured high-stakes matches system, marketing layer, no influencer deals. |
| 2026-05-14 | HexDuel updated — dead zone rule corrected (permanent removal not replay), board 9×9, timer 20s, training gate (5 games/1 win), dead-zone split tiebreaker, first-player advantage note added. |
