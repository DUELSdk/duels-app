import type { CardType, RoundOutcome } from '@/types/game'

const BEATS: Record<CardType, CardType> = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock',
}

export function validateSequence(sequence: CardType[]): boolean {
  if (sequence.length !== 9) return false
  const counts = { rock: 0, scissors: 0, paper: 0 }
  for (const card of sequence) {
    if (!(card in counts)) return false
    counts[card]++
  }
  return counts.rock === 3 && counts.scissors === 3 && counts.paper === 3
}

export function resolveCard(a: CardType, b: CardType): RoundOutcome {
  if (a === b) return 'tie'
  return BEATS[a] === b ? 'player1' : 'player2'
}

export interface GameResolution {
  round_results: RoundOutcome[]
  player1_score: number
  player2_score: number
  winner: 'player1' | 'player2' | 'tie'
}

export function resolveGame(seq1: CardType[], seq2: CardType[]): GameResolution {
  const round_results: RoundOutcome[] = []
  let player1_score = 0
  let player2_score = 0

  for (let i = 0; i < 9; i++) {
    const outcome = resolveCard(seq1[i], seq2[i])
    round_results.push(outcome)
    if (outcome === 'player1') player1_score++
    else if (outcome === 'player2') player2_score++
  }

  let winner: 'player1' | 'player2' | 'tie'
  if (player1_score > player2_score) winner = 'player1'
  else if (player2_score > player1_score) winner = 'player2'
  else winner = 'tie'

  return { round_results, player1_score, player2_score, winner }
}
