'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { resolveGame, resolveCard } from '@/lib/card-duel/engine'
import type { GameResolution } from '@/lib/card-duel/engine'
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

type Phase = 'sequencing' | 'resolving' | 'sudden_death' | 'complete'

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
const OUTCOME_BG: Record<RoundOutcome, string> = {
  player1: 'bg-emerald-500/20',
  player2: 'bg-red-500/20',
  tie: 'bg-yellow-500/10',
}
const CARD_EMOJI: Record<CardType, string> = { rock: '🪨', scissors: '✂️', paper: '📄' }

function isDecidingSlot(slot: number, results: RoundOutcome[]): boolean {
  if (slot !== 8) return false
  let p1 = 0, p2 = 0
  for (let i = 0; i < 8; i++) {
    if (results[i] === 'player1') p1++
    else if (results[i] === 'player2') p2++
  }
  return Math.abs(p1 - p2) === 1
}

function getRunningScores(results: RoundOutcome[], count: number): [number, number] {
  let p1 = 0, p2 = 0
  for (let i = 0; i < count; i++) {
    if (results[i] === 'player1') p1++
    else if (results[i] === 'player2') p2++
  }
  return [p1, p2]
}

interface ClashSlotProps {
  slotIndex: number
  playerCard: CardType
  botCard: CardType
  outcome: RoundOutcome
  isDeciding: boolean
  onComplete: () => void
}

function ClashSlot({ slotIndex, playerCard, botCard, outcome, isDeciding, onComplete }: ClashSlotProps) {
  const playerControls = useAnimation()
  const botControls = useAnimation()
  const [flash, setFlash] = useState(false)
  const [showRing, setShowRing] = useState(false)
  const [showOutcome, setShowOutcome] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      // Build tension — longer pause for deciding round
      await new Promise(r => setTimeout(r, isDeciding ? 1300 : 400))
      if (cancelled) return

      // Approach: both cards slide toward each other (sequential tweens, no spring)
      const approachDur = isDeciding ? 0.46 : 0.28
      await Promise.all([
        playerControls.start({ x: 32, transition: { duration: approachDur, ease: [0.4, 0, 1, 1] } }),
        botControls.start({ x: -32, transition: { duration: approachDur, ease: [0.4, 0, 1, 1] } }),
      ])
      if (cancelled) return

      // Impact: flash + shockwave ring
      setFlash(true)
      setShowRing(true)
      await new Promise(r => setTimeout(r, isDeciding ? 140 : 95))
      setFlash(false)
      if (cancelled) return

      // Winner pushes through, loser recoils
      const pushDur = isDeciding ? 0.58 : 0.36
      const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

      if (outcome === 'player1') {
        await Promise.all([
          playerControls.start({ x: 68, transition: { duration: pushDur, ease } }),
          botControls.start({ x: -6, transition: { duration: pushDur, ease } }),
        ])
      } else if (outcome === 'player2') {
        await Promise.all([
          botControls.start({ x: -68, transition: { duration: pushDur, ease } }),
          playerControls.start({ x: 6, transition: { duration: pushDur, ease } }),
        ])
      } else {
        // Tie: both rebound to start
        await Promise.all([
          playerControls.start({ x: 0, transition: { duration: pushDur * 0.6, ease } }),
          botControls.start({ x: 0, transition: { duration: pushDur * 0.6, ease } }),
        ])
      }
      if (cancelled) return

      // Deciding round: winner holds position longer before result settles
      setShowOutcome(true)
      await new Promise(r => setTimeout(r, isDeciding ? 750 : 400))
      if (cancelled) return

      onComplete()
    }

    run()
    return () => { cancelled = true }
  }, [])

  const outcomeText = outcome === 'player1'
    ? `Round ${slotIndex + 1} — You`
    : outcome === 'player2'
    ? `Round ${slotIndex + 1} — Bot`
    : `Round ${slotIndex + 1} — Tie`

  return (
    <div className="flex flex-col gap-4 py-2 w-full">
      {/* Full-width clash header */}
      <div className="flex justify-between items-center text-xs uppercase tracking-widest">
        <span className="text-white/30">You</span>
        <span className={isDeciding ? 'text-amber-400 font-semibold' : 'text-white/25'}>
          {isDeciding ? 'Final Round' : `Round ${slotIndex + 1}`}
        </span>
        <span className="text-white/30">Bot</span>
      </div>

      <div className="relative flex items-center justify-center gap-10">
        {/* Flash burst */}
        {flash && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDeciding
                ? 'radial-gradient(circle at center, rgba(255,255,255,0.55) 0%, transparent 65%)'
                : 'radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, transparent 65%)',
            }}
          />
        )}

        {/* Shockwave ring */}
        <AnimatePresence>
          {showRing && (
            <motion.div
              className="absolute pointer-events-none rounded-full border border-white/50"
              style={{
                width: isDeciding ? 140 : 96,
                height: isDeciding ? 140 : 96,
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
              }}
              initial={{ scale: 0.15, opacity: 0.9 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: isDeciding ? 0.55 : 0.32, ease: 'easeOut' }}
              onAnimationComplete={() => setShowRing(false)}
            />
          )}
        </AnimatePresence>

        {/* Player card */}
        <motion.div animate={playerControls} initial={{ x: 0 }}>
          <CardPiece card={playerCard} size="lg" />
        </motion.div>

        <span className="text-white/15 text-xs uppercase tracking-widest">vs</span>

        {/* Bot card */}
        <motion.div animate={botControls} initial={{ x: 0 }}>
          <div className="w-[58px] h-20 flex items-center justify-center rounded-lg border-2 border-white/10 bg-white/5 text-2xl">
            {CARD_EMOJI[botCard]}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showOutcome && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-sm font-semibold ${OUTCOME_COLOR[outcome]}`}
          >
            {outcomeText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DemoGame() {
  const botSequence = useRef<CardType[]>(shuffle(INITIAL_HAND))

  const [phase, setPhase] = useState<Phase>('sequencing')
  const [sequence, setSequence] = useState<(CardType | null)[]>(Array(9).fill(null))
  const [hand, setHand] = useState<CardType[]>(INITIAL_HAND)
  const [resolution, setResolution] = useState<GameResolution | null>(null)
  const [resolvedSlots, setResolvedSlots] = useState(0)
  const [currentClashSlot, setCurrentClashSlot] = useState<number | null>(null)
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
    setResolvedSlots(0)
    setCurrentClashSlot(0)
    setPhase('resolving')
  }

  function handleClashComplete(slot: number) {
    const next = slot + 1
    setResolvedSlots(next)
    if (next >= 9) {
      setCurrentClashSlot(null)
      if (resolution!.winner === 'tie') {
        setTimeout(() => setPhase('sudden_death'), 500)
      } else {
        setWinner(resolution!.winner === 'player1' ? 'you' : 'bot')
        setTimeout(() => setPhase('complete'), 500)
      }
    } else {
      setCurrentClashSlot(next)
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
    setResolvedSlots(0)
    setCurrentClashSlot(null)
    setSdRounds([])
    setSdWaiting(false)
    setWinner(null)
  }

  const mySeq = sequence as CardType[]
  const currentSdRound = sdRounds.length + 1
  const [runP1, runP2] = resolution
    ? getRunningScores(resolution.round_results, resolvedSlots)
    : [0, 0]

  return (
    <div className="flex flex-col gap-8">

      {/* Opponent row — cards reveal one by one as rounds resolve */}
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Bot opponent</p>
        <div className="flex gap-2 flex-wrap">
          {Array(9).fill(null).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs text-white/20">{i + 1}</span>
              {(phase === 'complete' || (phase === 'resolving' && i < resolvedSlots)) ? (
                <div className="w-[58px] h-20 flex items-center justify-center rounded-lg border-2 border-white/10 bg-white/5 text-2xl">
                  {CARD_EMOJI[botSequence.current[i]]}
                </div>
              ) : (
                <HiddenCard size="lg" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sequencing phase */}
      {phase === 'sequencing' && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Your sequence</p>
            <div className="flex gap-2 flex-wrap">
              {sequence.map((card, i) =>
                card
                  ? <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-white/20">{i + 1}</span>
                      <CardPiece card={card} size="lg" onClick={() => removeCard(i)} />
                    </div>
                  : <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-white/20">{i + 1}</span>
                      <EmptySlot index={i} size="lg" />
                    </div>
              )}
            </div>
            <p className="text-xs text-white/30 mt-2">{filled}/9 placed — click a card to remove it</p>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Hand</p>
            <div className="flex gap-2 flex-wrap">
              {hand.map((card, i) => (
                <CardPiece key={`${card}-${i}`} card={card} size="lg" onClick={() => placeCard(card, i)} disabled={filled >= 9} />
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

      {/* Resolving phase — slot by slot clash animation */}
      {phase === 'resolving' && resolution && currentClashSlot !== null && (
        <div className="flex flex-col gap-5">
          {resolvedSlots > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {Array(resolvedSlots).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center ${OUTCOME_BG[resolution.round_results[i]]} ${OUTCOME_COLOR[resolution.round_results[i]]}`}
                  >
                    {OUTCOME_LABEL[resolution.round_results[i]]}
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold">
                <span className="text-emerald-400">{runP1}</span>
                <span className="text-white/20 mx-1">–</span>
                <span className="text-red-400">{runP2}</span>
              </div>
            </div>
          )}

          <ClashSlot
            key={currentClashSlot}
            slotIndex={currentClashSlot}
            playerCard={mySeq[currentClashSlot]}
            botCard={botSequence.current[currentClashSlot]}
            outcome={resolution.round_results[currentClashSlot]}
            isDeciding={isDecidingSlot(currentClashSlot, resolution.round_results)}
            onComplete={() => handleClashComplete(currentClashSlot)}
          />
        </div>
      )}

      {/* Complete phase */}
      {phase === 'complete' && resolution && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <p className={`text-3xl font-bold ${winner === 'you' ? 'text-emerald-400' : 'text-red-400'}`}>
              {winner === 'you' ? 'You Win' : 'Bot Wins'}
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

      {/* Sudden death phase */}
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

      {/* Score bar (sudden death only) */}
      {phase === 'sudden_death' && resolution && (
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
