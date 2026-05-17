---

kanban-plugin: board

---

## Næste skridt

- [ ] Art direction audit — sammenlign bygget UI mod prototyper i `/Design/`, fix mismatch #build #design
- [ ] **Find alternativ payment provider** — Stripe BLOKERET (skill gaming ikke tilladt). MangoPay afventer svar — nu primær kandidat. MobilePay standalone stadig pending. #business

---

## 📥 Inbox

- [ ] **Opponent Intel system** — three layers: (1) pre-match: opponent win rate overall + in this specific game. (2) in-game: game-specific tendencies e.g. Card Duel shows their 3 most played opening cards, Cycle Duel shows preferred opener per block, Drop Duel shows most played first cell. (3) post-match: chess.com-style game review — saved as separate backlog item. Design question: how much info without making it a direct counter-guide. #design #product


## 🚩 Flagged

- [ ] **Payment provider BLOCKER** — Stripe afvist (skill gaming ikke tilladt). MangoPay er nu eneste kendte path. Afventer svar. Ingen live payments muligt indtil dette er løst. Se `Company/payment-provider-research.md` #business #legal
- [ ] ~~**Stripe pre-authorization**~~ — Udgår. Stripe er blokeret. Irrelevant.
- [ ] **Elite / Marquee stake cap** — Set at 5.000 KR for now. Revisit after MangoPay compliance review — actual limit depends on KYC tier. #business
- [ ] **Technical platform build** — No auth, no payments, no real-time matchmaking yet. Everything is mock. This is the gating work before any real-money feature goes live. #build


## 🗂️ Backlog

- [ ] Big Game / Grand tiers + The Stage — specced in duel_product.md. Needs build: featured feed on front page, profile badge, Nemesis spectating research #build #design
- [ ] War format — specced in duel_product.md. Post-launch. Needs: map UI, sector system, honor system, sector reward mechanic decision #design #build
- [ ] **THE MARQUEE — design start: 2026-05-15** · Broadcast layer on top of the Elite Room. Front of house — not a match room. Shows what's on: challenges posted, matches live, who holds a seat. Feeds landing jumbotron when a challenge is taken. Surface: BROADCAST (bone/paper). Route: `/marquee`. Elite Room (BUNKER, 1,000kr+) is where matches happen — Marquee is the sign above the door. #design #build
- [ ] **THE BIG ONE** — 128-player always-running tournament. Starts the moment seat 128 fills. Rules: max 2 concurrent tournaments per player · funds reserved on entry (taken when tournament fires, unlocked on cancel) · on fill: 2-min grace notification to all 128, unconfirmed → waitlist (60s each) → bye for opponent · missed player: spot lost + 1hr Giant cooldown · waitlist shown publicly ("WAITLIST: 22") · featured permanently on landing jumbotron. Build after standard tournaments stable. #product #build
- [ ] Tournament rules to build: max 2 active per player · 30min-before hard cancel if <50% filled · soft fill with byes if 75%+ · play other games while waiting (tournament match takes priority, 2-min grace) · invite-a-friend share link from waiting room · notifications: 5 seats left, 2 seats left, 10min to start, match ready #build
- [ ] ShipDuel — spec i `Games/ship-duel.md`. Base + Phantom fuldt spec'd. Wireframe mock: `Design/ship-duel.html` (in progress). Mangler: UI spec .md, Spillemyndighed-check. #game #design
- [ ] **Post-match game review** — chess.com-style replay and decision analysis after match ends. Separate from in-game intel. Build after core opponent intel system is live. #product #build
- [ ] Mystery note — "each thing has the value amount, variables is the purse size" — unclear, revisit when context returns
- [ ] Loss credit mechanic — loser earns ~5% of purse as platform credit (non-withdrawable, entry fees only). Retention tool, legally clean. #product
- [ ] Game library filters and categories — needs a design discussion before building. What filters exist, how categories work, what metadata each game card shows. #design #build
- [x] Finding opponent → match transition — finding page rebuilt from bundle, animated transition to matched phase in place #design #build
- [ ] Bracket tournament math — formulas locked in `Research/Formats/bracket-tournament-format.md`. Standard tiers: 64 seats for ≤100 KR, 16 seats for ≥250 KR. Time estimate: `log₂(N)×4+5 min`. TNS50 updated to 64 seats / 2.720 KR prize. #build #product


## Legal

- [x] Awaiting vejledende udtalelse fra Spillemyndigheden — svar modtaget 2026-05-13, færdighedsspil bekræftet, ingen tilladelse kræves. Journal: 26-632347 #legal
- [ ] Spilleretsadvokat — full legal review #legal
- [ ] Legal review T&Cs + hvidvask procedures #legal
- [ ] Hvidvask compliance setup #legal


## Business

- [x] Approach MangoPay — inquiry sent 2026-05-15. Awaiting response. Now primary payment provider (Stripe blocked). #business
- [ ] MobilePay standalone — order submitted 2026-05-16. Status: pending. Still needed — MangoPay does not support MobilePay natively. #business
- [x] Research OOH placement costs — static format decided, location TBD #marketing
- [x] Lock OOH tagline — primær: "Held er en undskyldning." / situationsbestemt: "Sæt penge på dig selv." + "Bevis det." / turnering: "Er du god nok?" #marketing
- [x] Entry fee brand term — låst til "entry" #marketing


## Build

- [ ] Broadcaster voice — apply third-person narration across all in-game text (results, round announcements, action feed). Rule locked in DESIGN.md. #build
- [ ] Elite Room tier threshold — update entry point from 250kr to 1,000kr. 250–500kr tiers drop back to auto-queue. Button in lobby only appears at Big Game + Grand tiers. #build


## 🔧 In Progress

- [ ] **MangoPay — nu primær.** Inquiry submitted 2026-05-15, awaiting response. Stripe blokeret. MangoPay er eneste kendte viable path til PMV. Prioritet: svar hurtigt. #business

- [ ] **SESSION RESUME — Art direction audit (in progress):** UI audit mostly complete across all pages. Remaining: continue matching remaining pages against bundle prototypes. Finding opponent page (`/play/[game]/finding`) rebuilt to match `FindingDesktop` from `screen-platform.jsx` — "SEARCHING." 220px, 7 square dots, elapsed timer, criteria box, cancel button, transitions to PairedDesktop matched phase. Bundle reference file for card flow: `screen-card-flow.jsx`. Platform reference: `screen-platform.jsx`. #design #build


## 🤖 Waiting on Claude



## 👀 Review



## ✅ Done

- [x] Copy library built — `_brain/copy-library.md` — all UI strings, match flow, broadcaster voice, financial labels, legal micro-copy, vocabulary rules #build #design
- [x] Component inventory built — `app/duel/COMPONENTS.md` — all components, lib utilities, props, surfaces, what doesn't exist yet #build

- [x] CVR confirmed — DUEL v/Silas Greve Abainza registered as PMV #legal #business
- [x] CycleDuel — name the 5 card types: Feint · Guard · Strike · Rush · Grab #design
- [x] Define exact rake percentage — 10% 1v1, 15% tournaments #business
- [x] Define min/max stake levels — 10kr min, 500kr max, 6 fixed tiers #business
- [x] Market strategy — EU-first, Copenhagen launch, bootstrap path #strategy
- [x] Launch ad strategy — OOH hero + TikTok/Instagram social drumbeat #marketing
- [x] Sweetened challenge mechanic — no rake on sweetened portion, entry fee on symmetric stake only #design
- [x] Post-match math display — result screen shows purse, entry fee, net gain #design
- [x] Library design direction — flat list with filters and live counts, not Netflix rows #design
- [x] In-game design direction locked — platform = Underground (#18181b, red). In-game = true black + amber accent. Red platform-only, amber in-game only. Each game same accent (amber), same type system. #design
- [x] Platform rebrand — DUEL → DUELS across all components, nav, footer, metadata #design
- [x] Elite Room page — `/play/[game]/elite` built with challenge board, live ticker, info panel, dark theme #build
- [x] Nemesis / rivals system — rival tracking, revenge mechanic, H2H records, profile RIVALS section #build
- [x] Dark mode BroadcastNav — dark prop, dual-theme rendering #build
- [x] Spillemyndighed ruling — færdighedsspil bekræftet, ingen tilladelse kræves. Journal: 26-632347 #legal
- [x] CodeDuel spec — tie resolution locked, fraud section added, split pot on exhaustion confirmed #game
- [x] Anti-cheat policy — `Company/compliance.md` updated: enforcement tiers, bedrageri basis, clawback clause, detection methods #legal #build
- [x] duels.dk live — Next.js app deployed via GitHub → Vercel, DNS peger på Vercel, footer med korrekt CVR + email #build
- [x] MobilePay signup — agreement indsendt, terms.html live på duels.dk/terms.html #business
- [x] Erhvervskonto — AL kontaktet, Lunar Simple (289 kr/md) som backup #business
- [x] Infrastruktur sat op — GitHub (DUELSdk/duels-app) + Vercel auto-deploy pipeline #build




%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false]}
```
%%