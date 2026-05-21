---
title: DUEL Launch Plan
type: research
topic: duel
created: 2026-05-07
updated: 2026-05-07
---

# DUEL — Full Launch Plan

Covers build, legal, and marketing from now through T3. Each phase has a hard gate — nothing moves forward until gates are cleared.

Reference: [[Research/launch-timeline|Launch Timeline]] for zone overview.

---

## Phase 0 — Foundation

> Goal: Get the stack working and legal signals in motion. Nothing public yet.

### Build
- [ ] Learn Next.js — pages, routing, API routes
- [ ] Learn Supabase — database, auth, real-time
- [ ] Build throwaway prototype: login + matchmaking lobby + fake "game" button
- [ ] Deploy prototype to Vercel

### Legal
- [ ] Book spilleretsadvokat — full legal review
- [ ] Wait for Spillemyndighed vejledende udtalelse (sent 2026-04-20)
- [ ] Start MitID service provider registration via idura — requires CVR, takes time, start immediately
- [ ] Draft hvidvask compliance process (prep without final clearance)

### Marketing
- [ ] Create TikTok account
- [ ] Create Instagram account
- [ ] Lock visual identity — logo, colors, typography (use existing design system from app)
- [ ] Prepare 3–5 teaser content pieces (do not post yet)

### Gate to Phase 1
- [ ] Prototype deployed to Vercel (can log in, enter lobby, click fake game button)
- [ ] Spilleretsadvokat review complete
- [ ] Spillemyndighed opinion received (positive or workable)
- [ ] MitID registration submitted

---

## Phase 1 — Card Duel MVP (Fake Money)

> Goal: Full Card Duel flow working end-to-end. No real money yet.

### Build
- [ ] MitID auth flow integrated (idura/Criipto)
- [ ] Stake tier selection UI + pot calculation logic
- [ ] Card sequence lock UI (simultaneous lock, hidden until both committed)
- [ ] Auto-resolve engine — server-side, deterministic
- [ ] Result + payout screen (fake money)
- [ ] Matchmaking — stake-tier matching
- [ ] Internal testing — full flow, multiple matches, edge cases

### Legal
- [ ] MitID service provider registration confirmed
- [ ] Hvidvask compliance process finalized with advokat
- [ ] T&Cs drafted and reviewed

### Marketing
- [ ] Teaser page designed and built — MitID signup, live counter, no email list
- [ ] OOH location researched — costs, footfall, shortlist (Rådhuspladsen primary)

### Gate to Phase 2
- [ ] Card Duel end-to-end with fake money — no critical bugs
- [ ] MitID auth working in production
- [ ] Legal clearance confirmed

---

## Phase 2 — Real Money Beta

> Goal: Card Duel live with real money. Closed beta. Teaser page public.

### Build
- [ ] Approach MangoPay + Trustly — onboarding
- [ ] MangoPay + Trustly integrated — deposit, withdrawal, escrow
- [ ] Card Duel flipped to real money
- [ ] Referral link per player — invite mechanic working
- [ ] Live pot counter on teaser page
- [ ] Closed beta — Danish users, real stakes

### Legal
- [ ] Hvidvask procedures live
- [ ] GDPR compliance checked
- [ ] Age verification (18+) via MitID confirmed
- [ ] T&Cs live on site

### Marketing
- [ ] Teaser page goes live — counter shows real signups
- [ ] First social posts — concept teasers ("coming soon", platform screenshots, taglines)
- [ ] OOH location booked — placement date aligned with T1 announcement

### Gate to Phase 3
- [ ] Beta stable — no critical bugs, real money flow clean
- [ ] At least X beta users tested full flow
- [ ] Referral system working
- [ ] Pot counter updating live

---

## Phase 3 — T1 Launch

> Card Duel tournament. Biggest pot. The launch moment.

### Build
- [ ] Tournament bracket system — auto-generates at registration close
- [ ] Bracket scaling: 8–15 single elim / 16–63 double elim / 64+ group → knockout
- [ ] Platform floor seeded (500–2000kr TBD on capital)
- [ ] Tournament entry flow — 50kr entry, 15% rake, 42.50kr into pot

### Marketing
- [ ] T1 date announced publicly
- [ ] Social drumbeat — pot counter clips, countdown, "Er du god nok?" content
- [ ] OOH goes up in Copenhagen (timed to T1 announcement)
- [ ] Invite loop active — players share links, pot grows, ad improves itself
- [ ] T1 runs — live social updates, bracket drama, winner moment

### Gate to Phase 4
- [ ] T1 complete — winner paid out
- [ ] Platform stable post-tournament
- [ ] CycleDuel build started

---

## Phase 4 — CycleDuel + T2

> New game unlocked. T2 is the hook.

### Build
- [ ] Read `Games/cycle-duel.md` before building — visibility rules, reveal mechanic, flow
- [ ] CycleDuel built — simultaneous reveal, misdirection mechanic
- [ ] Internal testing — full flow
- [ ] CycleDuel added to beta — stable on real money

### Marketing
- [ ] Social: T1 match clips, winner content, pot reveal
- [ ] "New game dropping" teaser — CycleDuel reveal content
- [ ] T2 announced — Card Duel + CycleDuel in rotation
- [ ] T2 runs

### Gate to Phase 5
- [ ] T2 complete
- [ ] CycleDuel stable
- [ ] DropDuel build started

---

## Phase 5 — DropDuel + T3 (Full Platform)

> All 3 games. Public launch complete.

### Build
- [ ] Read `Games/drop-duel.md` before building — real-time Connect Four, most complex
- [ ] DropDuel built — real-time, simultaneous column selection
- [ ] Internal testing
- [ ] DropDuel added to beta — stable on real money

### Marketing
- [ ] Social: T2 clips, DropDuel teaser content
- [ ] T3 framed as full platform moment — "vi er her nu"
- [ ] T3 announced — all 3 games, biggest pot since T1
- [ ] T3 runs
- [ ] Platform fully open — no longer beta

---

## Parallel Tracks Summary

These run alongside phases, not sequentially:

| Track | Owner | Status |
|-------|-------|--------|
| Spillemyndighed opinion | Legal | Waiting (sent 2026-04-20) |
| Advokat review | Legal | Not started |
| MitID registration (idura) | Build | Not started — start immediately |
| MangoPay + Trustly onboarding | Build/Finance | After legal clearance |
| OOH research + booking | Marketing | Not started |
| Social account setup | Marketing | Not started |
| Visual identity lock | Design | Not started |

---

## Blocked Until

| Thing | Blocked by |
|-------|-----------|
| Real money | Spillemyndighed + advokat + MangoPay/Trustly |
| MitID auth | idura registration (start now — takes time) |
| T1 date | Legal cleared + Card Duel real-money stable |
| OOH placement | T1 date set |
| Social launch | Teaser page live |

---

## Related

- [[Research/launch-timeline|Launch Timeline]] — zone-by-zone progress tracker
- [[Research/launch-strategy_research|Launch Strategy]] — tournament mechanics, pot math
- [[Research/duel-roadmap_research|DUEL Roadmap]] — tech stack and phase gates
- [[Games/card-duel|Card Duel]] — read before building
- [[Games/cycle-duel|CycleDuel]] — read before building
- [[Games/drop-duel|DropDuel]] — read before building
