# PLAN.md — DUELS Launch Plan

Master sequence. Phases are ordered by dependency — don't start a phase until its gate condition is met. Kanban handles individual tasks within each phase.

---

## Phase 0 — Unblock (Start immediately)

**Gate: nothing. Start today.**

Phase 0 has an internal sequence. Steps 1 and 2 must complete before Step 3 can be submitted.

---

### Step 1 — Gather documents

MangoPay requires all of these before submission. Collect in parallel:

| Document | Notes |
|----------|-------|
| Proof of registration (CVR) | Must be within last 3 months. In Danish — needs certified sworn translation to English or French |
| Articles of association | Signed, up to date |
| Extract from national registry of beneficial owners | Within 3 months |
| Shareholding structure chart | |
| Bank statement | For billing |
| Capital origin evidence | |
| Identity proof (Silas — legal rep) | |
| Address verification (Silas) | Within 3 months |
| Workflow diagram of MangoPay integration | How escrow, rake, and payouts flow technically |

---

### Step 2 — Draft T&Cs + AML policy (no lawyer yet)

MangoPay requires T&Cs and likely an AML policy to exist at submission — they don't need to be lawyer-verified yet. Draft both ourselves:

- T&Cs: platform rules, liability, anti-cheat + clawback, payout rules, Danish consumer law, GDPR
- AML policy: build from `Company/compliance.md` anti-cheat policy as foundation

Lawyer review happens during the compliance review wait (Step 3) — costs nothing to delay until then, and the wait is long enough to fit it in. Sign-off required before going live, not before submitting.

---

### Step 3 — Submit onboarding (once Steps 1 + 2 complete)

**0A — MangoPay**
Core of the business model: escrow, rake deduction, payout. Their compliance review is the hardest gate in the entire plan.
- Submit with all docs from Steps 1 + 2
- Confirm pre-auth support for tournament funds reservation before Phase 2 build starts

**0B — Trustly**
Deposits and withdrawals. Also has an onboarding process — start parallel with MangoPay submission.
- Submit onboarding application
- Confirm integration path with MangoPay (Trustly feeds MangoPay wallet)

**0C — MobilePay (investigate)**
Popular on Danish real-money platforms (e.g. Betano). Decide during Phase 0 whether to add as a deposit option alongside Trustly. No onboarding until decided.

---

## Phase 1 — Fix the Build (Start immediately, parallel with Phase 0)

**Gate: nothing. Runs in parallel.**

The app was built from DESIGN.md (text spec) instead of the visual prototypes in `/Design/`. Mismatches exist across pages. Fix this now — before adding any more features on top of a wrong foundation.

**Actions:**
1. Compare every built page against its prototype in `/Design/`
2. List every mismatch
3. Fix — prototype is source of truth, not the text spec
4. Update DESIGN.md to point to prototypes, not define visuals inline

**Done when:** Every page matches its prototype. No known visual debt.

---

## Phase 2 — Core Tech (Starts after MangoPay compliance clears)

**Gate: MangoPay compliance review approved.**

The app is currently all mock — no real auth, no real payments, no real-time matchmaking. This is the full build. Three pillars in order:

**2A — Auth**
- MitID integration
- One account per CPR enforced
- Session tracking server-side (GDPR, anti-cheat requirement)

**2B — Payments**
- MangoPay: escrow, rake deduction, payout (onboarding done in Phase 0)
- Trustly: deposits and withdrawals (onboarding done in Phase 0)
- MobilePay: add if decided during Phase 0 investigation

**2C — Matchmaking + Game Engine**
- Real-time matchmaking (auto-queue + challenge system)
- Server-side game state rendering (anti-cheat requirement)
- Input fingerprinting + statistical flagging wired in

**Done when:** A real player can register, deposit, enter a match, play, and receive winnings.

---

## Phase 3 — Pre-Launch (Starts after Phase 2 complete)

**Gate: Phase 2 done.**

Two parallel tracks:

**3A — Legal sign-off**
Lawyer reviews and signs off on T&Cs + AML policy drafted during Phase 0. Must complete before platform goes live. Hand them: Spillemyndighed ruling (journal 26-632347) + the draft docs. If MangoPay compliance review surfaced any issues, incorporate those too.

**3B — Testing**
- Run full `app/duel/TEST.md` checklist
- Fix everything that fails
- Limited closed beta in Copenhagen — real players, real money, small scale

**Done when:** T&Cs signed off by lawyer. TEST.md passes. Beta complete with no critical issues.

---

## Phase 4 — Launch Copenhagen

**Gate: Phase 3 done.**

- One OOH placement in Copenhagen (already decided: "Held er en undskyldning.")
- TikTok + Instagram campaign: live pot counter, player count
- Platform open to public

**After launch:** Monitor player data. All format variable decisions (cutoffs, match counts, entry fee tiers) get revisited against real numbers — not assumptions.

---

## Dependency Map

```
Phase 0 (MangoPay) ─────────────────────────────────┐
                                                      ▼
Phase 1 (UI audit) ──── runs parallel ────── Phase 2 (Core tech)
                                                      │
                                                      ▼
                                              Phase 3 (Legal + Test)
                                                      │
                                                      ▼
                                              Phase 4 (Launch CPH)
```

---

## What's Already Done

- Game specs: Card Duel, Cycle Duel, Island Duel (launch games) + DropDuel, ShipDuel, HexDuel, WallDuel (post-launch pipeline)
- Legal foundation: Spillemyndighed ruling confirmed, CVR registered
- Business model: entry fee structure, rake, tiers, all locked
- Anti-cheat policy: enforcement tiers, legal basis, clawback — documented in `Company/compliance.md`
- Marketing: OOH tagline locked, social strategy decided, entry fee brand term locked ("entry")
- Design system: BROADCAST + BUNKER surfaces, typography, color — locked in DESIGN.md
