'use client'

import { useState, useEffect, useRef } from 'react'
import { resolveGame, resolveCard } from '@/lib/card-duel/engine'
import type { CardType, RoundOutcome } from '@/types/game'
import { CardPiece, EmptySlot, HiddenCard } from './CardPiece'

const INITIAL_HAND: CardType[] = [
  'rock', 'rock', 'rock',
  'scissors', 'scissors', 'scissors',
  'paper', 'paper', 'paper',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomCard(): CardType {
  return (['rock', 'scissors', 'paper'] as CardType[])[Math.floor(Math.random() * 3)]
}

type Phase = 'sequencing' | 'resolved' | 'sudden_death' | 'complete'

interface SdRound {
  myPick: CardType
  botPick: CardType
  outcome: RoundOutcome
}

const OUTCOME_LABEL: Record<RoundOutcome, string> = { player1: 'W', player2: 'L', tie: 'T' }
const OUTCOME_COLOR: Record<RoundOutcome, string> = {
  player1: 'text-emerald-400',
  player2: 'text-red-400',
  tie: 'text-yellow-400',
}
const CARD_EMOJI: Record<CardType, string> = { rock: '🪨', scissors: '✂️', paper: '📄' }

export function DemoGame() {
  const botSequence = useRef<CardType[]>(shuffle(INITIAL_HAND))

  const [phase, setPhase] = useState<Phase>('sequencing')
  const [sequence, setSequence] = useState<(CardType | null)[]>(Array(9).fill(null))
  const [hand, setHand] = useState<CardType[]>(INITIAL_HAND)
  const [resolution, setResolution] = useState<ReturnType<typeof resolveGame> | null>(null)
  const [sdRounds, setSdRounds] = useState<SdRound[]>([])
  const [sdWaiting, setSdWaiting] = useState(false)
  const [winner, setWinner] = useState<'you' | 'bot' | null>(null)

  const filled = sequence.filter(Boolean).length

  function placeCard(card: CardType, handIndex: number) {
    const nextSlot = sequence.findIndex(s => s === null)
    if (nextSlot === -1) return
    setSequence(prev => { const n = [...prev]; n[nextSlot] = card; return n })
    setHand(prev => { const n = [...prev]; n.splice(handIndex, 1); return n })
  }

  function removeCard(slotIndex: number) {
    const card = sequence[slotIndex]
    if (!card) return
    setSequence(prev => { const n = [...prev]; n[slotIndex] = null; return n })
    setHand(prev => [...prev, card])
  }

  function lockIn() {
    if (filled < 9) return
    const mySeq = sequence as CardType[]
    const result = resolveGame(mySeq, botSequence.current)
    setResolution(result)

    if (result.winner === 'tie') {
      setPhase('resolved')
      setTimeout(() => setPhase('sudden_death'), 1200)
    } else {
      setWinner(result.winner === 'player1' ? 'you' : 'bot')
      setPhase('resolved')
      setTimeout(() => setPhase('complete'), 1200)
    }
  }

  function pickSuddenDeath(myPick: CardType) {
    if (sdWaiting) return
    setSdWaiting(true)
    setTimeout(() => {
      const botPick = randomCard()
      const outcome = resolveCard(myPick, botPick)
      const round: SdRound = { myPick, botPick, outcome }
      setSdRounds(prev => [...prev, round])
      setSdWaiting(false)
      if (outcome !== 'tie') {
        setWinner(outcome === 'player1' ? 'you' : 'bot')
        setPhase('complete')
      }
    }, 700)
  }

  function reset() {
    botSequence.current = shuffle(INITIAL_HAND)
    setPhase('sequencing')
    setSequence(Array(9).fill(null))
    setHand(INITIAL_HAND)
    setResolution(null)
    setSdRounds([])
    setSdWaiting(false)
    setWinner(null)
  }

  const mySeq = sequence as CardType[]
  const currentSdRound = sdRounds.length + 1

  return (
    <div className="flex flex-col gap-8">

      {/* Opponent row */}
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Bot opponent</p>
        <div className="flex gap-2 flex-wrap">
          {Array(9).fill(null).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs text-white/20">{i + 1}</span>
              {(phase === 'resolved' || phase === 'complete') ? (
                <div className="w-14 h-[72px] flex items-center justify-center rounded-lg border-2 border-white/10 bg-white/5 text-2xl">
                  {CARD_EMOJI[botSequence.current[i]]}
                </div>
              ) : (
                <HiddenCard />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase content */}
      {phase === 'sequencing' && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Your sequence</p>
            <div className="flex gap-2 flex-wrap">
              {sequence.map((card, i) =>
                card
                  ? <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-white/20">{i + 1}</span>
                      <CardPiece card={card} onClick={() => removeCard(i)} />
                    </div>
                  : <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-white/20">{i + 1}</span>
                      <EmptySlot index={i} />
                    </div>
              )}
            </div>
            <p className="text-xs text-white/30 mt-2">{filled}/9 placed — click a card to remove it</p>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Hand</p>
            <div className="flex gap-2 flex-wrap">
              {hand.map((card, i) => (
                <CardPiece key={`${card}-${i}`} card={card} onClick={() => placeCard(card, i)} disabled={filled >= 9} />
              ))}
              {hand.length === 0 && <p className="text-white/30 text-sm">All cards placed</p>}
            </div>
          </div>

          <button
            onClick={lockIn}
            disabled={filled < 9}
            className="self-start px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest bg-amber-500 text-black hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Lock In
          </button>
        </div>
      )}

      {phase === 'resolved' && resolution && (
        <div className="flex flex-col gap-4 animate-pulse-once">
          <div className="text-center py-4">
            <p className="text-white/40 text-sm">Resolving…</p>
          </div>
        </div>
      )}

      {phase === 'complete' && resolution && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <p className={`text-3xl font-bold ${winner === 'you' ? 'text-emerald-400' : 'text-red-400'}`}>
              {winner === 'you' ? 'You Win!' : 'Bot Wins'}
            </p>
            <p className="text-white/40 mt-1">
              {resolution.player1_score} – {resolution.player2_score}
              {sdRounds.length > 0 && ` · Sudden Death ×${sdRounds.length}`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-widest">
                  <td className="pb-2 pr-3">Slot</td>
                  <td className="pb-2 pr-3">Bot</td>
                  <td className="pb-2 pr-3">You</td>
                  <td className="pb-2">Result</td>
                </tr>
              </thead>
              <tbody>
                {resolution.round_results.map((outcome, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="py-1.5 pr-3 text-white/30">{i + 1}</td>
                    <td className="py-1.5 pr-3">{CARD_EMOJI[botSequence.current[i]]}</td>
                    <td className="py-1.5 pr-3">{CARD_EMOJI[mySeq[i]]}</td>
                    <td className={`py-1.5 font-bold ${OUTCOME_COLOR[outcome]}`}>
                      {OUTCOME_LABEL[outcome]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sdRounds.length > 0 && (
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-2">Sudden Death</p>
              {sdRounds.map((r, i) => (
                <div key={i} className="flex items-center gap-4 text-sm border-t border-white/10 py-1.5">
                  <span className="text-white/30 w-6">R{i + 1}</span>
                  <span>{CARD_EMOJI[r.botPick]}</span>
                  <span>{CARD_EMOJI[r.myPick]}</span>
                  <span className={`font-bold ${OUTCOME_COLOR[r.outcome]}`}>{OUTCOME_LABEL[r.outcome]}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={reset}
            className="self-start px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest bg-amber-500 text-black hover:bg-amber-400 active:scale-95 transition-all"
          >
            Play Again
          </button>
        </div>
      )}

      {phase === 'sudden_death' && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">Sudden Death</p>
            <p className="text-white/50 text-sm mt-1">
              Round {currentSdRound} — scores tied {resolution?.player1_score}–{resolution?.player2_score}
            </p>
          </div>

          {sdRounds.length > 0 && (
            <div className="flex flex-col gap-1 w-full max-w-xs">
              {sdRounds.map((r, i) => (
                <div key={i} className="flex items-center justify-center gap-4 text-sm text-white/40">
                  <span>{CARD_EMOJI[r.myPick]}</span>
                  <span className="text-white/20">vs</span>
                  <span>{CARD_EMOJI[r.botPick]}</span>
                  <span className="text-yellow-400">Tie</span>
                </div>
              ))}
            </div>
          )}

          {sdWaiting ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-white/50 text-sm">Bot is picking…</p>
            </div>
          ) : (
            <div className="flex gap-4">
              {(['rock', 'scissors', 'paper'] as CardType[]).map(card => (
                <CardPiece key={card} card={card} onClick={() => pickSuddenDeath(card)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Score bar (post-lock) */}
      {(phase === 'complete' || phase === 'sudden_death') && resolution && phase !== 'complete' && (
        <div className="border-t border-white/10 pt-4 flex justify-center gap-12 text-center">
          <div>
            <p className="text-2xl font-bold">{resolution.player1_score}</p>
            <p className="text-xs text-white/40 uppercase tracking-widest">You</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{resolution.player2_score}</p>
            <p className="text-xs text-white/40 uppercase tracking-widest">Bot</p>
          </div>
        </div>
      )}
    </div>
  )
}
