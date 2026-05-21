-- 010_delete_anonymous_users.sql
-- Remove all anonymous (guest) user data.
-- Explicit delete order handles FK chains: queue → game_state → matches → transactions → wallets → profiles → auth.users

DO $$
DECLARE
  v_anon_ids uuid[];
BEGIN
  SELECT ARRAY(
    SELECT id FROM auth.users WHERE is_anonymous = true
  ) INTO v_anon_ids;

  IF array_length(v_anon_ids, 1) IS NULL THEN
    RAISE NOTICE 'No anonymous users found.';
    RETURN;
  END IF;

  RAISE NOTICE 'Deleting % anonymous user(s)...', array_length(v_anon_ids, 1);

  DELETE FROM queue WHERE user_id = ANY(v_anon_ids);

  DELETE FROM game_state
  WHERE match_id IN (
    SELECT id FROM matches
    WHERE player1_id = ANY(v_anon_ids) OR player2_id = ANY(v_anon_ids)
  );

  DELETE FROM matches
  WHERE player1_id = ANY(v_anon_ids) OR player2_id = ANY(v_anon_ids);

  DELETE FROM transactions WHERE user_id = ANY(v_anon_ids);

  DELETE FROM wallets WHERE user_id = ANY(v_anon_ids);

  DELETE FROM profiles WHERE id = ANY(v_anon_ids);

  DELETE FROM auth.users WHERE id = ANY(v_anon_ids);

  RAISE NOTICE 'Done.';
END $$;
