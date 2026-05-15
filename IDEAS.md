# IDEAS.md — DUEL Feature Ideas

Unbuilt ideas. Add here, promote to GAMES.md or DESIGN.md when decided.

---

## Platform Concepts

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
