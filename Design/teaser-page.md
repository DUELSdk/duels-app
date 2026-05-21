---
type: page-spec
page: /teaser
status: build-ready
updated: 2026-05-18
---

# Teaser Page — `/teaser`

Pre-launch marketing page. One page, one job: capture email addresses before the date drops. The pot is the hook — it's real, it's been growing, but you can't see it yet.

---

## States

Controlled by `REVEAL_DATE` constant at the top of `page.tsx`.

| State | Trigger | Pot | Date |
|-------|---------|-----|------|
| **Pre-reveal** | `REVEAL_DATE = null` | Hidden (black bars) | "COMING." |
| **Revealed** | `REVEAL_DATE = 'YYYY-MM-DD'` | Count-up animation on load | Launch date shown |

Flip the state by setting the constant — no code changes required beyond that.

---

## Sections

### 1. Top strip (ink background)
- Left: `DUELS · PRE-LAUNCH · DK · 18+ · SKILL GAMING ONLY`
- Right: empty pre-reveal / `● LAUNCHES [DATE]` on reveal

### 2. Hero
- Wordmark: `DUELS.` — Barlow 900, clamp(80px → 180px)
- Tagline: `Skill. Money. No luck.` — Barlow 700, clamp(22px → 52px), `--ink-soft`

### 3. Pot reveal
Full-width section, two columns: pot (left) + date (right).

**Pre-reveal — pot:**
Row of ink rectangles sized to match the revealed number's height and rough width. No number. No hint. Below: `POT HAS BEEN BUILDING. DATE DROPS FIRST.`

**Revealed — pot:**
Number count-up from 0 → `LAUNCH_POT_KR` over ~2s (easeOutCubic). Alarm red. Below: `GROWING SINCE DAY ONE. NOW YOU KNOW.`

**Pre-reveal — date:**
`COMING.` in `--ink-ghost`

**Revealed — date:**
Actual date in large display type. `DOORS OPEN` label in alarm.

### 4. Email capture
- Pre-reveal label: `GET THE DATE WHEN IT DROPS`
- Revealed label: `GET ACCESS WHEN DOORS OPEN`
- Input + `NOTIFY ME →` button (alarm fill)
- Confirmation: `✓ YOU'RE ON THE LIST.`
- Sub-copy: `NO SPAM. DATE ANNOUNCEMENT ONLY. UNSUBSCRIBE ANYTIME.`

### 5. What is DUELS (3-column, bone-2 background)
| 1v1. | SKILL ONLY. | REAL MONEY. |
Each column: large headline + 2–3 sentence description.

### 6. Launch games (3-column, bordered)
Card Duel · CycleDuel · Island Duel. Name + one-liner + format detail.

### 7. Footer
`DUELS · DK · EST. 2025 · 18+ · SPILLELOVEN EXEMPT · SKILL GAMING ONLY`

---

## Config

```ts
const REVEAL_DATE: string | null = null   // → 'YYYY-MM-DD' to reveal
const LAUNCH_POT_KR = 25000              // TODO: set actual launch tournament pot
```

---

## Surface

BROADCAST (bone/paper). No BroadcastNav — this is pre-launch. No platform chrome.
