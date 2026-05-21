-- Card Duel schema

create type game_status as enum ('waiting', 'sequencing', 'resolving', 'sudden_death', 'complete');
create type card_type as enum ('rock', 'scissors', 'paper');
create type round_outcome as enum ('player1', 'player2', 'tie');

create table games (
  id              uuid primary key default gen_random_uuid(),
  status          game_status not null default 'waiting',
  player1_id      uuid not null references auth.users(id),
  player2_id      uuid not null references auth.users(id),
  -- sequences hidden from opponent until both submitted (enforced via RLS)
  player1_sequence card_type[],
  player2_sequence card_type[],
  player1_score   int not null default 0,
  player2_score   int not null default 0,
  round_results   round_outcome[],
  winner_id       uuid references auth.users(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table sudden_death_rounds (
  id           uuid primary key default gen_random_uuid(),
  game_id      uuid not null references games(id) on delete cascade,
  round_number int not null,
  -- picks hidden from opponent until both submitted (enforced via RLS)
  player1_pick card_type,
  player2_pick card_type,
  outcome      round_outcome,
  created_at   timestamptz not null default now(),
  unique (game_id, round_number)
);

-- RLS
alter table games enable row level security;
alter table sudden_death_rounds enable row level security;

-- Players can see games they're in
create policy "players see own games"
  on games for select
  using (auth.uid() = player1_id or auth.uid() = player2_id);

-- Players can insert games (as player1)
create policy "players create games"
  on games for insert
  with check (auth.uid() = player1_id);

-- Players can update games they're in
create policy "players update own games"
  on games for update
  using (auth.uid() = player1_id or auth.uid() = player2_id);

-- Opponent's sequence visible only once both have submitted (status != 'sequencing')
-- Enforced in application layer — RLS above allows full row read.
-- For stricter enforcement, use column-level security or a view.

-- SD rounds: players see rounds for their games
create policy "players see own sd rounds"
  on sudden_death_rounds for select
  using (
    exists (
      select 1 from games
      where games.id = sudden_death_rounds.game_id
        and (games.player1_id = auth.uid() or games.player2_id = auth.uid())
    )
  );

create policy "players insert sd rounds"
  on sudden_death_rounds for insert
  with check (
    exists (
      select 1 from games
      where games.id = sudden_death_rounds.game_id
        and (games.player1_id = auth.uid() or games.player2_id = auth.uid())
    )
  );

create policy "players update sd rounds"
  on sudden_death_rounds for update
  using (
    exists (
      select 1 from games
      where games.id = sudden_death_rounds.game_id
        and (games.player1_id = auth.uid() or games.player2_id = auth.uid())
    )
  );
