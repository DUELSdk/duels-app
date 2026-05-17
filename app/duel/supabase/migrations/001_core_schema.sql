-- 001_core_schema.sql
-- Core schema: profiles, matches, wallets, transactions.
-- Run once after Supabase project creation.
-- Requires Supabase Auth (auth.users) — built-in, no action needed.
-- All money stored in øre (1 kr = 100 øre) — no floating-point errors.

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Links auth.users UUID to display handle and verification state.
-- One row created on first sign-in via MitID.

CREATE TABLE profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle           text NOT NULL UNIQUE,         -- ALL CAPS display name
  initials         text NOT NULL,                -- 2-char, derived from handle
  mitid_verified   boolean NOT NULL DEFAULT false,
  member_since     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_read_own ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_read_public ON profiles
  FOR SELECT USING (true);  -- handles are public (leaderboard, match screens)

-- ─── MATCHES ─────────────────────────────────────────────────────────────────
-- One row per settled (or cancelled) match.
-- Aggregation (win rates, tendencies, H2H) is computed from this table.
-- moves: game-specific JSON — spec per game before building aggregation.
--   card-duel  → { player1: ['R','P','S',...], player2: [...] }  (9 cards each)
--   cycleduel  → { player1: [['Feint','Guard','Strike'], ...],   (3 blocks)
--                  player2: [...] }
--   dropduel   → { player1: { block: [col, col], moves: [col,...] },
--                  player2: { block: [col, col], moves: [col,...] } }

CREATE TABLE matches (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game           text NOT NULL CHECK (game IN ('card-duel', 'cycleduel', 'dropduel')),
  player1_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  player2_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  winner_id      uuid REFERENCES profiles(id),   -- null = split/draw
  stake_kr       smallint NOT NULL,              -- room size per player in kr
  entry_fee_ore  integer NOT NULL,               -- platform fee per player in øre
  purse_ore      integer NOT NULL,               -- total prize pot in øre
  moves          jsonb,
  status         text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'active', 'complete', 'cancelled', 'disputed')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  settled_at     timestamptz
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY matches_read_participant ON matches
  FOR SELECT USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE INDEX idx_matches_player1    ON matches(player1_id);
CREATE INDEX idx_matches_player2    ON matches(player2_id);
CREATE INDEX idx_matches_status     ON matches(status);
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);

-- ─── WALLETS ─────────────────────────────────────────────────────────────────
-- One wallet per user. MangoPay holds the actual money — this is our ledger.
-- mangopay_wallet_id null until MangoPay approval and integration complete.

CREATE TABLE wallets (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE RESTRICT,
  mangopay_wallet_id   text UNIQUE,
  balance_ore          bigint NOT NULL DEFAULT 0 CHECK (balance_ore >= 0),
  currency             text NOT NULL DEFAULT 'DKK',
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION touch_wallet_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wallet_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION touch_wallet_timestamp();

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY wallets_read_own ON wallets
  FOR SELECT USING (auth.uid() = user_id);

-- ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
-- One row per money event. Immutable audit trail.
-- amount_ore: positive = credit (money arrives), negative = debit (money leaves)
-- balance_after_ore: wallet snapshot at time of transaction — audit anchor.
--   Never recompute balance from transaction rows alone; use wallets.balance_ore.
--
-- type reference:
--   deposit          player tops up via MobilePay or Trustly
--   withdrawal       player cashes out to bank
--   match_entry      debit when entering a match (stake + entry fee combined)
--   match_prize      credit to winner on match settlement
--   match_split      credit both players on split (stake refunded, entry fee kept)
--   tournament_entry debit on tournament seat purchase
--   tournament_prize credit on tournament payout
--   refund           admin-issued correction

CREATE TABLE transactions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id           uuid NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
  user_id             uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  type                text NOT NULL CHECK (type IN (
                         'deposit', 'withdrawal',
                         'match_entry', 'match_prize', 'match_split',
                         'tournament_entry', 'tournament_prize',
                         'refund'
                       )),
  amount_ore          bigint NOT NULL,
  balance_after_ore   bigint NOT NULL,
  match_id            uuid REFERENCES matches(id),
  tournament_id       uuid,                        -- tournaments table: future migration
  mangopay_txn_id     text,                        -- PayIn / Transfer / PayOut ID from MangoPay
  mangopay_fee_ore    integer,                     -- MangoPay's cut on this transaction
  payment_method      text CHECK (payment_method IN ('mobilepay', 'trustly', null)),
  status              text NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'settled', 'failed', 'cancelled', 'refunded')),
  description         text,                        -- shown in wallet history UI
  created_at          timestamptz NOT NULL DEFAULT now(),
  settled_at          timestamptz
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY transactions_read_own ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_transactions_user_id    ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id  ON transactions(wallet_id);
CREATE INDEX idx_transactions_match_id   ON transactions(match_id) WHERE match_id IS NOT NULL;
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status     ON transactions(status);

-- ─── NOTES ───────────────────────────────────────────────────────────────────
-- INSERT/UPDATE on all tables handled by server-side functions only.
-- Direct client writes are blocked — anti-cheat + financial integrity.
-- Wire up Supabase server functions (or Next.js API routes) before MangoPay integration.
-- Responsible gaming limits (daily deposit cap etc.) enforced at server function level.
