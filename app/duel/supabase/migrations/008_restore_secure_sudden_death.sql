-- 008_restore_secure_sudden_death.sql
-- Migration 006 accidentally overwrote rpc_submit_sudden_death with the
-- insecure version from 002 (wrote SD cards directly to game_state one at a
-- time, allowing Realtime to leak one player's pick before the other submitted).
-- Migration 004 had fixed this by staging picks in sd_picks (no-client-RLS table)
-- and only updating game_state atomically when both players have submitted.
-- This restores the secure 004 version.

CREATE OR REPLACE FUNCTION rpc_submit_sudden_death(
  p_match_id uuid,
  p_card     text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match     matches%ROWTYPE;
  v_state     game_state%ROWTYPE;
  v_am_p1     boolean;
  v_opp_id    uuid;
  v_opp_card  text;
  v_p1_card   text;
  v_p2_card   text;
  v_winner_id uuid;
  v_beats     jsonb := '{"rock":"scissors","scissors":"paper","paper":"rock"}'::jsonb;
BEGIN
  IF p_card NOT IN ('rock', 'scissors', 'paper') THEN
    RETURN jsonb_build_object('error', 'INVALID_CARD');
  END IF;

  SELECT * INTO v_match FROM matches WHERE id = p_match_id AND status = 'active';
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'MATCH_NOT_FOUND'); END IF;

  IF auth.uid() = v_match.player1_id THEN
    v_am_p1 := true;  v_opp_id := v_match.player2_id;
  ELSIF auth.uid() = v_match.player2_id THEN
    v_am_p1 := false; v_opp_id := v_match.player1_id;
  ELSE
    RETURN jsonb_build_object('error', 'NOT_A_PARTICIPANT');
  END IF;

  SELECT * INTO v_state FROM game_state WHERE match_id = p_match_id;
  IF v_state.phase != 'sudden_death' THEN
    RETURN jsonb_build_object('error', 'WRONG_PHASE');
  END IF;

  -- Store in server-only sd_picks — no Realtime, no client read access
  INSERT INTO sd_picks (match_id, player_id, sd_round, card)
  VALUES (p_match_id, auth.uid(), v_state.sd_round, p_card)
  ON CONFLICT (match_id, player_id, sd_round) DO NOTHING;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'ALREADY_PICKED');
  END IF;

  -- Check if opponent has submitted this round yet
  SELECT card INTO v_opp_card
  FROM sd_picks
  WHERE match_id = p_match_id
    AND player_id = v_opp_id
    AND sd_round  = v_state.sd_round;

  IF v_opp_card IS NULL THEN
    RETURN jsonb_build_object('status', 'waiting');
  END IF;

  -- Both submitted — assign p1/p2 cards and resolve
  IF v_am_p1 THEN
    v_p1_card := p_card; v_p2_card := v_opp_card;
  ELSE
    v_p1_card := v_opp_card; v_p2_card := p_card;
  END IF;

  IF v_p1_card = v_p2_card THEN
    -- Tie — reveal both simultaneously, advance round
    UPDATE game_state SET
      sd_round   = sd_round + 1,
      sd_p1_card = v_p1_card,
      sd_p2_card = v_p2_card
    WHERE match_id = p_match_id;
  ELSE
    IF (v_beats->>v_p1_card) = v_p2_card THEN
      v_winner_id := v_match.player1_id;
    ELSE
      v_winner_id := v_match.player2_id;
    END IF;

    -- Reveal both cards simultaneously, then settle
    UPDATE game_state SET
      sd_p1_card = v_p1_card,
      sd_p2_card = v_p2_card
    WHERE match_id = p_match_id;

    PERFORM rpc_settle_match(p_match_id, v_winner_id);
    UPDATE game_state SET phase = 'complete' WHERE match_id = p_match_id;
  END IF;

  RETURN jsonb_build_object('status', 'ok');
END;
$$;
