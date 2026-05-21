# TEST.md — DUEL Pre-Launch Checklist

Run through this before any release. Add new cases as features are built.

Legend: manually test in browser unless marked otherwise.

---

## Navigation & Layout

- [ ] Nav shows correct active link on every page
- [ ] Balance pill updates when wallet changes
- [ ] Nav collapses cleanly on mobile
- [ ] Footer present on all pages
- [ ] No broken links in nav or footer
- [ ] Dark nav (elite room) renders correctly vs light nav (all other pages)

---

## Auth (`/auth`)

- [ ] Sign in form renders
- [ ] Invalid credentials shows error, does not crash
- [ ] Successful login redirects to home
- [ ] Logged-in user visiting `/auth` redirects away
- [ ] Sign out clears session and redirects to home

---

## Home (`/`)

- [ ] Live ticker scrolls continuously
- [ ] Stadium strip shows today's stats
- [ ] Game cards link to correct game detail pages
- [ ] HowItPlays demo is interactive
- [ ] Logged-out state shows sign in CTA
- [ ] Logged-in state shows balance and profile

---

## Game Library (`/play`)

- [ ] All three launch games listed (Card Duel, CycleDuel, DropDuel)
- [ ] Each game card links to correct detail page
- [ ] Page renders without errors when no games are active

---

## Game Detail (`/play/[game]`)

- [ ] Correct game name and description shown
- [ ] Stake room buttons link to correct lobby
- [ ] Elite room banner links to `/play/[game]/elite`
- [ ] Unknown game slug returns 404, not crash
- [ ] Demo section works for all three games

---

## Lobby (`/play/[game]/lobby`)

- [ ] Correct rooms shown for the game
- [ ] Selecting a room starts matchmaking (goes to `/finding`)
- [ ] Elite banner visible and links to elite room
- [ ] Balance shown correctly
- [ ] Insufficient balance disables rooms above affordability

---

## Finding (`/play/[game]/finding`)

- [ ] Searching animation plays
- [ ] Cancel returns to lobby
- [ ] Match found transitions to `/match`
- [ ] Timeout / no opponent found handled gracefully

---

## Match — Card Duel (`/play/card-duel/match`)

- [ ] 9 cards dealt correctly (3R 3S 3P each)
- [ ] Cards can be placed into sequence slots
- [ ] Opponent slots show as face-down during lock phase
- [ ] Lock In button only active when all 9 slots filled
- [ ] Cards resolve sequentially after both lock
- [ ] Used cards visible to both players throughout
- [ ] Score updates correctly each round
- [ ] Sudden death triggers on tie after 9 rounds
- [ ] Sudden death resolves correctly
- [ ] Winner declared and redirects to `/result`
- [ ] Per-move timer counts down and auto-locks on expiry

## Match — CycleDuel (`/play/cycle-duel/match`)

- [ ] 10 cards dealt (2 of each type)
- [ ] Peek card revealed before each block
- [ ] 3-card lock per block works
- [ ] Block resolves correctly after lock
- [ ] Block 3 bench mechanic works (1 card benched)
- [ ] Cycle diagram visible throughout
- [ ] Scoring correct across all 9 rounds
- [ ] Sudden death triggers and resolves

## Match — DropDuel (`/play/drop-duel/match`)

- [ ] Phase 1: both players place block simultaneously (15s timer)
- [ ] Blocks revealed at game start
- [ ] Block rules enforced (not top row, not bottom row)
- [ ] Connect Four plays correctly on modified board
- [ ] Per-move timer auto-places on expiry (right-to-left)
- [ ] 4-in-a-row detected correctly (horizontal, vertical, diagonal)
- [ ] Draw resolution: overflow column unlocks
- [ ] Threat score tiebreaker works
- [ ] True tie gives full refund, no rake

---

## Result (`/play/[game]/result`)

- [ ] Winner shown correctly (broadcaster voice — third person)
- [ ] Prize amount correct (full stake pot, minus rake)
- [ ] Entry fee shown correctly
- [ ] Play Again returns to lobby
- [ ] Return to Games returns to game library
- [ ] Result persists on refresh (not lost on reload)

---

## Elite Room (`/play/[game]/elite`)

- [ ] Dark theme renders correctly (not bone background)
- [ ] Ticker scrolls with correct player names and amounts
- [ ] Open challenges all display (featured + grid)
- [ ] Expire bars show correct time remaining
- [ ] Urgent state (≤10 min) shows red bar
- [ ] Clicking a card opens info panel, hides post form
- [ ] Back button on info panel restores post form
- [ ] Accept from info panel removes the card
- [ ] Accept from card button removes the card (no card click firing)
- [ ] Post form: stake below 1.000 KR keeps button disabled
- [ ] Post form: math updates live as stake input changes
- [ ] Post form: POST button shows entered amount (`POST — 1.500 KR →`)
- [ ] Posting shows YOUR CHALLENGE card + posted state box
- [ ] Cancel removes YOUR CHALLENGE card and resets form
- [ ] 1 open challenge limit: post form hidden while challenge is live
- [ ] Unknown game slug returns 404

---

## Tournaments (`/tournaments`)

- [ ] Active tournaments listed with correct info
- [ ] Entry button links to correct tournament
- [ ] Completed tournaments shown separately

## Tournament Detail (`/tournaments/[id]`)

- [ ] Correct tournament name, game, prize shown
- [ ] Seat count accurate
- [ ] Entry button goes to `/tournaments/[id]/enter`
- [ ] Full tournament shows "FULL" state, not entry button
- [ ] Unknown tournament ID returns 404

## Tournament Entry (`/tournaments/[id]/enter`)

- [ ] Entry fee and prize shown correctly
- [ ] Confirm entry deducts fee from balance
- [ ] Redirects to waiting room on confirm

## Tournament Waiting Room (`/tournaments/[id]/waiting`)

- [ ] Seat count updates live
- [ ] Player list grows as players enter
- [ ] Tournament starts and redirects when full
- [ ] Leave button returns to tournament detail

---

## Leaderboard (`/leaderboard`)

- [ ] Players ranked correctly
- [ ] Win/loss record shown
- [ ] Current user highlighted
- [ ] Filters work (by game, by period)

---

## Profile (`/profile`)

- [ ] Correct username and stats shown
- [ ] Fighter stats visualization renders
- [ ] Match history loads
- [ ] Edit profile saves changes

---

## Wallet (`/wallet`)

- [ ] Current balance shown correctly
- [ ] Deposit flow works end to end
- [ ] Withdraw flow works end to end
- [ ] Transaction history loads
- [ ] Balance updates immediately after deposit/withdraw
- [ ] Insufficient balance errors shown correctly

---

## Real Money & Rake

- [ ] Entry fee calculated correctly on all tiers (see CLAUDE.md tier table)
- [ ] Winner receives correct amount (stake × 2 minus 10% rake)
- [ ] Elite room rake correct (10% of total pot)
- [ ] Tournament rake correct (15% entry fee)
- [ ] True tie in DropDuel gives full refund with zero rake
- [ ] No money moves before both players have locked / confirmed

---

## Edge Cases

- [ ] Player disconnects mid-match — handled gracefully
- [ ] Both players disconnect — match cancelled, refund issued
- [ ] Player tries to enter two matches simultaneously — blocked
- [ ] Session expires mid-match — rejoin flow works
- [ ] Very slow connection — no duplicate actions on retry
- [ ] Player with zero balance cannot enter paid rooms

---

## Forfeit Rules

- [ ] Forfeit counted correctly on player record
- [ ] 3 forfeits in 24h triggers cooldown on rooms ≥ 100 KR
- [ ] Cooldown UI shows `FORFEITS TODAY · X OF 3`
- [ ] Cooldown lifts after 30 minutes
- [ ] Forfeit counter resets after 24h

---

## Legal / Compliance

- [ ] No banned vocabulary anywhere in UI (bet, gamble, indsats, odds, jackpot — see CLAUDE.md)
- [ ] 18+ notice visible in footer on all pages
- [ ] "PLAY WITHIN MEANS" visible in footer
- [ ] Age verification gate works before first deposit
- [ ] KYC flow completes before withdrawal is processed

---

## Performance

- [ ] Home page loads under 2s on standard connection
- [ ] No layout shift on page load
- [ ] Images and assets compressed
- [ ] No console errors on any page

---

## Add new cases here as features are built

<!-- When you finish a feature, add its test cases above in the right section -->
