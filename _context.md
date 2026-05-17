---
title: DUEL Context
type: context
updated: 2026-05-17
---

# DUEL — Context

Active state for the DUEL skill-gaming platform.

---

## Current Status

- Concept, legal framework, business model, and all game designs complete
- Next.js app initialized (`/app/duel` in vault)
- Supabase client libraries added, env configured
- **Spillemyndighed ruling received** 2026-04-20 — confirmed: no license required, all games = skill games (journal: 26-632347)
- Next actions: approach MangoPay + Trustly, hire spilleretsadvokat
- Additional games spec'd post-ruling: ShipDuel, Island Duel, WallDuel, HexDuel (in `Games/`)

---

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | Next.js | App Router |
| Database / Auth | Supabase | Client libs installed |
| Payments | Stripe (decided for PMV) | Stripe Connect for escrow/rake. MobilePay + cards + Trustly all native. MangoPay inquiry sent but not committed — see `Company/payment-provider-research.md` |
| Auth / KYC | MitID | One account per CPR |
| Game engine | Server-side rendering | Anti-cheat requirement |

---

## Open Questions

| Question | Status |
|----------|--------|
| Spillemyndighed opinion — Card Duel, CycleDuel, DropDuel + væddemål classification | ✅ RESOLVED — no license required, journal 26-632347 |
| Spilleretsadvokat — full legal review | Open |
| Hvidvask compliance setup | Open |
| Payment provider | **Stripe BLOCKED** — skill gaming prize payouts not permitted. MangoPay now primary candidate. Inquiry sent 2026-05-15, awaiting response. MobilePay standalone order submitted 2026-05-16, pending. |

---

## Key Decisions

| Decision | Outcome | Date |
|----------|---------|------|
| Spillemyndighed ruling | No license required — all 3 games confirmed as skill games | 2026-05-13 |
| Legal framing | Skill-game competition platform, not casino | 2026-04-20 |
| Business model | Entry fee (1v1) + tournament | 2026-04-20 |
| Anti-cheat approach | MitID + server-side rendering + input fingerprinting + statistical flagging + stake tier lockout + winnings clawback. Full policy: `Company/compliance.md` → Anti-Cheat Policy | 2026-04-20 |
| Identity verification | MitID — one account per CPR | 2026-04-20 |
| Launch games | Card Duel + CycleDuel + DropDuel. BlinkDuel dropped. | 2026-04-20 |
| Post-launch formats | FFA, Jackpot, Streak, Blitz — after first game is live | 2026-04-20 |
| Game #3 | DropDuel — two-phase Connect Four, simultaneous block placement before play | 2026-04-20 |
| Quiz Duel | Backlogged — cheating too easy at launch | 2026-04-20 |
| Platform-wide mechanic | Simultaneous decision + Crown priority system | 2026-04-24 |
| Microtransactions | Rejected — no skin purchasing | 2026-04-24 |
| Market strategy | EU-first: Denmark → Germany → Sweden → France/Spain. UK deprioritized (post-Brexit complexity). | 2026-04-30 |
| Day-1 geo-blocks | Norway, Finland, Netherlands, Belgium, Italy, Japan, UAE/MENA, USA | 2026-04-26 |
| Funding path | Bootstrap → Copenhagen local launch → raise after first traction | 2026-04-30 |
| Launch market | Copenhagen first. Prove tournament format locally, then expand nationally + EU. | 2026-04-30 |
| Launch ad strategy | One OOH hero placement in CPH (one-and-done statement) + TikTok/Instagram with live pot counter and player count | 2026-04-30 |
| Sweetened challenge | No rake on sweetened portion — entry fee based on symmetric stake only. Player 1's asymmetric risk is the structural cost, platform doesn't add to it. | 2026-04-30 |
| Post-match transparency | Result screen shows full math: purse, entry fee paid, net gain. Reinforces model fairness. | 2026-04-30 |
| Library design direction | Flat numbered list (not Netflix rows) with filter tabs, live counts, stake range visible. Wireframe direction only — not finalized. | 2026-04-30 |
| Design surface system | Two surfaces: BROADCAST (bone/ink, platform) + BUNKER (concrete/dark, match only). Never mix on same screen. | 2026-05-14 |
| Game identity tiers | Platform layer locked. Big Three (Card/Cycle/Drop) = brothers, same style. New games get own identity within platform container. | 2026-05-14 |
| DESIGN.md rewritten | Old dark charcoal spec replaced with actual broadcast/bunker system. Now reflects codebase. | 2026-05-14 |
| HexDuel training gate | 5 games vs bot, min 1 win. Unlocks real-money rooms. One-time per account. | 2026-05-14 |
| HexDuel board + timer | 9×9 grid, 20s per move. Variants: 7×7 Blitz (15s), 11×11 Deep (20s). | 2026-05-14 |
| HexDuel dead-zone split | Neither chain completable → split pot, rake kept. Strategic outcome, not RNG. | 2026-05-14 |
| CodeDuel tie resolution | Same guess count → rematch. 10-guess exhaustion → split pot (entry fees kept). Time tiebreaker = Speed Crack variant only. | 2026-05-14 |
| Anti-cheat enforcement tiers | Warning → restriction (low-stake lockout + tournament ban) → ban (forfeiture + clawback) → Politiet referral. Human-assisted bot = accepted residual risk. | 2026-05-14 |
| Legal anti-cheat basis | Cheating for financial gain = bedrageri §279 straffeloven. T&Cs must include clawback + forfeiture clauses. Full policy in `Company/compliance.md`. | 2026-05-14 |
| Payment provider (PMV) | Stripe BLOCKED — skill gaming prize payouts not permitted. MangoPay now primary candidate (EMI, PSD2-compliant, escrow-native). Inquiry sent, awaiting approval. | 2026-05-17 |

---

## Company Structure

`Company/` mappe tilføjet 2026-05-02 med afdelingsfiler:

| Fil | Indhold |
|-----|---------|
| `Company/legal.md` | CVR, Spillemyndighed, aftaler |
| `Company/finance.md` | Entry fee økonomi, betalingsinfra, skat |
| `Company/compliance.md` | Hvidvask, GDPR, aldersverifikation |
| `Company/marketing.md` | Brand, kanaler, launch |
| `Company/operations.md` | Hosting, support, disputes, payouts |

Brain-roller tilføjet i `_brain/` — én per afdeling (legal, finance, compliance, marketing, operations). Læs relevant brain-fil før arbejde i den afdeling.

---

## Research

| Note | Type | Status |
|------|------|--------|
| [[Research/duel-roadmap_research\|duel-roadmap_research]] | Roadmap | Active |
| [[Research/market-legality_research\|market-legality_research]] | Legal Research | Active |
| [[Research/launch-strategy_research\|launch-strategy_research]] | Launch Strategy | Active |

---

## Links

- [[duel_product\|DUEL Product Note]]
- [[design\|Design System]]
- [[Claude-Kanban-Board\|Kanban]]
