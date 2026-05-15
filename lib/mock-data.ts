// Placeholder data — replace each function with a real Supabase query when ready.
// Shape of each type is the contract. Data source changes, components stay the same.

// ── Match record (contract for Supabase matches table) ───────────────────────
// Production: every settled match writes one record. Aggregation (win rates,
// tendencies) is computed from this table — do not derive stats elsewhere.
//
// moves is game-specific. Spec per game BEFORE building aggregation:
//   card-duel  → sequence of 9 cards:       ['R','P','S','R','S','P','P','R','S']
//   cycleduel  → 3 blocks of 3 cards:       [['Feint','Guard','Strike'], ...]
//   dropduel   → sequence of column picks:  [3, 2, 4, 1, 3, ...]
//
// Data retention: keep all match data while account is active.
// On account deletion: anonymise player references, aggregate stats survive.

export type GameType = 'card-duel' | 'cycleduel' | 'dropduel'

export type Match = {
  id: string
  game: GameType
  player1: string        // handle
  player2: string        // handle
  winner: string | null  // handle — null = split/draw
  moves: {
    player1: unknown     // game-specific — see comment above
    player2: unknown     // game-specific — see comment above
  }
  entryKrEach: number
  purseKr: number
  createdAt: string      // ISO timestamp
}

// ── Rivals (Nemesis system) ───────────────────────────────────────────────────
// Production: query match_history grouped by opponent_id, compute streaks server-side.
// Capture a rivalSnapshot at match start — stored in the match record so result screen
// reflects state BEFORE the match, not after (H2H updates on settlement, not display).

export type Rival = {
  handle: string
  played: number
  wins: number        // your wins vs this opponent
  losses: number      // your losses vs this opponent
  currentStreak: number  // positive = win streak, negative = loss streak (vs this opponent only)
  revengeActive: boolean // true when currentStreak <= -3
}

export function getRivals(): Rival[] {
  return [
    { handle: 'BOT',      played: 8,  wins: 3, losses: 5, currentStreak: -3, revengeActive: true  },
    { handle: 'GRIMREEF', played: 12, wins: 3, losses: 9, currentStreak: -4, revengeActive: true  },
    { handle: 'K_8821',   played: 8,  wins: 5, losses: 3, currentStreak:  2, revengeActive: false },
    { handle: 'VIPER99',  played: 6,  wins: 4, losses: 2, currentStreak:  1, revengeActive: false },
    { handle: 'SANDMAN',  played: 5,  wins: 2, losses: 3, currentStreak: -1, revengeActive: false },
  ]
}

export function getH2HRecord(handle: string): Rival | null {
  return getRivals().find(r => r.handle === handle) ?? null
}

// ── Current user ─────────────────────────────────────────────────────────────

export type RecentMatch = {
  id: string
  game: string
  opponent: string
  result: 'WIN' | 'LOSS' | 'SPLIT'
  earnedKr: number
  roomKr: number
  ago: string
}

export type UserProfile = {
  handle: string
  initials: string
  memberSince: string
  balance: number
  rank: number
  wins: number
  losses: number
  netKr: number
  gameStats: { game: string; slug: string; played: number; won: number }[]
  recentMatches: RecentMatch[]
}

export function getCurrentUser(): UserProfile {
  return {
    handle: 'SANDSTORM',
    initials: 'SS',
    memberSince: 'APRIL 2026',
    balance: 2450,
    rank: 42,
    wins: 14,
    losses: 9,
    netKr: 1840,
    gameStats: [
      { game: 'CARD DUEL', slug: 'card-duel', played: 15, won: 10 },
      { game: 'CYCLEDUEL', slug: 'cycleduel', played: 5,  won: 3  },
      { game: 'DROPDUEL',  slug: 'dropduel',  played: 3,  won: 1  },
    ],
    recentMatches: [
      { id: 'mx1', game: 'CARD DUEL',  opponent: 'BOT',  result: 'WIN',   earnedKr: +40,  roomKr: 50,  ago: 'TODAY 21:14' },
      { id: 'mx2', game: 'CARD DUEL',  opponent: 'BOT',  result: 'LOSS',  earnedKr: -50,  roomKr: 50,  ago: 'TODAY 20:41' },
      { id: 'mx3', game: 'CYCLEDUEL',  opponent: 'BOT',  result: 'WIN',   earnedKr: +20,  roomKr: 25,  ago: 'TODAY 19:58' },
      { id: 'mx4', game: 'CARD DUEL',  opponent: 'BOT',  result: 'WIN',   earnedKr: +80,  roomKr: 100, ago: 'YESTERDAY'   },
      { id: 'mx5', game: 'CARD DUEL',  opponent: 'BOT',  result: 'LOSS',  earnedKr: -100, roomKr: 100, ago: 'YESTERDAY'   },
      { id: 'mx6', game: 'DROPDUEL',   opponent: 'BOT',  result: 'SPLIT', earnedKr: 0,    roomKr: 50,  ago: 'YESTERDAY'   },
      { id: 'mx7', game: 'CARD DUEL',  opponent: 'BOT',  result: 'WIN',   earnedKr: +22,  roomKr: 25,  ago: '2 DAYS AGO'  },
      { id: 'mx8', game: 'CYCLEDUEL',  opponent: 'BOT',  result: 'WIN',   earnedKr: +8,   roomKr: 10,  ago: '2 DAYS AGO'  },
    ],
  }
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export type LeaderEntry = {
  rank: number
  handle: string
  wins: number
  losses: number
  netKr: number
  streak: number
  topGame: string
}

export function getLeaderboard(): { today: LeaderEntry[]; week: LeaderEntry[]; allTime: LeaderEntry[] } {
  return { today: [], week: [], allTime: [] }
}

// ── Tournament detail ─────────────────────────────────────────────────────────

export type TournamentDetail = {
  id: string
  name: string
  game: string
  fmt: string
  fee: number
  pool: number
  seatsFilled: number
  seatsTotal: number
  start: string
  status: 'OPEN' | 'LIVE' | 'DONE'
  description: string
  seatedHandles: string[]
}

export function getTournamentDetail(id: string): TournamentDetail | null {
  const tournaments: Record<string, TournamentDetail> = {
    'TNS50': {
      id: 'TNS50', name: 'THURSDAY NIGHT SEALED 50',
      game: 'CARD DUEL', fmt: 'SINGLE ELIM · 64 SEATS',
      fee: 50, pool: 2720, seatsFilled: 22, seatsTotal: 64,
      start: '1H 14M', status: 'OPEN',
      description: 'The marquee fight of the week. 50 KR entry, 64-seat single-elim bracket, last one standing takes 2.720 KR after rake. Bracket freezes at 20:00.',
      seatedHandles: ['k_8821','NovaStrike','sandman','reef','grimreef','laserhawk','siren','iso_9001','jeppe_92','mads_kbh','ghost_n','piloto','anon#3','anon#7','viper99','calico','oslomint','blackbird','sigil','rune-kbh','axiom','torpid_42'],
    },
    'QF10': {
      id: 'QF10', name: 'QUICKFIRE 10',
      game: 'CARD DUEL', fmt: 'SINGLE ELIM · 32 SEATS',
      fee: 10, pool: 272, seatsFilled: 32, seatsTotal: 32,
      start: 'LIVE NOW', status: 'LIVE',
      description: 'Fast and cheap. 10 KR entry, 32 seats, already live. Join as spectator or queue for the next one.',
      seatedHandles: ['k_8821','NovaStrike','sandman','reef','grimreef','laserhawk','siren','iso_9001','jeppe_92','mads_kbh','ghost_n','piloto','anon#3','anon#7','viper99','calico','oslomint','blackbird','sigil','rune-kbh','axiom','torpid_42','dusk99','ironveil','pulse99','coastline','redhex','zael','sandstorm','hexlock','mirror7','coldfront'],
    },
    'COP100': {
      id: 'COP100', name: 'CYCLE OPEN 100',
      game: 'CYCLEDUEL', fmt: 'DOUBLE ELIM · 64 SEATS',
      fee: 100, pool: 5440, seatsFilled: 8, seatsTotal: 64,
      start: '4H', status: 'OPEN',
      description: 'Double elimination. 64 seats, CycleDuel only. One loss keeps you in — two and you\'re out.',
      seatedHandles: ['k_8821','grimreef','laserhawk','siren','iso_9001','jeppe_92','mads_kbh','ghost_n'],
    },
    'NW25': {
      id: 'NW25', name: 'NIGHT WINDOW 25',
      game: 'CARD DUEL', fmt: 'SINGLE ELIM · 16 SEATS',
      fee: 25, pool: 340, seatsFilled: 4, seatsTotal: 16,
      start: '6H', status: 'OPEN',
      description: 'Late night bracket. 16 seats, 25 KR entry. Starts at 23:30 — for the night owls.',
      seatedHandles: ['reef','piloto','anon#7','torpid_42'],
    },
    'DB25': {
      id: 'DB25', name: 'DROP BLOCK 25',
      game: 'DROPDUEL', fmt: 'SINGLE ELIM · 32 SEATS',
      fee: 25, pool: 680, seatsFilled: 4, seatsTotal: 32,
      start: '24H', status: 'OPEN',
      description: 'Tomorrow\'s DropDuel bracket. 32 seats, single elimination. Block placement sealed at bracket start.',
      seatedHandles: ['k_8821','sandman','viper99','calico'],
    },
    'CD500': {
      id: 'CD500', name: 'CARD DUEL 500',
      game: 'CARD DUEL', fmt: 'INVITE · 16 SEATS',
      fee: 500, pool: 6800, seatsFilled: 11, seatsTotal: 16,
      start: '25H', status: 'OPEN',
      description: 'Invite-only. 16 seats. Request access — entry confirmed by organiser. 500 KR, winner takes 6.800 KR.',
      seatedHandles: ['k_8821','NovaStrike','grimreef','laserhawk','reef','piloto','ironveil','pulse99','coastline','redhex','zael'],
    },
    'WK500': {
      id: 'WK500', name: 'WEEKLY 500',
      game: 'CARD DUEL', fmt: 'DOUBLE ELIM · 64 SEATS',
      fee: 500, pool: 27200, seatsFilled: 14, seatsTotal: 64,
      start: 'SAT 20:00', status: 'OPEN',
      description: 'Saturday\'s marquee fight. 64 seats, double elimination, 500 KR entry. The biggest pot of the week — 27.200 KR.',
      seatedHandles: ['k_8821','NovaStrike','grimreef','laserhawk','reef','piloto','ironveil','pulse99','coastline','redhex','zael','sandstorm','hexlock','mirror7'],
    },
  }
  return tournaments[id] ?? null
}

export type StatsStrip = {
  biggestPotWho: string
  biggestPotAmount: string
  settledToday: number
  totalPaidToday: string
}

export type LiveMatch = {
  id: string
  game: string
  roomKr: number
  slot: number
  totalSlots: number
  watching: number
  playerLeft: { handle: string; moves: ('R' | 'P' | 'S' | null)[] }
  playerRight: { handle: string; moves: ('R' | 'P' | 'S' | null)[] }
  scoreLeft: number
  scoreRight: number
  status: string
}

export type BoardEntry = {
  rank: string
  who: string
  what: string
  value: string
}

export type Board = {
  biggestPots: BoardEntry[]
  longestStreaks: BoardEntry[]
  biggestDays: BoardEntry[]
}

export type Fixture = {
  time: string
  label: string
  game: string
  who: string
  roomKr: number
  status: 'OPEN' | 'WAITLIST' | 'FULL'
}

export type NewsItem = {
  ago: string
  category: string
  headline: string
  body: string
}

export type GameRow = {
  num: string
  slug: string
  name: string
  desc: string
  liveCount: number
  roomRange: string
}

export type TickerItem = {
  game: string
  text: string
}

// ── Mock implementations ──────────────────────────────────────────────────────

export function getStatsStrip(): StatsStrip {
  return {
    biggestPotWho: '—',
    biggestPotAmount: '—',
    settledToday: 0,
    totalPaidToday: '0',
  }
}

export function getLiveMatch(): LiveMatch {
  return {
    id: '4F2A',
    game: 'CARD DUEL',
    roomKr: 250,
    slot: 6,
    totalSlots: 9,
    watching: 234,
    playerLeft:  { handle: 'PLAYER L', moves: ['P', 'R', 'S', null, null, null, null, null, null] },
    playerRight: { handle: 'PLAYER R', moves: ['R', 'S', 'P', null, null, null, null, null, null] },
    scoreLeft: 3,
    scoreRight: 2,
    status: 'Locking slot 6',
  }
}

export function getBoard(): Board {
  return {
    biggestPots:    [],
    longestStreaks: [],
    biggestDays:    [],
  }
}

export function getFixtures(): Fixture[] {
  return []
}

export function getNews(): NewsItem[] {
  return [
    { ago: '12 MIN', category: 'MATCH REPORT',   headline: '5.420 KR pot settled in Card Duel',   body: '250 KR room. Eight-slot sweep — seven of nine slots won clean. Largest pot of the day so far. Challenger had the edge in block two but couldn\'t close out.' },
    { ago: '38 MIN', category: 'STREAK WATCH',   headline: '4-match winning streak in Card Duel',  body: 'One player has claimed three rooms in two hours. Now sitting in the 250 KR room waiting on a challenger.' },
    { ago: '1 HR',   category: 'FLOOR REPORT',   headline: 'CycleDuel queue at all-time high',     body: '127 simultaneous matches — first time the game has crossed 100. Old record set last Saturday.' },
    { ago: '2 HR',   category: 'ROOM UPDATE',    headline: 'DropDuel beta opens 100 KR room',      body: 'Stake range was 25–50 since launch. 100 KR room unlocked at 18:00. First match settled in 9 minutes.' },
  ]
}

export function getGames(): GameRow[] {
  return [
    { num: '01', slug: 'card-duel',  name: 'CARD DUEL',  desc: 'Sealed sequential RPS. 9 moves, locked blind.',      liveCount: 0, roomRange: '10 – 500 KR' },
    { num: '02', slug: 'cycleduel',  name: 'CYCLEDUEL',  desc: 'Five-type cycle with peek mechanic.',                liveCount: 0, roomRange: '10 – 500 KR' },
    { num: '03', slug: 'dropduel',   name: 'DROPDUEL',   desc: 'Connect 4 with placed blocks. Pure positional.',     liveCount: 0, roomRange: '25 – 500 KR' },
  ]
}

export function getTicker(): TickerItem[] {
  return [
    { game: 'CARD',  text: "Slot 7 locked · 50 KR room" },
    { game: 'CARD',  text: "Match #A441 · live" },
    { game: 'DROP',  text: "Block placed · 100 KR room" },
    { game: 'CYCLE', text: "250 KR room settled" },
    { game: 'CARD',  text: "Streak 7 · 100 KR room" },
    { game: 'CARD',  text: "Match #B882 · live" },
    { game: 'DROP',  text: "100 KR room · 4-in-a-row" },
  ]
}

export function getLiveMatchCount() {
  return { live: 47, queued: 12, settledToday: 1247 }
}

// ── Library ───────────────────────────────────────────────────────────────────

export type LibraryCategory = {
  label: string
  games: LibraryGame[]
}

export type LibraryGame = {
  num: string
  slug: string
  name: string
  desc: string
  format: string
  liveCount: number
  todayCount: number
}

export function getLibraryCategories(): LibraryCategory[] {
  return [
    {
      label: 'CLASSIC',
      games: [
        { num: '01', slug: 'card-duel',  name: 'CARD DUEL',  desc: 'Sealed sequential rock paper scissors. 9 moves, locked blind.', format: '1V1 · 60s',  liveCount: 12, todayCount: 247 },
        { num: '02', slug: 'cycleduel',  name: 'CYCLEDUEL',  desc: 'Five-type cycle with peek mechanic.',                           format: '1V1 · 90s',  liveCount: 8,  todayCount: 127 },
      ],
    },
    {
      label: 'BLOCK',
      games: [
        { num: '03', slug: 'dropduel',   name: 'DROPDUEL',   desc: 'Connect 4 with placed blocks. Pure positional.',               format: '1V1 · 120s', liveCount: 5,  todayCount: 61  },
      ],
    },
  ]
}

export function getLibraryThemes() {
  return {
    engine: 'CARD DUEL',
    themes: ['Blade Duel', 'Spell Clash', 'Street Fight', 'War Room'],
  }
}

// ── Game Detail ───────────────────────────────────────────────────────────────

export type StakeRoom = {
  kr: number
  liveCount: number
}

export type HowItPlaysStep = {
  step: string
  title: string
  desc: string
}

export type GameDetail = {
  num: string
  slug: string
  name: string
  category: string
  desc: string
  format: string
  waiters: number
  stakeRooms: StakeRoom[]
  howItPlays: HowItPlaysStep[]
  themes: string[]
}

export function getGameDetail(slug: string): GameDetail | null {
  const games: Record<string, GameDetail> = {
    'card-duel': {
      num: '01',
      slug: 'card-duel',
      name: 'CARD DUEL',
      category: 'CLASSIC',
      desc: 'Sealed sequential rock paper scissors. Each player gets nine moves — three rocks, three papers, three scissors. Lock your sequence blind. Reveal slot by slot.',
      format: '1V1 · 60s',
      waiters: 0,
      stakeRooms: [
        { kr: 10,  liveCount: 0 },
        { kr: 25,  liveCount: 0 },
        { kr: 50,  liveCount: 0 },
        { kr: 100, liveCount: 0 },
        { kr: 250, liveCount: 0 },
        { kr: 500, liveCount: 0 },
      ],
      howItPlays: [
        { step: '01', title: 'BUILD HAND',     desc: 'Three rocks, three papers, three scissors. Always the same. No surprises.' },
        { step: '02', title: 'LOCK SEQUENCE',  desc: 'Arrange your nine moves blind. Your opponent does the same. No peeking.' },
        { step: '03', title: 'REVEAL · WIN',   desc: 'Slots resolve one by one. Most slot wins takes the pot. Tie → sudden death.' },
      ],
      themes: ['Blade Duel', 'Spell Clash', 'Street Fight', 'War Room'],
    },
    'cycleduel': {
      num: '02',
      slug: 'cycleduel',
      name: 'CYCLEDUEL',
      category: 'CLASSIC',
      desc: 'Five-type cycle card game with information reveals. Each block you see your opponent\'s first card. Lock your 3-card sequence. Auto-resolve.',
      format: '1V1 · 90s',
      waiters: 0,
      stakeRooms: [
        { kr: 10,  liveCount: 0 },
        { kr: 25,  liveCount: 0 },
        { kr: 50,  liveCount: 0 },
        { kr: 100, liveCount: 0 },
        { kr: 250, liveCount: 0 },
        { kr: 500, liveCount: 0 },
      ],
      howItPlays: [
        { step: '01', title: 'PEEK',          desc: 'At the start of each block, both players reveal their first card to each other.' },
        { step: '02', title: 'LOCK BLOCK',    desc: 'Lock your 3-card sequence for this block. Your opponent does the same.' },
        { step: '03', title: 'REVEAL · WIN',  desc: 'Three slots resolve. Repeat for 3 blocks. Most points wins.' },
      ],
      themes: ['Faction War', 'Cyber Clash', 'Blind Duel', 'ElementDuel'],
    },
    'dropduel': {
      num: '03',
      slug: 'dropduel',
      name: 'DROPDUEL',
      category: 'BLOCK',
      desc: 'Two-phase Connect Four. Place a hidden block simultaneously. Then play Connect Four on the modified board. Under 60 seconds.',
      format: '1V1 · 120s',
      waiters: 0,
      stakeRooms: [
        { kr: 25,  liveCount: 0  },
        { kr: 50,  liveCount: 0  },
        { kr: 100, liveCount: 0  },
        { kr: 250, liveCount: 0  },
        { kr: 500, liveCount: 0  },
      ],
      howItPlays: [
        { step: '01', title: 'PLACE BLOCK',   desc: 'Both players secretly place 1 blocked cell simultaneously. Revealed at game start.' },
        { step: '02', title: 'PLAY',          desc: 'Standard Connect Four on the modified 6×7 board. Per-move time limit.' },
        { step: '03', title: 'FOUR IN A ROW', desc: 'First to connect four wins the pot. Board fills with no winner = split.' },
      ],
      themes: ['Trench War', 'Virus Spread', 'Crystal Cave'],
    },
  }
  return games[slug] ?? null
}
