# SITEMAP.md — DUEL Information Architecture

Purpose: decide what pages exist, how they relate, and what each page is for — before drawing a single pixel.

---

## Site tree

```
/                       Landing — marketing, hero, first impression
/games                  Game Library — Netflix-style catalog
/games/card-duel        Game detail — rules, themes, play CTA
/games/cycle-duel       Game detail
/games/drop-duel        Game detail
/play/:matchId          Live match — in-game UI
/lobby/:game            1v1 Lobby — stake selection, opponent found
/tournaments            Tournament list — upcoming + active
/tournaments/:id        Tournament detail — bracket, entry, prize
/wallet                 Wallet — balance, transactions, deposit
/profile                Profile — stats, history, settings
/404                    On-brand not-found
```

No nested dashboards. No settings sprawl. If a user needs more than 2 clicks to get from landing to "lock in and play," the IA is wrong.

---

## Primary navigation

Sticky top nav, 48px. Three zones:

- **Left:** DUEL brand mark. Clicking returns to /.
- **Center/right links:** `Games`, `Tournaments`. That's it. Profile and wallet are represented as pills on the right, not text links — they're account state, not navigation targets.
- **Right:** Balance pill (`2.450 kr`) → /wallet, avatar → /profile.

Logged-out state: same nav, but the right zone becomes a single `Enter` CTA that routes to auth.

---

## Primary user journeys

### Journey A — First-time visitor (the "can I trust this?" path)

1. Lands on `/`. Hero says what this is in one line.
2. Scrolls. Sees the three games, how skill-based works (not gambling), the rake model.
3. Clicks `Pick a side` or `Enter` → auth (MitID placeholder).
4. Post-auth lands on `/games`.
5. Clicks Card Duel card → `/games/card-duel`.
6. Clicks `Play` → `/lobby/card-duel`.
7. Picks stake (or selects "practice vs bot") → match found → `/play/:id`.

Measure: time from landing to first duel. Target: under 90 seconds.

### Journey B — Returning player (the "get me in a match" path)

1. Lands on `/` (or any page — nav is enough).
2. Nav → `Games` → picks game → clicks play tile → stake tier → match.

No hero, no intro. Returning state is compressed.

### Journey C — Tournament entry

1. Nav → `Tournaments`.
2. List shows upcoming tournaments with entry fee, prize pool, start time, slots remaining.
3. Click a tournament → detail page with bracket, rules, entry CTA.
4. Confirm entry → deducted from balance → seat held.
5. When bracket starts → auto-redirect to `/play/:id`.

Tournaments are a second revenue stream, not a distraction from 1v1. UI weights 1v1 heavier.

### Journey D — Deposit

1. Balance pill shows low balance warning (amber dot).
2. Click pill → `/wallet` → deposit flow (Trustly placeholder).
3. Post-deposit: return to the page they came from, not dumped on wallet.

---

## Page inventory & purpose

| Page | Primary purpose | Key actions | Success state |
|---|---|---|---|
| `/` Landing | Sell the model | "Enter" / "Pick a side" | Visitor understands the pitch, clicks into auth |
| `/games` Library | Browse the catalog | Click a game card | User picks a game |
| `/games/:game` Detail | Explain this game's rules, show themes | `Play`, read rules, pick a theme | User clicks Play |
| `/lobby/:game` Lobby | Pick stake, find opponent | Select stake tier, cancel queue | Match found |
| `/play/:id` Match | The game itself | Game-specific actions | Game ends → result screen |
| `/tournaments` List | Browse tournaments | Click a tournament | User picks one |
| `/tournaments/:id` Detail | Enter a tournament | `Enter`, view bracket | User enters |
| `/wallet` Wallet | Money in, money out | Deposit, withdraw, review | Balance changed |
| `/profile` Profile | See your own record | Review stats, adjust settings | User sees who they are |
| `/404` Not found | Recover from dead link | Link back to `/games` | User is re-entered into product |

---

## What's deliberately excluded

- **No "Home" link in nav.** The brand mark is home.
- **No notifications drawer.** Low-noise product. Match state is the match itself.
- **No social feed, no chat in v1.** Chat is an attack surface (harassment, collusion). Add later with moderation.
- **No "dashboard" page.** Profile is the dashboard.
- **No settings top-level page.** Settings lives inside profile.
- **No game categories in primary nav.** The library is one page — categories are rows inside it.

---

## Responsive behavior (summary)

- **Mobile:** Nav collapses — brand + balance pill + avatar only. `Games` and `Tournaments` move to a bottom tab bar on match-eligible routes only. Everything else reached via profile/wallet.
- **Tablet:** Full nav visible, game library rows scroll horizontally as on desktop.
- **Desktop:** Full width, max 1280px centered for content pages, narrower containers for focused pages (wallet, profile) per DESIGN.md.

---

## State matrix (per page)

Every page is designed for these states. If a state isn't explicitly designed, it doesn't exist in the product.

| Page | Empty | Loading | Error | Locked (logged out) |
|---|---|---|---|---|
| Library | "No games yet" card | Skeleton rows | Retry link | Shows library, CTAs route to auth |
| Detail | — | Skeleton hero | Retry | Shows rules, Play routes to auth |
| Lobby | — | Searching animation | Match cancelled | Redirect to auth |
| Match | — | Reconnecting | Forfeit / disconnect result | — (auth required) |
| Tournaments | "No tournaments scheduled" | Skeleton list | Retry | Shows list, Enter routes to auth |
| Wallet | "No transactions" | Skeleton table | Retry | Redirect to auth |
| Profile | "No matches played" | Skeleton | Retry | Redirect to auth |

---

## Flow diagram (text)

```
                 ┌───────────┐
                 │     /     │
                 │  Landing  │
                 └─────┬─────┘
                       │
               ┌───────┴───────┐
               ▼               ▼
        ┌───────────┐   ┌───────────┐
        │  /games   │   │/tournaments│
        └─────┬─────┘   └─────┬─────┘
              │               │
              ▼               ▼
     ┌────────────────┐  ┌─────────────┐
     │ /games/:game   │  │/tournaments/│
     │    detail      │  │    :id      │
     └────────┬───────┘  └──────┬──────┘
              │                 │
              ▼                 │
     ┌────────────────┐         │
     │ /lobby/:game   │         │
     │ stake & queue  │         │
     └────────┬───────┘         │
              │                 │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │   /play/:id     │
              │   the match     │
              └─────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  result screen  │
              │ Rematch / Leave │
              └─────────────────┘
```

Result screen routes back to `/lobby/:game` for rematch, or `/games` for "leave." Never back to landing — once you're in, you're in.
