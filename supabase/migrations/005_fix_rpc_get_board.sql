-- 005_fix_rpc_get_board.sql
-- Fix two bugs in rpc_get_board:
-- 1. "column net_ore does not exist" — window function ORDER BY cannot reference
--    a SELECT-list alias defined in the same query level. Fix: wrap aggregate
--    computation in a subquery so the outer ROW_NUMBER sees net_ore as a real column.
-- 2. Splits not breaking streak — COALESCE(is_win, true) made splits invisible to
--    nonwin_positions. Fix: COALESCE(is_win, false) so NULL (split) = non-win.

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
  -- Fix: COALESCE(is_win, false) so splits (NULL) count as streak-breakers
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
    WHERE NOT COALESCE(is_win, false)
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
  -- Fix: wrap aggregate subquery so ROW_NUMBER sees net_ore as a column from FROM
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
      handle,
      match_count,
      wins,
      losses,
      net_ore
    FROM (
      SELECT
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
    ) inner_bd
  ) bd;

  RETURN jsonb_build_object(
    'biggest_pots',    COALESCE(v_biggest_pots, '[]'::jsonb),
    'longest_streaks', COALESCE(v_streaks,      '[]'::jsonb),
    'biggest_days',    COALESCE(v_biggest_days,  '[]'::jsonb)
  );
END;
$$;
