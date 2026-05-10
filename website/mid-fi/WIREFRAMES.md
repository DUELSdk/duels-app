# WIREFRAMES.md — Low-fi page sketches

Text wireframes, not pixels. Each sketch answers: what is this page for, what's the hierarchy, what's the primary action. If I can't describe the page in a paragraph before building it, I don't understand it yet.

---

## / Landing

**Purpose:** Convince a skeptical Danish visitor this is legal, skill-based, and worth a duel. One screen does the pitch, one screen does the games, one screen does the receipts (how skill-law works, rake model, no casino license).

**Hierarchy (top to bottom):**

```
NAV  DUEL | Games · Tournaments         [ Enter ]

HERO section — full-width, breathing room
  eyebrow:  DUEL · SKILL ONLY · DENMARK
  hero:     DUEL.
  sub:      1v1 skill games for real money. No luck. No license. Just you and them.
  CTA:      [ Enter ]        text-link: Read the rules →

  ⎯⎯⎯  small split rule: "TWO SIDES. ONE WINS."  ⎯⎯⎯

GAMES strip — three tiles, equal weight
  CARD DUEL             CYCLEDUEL            DROPDUEL
  Sealed sequential     Five-type cycle      Connect Four,
  rock paper scissors.  with a peek.         with blocks.
  → Details             → Details            → Details

HOW IT WORKS
  3 columns:
  [01] Pick a game       [02] Lock your plan     [03] Winner takes the pot
  short copy             short copy              short copy

LEGAL / RECEIPTS callout (accent card)
  "Every game on DUEL is 100% skill. No randomness. No dice. No shuffled deck.
  Under Danish Spilleloven, that means no casino license needed — and no tax
  on your winnings up to the statutory limit."
  link: How this works →

FOOTER
  DUEL · built in DK    |   Games · Tournaments · Responsible Gaming · Terms · Privacy
  fine print:  "DUEL is a skill-gaming platform. 18+. Play within your means."
```

**Primary action:** `Enter`. Everything else is secondary.
**Tone check:** No exclamation marks. No "revolutionary." No emoji. Confident, dry, Danish.

---

## /games Library

**Purpose:** Browse the catalog. Netflix-style rows. Not a grid. Blank thumbnails — the name carries the weight.

**Hierarchy:**

```
NAV

PAGE HEADER
  eyebrow:  LIBRARY · 3 GAMES · MORE COMING
  title:    Pick a fight
  sub:      Every game is 100% skill. Pick your stake at the lobby.

ROW 1 — CLASSIC · 3
  [CARD DUEL featured wider] [CYCLEDUEL]  [DROPDUEL]
  each card:
    thumbnail area (blank, dark fill)
    game name (small, semibold)
    one-line description
    tag: [ 1v1 ]  [ 60s ]

ROW 2 — BUILT ON CARD DUEL · 4
  [Blade Duel] [Spell Clash] [Street Fight] [War Room]
  all labeled [ coming soon ]  (dim card variant)

ROW 3 — 3-PLAYER · 0
  empty state card:  "Nothing yet."  "1v1v1 formats in design."  [ Suggest a format → ]

ROW 4 — BLOCK GAMES · 1
  [DROPDUEL]

FOOTER
```

**Rule:** only classic launch games are live. Everything else is dim cards with "coming soon." The library looks full without shipping more product.

---

## /games/card-duel Game detail

**Purpose:** Explain Card Duel's rules, show its themes, give the player one obvious path: Play.

**Hierarchy:**

```
NAV

BREADCRUMB    Games / Card Duel

PAGE HEADER (two-column on desktop)
  LEFT                                   RIGHT (sticky CTA card)
  eyebrow:  CLASSIC                      Stake from 10 kr
  title:    Card Duel                    [ Play ]   [ Watch a match → ]
  body:     Sealed sequential            Rake 10% · paid once on the pot.
            rock paper scissors.
  meta:     [ 1v1 ]  [ 60s ]  [ skill ]

THE RULES (section)
  3 blocks side by side:
  01 Your hand       02 The sequence       03 The pot
     3R · 3S · 3P       Lock your 9           Winner takes rake-free.
     All visible.       cards in order.       Tie → sudden death.

THEMES (row)
  eyebrow: THEMES · SAME GAME, DIFFERENT SKIN
  [Classic (active)] [Blade Duel] [Spell Clash] [Street Fight] [War Room]
  all but Classic are [ coming soon ]

ODDS & RAKE (short callout)
  10% rake on 1v1. 15% on tournaments. No hidden cuts.
  Your expected value is your skill edge minus the rake.

FOOTER
```

---

## /play/:id  Match — Card Duel

**Purpose:** The game itself. The match screen is the product. Every other page exists to get here.

Design constraints from DESIGN.md:
- Max 672px centered.
- In-game amber is allowed, red platform accent is not.
- ALL CAPS eyebrow labels.
- `LOCK IN` is the in-game action.

**Hierarchy (one screen, no scroll):**

```
MINIMAL NAV — brand left, stakes center, exit right (X)
  DUEL                    STAKE  50 kr                       [ × ]

OPPONENT
  strip:  LaserHawk (bot)   rating 1240   [ 3 / 9 locked ]

BOARD — 9 slots
  their row (face down):  ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢   (card backs, dim)
  round rail (1..9):       1 2 3 4 5 6 7 8 9
  your row (face up):      R S P R ? ? ? ? ?   (drag source + drop targets)

HAND — your available cards
  eyebrow: YOUR HAND · TAP TO PLACE
  [R] [R] [R] [S] [S] [S] [P] [P] [P]
  as used, cards in hand grey out

FOOTER BAR (fixed bottom inside game container)
  ← [ Reset ]    5 of 9 placed · LOCK IN    [ LOCK IN ] amber game action
```

**States to design:**
1. Placing (shown above)
2. Waiting (you locked, opponent hasn't) — LOCK IN replaced with "Waiting for opponent…" + subtle pulse
3. Resolving (cards flip slot by slot) — round rail highlights current slot
4. Result — win/loss/tie banner, [Rematch] [Leave]
5. Sudden death — hand reduced to 3 fresh cards, one pick

I'll mock Placing + Resolving + Result in the match page. Waiting and Sudden Death are derivable from those.

---

## /play/:id  Match — CycleDuel

```
MINIMAL NAV (same as Card Duel)

OPPONENT + BLOCK COUNTER
  Opponent · rating 1312           BLOCK 2 / 3   |   Round 5 / 9

CYCLE DIAGRAM (persistent, small, top-right corner of board)
  Feint → Guard → Strike → Rush → Grab → Feint
  (tiny 5-node ring, labels; highlights relevant when card hovered)

PEEK ROW
  eyebrow: OPPONENT'S FIRST CARD (THIS BLOCK)
  single revealed card:  [ STRIKE ]

BOARD — 3 slots for this block
  your row (build this block):  [Guard] [Rush] [?]
  round rail for block:           4   5   6

HAND (filtered to cards not yet played)
  eyebrow: YOUR HAND
  [Feint×1] [Guard×1] [Strike×2] [Rush×1] [Grab×2]

FOOTER: LOCK IN BLOCK
```

---

## /play/:id  Match — DropDuel

Two phases.

### Phase 1 — Block placement (15s)

```
MINIMAL NAV with countdown pill:  15s

STATE EYEBROW: PHASE 1 · PLACE ONE BLOCKED CELL

BOARD 6×7
  row 6 (top):     · · · · · · ·      (disallowed — dim)
  rows 5..2:       · · · · · · ·      (legal — clickable)
  row 1 (bottom):  · · · · · · ·      (disallowed — dim)
  currently hovered cell: outlined amber
  placed cell: solid amber block

HINT:  Low blocks cut off columns. Blocks are revealed when Phase 2 starts.

FOOTER: [ CONFIRM BLOCK ]
```

### Phase 2 — Play

```
MINIMAL NAV with move timer:  8s

STATE EYEBROW: PHASE 2 · YOUR MOVE

BOARD 6×7 (Connect Four)
  both blocks now visible as dim stone cells
  your amber pieces drop, opponent red pieces drop
  column hover: ghost piece at top of column

FOOTER: drop hint "Click a column to drop"
```

---

## /lobby/:game  Lobby — stake & matchmaking

**Purpose:** Pick a stake tier, start matchmaking, show what's happening. Should feel fast.

```
NAV

BREADCRUMB    Games / Card Duel / Lobby

PAGE HEADER
  eyebrow: CARD DUEL · 1V1
  title:   Pick your stake
  sub:     Rake 10%. Winner takes the rest. No luck involved.

STAKE TIERS (6 tiles, equal weight, stake tier visible)
  [10 kr]  [25 kr]  [50 kr]  [100 kr]  [250 kr]  [500 kr]
  hover state: border lifts, accent dot appears in corner
  selected: accent border + accent dim fill

BELOW STAKE TIERS:
  row: "Your balance: 2.450 kr"  —  text link: Deposit →
  row: toggle "Allow bot opponents if queue is slow"  (default: off)

QUEUE STATE (replaces tiers once user locks stake)
  eyebrow: SEARCHING · 50 kr
  large type: "Finding opponent…"
  subline: "Usually under 10 seconds."
  pulsing dot animation (tasteful)
  [ Cancel ]

MATCH FOUND STATE
  eyebrow: MATCH FOUND
  opponent preview card: name, rating, recent 5 game results (icons only if user opted in)
  [ Ready ] button — 5s auto-accept

FOOTER
```

---

## /tournaments  Tournament list

```
NAV

PAGE HEADER
  eyebrow: TOURNAMENTS
  title:   Scheduled fights
  sub:     Enter a bracket. Winner takes the prize pool, minus 15% rake.

FILTER ROW
  [ All ] [ Card Duel ] [ CycleDuel ] [ DropDuel ] [ Gauntlet ]
  sort: starts soon / prize pool / stake

LIST (rows, not cards)
  each row = one tournament
  LEFT:  game icon/tag · tournament name · start time (relative)
  MID:   entry fee · prize pool · slots (32/64)
  RIGHT: [ Enter ] button  (or "Registered" pill if user is in)

  4–6 tournaments listed. Some [ Live ] (amber dot). Some [ Starts in 2h ].

EMPTY SECTION (below the list, if list is empty)
  "No tournaments right now." · "New brackets daily." · Link: Get notified →

FOOTER
```

---

## /tournaments/:id  Tournament detail

```
NAV

BREADCRUMB    Tournaments / Thursday Night Sealed 50

PAGE HEADER
  eyebrow: CARD DUEL · 32 SEATS
  title:   Thursday Night Sealed 50
  sub:     Single elimination. 50 kr entry. Rake 15%. Winner takes 1.360 kr.
  right CTA: [ Enter ] big red button
            meta: "Starts in 1h 14m · 22 / 32 seats filled"

RULES strip
  3 inline blocks:
  Format · Single elimination
  Rounds · 5 to crown
  Time   · Max 90s per match

PRIZE BREAKDOWN (small table)
  1st  · 1.360 kr
  2nd  · 240 kr
  quarterfinals pay nothing — winner takes nearly all

BRACKET (visual)
  32-seat bracket, greyed until tournament starts
  shows "Bracket locks at start time"
  after start: winners move through, amber highlight on current round

ENTRANTS (list, names only)
  2-column scroll list of registered players with ratings
  "22 registered · 10 seats open"

FOOTER
```

---

## /wallet  Wallet

**Container:** focused, max 768px.

```
NAV

PAGE HEADER
  eyebrow: ACCOUNT
  title:   Wallet

BALANCE CARD (accent)
  large number: 2.450 kr
  eyebrow: AVAILABLE BALANCE
  row of two buttons: [ Deposit ] [ Withdraw ]
  fine print: "Deposits via Trustly. Withdrawals processed within 24h."

TRANSACTIONS (table-ish)
  column headers: Date · Type · Detail · Amount · Status
  rows:
    24 Apr · Match win · Card Duel vs anon#8812 · +45 kr · settled
    24 Apr · Rake      · 50 kr match              · −5 kr  · settled
    23 Apr · Deposit   · Trustly                  · +500 kr · settled
    22 Apr · Entry     · Thursday Night 50 kr     · −50 kr · settled
    22 Apr · Match loss· Card Duel vs NovaStrike  · −25 kr · settled
    22 Apr · Withdrawal· Trustly                  · −200 kr · pending
  empty state: "No transactions yet." + "Your first duel will show up here."

LIMITS block (responsible gaming)
  eyebrow: DEPOSIT LIMITS · DANISH LAW
  row: Daily limit 1.000 kr   [ Edit ]
  row: Monthly limit 10.000 kr [ Edit ]
  row: "Need a break?"   Link: Self-exclude →

FOOTER
```

---

## /profile  Profile

```
NAV

PROFILE HEADER
  avatar (plain, border only)
  username + rating (mono font for rating)
  joined: March 2026
  [ Edit profile ]

STATS STRIP — 4 tiles
  Matches · 142       Win rate · 58%       Best streak · 9       Net · +820 kr
  (subdued colors, big numbers)

RECENT MATCHES (table)
  Date · Game · Opponent · Result · Net
  amber tint for wins, loss tint for losses, neutral for ties

SETTINGS collapsible sections
  · Notifications
  · Privacy (show match history to opponents: on/off)
  · Responsible gaming (limits, self-exclude)
  · Connected accounts (MitID ✓)
  · Log out

FOOTER
```

---

## /404

```
Full-height centered block — narrow.
eyebrow: 404
huge type:  Wrong room.
sub:        This page doesn't exist. No one's dueling here.
[ Back to games ] primary button
subtle text link: Report a broken link →
```

One joke only. The copy has to work without it.

---

## Design details visible across every page

- Nav brand mark has a subtle vertical separator 1px wide to its right — "two sides." Never called out.
- Split rules between major sections use a thin line with a short centered label — mirrors a horizon.
- Red is used only for CTAs, accents, and the brand mark. Never for data.
- Every currency shown as Danish format: `1.000 kr`, `50 kr`, `2.450 kr`. No `1,000`.
- Monospace font only for numeric tags (ratings, counts, timers).
- No icons inside buttons. Buttons are words. Except in-game controls.
