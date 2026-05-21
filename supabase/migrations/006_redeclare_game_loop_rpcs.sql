-- 006_redeclare_game_loop_rpcs.sql
-- Re-declares all game-loop RPCs from 002 to force PostgREST schema cache reload.
-- The functions exist in the DB but PostgREST did not pick them up after 002 was
-- deployed. Running CREATE OR REPLACE here triggers the schema cache notification.
-- Safe: all statements are idempotent (CREATE OR REPLACE).

CREATE OR REPLACE FUNCTION rpc_create_profile_and_wallet(
  p_handle   text,
  p_initials text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_wallet_id   uuid;
  v_welcome_ore bigint := 500000;
BEGIN
  INSERT INTO profiles (id, handle, initials, mitid_verified)
  VALUES (auth.uid(), upper(p_handle), upper(p_initials), false);

  INSERT INTO wallets (user_id, balance_ore)
  VALUES (auth.uid(), v_welcome_ore)
  RETURNING id INTO v_wallet_id;

  INSERT INTO transactions
    (wallet_id, user_id, type, amount_ore, balance_after_ore, status, description, settled_at)
  VALUES
    (v_wallet_id, auth.uid(), 'refund', v_welcome_ore, v_welcome_ore,
     'settled', 'PLAY MONEY · WELCOME CREDIT', now());
END;
$$;

CREATE OR REPLACE FUNCTION rpc_join_queue(
  p_game          text,
  p_tier_id       text,
  p_stake_kr      smallint,
  p_entry_fee_ore integer,
  p_purse_ore     integer
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_stake_ore       bigint := p_stake_kr * 100;
  v_my_wallet_id    uuid;
  v_my_balance_ore  bigint;
  v_my_bal_after    bigint;
  v_opp_wallet_id   uuid;
  v_opp_bal_after   bigint;
  v_opp_queue_id    uuid;
  v_opp_id          uuid;
  v_queue_id        uuid;
  v_match_id        uuid;
BEGIN
  SELECT id, balance_ore INTO v_my_wallet_id, v_my_balance_ore
  FROM wallets WHERE user_id = auth.uid();

  IF v_my_balance_ore < v_stake_ore THEN
    RETURN jsonb_build_object('error', 'INSUFFICIENT_BALANCE');
  END IF;

  SELECT id, user_id INTO v_opp_queue_id, v_opp_id
  FROM queue
  WHERE game = p_game
    AND tier_id = p_tier_id
    AND stake_kr = p_stake_kr
    AND status = 'waiting'
    AND user_id != auth.uid()
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_opp_queue_id IS NULL THEN
    UPDATE wallets SET balance_ore = balance_ore - v_stake_ore
    WHERE id = v_my_wallet_id
    RETURNING balance_ore INTO v_my_bal_after;

    INSERT INTO transactions
      (wallet_id, user_id, type, amount_ore, balance_after_ore, status, description)
    VALUES
      (v_my_wallet_id, auth.uid(), 'match_entry', -v_stake_ore, v_my_bal_after,
       'pending', 'QUEUE ENTRY · ' || upper(p_game) || ' · ' || p_stake_kr || ' KR');

    INSERT INTO queue (user_id, game, tier_id, stake_kr, status)
    VALUES (auth.uid(), p_game, p_tier_id, p_stake_kr, 'waiting')
    RETURNING id INTO v_queue_id;

    RETURN jsonb_build_object('status', 'waiting', 'queue_id', v_queue_id);
  END IF;

  SELECT id INTO v_opp_wallet_id FROM wallets WHERE user_id = v_opp_id;

  UPDATE wallets SET balance_ore = balance_ore - v_stake_ore
  WHERE id = v_my_wallet_id
  RETURNING balance_ore INTO v_my_bal_after;

  UPDATE transactions SET status = 'settled', settled_at = now(),
    description = 'MATCH ENTRY · ' || upper(p_game) || ' · ' || p_stake_kr || ' KR'
  WHERE id = (
    SELECT id FROM transactions
    WHERE wallet_id = v_opp_wallet_id AND status = 'pending' AND type = 'match_entry'
    ORDER BY created_at DESC LIMIT 1
  );

  INSERT INTO transactions
    (wallet_id, user_id, type, amount_ore, balance_after_ore, status, description, settled_at)
  VALUES
    (v_my_wallet_id, auth.uid(), 'match_entry', -v_stake_ore, v_my_bal_after,
     'settled', 'MATCH ENTRY · ' || upper(p_game) || ' · ' || p_stake_kr || ' KR', now());

  INSERT INTO matches
    (game, player1_id, player2_id, stake_kr, entry_fee_ore, purse_ore, status)
  VALUES
    (p_game, v_opp_id, auth.uid(), p_stake_kr, p_entry_fee_ore, p_purse_ore, 'active')
  RETURNING id INTO v_match_id;

  INSERT INTO game_state (match_id) VALUES (v_match_id);

  UPDATE queue SET status = 'matched', match_id = v_match_id WHERE id = v_opp_queue_id;

  INSERT INTO queue (user_id, game, tier_id, stake_kr, status, match_id)
  VALUES (auth.uid(), p_game, p_tier_id, p_stake_kr, 'matched', v_match_id)
  RETURNING id INTO v_queue_id;

  RETURN jsonb_build_object('status', 'matched', 'match_id', v_match_id, 'queue_id', v_queue_id);
END;
$$;

CREATE OR REPLACE FUNCTION rpc_cancel_queue(p_queue_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_stake_ore bigint;
  v_wallet_id uuid;
  v_bal_after bigint;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM queue
    WHERE id = p_queue_id AND user_id = auth.uid() AND status = 'waiting'
  ) THEN
    RETURN;
  END IF;

  SELECT stake_kr * 100 INTO v_stake_ore FROM queue WHERE id = p_queue_id;
  SELECT id INTO v_wallet_id FROM wallets WHERE user_id = auth.uid();

  UPDATE queue SET status = 'cancelled' WHERE id = p_queue_id;

  UPDATE wallets SET balance_ore = balance_ore + v_stake_ore
  WHERE id = v_wallet_id
  RETURNING balance_ore INTO v_bal_after;

  UPDATE transactions SET status = 'cancelled'
  WHERE id = (
    SELECT id FROM transactions
    WHERE wallet_id = v_wallet_id AND status = 'pending' AND type = 'match_entry'
    ORDER BY created_at DESC LIMIT 1
  );

  INSERT INTO transactions
    (wallet_id, user_id, type, amount_ore, balance_after_ore, status, description, settled_at)
  VALUES
    (v_wallet_id, auth.uid(), 'refund', v_stake_ore, v_bal_after,
     'settled', 'QUEUE CANCELLED · STAKE REFUNDED', now());
END;
$$;

CREATE OR REPLACE FUNCTION rpc_submit_sequence(
  p_match_id uuid,
  p_sequence jsonb
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match  matches%ROWTYPE;
  v_state  game_state%ROWTYPE;
  v_am_p1  boolean;
BEGIN
  SELECT * INTO v_match FROM matches WHERE id = p_match_id AND status = 'active';
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'MATCH_NOT_FOUND'); END IF;

  IF auth.uid() = v_match.player1_id THEN
    v_am_p1 := true;
  ELSIF auth.uid() = v_match.player2_id THEN
    v_am_p1 := false;
  ELSE
    RETURN jsonb_build_object('error', 'NOT_A_PARTICIPANT');
  END IF;

  SELECT * INTO v_state FROM game_state WHERE match_id = p_match_id;
  IF v_state.phase != 'lock' THEN
    RETURN jsonb_build_object('error', 'WRONG_PHASE');
  END IF;

  IF v_am_p1 AND v_state.p1_locked THEN
    RETURN jsonb_build_object('error', 'ALREADY_LOCKED');
  END IF;
  IF NOT v_am_p1 AND v_state.p2_locked THEN
    RETURN jsonb_build_object('error', 'ALREADY_LOCKED');
  END IF;

  INSERT INTO match_sequences (match_id, player_id, sequence)
  VALUES (p_match_id, auth.uid(), p_sequence)
  ON CONFLICT (match_id, player_id) DO NOTHING;

  IF v_am_p1 THEN
    UPDATE game_state SET p1_locked = true WHERE match_id = p_match_id;
  ELSE
    UPDATE game_state SET p2_locked = true WHERE match_id = p_match_id;
  END IF;

  SELECT * INTO v_state FROM game_state WHERE match_id = p_match_id;
  IF v_state.p1_locked AND v_state.p2_locked THEN
    PERFORM rpc_resolve_card_duel(p_match_id, v_match.player1_id, v_match.player2_id);
  END IF;

  RETURN jsonb_build_object('status', 'ok');
END;
$$;

CREATE OR REPLACE FUNCTION rpc_resolve_card_duel(
  p_match_id  uuid,
  p_player1   uuid,
  p_player2   uuid
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_seq1      jsonb;
  v_seq2      jsonb;
  v_results   jsonb := '[]'::jsonb;
  v_p1_score  smallint := 0;
  v_p2_score  smallint := 0;
  v_card1     text;
  v_card2     text;
  v_outcome   text;
  v_beats     jsonb := '{"rock":"scissors","scissors":"paper","paper":"rock"}'::jsonb;
  i           int;
BEGIN
  SELECT sequence INTO v_seq1 FROM match_sequences WHERE match_id = p_match_id AND player_id = p_player1;
  SELECT sequence INTO v_seq2 FROM match_sequences WHERE match_id = p_match_id AND player_id = p_player2;

  FOR i IN 0..8 LOOP
    v_card1 := v_seq1->>i;
    v_card2 := v_seq2->>i;

    IF v_card1 = v_card2 THEN
      v_outcome := 'tie';
    ELSIF (v_beats->>v_card1) = v_card2 THEN
      v_outcome := 'player1'; v_p1_score := v_p1_score + 1;
    ELSE
      v_outcome := 'player2'; v_p2_score := v_p2_score + 1;
    END IF;

    v_results := v_results || to_jsonb(v_outcome);
  END LOOP;

  IF v_p1_score != v_p2_score THEN
    UPDATE game_state SET
      phase = 'reveal',
      p1_sequence = v_seq1,
      p2_sequence = v_seq2,
      round_results = v_results,
      p1_score = v_p1_score,
      p2_score = v_p2_score
    WHERE match_id = p_match_id;

    PERFORM rpc_settle_match(
      p_match_id,
      CASE WHEN v_p1_score > v_p2_score THEN p_player1 ELSE p_player2 END
    );

    UPDATE game_state SET phase = 'complete' WHERE match_id = p_match_id;
  ELSE
    UPDATE game_state SET
      phase = 'sudden_death',
      p1_sequence = v_seq1,
      p2_sequence = v_seq2,
      round_results = v_results,
      p1_score = v_p1_score,
      p2_score = v_p2_score,
      sd_round = 1
    WHERE match_id = p_match_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION rpc_submit_sudden_death(
  p_match_id uuid,
  p_card     text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match     matches%ROWTYPE;
  v_state     game_state%ROWTYPE;
  v_am_p1     boolean;
  v_winner_id uuid;
  v_beats     jsonb := '{"rock":"scissors","scissors":"paper","paper":"rock"}'::jsonb;
BEGIN
  IF p_card NOT IN ('rock', 'scissors', 'paper') THEN
    RETURN jsonb_build_object('error', 'INVALID_CARD');
  END IF;

  SELECT * INTO v_match FROM matches WHERE id = p_match_id AND status = 'active';
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'MATCH_NOT_FOUND'); END IF;

  IF auth.uid() = v_match.player1_id THEN
    v_am_p1 := true;
  ELSIF auth.uid() = v_match.player2_id THEN
    v_am_p1 := false;
  ELSE
    RETURN jsonb_build_object('error', 'NOT_A_PARTICIPANT');
  END IF;

  SELECT * INTO v_state FROM game_state WHERE match_id = p_match_id;
  IF v_state.phase != 'sudden_death' THEN
    RETURN jsonb_build_object('error', 'WRONG_PHASE');
  END IF;

  IF v_am_p1 THEN
    IF v_state.sd_p1_card IS NOT NULL THEN
      RETURN jsonb_build_object('error', 'ALREADY_PICKED');
    END IF;
    UPDATE game_state SET sd_p1_card = p_card WHERE match_id = p_match_id;
  ELSE
    IF v_state.sd_p2_card IS NOT NULL THEN
      RETURN jsonb_build_object('error', 'ALREADY_PICKED');
    END IF;
    UPDATE game_state SET sd_p2_card = p_card WHERE match_id = p_match_id;
  END IF;

  SELECT * INTO v_state FROM game_state WHERE match_id = p_match_id;

  IF v_state.sd_p1_card IS NOT NULL AND v_state.sd_p2_card IS NOT NULL THEN
    IF v_state.sd_p1_card = v_state.sd_p2_card THEN
      UPDATE game_state SET
        sd_round = sd_round + 1,
        sd_p1_card = null,
        sd_p2_card = null
      WHERE match_id = p_match_id;
    ELSE
      IF (v_beats->>v_state.sd_p1_card) = v_state.sd_p2_card THEN
        v_winner_id := v_match.player1_id;
      ELSE
        v_winner_id := v_match.player2_id;
      END IF;

      PERFORM rpc_settle_match(p_match_id, v_winner_id);
      UPDATE game_state SET phase = 'complete' WHERE match_id = p_match_id;
    END IF;
  END IF;

  RETURN jsonb_build_object('status', 'ok');
END;
$$;

CREATE OR REPLACE FUNCTION rpc_settle_match(
  p_match_id  uuid,
  p_winner_id uuid
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match        matches%ROWTYPE;
  v_wallet_id    uuid;
  v_bal_after    bigint;
BEGIN
  SELECT * INTO v_match FROM matches WHERE id = p_match_id;

  SELECT id INTO v_wallet_id FROM wallets WHERE user_id = p_winner_id;

  UPDATE wallets SET balance_ore = balance_ore + v_match.purse_ore
  WHERE id = v_wallet_id
  RETURNING balance_ore INTO v_bal_after;

  INSERT INTO transactions
    (wallet_id, user_id, type, amount_ore, balance_after_ore, status, description, settled_at)
  VALUES
    (v_wallet_id, p_winner_id, 'match_prize', v_match.purse_ore, v_bal_after,
     'settled',
     'MATCH WIN · ' || upper(v_match.game) || ' · ' || v_match.stake_kr || ' KR',
     now());

  UPDATE matches SET
    status     = 'complete',
    winner_id  = p_winner_id,
    settled_at = now()
  WHERE id = p_match_id;
END;
$$;
