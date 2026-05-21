-- 003_stats_rpcs.sql
-- Platform stats RPCs — replace every mock-data.ts function.
-- All SECURITY DEFINER: bypass RLS to compute aggregates.
-- Never return raw match records — only computed aggregates and public handles.
-- Run after 001_core_schema.sql and 002_queue_gamestate.sql.

-- Net KR formula (must match lib/tiers.ts):
--   Win:   purse_ore - (stake_kr * 100)   — net profit in øre
--   Loss:  -(stake_kr * 100)              — net loss in øre
--   Split: 0                              — entry fee kept, stake refunded

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_matches_settled
  ON matches(settled_at DESC) WHERE status = 'complete';

CREATE INDEX IF NOT EXISTS idx_matches_game_status
  ON matches(game, status);

-- ─── HELPER: fn_current_streak ───────────────────────────────────────────────
-- Returns current all-time win streak for a player.
-- Counts consecutive wins from most recent match backward.
-- Splits (winner_id IS NULL) break the streak.

CREATE OR REPLACE FUNCTION fn_current_streak(p_user_id uuid)
RETURNS smallint
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_streak smallint := 0;
  v_rec    RECORD;
BEGIN
  FOR v_rec IN
    SELECT winner_id
    FROM matches
    WHERE (player1_id = p_user_id OR player2_id = p_user_id)
      AND status = 'complete'
    ORDER BY settled_at DESC
  LOOP
    IF v_rec.winner_id IS NULL THEN EXIT; END IF;
    IF v_rec.winner_id = p_user_id THEN
      v_streak := v_streak + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN v_streak;
END;
$$;

-- ─── HELPER: fn_h2h_streak ───────────────────────────────────────────────────
-- H2H streak between two players from p_user_id's perspective.
-- Positive = win streak, negative = loss streak. Splits break streak.

CREATE OR REPLACE FUNCTION fn_h2h_streak(p_user_id uuid, p_opp_id uuid)
RETURNS smallint
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_streak     smallint := 0;
  v_streak_dir smallint := 0;
  v_is_win     boolean;
  v_rec        RECORD;
BEGIN
  FOR v_rec IN
    SELECT winner_id
    FROM matches
    WHERE ((player1_id = p_user_id AND player2_id = p_opp_id) OR
           (player2_id = p_user_id AND player1_id = p_opp_id))
      AND status = 'complete'
    ORDER BY settled_at DESC
  LOOP
    IF v_rec.winner_id IS NULL THEN EXIT; END IF;
    v_is_win := (v_rec.winner_id = p_user_id);
    IF v_streak_dir = 0 THEN
      v_streak_dir := CASE WHEN v_is_win THEN 1 ELSE -1 END;
      v_streak     := v_streak_dir;
    ELSIF (v_is_win AND v_streak_dir = 1) OR (NOT v_is_win AND v_streak_dir = -1) THEN
      v_streak := v_streak + v_streak_dir;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN v_streak;
END;
$$;

-- ─── RPC: rpc_get_stats_strip ────────────────────────────────────────────────
-- Replaces: getStatsStrip()
-- Returns biggest pot today, settled count, total staked today.

CREATE OR REPLACE FUNCTION rpc_get_stats_strip()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_today        timestamptz := date_trunc('day', now());
  v_biggest_who  text;
  v_biggest_ore  bigint;
  v_settled      bigint;
  v_total_paid   bigint;
BEGIN
  SELECT p1.handle || ' VS ' || p2.handle, m.purse_ore
  INTO v_biggest_who, v_biggest_ore
  FROM matches m
  JOIN profiles p1 ON p1.id = m.player1_id
  JOIN profiles p2 ON p2.id = m.player2_id
  WHERE m.status = 'complete' AND m.settled_at >= v_today
  ORDER BY m.purse_ore DESC
  LIMIT 1;

  SELECT COUNT(*), COALESCE(SUM(m.stake_kr::bigint * 2 * 100), 0)
  INTO v_settled, v_total_paid
  FROM matches m
  WHERE m.status = 'complete' AND m.settled_at >= v_today;

  RETURN jsonb_build_object(
    'biggest_pot_who',  COALESCE(v_biggest_who, '—'),
    'biggest_pot_ore',  COALESCE(v_biggest_ore, 0),
    'settled_today',    COALESCE(v_settled, 0),
    'total_paid_ore',   COALESCE(v_total_paid, 0)
  );
END;
$$;

-- ─── RPC: rpc_get_live_counts ────────────────────────────────────────────────
-- Replaces: getLiveMatchCount()
-- Returns active match count + settled today. Call on mount; use Realtime
-- subscriptions on game_state for live updates between calls.

CREATE OR REPLACE FUNCTION rpc_get_live_counts()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_live     bigint;
  v_settled  bigint;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE status = 'active'),
    COUNT(*) FILTER (WHERE status = 'complete' AND settled_at >= date_trunc('day', now()))
  INTO v_live, v_settled
  FROM matches;

  RETURN jsonb_build_object(
    'live',          COALESCE(v_live, 0),
    'settled_today', COALESCE(v_settled, 0)
  );
END;
$$;

-- ─── RPC: rpc_get_leaderboard ────────────────────────────────────────────────
-- Replaces: getLeaderboard()
-- p_period: 'today' | 'week' | 'all_time'
-- Streak is always all-time current streak regardless of period.
-- Post-launch: add materialized view when player count grows.

CREATE OR REPLACE FUNCTION rpc_get_leaderboard(p_period text DEFAULT 'all_time')
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_cutoff timestamptz;
  v_result jsonb;
BEGIN
  v_cutoff := CASE p_period
    WHEN 'today' THEN date_trunc('day', now())
    WHEN 'week'  THEN now() - interval '7 days'
    ELSE NULL
  END;

  WITH player_stats AS (
    SELECT
      p.id,
      p.handle,
      COUNT(*) FILTER (WHERE m.winner_id = p.id)                              AS wins,
      COUNT(*) FILTER (WHERE m.winner_id IS NOT NULL AND m.winner_id != p.id) AS losses,
      COALESCE(SUM(CASE
        WHEN m.winner_id = p.id THEN m.purse_ore - m.stake_kr::bigint * 100
        WHEN m.winner_id IS NULL THEN 0
        ELSE -(m.stake_kr::bigint * 100)
      END), 0) AS net_ore
    FROM profiles p
    JOIN matches m ON (m.player1_id = p.id OR m.player2_id = p.id)
    WHERE m.status = 'complete'
      AND (v_cutoff IS NULL OR m.settled_at >= v_cutoff)
    GROUP BY p.id, p.handle
  ),
  ranked AS (
    SELECT
      ROW_NUMBER() OVER (ORDER BY net_ore DESC, wins DESC) AS rank,
      handle,
      wins,
      losses,
      net_ore,
      fn_current_streak(id) AS streak
    FROM player_stats
    ORDER BY net_ore DESC, wins DESC
    LIMIT 100
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'rank',    rank,
      'handle',  handle,
      'wins',    wins,
      'losses',  losses,
      'net_ore', net_ore,
      'streak',  streak
    ) ORDER BY rank
  ) INTO v_result
  FROM ranked;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- ─── RPC: rpc_get_board ──────────────────────────────────────────────────────
-- Replaces: getBoard()
-- Returns biggest pots today, longest current streaks, biggest days (net KR today).

CREATE OR REPLACE FUNCTION rpc_get_board()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_today        timestamptz := date_trunc('day', now());
  v_biggest_pots jsonb;
  v_streaks      jsonb;
  v_biggest_days jsonb;
BEGIN
  -- Biggest pots settled today
  SELECT jsonb_agg(
    jsonb_build_object(
      'rank',      rn,
      'who',       who,
      'what',      what,
      'value_ore', value_ore
    ) ORDER BY rn
  ) INTO v_biggest_pots
  FROM (
    SELECT
      ROW_NUMBER() OVER (ORDER BY m.purse_ore DESC) AS rn,
      p1.handle || ' VS ' || p2.handle             AS who,
      upper(m.game) || ' · ' || m.stake_kr || ' KR ROOM' AS what,
      m.purse_ore                                  AS value_ore
    FROM matches m
    JOIN profiles p1 ON p1.id = m.player1_id
    JOIN profiles p2 ON p2.id = m.player2_id
    WHERE m.status = 'complete' AND m.settled_at >= v_today
    ORDER BY m.purse_ore DESC
    LIMIT 5
  ) bp;

  -- Longest current win streaks (all players, active streaks only)
  WITH player_matches AS (
    SELECT
      p.id                                                                        AS player_id,
      p.handle,
      CASE WHEN m.winner_id IS NULL THEN NULL ELSE (m.winner_id = p.id) END       AS is_win,
      ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY m.settled_at DESC)            AS rn,
      COUNT(*)     OVER (PARTITION BY p.id)                                       AS total_matches
    FROM profiles p
    JOIN matches m ON (m.player1_id = p.id OR m.player2_id = p.id)
    WHERE m.status = 'complete'
  ),
  nonwin_positions AS (
    SELECT player_id, MIN(rn) AS first_nonwin_rn
    FROM player_matches
    WHERE NOT COALESCE(is_win, true)
    GROUP BY player_id
  ),
  streaks AS (
    SELECT
      pm.player_id,
      pm.handle,
      COALESCE(nw.first_nonwin_rn - 1, pm.total_matches)::bigint AS streak
    FROM player_matches pm
    LEFT JOIN nonwin_positions nw ON nw.player_id = pm.player_id
    WHERE pm.rn = 1
  )
  SELECT jsonb_agg(
    jsonb_build_object('rank', rn, 'handle', handle, 'streak', streak)
    ORDER BY rn
  ) INTO v_streaks
  FROM (
    SELECT handle, streak, ROW_NUMBER() OVER (ORDER BY streak DESC) AS rn
    FROM streaks
    WHERE streak > 0
    ORDER BY streak DESC
    LIMIT 5
  ) top_streaks;

  -- Biggest days (net KR today per player)
  SELECT jsonb_agg(
    jsonb_build_object(
      'rank',        rn,
      'handle',      handle,
      'match_count', match_count,
      'wins',        wins,
      'losses',      losses,
      'net_ore',     net_ore
    ) ORDER BY rn
  ) INTO v_biggest_days
  FROM (
    SELECT
      ROW_NUMBER() OVER (ORDER BY net_ore DESC) AS rn,
      p.handle,
      COUNT(*)                                                                        AS match_count,
      COUNT(*) FILTER (WHERE m.winner_id = p.id)                                     AS wins,
      COUNT(*) FILTER (WHERE m.winner_id IS NOT NULL AND m.winner_id != p.id)        AS losses,
      COALESCE(SUM(CASE
        WHEN m.winner_id = p.id THEN m.purse_ore - m.stake_kr::bigint * 100
        WHEN m.winner_id IS NULL THEN 0
        ELSE -(m.stake_kr::bigint * 100)
      END), 0) AS net_ore
    FROM profiles p
    JOIN matches m ON (m.player1_id = p.id OR m.player2_id = p.id)
    WHERE m.status = 'complete' AND m.settled_at >= v_today
    GROUP BY p.id, p.handle
    ORDER BY net_ore DESC
    LIMIT 5
  ) bd;

  RETURN jsonb_build_object(
    'biggest_pots',    COALESCE(v_biggest_pots, '[]'::jsonb),
    'longest_streaks', COALESCE(v_streaks,      '[]'::jsonb),
    'biggest_days',    COALESCE(v_biggest_days,  '[]'::jsonb)
  );
END;
$$;

-- ─── RPC: rpc_get_user_stats ─────────────────────────────────────────────────
-- Replaces: getCurrentUser() + getH2HRecord()
-- Returns full profile stats for the authenticated user.
-- Rank = number of players with higher all-time net_ore + 1.
-- Post-launch: rank computation becomes slow at scale — add materialized view.

CREATE OR REPLACE FUNCTION rpc_get_user_stats()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id   uuid := auth.uid();
  v_profile   profiles%ROWTYPE;
  v_wallet    wallets%ROWTYPE;
  v_wins      bigint;
  v_losses    bigint;
  v_net_ore   bigint;
  v_rank      bigint;
  v_game_stats jsonb;
  v_recent    jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'NOT_AUTHENTICATED');
  END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = v_user_id;
  SELECT * INTO v_wallet  FROM wallets  WHERE user_id = v_user_id;

  -- Wins, losses, net_ore
  SELECT
    COUNT(*) FILTER (WHERE winner_id = v_user_id),
    COUNT(*) FILTER (WHERE winner_id IS NOT NULL AND winner_id != v_user_id),
    COALESCE(SUM(CASE
      WHEN winner_id = v_user_id THEN purse_ore - stake_kr::bigint * 100
      WHEN winner_id IS NULL THEN 0
      ELSE -(stake_kr::bigint * 100)
    END), 0)
  INTO v_wins, v_losses, v_net_ore
  FROM matches
  WHERE (player1_id = v_user_id OR player2_id = v_user_id)
    AND status = 'complete';

  -- Rank: players with higher net_ore
  SELECT COUNT(*) + 1 INTO v_rank
  FROM (
    SELECT p.id, COALESCE(SUM(CASE
      WHEN m.winner_id = p.id THEN m.purse_ore - m.stake_kr::bigint * 100
      WHEN m.winner_id IS NULL THEN 0
      ELSE -(m.stake_kr::bigint * 100)
    END), 0) AS net_ore
    FROM profiles p
    LEFT JOIN matches m ON (m.player1_id = p.id OR m.player2_id = p.id)
      AND m.status = 'complete'
    WHERE p.id != v_user_id
    GROUP BY p.id
  ) others
  WHERE others.net_ore > v_net_ore;

  -- Per-game breakdown
  SELECT jsonb_agg(
    jsonb_build_object('game', game, 'played', played, 'won', won)
    ORDER BY played DESC
  ) INTO v_game_stats
  FROM (
    SELECT
      game,
      COUNT(*) AS played,
      COUNT(*) FILTER (WHERE winner_id = v_user_id) AS won
    FROM matches
    WHERE (player1_id = v_user_id OR player2_id = v_user_id)
      AND status = 'complete'
    GROUP BY game
  ) gs;

  -- Recent matches (last 8)
  SELECT jsonb_agg(
    jsonb_build_object(
      'id',         m.id,
      'game',       m.game,
      'opponent',   CASE WHEN m.player1_id = v_user_id THEN p2.handle ELSE p1.handle END,
      'result',     CASE WHEN m.winner_id = v_user_id THEN 'WIN'
                         WHEN m.winner_id IS NULL THEN 'SPLIT'
                         ELSE 'LOSS' END,
      'net_ore',    CASE WHEN m.winner_id = v_user_id THEN m.purse_ore - m.stake_kr::bigint * 100
                         WHEN m.winner_id IS NULL THEN 0
                         ELSE -(m.stake_kr::bigint * 100) END,
      'stake_kr',   m.stake_kr,
      'settled_at', m.settled_at
    ) ORDER BY m.settled_at DESC
  ) INTO v_recent
  FROM (
    SELECT * FROM matches
    WHERE (player1_id = v_user_id OR player2_id = v_user_id)
      AND status = 'complete'
    ORDER BY settled_at DESC
    LIMIT 8
  ) m
  JOIN profiles p1 ON p1.id = m.player1_id
  JOIN profiles p2 ON p2.id = m.player2_id;

  RETURN jsonb_build_object(
    'handle',         v_profile.handle,
    'initials',       v_profile.initials,
    'member_since',   to_char(v_profile.member_since, 'Month YYYY'),
    'balance_ore',    COALESCE(v_wallet.balance_ore, 0),
    'rank',           v_rank,
    'wins',           v_wins,
    'losses',         v_losses,
    'net_ore',        v_net_ore,
    'game_stats',     COALESCE(v_game_stats, '[]'::jsonb),
    'recent_matches', COALESCE(v_recent, '[]'::jsonb)
  );
END;
$$;

-- ─── RPC: rpc_get_rivals ─────────────────────────────────────────────────────
-- Replaces: getRivals() / getH2HRecord()
-- Returns H2H records for all opponents the current user has faced.
-- Ordered by most played. Limited to 20.

CREATE OR REPLACE FUNCTION rpc_get_rivals()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_result  jsonb;
BEGIN
  IF v_user_id IS NULL THEN RETURN '[]'::jsonb; END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'handle',         p.handle,
      'played',         h.played,
      'wins',           h.wins,
      'losses',         h.losses,
      'current_streak', fn_h2h_streak(v_user_id, h.opp_id),
      'revenge_active', fn_h2h_streak(v_user_id, h.opp_id) <= -3
    ) ORDER BY h.played DESC
  ) INTO v_result
  FROM (
    SELECT
      CASE WHEN m.player1_id = v_user_id THEN m.player2_id ELSE m.player1_id END AS opp_id,
      COUNT(*)                                                                    AS played,
      COUNT(*) FILTER (WHERE m.winner_id = v_user_id)                            AS wins,
      COUNT(*) FILTER (WHERE m.winner_id IS NOT NULL AND m.winner_id != v_user_id) AS losses
    FROM matches m
    WHERE (m.player1_id = v_user_id OR m.player2_id = v_user_id)
      AND m.status = 'complete'
    GROUP BY opp_id
    ORDER BY played DESC
    LIMIT 20
  ) h
  JOIN profiles p ON p.id = h.opp_id;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- ─── RPC: rpc_get_ticker ─────────────────────────────────────────────────────
-- Replaces: getTicker()
-- Returns last 10 settled matches for the live ticker strip.

CREATE OR REPLACE FUNCTION rpc_get_ticker()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'game', upper(m.game),
      'text', p1.handle || ' VS ' || p2.handle || ' · ' || m.stake_kr || ' KR'
    )
  ) INTO v_result
  FROM (
    SELECT id, game, stake_kr, player1_id, player2_id
    FROM matches
    WHERE status = 'complete'
    ORDER BY settled_at DESC
    LIMIT 10
  ) m
  JOIN profiles p1 ON p1.id = m.player1_id
  JOIN profiles p2 ON p2.id = m.player2_id;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- ─── RPC: rpc_get_game_live_counts ───────────────────────────────────────────
-- Replaces: getGames() live counts + getLibraryCategories() live counts
-- Returns live and today count per game for library and game cards.

CREATE OR REPLACE FUNCTION rpc_get_game_live_counts()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'game',        game,
      'live_count',  live_count,
      'today_count', today_count
    )
  ) INTO v_result
  FROM (
    SELECT
      game,
      COUNT(*) FILTER (WHERE status = 'active')                                          AS live_count,
      COUNT(*) FILTER (WHERE status = 'complete'
        AND settled_at >= date_trunc('day', now()))                                      AS today_count
    FROM matches
    GROUP BY game
  ) gc;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- ─── NOTES ───────────────────────────────────────────────────────────────────
-- rpc_get_live_counts: use for initial page load only.
--   Wire Supabase Realtime subscription on game_state for live count updates.
-- rpc_get_leaderboard: fn_current_streak called once per player in result set.
--   Add materialized view post-launch when player count exceeds ~500.
-- rpc_get_user_stats rank: full-table scan on profiles/matches.
--   Add materialized view post-launch when player count exceeds ~500.
