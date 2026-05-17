---
game: Card Duel
type: ui-spec
status: locked
updated: 2026-05-17
---

# Card Duel — UI & Animation Spec

---

## Feel

Cold and surgical. You laid your trap before the match started. Now watch it play out. No celebration until it's earned.

---

## Voice

Third-person throughout all match narration. Platform reports the duel — players are participants in something being broadcast.

| Moment | Copy |
|--------|------|
| Win | NOVASTRIKE TAKES THE POT. |
| Loss | LASERHAWK TOOK IT. |
| Slot result | NOVASTRIKE plays PAPER. |
| Score update | NOVASTRIKE leads 4—2. |
| CTA | Find the next one. |

Instructions to the player stay second-person: "Lock in your sequence." "Your turn."

---

## Screen Flow

```
FINDING → PAIRED → OPPONENT CARD → LOCK → REVEAL (x9) → SUDDEN DEATH? → RESULT REVEAL → WIN / LOSS
```

---

## 01 — PAIRED

Bunker surface. "VS." moment. Large type.

- "MATCHED" in alarm mono, live dot
- Massive "VS." centered
- Left: YOU — display name, ping
- Right: OPP — display name in alarm, "STRANGER" label if no prior match
- Progress bar below: "BUILDING TABLE" filling to 100%
- Copy: "NO DECLINE. NO REMATCH GUARANTEE. ONE FIGHT."
- Auto-advances when table is ready

---

## 02 — OPPONENT CARD

Brief screen between PAIRED and LOCK. Who you're facing — not how they play.

- Opponent display name (large)
- Record: 48W · 31L overall
- Game-specific record: Card Duel — W/L
- "STRANGER" if no prior matches
- Head-to-head if applicable: "YOU ARE 2–1 AGAINST LASERHAWK"
- Auto-advances after ~3s or on tap
- No playstyle data here — that's in the lock phase

---

## 03 — LOCK PHASE (Drag Strip)

Bunker surface. Both players arrange simultaneously — timer running.

**Layout:**
- Header: match ID, phase label, timer (alarm red), opponent lock count ("OPP · 6 LOCKED")
- Opponent row: 9 sealed slots (face-down ■) — no moves visible, count only
- Collapsed intel toggle: `[i LASERHAWK ▾]` — tap to expand tendency panel
- Your row: 9 cards showing current arrangement, drag to reorder
- Slot numbers below your row
- Footer: current sequence readout + [SHUFFLE] + [SEAL ALL 9 →]

**Opponent Intel Toggle (expanded):**
- Game-specific tendency data
- Card Duel: slot 1 distribution (R 60% · P 25% · S 15%), opener pattern label
- Collapses back on tap
- Small, does not displace your sequence row

**Interaction:**
- Drag card left/right to reorder sequence
- SHUFFLE randomizes remaining unsealed cards
- SEAL ALL 9 submits — no partial sealing, no slot-by-slot commitment
- Timer expiry: auto-seals current arrangement

**Animation:**
- On seal: sequence slides up slightly, settles — "locked in" feel
- Opponent sealed indicator increments quietly

---

## 04 — REVEAL PHASE (Jumbotron)

One slot fullscreen at a time. Maximum drama per clash.

**Layout per slot:**
- Left half: YOUR card — large, centered, labeled with move name
- Right half: OPP card — large, centered, labeled
- Center bottom: clash result copy ("PAPER COVERS ROCK.") + running score
- Slot progress strip at bottom: resolved slots colored win/loss/tie, upcoming sealed

**Animation per slot:**
| Moment | Animation |
|--------|-----------|
| Pre-reveal | Both cards face-down, large |
| Flip | Both flip simultaneously — spring physics, 280–350ms |
| Clash | Both slide toward center — flash + shockwave ring at impact |
| Winner | Pushes through to center, loser recoils back |
| Result copy | Fades in below clash after 150ms |
| Score update | Number rolls up — 200ms |
| Next slot | 1.5s pause, then transition to next slot |

**Score display:**
- Running score always visible during reveal
- Win slot: card background goes money green
- Loss slot: card background goes alarm red
- Tie slot: card stays neutral, small "TIE" label

---

## 05 — SUDDEN DEATH

Triggered when all 9 slots resolve to a tied game score.

- "SUDDEN DEATH." in large alarm type — full screen moment
- "FULL HAND USED · [X]–[X] · ONE SLOT DECIDES"
- Three cards shown: R, P, S — tap one
- Both picks revealed simultaneously (jumbotron style)
- If tied again: instant replay, no limit
- "TIE AGAIN → INSTANT REPLAY · NO LIMIT" copy below CTA

---

## 06 — RESULT REVEAL (Shared)

Shown to both players before splitting to win/loss screens. Designed separately — this spec does not define it. Feeds into:

- WIN screen (if you won)
- LOSS screen (if you lost)

---

## 07 — WIN SCREEN

Broadcast surface (bone/ink). Stadium layout minus standings board.

**Sections:**
1. **Hero** — "NOVASTRIKE TAKES THE POT." large type, match summary (5–4 · sudden death · 90 KR)
2. **Payout** — "+90 KR · TO YOUR BALANCE" large number, new balance right-aligned
3. **Streak + day summary** — current streak, today's P&L, match count
4. **Match receipt** — itemized: room, opponent, duration, score, pot, rake, your take, new balance
5. **CTAs** — [FIND THE NEXT ONE — 50 KR →] · [REMATCH? · LASERHAWK MUST ACCEPT] · [BREAK]

No standings board.

---

## 08 — LOSS SCREEN

Bunker surface. Brutal symmetry — no softening.

- "LASERHAWK TOOK IT." in alarm, large
- Score + how it ended ("SUDDEN DEATH · YOUR ROCK · THEIR PAPER")
- "−50 KR · BAL 2.400 KR" in alarm
- CTAs: [RUN IT BACK — 50 KR →] · [SMALLER ROOM · 10 KR] · [BREAK]
- Copy below: "We don't track tilt. We don't push you back in. But we will offer a smaller room if you want to keep your head clear."

---

## Animation Principles

- Spring physics on all card interactions (stiffness 400–500, damping 20–25)
- Impact flashes max 150ms — present, not performative
- No looping idle animations
- Clash is the biggest moment — everything else is quieter
- Score number rolls on every update (Anime.js count-up, 200ms)
- Sequence stagger on lock: 40ms between slots

---

## Surface Reference

| Screen | Surface |
|--------|---------|
| Paired | BUNKER |
| Opponent card | BUNKER |
| Lock | BUNKER |
| Reveal | BUNKER |
| Sudden death | BUNKER |
| Result reveal | TBD (your design) |
| Win | BROADCAST |
| Loss | BUNKER |
