---
title: DUEL Market Legality Map
type: research
topic: duel
created: 2026-04-26
updated: 2026-04-26
---

# DUEL — Market Legality Map

Maps skill-game legality by jurisdiction. Goal: know which markets are accessible, which need legal review, which to geo-block.

**DUEL's legal theory:** 100% skill game + entry fee + prize = competition, not gambling. No gaming license required. This holds in some jurisdictions, fails in others.

**Revenue model:** DUEL charges a fixed entry fee per match — separate from player stakes. Winner takes the full stake pot. Platform never touches prize money. This is tournament organizer framing, not gambling operator framing. Stronger legal position than a rake model in every jurisdiction mapped below.

---

## Status Key

| Status | Meaning |
|--------|---------|
| 🟢 Green | Skill game exemption clear. Likely accessible without license. |
| 🟡 Yellow | Exemption exists but narrow, contested, or requires legal opinion. |
| 🔴 Red | No clear exemption, strict enforcement, or state monopoly. Geo-block. |

---

## Europe

| Market | Status | Reason | Notes |
|--------|--------|--------|-------|
| Denmark | 🟡 Yellow | Spillemyndighed opinion pending | DUEL's current position. Skill exemption exists in Gambling Act but 1v1 real-money rake format needs explicit confirmation. |
| Sweden | 🟡 Yellow | Skill exemption exists, regulator is strict | Spelinspektionen (Spelinspektionen) interprets narrowly. Fantasy sports operate legally. Get Swedish legal opinion before launch. |
| Norway | 🔴 Red | State monopoly (Norsk Tipping) | Foreign operators effectively blocked. Enforcement active. Geo-block from day 1. |
| Finland | 🔴 Red | State monopoly (Veikkaus) | Same as Norway. Strict enforcement. Geo-block. |
| UK | 🟢 Green | Gambling Act 2005 has explicit skill game carve-out | "Prize competitions" decided by skill = exempt. Strongest legal foundation in Europe outside DK. High priority second market. |
| Germany | 🟡 Yellow | GlüStV 2021 has skill game exemption | "Predominantly skill" threshold contested. Some DFS operators approved. Needs German legal opinion. Large market — worth pursuing. |
| Netherlands | 🔴 Red | KSA is aggressive, interprets narrowly | KSA has issued cease-and-desist letters to skill game operators. Geo-block. |
| Belgium | 🔴 Red | Belgian Gaming Commission — strict | Limited skill game precedent. Geo-block. |
| France | 🟡 Yellow | ANJ regulates strictly, gray area | Some skill platforms operate. Unclear how rake model is treated. Legal opinion required before launch. |
| Spain | 🟡 Yellow | DGOJ — skill exemption unclear | Not well-tested for 1v1 real-money format. Yellow until legal opinion. |
| Italy | 🔴 Red | ADM — strict, limited skill exemption | High enforcement risk. Geo-block. |
| Estonia | 🟢 Yellow-Green | Relatively permissive, small market | Skill games generally tolerated. Small addressable market — low priority. |
| Malta | — | Licensing jurisdiction, not a market | MGA license could be an alternative legal strategy (replace Spillemyndighed path with EU-recognized license). |

---

## North America

| Market | Status | Reason | Notes |
|--------|--------|--------|-------|
| USA | 🔴 Red (default) | State-by-state, no federal skill game standard | DraftKings/FanDuel proved skill game theory works — then states started banning. Too fragmented. Use sweepstakes model (Stake.us approach) if you want US at all. |
| Canada — Ontario | 🟡 Yellow | iGaming Ontario opened regulated market | Requires iGO registration. Skill games in gray area within that framework. |
| Canada — Other provinces | 🔴 Red | Provincial variation, limited precedent | Skip until Ontario is clear. |

---

## Rest of World

| Market | Status | Reason | Notes |
|--------|--------|--------|-------|
| India | 🟡 Yellow | Supreme Court validated skill games (Dream11 ruling) | Fantasy sports explicitly legal. 1v1 entry fee format should qualify. Some states ban even skill gaming — need state-level geo-blocking within India. Large market, high upside. Worth dedicated research note. |
| Australia | 🟡 Yellow | Interactive Gambling Act 2001 — complex | Casino-style games banned for AU residents. Skill games gray area. Poker sites have operated. Needs AU legal opinion before touching. |
| Brazil | 🟡 Yellow | Gambling regulated in 2025, evolving | Skill game category not fully defined yet. Monitor — could open up cleanly. |
| Japan | 🔴 Red | Strict gambling laws, minimal skill exemption | Geo-block. |
| UAE / MENA | 🔴 Red | Religious prohibition on gambling broadly applied | Geo-block. |

---

## Priority Order for Expansion

EU-first strategy. Operating from Denmark as an EU company — cleaner legal structure, SEPA payments, MangoPay covers the whole zone. UK deprioritized: post-Brexit means separate payment rails, separate legal framework, separate everything.

1. **Denmark** — home market. Copenhagen launch first, then national.
2. **Germany** — largest EU market, skill exemption exists, worth a German legal opinion in parallel with Spillemyndighed process.
3. **Sweden** — culturally adjacent, EU member, similar framing. Quick legal opinion needed.
4. **France / Spain** — yellow, revisit after DE/SE are clear.
5. **UK** — deprioritized, not dropped. Revisit once EU is established and if legal + payment overhead is worth it.

---

## Geo-Block List (Day 1)

Block these from the start — no gray area, enforcement risk too high:

- Norway
- Finland
- Netherlands
- Belgium
- Italy
- Japan
- UAE + MENA broadly
- US (unless sweepstakes model added later)

---

## Why Entry Fee Framing Matters

Every market above assumes DUEL's legal theory holds: skill game = no license needed.

A rake model (platform takes % from prize pot) gives regulators ammunition — they can argue the platform is "organizing gambling" even if the game is 100% skill, because the house is financially involved in the outcome pool.

Entry fee model removes that argument entirely:
- Platform charges for a service (matchmaking, hosting, enforcement) — identical to a chess tournament organizer or esports platform
- Prize pot is purely player vs player — platform never touches it
- Platform revenue is independent of who wins
- DraftKings and FanDuel used this exact structure to survive US legal challenges

This is the argument to make in every jurisdiction. The spilleretsadvokat review should specifically evaluate entry fee vs rake framing with Spillemyndighed.

---

## Open Questions

| Question | Priority |
|----------|----------|
| Ask spilleretsadvokat to evaluate entry fee structure vs rake — does it strengthen the Spillemyndighed position? | High |
| Does UK skill game exemption clearly cover 1v1 real-money entry fee format? | High |
| How does Germany's "predominantly skill" threshold apply to Card Duel, CycleDuel, DropDuel? | High |
| Does India Supreme Court ruling cover non-fantasy-sports skill games? | Medium |
| Should DUEL pursue MGA (Malta) license as alternative to country-by-country opinions? | Medium — worth one conversation with a gaming lawyer |

---

## Links

- [[duel_product|DUEL Product Note]]
- [[Research/duel-roadmap_research|DUEL Roadmap]]
- [[_context|DUEL Context]]
