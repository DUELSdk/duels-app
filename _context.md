---
title: DUEL Context
type: context
updated: 2026-05-07
---

# DUEL — Context

Active state for the DUEL skill-gaming platform.

---

## Current Status

- Concept, legal framework, business model, and all game designs complete
- Next.js app initialized (`/app/duel` in vault)
- Supabase client libraries added, env configured
- **Blocked on:** vejledende udtalelse fra Spillemyndigheden (sent 2026-04-20)
- Next action after opinion: approach MangoPay + Trustly, hire spilleretsadvokat

---

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | Next.js | App Router |
| Database / Auth | Supabase | Client libs installed |
| Payments | MangoPay + Trustly | MangoPay for escrow/rake, Trustly for deposits/withdrawals |
| Auth / KYC | MitID | One account per CPR |
| Game engine | Server-side rendering | Anti-cheat requirement |

---

## Open Questions

| Question | Status |
|----------|--------|
| Spillemyndighed opinion — Card Duel, CycleDuel, DropDuel + væddemål classification | Sendt 2026-04-20 — afventer svar |
| Spilleretsadvokat — full legal review | Open |
| Hvidvask compliance setup | Open |
| Approach MangoPay + Trustly | Open — blocked on Spillemyndighed opinion |

---

## Key Decisions

| Decision | Outcome | Date |
|----------|---------|------|
| Legal framing | Skill-game competition platform, not casino | 2026-04-20 |
| Business model | Entry fee (1v1) + tournament | 2026-04-20 |
| Anti-cheat approach | MitID + server-side rendering + input fingerprinting | 2026-04-20 |
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
