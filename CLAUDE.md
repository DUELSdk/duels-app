# CLAUDE.md — DUELS Vault

**Platform name: DUELS** (not DUEL). Domain: `duels.dk`. Any existing file or code that says "DUEL" as the platform name means DUELS — the rename was decided 2026-05-12 but a full file sweep was skipped for cost reasons. New content always uses DUELS.

DUELS skill-gaming platform. Shared vault rules live one level up in `../CLAUDE.md`.

Read order: `CLAUDE.md` → `_brain/index.md` → `_context.md`

`_brain/` is Claude's meta-context — not a workspace. Read it every session.

---

## What This Vault Is

DUEL is a 1v1 skill-gaming platform where players compete for real money. 100% skill, no RNG. Legal framing: competition platform, not casino.

---

## Folder Structure

| Folder | What lives here |
|--------|----------------|
| `/Company` | Legal, finance, compliance, marketing, operations |
| `/Research` | Market research, roadmap, launch strategy |
| `/Templates` | Reusable note templates. Copy before use. |
| `/app` | Next.js app code (`duel/`) — build layer |
| `_brain/` | Claude meta-context — read every session |

---

## Routing

| Task | Read these files |
|------|-----------------|
| Anything money touches (payments, wallet, fees, MangoPay) | `_brain/agent-banker.md` |
| Game rules, legal position, new game review, disputes | `_brain/agent-referee.md` |
| Building or changing anything in `app/duel/` | `_brain/agent-builder.md` |
| Any public-facing copy, brand, launch, campaigns | `_brain/agent-promoter.md` |
| Product / design | `duel_product.md` |
| UI / visual design system | `website/designs/style-guide.html` — tokens, surfaces, components, voice. Then `design.md` for build rules. |
| Design a game mechanic | `duel_product.md` Platform Design Rule section |
| Legal question (product rules) | `duel_product.md` Legal Framework section |
| Legal entity / CVR / aftaler | `Company/legal.md` |
| Finance / regnskab / betalinger | `Company/finance.md` |
| Payment provider decision | `Company/payment-provider-research.md` — comparison, fees, status. Stripe BLOCKED. MangoPay primary candidate, inquiry sent. |
| UI copy / locked strings / brand vocabulary | `_brain/copy-library.md` — every repeated UI string, match flow copy, broadcaster voice templates, financial labels, legal micro-copy. Pull from here when building. Also translation source for DE/SE expansion. |
| Component inventory / what's already built | `app/duel/COMPONENTS.md` — every shared component, game component, lib utility, their props, surface, and usage. Read before building to avoid duplication. Also flags what does NOT exist yet. |
| Compliance / hvidvask / GDPR | `Company/compliance.md` |
| Marketing / brand / kanaler | `Company/marketing.md` |
| Drift / hosting / support | `Company/operations.md` |
| Roadmap / build planning | `Research/duel-roadmap_research.md` |
| Legal market research | `Research/market-legality_research.md` |
| Launch strategy | `Research/launch-strategy_research.md` |
| Add a new game | `duel_product.md` Games section + `Templates/Duel-Game.md` |
| Build or change UI for a specific game | `Games/[game-name]-ui.md` — animations, components, states. Also read `Games/[game-name].md` for rules/visibility. Exists for: card-duel, cycle-duel, drop-duel, ship-duel |
| Game rules (authoritative) | `Games/[game-name].md` — master. `app/duel/GAMES.md` is a build summary derived from this. |
| Unbuilt feature ideas (build-layer) | `app/duel/IDEAS.md` — short concepts waiting to be built. Promoted to GAMES.md or DESIGN.md when decided. |
| Fully spec'd format research | `Research/Formats/` — deep specs with math, legal notes, variables. Not the same as IDEAS.md. |
| Bracket tournament math (seat tiers, prize formula, time estimate) | `Research/Formats/bracket-tournament-format.md` |
| Pre-launch testing | `app/duel/TEST.md` — full manual test checklist across all pages and features |
| Master launch plan | `PLAN.md` — phased plan with gates and dependency map |
| Terms and Conditions (draft) | `Company/terms-and-conditions.md` — draft for MangoPay submission, lawyer review before go-live |
| AML Policy (draft) | `Company/aml-policy.md` — anti-money laundering policy for MangoPay submission |
| Shareholding structure | `Company/shareholding-structure.md` — ownership chart for MangoPay submission |
| MangoPay integration workflow | `Company/mangopay-integration-workflow.md` — money flow diagram for MangoPay submission |
| Create any new note | Matching template from `/Templates` first |

---

## Legal Language (non-negotiable)

Never write these words anywhere in DUEL content — docs, copy, UI text, research notes, code comments:
- ❌ indsats, bet, wager, gamble, gambling, jackpot, odds, house edge

Always use instead:
- ✅ purse (prize pot), take (winnings), split (tie result), competition, skill game, match, platform
- ✅ For the platform fee per match: use "entry fee" in legal/internal docs until the brand term is locked (candidates: cover, call fee, entry, seat — see Platform Vocabulary section in `duel_product.md`)

Danish copy: never "indsats". "entry fee" stays English or use "startgebyr" until brand term decided.

---

## New Game Checklist

Every game added to DUEL must have all of these before it's spec-complete:

- [ ] Core mechanic in 1–2 sentences
- [ ] Simultaneous decision mechanic confirmed — both players commit before either sees the other's move
- [ ] Contested move rule specified (blocked or both-placed)
- [ ] Crown mechanic compatibility noted
- [ ] Legal note — zero RNG, 100% skill confirmed
- [ ] Tiebreaker mechanic defined
- [ ] Themes & variants table (base variant at minimum)
- [ ] Future formats row (even if empty)
- [ ] Added to the games list in `duel_product.md`

Use `Templates/Duel-Game.md` as the base block.

---

## File Hygiene Rules

**New file rule:** Every new `.md` file created in the vault must be added to the Routing table above in the same session. No exceptions. If a file has no routing entry, it is invisible to future sessions.

**Memory rule:** Never create a `memory/` folder inside the vault. Memory files belong exclusively in `~/.claude/projects/C--Users-sylva-OneDrive-Skrivebord-DUEL/memory/` and are written via the memory tool. A vault `memory/` folder will not be loaded by the memory system and is dead weight.

**Design session cleanup:** After a design session is archived into `website/designs/` or a named subfolder in `website/`, delete the root-level `uploads/` source folder. The archive is the record — the source is redundant once bundled.

---

## Design-to-Build Workflow

Discuss what the page needs to do, then build it directly in Next.js. The dev server is the live preview. Do not create new HTML prototypes — it doubles the work and the tokens.

If an existing prototype exists in `/website/designs/` for the page being built, read it first as build reference. Existing prototypes are source of truth. New ones are not created.

### Flow

1. **Discuss direction** — page purpose, layout, copy, any decisions
2. **Check `/website/designs/`** — if a prototype exists for this page, read it before touching code
3. **Build directly in Next.js** — Claude codes it, dev server shows it live
4. **Iterate in the codebase** — changes go straight into the component

---

## Before Building Game UI or Mechanics

Before implementing any UI, logic, or interaction for a specific game — read both files:

- `Games/[game-name].md` — rules, visibility, simultaneous lock, flow, tiebreaker
- `Games/[game-name]-ui.md` — animations, component states, visual feel

This is non-negotiable. Do not assume from memory. Read both files.

---

## Before Designing Something New

Before writing a new spec, format, mechanic, or concept — check if something similar already exists:

1. Scan `Research/` and `Research/Ideas/` for related formats or mechanics
2. Check `duel_product.md` Games section for existing game specs
3. If a match exists: adapt it, don't duplicate. Change the variables, extend the spec, or fork it with a note linking back to the original
4. If nothing matches: proceed with new design

Goal: reuse proven math and structure. New ideas should build on what's already spec'd.

---

## Data Before Design Changes

Before changing variables in any format (cutoff %, match count, entry fee tiers, rake, etc.) or proposing a redesign — check if player data exists that should drive the decision.

1. Check `duel_product.md` Metrics section for current numbers
2. If data is available: use it. Win rate distributions tell you where to set cutoffs. Session drop-off tells you if match count is too long. Revenue per event tells you if rake is calibrated right.
3. If no data yet: design with reasonable defaults and flag the variable as "to be tuned post-launch"
4. After launch: decisions on format variables should reference actual player behavior, not assumptions

Don't redesign something because it feels wrong. Redesign it because the numbers say so.

---

## Open Questions Maintenance

After any session where a DUEL decision is made: mark resolved questions as resolved or remove the row. Do not let answered questions accumulate.

---

## Kanban Board

`Claude-Kanban-Board.md` at the vault root. Check at session start.
