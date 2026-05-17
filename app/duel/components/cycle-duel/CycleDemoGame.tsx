'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as animeLib from 'animejs'
import {
  CycleCard, RoundOutcome,
  BEATS, ALL_CARDS, INITIAL_HAND,
  resolveCycleCard, resolveBlock,
  shuffle, randomCard, generateBotPlan,
} from '@/lib/cycle-duel/engine'

// animejs v4 exports as named — support both CJS default and ESM named
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anime: (params: any) => any = (animeLib as any).default ?? (animeLib as any).animate ?? animeLib

// ─── Card meta ───────────────────────────────────────────────────────────────

const CARD_META: Record<CycleCard, {
  emoji: string
  label: string
  bg: string
  border: string
  beats: string
  // per-move-type clash personality
  approachDuration: number    // ms — how fast the card slides in
  approachEase: string        // anime easing for approach
  winExtraDist: number        // extra px the winner pushes past center
  recoilDist: number          // px loser bounces back
  recoilDuration: number      // ms loser recoil
}> = {
  feint: {
    emoji: '👋', label: 'Feint', bg: 'bg-purple-900', border: 'border-purple-400',
    beats: 'Guard · Strike',
    approachDuration: 260, approachEase: 'easeInOutSine',  // slippery — slight hesitation
    winExtraDist: 18, recoilDist: 28, recoilDuration: 200,
  },
  guard: {
    emoji: '🛡️', label: 'Guard', bg: 'bg-blue-900', border: 'border-blue-400',
    beats: 'Strike · Rush',
    approachDuration: 320, approachEase: 'easeInOutQuad',  // defensive — slower, steady
    winExtraDist: 10, recoilDist: 40, recoilDuration: 250, // opponent bounces hard off guard
  },
  strike: {
    emoji: '⚡', label: 'Strike', bg: 'bg-amber-900', border: 'border-amber-400',
    beats: 'Rush · Grab',
    approachDuration: 180, approachEase: 'easeInQuart',    // aggressive — fast approach
    winExtraDist: 28, recoilDist: 32, recoilDuration: 180,
  },
  rush: {
    emoji: '💨', label: 'Rush', bg: 'bg-green-900', border: 'border-green-400',
    beats: 'Grab · Feint',
    approachDuration: 200, approachEase: 'easeInCubic',    // forceful — fast, linear push
    winExtraDist: 24, recoilDist: 36, recoilDuration: 190,
  },
  grab: {
    emoji: '✊', label: 'Grab', bg: 'bg-orange-900', border: 'border-orange-400',
    beats: 'Feint · Guard',
    approachDuration: 240, approachEase: 'easeInOutBack',  // pull — slight overshoot
    winExtraDist: 20, recoilDist: 30, recoilDuration: 210,
  },
}

const OUTCOME_COLOR: Record<RoundOutcome, string> = {
  player1: 'text-amber-400',
  player2: 'text-white/30',
  tie: 'text-yellow-400',
}

type Phase = 'arrange' | 'resolve' | 'sudden_death' | 'complete'

interface BlockResult { mySeq: CycleCard[]; botSeq: CycleCard[]; results: RoundOutcome[] }

// ─── ClashRow — animated per-round clash ────────────────────────────────────

interface ClashRowProps {
  myCard: CycleCard
  botCard: CycleCard
  outcome: RoundOutcome
  roundIndex: number
  delay: number
  onDone?: () => void
}

function ClashRow({ myCard, botCard, outcome, roundIndex, delay, onDone }: ClashRowProps) {
  const impactRef = useRef<HTMLDivElement>(null)
  const shockwaveRef = useRef<HTMLDivElement>(null)
  const botCardRef = useRef<HTMLDivElement>(null)
  const myCardRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  const myMeta = CARD_META[myCard]
  const botMeta = CARD_META[botCard]

  // Use the winner's card meta for clash personality
  const clashMeta = outcome === 'player1' ? myMeta : outcome === 'player2' ? botMeta : myMeta

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true)

      // After cards appear, run clash animation
      const clashDelay = 100
      setTimeout(() => {
        if (!botCardRef.current || !myCardRef.current) return

        const approachDist = 38 // px toward center
        const winnerExtra = clashMeta.winExtraDist

        // Both approach center simultaneously
        const botTarget = outcome === 'player2'
          ? approachDist + winnerExtra
          : outcome === 'tie'
          ? approachDist
          : approachDist

        const myTarget = outcome === 'player1'
          ? -(approachDist + winnerExtra)
          : outcome === 'tie'
          ? -approachDist
          : -approachDist

        // Approach phase
        anime({
          targets: botCardRef.current,
          translateX: botTarget,
          duration: clashMeta.approachDuration,
          easing: clashMeta.approachEase,
          complete: () => {
            // Impact flash + shockwave
            if (impactRef.current) {
              anime({
                targets: impactRef.current,
                opacity: [0, 1, 0],
                scale: [0.6, 1.4, 0.6],
                duration: 130,
                easing: 'linear',
              })
            }
            if (shockwaveRef.current) {
              anime({
                targets: shockwaveRef.current,
                scale: [0, 2.5],
                opacity: [0.6, 0],
                duration: 280,
                easing: 'easeOutQuad',
              })
            }

            // Winner pushes through / loser recoils
            if (outcome === 'player1') {
              // my card wins — pushes further right, bot recoils left
              anime({ targets: myCardRef.current, translateX: -approachDist * 0.4, duration: 200, easing: 'easeOutQuad' })
              anime({ targets: botCardRef.current, translateX: -(clashMeta.recoilDist), duration: clashMeta.recoilDuration, easing: 'easeOutElastic(1, 0.6)' })
            } else if (outcome === 'player2') {
              // bot wins — pushes further, my card recoils
              anime({ targets: botCardRef.current, translateX: approachDist * 0.4, duration: 200, easing: 'easeOutQuad' })
              anime({ targets: myCardRef.current, translateX: clashMeta.recoilDist, duration: clashMeta.recoilDuration, easing: 'easeOutElastic(1, 0.6)' })
            } else {
              // tie — both bounce back equally
              anime({ targets: botCardRef.current, translateX: 0, duration: 220, easing: 'easeOutElastic(1, 0.5)' })
              anime({ targets: myCardRef.current, translateX: 0, duration: 220, easing: 'easeOutElastic(1, 0.5)' })
            }

            if (onDone) setTimeout(onDone, 400)
          },
        })

        anime({
          targets: myCardRef.current,
          translateX: myTarget,
          duration: clashMeta.approachDuration,
          easing: clashMeta.approachEase,
        })
      }, clashDelay)
    }, delay)

    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 6 }}
      transition={{ duration: 0.18 }}
      className="relative flex items-center gap-0 border-t border-white/5 py-3"
    >
      {/* Round number */}
      <span className="text-white/20 text-xs w-5 shrink-0">{roundIndex + 1}</span>

      {/* Clash arena */}
      <div className="relative flex items-center justify-center flex-1 h-[84px]">
        {/* Shockwave ring — center */}
        <div
          ref={shockwaveRef}
          className="absolute pointer-events-none w-14 h-14 rounded-full border-2 border-amber-400/70"
          style={{ opacity: 0, transform: 'scale(0)' }}
        />
        {/* Impact flash */}
        <div
          ref={impactRef}
          className="absolute pointer-events-none w-8 h-8 rounded-full bg-amber-300/80 blur-sm"
          style={{ opacity: 0 }}
        />

        {/* Bot card (slides from left) */}
        <div
          ref={botCardRef}
          className="absolute left-4"
          style={{ transform: 'translateX(0px)' }}
        >
          <ClashCard card={botCard} dim={outcome === 'player1'} win={outcome === 'player2'} />
        </div>

        {/* Center label */}
        <span className="text-white/15 text-xs select-none z-10 pointer-events-none">vs</span>

        {/* My card (slides from right) */}
        <div
          ref={myCardRef}
          className="absolute right-4"
          style={{ transform: 'translateX(0px)' }}
        >
          <ClashCard card={myCard} dim={outcome === 'player2'} win={outcome === 'player1'} />
        </div>
      </div>

      {/* Outcome label */}
      <span className={`font-bold text-sm w-10 text-right shrink-0 ${OUTCOME_COLOR[outcome]}`}>
        {outcome === 'player1' ? 'Win' : outcome === 'player2' ? 'Loss' : 'Tie'}
      </span>
    </motion.div>
  )
}

// Card used only in clash arena — no interaction, winner/loser tinting
function ClashCard({ card, dim, win }: { card: CycleCard; dim: boolean; win: boolean }) {
  const m = CARD_META[card]
  return (
    <div className={`
      flex flex-col items-center justify-center gap-0.5 w-[58px] h-[76px] rounded-lg border-2 text-2xl
      transition-all duration-200
      ${m.bg} ${m.border}
      ${win ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black brightness-110' : ''}
      ${dim ? 'opacity-35 brightness-75' : ''}
    `}>
      <span>{m.emoji}</span>
      <span className="text-[10px] text-white/50">{m.label}</span>
    </div>
  )
}

// ─── CycleCardBtn — interactive hand/sequence card ──────────────────────────

function CycleCardBtn({ card, onClick, disabled, selected, dimmed }: {
  card: CycleCard; onClick?: () => void; disabled?: boolean; selected?: boolean; dimmed?: boolean
}) {
  const m = CARD_META[card]
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={onClick && !disabled ? { scale: 1.06 } : undefined}
      whileTap={onClick && !disabled ? { scale: 0.93 } : undefined}
      transition={{ type: 'spring', stiffness: 480, damping: 22 }}
      className={`
        flex flex-col items-center justify-center gap-0.5 w-[58px] h-20 rounded-lg border-2 text-xl font-medium
        select-none
        ${m.bg} ${m.border}
        ${onClick && !disabled ? 'cursor-pointer' : 'cursor-default'}
        ${disabled ? 'opacity-30' : ''}
        ${selected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : ''}
        ${dimmed ? 'opacity-40' : ''}
      `}
    >
      <span>{m.emoji}</span>
      <span className="text-[10px] text-white/55">{m.label}</span>
    </motion.button>
  )
}

// ─── OpponentHistory — compact block history row ────────────────────────────

function OpponentHistory({ blockResults }: { blockResults: BlockResult[] }) {
  if (blockResults.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] text-amber-500/60 uppercase tracking-widest">Bot's previous blocks</p>
      <div className="flex gap-4 flex-wrap">
        {blockResults.map((br, bi) => (
          <div key={bi} className="flex flex-col gap-1.5">
            <span className="text-[10px] text-white/25 uppercase tracking-widest">Blk {bi + 1}</span>
            <div className="flex gap-1.5">
              {br.botSeq.map((card, ci) => {
                const outcome = br.results[ci]
                const m = CARD_META[card]
                return (
                  <div
                    key={ci}
                    className={`
                      relative flex flex-col items-center justify-center gap-0 w-10 h-[52px] rounded-md border text-base
                      ${m.bg} ${m.border}
                      ${outcome === 'player2' ? 'ring-1 ring-amber-400/60' : ''}
                      ${outcome === 'player1' ? 'opacity-40 brightness-75' : ''}
                    `}
                  >
                    <span className="leading-none">{m.emoji}</span>
                    <span className="text-[9px] text-white/40 leading-none mt-0.5">{m.label}</span>
                    {/* small outcome pip */}
                    <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                      outcome === 'player2' ? 'bg-amber-400' :
                      outcome === 'player1' ? 'bg-white/20' :
                      'bg-yellow-400/60'
                    }`} />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── BeatChart — always-visible reference ───────────────────────────────────

function BeatChart() {
  return (
    <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3">
      <p className="text-[10px] text-amber-500/60 uppercase tracking-widest mb-2.5">Beat chart</p>
      <div className="grid grid-cols-1 gap-1.5">
        {ALL_CARDS.map(card => {
          const m = CARD_META[card]
          return (
            <div key={card} className="flex items-center gap-2 text-xs">
              <span className="text-sm leading-none w-5">{m.emoji}</span>
              <span className="text-amber-400/80 font-medium w-12">{m.label}</span>
              <span className="text-white/20">beats</span>
              <span className="text-white/50">{m.beats}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ResolvePhase — animated sequential clash reveal ────────────────────────

interface ResolvePhaseProps {
  blockResult: BlockResult
  blockNum: number
}

function ResolvePhase({ blockResult, blockNum }: ResolvePhaseProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    // Stagger each clash: 0ms, 550ms, 1100ms
    const ROUND_STAGGER = 550
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        setVisibleCount(i + 1)
      }, i * ROUND_STAGGER)
    }
  }, [])

  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Block {blockNum} clash</p>
      {blockResult.results.map((outcome, i) => (
        visibleCount > i && (
          <ClashRow
            key={i}
            myCard={blockResult.mySeq[i]}
            botCard={blockResult.botSeq[i]}
            outcome={outcome}
            roundIndex={i}
            delay={80}
          />
        )
      ))}
    </div>
  )
}

// ─── Main game component ─────────────────────────────────────────────────────

export function CycleDemoGame() {
  const bot = useRef(generateBotPlan(INITIAL_HAND))

  const [phase, setPhase] = useState<Phase>('arrange')
  const [block, setBlock] = useState(1)
  const [hand, setHand] = useState<CycleCard[]>(INITIAL_HAND)
  const [currentSeq, setCurrentSeq] = useState<CycleCard[]>([])
  const [blockResults, setBlockResults] = useState<BlockResult[]>([])
  const [totalScore, setTotalScore] = useState({ me: 0, bot: 0 })
  const [sdPicked, setSdPicked] = useState(false)
  const [sdRounds, setSdRounds] = useState<{ my: CycleCard; bot: CycleCard; outcome: RoundOutcome }[]>([])
  const [winner, setWinner] = useState<'you' | 'bot' | null>(null)

  const botBlock = block === 1 ? bot.current.block1 : block === 2 ? bot.current.block2 : bot.current.block3
  const hintCard = botBlock[0]
  const isBlock3 = block === 3

  function placeCard(card: CycleCard, handIdx: number) {
    if (currentSeq.length >= 3) return
    setCurrentSeq(prev => [...prev, card])
    setHand(prev => { const n = [...prev]; n.splice(handIdx, 1); return n })
  }

  function removeFromSeq(seqIdx: number) {
    const card = currentSeq[seqIdx]
    setCurrentSeq(prev => prev.filter((_, i) => i !== seqIdx))
    setHand(prev => [...prev, card])
  }

  function lockBlock() {
    if (currentSeq.length < 3) return
    const res = resolveBlock(currentSeq, botBlock)
    const newResult: BlockResult = { mySeq: currentSeq, botSeq: botBlock, results: res.results }
    const newResults = [...blockResults, newResult]
    const newScore = { me: totalScore.me + res.score1, bot: totalScore.bot + res.score2 }

    setBlockResults(newResults)
    setTotalScore(newScore)
    setCurrentSeq([])
    setPhase('resolve')

    // Allow resolve animations to play (3 rounds × 550ms stagger + 800ms buffer)
    setTimeout(() => {
      if (block < 3) {
        setBlock(b => b + 1)
        setPhase('arrange')
      } else {
        if (newScore.me > newScore.bot) { setWinner('you'); setPhase('complete') }
        else if (newScore.bot > newScore.me) { setWinner('bot'); setPhase('complete') }
        else setPhase('sudden_death')
      }
    }, 3200)
  }

  function pickSuddenDeath(myPick: CycleCard) {
    if (sdPicked) return
    setSdPicked(true)
    setTimeout(() => {
      const botPick = randomCard()
      const outcome = resolveCycleCard(myPick, botPick)
      setSdRounds(prev => [...prev, { my: myPick, bot: botPick, outcome }])
      setSdPicked(false)
      if (outcome !== 'tie') {
        setWinner(outcome === 'player1' ? 'you' : 'bot')
        setPhase('complete')
      }
    }, 700)
  }

  function reset() {
    bot.current = generateBotPlan(INITIAL_HAND)
    setPhase('arrange'); setBlock(1); setHand(INITIAL_HAND); setCurrentSeq([])
    setBlockResults([]); setTotalScore({ me: 0, bot: 0 })
    setSdPicked(false); setSdRounds([]); setWinner(null)
  }

  return (
    <div className="flex flex-col gap-6 bg-black rounded-2xl p-5 min-h-[480px]">

      {/* Block progress bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map(b => (
          <motion.div
            key={b}
            className={`flex-1 h-0.5 rounded-full ${
              b < block ? 'bg-amber-500' :
              b === block && phase !== 'complete' && phase !== 'sudden_death' ? 'bg-amber-500/40' :
              'bg-white/8'
            }`}
            layout
          />
        ))}
      </div>

      {/* Score — shown after block 1 resolves */}
      <AnimatePresence>
        {(block > 1 || phase === 'resolve' || phase === 'complete' || phase === 'sudden_death') && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex justify-center gap-16 text-center"
          >
            <div>
              <p className="text-2xl font-bold text-amber-400 tabular-nums">{totalScore.me}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">You</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white/50 tabular-nums">{totalScore.bot}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">Bot</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Arrange phase ─────────────────────────────────────── */}
      {phase === 'arrange' && (
        <div className="flex flex-col gap-5">

          {/* Opponent block history */}
          <OpponentHistory blockResults={blockResults} />

          {/* Peek */}
          <div className="flex items-center gap-3 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl px-4 py-3">
            <div className="flex flex-col gap-0.5 shrink-0">
              <span className="text-[10px] text-amber-500/60 uppercase tracking-widest">Bot's first card</span>
              <span className="text-[10px] text-white/25">Block {block}</span>
            </div>
            <motion.div
              key={`peek-${block}`}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.05 }}
            >
              <CycleCardBtn card={hintCard} />
            </motion.div>
            <p className="text-xs text-white/25 ml-1 leading-relaxed">Use this to plan your sequence</p>
          </div>

          {/* Your sequence slots */}
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2.5">
              Your sequence — Block {block} {isBlock3 && <span className="text-amber-500/50">(bench 1)</span>}
            </p>
            <div className="flex gap-2">
              {Array(3).fill(null).map((_, i) => (
                currentSeq[i]
                  ? (
                    <motion.div
                      key={`seq-${i}-${currentSeq[i]}`}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 460, damping: 22 }}
                    >
                      <CycleCardBtn card={currentSeq[i]} onClick={() => removeFromSeq(i)} />
                    </motion.div>
                  )
                  : (
                    <div
                      key={`empty-${i}`}
                      className="w-[58px] h-20 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center"
                    >
                      <span className="text-white/20 text-xs">{i + 1}</span>
                    </div>
                  )
              ))}
            </div>
          </div>

          {/* Hand */}
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2.5">Hand</p>
            <div className="flex gap-2 flex-wrap">
              {hand.map((card, i) => (
                <CycleCardBtn
                  key={`${card}-${i}`}
                  card={card}
                  onClick={() => placeCard(card, i)}
                  disabled={currentSeq.length >= 3}
                />
              ))}
              {hand.length === 0 && <p className="text-white/20 text-sm">No cards remaining</p>}
            </div>
          </div>

          {/* Beat chart — always visible during arrange */}
          <BeatChart />

          {/* Lock button */}
          <motion.button
            onClick={lockBlock}
            disabled={currentSeq.length < 3}
            whileHover={currentSeq.length >= 3 ? { scale: 1.02 } : undefined}
            whileTap={currentSeq.length >= 3 ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 460, damping: 22 }}
            className="self-start px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest bg-amber-500 text-black hover:bg-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Lock Block {block}
          </motion.button>
        </div>
      )}

      {/* ── Resolve phase ─────────────────────────────────────── */}
      {phase === 'resolve' && blockResults.length > 0 && (
        <ResolvePhase
          blockResult={blockResults[blockResults.length - 1]}
          blockNum={blockResults.length}
        />
      )}

      {/* ── Sudden death ──────────────────────────────────────── */}
      {phase === 'sudden_death' && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">Sudden Death</p>
            <p className="text-white/40 text-sm mt-1">Tied {totalScore.me}–{totalScore.bot} — pick any card</p>
          </div>

          {sdRounds.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {sdRounds.map((r, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/30 border-t border-white/5 pt-2">
                  <CycleCardBtn card={r.my} />
                  <span className="text-white/15 text-xs">vs</span>
                  <CycleCardBtn card={r.bot} />
                  <span className="text-yellow-400/70 font-bold text-xs ml-auto">Tie</span>
                </div>
              ))}
            </div>
          )}

          {sdPicked
            ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                <p className="text-white/40 text-sm">Bot is picking…</p>
              </div>
            )
            : (
              <div className="flex gap-3 flex-wrap justify-center">
                {ALL_CARDS.map(card => (
                  <CycleCardBtn key={card} card={card} onClick={() => pickSuddenDeath(card)} />
                ))}
              </div>
            )
          }

          {/* Beat chart visible in sudden death too */}
          <BeatChart />
        </div>
      )}

      {/* ── Complete ──────────────────────────────────────────── */}
      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="text-center py-2">
            <p className={`text-3xl font-bold tracking-tight ${winner === 'you' ? 'text-amber-400' : 'text-white/40'}`}>
              {winner === 'you' ? 'You Win' : 'Bot Wins'}
            </p>
            <p className="text-white/25 mt-1 tabular-nums">{totalScore.me} – {totalScore.bot}</p>
          </div>

          {/* Full block history */}
          {blockResults.map((br, bi) => (
            <div key={bi} className="flex flex-col gap-1">
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Block {bi + 1}</p>
              {br.results.map((outcome, i) => (
                <div key={i} className="flex items-center gap-3 border-t border-white/5 py-1.5">
                  <span className="text-white/15 text-xs w-4">{i + 1}</span>
                  <ClashCard card={br.botSeq[i]} dim={outcome === 'player1'} win={outcome === 'player2'} />
                  <span className="text-white/15 text-xs">vs</span>
                  <ClashCard card={br.mySeq[i]} dim={outcome === 'player2'} win={outcome === 'player1'} />
                  <span className={`font-bold text-xs ml-auto ${OUTCOME_COLOR[outcome]}`}>
                    {outcome === 'player1' ? 'W' : outcome === 'player2' ? 'L' : 'T'}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {sdRounds.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-amber-500/50 uppercase tracking-widest mb-1">Sudden Death</p>
              {sdRounds.map((r, i) => (
                <div key={i} className="flex items-center gap-3 border-t border-white/5 py-1.5">
                  <span className="text-white/15 text-xs">R{i + 1}</span>
                  <ClashCard card={r.my} dim={r.outcome === 'player2'} win={r.outcome === 'player1'} />
                  <span className="text-white/15 text-xs">vs</span>
                  <ClashCard card={r.bot} dim={r.outcome === 'player1'} win={r.outcome === 'player2'} />
                  <span className={`font-bold text-xs ml-auto ${OUTCOME_COLOR[r.outcome]}`}>
                    {r.outcome === 'player1' ? 'W' : r.outcome === 'player2' ? 'L' : 'T'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 460, damping: 22 }}
            className="self-start px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest bg-amber-500 text-black hover:bg-amber-400 transition-colors"
          >
            Play Again
          </motion.button>
        </motion.div>
      )}

    </div>
  )
}
