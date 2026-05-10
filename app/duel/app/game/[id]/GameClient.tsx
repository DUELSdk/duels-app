'use client'

import { useState } from 'react'
import type { Game, SuddenDeathRound } from '@/types/game'
import { SequenceBuilder } from '@/components/card-duel/SequenceBuilder'
import { RoundResults } from '@/components/card-duel/RoundResults'
import { SuddenDeathPicker } from '@/components/card-duel/SuddenDeathPicker'
import { HiddenCard } from '@/components/card-duel/CardPiece'

interface GameClientProps {
  game: Game
  myId: string
  suddenDeathRound?: SuddenDeathRound | null
}

type LocalPhase = Game['status'] | 'waiting_for_opponent' | 'sd_waiting'

export function GameClient({ game, myId, suddenDeathRound }: GameClientProps) {
  const iAmPlayer1 = game.player1_id === myId
  const mySequence = iAmPlayer1 ? game.player1_sequence : game.player2_sequence
  const hasSubmitted = mySequence !== null

  const initialPhase: LocalPhase =
    game.status === 'sequencing' && hasSubmitted ? 'waiting_for_opponent'
    : game.status === 'sudden_death' && suddenDeathRound && (iAmPlayer1 ? suddenDeathRound.player1_pick : suddenDeathRound.player2_pick) !== null ? 'sd_waiting'
    : game.status

  const [phase, setPhase] = useState<LocalPhase>(initialPhase)

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="font-bold tracking-tight text-lg">Card Duel</span>
        <span className="text-white/40 text-sm font-mono">{game.id.slice(0, 8)}</span>
      </header>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-8 gap-10">

        {/* Opponent row */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Opponent</p>
          <div className="flex gap-2 flex-wrap">
            {game.status === 'complete' || game.status === 'sudden_death'
              ? (iAmPlayer1 ? game.player2_sequence : game.player1_sequence)?.map((card, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-white/20">{i + 1}</span>
                    <div className="w-14 h-[72px] flex items-center justify-center rounded-lg border-2 border-white/10 bg-white/5 text-lg">
                      {card === 'rock' ? '🪨' : card === 'scissors' ? '✂️' : '📄'}
                    </div>
                  </div>
                ))
              : Array(9).fill(null).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-white/20">{i + 1}</span>
                    <HiddenCard />
                  </div>
                ))
            }
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {phase === 'sequencing' && (
            <SequenceBuilder gameId={game.id} onLocked={() => setPhase('waiting_for_opponent')} />
          )}

          {phase === 'waiting_for_opponent' && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-white/50">Waiting for opponent to lock in…</p>
            </div>
          )}

          {(phase === 'sudden_death' || phase === 'sd_waiting') && (
            phase === 'sd_waiting'
              ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <p className="text-amber-400 text-sm uppercase tracking-widest font-bold">Sudden Death</p>
                  <p className="text-white/50">Waiting for opponent…</p>
                </div>
              ) : (
                <SuddenDeathPicker
                  gameId={game.id}
                  roundNumber={suddenDeathRound?.round_number ?? 1}
                  onPicked={() => setPhase('sd_waiting')}
                />
              )
          )}

          {phase === 'complete' && game.round_results && mySequence && (
            <RoundResults
              mySequence={mySequence}
              opponentSequence={(iAmPlayer1 ? game.player2_sequence : game.player1_sequence)!}
              results={game.round_results}
              myScore={iAmPlayer1 ? game.player1_score : game.player2_score}
              opponentScore={iAmPlayer1 ? game.player2_score : game.player1_score}
              iAmPlayer1={iAmPlayer1}
              winnerId={game.winner_id}
              myId={myId}
            />
          )}
        </div>

        {/* Score footer (visible after sequencing) */}
        {(game.status === 'sudden_death' || game.status === 'complete') && (
          <div className="border-t border-white/10 pt-4 flex justify-center gap-12 text-center">
            <div>
              <p className="text-2xl font-bold">{iAmPlayer1 ? game.player1_score : game.player2_score}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">You</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{iAmPlayer1 ? game.player2_score : game.player1_score}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Opponent</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
