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
- Approval may come with conditions (stake caps, KYC tier requirements) — review any conditions before proceeding to Phase 2

**Fallback if MangoPay rejects:** No provider is pre-verified — every EMI runs their own compliance review. If MangoPay rejects, immediately contact the candidates in `Company/payment-provider-research.md` (Nexpay, Paysafe/Skrill) with the Spillemyndighed ruling (journal 26-632347) as the key document proving DUELS is a skill competition platform, not gambling. Do not assume any named provider will accept — treat each as a new compliance conversation.

**0B — Trustly**
Deposits and withdrawals. Also has an onboarding process — start parallel with MangoPay submission.
- Submit onboarding application
- Confirm integration path with MangoPay (Trustly feeds MangoPay wallet)
- If Trustly integration with MangoPay is not supported: Trustly connects directly to platform bank account as bridge

**0C — MobilePay**
Order submitted 2026-05-16, pending approval. MangoPay does not support MobilePay natively — MobilePay runs as a separate deposit channel.
- If MobilePay approved: wire as deposit option at launch (Danish users expect it — conversion risk without it)
- If MobilePay rejected: launch with Trustly only, add MobilePay in first post-launch update

**0D — idura / MitID**
Not a Phase 0 blocker. Sandbox account already active — all MitID dev work in Phase 2 runs against it for free.

Production flip when ready to go live:
- Enroll Silas in MitID Erhverv as company signatory (Danish gov, likely free)
- Submit production via idura dashboard — Nets processes in ~15–20 minutes
- Custom domain: 15 business days — submit this ~2 weeks before planned go-live
- Cost: €67/month (Small plan, 1,000 logins) + €0.037 per MitID login

No action needed in Phase 0.

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
- MitID integration via idura. Sandbox already active — build against it. Docs: https://docs.idura.app/
- Production go-live steps (do ~2 weeks before launch): enroll Silas in MitID Erhverv as company signatory → submit production via idura dashboard → request custom domain (15 business days). Cost: €67/month + €0.037 per login.
- One account per CPR enforced — DK launch only. CPR auth does not work for EU expansion (DE/SE). Flag for post-launch: EU auth path must be defined before Germany/Sweden rollout (eIDAS or alternative)
- Session tracking server-side (GDPR, anti-cheat requirement)

**2B — Payments**
- MangoPay: escrow, rake deduction, payout (onboarding done in Phase 0)
- Trustly: deposits and withdrawals (onboarding done in Phase 0)
- MobilePay: add if approved during Phase 0

**2C — Matchmaking + Game Engine**
- Real-time matchmaking (auto-queue + challenge system)
- Server-side game state rendering (anti-cheat requirement)
- Input fingerprinting + statistical flagging wired in
- Build Card Duel to launch-ready first. CycleDuel and DropDuel built in Phase 2 but not required at launch — they follow tournament unlock cadence (T2, T3)

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

**Beta definition:**
- Participants: 20–50 invited players (friends, network, Copenhagen contacts)
- Stake cap during beta: 50 KR max per match (Serious tier ceiling)
- Duration: minimum 2 weeks of active play
- Exit criteria: no payment failures, no game state corruption, no unresolved disputes, payout flow confirmed end-to-end
- If a critical issue surfaces: fix and extend beta. Do not launch over an unresolved payout or auth bug.

**Done when:** T&Cs signed off by lawyer. TEST.md passes. Beta exit criteria met.

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
Phase 0A (MangoPay) ────────────────────────────────┐
Phase 0D (idura/MitID) ─────────────────────────────┤
                                                      ▼
Phase 1 (UI audit) ──── runs parallel ────── Phase 2 (Core tech)
                                                      │
                                                      ▼
                                              Phase 3 (Legal + Test)
                                                      │
                                                      ▼
                                              Phase 4 (Launch CPH)
```

Phase 2 gates on MangoPay approval. idura sandbox is already active — MitID dev work starts immediately in Phase 2 with no prior approval needed.

---

## What's Already Done

- Game specs: Card Duel, CycleDuel, DropDuel (all three built to launch-ready spec) + ShipDuel, HexDuel, VaultDuel (post-launch pipeline)
- Legal foundation: Spillemyndighed ruling confirmed, CVR registered
- Business model: entry fee structure, rake, tiers, all locked
- Anti-cheat policy: enforcement tiers, legal basis, clawback — documented in `Company/compliance.md`
- Marketing: OOH tagline locked, social strategy decided, entry fee brand term locked ("entry")
- Design system: BROADCAST + BUNKER surfaces, typography, color — locked in DESIGN.md

## Game Unlock Cadence (locked decision)

Three games are spec-complete. They do not all ship at once — staggered to keep queue density high:

| Gate | Game added |
|------|-----------|
| Casual launch | Card Duel only |
| T2 tournament | CycleDuel unlocks |
| T3 tournament | DropDuel unlocks |

"Three games at launch" in older docs refers to being spec-complete, not simultaneously live. The unlock cadence is the authoritative sequence.
