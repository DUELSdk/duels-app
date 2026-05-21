export type CardType = 'rock' | 'scissors' | 'paper'
export type GameStatus = 'waiting' | 'sequencing' | 'resolving' | 'sudden_death' | 'complete'
export type RoundOutcome = 'player1' | 'player2' | 'tie'

export interface Game {
  id: string
  status: GameStatus
  player1_id: string
  player2_id: string
  player1_sequence: CardType[] | null
  player2_sequence: CardType[] | null
  player1_score: number
  player2_score: number
  round_results: RoundOutcome[] | null
  winner_id: string | null
  created_at: string
  updated_at: string
}

export interface SuddenDeathRound {
  id: string
  game_id: string
  round_number: number
  player1_pick: CardType | null
  player2_pick: CardType | null
  outcome: RoundOutcome | null
  created_at: string
}
