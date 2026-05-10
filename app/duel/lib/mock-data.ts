// Placeholder data — replace each function with a real Supabase query when ready.
// Shape of each type is the contract. Data source changes, components stay the same.

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

export type BracketMatch = {
  p1: string
  p2: string
  winner?: string
}

export type TournamentDetail = {
  id: string
  time: string
  label: string
  game: string
  format: string
  seats: number
  filled: number
  entryKr: number
  purseKr: number
  status: 'OPEN' | 'LIVE' | 'DONE'
  prizeBreakdown: { place: string; kr: number }[]
  bracket: { round: string; matches: BracketMatch[] }[]
}

export function getTournamentDetail(id: string): TournamentDetail | null {
  const tournaments: Record<string, TournamentDetail> = {
    't1': {
      id: 't1', time: '20:00', label: "TONIGHT'S MARQUEE",
      game: 'CARD DUEL', format: 'Single elim · 16p',
      seats: 16, filled: 14, entryKr: 250, purseKr: 3600,
      status: 'OPEN',
      prizeBreakdown: [
        { place: '1ST',    kr: 2520 },
        { place: '2ND',    kr: 720  },
        { place: '3RD–4TH', kr: 180 },
      ],
      bracket: [],
    },
    't2': {
      id: 't2', time: '20:30', label: 'WEEKLY OPEN',
      game: 'CYCLEDUEL', format: 'Single elim · 128p',
      seats: 128, filled: 91, entryKr: 50, purseKr: 5440,
      status: 'OPEN',
      prizeBreakdown: [
        { place: '1ST',    kr: 3808 },
        { place: '2ND',    kr: 1088 },
        { place: '3RD–4TH', kr: 272  },
      ],
      bracket: [],
    },
    't3': {
      id: 't3', time: '21:00', label: 'KING OF THE BLOCK',
      game: 'DROPDUEL', format: 'Single elim · 32p',
      seats: 32, filled: 32, entryKr: 100, purseKr: 2720,
      status: 'LIVE',
      prizeBreakdown: [
        { place: '1ST',    kr: 1904 },
        { place: '2ND',    kr: 544  },
        { place: '3RD–4TH', kr: 136  },
      ],
      bracket: [
        { round: 'QF', matches: [
          { p1: 'PLAYER 1', p2: 'PLAYER 2', winner: 'PLAYER 1' },
          { p1: 'PLAYER 3', p2: 'PLAYER 4', winner: 'PLAYER 3' },
          { p1: 'PLAYER 5', p2: 'PLAYER 6', winner: 'PLAYER 5' },
          { p1: 'PLAYER 7', p2: 'PLAYER 8', winner: 'PLAYER 7' },
        ]},
        { round: 'SF', matches: [
          { p1: 'PLAYER 1', p2: 'PLAYER 3' },
          { p1: 'PLAYER 5', p2: 'PLAYER 7' },
        ]},
        { round: 'F', matches: [
          { p1: 'TBD', p2: 'TBD' },
        ]},
      ],
    },
    't4': {
      id: 't4', time: 'DONE', label: 'AFTERNOON CUP',
      game: 'CARD DUEL', format: 'Single elim · 16p',
      seats: 16, filled: 16, entryKr: 100, purseKr: 1360,
      status: 'DONE',
      prizeBreakdown: [
        { place: '1ST',    kr: 952  },
        { place: '2ND',    kr: 272  },
        { place: '3RD–4TH', kr: 68   },
      ],
      bracket: [
        { round: 'QF', matches: [
          { p1: 'PLAYER 1', p2: 'PLAYER 2', winner: 'PLAYER 1' },
          { p1: 'PLAYER 3', p2: 'PLAYER 4', winner: 'PLAYER 3' },
          { p1: 'PLAYER 5', p2: 'PLAYER 6', winner: 'PLAYER 5' },
          { p1: 'PLAYER 7', p2: 'PLAYER 8', winner: 'PLAYER 7' },
        ]},
        { round: 'SF', matches: [
          { p1: 'PLAYER 1', p2: 'PLAYER 3', winner: 'PLAYER 1' },
          { p1: 'PLAYER 5', p2: 'PLAYER 7', winner: 'PLAYER 7' },
        ]},
        { round: 'F', matches: [
          { p1: 'PLAYER 1', p2: 'PLAYER 7', winner: 'PLAYER 1' },
        ]},
      ],
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
  return { live: 0, queued: 0, settledToday: 0 }
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
        { num: '01', slug: 'card-duel',  name: 'CARD DUEL',  desc: 'Sealed sequential rock paper scissors. 9 moves, locked blind.', format: '1V1 · 60s',  liveCount: 0, todayCount: 0 },
        { num: '02', slug: 'cycleduel',  name: 'CYCLEDUEL',  desc: 'Five-type cycle with peek mechanic.',                           format: '1V1 · 90s',  liveCount: 0, todayCount: 0 },
      ],
    },
    {
      label: 'BLOCK',
      games: [
        { num: '03', slug: 'dropduel',   name: 'DROPDUEL',   desc: 'Connect 4 with placed blocks. Pure positional.',               format: '1V1 · 120s', liveCount: 0,  todayCount: 0  },
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
