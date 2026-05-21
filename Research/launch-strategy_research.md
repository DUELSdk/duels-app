---
title: DUEL Launch Strategy
type: research
topic: duel
created: 2026-04-26
updated: 2026-04-26
---

# DUEL — Launch Strategy

## Core Concept

Solve cold start with a launch tournament series. Growing prize pool is both the mechanic and the marketing hook.

---

## Teaser Page

Live before platform launches. Single CTA: **email capture** — not MitID.

- MitID signup requires the full auth flow to be built and registered with idura — too late for pre-launch. Email has no dependency, ships immediately.
- Counter shows email signups — every number is an interested person. Converts to real account at T1 registration.
- Counter doubles as social proof and TikTok/Instagram content — "X spillere klar"
- Launch tournament announced to everyone on the list when T1 date is set.

> Previous spec said "MitID only" — superseded 2026-05-20. Email capture is the pre-launch mechanic. MitID is the match/tournament gate.

---

## Launch Tournament Series

### Structure

Not one event — a series of 3 tournaments over the first 4–6 weeks.

- **T1** — Opening event. Biggest prize pool, most marketing behind it. The launch moment. **Game: Card Duel.**
- **T2** — 2 weeks later. Catches players who missed T1. Keeps density up. **Game: CycleDuel.**
- **T3** — 4–6 weeks in. Platform has casual players now. Tournament re-activates them. **Game: TBD — Island Duel or DropDuel.** Decision open: Island Duel (Colonel Blotto, more abstract) vs DropDuel (simultaneous Connect Four, more visually familiar). DropDuel mechanics were upgraded to fully simultaneous after the original swap was made — revisit before locking.

Between tournaments: casual duels fill naturally — players are already on the platform and familiar with it.

---

### Prize Pool Mechanic

- Platform seeds a **goal-based floor** — scales with entries, reduces risk if turnout is low
- 50kr entry fee — Serious tier
- 15% tournament rake: 7.50kr to house, 42.50kr into pot per player
- **Entry fee collected at registration — non-refundable.** Stake goes into escrow immediately. This is what makes the live pot counter work and what protects the floor math against no-shows.
- **Pot displayed live and growing** — "Current prize pool: 1,350kr" updates in real time as entries come in
- Every new signup makes the number bigger → ad improves itself

#### Goal-Based Floor Tiers

Minimum 16 players to run — smallest bracket where platform is guaranteed to profit under the current floor structure. 8-seat brackets are valid format but require their own floor calibration before use.

| Entries | Platform seeds | Public goal message |
|---------|---------------|---------------------|
| 10–19 | 500 kr | "Get to 20 players — DUEL adds 1,000kr" |
| 20–49 | 1,000 kr | "Get to 50 players — DUEL adds 2,000kr" |
| 50–99 | 2,000 kr | "Get to 100 players — DUEL adds 3,500kr" |
| 100+ | 3,500 kr | — |

Floor tiers are displayed publicly — players see exactly what the next milestone unlocks. Inviting friends directly flips the tier → bigger pot → better prize if they win. No separate reward needed.

#### Profit math (15% rake = 7.50kr per player)

Floor stops being triggered once entries × 42.50kr exceeds the floor. Tiers 3 and 4 floor is never triggered — pure rake from first player.

| Players | Pot from entries | Floor triggered? | Platform seeds | Rake | Net |
|---------|-----------------|-----------------|----------------|------|-----|
| 8 | 340kr | Yes (500kr floor) | 160kr | 60kr | **−100kr** |
| 16 | 680kr | No | 0kr | 120kr | **+120kr** |
| 32 | 1,360kr | No | 0kr | 240kr | **+240kr** |
| 64 | 2,720kr | No | 0kr | 480kr | **+480kr** |

8-seat bracket loses money under the current 500kr floor — the floor was designed around 10-player minimums. **Minimum viable T1 bracket = 16 seats.** 8-seat format can be used for higher entry-fee tiers where rake covers any seeding (separate calibration needed).

Margin is a flat 15% once floor isn't triggered.

---

### Invite Mechanic

Referral link per player. Each signup through your link adds to the pot. Inviting is directly self-interested — the bigger the pot, the better your prize if you win. No separate reward needed.

---

### Bracket Scaling

Seat count is always a fixed power of 2 (8, 16, 32, 64). No partial brackets — no byes, no rounding. See `Research/Formats/bracket-tournament-format.md` for formulas and tier table.

Tournament closes when seats fill or at registration deadline, whichever comes first. If deadline passes with fewer than the seat minimum sold: tournament cancelled, full refund to all registered players.

Minimum viable tournament: 16 seats (4 rounds, ~21 min, +120kr profit). Launch T1 target: 64 seats.

---

## Launch Market

Copenhagen first. Concentrated, digital, 800k people — word-of-mouth works, you can physically show up. Prove the tournament format locally before expanding nationally then EU.

---

## Funding Path

Bootstrap → local traction → raise after. Investors want proof. A working tournament with real players and a growing pot is the traction story that makes a raise conversation worth having. Go big with someone else's money once the format is proven.

---

## Advertising

### OOH Hero Ad (one-and-done)

Static Abribus posters. Hand-picked high-footfall Copenhagen location(s). Launch statement — not an ongoing campaign.

**Pricing (AFA JCDecaux 2026 ratecard, excl. VAT):**
- Specifically located single panel: 3,713kr/week + 69kr mounting
- Copenhagen/Frederiksberg premium: 2,860kr/week + 69kr mounting

**Format tiers depending on budget:**

| Boards | Concept |
|--------|---------|
| 1 | Date only — just the launch date, red slash as separator between numbers. No logo, no text. Pure mystery. QR optional. |
| 2 | + "Held er en undskyldning." board with DUEL logo + QR → teaser page |
| 3+ | Mix of mystery date, tagline, and minimal DUEL + QR variants |

**Hero concept — mystery date board:**
Just the launch date. No brand name, no copy. The red DUEL slash separates the numbers — it IS the brand mark without naming it. Zero-word poster. When people later encounter DUEL and recognise the slash, they connect it themselves. Feels like discovery, not advertising.

**QR mechanic (all boards with QR):**
Scans go to teaser page — live player counter + growing pot. Static board asks the question, phone answers it. The dynamic element lives on the landing page, not the poster.

**Tagline arsenal (locked):**
- **"Held er en undskyldning."** — primary, standard OOH and brand voice
- **"Sæt penge på dig selv."** — situational, self-belief context
- **"Bevis det."** — situational, versatile
- **"Er du god nok?"** — tournament specific
- ~~"Ingen held. Kun færdighed."~~ — retired
- ~~"Ren færdighed. Rigtige penge."~~ — retired

**Still needed:**
- [ ] Decide number of boards based on available budget
- [ ] Lock launch date (T1 date) — required before printing
- [ ] Choose exact location(s)

### Social Ads (ongoing drumbeat)

TikTok + Instagram. Low cost, runs alongside the tournament series.

- Live pot counter ticking up
- Player count growing
- Tournament countdown
- Invite mechanic built in — every signup makes the pot bigger, which makes the ad better

### Invite Loop
- Live pot counter on the website — free, updates automatically
- Referral link per player — inviting is self-interested (bigger pot = better prize)

---

## Why This Works

1. Growing pot = marketing runs itself. Every signup makes the ad better.
2. Series = sustained density. Not a one-day spike that leaves the platform empty.
3. 50kr entry = serious enough to care, low enough not to gatekeep new players.
4. Invite loop = organic growth built into the prize mechanic.

---

## Open Decisions

| Decision | Blocks | Notes |
|----------|--------|-------|
| Guaranteed floor amount | T1 design | Depends on available capital — bootstrap = small floor (500–1000kr) |
| Marketing budget | Ad channel mix | Bootstrap path — scrape what's available, OOH is the main spend |
| OOH placement + cost | Hero ad | Static format decided. Location TBD — leaning Rådhuspladsen or similar high-footfall CPH location |
| OOH tagline | Hero ad | Direction: "Sæt penge på dig selv" — not final |
| T1 date | Everything | Set once legal cleared + platform built |

---

## DUEL Bar

> **Distant future concept only — not on the roadmap. No action needed.**

Fysisk/pop-up venue koncept. Start som pop-up nogle måneder, evaluer før permanent lokale.

**Koncept:**
- Skærme på baren — folk spiller DUEL direkte mod hinanden
- Purse er øl i stedet for penge
- DUEL brand hele vejen — acquisition channel til appen

**Spil:**
- Bar-edition af platformen — samme brand, ny spilfamilie
- Ultra-simpelt: få valg, korte runder, stor visuel animation når det afgøres
- Tænk tre knapper, fem sekunder, spektakulært outcome
- Flere bar-spil designes til sin tid

**Hvorfor det virker:**
- Folk møder DUEL fysisk → downloader appen bagefter
- Tilskuere ved siden af = organisk hype
- Øl som purse = ingen penge-regulering, rent og simpelt

---

## Related

- [[duel_product|DUEL Product Note]]
- [[Research/duel-roadmap_research|DUEL Roadmap]]
- [[_context|DUEL Context]]
