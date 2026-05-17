---
title: DUEL Brain Index
type: brain-index
updated: 2026-04-30
---

# DUEL — Brain Index

Claude's meta-context for the DUEL vault. Read at every session start before touching any other file.

---

## Files in _brain/

### Agent briefs — spawn-ready, domain-complete

These are the primary files for any significant task. Each is a self-contained brief: decisions made, files to read, hard rules, open questions. Use as context injection mid-session or pass to a spawned sub-agent for isolated work.

| File | Agent | Owns | When to use |
|------|-------|------|-------------|
| `agent-banker.md` | The Banker | Payments, wallet, MangoPay, Trustly, MobilePay, fee tiers, balance state, AML | Anything money touches |
| `agent-referee.md` | The Referee | Game rules, legal position, Spillemyndigheden, anti-cheat, fair play, new game review | Rules questions, legal review, dispute logic, new games |
| `agent-builder.md` | The Builder | App architecture, Next.js stack, design system, components, game logic, auth, real-time | Building or changing anything in `app/duel/` |
| `agent-promoter.md` | The Promoter | Brand voice, copy, channel strategy, launch sequencing, onboarding text | Any public-facing copy, campaign planning, brand decisions |

### Role briefs — lightweight domain references

| File | What it contains | When to read |
|------|-----------------|--------------|
| `direction.md` | North star — why DUEL exists, the feel, core mechanic, guardrails, strategic direction | Every session, before any product/design/copy/build decision |
| `legal-advisor.md` | **Fuld juridisk reference** — Spilleloven §5-analyse, hvidvask, GDPR, markedsføring, betalingstjenester, beslutningsmatrix | Enhver juridisk tvivl, ny mekanik, ny feature, ny markedsføring |
| `legal.md` | Legal Counsel rolle — game legality, Spillemyndighed, contracts, regulatory position | Game rules, copy review, new mechanics, "are we allowed to…" |
| `finance.md` | Finance Lead — entry fee economics, payment infra, tax, ticket system | Fee tiers, payment providers, revenue questions |
| `compliance.md` | Compliance Officer — hvidvask, GDPR, age verification, marketing rules | Onboarding flows, data handling, marketing review |
| `marketing.md` | Marketing Lead — brand voice, copy, channels, launch sequencing | Any public-facing copy, campaign planning, brand decisions |
| `operations.md` | Operations Lead — hosting, support, disputes, payouts, infrastructure | Infrastructure choices, support design, payout flows |

---

## Session Protocol

**Start:** `CLAUDE.md` → this file → `_context.md` → task-relevant notes

**End — mandatory checklist (do not skip):**
- [ ] `_context.md` date → update to today
- [ ] Open questions table → mark any resolved ones ✅, remove fully dead ones
- [ ] Key decisions table → add any decisions made this session
- [ ] Status section → update if anything changed (blockers lifted, new blockers, new milestones)
- [ ] Kanban → mark completed tasks, add new ones
- [ ] New files created this session? → add each to CLAUDE.md routing table
