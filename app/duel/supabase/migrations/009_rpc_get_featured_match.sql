-- 009_rpc_get_featured_match.sql
-- Spectator-safe function for the homepage Jumbotron.
-- Returns the active card-duel match with the highest purse,
-- or the most recently completed one if no active match exists.
-- SECURITY DEFINER bypasses game_state RLS so unauthenticated visitors can view.
-- Sequences converted from full names (rock/scissors/paper) → initials (R/S/P).

CREATE OR REPLACE FUNCTION rpc_get_featured_match()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match   matches%ROWTYPE;
  v_state   game_state%ROWTYPE;
  v_p1      text;
  v_p2      text;
  v_p1_seq  jsonb;
  v_p2_seq  jsonb;
  v_status  text;
BEGIN
  -- Active match first (highest purse)
  SELECT * INTO v_match
  FROM matches
  WHERE status = 'active' AND game = 'card-duel'
  ORDER BY purse_ore DESC
  LIMIT 1;

  -- Fall back to most recently settled complete match
  IF NOT FOUND THEN
    SELECT * INTO v_match
    FROM matches
    WHERE status = 'complete' AND game = 'card-duel'
    ORDER BY settled_at DESC NULLS LAST
    LIMIT 1;
  END IF;

  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT * INTO v_state FROM game_state WHERE match_id = v_match.id;
  SELECT handle INTO v_p1 FROM profiles WHERE id = v_match.player1_id;
  SELECT handle INTO v_p2 FROM profiles WHERE id = v_match.player2_id;

  -- Convert sequence card names to single-letter initials (null → JSON null)
  SELECT COALESCE(
    (SELECT jsonb_agg(
       CASE c
         WHEN 'rock'     THEN to_jsonb('R'::text)
         WHEN 'scissors' THEN to_jsonb('S'::text)
         WHEN 'paper'    THEN to_jsonb('P'::text)
         ELSE 'null'::jsonb
       END)
     FROM jsonb_array_elements_text(v_state.p1_sequence) c),
    '[null,null,null,null,null,null,null,null,null]'::jsonb
  ) INTO v_p1_seq;

  SELECT COALESCE(
    (SELECT jsonb_agg(
       CASE c
         WHEN 'rock'     THEN to_jsonb('R'::text)
         WHEN 'scissors' THEN to_jsonb('S'::text)
         WHEN 'paper'    THEN to_jsonb('P'::text)
         ELSE 'null'::jsonb
       END)
     FROM jsonb_array_elements_text(v_state.p2_sequence) c),
    '[null,null,null,null,null,null,null,null,null]'::jsonb
  ) INTO v_p2_seq;

  -- Status text for the match ticker line
  v_status := CASE
    WHEN v_match.status = 'complete' THEN
      upper(v_p1) || ' ' || v_state.p1_score || ' — ' || v_state.p2_score || ' ' || upper(v_p2)
    WHEN v_state.phase = 'lock' THEN
      upper(v_p1) || ' and ' || upper(v_p2) || ' · locking sequences'
    WHEN v_state.phase = 'sudden_death' THEN
      upper(v_p1) || ' vs ' || upper(v_p2) || ' · sudden death round ' || v_state.sd_round
    ELSE
      upper(v_p1) || ' ' || v_state.p1_score || ' — ' || v_state.p2_score || ' ' || upper(v_p2) || ' · resolving'
  END;

  RETURN jsonb_build_object(
    'id',           left(v_match.id::text, 6),
    'game_label',   'CARD DUEL',
    'stake_kr',     v_match.stake_kr,
    'pot',          v_match.purse_ore / 100,
    'player_a',     upper(v_p1),
    'player_b',     upper(v_p2),
    'watching',     0,
    'match_status', v_match.status,
    'phase',        v_state.phase,
    'p1_score',     v_state.p1_score,
    'p2_score',     v_state.p2_score,
    'status_text',  v_status,
    'board',        jsonb_build_object(
      'kind', 'card-duel',
      'a',    v_p1_seq,
      'b',    v_p2_seq
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION rpc_get_featured_match() TO anon, authenticated;
