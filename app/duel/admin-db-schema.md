---
title: DUEL Admin & DB Schema
type: research
topic: duel
created: 2026-05-08
updated: 2026-05-08
---

# DUEL — Admin & Database Schema

## Approach

No custom admin panel at launch. Use Supabase Studio to manage tournament data directly. Website fetches live from Supabase — no redeploys needed. Custom admin panel is post-launch once needs are clearer.

**One-time dev task:** swap `mock-data.ts` out for real Supabase fetches in tournament pages.

---

## Tournament Tables

### `tournaments`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text (PK) | URL slug — e.g. `t1-opening` |
| `label` | text | Display name — e.g. `T1 Opening` |
| `game` | text | `card-duel` / `cycle-duel` / `drop-duel` |
| `status` | text | `scheduled` / `open` / `live` / `done` |
| `date` | timestamptz | When the tournament runs |
| `entry_kr` | int | Entry fee in kr |
| `seats` | int | Max players |
| `filled` | int | Current entries |
| `prize_floor_kr` | int | Amount DUEL seeds into the prize pool |
| `format` | text | e.g. `Single elimination` |
| `created_at` | timestamptz | Auto-generated |

---

### `tournament_prizes`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `tournament_id` | text (FK) | References `tournaments.id` |
| `place` | text | e.g. `1ST` / `2ND` / `3RD` |
| `place_order` | int | Sort order — 1, 2, 3 |
| `kr` | int | Prize amount in kr |

---

## Workflow

1. Open Supabase Studio → Table Editor
2. Add a row to `tournaments` with game, date, seats, entry fee
3. Add corresponding rows to `tournament_prizes` for that tournament
4. Set `status` to `scheduled` → `open` → `live` → `done` as the event progresses
5. Site reflects changes immediately — no code, no redeploy

---

## Future Admin Panel

Build post-launch. Triggered when Studio becomes too slow or a non-technical team member needs access. Will be a protected route inside the Next.js app writing to the same Supabase tables.

---

## Related

- [[Research/launch-strategy_research|Launch Strategy]]
- [[duel_product|DUEL Product Note]]
