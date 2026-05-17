# CLAUDE.md — DUEL

@DESIGN.md
@GAMES.md
@IDEAS.md
@COMPONENTS.md

Platform name: **DUELS**. Skill-gaming platform. Players duel 1v1 for real money. Zero casino license required — all games are 100% skill-based under Danish law (Spilleloven).

**Source of truth for any page build:** `/Design/[page].html` → `globals.css` tokens → `DESIGN.md`. Never build from DESIGN.md alone if a prototype file exists. Read the prototype first.

Solo build. Stack: Next.js + Supabase + Tailwind + TypeScript. Hosted on Vercel.

---

## What We're Building

Three games at launch: **Card Duel**, **CycleDuel**, **DropDuel**.
Post-launch: ReverseDuel, CodeDuel, cross-game modes (Gauntlet, Pick & Ban).

Current focus: **Card Duel** — build the game first, lobby/matchmaking/payments added later.

---

## Architecture Principles

- Server-side game logic always — anti-cheat requirement, never trust the client
- Responsive by default — works on mobile, tablet, desktop
- Game state lives in Supabase — real-time sync via Supabase Realtime
- Auth: MitID via idura (formerly Criipto) (not yet integrated — use placeholder auth for now)
- Payments: MangoPay + Trustly (not yet integrated — use fake money for now)

---

## Card Duel — Game Rules

Sealed sequential RPS. Pure psychology, zero randomness.

- Each player has 9 cards: 3× Rock, 3× Scissors, 3× Paper
- Both players arrange their 9 cards into a sequence and lock simultaneously
- Cards auto-resolve sequentially — slot 1 vs slot 1 through slot 9
- Win = 1 point, tie (same vs same) = 0 each, loss = 0
- Most points after 9 rounds wins
- Overall tie → sudden death: each player picks one fresh card (R/S/P) secretly, simultaneous reveal, repeat until broken
- Used cards always visible to both players

**Themes (same engine, different skin):**
- Blade Duel (samurai)
- Spell Clash (fantasy magic)
- Street Fight (urban)
- War Room (military)

---

## CycleDuel — Game Rules

5-type cycle card game with information reveals.

- 5 types: Feint, Guard, Strike, Rush, Grab — each beats 2, loses to 2
- Hand: 2 of each = 10 cards. 3 blocks of 3 rounds = 9 rounds. 1 card benched in block 3
- Each block: see opponent's first card → lock sequence → auto-resolve
- Scoring same as Card Duel. Tie → sudden death (pick from 5 types)

---

## DropDuel — Game Rules

Two-phase Connect Four.

- Phase 1 (15s): both players secretly place 1 blocked cell simultaneously. Revealed at game start.
- Block rules: not bottom row, not top row, solid block, pieces stack on top
- Phase 2: standard Connect Four on modified 6×7 board
- Per-move time limit — auto-place in first available column right-to-left if expired
- Draw resolution: overflow column (8th) unlocks → threat score → true tie = full refund, no rake

---

## Business Model

Platform earns entry fees only — never touches the prize pot. Winner takes full stake pot.

| Tier | Total paid | Entry fee | Winner gets |
|------|------------|-----------|-------------|
| Starter | 10 kr | 1 kr | 18 kr |
| Standard | 25 kr | 3 kr | 44 kr |
| Serious | 50 kr | 4 kr | 92 kr |
| High | 100 kr | 6 kr | 188 kr |
| Elite | 250 kr | 10 kr | 480 kr |
| Max | 500 kr | 15 kr | 970 kr |

Tournaments: 15% entry fee. Full tier breakdown in `duel_product.md`.

---

## Folder Structure

```
app/          — Next.js app router pages
components/   — reusable UI components
lib/          — supabase client, utilities
types/        — TypeScript types
```

---

## Current State

- [x] Next.js + Supabase + Tailwind installed
- [x] Supabase client wired up (lib/supabase.ts)
- [ ] Card Duel game UI
- [ ] Card Duel game logic (server-side)
- [ ] Matchmaking / lobby
- [ ] Auth
- [ ] Payments
