import type { Game, SuddenDeathRound } from '@/types/game'
import { GameClient } from './GameClient'

// Placeholder until Supabase + auth are wired up
const MOCK_GAME: Game = {
  id: 'demo-game-0001',
  status: 'sequencing',
  player1_id: 'mock-user',
  player2_id: 'opponent-user',
  player1_sequence: null,
  player2_sequence: null,
  player1_score: 0,
  player2_score: 0,
  round_results: null,
  winner_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const MOCK_USER_ID = 'mock-user'

export default async function GamePage(props: PageProps<'/game/[id]'>) {
  const { id } = await props.params

  // TODO: replace with real Supabase fetch + auth
  const game: Game = { ...MOCK_GAME, id }
  const myId = MOCK_USER_ID
  const suddenDeathRound: SuddenDeathRound | null = null

  return <GameClient game={game} myId={myId} suddenDeathRound={suddenDeathRound} />
}
