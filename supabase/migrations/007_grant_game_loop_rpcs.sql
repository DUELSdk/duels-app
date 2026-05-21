-- 007_grant_game_loop_rpcs.sql
-- Two fixes:
-- 1. Drop the 5-param rpc_join_queue accidentally re-created in migration 006.
--    The correct version is the 3-param one created in 004 (reads fees from stake_tiers).
-- 2. Grant EXECUTE on all game-loop RPCs to authenticated.
--    Migration 002 created these without explicit grants. PostgREST only exposes
--    functions that the calling role has EXECUTE on — without grants they are
--    invisible to the schema cache.

-- Clean up 006 mistake
DROP FUNCTION IF EXISTS rpc_join_queue(text, text, smallint, integer, integer);

-- Grant game-loop RPCs to authenticated (all require login — no anon access)
GRANT EXECUTE ON FUNCTION rpc_create_profile_and_wallet(text, text)   TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_join_queue(text, text, smallint)         TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_cancel_queue(uuid)                       TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_submit_sequence(uuid, jsonb)             TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_submit_sudden_death(uuid, text)          TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_resolve_card_duel(uuid, uuid, uuid)      TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_settle_match(uuid, uuid)                 TO authenticated;
