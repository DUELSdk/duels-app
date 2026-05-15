'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { validateSequence, resolveGame, resolveCard } from '@/lib/card-duel/engine'
import type { CardType, Game, SuddenDeathRound } from '@/types/game'

export async function createGame(): Promise<{ gameId: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('games')
    .insert({ player1_id: user.id, player2_id: user.id, status: 'sequencing' })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return { gameId: data.id }
}

export async function submitSequence(gameId: string, sequence: CardType[]): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  if (!validateSequence(sequence)) throw new Error('Invalid sequence: must be 3 rock, 3 scissors, 3 paper')

  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single<Game>()

  if (error || !game) throw new Error('Game not found')
  if (game.status !== 'sequencing') throw new Error('Game not in sequencing phase')

  const isPlayer1 = game.player1_id === user.id
  const isPlayer2 = game.player2_id === user.id
  if (!isPlayer1 && !isPlayer2) throw new Error('Not a player in this game')

  const alreadySubmitted = isPlayer1 ? game.player1_sequence : game.player2_sequence
  if (alreadySubmitted) throw new Error('Sequence already submitted')

  const sequenceField = isPlayer1 ? 'player1_sequence' : 'player2_sequence'
  const { error: updateError } = await supabase
    .from('games')
    .update({ [sequenceField]: sequence, updated_at: new Date().toISOString() })
    .eq('id', gameId)

  if (updateError) throw new Error(updateError.message)

  // Re-fetch to check if opponent also submitted — resolve if so
  const { data: updated } = await supabase
    .from('games')
    .select('player1_sequence, player2_sequence, player1_id, player2_id')
    .eq('id', gameId)
    .single<Pick<Game, 'player1_sequence' | 'player2_sequence' | 'player1_id' | 'player2_id'>>()

  if (!updated?.player1_sequence || !updated?.player2_sequence) return

  const resolution = resolveGame(updated.player1_sequence, updated.player2_sequence)

  if (resolution.winner === 'tie') {
    await supabase
      .from('games')
      .update({
        player1_score: resolution.player1_score,
        player2_score: resolution.player2_score,
        round_results: resolution.round_results,
        status: 'sudden_death',
        updated_at: new Date().toISOString(),
      })
      .eq('id', gameId)
  } else {
    const winner_id = resolution.winner === 'player1' ? updated.player1_id : updated.player2_id
    await supabase
      .from('games')
      .update({
        player1_score: resolution.player1_score,
        player2_score: resolution.player2_score,
        round_results: resolution.round_results,
        winner_id,
        status: 'complete',
        updated_at: new Date().toISOString(),
      })
      .eq('id', gameId)
  }
}

export async function submitSuddenDeathPick(gameId: string, pick: CardType): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validCards: CardType[] = ['rock', 'scissors', 'paper']
  if (!validCards.includes(pick)) throw new Error('Invalid pick')

  const { data: game } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single<Game>()

  if (!game) throw new Error('Game not found')
  if (game.status !== 'sudden_death') throw new Error('Game not in sudden death')

  const isPlayer1 = game.player1_id === user.id
  const isPlayer2 = game.player2_id === user.id
  if (!isPlayer1 && !isPlayer2) throw new Error('Not a player in this game')

  // Get the latest unresolved SD round
  const { data: sdRounds } = await supabase
    .from('sudden_death_rounds')
    .select('*')
    .eq('game_id', gameId)
    .is('outcome', null)
    .order('round_number', { ascending: false })
    .limit(1)

  let currentRound: SuddenDeathRound

  if (!sdRounds || sdRounds.length === 0) {
    const { data: newRound, error } = await supabase
      .from('sudden_death_rounds')
      .insert({ game_id: gameId, round_number: 1 })
      .select()
      .single<SuddenDeathRound>()
    if (error || !newRound) throw new Error('Failed to create sudden death round')
    currentRound = newRound
  } else {
    currentRound = sdRounds[0] as SuddenDeathRound
  }

  const alreadyPicked = isPlayer1 ? currentRound.player1_pick : currentRound.player2_pick
  if (alreadyPicked) throw new Error('Pick already submitted for this round')

  const pickField = isPlayer1 ? 'player1_pick' : 'player2_pick'
  await supabase
    .from('sudden_death_rounds')
    .update({ [pickField]: pick })
    .eq('id', currentRound.id)

  // Re-fetch to check if both picks are in
  const { data: updatedRound } = await supabase
    .from('sudden_death_rounds')
    .select('*')
    .eq('id', currentRound.id)
    .single<SuddenDeathRound>()

  if (!updatedRound?.player1_pick || !updatedRound?.player2_pick) return

  const outcome = resolveCard(updatedRound.player1_pick, updatedRound.player2_pick)
  await supabase
    .from('sudden_death_rounds')
    .update({ outcome })
    .eq('id', currentRound.id)

  if (outcome !== 'tie') {
    const winner_id = outcome === 'player1' ? game.player1_id : game.player2_id
    await supabase
      .from('games')
      .update({ winner_id, status: 'complete', updated_at: new Date().toISOString() })
      .eq('id', gameId)
  } else {
    // Another SD round needed
    await supabase
      .from('sudden_death_rounds')
      .insert({ game_id: gameId, round_number: currentRound.round_number + 1 })
  }
}
