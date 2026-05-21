# COMPONENTS.md — DUELS Component Inventory

Living reference. Update when components are added, changed, or removed. Read before building a new page to know what already exists.

---

## Shared Components (`components/`)

### `BroadcastNav`
**File:** `components/BroadcastNav.tsx`
**Surface:** BROADCAST (switches to BUNKER-compatible dark mode via `dark` prop)
**Used on:** Every platform page (layout or individual pages)

Props:
```ts
activePage?: 'live' | 'games' | 'tournaments' | 'standings'
loggedOut?: boolean   // hides balance, shows sign-in state
dark?: boolean        // bone-on-dark palette for dark-surface pages
```

Renders `StadiumStrip` above itself automatically.
Contains `TournamentNotch` drawer trigger — reads from `TournamentContext`.
Nav links: LIVE → `/` · GAMES → `/play` · TOURNAMENTS → `/tournaments` · STANDINGS → `/leaderboard`

---

### `StadiumStrip`
**File:** `components/BroadcastNav.tsx` (exported from same file)
**Surface:** BROADCAST
**Used on:** Rendered automatically by `BroadcastNav`

No props. Reads from `getStatsStrip()` and `getLiveMatchCount()` in `lib/mock-data.ts`.
Shows: biggest pot today, settled count, KR paid, live match count.

---

### `TournamentNotch`
**File:** `components/TournamentNotch.tsx`
**Surface:** BUNKER (dark slide-in drawer)
**Used on:** Triggered from `BroadcastNav` badge when user is in active tournament

No props. Reads from `TournamentContext`.
Shows: tournament name, seat grid (`SeatGrid` internal component), time, entry, purse, round info.

---

### `TournamentContext`
**File:** `components/TournamentContext.tsx`
**Type:** React Context provider — not a rendered component

Wrap layout with `<TournamentProvider>` to enable drawer across all pages.
```ts
// Context value shape
tournament: TournamentInfo | null
drawerOpen: boolean
openDrawer: () => void
closeDrawer: () => void

// TournamentInfo shape
{ id, label, game, time, entryKr, seats, filled, purseKr, prizeFirst }
```

---

### `Footer`
**File:** `components/Footer.tsx`
**Surface:** BROADCAST
**Used on:** All platform pages below main content

No props. Renders site-wide footer with DUELS wordmark, CVR, email, nav links.

---

### `SignOutButton`
**File:** `components/SignOutButton.tsx`
**Surface:** BROADCAST
**Used on:** Profile page

No props. Client component — calls `clearAuth()` and redirects to `/auth`.

---

### `Jumbotron`
**File:** `components/Jumbotron.tsx`
**Surface:** BROADCAST (ink background strip)
**Used on:** Homepage

Props:
```ts
px: string   // horizontal padding — e.g. '40px'
```

Fetches `rpc_get_featured_match()` on mount (SECURITY DEFINER, accessible to anon).
Maps result to `JumboState` — one of:

```ts
{ kind: 'live';    match: LiveMatch }
{ kind: 'final';   match: LiveMatch; tournamentName: string; prize: number; round: string }
{ kind: 'between'; schedule: ScheduleItem[] }   // default — shown while loading or when DB is empty
```

`LiveMatch` shape (from RPC response):
```ts
{ id, gameLabel, stakeKr, pot, playerA, playerB, watching, status,
  board: CardBoard | CycleBoard | DropBoard }
```

Card Duel, CycleDuel, DropDuel boards all rendered. Falls back to `between` state (shows "NO MATCH LIVE") when DB has no match data.

---

### `HowItPlays`
**File:** `components/HowItPlays.tsx`
**Surface:** BROADCAST
**Used on:** Homepage (explainer section)

No props. Self-contained animated Card Duel walkthrough — shows locked slots, face-down opponent, reveal sequence. Uses internal `Slot` component (not exported).

---

### `SiteNav`
**File:** `components/SiteNav.tsx`
**Surface:** BROADCAST
**Status:** Legacy — likely superseded by `BroadcastNav`. Verify before using.

---

## Game Components (`components/card-duel/`)

### `CardPiece`
**File:** `components/card-duel/CardPiece.tsx`
**Note:** Uses Tailwind classes (legacy pattern). Most other components use CSS variables directly. Inconsistency — refactor to CSS vars when touching this file.

Props:
```ts
card: 'rock' | 'scissors' | 'paper'
size?: 'sm' | 'md' | 'lg'   // default 'md'
onClick?: () => void
disabled?: boolean
className?: string
```

Also exports `EmptySlot` (no props — placeholder card slot).

---

### `SequenceBuilder`
**File:** `components/card-duel/SequenceBuilder.tsx`
**Surface:** BUNKER (match context)
**Status:** Wired to server action `submitSequence` — requires real game session

Props:
```ts
gameId: string
onLocked: () => void   // called after sequence submitted to server
```

Manages hand state (9 cards: 3R 3S 3P) and sequence slots locally. Submits via `submitSequence` server action.

---

### `RoundResults`
**File:** `components/card-duel/RoundResults.tsx`
**Surface:** BUNKER (match context)

Props:
```ts
mySequence: CardType[]
opponentSequence: CardType[]
results: RoundOutcome[]       // 'player1' | 'player2' | 'tie' per round
myScore: number
opponentScore: number
iAmPlayer1: boolean
winnerId: string | null
myId: string
```

---

### `SuddenDeathPicker`
**File:** `components/card-duel/SuddenDeathPicker.tsx`
**Surface:** BUNKER (match context)
**Status:** Wired to server action `submitSuddenDeathPick`

Props:
```ts
gameId: string
roundNumber: number
onPicked: () => void
```

---

### `DemoGame` (Card Duel)
**File:** `components/card-duel/DemoGame.tsx`
**Surface:** BROADCAST (used in non-match context)
**Used on:** Card Duel landing page (`/play/card-duel`)

No props. Self-contained interactive demo — no server, no real game state.

---

## Game Components (`components/cycle-duel/`)

### `CycleDemoGame`
**File:** `components/cycle-duel/CycleDemoGame.tsx`
**Surface:** BROADCAST (demo context)
**Used on:** CycleDuel landing page

No props. Self-contained demo.

---

## Game Components (`components/drop-duel/`)

### `DropDemoGame`
**File:** `components/drop-duel/DropDemoGame.tsx`
**Surface:** BROADCAST (demo context)
**Used on:** DropDuel landing page

No props. Self-contained demo.

---

## Lib Utilities (`lib/`)

### `lib/styles.ts` — `s` helper
The design token shorthand. Use everywhere instead of repeating inline style objects.

```ts
s.mono        // JetBrains Mono, 11px, +0.06em tracking — metadata/labels
s.display(n)  // Barlow Condensed 800w, -0.02em, uppercase, 0.88 line-height — at size n
s.rule        // 2px alarm red horizontal rule
s.ruleSoft    // 1px rule-soft vertical rule
s.px          // '56px' — standard horizontal page padding
```

---

### `lib/tiers.ts` — stake tiers
Single source of truth for all room tiers and fee math.

```ts
TIERS: Tier[]           // all 6 tiers
DEFAULT_TIER            // SERIOUS (50kr)
getTierById(id)         // find by string id
tierFromKr(kr)          // find by stake amount, falls back to customTier
customTier(kr)          // generate a non-standard tier object
```

Tier shape: `{ id, label, stakeKr, entryFee, winnerGets }`
Note: `stakeKr` = total paid per player. `entryFee` = platform cut per player. `winnerGets` = purse.

---

### `lib/auth.ts` — mock auth
localStorage-backed. Replace entirely with MitID/Supabase when building real auth.

```ts
getAuth(): AuthUser | null
setAuth(user: AuthUser): void
clearAuth(): void
isLoggedIn(): boolean

// AuthUser shape: { username: string; joinedAt: number }
```

---

### `lib/balance.ts` — mock wallet
localStorage-backed. Replace entirely with Supabase + MangoPay wallets.

```ts
getBalance(): number
setBalance(n: number): void
adjustBalance(delta: number): number
getTransactions(): Txn[]
addTransaction(desc: string, amount: number): void

// Txn shape: { id, ts, desc, amount }
```

---

### `lib/match-state.ts` — match result handoff
Passes result data from match page to result page via localStorage. Temporary — replace with Supabase match record lookup when real data lands.

```ts
saveMatchResult(r: MatchResult): void
loadMatchResult(): MatchResult | null
markBalanceApplied(): void
clearMatchResult(): void
```

`MatchResult` shape:
```ts
{ game, tierId, stakeKr, entryFee, winnerGets,
  outcome: 'win' | 'loss' | 'draw',
  myScore, oppScore, opponent?,
  mySeq?, oppSeq?,        // Card Duel sequences
  myMoves?, oppMoves?,    // CycleDuel per-block moves
  balanceApplied? }
```

---

### `lib/mock-data.ts` — platform mock data
All fake live data. Every function here gets replaced by a real Supabase query at launch.

Key exports:
```ts
getStatsStrip()       // { biggestPotAmount, biggestPotWho, totalPaidToday }
getLiveMatchCount()   // { live, settledToday }
getBoard()            // leaderboard entries
getNews()             // editorial items for FromTheFloor section
getH2HRecord(handle)  // head-to-head record vs a given opponent
```

---

### `lib/supabase.ts` / `lib/supabase-server.ts`
Supabase client instances. `supabase.ts` = browser client. `supabase-server.ts` = server component client.
Not yet used — all state is mock. Wire up when building real auth and data.

---

### `lib/card-duel/engine.ts`, `lib/cycle-duel/engine.ts`, `lib/drop-duel/engine.ts`
Server-side game logic engines. Source of truth for move resolution, scoring, and outcome determination.
Never import on client — anti-cheat requirement. Only call from API routes or Server Actions.

---

## Hooks (`hooks/`)

### `useBalance`
```ts
import { useBalance } from '@/hooks/useBalance'
const { balance } = useBalance()  // reads from lib/balance.ts, refreshes on focus
```

Used in `BroadcastNav` for live balance display.

---

## Key Types (`types/`)

```ts
// types/game.ts
CardType: 'rock' | 'scissors' | 'paper'
RoundOutcome: 'player1' | 'player2' | 'tie'
```

---

## What Does NOT Exist Yet

These will need to be built — do not assume they exist:

- Real-time game state components (waiting on Supabase Realtime integration)
- MitID auth components
- MangoPay deposit/withdrawal UI (mock pages exist but not wired)
- Matchmaking queue UI (mock finding page exists but no real queue)
- Tournament bracket component
- Opponent intel components
- Spectator/watch components
- HexDuel components
- CodeDuel components
