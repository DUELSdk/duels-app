---
title: DUEL Roadmap
type: research
topic: duel
created: 2026-04-21
updated: 2026-04-21
---

# DUEL — Roadmap

## Principle

Smartest path, not fastest. Legal signals before heavy build investment. One game live before adding more. Learn the stack before building the product.

---

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Frontend + backend | Next.js | One framework, handles both sides |
| Database + real-time + auth | Supabase | Replaces 3 tools, free to start |
| Hosting | Vercel | Deploy from git, free tier |
| Payments | MangoPay + Trustly | After legal clearance |
| Identity — Denmark | MitID via idura (formerly Criipto) | One account per CPR |
| Identity — all other markets | Passport/ID + liveness check | Veriff |

Solo build. JavaScript/TypeScript throughout.

---

## Phases

### Phase 0 — Learn the Stack
*Do this before building the product.*

- Learn Next.js basics — pages, routing, API routes
- Learn Supabase basics — database, auth, real-time
- Build a throwaway prototype: login + matchmaking lobby + fake "game" button
- Goal: get the plumbing working, not the game. Throw it away when done.

**Gate to Phase 1:** You can deploy a working lobby to Vercel.

---

### Phase 1 — Legal Signals
*Run parallel to Phase 0.*

- [ ] Book spilleretsadvokat — full legal review
- [ ] Wait for Spillemyndighed opinion (sent 2026-04-20)
- [ ] Draft hvidvask compliance process (prep without clearance)
- [ ] Register as MitID service provider via idura — requires CVR, takes time, start early

**Gate to Phase 3:** Spillemyndighed opinion received + advokat review complete.

---

### Phase 2 — MVP: Card Duel
*Start after Phase 0 gate. Run parallel to Phase 1 legal wait.*

Card Duel first — simplest server logic (pure sequence lock, deterministic, no real-time).

Build in this order:
1. MitID auth flow
2. Stake tier selection + pot logic
3. Card sequence lock UI
4. Auto-resolve engine (server-side)
5. Result + payout screen (fake money)
6. Matchmaking (stake-tier matching)

Internal testing with fake money only. No real payments yet.

**Gate to Phase 3:** Full Card Duel flow works end-to-end with fake money.

---

### Phase 3 — Real Money + Beta
*Requires Phase 1 and Phase 2 gates both passed.*

- Approach MangoPay + Trustly
- Finalize hvidvask compliance
- Flip Card Duel to real money
- Closed beta — Danish users, real stakes, Card Duel only
- Monitor, fix, stabilize

**Gate to Phase 4:** Beta stable. No critical bugs. Real money flow clean.

---

### Phase 4 — Add Games
*One at a time. Previous game stable before adding next.*

1. **CycleDuel** — similar turn-based engine to Card Duel, add first
2. **DropDuel** — real-time Connect Four, most complex, add last
3. **ReverseDuel** — post-launch, add after DropDuel is stable

Each game: build → internal test → add to beta → stabilize → next.

---

### Phase 5 — Cross-Game Modes
*After all 3 launch games live and stable.*

1. **Gauntlet** — best of 3, fixed rotation
2. **Pick & Ban** — when 4+ games exist
3. **Streak** — lobby format, add last

---

## Open Questions

| Question | Blocks |
|----------|--------|
| Spillemyndighed opinion | Phase 3 |
| Spilleretsadvokat review | Phase 3 |
| MangoPay + Trustly onboarding timeline | Phase 3 |
| MitID service provider registration timeline (idura/CVR) | Phase 2 |
| Veriff onboarding timeline for non-DK KYC | Phase 3 |

---

## Related

- [[duel_product|DUEL Product Note]]
- [[_context|DUEL Context]]
