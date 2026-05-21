# IDEAS.md — DUEL Feature Ideas

Unbuilt ideas. Add here, promote to GAMES.md or DESIGN.md when decided.

---

## Launch / Marketing Concepts

### Pot Reveal on Announced Date
Teaser page shows no pot until T1 date is officially announced. The moment the date drops, the pot counter appears for the first time — creates a reveal event out of the announcement itself. Pot was always growing behind the scenes; the announcement is what makes it visible.

**Status:** Idea — consider for a future tournament launch or a second launch cycle

---

## Build Debt

### Game Engine Variant Config Layer
**Affects:** `lib/card-duel/engine.ts`, `lib/cycle-duel/engine.ts`, `lib/drop-duel/engine.ts`, `app/play/[game]/match/page.tsx`

All three engines have hardcoded format values. Card Duel: `validateSequence` checks exactly 9 cards (3R/3S/3P), `resolveGame` loops exactly 9 rounds. Neither accepts config params.

Running a variant (e.g. Card Duel Blitz = 6 cards: 2R/2S/2P) would fail validation immediately.

**What's needed before variants can run:** Engine functions need a `GameConfig` param — at minimum `{ cardCount, cardsPerType, rounds }` for Card Duel. Match page needs to receive and pass config through rather than hardcoding display strings like `GAME X OF 3`.

**When to fix:** Before building tournament infrastructure. Variants are introduced via tournaments first — the engine must accept config before the first variant tournament can run.

---

## Platform Concepts

### Best of 3 for All Games
All games default to a best-of-3 match format. First player to win 2 games takes the purse. Same rules and entry fee — just a series wrapper. Increases match length and comeback potential.

**Open questions:** Does rake apply once per series or per game? How does forfeit interact with a 1-game lead?

**Status:** Idea — decide format math before building

---

### Spectator Mode
Players and visitors can watch live matches in real-time from a dedicated route (e.g. `/watch/[matchId]`).

The homepage jumbotron already shows a simplified live game — spectator mode is the full version of that. Core concept: the biggest match currently running surfaces on the jumbotron automatically. Clicking into it would open the spectator view.

**What it needs:**
- Real-time game state streamed via Supabase Realtime (read-only observer subscription)
- Simplified game board render (same visual as jumbotron strip, expanded)
- Observer count display ("14 WATCHING")
- No interaction — pure read-only
- Route: `/watch/[matchId]` or `/live`

**Design note:** Jumbotron IS the watch experience for now. No "WATCH LIVE" button needed while spectator mode isn't built — the live game is visible right there on the homepage. Add the button back when the full spectator route exists.

**Status:** Future — build after core matchmaking and real-time game state are stable.

### DUELS as External Game Facilitator
DUELS becomes the money layer for any skill game — not just built-in games.
Players challenge each other in Valorant, Minecraft 1v1, racing games, any external title.
DUELS handles the escrow: both players deposit, winner verified, DUELS pays out and takes entry fee.

Model: we facilitate, we don't build. The game is theirs, the money is ours to manage.

**Why interesting:** Massively larger addressable market. Millions already play these games. No need to build game mechanics — just the financial and verification layer.

**Open problems before this is viable:**
- Verification: how do you confirm who won? API integration, screenshot, honour system, third-party referee?
- RNG: Valorant has bullet spread, loot etc. — legally this may not qualify as pure skill under Danish law. May require separate legal entity or different regulatory framework.
- Scope: fundamentally different product from current DUELS. Could be a separate brand or a post-launch expansion.

**Status:** Idea — save for later, do not design until core platform is live

---

## New Game Concepts

### Adversarial Selection — "pick your opponent's move"
Both players hold a hand of cards. Each round, instead of playing your own card — you pick a card from the **opponent's hand** for them to play. They simultaneously pick one from yours. Both chosen cards resolve against each other.

The inversion is the whole game. Not "what's my best move?" — "what's their worst move right now?" And they're doing the same to you.

**Why it's deep:** Hand composition becomes defence. A hand with one brilliant card and several weak ones means the opponent always picks your weak cards. You want a hand where all cards are defensively balanced — opponent can't hurt you regardless of what they pick. Draft phase before the match would complete the loop: build a balanced hand while predicting opponent's draft.

**DUELS fit:** Simultaneous sealed commitment (both pick opponent's card at the same time). Zero RNG. Pure psychology + deduction. Legal position clean.

**Status:** Quick concept — needs mechanic design before speccing

---

### Reference Games Worth Revisiting
Came up in session research as direct mechanical relatives to Card Duel / CycleDuel / Island Duel:

- **Skull** — place rose or skull face down, bid how many roses you can flip without hitting a skull. First round pure psychology, no information. Scales cleanly to 1v1. Worth speccing as a DUELS game.
- **Yomi** (David Sirlin) — fighting game as card game. Both players play a card face down, flip simultaneously. Card Duel's direct ancestor. Worth studying for mechanic depth.
- **Coup** — each player has 2 hidden role cards. Claim any role, opponent challenges or not. Wrong challenge = lose a card. 1v1: two people lying to each other, tracking what the opponent has defended. Sequential not simultaneous — not directly portable, but the hidden-role read is interesting.

**Status:** Reference only — revisit if designing next game

---

## Features

### Opponent Intel (three-layer system)
Players can study opponents — feels like coaching prep, not just pressing "find match".
Strengthens legal standing: preparation and pattern recognition IS the skill.

**Layer 1 — Pre-match**
Win rate overall + in this specific game. Shown on the opponent card before match starts.
Simple, fast, always available.

**Layer 2 — In-game tendencies (game-specific)**
Aggregate behavioral data. Shows what opponents tend to do, not what they will do.
- Card Duel: their 3 most played opening cards (slot 1 distribution)
- CycleDuel: preferred opener per block (what they tend to peek with)
- DropDuel: most played first cell placement
Rule: show DATA not ANSWERS. Player reads and applies — that is the skill layer.
Does not show full sequences — that would destroy sealed format integrity.

**Layer 3 — Post-match game review**
Chess.com-style replay and decision analysis. Separate backlog item — build after launch when data volume makes it meaningful.

**Data source:** `matches` table. All tendencies computed from aggregated match history.
Requires player data — not meaningful at launch with few users. Build as growth feature.
Data is captured from day one so the feature can be built retroactively.

**GDPR:** Stats are platform-generated aggregates, not personal data. Anonymised on account deletion. Retention policy in T&Cs (lawyer to review).

**Status:** Designed — build after launch when player data volume warrants it

---
