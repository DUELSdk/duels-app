'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { animate, stagger } from 'animejs'
import { getTierById, customTier, DEFAULT_TIER, type Tier } from '@/lib/tiers'
import { saveMatchResult } from '@/lib/match-state'

// ── In-game tokens (all match screens) ────────────────────────────────────
const gameBg   = '#000000'
const gameDiv  = '1px solid rgba(255,255,255,0.10)'
const gameDivS = '1px solid rgba(255,255,255,0.20)'
const gameWin  = '#f59e0b'
const gameLoss = '#f87171'
const gameMono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.40)' }

// ── Legacy spread tokens (CycleDuel/DropDuel utility) ─────────────────────
const dark: React.CSSProperties = { background: gameBg, color: 'rgba(255,255,255,0.88)' }
const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em' }
const div = gameDiv

// ── Utils ──────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function parseTier(param: string | null): Tier {
  if (!param) return DEFAULT_TIER
  if (param.startsWith('custom-')) {
    const kr = parseInt(param.replace('custom-', ''))
    return isNaN(kr) ? DEFAULT_TIER : customTier(kr)
  }
  return getTierById(param) ?? DEFAULT_TIER
}

// ════════════════════════════════════════════════════════════════
// CARD DUEL
// ════════════════════════════════════════════════════════════════

type Move = 'R' | 'P' | 'S'
type CardPhase = 'arrange' | 'reveal' | 'sudden' | 'done'

function cardOutcome(me: Move, opp: Move): 'win' | 'loss' | 'tie' {
  if (me === opp) return 'tie'
  if ((me === 'R' && opp === 'S') || (me === 'S' && opp === 'P') || (me === 'P' && opp === 'R')) return 'win'
  return 'loss'
}

type LogEntry = { ago: string; text: string; alarm?: boolean }


function RockIcon({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="8" stroke={color} strokeWidth="2"/>
      <circle cx="14" cy="14" r="3.5" fill={color}/>
    </svg>
  )
}

function PaperIcon({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="5" y="10" width="18" height="2" rx="1" fill={color}/>
      <rect x="5" y="14" width="18" height="2" rx="1" fill={color}/>
      <rect x="5" y="18" width="18" height="2" rx="1" fill={color}/>
    </svg>
  )
}

function ScissorsIcon({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <line x1="7" y1="7" x2="21" y2="21" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="21" y1="7" x2="7" y2="21" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function MoveIcon({ move, size = 28, color }: { move: Move; size?: number; color?: string }) {
  const c = color ?? 'rgba(255,255,255,0.75)'
  if (move === 'R') return <RockIcon size={size} color={c}/>
  if (move === 'P') return <PaperIcon size={size} color={c}/>
  return <ScissorsIcon size={size} color={c}/>
}

function ActionFeed({ entries }: { entries: LogEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: gameDiv }}>
        <span style={{ ...gameMono, fontSize: 10 }}>● ACTION FEED</span>
        <span style={{ ...gameMono, fontSize: 9 }}>LIVE</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto', flex: 1 }}>
        {entries.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ ...gameMono, fontSize: 9, paddingTop: 1 }}>{e.ago}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: e.alarm ? 'var(--alarm)' : 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardDuelClash({ myMove, oppMove, result, slotIdx, isDeciding = false }: {
  myMove: Move; oppMove: Move; result: 'win' | 'loss' | 'tie'; slotIdx: number; isDeciding?: boolean
}) {
  const LABELS: Record<Move, string> = { R: 'ROCK', P: 'PAPER', S: 'SCISSORS' }
  const resultColor = result === 'win' ? gameWin : result === 'loss' ? gameLoss : 'rgba(255,255,255,0.45)'
  const oppBorder   = result === 'loss' ? `2px solid rgba(248,113,113,0.65)` : '1.5px solid rgba(255,255,255,0.22)'
  const oppBg       = result === 'loss' ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.04)'
  const oppColor    = result === 'loss' ? gameLoss : 'rgba(255,255,255,0.78)'
  const myBorder    = result === 'win'  ? `2px solid rgba(245,158,11,0.65)` : '1.5px solid rgba(255,255,255,0.22)'
  const myBg        = result === 'win'  ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.04)'
  const myColor     = result === 'win'  ? gameWin : 'rgba(255,255,255,0.78)'

  const dur   = isDeciding ? 1.4 : 1.0
  const iS    = isDeciding ? 0.9 : 0.76
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sSpring = (isDeciding ? { type: 'spring' as const, stiffness: 120, damping: 14 } : { duration: dur, times: [0, 0.55, 1], ease: 'easeOut' }) as any

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, height: '100%', position: 'relative' }}>
      {/* Opponent card — slides from left */}
      <motion.div
        initial={{ x: -160, opacity: 0, scale: iS }}
        animate={{
          x:     result === 'loss' ? [-160, 24, 12]  : result === 'win' ? [-160, -2, -30] : [-160, 6, 0],
          opacity: [0, 1, 1],
          scale: result === 'loss' ? [iS, isDeciding ? 1.25 : 1.14, isDeciding ? 1.18 : 1.08] : result === 'win' ? [iS, 0.90, isDeciding ? 0.65 : 0.74] : [iS, 1.0, 0.95],
        }}
        transition={sSpring}
        style={{ width: 110, height: 148, borderRadius: 6, border: oppBorder, background: oppBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, flexShrink: 0 }}
      >
        <MoveIcon move={oppMove} size={44} color={oppColor}/>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: oppColor, letterSpacing: '0.06em' }}>{LABELS[oppMove]}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.22)' }}>BOT</span>
      </motion.div>

      {/* Center: slot + result + shockwave */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 64, position: 'relative' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: isDeciding ? gameWin : 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>
          {isDeciding ? '⚡ DECIDING SLOT' : `SLOT ${slotIdx + 1}`}
        </span>
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: isDeciding ? 1.1 : 0.80, type: 'spring', stiffness: isDeciding ? 300 : 500, damping: 22 }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isDeciding ? 20 : 15, color: resultColor, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
        >
          {result === 'win' ? 'YOU +1' : result === 'loss' ? 'OPP +1' : 'TIE'}
        </motion.span>
        <motion.div
          initial={{ scale: 0.15, opacity: 0 }}
          animate={{ scale: isDeciding ? [0.15, 2.8, 5.5] : [0.15, 2.2, 4.0], opacity: [0, isDeciding ? 0.90 : 0.70, 0] }}
          transition={{ delay: isDeciding ? 0.65 : 0.52, duration: isDeciding ? 0.90 : 0.70, times: [0, 0.22, 1] }}
          style={{ position: 'absolute', top: '50%', left: '50%', width: 52, height: 52, marginLeft: -26, marginTop: -26, borderRadius: '50%', border: `1.5px solid ${resultColor}`, pointerEvents: 'none' }}
        />
        {/* Winner radial glow on deciding slot */}
        {isDeciding && result !== 'tie' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0] }}
            transition={{ delay: 0.80, duration: 0.60, times: [0, 0.5, 1] }}
            style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: '50%', background: `radial-gradient(circle, ${resultColor}55 0%, transparent 70%)`, pointerEvents: 'none' }}
          />
        )}
      </div>

      {/* Player card — slides from right */}
      <motion.div
        initial={{ x: 160, opacity: 0, scale: iS }}
        animate={{
          x:     result === 'win'  ? [160, -24, -12] : result === 'loss' ? [160, 2, 30]  : [160, -6, 0],
          opacity: [0, 1, 1],
          scale: result === 'win'  ? [iS, isDeciding ? 1.25 : 1.14, isDeciding ? 1.18 : 1.08] : result === 'loss' ? [iS, 0.90, isDeciding ? 0.65 : 0.74] : [iS, 1.0, 0.95],
        }}
        transition={sSpring}
        style={{ width: 110, height: 148, borderRadius: 6, border: myBorder, background: myBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, flexShrink: 0 }}
      >
        <MoveIcon move={myMove} size={44} color={myColor}/>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: myColor, letterSpacing: '0.06em' }}>{LABELS[myMove]}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.22)' }}>YOU</span>
      </motion.div>
    </div>
  )
}

function CardDuelMatch({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = parseTier(searchParams.get('tier'))

  const [botSeq] = useState<Move[]>(() =>
    shuffleArray(['R', 'R', 'R', 'P', 'P', 'P', 'S', 'S', 'S'] as Move[])
  )

  // Arrange phase
  const [mySeq,     setMySeq]   = useState<(Move | null)[]>(Array(9).fill(null))
  const [myHand,    setMyHand]  = useState<Record<Move, number>>({ R: 3, P: 3, S: 3 })
  const [selCard,   setSelCard] = useState<Move | null>(null)
  const [botCount,  setBotCount]  = useState(0)
  const [timeLeft,  setTimeLeft]  = useState(60)
  const [myLocked,  setMyLocked]  = useState(false)

  // Reveal phase
  const [phase,     setPhase]     = useState<CardPhase>('arrange')
  const [revealIdx, setRevealIdx] = useState(-1)
  const [score,     setScore]     = useState({ me: 0, opp: 0 })
  const [log,       setLog]       = useState<LogEntry[]>([
    { ago: '0:00', text: `match started · ${tier.stakeKr} KR entry · pot ${tier.winnerGets} KR` },
  ])

  // Sudden death
  const [sdPick,    setSdPick]    = useState<Move | null>(null)
  const [sdBot,     setSdBot]     = useState<Move | null>(null)
  const [sdBusy,    setSdBusy]    = useState(false)
  const [sdRound,   setSdRound]   = useState(0)

  const placed    = mySeq.filter(m => m !== null).length
  const allPlaced = placed === 9

  // Bot simulate arranging: random pace, finishes before or around player
  useEffect(() => {
    if (phase !== 'arrange' || myLocked || botCount >= 9) return
    const id = setTimeout(() => setBotCount(c => c + 1), 2200 + Math.random() * 2800)
    return () => clearTimeout(id)
  }, [botCount, phase, myLocked])

  // Arrange countdown
  useEffect(() => {
    if (phase !== 'arrange' || myLocked || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, phase, myLocked])

  // Auto-fill + lock on timeout
  useEffect(() => {
    if (timeLeft > 0 || phase !== 'arrange' || myLocked) return
    const filled = [...mySeq] as (Move | null)[]
    const h = { ...myHand }
    for (let i = 0; i < 9; i++) {
      if (filled[i] === null) {
        const card = (['R', 'P', 'S'] as Move[]).find(m => h[m] > 0)
        if (card) { filled[i] = card; h[card]-- }
      }
    }
    setMySeq(filled)
    setMyHand(h)
    setMyLocked(true)
  }, [timeLeft, phase, myLocked, mySeq, myHand])

  // On lock: snap bot to 9, short pause, start reveal
  useEffect(() => {
    if (!myLocked || phase !== 'arrange') return
    setBotCount(9)
    const id = setTimeout(() => { setPhase('reveal'); setRevealIdx(0) }, 800)
    return () => clearTimeout(id)
  }, [myLocked, phase])

  // Reveal: slot by slot (2800ms normal, 3400ms for deciding slot 9)
  useEffect(() => {
    if (phase !== 'reveal' || revealIdx < 0 || revealIdx >= 9) return
    const isDecidingSlot = revealIdx === 8 && score.me === score.opp
    const id = setTimeout(() => {
      const myMove  = mySeq[revealIdx] as Move
      const oppMove = botSeq[revealIdx]
      const result  = cardOutcome(myMove, oppMove)
      setScore(s => ({ me: s.me + (result === 'win' ? 1 : 0), opp: s.opp + (result === 'loss' ? 1 : 0) }))
      setLog(l => [{
        ago: `${revealIdx + 1}/9`,
        text: `SLOT ${revealIdx + 1} · ${myMove} vs ${oppMove} · ${result === 'win' ? 'YOU +1' : result === 'loss' ? 'OPP +1' : 'TIE'}`,
        alarm: result === 'loss',
      }, ...l])
      if (revealIdx === 8) {
        let fm = 0, fo = 0
        for (let i = 0; i < 9; i++) {
          const r = cardOutcome(mySeq[i] as Move, botSeq[i])
          if (r === 'win') fm++; else if (r === 'loss') fo++
        }
        setTimeout(() => {
          if (fm === fo) {
            setPhase('sudden')
          } else {
            saveMatchResult({ game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee, winnerGets: tier.winnerGets, outcome: fm > fo ? 'win' : 'loss', myScore: fm, oppScore: fo, mySeq: mySeq as Move[], oppSeq: botSeq })
            setPhase('done')
            setTimeout(() => router.push(`/play/${slug}/result`), 1200)
          }
        }, 700)
      } else {
        setRevealIdx(i => i + 1)
      }
    }, isDecidingSlot ? 3400 : 2800)
    return () => clearTimeout(id)
  }, [phase, revealIdx, score, mySeq, botSeq, slug, tier, router])

  function placeCard(slotIdx: number) {
    if (phase !== 'arrange' || myLocked) return
    const existing = mySeq[slotIdx]
    const next = [...mySeq] as (Move | null)[]
    if (!selCard) {
      if (!existing) return
      next[slotIdx] = null
      setMySeq(next)
      setMyHand(h => ({ ...h, [existing]: h[existing] + 1 }))
      return
    }
    next[slotIdx] = selCard
    setMySeq(next)
    setMyHand(h => {
      const updated = { ...h, [selCard]: h[selCard] - 1 }
      if (existing) updated[existing] = updated[existing] + 1
      return updated
    })
    if (myHand[selCard] - (existing ? 0 : 1) <= 0) setSelCard(null)
  }

  function handleSuddenPick(card: Move) {
    if (sdBusy || sdPick) return
    setSdPick(card)
    setSdBusy(true)
    const bot = (['R', 'P', 'S'] as Move[])[Math.floor(Math.random() * 3)]
    setSdBot(bot)
    setTimeout(() => {
      const result = cardOutcome(card, bot)
      if (result === 'tie') {
        setLog(l => [{ ago: `SD${sdRound + 1}`, text: `SUDDEN DEATH · ${card} vs ${bot} · TIE — AGAIN` }, ...l])
        setSdRound(r => r + 1); setSdPick(null); setSdBot(null); setSdBusy(false)
      } else {
        let fm = 0, fo = 0
        for (let i = 0; i < 9; i++) { const r = cardOutcome(mySeq[i] as Move, botSeq[i]); if (r === 'win') fm++; else if (r === 'loss') fo++ }
        if (result === 'win') fm++; else fo++
        setLog(l => [{ ago: `SD${sdRound + 1}`, text: `SUDDEN DEATH · ${card} vs ${bot} · ${result === 'win' ? 'YOU WIN' : 'BOT WINS'}`, alarm: result === 'loss' }, ...l])
        saveMatchResult({ game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee, winnerGets: tier.winnerGets, outcome: result, myScore: fm, oppScore: fo, mySeq: mySeq as Move[], oppSeq: botSeq })
        setPhase('done')
        setTimeout(() => router.push(`/play/${slug}/result`), 1200)
      }
    }, 900)
  }

  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60
  const timerStr = `${mins}:${secs.toString().padStart(2, '0')}`
  const phaseLabel = phase === 'arrange' && !myLocked ? '● PHASE 1 · ARRANGE YOUR SEQUENCE ●'
    : phase === 'arrange' ? '● SEQUENCE LOCKED · AWAITING REVEAL ●'
    : phase === 'reveal' ? `● PHASE 2 · REVEALING SLOT ${revealIdx + 1} OF 9 ●`
    : phase === 'sudden' ? '● SUDDEN DEATH ●'
    : '● MATCH COMPLETE ●'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: gameBg, color: 'rgba(255,255,255,0.88)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >

      {/* ── Top bar ── */}
      <div style={{ padding: '12px 40px', borderBottom: gameDiv, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ ...gameMono, fontSize: 11, letterSpacing: '0.1em' }}>MATCH · CARD DUEL</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase' }}>{tier.stakeKr} KR ROOM</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ ...gameMono }}>{tier.winnerGets} KR POT</span>
          <button style={{ ...gameMono, border: gameDivS, padding: '5px 12px', color: 'rgba(255,255,255,0.38)', background: 'transparent', cursor: 'pointer' }}>FORFEIT</button>
        </div>
      </div>

      {/* ── Phase / timer bar ── */}
      <div style={{ padding: '20px 40px 16px', textAlign: 'center', borderBottom: gameDiv, background: phase === 'arrange' && !myLocked && timeLeft <= 10 ? 'rgba(248,113,113,0.06)' : 'transparent', transition: 'background 0.3s' }}>
        <div style={{ ...gameMono, fontSize: 10, marginBottom: 4, letterSpacing: '0.12em' }}>{phaseLabel}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88, lineHeight: 1, letterSpacing: '-0.04em', transition: 'color 0.3s', fontVariantNumeric: 'tabular-nums', color: phase === 'arrange' && !myLocked && timeLeft <= 10 ? gameLoss : phase === 'arrange' && !myLocked ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.18)' }}>
          {phase === 'arrange' && !myLocked ? timerStr : phase === 'sudden' ? (sdRound > 0 ? `SD ×${sdRound + 1}` : 'SD') : '—:——'}
        </div>
      </div>

      {/* ── Bot sequence strip ── */}
      <div style={{ padding: '16px 40px', borderBottom: gameDiv, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <span style={{ ...gameMono, fontSize: 9, minWidth: 110 }}>BOT · {phase === 'arrange' ? `${myLocked ? 9 : botCount}/9 SEALED` : '9/9'}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array(9).fill(null).map((_, i) => {
            const isRevealed = phase !== 'arrange' && i <= revealIdx
            const isLocked   = !isRevealed && (myLocked || i < botCount)
            const outcome    = isRevealed ? cardOutcome(mySeq[i] as Move, botSeq[i]) : null
            const bg     = isRevealed ? (outcome === 'win' ? 'rgba(245,158,11,0.10)' : outcome === 'loss' ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.05)') : isLocked ? 'rgba(255,255,255,0.04)' : 'transparent'
            const border = isRevealed ? (outcome === 'win' ? '1.5px solid rgba(245,158,11,0.35)' : outcome === 'loss' ? '1.5px solid rgba(248,113,113,0.35)' : '1px solid rgba(255,255,255,0.18)') : isLocked ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.06)'
            const ic     = outcome === 'win' ? gameWin : outcome === 'loss' ? gameLoss : 'rgba(255,255,255,0.55)'
            return (
              <div key={i} style={{ width: 44, height: 60, borderRadius: 4, border, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative', overflow: 'hidden' }}>
                {isLocked && !isRevealed && (
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 44 60" preserveAspectRatio="none">
                    <line x1="0" y1="60" x2="44" y2="0" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8"/>
                  </svg>
                )}
                <AnimatePresence mode="wait">
                  {isRevealed ? (
                    <motion.div key={`o${i}r`} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.28 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 1 }}>
                      <MoveIcon move={botSeq[i]} size={16} color={ic}/>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, color: ic }}>{botSeq[i]}</span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'rgba(255,255,255,0.15)', position: 'absolute', bottom: 2, zIndex: 1 }}>{i + 1}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── ARENA — flex 1, content centered ── */}
      <div style={{ flex: 1, display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>

        {/* Score — absolute left during reveal/sudden */}
        {phase !== 'arrange' && (
          <div style={{ position: 'absolute', left: 48, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ ...gameMono, fontSize: 9, marginBottom: 10 }}>YOU vs BOT</span>
            <motion.span key={`me-${score.me}`} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.3 }} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, lineHeight: 1, fontVariantNumeric: 'tabular-nums', display: 'block' }}>{score.me}</motion.span>
            <span style={{ ...gameMono, fontSize: 14, margin: '6px 0' }}>—</span>
            <motion.span key={`opp-${score.opp}`} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.3 }} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: gameLoss, display: 'block' }}>{score.opp}</motion.span>
          </div>
        )}

        {/* REVEAL: clash is the spectacle */}
        {phase === 'reveal' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: 480 }}>
            <span style={{ ...gameMono, fontSize: 11, letterSpacing: '0.12em' }}>SLOT {revealIdx + 1} OF 9</span>
            <div style={{ height: 210, width: '100%', position: 'relative' }}>
              <AnimatePresence>
                {revealIdx >= 0 && revealIdx < 9 && (
                  <motion.div key={`clash-${revealIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} style={{ position: 'absolute', inset: 0 }}>
                    <CardDuelClash
                      myMove={mySeq[revealIdx] as Move}
                      oppMove={botSeq[revealIdx]}
                      result={cardOutcome(mySeq[revealIdx] as Move, botSeq[revealIdx])}
                      slotIdx={revealIdx}
                      isDeciding={revealIdx === 8 && score.me === score.opp}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ display: 'flex', gap: 4, width: '100%' }}>
              {Array(9).fill(null).map((_, i) => {
                if (i > revealIdx) return <div key={i} style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
                const r = cardOutcome(mySeq[i] as Move, botSeq[i])
                return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: r === 'win' ? gameWin : r === 'loss' ? gameLoss : 'rgba(255,255,255,0.22)' }} />
              })}
            </div>
          </div>
        )}

        {/* ARRANGE: sequence centered */}
        {phase === 'arrange' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, width: '100%' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.10)', fontVariantNumeric: 'tabular-nums' }}>
              {tier.winnerGets} KR
            </div>
            <div>
              <div style={{ ...gameMono, fontSize: 9, marginBottom: 14, textAlign: 'center' }}>
                {myLocked ? 'SEQUENCE LOCKED' : allPlaced ? 'READY TO LOCK' : `YOUR SEQUENCE · ${placed}/9 PLACED`}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {mySeq.map((move, i) => {
                  const hasMov    = move !== null
                  const cardBg    = hasMov ? 'rgba(240,237,230,0.10)' : selCard ? 'rgba(255,255,255,0.04)' : 'transparent'
                  const cardBdr   = hasMov ? '1.5px solid rgba(240,237,230,0.35)' : selCard ? '1.5px dashed rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.10)'
                  const iconColor = hasMov ? 'rgba(240,237,230,0.88)' : 'rgba(255,255,255,0.15)'
                  return (
                    <div key={i} onClick={() => placeCard(i)}
                      style={{ width: 52, height: 72, borderRadius: 4, border: cardBdr, background: cardBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: !myLocked ? 'pointer' : 'default', transition: 'border 0.1s, background 0.1s', position: 'relative' }}>
                      <AnimatePresence mode="wait">
                        {hasMov ? (
                          <motion.div key={`m${i}${move}`} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <MoveIcon move={move!} size={22} color={iconColor}/>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, color: iconColor }}>{move}</span>
                          </motion.div>
                        ) : (
                          <motion.span key={`m${i}e`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'rgba(255,255,255,0.12)' }}>—</motion.span>
                        )}
                      </AnimatePresence>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'rgba(255,255,255,0.18)', position: 'absolute', bottom: 3 }}>{i + 1}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUDDEN DEATH */}
        {phase === 'sudden' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, width: '100%', maxWidth: 520 }}>
            <div style={{ ...gameMono, fontSize: 10, letterSpacing: '0.12em' }}>
              SUDDEN DEATH{sdRound > 0 ? ` · ROUND ${sdRound + 1}` : ''} — PICK ONE CARD
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {(['R', 'P', 'S'] as Move[]).map(card => (
                <button key={card} onClick={() => handleSuddenPick(card)} disabled={sdBusy || !!sdPick}
                  style={{ width: 100, height: 132, borderRadius: 6, border: sdPick === card ? '2px solid rgba(255,255,255,0.88)' : '1.5px solid rgba(255,255,255,0.20)', background: sdPick === card ? 'rgba(255,255,255,0.10)' : 'transparent', cursor: sdBusy || !!sdPick ? 'not-allowed' : 'pointer', transition: 'all 0.12s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: sdBusy && sdPick !== card ? 0.3 : 1 }}>
                  <MoveIcon move={card} size={36} color={sdPick === card ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.45)'}/>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: sdPick === card ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.40)' }}>{card}</span>
                </button>
              ))}
              {sdBot && (
                <div style={{ marginLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  <span style={{ ...gameMono, fontSize: 9 }}>BOT</span>
                  <div style={{ width: 100, height: 132, borderRadius: 6, border: `1.5px solid rgba(248,113,113,0.50)`, background: 'rgba(248,113,113,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <MoveIcon move={sdBot} size={36} color={gameLoss}/>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: gameLoss }}>{sdBot}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MATCH COMPLETE banner */}
        <AnimatePresence>
          {phase === 'done' && (() => {
            let fm = 0, fo = 0
            for (let i = 0; i < 9; i++) { const r = cardOutcome(mySeq[i] as Move, botSeq[i]); if (r === 'win') fm++; else if (r === 'loss') fo++ }
            const won = fm > fo
            return (
              <motion.div
                key="match-end"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, textTransform: 'uppercase', letterSpacing: '-0.03em', color: won ? gameWin : gameLoss }}>
                  {won ? 'YOU WIN.' : 'YOU LOSE.'}
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>

      {/* ── Action feed right rail ── */}
      <div style={{ width: 220, borderLeft: gameDiv, padding: '20px 16px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <ActionFeed entries={log} />
      </div>
      </div>

      {/* ── Player sequence strip (reveal/sudden only) ── */}
      {phase !== 'arrange' && (
        <div style={{ padding: '16px 40px', borderTop: gameDiv, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <span style={{ ...gameMono, fontSize: 9, minWidth: 110 }}>YOU · 9/9</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {mySeq.map((move, i) => {
              const isActive = phase === 'reveal' && i === revealIdx
              const outcome  = move ? cardOutcome(move, botSeq[i]) : null
              const ic       = outcome === 'win' ? gameWin : outcome === 'loss' ? gameLoss : 'rgba(255,255,255,0.65)'
              const bg       = outcome === 'win' ? 'rgba(245,158,11,0.10)' : outcome === 'loss' ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.04)'
              const border   = isActive ? '2px solid rgba(255,255,255,0.70)' : outcome === 'win' ? '1.5px solid rgba(245,158,11,0.35)' : outcome === 'loss' ? '1.5px solid rgba(248,113,113,0.35)' : '1px solid rgba(255,255,255,0.14)'
              return (
                <div key={i} style={{ width: 44, height: 60, borderRadius: 4, border, background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative', overflow: 'hidden' }}>
                  <AnimatePresence mode="wait">
                    {outcome !== null ? (
                      <motion.div key={`p${i}r`} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 1 }}>
                        {move && <MoveIcon move={move} size={16} color={ic}/>}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, color: ic }}>{move}</span>
                      </motion.div>
                    ) : (
                      <motion.div key={`p${i}e`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        {move && <MoveIcon move={move} size={16} color={ic}/>}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, color: ic }}>{move}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'rgba(255,255,255,0.15)', position: 'absolute', bottom: 2 }}>{i + 1}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Floor: paper hand ── */}
      {phase === 'arrange' && !myLocked ? (
        <div style={{ padding: '24px 40px', background: '#1a1610', borderTop: '1px solid rgba(240,237,230,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(240,237,230,0.30)' }}>YOUR HAND · SELECT A CARD, THEN CLICK A SLOT</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {(['R', 'P', 'S'] as Move[]).map(card => {
                const count = myHand[card]
                const isSel = selCard === card
                if (count === 0) return null
                return (
                  <button key={card} onClick={() => setSelCard(isSel ? null : card)}
                    style={{ width: 80, height: 104, borderRadius: 4, border: isSel ? '2px solid rgba(240,237,230,0.80)' : '1.5px solid rgba(240,237,230,0.14)', background: isSel ? 'rgba(240,237,230,0.12)' : 'rgba(240,237,230,0.04)', cursor: 'pointer', position: 'relative', transition: 'all 0.1s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: isSel ? '0 4px 22px rgba(0,0,0,0.40)' : 'none' }}>
                    <MoveIcon move={card} size={34} color={isSel ? 'rgba(240,237,230,0.95)' : 'rgba(240,237,230,0.55)'}/>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: isSel ? 'rgba(240,237,230,0.95)' : 'rgba(240,237,230,0.50)' }}>{card}</span>
                    <span style={{ position: 'absolute', top: 7, right: 9, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(240,237,230,0.28)' }}>×{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setMyLocked(true)} disabled={!allPlaced}
              style={{ height: 104, padding: '0 44px', background: allPlaced ? 'rgba(240,237,230,0.10)' : 'transparent', color: allPlaced ? 'rgba(240,237,230,0.88)' : 'rgba(240,237,230,0.22)', border: allPlaced ? '1.5px solid rgba(240,237,230,0.50)' : '1.5px solid rgba(240,237,230,0.08)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: allPlaced ? 'pointer' : 'not-allowed', transition: 'all 0.1s', borderRadius: 4, whiteSpace: 'nowrap' }}>
              {allPlaced ? 'LOCK SEQUENCE →' : `PLACE ${9 - placed} MORE`}
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', color: 'rgba(240,237,230,0.25)' }}>ENTRY {tier.stakeKr} · FEE {tier.entryFee} · WIN TAKES {tier.winnerGets}</span>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 40px', background: 'rgba(255,255,255,0.02)', borderTop: gameDiv, textAlign: 'center' }}>
          <span style={{ ...gameMono, fontSize: 11, color: phase === 'done' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.55)' }}>
            {phase === 'arrange' ? '● SEQUENCE LOCKED · AWAITING REVEAL ●'
              : phase === 'reveal' ? '● REVEALING CARDS ●'
              : phase === 'sudden' ? '● SUDDEN DEATH IN PROGRESS ●'
              : '● LOADING RESULT ●'}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// CYCLEDUEL
// ════════════════════════════════════════════════════════════════

type CycleMove = 'Feint' | 'Guard' | 'Strike' | 'Rush' | 'Grab'

const CYCLE_BEATS: Record<CycleMove, [CycleMove, CycleMove]> = {
  Feint:  ['Guard',  'Strike'],
  Guard:  ['Strike', 'Rush'  ],
  Strike: ['Rush',   'Grab'  ],
  Rush:   ['Grab',   'Feint' ],
  Grab:   ['Feint',  'Guard' ],
}

function cycleOutcome(me: CycleMove, opp: CycleMove): 'win' | 'loss' | 'tie' {
  if (me === opp) return 'tie'
  return CYCLE_BEATS[me].includes(opp) ? 'win' : 'loss'
}

const CYCLE_ALL: CycleMove[] = ['Feint', 'Guard', 'Strike', 'Rush', 'Grab']

const CYCLE_COLORS: Record<CycleMove, string> = {
  Feint:  'rgba(139,92,246,0.18)',
  Guard:  'rgba(59,130,246,0.18)',
  Strike: 'rgba(239,68,68,0.18)',
  Rush:   'rgba(34,197,94,0.18)',
  Grab:   'rgba(245,158,11,0.18)',
}
const CYCLE_BORDERS: Record<CycleMove, string> = {
  Feint:  'rgba(139,92,246,0.55)',
  Guard:  'rgba(59,130,246,0.55)',
  Strike: 'rgba(239,68,68,0.55)',
  Rush:   'rgba(34,197,94,0.55)',
  Grab:   'rgba(245,158,11,0.55)',
}

function randomFromHand(hand: Record<CycleMove, number>): CycleMove | null {
  const available = CYCLE_ALL.filter(m => hand[m] > 0)
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

function randomSeq(hand: Record<CycleMove, number>, count: number, mustInclude?: CycleMove): CycleMove[] {
  const pool: CycleMove[] = CYCLE_ALL.flatMap(m => Array(hand[m]).fill(m))
  const shuffled = shuffleArray(pool)
  const picks: CycleMove[] = []
  if (mustInclude && hand[mustInclude] > 0) {
    picks.push(mustInclude)
  }
  for (const c of shuffled) {
    if (picks.length >= count) break
    if (mustInclude && picks.length === 0) continue
    picks.push(c)
  }
  return picks.slice(0, count)
}

function CycleDuelMatch({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = parseTier(searchParams.get('tier'))

  const initHand = (): Record<CycleMove, number> => ({ Feint: 2, Guard: 2, Strike: 2, Rush: 2, Grab: 2 })

  const [block,    setBlock]    = useState(1)
  const [hand,     setHand]     = useState<Record<CycleMove, number>>(initHand)
  const [botHand,  setBotHand]  = useState<Record<CycleMove, number>>(initHand)
  const [sequence, setSequence] = useState<(CycleMove | null)[]>([null, null, null])
  const [score,    setScore]    = useState({ me: 0, opp: 0 })
  const [myPeek,   setMyPeek]   = useState<CycleMove | null>(null)
  const [oppPeek,  setOppPeek]  = useState<CycleMove | null>(null)
  const [blockPhase, setBlockPhase] = useState<'choosePeek' | 'bench' | 'lock' | 'waiting'>('choosePeek')
  const [benchCards, setBenchCards] = useState<CycleMove[]>([])
  const [timeLeft,   setTimeLeft]   = useState(30)
  const [blockLog,   setBlockLog]   = useState<string[]>([])

  // Sudden death
  const [gamePhase, setGamePhase] = useState<'game' | 'sudden' | 'done'>('game')
  const [sdPick,    setSdPick]    = useState<CycleMove | null>(null)
  const [sdBot,     setSdBot]     = useState<CycleMove | null>(null)
  const [sdBusy,    setSdBusy]    = useState(false)
  const [sdRound,   setSdRound]   = useState(0)
  const roundMovesRef = useRef<{ my: CycleMove; bot: CycleMove }[]>([])

  const totalHand = Object.values(hand).reduce((a, b) => a + b, 0)
  const seqFull   = sequence.every(s => s !== null)
  const nextEmpty = sequence.findIndex(s => s === null)

  // Timer
  useEffect(() => {
    if (blockPhase !== 'lock' || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, blockPhase])

  // Setup new block
  const setupBlock = useCallback((b: number, h: Record<CycleMove, number>, bh: Record<CycleMove, number>) => {
    const botPeekCard = randomFromHand(bh)
    setOppPeek(botPeekCard)
    setMyPeek(null)
    setSequence([null, null, null])
    setTimeLeft(30)
    setBlockLog([])
    if (b === 3) {
      const cards = CYCLE_ALL.filter(m => h[m] > 0)
      setBenchCards(cards)
      setBlockPhase('bench')
    } else {
      setBlockPhase('choosePeek')
    }
  }, [])

  useEffect(() => {
    setupBlock(1, initHand(), initHand())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const choosePeek = (card: CycleMove) => {
    if (blockPhase !== 'choosePeek') return
    setMyPeek(card)
    setBlockPhase('lock')
  }

  const benchCard = (card: CycleMove) => {
    const newHand = { ...hand, [card]: hand[card] - 1 }
    setHand(newHand)
    const botBench = randomFromHand(botHand)
    const newBotHand = botBench ? { ...botHand, [botBench]: botHand[botBench] - 1 } : { ...botHand }
    setBotHand(newBotHand)
    const botPeekCard = randomFromHand(newBotHand)
    setOppPeek(botPeekCard)
    setMyPeek(null)
    setSequence([null, null, null])
    setTimeLeft(30)
    setBlockLog([])
    setBlockPhase('choosePeek')
  }

  const addToSequence = (move: CycleMove) => {
    if (hand[move] === 0 || seqFull || blockPhase !== 'lock') return
    const next = [...sequence]
    next[nextEmpty] = move
    setSequence(next)
    setHand(h => ({ ...h, [move]: h[move] - 1 }))
  }

  const removeFromSequence = (idx: number) => {
    const move = sequence[idx]
    if (!move) return
    const next = [...sequence]
    next[idx] = null
    setSequence(next)
    setHand(h => ({ ...h, [move]: h[move] + 1 }))
  }

  const lockBlock = useCallback(() => {
    if (!seqFull || blockPhase !== 'lock') return
    setBlockPhase('waiting')

    const mySeq = sequence as CycleMove[]
    const botSeq = randomSeq(botHand, 3, oppPeek ?? undefined)
    const usedByBot = { ...botHand }
    botSeq.forEach(c => { usedByBot[c] = Math.max(0, usedByBot[c] - 1) })

    roundMovesRef.current = [...roundMovesRef.current, ...mySeq.map((my, i) => ({ my, bot: botSeq[i] }))]

    let newMe = score.me, newOpp = score.opp
    const log: string[] = []
    for (let i = 0; i < 3; i++) {
      const res = cycleOutcome(mySeq[i], botSeq[i])
      if (res === 'win')  { newMe++;  log.push(`ROUND ${(block-1)*3 + i+1} · YOU: ${mySeq[i]} vs OPP: ${botSeq[i]} · YOU +1`) }
      if (res === 'loss') { newOpp++; log.push(`ROUND ${(block-1)*3 + i+1} · YOU: ${mySeq[i]} vs OPP: ${botSeq[i]} · OPP +1`) }
      if (res === 'tie')  { log.push(`ROUND ${(block-1)*3 + i+1} · ${mySeq[i]} vs ${botSeq[i]} · TIE`) }
    }
    setScore({ me: newMe, opp: newOpp })
    setBlockLog(log)
    setBotHand(usedByBot)

    if (block === 3) {
      if (newMe === newOpp) {
        setGamePhase('sudden')
      } else {
        const outcome = newMe > newOpp ? 'win' : 'loss'
        saveMatchResult({
          game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee,
          winnerGets: tier.winnerGets, outcome, myScore: newMe, oppScore: newOpp,
          mySeq: roundMovesRef.current.map(r => r.my),
          oppSeq: roundMovesRef.current.map(r => r.bot),
          myMoves: [0,1,2].map(b => roundMovesRef.current.slice(b*3, b*3+3).map(r => r.my)),
          oppMoves: [0,1,2].map(b => roundMovesRef.current.slice(b*3, b*3+3).map(r => r.bot)),
        })
        setTimeout(() => router.push(`/play/${slug}/result`), 2000)
      }
    } else {
      setTimeout(() => {
        const nextBlock = block + 1
        setBlock(nextBlock)
        setupBlock(nextBlock, hand, usedByBot)
      }, 2000)
    }
  }, [seqFull, blockPhase, sequence, botHand, oppPeek, score, block, hand, slug, tier, router, setupBlock])

  function handleSuddenPick(card: CycleMove) {
    if (sdBusy || sdPick) return
    setSdPick(card)
    setSdBusy(true)
    const bot = CYCLE_ALL[Math.floor(Math.random() * 5)]
    setSdBot(bot)
    setTimeout(() => {
      const result = cycleOutcome(card, bot)
      if (result === 'tie') {
        setSdRound(r => r + 1); setSdPick(null); setSdBot(null); setSdBusy(false)
      } else {
        saveMatchResult({
          game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee,
          winnerGets: tier.winnerGets, outcome: result,
          myScore: score.me + (result === 'win' ? 1 : 0),
          oppScore: score.opp + (result === 'loss' ? 1 : 0),
          mySeq: roundMovesRef.current.map(r => r.my),
          oppSeq: roundMovesRef.current.map(r => r.bot),
          myMoves: [0,1,2].map(b => roundMovesRef.current.slice(b*3, b*3+3).map(r => r.my)),
          oppMoves: [0,1,2].map(b => roundMovesRef.current.slice(b*3, b*3+3).map(r => r.bot)),
        })
        setGamePhase('done')
        setTimeout(() => router.push(`/play/${slug}/result`), 1200)
      }
    }, 900)
  }

  // Auto-lock on timeout
  useEffect(() => {
    if (timeLeft > 0 || blockPhase !== 'lock') return
    if (!seqFull) {
      const available = CYCLE_ALL.filter(m => hand[m] > 0)
      let next = [...sequence]
      let h = { ...hand }
      for (const slot of next.map((s, i) => ({ s, i })).filter(({ s }) => s === null)) {
        const card = available.find(m => h[m] > 0)
        if (!card) break
        next[slot.i] = card
        h[card]--
      }
      setSequence(next)
      setHand(h)
    }
    lockBlock()
  }, [timeLeft, blockPhase, seqFull, sequence, hand, lockBlock])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...dark, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '12px 40px', borderBottom: div, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--concrete-2)' }}>
        <span style={{ ...mono, fontSize: 11 }}>MATCH · CYCLEDUEL</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ ...mono, fontSize: 10, color: 'var(--bone-faint)' }}>BLOCK {block} OF 3</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{tier.stakeKr} KR ROOM</span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ ...mono, color: 'var(--bone-faint)' }}>{tier.winnerGets} KR POT</span>
          <button style={{ ...mono, border: '1px solid rgba(240,237,228,0.2)', padding: '5px 12px', color: 'var(--bone-faint)', background: 'transparent', cursor: 'pointer' }}>FORFEIT</button>
        </div>
      </div>

      <div style={{ padding: '16px 40px', textAlign: 'center', borderBottom: div }}>
        <div style={{ ...mono, fontSize: 10, color: 'rgba(240,237,228,0.4)', marginBottom: 4, letterSpacing: '0.12em' }}>
          {gamePhase === 'sudden' ? `● SUDDEN DEATH${sdRound > 0 ? ` · ROUND ${sdRound + 1}` : ''} ●`
            : blockPhase === 'choosePeek' ? `● BLOCK ${block} · CHOOSE YOUR PEEK CARD ●`
            : blockPhase === 'bench'      ? '● BLOCK 3 · BENCH ONE CARD ●'
            : blockPhase === 'lock'       ? '● LOCK YOUR 3-CARD SEQUENCE ●'
            : '● RESOLVING BLOCK ●'}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, lineHeight: 1, letterSpacing: '-0.04em', color: timeLeft <= 5 && blockPhase === 'lock' ? 'var(--alarm)' : 'var(--bone-on-dark)', fontVariantNumeric: 'tabular-nums' }}>
          {gamePhase === 'sudden' ? (sdRound > 0 ? `SD ×${sdRound + 1}` : 'SD')
            : blockPhase === 'lock' ? `${mins}:${secs.toString().padStart(2, '0')}`
            : '—:——'}
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr 180px', borderBottom: div }}>

        {/* Left: opponent + score + cycle ref */}
        <div style={{ borderRight: div, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 6 }}>OPPONENT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>BOT</div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginTop: 2 }}>PRACTICE OPPONENT</div>
          </div>
          <div style={{ borderTop: div, paddingTop: 14 }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 8 }}>SCORE · YOU vs OPP</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36 }}>{score.me}</span>
              <span style={{ ...mono, color: 'var(--bone-faint)' }}>—</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--alarm)' }}>{score.opp}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[1, 2, 3].map(b => (
                <div key={b} style={{ width: 8, height: 8, borderRadius: '50%', background: b < block ? 'var(--bone-on-dark)' : b === block ? 'rgba(240,237,228,0.45)' : 'rgba(240,237,228,0.1)', border: b === block ? '1.5px solid rgba(240,237,228,0.6)' : 'none' }} />
              ))}
            </div>
          </div>
          {blockLog.length > 0 && (
            <div style={{ borderTop: div, paddingTop: 14 }}>
              <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 8 }}>LAST BLOCK</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {blockLog.map((l, i) => {
                  const isWin = l.includes('YOU +1')
                  const isLoss = l.includes('OPP +1')
                  return <div key={i} style={{ ...mono, fontSize: 8, color: isWin ? gameWin : isLoss ? 'var(--alarm)' : 'var(--bone-faint)', lineHeight: 1.4 }}>{l}</div>
                })}
              </div>
            </div>
          )}
          <div style={{ borderTop: div, paddingTop: 14, marginTop: 'auto' }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 10 }}>THE CYCLE</div>
            {CYCLE_ALL.map(move => (
              <div key={move} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: '1px solid rgba(240,237,228,0.05)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 1, background: CYCLE_BORDERS[move], flexShrink: 0 }} />
                <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: 'var(--bone-on-dark)', minWidth: 44 }}>{move.toUpperCase()}</span>
                <span style={{ ...mono, fontSize: 8, color: 'rgba(240,237,228,0.3)' }}>→ {CYCLE_BEATS[move][0].slice(0, 3)}/{CYCLE_BEATS[move][1].slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Sudden death */}
          {gamePhase === 'sudden' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.1em' }}>
                SUDDEN DEATH{sdRound > 0 ? ` · ROUND ${sdRound + 1}` : ''} — PICK ONE TYPE · BOTH REVEAL AT ONCE
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {CYCLE_ALL.map(card => (
                  <button key={card} onClick={() => handleSuddenPick(card)} disabled={sdBusy || !!sdPick}
                    style={{ flex: 1, height: 96, border: sdPick === card ? `2px solid ${CYCLE_BORDERS[card]}` : `1.5px solid ${CYCLE_BORDERS[card]}`, background: sdPick === card ? CYCLE_COLORS[card] : 'transparent', color: 'var(--bone-on-dark)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', cursor: sdBusy || !!sdPick ? 'not-allowed' : 'pointer', transition: 'all 0.12s', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, opacity: sdBusy && sdPick !== card ? 0.3 : 1 }}>
                    {card}
                  </button>
                ))}
              </div>
              {sdBot && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', border: `1.5px solid ${CYCLE_BORDERS[sdBot]}`, background: CYCLE_COLORS[sdBot], borderRadius: 2 }}>
                  <span style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>BOT PLAYED</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, textTransform: 'uppercase', color: 'var(--alarm)' }}>{sdBot}</span>
                  {sdPick && (
                    <span style={{ ...mono, fontSize: 9, marginLeft: 8, color: cycleOutcome(sdPick, sdBot) === 'win' ? gameWin : cycleOutcome(sdPick, sdBot) === 'loss' ? 'var(--alarm)' : 'var(--bone-faint)' }}>
                      {cycleOutcome(sdPick, sdBot) === 'tie' ? '— TIE · PLAY AGAIN' : cycleOutcome(sdPick, sdBot) === 'win' ? '— YOU WIN' : '— BOT WINS'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {gamePhase === 'game' && <>

            {/* Bench phase */}
            <AnimatePresence>
              {blockPhase === 'bench' && (
                <motion.div
                  key="bench-phase"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>BLOCK 3 · PICK ONE CARD TO BENCH — IT SITS OUT THIS BLOCK</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {benchCards.map((card, i) => (
                      <button key={i} onClick={() => benchCard(card)}
                        style={{ flex: 1, height: 96, border: `1.5px solid ${CYCLE_BORDERS[card]}`, background: CYCLE_COLORS[card], color: 'var(--bone-on-dark)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 2, transition: 'all 0.12s' }}>
                        <span style={{ ...mono, fontSize: 9 }}>{card.toUpperCase()}</span>
                        <span style={{ ...mono, fontSize: 7, color: 'rgba(239,0,0,0.8)' }}>BENCH</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Choose peek phase */}
            {blockPhase === 'choosePeek' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>REVEAL ONE CARD TO YOUR OPPONENT — THEY SEE TYPE, NOT SLOT</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CYCLE_ALL.map(move => {
                    const count = hand[move]
                    if (count === 0) return null
                    return (
                      <button key={move} onClick={() => choosePeek(move)}
                        style={{ flex: 1, height: 96, border: `1.5px solid ${CYCLE_BORDERS[move]}`, background: CYCLE_COLORS[move], color: 'var(--bone-on-dark)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 2, transition: 'all 0.12s', position: 'relative' }}>
                        <span style={{ ...mono, fontSize: 11 }}>{move.toUpperCase()}</span>
                        {count > 1 && <span style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.45)', position: 'absolute', top: 7, right: 9 }}>×{count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Lock / waiting phases */}
            {(blockPhase === 'lock' || blockPhase === 'waiting') && (
              <>
                {/* Peek exchange */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <motion.div
                    key={`peek-${block}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.3 }}
                    style={{ padding: '16px', border: oppPeek ? `1.5px solid ${CYCLE_BORDERS[oppPeek]}` : '1px solid rgba(240,237,228,0.1)', background: oppPeek ? CYCLE_COLORS[oppPeek] : 'rgba(239,0,0,0.04)', borderRadius: 2, minHeight: 88, display: 'flex', flexDirection: 'column', gap: 6 }}
                  >
                    <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>OPP REVEALED</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, textTransform: 'uppercase', color: oppPeek ? 'var(--alarm)' : 'rgba(240,237,228,0.15)' }}>
                      {oppPeek ?? '?'}
                    </div>
                    <div style={{ ...mono, fontSize: 8, color: 'rgba(240,237,228,0.3)', marginTop: 'auto' }}>KNOW TYPE · NOT SLOT</div>
                  </motion.div>
                  <div style={{ padding: '16px', border: myPeek ? `1.5px solid ${CYCLE_BORDERS[myPeek]}` : '1px solid rgba(240,237,228,0.1)', background: myPeek ? CYCLE_COLORS[myPeek] : 'rgba(240,237,228,0.02)', borderRadius: 2, minHeight: 88, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>YOU REVEALED</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, textTransform: 'uppercase', color: myPeek ? 'var(--bone-on-dark)' : 'rgba(240,237,228,0.15)' }}>
                      {myPeek ?? '—'}
                    </div>
                    <div style={{ ...mono, fontSize: 8, color: 'rgba(240,237,228,0.3)', marginTop: 'auto' }}>OPP SEES THIS</div>
                  </div>
                </div>

                {/* Sequence — 3 slots */}
                <div>
                  <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 10 }}>YOUR SEQUENCE — BLOCK {block}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {sequence.map((move, i) => (
                      <button key={i} onClick={() => move && removeFromSequence(i)}
                        style={{ height: 88, border: move ? `1.5px solid ${CYCLE_BORDERS[move as CycleMove]}` : '1.5px dashed rgba(240,237,228,0.18)', background: move ? CYCLE_COLORS[move as CycleMove] : 'rgba(240,237,228,0.02)', color: 'var(--bone-on-dark)', cursor: move ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 2, transition: 'all 0.1s', overflow: 'hidden' }}>
                        <AnimatePresence mode="wait">
                          {move ? (
                            <motion.div key={`seq-${i}-${move}`} initial={{ y: -16, opacity: 0, scale: 0.85 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 10, opacity: 0, scale: 0.85 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>{move}</span>
                              <span style={{ ...mono, fontSize: 7, color: 'rgba(240,237,228,0.3)' }}>TAP TO REMOVE</span>
                            </motion.div>
                          ) : (
                            <motion.div key={`seq-${i}-empty`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                              <span style={{ ...mono, fontSize: 11, color: 'rgba(240,237,228,0.2)' }}>—</span>
                              <span style={{ ...mono, fontSize: 8, color: 'rgba(240,237,228,0.15)' }}>SLOT {i + 1}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hand — one tile per type with count badge */}
                <div>
                  <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 10 }}>YOUR HAND · {totalHand} CARDS LEFT</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {CYCLE_ALL.map(move => {
                      const count = hand[move]
                      if (count === 0) return null
                      const disabled = seqFull || blockPhase === 'waiting'
                      return (
                        <button key={move} onClick={() => addToSequence(move)} disabled={disabled}
                          style={{ flex: 1, height: 72, border: disabled ? '1px solid rgba(240,237,228,0.08)' : `1.5px solid ${CYCLE_BORDERS[move]}`, background: disabled ? 'rgba(240,237,228,0.02)' : CYCLE_COLORS[move], color: disabled ? 'rgba(240,237,228,0.25)' : 'var(--bone-on-dark)', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 2, transition: 'all 0.1s', position: 'relative' }}>
                          <span style={{ ...mono, fontSize: 9, textTransform: 'uppercase' }}>{move}</span>
                          {count > 1 && <span style={{ ...mono, fontSize: 7, color: 'rgba(240,237,228,0.4)', position: 'absolute', top: 6, right: 8 }}>×{count}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Waiting: block resolve log */}
                {blockPhase === 'waiting' && blockLog.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 16px', border: '1px solid rgba(240,237,228,0.08)', background: 'rgba(240,237,228,0.02)', borderRadius: 2 }}>
                    {blockLog.map((l, i) => {
                      const isWin = l.includes('YOU +1')
                      const isLoss = l.includes('OPP +1')
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.25 }} style={{ ...mono, fontSize: 9, color: isWin ? gameWin : isLoss ? 'var(--alarm)' : 'rgba(240,237,228,0.4)', lineHeight: 1.5 }}>
                          {l}
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </>}
        </div>

        {/* Right: pot + lock */}
        <div style={{ borderLeft: div, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 6 }}>POT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em' }}>{tier.winnerGets} KR</div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginTop: 4 }}>ENTRY {tier.stakeKr} KR</div>
          </div>
          {(blockPhase === 'lock' || blockPhase === 'waiting') && (
            <button onClick={lockBlock} disabled={!seqFull || blockPhase !== 'lock'}
              style={{ background: seqFull && blockPhase === 'lock' ? 'var(--alarm)' : 'rgba(239,0,0,0.15)', color: seqFull && blockPhase === 'lock' ? '#fff' : 'rgba(239,0,0,0.4)', border: 'none', padding: '18px 12px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: seqFull && blockPhase === 'lock' ? 'pointer' : 'not-allowed', transition: 'all 0.1s' }}>
              {blockPhase === 'waiting' ? 'RESOLVING…' : seqFull ? `LOCK BLOCK ${block} →` : 'FILL SEQUENCE'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// DROPDUEL
// ════════════════════════════════════════════════════════════════

type CellState = null | 'me' | 'opp' | 'block-me' | 'block-opp'
const ROWS = 6, COLS = 7

function cellColor(cell: CellState): string {
  if (cell === 'me')        return 'rgba(29,138,58,0.7)'
  if (cell === 'opp')       return 'rgba(239,0,0,0.5)'
  if (cell === 'block-me')  return 'rgba(29,138,58,0.2)'
  if (cell === 'block-opp') return 'rgba(239,0,0,0.15)'
  return 'transparent'
}

function cellBorder(cell: CellState): string {
  if (cell === 'me')        return '1.5px solid rgba(29,138,58,0.9)'
  if (cell === 'opp')       return '1.5px solid rgba(239,0,0,0.7)'
  if (cell === 'block-me')  return '1.5px dashed rgba(29,138,58,0.4)'
  if (cell === 'block-opp') return '1.5px dashed rgba(239,0,0,0.3)'
  return '1px solid rgba(240,237,228,0.1)'
}

function checkWinner(board: CellState[][]): 'me' | 'opp' | null {
  const pieces: Array<'me' | 'opp'> = ['me', 'opp']
  for (const p of pieces) {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c <= COLS - 4; c++)
        if ([0,1,2,3].every(i => board[r][c+i] === p)) return p
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r <= ROWS - 4; r++)
        if ([0,1,2,3].every(i => board[r+i][c] === p)) return p
    for (let r = 0; r <= ROWS - 4; r++)
      for (let c = 0; c <= COLS - 4; c++)
        if ([0,1,2,3].every(i => board[r+i][c+i] === p)) return p
    for (let r = 3; r < ROWS; r++)
      for (let c = 0; c <= COLS - 4; c++)
        if ([0,1,2,3].every(i => board[r-i][c+i] === p)) return p
  }
  return null
}

function findWinningCells(board: CellState[][]): [number, number][] {
  const pieces: Array<'me' | 'opp'> = ['me', 'opp']
  for (const p of pieces) {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c <= COLS - 4; c++)
        if ([0,1,2,3].every(i => board[r][c+i] === p)) return [0,1,2,3].map(i => [r, c+i] as [number,number])
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r <= ROWS - 4; r++)
        if ([0,1,2,3].every(i => board[r+i][c] === p)) return [0,1,2,3].map(i => [r+i, c] as [number,number])
    for (let r = 0; r <= ROWS - 4; r++)
      for (let c = 0; c <= COLS - 4; c++)
        if ([0,1,2,3].every(i => board[r+i][c+i] === p)) return [0,1,2,3].map(i => [r+i, c+i] as [number,number])
    for (let r = 3; r < ROWS; r++)
      for (let c = 0; c <= COLS - 4; c++)
        if ([0,1,2,3].every(i => board[r-i][c+i] === p)) return [0,1,2,3].map(i => [r-i, c+i] as [number,number])
  }
  return []
}

function DropDuelMatch({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = parseTier(searchParams.get('tier'))

  // Phase 1 — block placement
  const [dropPhase, setDropPhase] = useState<'block' | 'reveal' | 'play'>('block')
  const [myBlockCell, setMyBlockCell] = useState<[number, number] | null>(null)
  const myBlockRef = useRef<[number, number] | null>(null)
  const [blockTimer, setBlockTimer] = useState(15)
  const [botBlockCell] = useState<[number, number]>(() => [
    1 + Math.floor(Math.random() * 4),
    Math.floor(Math.random() * COLS),
  ])

  function selectBlock(cell: [number, number] | null) {
    myBlockRef.current = cell
    setMyBlockCell(cell)
  }

  // Phase 2 — play
  const [board, setBoard] = useState<CellState[][]>(() =>
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  )
  const [myTurn, setMyTurn] = useState(true)
  const [playTimer, setPlayTimer] = useState(14)
  const [winner, setWinner] = useState<'me' | 'opp' | null>(null)
  const [winCells, setWinCells] = useState<[number, number][]>([])
  const [isDraw, setIsDraw] = useState(false)
  const prevBoardRef = useRef<CellState[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)))

  function doReveal(cell: [number, number]) {
    const [mr, mc] = cell
    const [br, bc] = botBlockCell
    const nb: CellState[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
    nb[mr][mc] = 'block-me'
    if (br !== mr || bc !== mc) nb[br][bc] = 'block-opp'
    myBlockRef.current = cell
    setMyBlockCell(cell)
    setBoard(nb)
    setDropPhase('reveal')
    setTimeout(() => {
      animate('#drop-board', { translateX: [0, -4, 4, -3, 3, 0], duration: 500, easing: 'linear' })
      setDropPhase('play')
    }, 1400)
  }

  // Phase 1 timer
  useEffect(() => {
    if (dropPhase !== 'block' || blockTimer <= 0) return
    const id = setTimeout(() => setBlockTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [blockTimer, dropPhase])

  // Phase 1 timeout → auto-reveal
  useEffect(() => {
    if (dropPhase !== 'block' || blockTimer > 0) return
    const cell = myBlockRef.current ?? [
      1 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * COLS),
    ] as [number, number]
    doReveal(cell)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockTimer, dropPhase])

  // Phase 2 timer
  useEffect(() => {
    if (dropPhase !== 'play' || !myTurn || winner || playTimer <= 0) return
    const id = setTimeout(() => setPlayTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [playTimer, dropPhase, myTurn, winner])

  const finishGame = useCallback((w: 'me' | 'opp' | 'draw', b: CellState[][]) => {
    if (w !== 'draw') {
      setWinner(w)
      const cells = findWinningCells(b)
      setWinCells(cells)
      setTimeout(() => router.push(`/play/${slug}/result`), 2500 + cells.length * 120)
    } else {
      setIsDraw(true)
      setTimeout(() => {
        animate('.board-cell', { opacity: [1, 0.2], duration: 800, delay: stagger(40, { from: 'last' }), easing: 'easeOutQuad' })
      }, 100)
      setTimeout(() => router.push(`/play/${slug}/result`), 2500)
    }
    saveMatchResult({
      game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee,
      winnerGets: tier.winnerGets,
      outcome: w === 'me' ? 'win' : w === 'opp' ? 'loss' : 'draw',
      myScore: w === 'me' ? 1 : 0, oppScore: w === 'opp' ? 1 : 0,
    })
  }, [slug, tier, router])

  const botDrop = useCallback((b: CellState[][]) => {
    const colOrder = [3, 2, 4, 1, 5, 0, 6]
    for (const col of colOrder) {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (b[r][col] === null) {
          const next = b.map(row => [...row])
          next[r][col] = 'opp'
          setBoard(next)
          const w = checkWinner(next)
          if (w) { finishGame(w, next); return }
          const full = next.every(row => row.every(c => c !== null))
          if (full) { finishGame('draw', next); return }
          setMyTurn(true)
          setPlayTimer(14)
          return
        }
      }
    }
  }, [finishGame])

  const dropPiece = (col: number) => {
    if (!myTurn || winner || dropPhase !== 'play') return
    let row = -1
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) { row = r; break }
    }
    if (row === -1) return
    const next = board.map(r => [...r])
    next[row][col] = 'me'
    setBoard(next)
    setPlayTimer(14)
    const w = checkWinner(next)
    if (w) { finishGame(w, next); return }
    const full = next.every(row => row.every(c => c !== null))
    if (full) { finishGame('draw', next); return }
    setMyTurn(false)
    setTimeout(() => botDrop(next), 900)
  }

  // Phase 2 auto-drop on timeout
  useEffect(() => {
    if (playTimer > 0 || !myTurn || winner || dropPhase !== 'play') return
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) { dropPiece(c); break }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playTimer, myTurn, winner, dropPhase])

  const canDrop = (col: number) => board[0][col] === null

  // Animate newly placed pieces via animejs
  useEffect(() => {
    const prev = prevBoardRef.current
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!prev[r][c] && (board[r][c] === 'me' || board[r][c] === 'opp')) {
          animate(`#cell-${r}-${c}`, { scale: [0.6, 1.08, 1], opacity: [0, 1], duration: 280, easing: 'easeOutBack' })
        }
      }
    }
    prevBoardRef.current = board.map(row => [...row])
  }, [board])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...dark, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >

      {/* Top bar */}
      <div style={{ padding: '12px 40px', borderBottom: div, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--concrete-2)' }}>
        <span style={{ ...mono, fontSize: 11 }}>MATCH · DROPDUEL</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{tier.stakeKr} KR ROOM</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ ...mono, color: 'var(--bone-faint)' }}>{tier.winnerGets} KR POT</span>
          <button style={{ ...mono, border: '1px solid rgba(240,237,228,0.2)', padding: '5px 12px', color: 'var(--bone-faint)', background: 'transparent', cursor: 'pointer' }}>FORFEIT</button>
        </div>
      </div>

      {/* Phase status bar */}
      {dropPhase === 'block' && (
        <div style={{ padding: '14px 40px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: blockTimer <= 5 ? 'rgba(239,0,0,0.06)' : 'transparent', transition: 'background 0.3s' }}>
          <span style={{ ...mono, fontSize: 10, letterSpacing: '0.1em', color: 'rgba(240,237,228,0.4)' }}>● PHASE 1 · PLACE YOUR BLOCK — NOT TOP OR BOTTOM ROW</span>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: blockTimer <= 5 ? 'var(--alarm)' : 'var(--bone-on-dark)' }}>
            0:{blockTimer.toString().padStart(2, '0')}
          </div>
        </div>
      )}
      {dropPhase === 'reveal' && (
        <div style={{ padding: '14px 40px', borderBottom: div, display: 'flex', justifyContent: 'center', background: 'rgba(240,237,228,0.04)' }}>
          <span style={{ ...mono, fontSize: 11, letterSpacing: '0.1em' }}>● BLOCKS REVEALED · PHASE 2 STARTING ●</span>
        </div>
      )}
      {dropPhase === 'play' && (
        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div key="winner" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px 40px', borderBottom: div, display: 'flex', justifyContent: 'center', alignItems: 'center', background: winner === 'me' ? 'rgba(29,138,58,0.15)' : 'rgba(239,0,0,0.1)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: winner === 'me' ? gameWin : 'var(--alarm)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                {winner === 'me' ? '4 IN A ROW · YOU WIN' : '4 IN A ROW · BOT WINS'}
              </span>
            </motion.div>
          ) : (
            <motion.div key="status" style={{ padding: '12px 40px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: myTurn ? 'rgba(29,138,58,0.06)' : 'rgba(239,0,0,0.04)', transition: 'background 0.3s' }}>
              <span style={{ ...mono, fontSize: 10, color: myTurn ? gameWin : 'var(--alarm)' }}>
                ● {myTurn ? 'YOUR TURN · PICK A COLUMN' : 'BOT IS THINKING…'}
              </span>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, color: playTimer <= 5 ? 'var(--alarm)' : 'var(--bone-on-dark)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
                {myTurn ? `0:${playTimer.toString().padStart(2, '0')}` : '—:——'}
              </div>
              <span style={{ ...mono, fontSize: 10, color: 'var(--bone-faint)' }}>POT {tier.winnerGets} KR</span>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 40px', gap: 40 }}>

        {/* Left legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 120 }}>
          {dropPhase === 'block' ? (
            <>
              <div style={{ ...mono, fontSize: 9, color: gameWin }}>■ YOUR BLOCK</div>
              <div style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.3)' }}>■ OPP BLOCK (HIDDEN)</div>
              <div style={{ borderTop: div, paddingTop: 12, marginTop: 4 }}>
                <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 2 }}>ROWS 2 – 5</div>
                <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>VALID PLACEMENT</div>
              </div>
              <div>
                <div style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.2)', marginBottom: 2 }}>ROW 1 + ROW 6</div>
                <div style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.2)' }}>NOT VALID</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ ...mono, fontSize: 9, color: gameWin }}>● YOU</div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--alarm)' }}>● BOT</div>
              <div style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.3)' }}>■ BLOCKS</div>
              <div style={{ borderTop: div, paddingTop: 12, marginTop: 4 }}>
                <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 6 }}>FIRST TO 4</div>
                <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>HORIZONTAL</div>
                <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>VERTICAL</div>
                <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>DIAGONAL</div>
              </div>
            </>
          )}
        </div>

        {/* Board */}
        <div>
          {/* Phase 2: column drop buttons */}
          {dropPhase === 'play' && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
              {Array(COLS).fill(null).map((_, col) => (
                <button key={col} onClick={() => dropPiece(col)} disabled={!myTurn || !canDrop(col) || !!winner} style={{ width: 48, height: 24, background: myTurn && canDrop(col) ? 'rgba(29,138,58,0.15)' : 'transparent', border: myTurn && canDrop(col) ? '1px solid rgba(29,138,58,0.4)' : '1px solid transparent', color: myTurn && canDrop(col) ? gameWin : 'rgba(240,237,228,0.15)', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: myTurn && canDrop(col) ? 'pointer' : 'default', transition: 'all 0.1s' }}>
                  {myTurn && canDrop(col) ? '▼' : ''}
                </button>
              ))}
            </div>
          )}

          {/* Phase 1: interactive block-placement grid */}
          {dropPhase === 'block' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Array(ROWS).fill(null).map((_, r) => {
                const validRow = r >= 1 && r <= 4
                return (
                  <div key={r} style={{ display: 'flex', gap: 4 }}>
                    {Array(COLS).fill(null).map((_, c) => {
                      const isSel = myBlockCell?.[0] === r && myBlockCell?.[1] === c
                      return (
                        <div key={c} onClick={() => { if (validRow) selectBlock(isSel ? null : [r, c]) }}
                          style={{ width: 48, height: 48, border: isSel ? '2px solid var(--money)' : validRow ? '1px solid rgba(240,237,228,0.14)' : '1px solid rgba(240,237,228,0.04)', background: isSel ? 'rgba(29,138,58,0.18)' : validRow ? 'rgba(240,237,228,0.02)' : 'transparent', borderRadius: 2, cursor: validRow ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
                          {isSel && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: gameWin, fontWeight: 700 }}>■</span>}
                          {!validRow && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(240,237,228,0.1)' }}>{r === 0 ? 'TOP' : 'BOT'}</span>}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* Phase 2+: live board with pieces */}
          {(dropPhase === 'reveal' || dropPhase === 'play') && (
            <div id="drop-board" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {board.map((row, r) => (
                <div key={r} style={{ display: 'flex', gap: 4 }}>
                  {row.map((cell, c) => {
                    const isWin = winCells.some(([wr, wc]) => wr === r && wc === c)
                    return (
                      <div key={c} id={`cell-${r}-${c}`} className="board-cell" style={{ width: 48, height: 48, border: isWin ? `2px solid ${gameWin}` : cellBorder(cell), borderRadius: cell === 'me' || cell === 'opp' ? '50%' : 2, overflow: 'hidden', position: 'relative' }}>
                        <AnimatePresence>
                          {cell && (
                            <motion.div
                              key={`${r}-${c}-${cell}`}
                              style={{ position: 'absolute', inset: 0, borderRadius: cell === 'me' || cell === 'opp' ? '50%' : 2 }}
                              animate={{ background: isWin ? gameWin : cellColor(cell) }}
                              transition={isWin ? { delay: winCells.findIndex(([wr,wc]) => wr===r && wc===c) * 0.12, duration: 0.25 } : { duration: 0 }}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 4, marginTop: 6, justifyContent: 'center' }}>
            {Array(COLS).fill(null).map((_, i) => (
              <div key={i} style={{ width: 48, textAlign: 'center', ...mono, fontSize: 9, color: 'rgba(240,237,228,0.2)' }}>{i + 1}</div>
            ))}
          </div>
        </div>

        {/* Right info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 160 }}>
          <div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 8 }}>OPPONENT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase' }}>BOT</div>
            <div style={{ ...mono, fontSize: 9, color: gameWin, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: gameWin, display: 'inline-block' }} />
              connected · 31 ms
            </div>
          </div>
          <div style={{ borderTop: div, paddingTop: 16 }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 4 }}>PHASE</div>
            <div style={{ ...mono, fontSize: 10, fontWeight: 700 }}>
              {dropPhase === 'block' ? 'PHASE 1 · BLOCK' : dropPhase === 'reveal' ? 'BLOCKS REVEALED' : 'PHASE 2 · PLAY'}
            </div>
            {dropPhase === 'block' && <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginTop: 4 }}>OPPONENT IS CHOOSING</div>}
            {myBlockCell && dropPhase !== 'block' && (
              <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginTop: 4 }}>YOUR BLOCK: R{myBlockCell[0] + 1} C{myBlockCell[1] + 1}</div>
            )}
          </div>
          <div style={{ borderTop: div, paddingTop: 16 }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 4 }}>ENTRY</div>
            <div style={{ ...mono, fontSize: 11, fontWeight: 700 }}>{tier.stakeKr} KR</div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginTop: 4 }}>WIN TAKES {tier.winnerGets} KR</div>
          </div>
          {dropPhase === 'block' && (
            <div style={{ borderTop: div, paddingTop: 16 }}>
              <button onClick={() => { if (myBlockCell) doReveal(myBlockCell) }} disabled={!myBlockCell}
                style={{ width: '100%', padding: '14px 0', background: myBlockCell ? 'var(--alarm)' : 'rgba(239,0,0,0.15)', color: myBlockCell ? '#fff' : 'rgba(239,0,0,0.35)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: myBlockCell ? 'pointer' : 'not-allowed', transition: 'all 0.1s' }}>
                {myBlockCell ? 'CONFIRM BLOCK →' : 'SELECT A CELL'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// DISPATCHER
// ════════════════════════════════════════════════════════════════

function GameSwitch({ slug }: { slug: string }) {
  if (slug === 'cycleduel') return <CycleDuelMatch slug={slug} />
  if (slug === 'dropduel')  return <DropDuelMatch  slug={slug} />
  return <CardDuelMatch slug={slug} />
}

export default function MatchPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = use(params)
  return (
    <Suspense fallback={<div style={{ background: 'var(--concrete)', minHeight: '100vh' }} />}>
      <GameSwitch slug={slug} />
    </Suspense>
  )
}
