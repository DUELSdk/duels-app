-- 004_security_hardening.sql
-- Security hardening pass. Run after 003_stats_rpcs.sql.
--
-- Fixes:
--   1. rpc_join_queue accepted caller-supplied purse/fee — prize pool inflation attack
--   2. rpc_submit_sudden_death leaked SD card via game_state Realtime before opponent submitted
--   3. Opponent transaction settled by most-recent-pending heuristic — wrong tx if multi-queued
--   4. profiles_read_public exposed mitid_verified to all authenticated users

-- ─── STAKE TIERS ─────────────────────────────────────────────────────────────
-- Canonical fee math. No client RLS — SECURITY DEFINER functions only.
-- Source of truth that rpc_join_queue now reads instead of trusting the caller.

CREATE TABLE stake_tiers (
  id            text PRIMARY KEY,
  stake_kr      smallint NOT NULL,
  entry_fee_ore integer NOT NULL,
  purse_ore     integer NOT NULL
);

-- Must match lib/tiers.ts exactly
INSERT INTO stake_tiers (id, stake_kr, entry_fee_ore, purse_ore) VALUES
  ('starter',   10,   100,  1800),
  ('standard',  25,   300,  4400),
  ('serious',   50,   500,  9000),
  ('high',     100,  1000, 18000),
  ('elite',    250,  2500, 45000),
  ('max',      500,  5000, 90000);

ALTER TABLE stake_tiers ENABLE ROW LEVEL SECURITY;
-- No SELECT policy → zero client access.

-- ─── QUEUE: TRANSACTION_ID ───────────────────────────────────────────────────
-- Links each queue entry to its specific pending transaction.
-- Allows correct settlement of exactly that transaction when a match fires —
-- prevents accidentally settling the wrong tx when a player is queued in multiple games.

ALTER TABLE queue ADD COLUMN transaction_id uuid REFERENCES transactions(id);

-- ─── SD PICKS — server-only ───────────────────────────────────────────────────
-- Holds sudden death picks until both players have submitted for the same round.
-- No client RLS — SECURITY DEFINER functions only.
-- Eliminates the window where one player's pick was briefly visible via Realtime
-- (the old code wrote sd_p1_card / sd_p2_card to game_state one at a time).

CREATE TABLE sd_picks (
  match_id     uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sd_round     smallint NOT NULL,
  card         text NOT NULL CHECK (card IN ('rock', 'scissors', 'paper')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (match_id, player_id, sd_round)
);

ALTER TABLE sd_picks ENABLE ROW LEVEL SECURITY;
-- No SELECT policy → zero client access.

-- ─── SAFE PUBLIC PROFILES VIEW ────────────────────────────────────────────────
-- Exposes only public-safe profile columns — excludes mitid_verified.
-- Code that needs opponent/public handles should query this view, not profiles.

CREATE VIEW public_profiles AS
  SELECT id, handle, initials, member_since FROM profiles;

GRANT SELECT ON public_profiles TO authenticated;
GRANT SELECT ON public_profiles TO anon;

-- ─── REWRITE rpc_join_queue ───────────────────────────────────────────────────
-- Breaking change: removes p_entry_fee_ore and p_purse_ore params.
-- Fee math is now looked up from stake_tiers — caller cannot inject values.
-- Also stores transaction_id in queue row for precise settlement.

DROP FUNCTION IF EXISTS rpc_join_queue(text, text, smallint, integer, integer);

CREATE OR REPLACE FUNCTION rpc_join_queue(
  p_game     text,
  p_tier_id  text,
  p_stake_kr smallint
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_tier            stake_tiers%ROWTYPE;
  v_stake_ore       bigint := p_stake_kr * 100;
  v_my_wallet_id    uuid;
  v_my_balance_ore  bigint;
  v_my_bal_after    bigint;
  v_opp_wallet_id   uuid;
  v_opp_queue_id    uuid;
  v_opp_id          uuid;
  v_opp_txn_id      uuid;
  v_queue_id        uuid;
  v_match_id        uuid;
  v_txn_id          uuid;
BEGIN
  -- Look up canonical fee math — rejects any tier/stake combo not in the table
  SELECT * INTO v_tier FROM stake_tiers WHERE id = p_tier_id AND stake_kr = p_stake_kr;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'INVALID_TIER'); END IF;

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
    -- No opponent — hold stake and join queue
    UPDATE wallets SET balance_ore = balance_ore - v_stake_ore
    WHERE id = v_my_wallet_id
    RETURNING balance_ore INTO v_my_bal_after;

    INSERT INTO transactions
      (wallet_id, user_id, type, amount_ore, balance_after_ore, status, description)
    VALUES
      (v_my_wallet_id, auth.uid(), 'match_entry', -v_stake_ore, v_my_bal_after,
       'pending', 'QUEUE ENTRY · ' || upper(p_game) || ' · ' || p_stake_kr || ' KR')
    RETURNING id INTO v_txn_id;

    INSERT INTO queue (user_id, game, tier_id, stake_kr, status, transaction_id)
    VALUES (auth.uid(), p_game, p_tier_id, p_stake_kr, 'waiting', v_txn_id)
    RETURNING id INTO v_queue_id;

    RETURN jsonb_build_object('status', 'waiting', 'queue_id', v_queue_id);
  END IF;

  -- Opponent found — create match
  SELECT id INTO v_opp_wallet_id FROM wallets WHERE user_id = v_opp_id;

  UPDATE wallets SET balance_ore = balance_ore - v_stake_ore
  WHERE id = v_my_wallet_id
  RETURNING balance_ore INTO v_my_bal_after;

  -- Settle the opponent's specific transaction (not just most-recent-pending)
  SELECT transaction_id INTO v_opp_txn_id FROM queue WHERE id = v_opp_queue_id;
  UPDATE transactions SET
    status      = 'settled',
    settled_at  = now(),
    description = 'MATCH ENTRY · ' || upper(p_game) || ' · ' || p_stake_kr || ' KR'
  WHERE id = v_opp_txn_id;

  INSERT INTO transactions
    (wallet_id, user_id, type, amount_ore, balance_after_ore, status, description, settled_at)
  VALUES
    (v_my_wallet_id, auth.uid(), 'match_entry', -v_stake_ore, v_my_bal_after,
     'settled', 'MATCH ENTRY · ' || upper(p_game) || ' · ' || p_stake_kr || ' KR', now())
  RETURNING id INTO v_txn_id;

  -- Use canonical purse from stake_tiers — not a caller-supplied value
  INSERT INTO matches
    (game, player1_id, player2_id, stake_kr, entry_fee_ore, purse_ore, status)
  VALUES
    (p_game, v_opp_id, auth.uid(), p_stake_kr, v_tier.entry_fee_ore, v_tier.purse_ore, 'active')
  RETURNING id INTO v_match_id;

  INSERT INTO game_state (match_id) VALUES (v_match_id);

  UPDATE queue SET status = 'matched', match_id = v_match_id WHERE id = v_opp_queue_id;

  INSERT INTO queue (user_id, game, tier_id, stake_kr, status, match_id, transaction_id)
  VALUES (auth.uid(), p_game, p_tier_id, p_stake_kr, 'matched', v_match_id, v_txn_id)
  RETURNING id INTO v_queue_id;

  RETURN jsonb_build_object('status', 'matched', 'match_id', v_match_id, 'queue_id', v_queue_id);
END;
$$;

-- ─── REWRITE rpc_submit_sudden_death ─────────────────────────────────────────
-- Picks stored in sd_picks (server-only, no Realtime) until both players submit.
-- game_state.sd_p1_card / sd_p2_card updated atomically only when both are in.
-- Before this fix: writing one card to game_state fired a Realtime event that
-- let the opponent read the pick before submitting their own.

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

  -- Store in server-only table — no Realtime, no client read access
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
    -- Opponent hasn't picked — game_state unchanged, no Realtime fired
    RETURN jsonb_build_object('status', 'waiting');
  END IF;

  -- Both submitted — assign p1/p2 cards and resolve
  IF v_am_p1 THEN
    v_p1_card := p_card; v_p2_card := v_opp_card;
  ELSE
    v_p1_card := v_opp_card; v_p2_card := p_card;
  END IF;

  IF v_p1_card = v_p2_card THEN
    -- Tie — advance round, reveal both cards simultaneously via one game_state update
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

    -- Reveal both cards simultaneously, then complete
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
