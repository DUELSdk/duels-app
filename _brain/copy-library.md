---
title: DUELS Copy Library
type: reference
updated: 2026-05-17
---

# DUELS Copy Library

Locked approved strings for every repeated UI element. When building, pull from here — do not regenerate. When adding new strings, add them here first.

Builder rule: any string not in this file that touches money, game outcomes, or player identity needs a legal language check before shipping.

Future use: this file is the translation source for DE/SE expansion. Every string in one place.

---

## Platform Vocabulary

Terms that are locked. No exceptions.

| Use this | Never this | Context |
|----------|-----------|---------|
| entry fee | bet, wager, indsats, rake | what the platform charges |
| purse | jackpot, prize pool, winnings pot | the pot players compete for |
| take / takes the pot | wins | match outcome copy |
| split | draw, tie refund | when pot is divided |
| match | game, round (at top level) | a 1v1 competition event |
| competition | gambling, gaming | platform framing |
| skill game | luck game, chance game | legal framing |
| entry | bet, wager | the act of joining a room |
| DUELS | Duels, duel, Duel | brand name — always ALL CAPS in UI |
| purse | prize, reward, pot | what winner receives |

Danish equivalents:
| Danish | Never |
|--------|-------|
| startgebyr | indsats |
| præmie / gevinst | jackpot |
| konkurrence | gambling |

---

## Navigation

### BroadcastNav links
```
PLAY
TOURNAMENTS
LEADERBOARD
WALLET
PROFILE
```

### Footer links
```
DUELS — [CVR number]
```

---

## Status Indicators (StadiumStrip / BroadcastNav)

Live platform stats — always mono uppercase:
```
● LIVE NOW — [N] MATCHES
[N] SETTLED TODAY
BIGGEST POT TODAY — [N] KR
[N] KR PAID TODAY
[N] PLAYERS ONLINE
```

---

## Game Library

### Filter tabs
```
ALL · CARD · BOARD · SPEED
```

### Game entry row labels
```
[N] LIVE NOW          ← alarm color if > 0, faint if 0
[N] TODAY
[MIN]–[MAX] KR
ENTER →
```

### Game one-liners (locked)
```
Card Duel     — Seal your sequence. Read your opponent.
CycleDuel     — Five types. One peek. Nine rounds.
DropDuel      — Block before play. Connect four.
HexDuel       — Build the chain. Cut theirs.
CodeDuel      — Crack the code before they crack yours.
```

---

## Lobby & Room Selection

### Room tier labels
```
STARTER     10 KR
STANDARD    25 KR
SERIOUS     50 KR
HIGH        100 KR
ELITE       250 KR
MAX         500 KR
```

### Room meta
```
[N] KR ROOM
[N] IN QUEUE
POT [N] KR        ← winner gets (purse after entry fee)
ENTRY [N] KR      ← what you pay above stake
```

### CTAs
```
ENTER ROOM
CANCEL
```

---

## Finding Opponent

### States (top bar)
```
FINDING OPPONENT    ← alarm red
OPPONENT FOUND      ← alarm red
```

### Main headline
```
SEARCHING.
```

### Sub-copy
```
Pairing you with a player in the same room.
```

### Timer label
```
ELAPSED · AVG WAIT 6s
```

### Criteria box labels
```
GAME
STAKE
FORMAT
POOL
```

### Cancel button
```
CANCEL SEARCH · REFUND STAKE
```

### Matched phase
```
MATCHED
VS.
YOU
OPP
BUILDING TABLE
NO DECLINE. NO REMATCH GUARANTEE. ONE FIGHT.
```

---

## Match (in-game)

### BunkerTop bar labels
```
MATCH [ID] · [GAME] · [N] KR ROOM
POT [N] KR
```

### Phase labels (center, alarm red)
```
LOCK IN YOUR SEQUENCE
ROUND [N] OF [N]
SUDDEN DEATH
MATCH OVER
```

### Action labels (ALL CAPS)
```
LOCK IN
LOCKED
WAITING FOR OPPONENT
BOTH LOCKED — RESOLVING
```

### Round outcome (broadcaster voice — third person)
```
[Username] takes round [N].
Round [N] goes to [Username].
Round [N] — draw.
Both played [card]. No points.
```

### Sudden death
```
SUDDEN DEATH
One card. Simultaneous. Winner takes the pot.
[Username] plays [card]. [Username2] plays [card].
[Username] wins sudden death.
```

### Forfeit UI
```
FORFEITS TODAY · [N] OF 3
[N] forfeits = 30 min cooldown on rooms ≥ 100 KR
FORFEIT MATCH
```

### Forfeit confirmation
```
Forfeit this match?
You will lose your entry. Opponent takes the pot.
CONFIRM FORFEIT
CANCEL
```

---

## Result Screen

### Win
```
[Username] TAKES THE POT.          ← hero headline, third person
[N]–[N] · [DETAIL] · [N] KR
```

Win detail variants:
```
ONE SLOT
[N] SLOTS
SUDDEN DEATH
```

### Loss
```
[Opponent] TAKES THE POT.         ← third person
[N]–[N] · [N] KR
```

### Split (tie/split pot)
```
SPLIT.
Purse divided. No winner.
[N] KR returned to each player.
```

### Financial breakdown labels
```
PURSE           [N] KR    ← total pot before entry fee
ENTRY FEE       [N] KR    ← platform fee
YOU TAKE        [N] KR    ← net to winner (purse minus entry fee × 2 ÷ winner)
NET             +[N] KR   ← delta vs what you entered with (green)
NET             −[N] KR   ← on loss (alarm red)
```

### CTAs
```
PLAY AGAIN
REMATCH [Username]
BACK TO LOBBY
VIEW LEDGER
```

---

## Wallet

### Page header
```
WALLET · [Username]
BALANCE.
```

### Balance labels
```
AVAILABLE
HELD IN ACTIVE MATCHES   [N] KR
WITHDRAWABLE             [N] KR
```

### Today summary
```
TODAY
NET TODAY    +[N] KR / −[N] KR
```

### Ledger filter tabs
```
ALL · DEPOSITS · WINS · LOSSES · WITHDRAWALS
```

### Transaction type labels
```
WIN
LOSS
DEPOSIT
WITHDRAW
```

### Timestamp format
```
HH:MM TODAY
YESTERDAY
DD/MM
```

### CTAs
```
DEPOSIT
WITHDRAW
```

### Deposit page
```
DEPOSIT FUNDS
Select amount.
[MobilePay] [Card] [Trustly]
CONTINUE TO PAYMENT
```

### Deposit states
```
PROCESSING...
DEPOSIT CONFIRMED    [N] KR added to your balance.
PAYMENT FAILED       Try again or use a different method.
PAYMENT CANCELLED
```

### Withdraw page
```
WITHDRAW FUNDS
Available to withdraw: [N] KR
CONFIRM WITH MITID
CANCEL
```

### Withdraw states
```
WITHDRAWAL INITIATED    Funds arrive within [X] business days.
WITHDRAWAL FAILED       Contact support if this persists.
```

---

## Auth & Onboarding

### Sign in page
```
DUELS
Skill. Money. No luck.
SIGN IN WITH MITID
One account per CPR number.
```

### Onboarding — username
```
CHOOSE YOUR NAME.
This is how opponents and the leaderboard will see you.
[input]
CONFIRM
```

### Onboarding — terms
```
Before you play.
[Terms summary]
I ACCEPT — LET ME PLAY
```

### Auth callback
```
VERIFYING...
SIGNING IN...
SETTING UP YOUR ACCOUNT...
```

---

## Profile

### Page header
```
PROFILE · [Username]
```

### Section labels
```
RECORD
WIN RATE
MATCHES PLAYED
TOTAL TAKEN
RIVALS
ACHIEVEMENTS
```

### Record format
```
[W]W [L]L [D]D        ← wins/losses/draws
```

### Rivals section
```
RIVALS
[Username] · [W]–[L] H2H · [last played]
NEMESIS     [Username]    ← most losses against
PREY        [Username]    ← most wins against
```

---

## Tournaments

### Page header
```
TOURNAMENTS
```

### Tournament card labels
```
[N] SEATS · [N] REMAINING
ENTRY [N] KR
PURSE [N] KR
BRACKET STARTS [TIME]
ENTER →
FULL
WAITING — [N] IN QUEUE
```

### Waiting room
```
WAITING FOR BRACKET.
[N] of [N] seats filled.
Your entry is reserved.
You can play other games while you wait.
CANCEL ENTRY
```

### Tournament result
```
[Username] WINS THE TOURNAMENT.
RUNNER-UP    [Username]
YOUR FINISH  [N] of [N]
```

---

## Leaderboard

### Page header
```
LEADERBOARD
```

### Filter tabs
```
TODAY · THIS WEEK · ALL TIME
CARD DUEL · CYCLEDUEL · DROPDUEL · ALL GAMES
```

### Column headers
```
RANK
PLAYER
RECORD
WIN RATE
TOTAL TAKEN
```

---

## Empty States

```
No active matches right now.
No open tournaments.
No transactions yet. Deposit to play.
No rivals yet. Play more matches.
No results for this filter.
Queue is empty — be the first.
```

---

## Error States

```
Match cancelled. Entry refunded.
Connection lost. Attempting to reconnect.
Session expired. Sign in again.
Insufficient balance. Deposit to continue.
Room no longer available.
This match has already ended.
Account restricted. Contact support.
```

---

## Support / Contact

```
Questions? [email]
Report a match: [link or email]
```

---

## Legal Micro-copy

Strings that appear near money or entry points — legally sensitive, use exactly:

```
Entry fee is non-refundable once a match starts.
Purse is paid to winner immediately after match.
DUELS charges an entry fee per match. The platform never participates in outcomes.
18+ only. Danish CPR required via MitID.
Skill-based competition. Not a gambling service.
```

---

## Broadcaster Voice Templates

Fill `[Username]` from display name. Fall back to `Player 1` / `Player 2` only if unavailable.

```
[Username] takes the pot.
[Username] takes round [N].
Round [N] goes to [Username].
[Username] and [Username2] split the pot.
[Username] wins sudden death.
[Username] forfeits. [Username2] takes the pot.
[Username] enters a [N] KR [Game] room.
[N] matches live right now.
```
