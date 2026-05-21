export type CycleCard = 'feint' | 'guard' | 'strike' | 'rush' | 'grab'
export type RoundOutcome = 'player1' | 'player2' | 'tie'

// Each card beats the next two in the cycle
export const BEATS: Record<CycleCard, CycleCard[]> = {
  feint:  ['guard', 'strike'],
  guard:  ['strike', 'rush'],
  strike: ['rush', 'grab'],
  rush:   ['grab', 'feint'],
  grab:   ['feint', 'guard'],
}

export const ALL_CARDS: CycleCard[] = ['feint', 'guard', 'strike', 'rush', 'grab']

export const INITIAL_HAND: CycleCard[] = [
  'feint', 'feint',
  'guard', 'guard',
  'strike', 'strike',
  'rush', 'rush',
  'grab', 'grab',
]

export function resolveCycleCard(a: CycleCard, b: CycleCard): RoundOutcome {
  if (a === b) return 'tie'
  return BEATS[a].includes(b) ? 'player1' : 'player2'
}

export function resolveBlock(seq1: CycleCard[], seq2: CycleCard[]): {
  results: RoundOutcome[]
  score1: number
  score2: number
} {
  const results: RoundOutcome[] = []
  let score1 = 0, score2 = 0
  for (let i = 0; i < seq1.length; i++) {
    const o = resolveCycleCard(seq1[i], seq2[i])
    results.push(o)
    if (o === 'player1') score1++
    else if (o === 'player2') score2++
  }
  return { results, score1, score2 }
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function randomCard(): CycleCard {
  return ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)]
}

// Generate a full random bot plan upfront
export function generateBotPlan(hand: CycleCard[]): {
  block1: CycleCard[]
  block2: CycleCard[]
  block3: CycleCard[]
  bench: CycleCard
} {
  const shuffled = shuffle(hand)
  const block1 = shuffled.slice(0, 3)
  const block2 = shuffled.slice(3, 6)
  const remaining = shuffled.slice(6) // 4 cards
  const benchIdx = Math.floor(Math.random() * 4)
  const bench = remaining[benchIdx]
  const block3 = remaining.filter((_, i) => i !== benchIdx)
  return { block1, block2, block3, bench }
}
