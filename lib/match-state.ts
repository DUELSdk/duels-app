const KEY = 'duel_match_result'

export type MatchResult = {
  game: string
  tierId: string
  stakeKr: number
  entryFee: number
  winnerGets: number
  outcome: 'win' | 'loss' | 'draw'
  myScore: number
  oppScore: number
  opponent?: string     // opponent handle — always set in production, defaults to 'BOT' in mock
  mySeq?: string[]      // Card Duel: 9-card sequence | CycleDuel: 9-round moves (flat)
  oppSeq?: string[]     // Card Duel: bot's 9-card sequence | CycleDuel: bot's 9-round moves (flat)
  myMoves?: string[][]  // CycleDuel: per-block arrays [[b1r1,b1r2,b1r3],[b2...],[b3...]]
  oppMoves?: string[][] // CycleDuel: bot per-block arrays
  balanceApplied?: boolean
}

export function saveMatchResult(r: MatchResult): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(r))
  }
}

export function loadMatchResult(): MatchResult | null {
  if (typeof window === 'undefined') return null
  const v = localStorage.getItem(KEY)
  return v ? JSON.parse(v) : null
}

export function markBalanceApplied(): void {
  if (typeof window === 'undefined') return
  const v = localStorage.getItem(KEY)
  if (!v) return
  const r = JSON.parse(v)
  localStorage.setItem(KEY, JSON.stringify({ ...r, balanceApplied: true }))
}

export function clearMatchResult(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY)
  }
}
