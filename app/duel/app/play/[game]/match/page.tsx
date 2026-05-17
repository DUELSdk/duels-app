'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { animate, stagger } from 'animejs'
import { tierFromKr, DEFAULT_TIER, type Tier } from '@/lib/tiers'
import { saveMatchResult } from '@/lib/match-state'

// ── Design tokens ──────────────────────────────────────────────────────────
const div  = '1px solid rgba(240,237,228,0.14)'
const divS = '1px solid rgba(240,237,228,0.24)'

// ── Utils ──────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function parseKr(param: string | null): Tier {
  if (!param) return DEFAULT_TIER
  const kr = parseInt(param)
  return isNaN(kr) ? DEFAULT_TIER : tierFromKr(kr)
}

// ── Shared BunkerTop ───────────────────────────────────────────────────────
function BunkerTop({ phase, pot, game }: { phase: string; pot: number; game: string }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', padding: '14px 28px',
      borderBottom: div, background: 'var(--concrete-2)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)', letterSpacing: '0.08em' }}>
        MATCH 4F2A · {game} · {pot} KR POT
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--alarm)', letterSpacing: '0.16em' }}>
        ● {phase}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.08em' }}>4F2A</span>
      </div>
    </div>
  )
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

function CDCard({ c, size = 56, sealed, win, loss, faceDown, ghost, glow }: {
  c?: string; size?: number; sealed?: boolean; win?: boolean; loss?: boolean; faceDown?: boolean; ghost?: boolean; glow?: boolean;
}) {
  let bg = 'transparent', fg = 'var(--bone-on-dark)', border = 'rgba(240,237,228,0.24)'
  if (sealed || faceDown) { bg = 'var(--concrete-3)'; fg = 'transparent'; border = 'rgba(240,237,228,0.14)' }
  else if (win)   { bg = 'var(--money)'; fg = '#fff'; border = 'var(--money)' }
  else if (loss)  { bg = 'var(--alarm)'; fg = '#fff'; border = 'var(--alarm)' }
  else if (ghost) { bg = 'transparent'; fg = 'rgba(240,237,228,0.20)'; border = 'rgba(240,237,228,0.10)' }
  return (
    <div style={{
      width: size, height: size * 1.35,
      border: `1.5px solid ${border}`,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.6,
      letterSpacing: '-0.04em', position: 'relative', flexShrink: 0,
      boxShadow: glow ? `0 0 0 1px var(--alarm), 0 0 24px rgba(239,0,0,0.35)` : 'none',
      transition: 'background 0.15s',
    }}>
      {sealed && (
        <>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
            <line x1="0" y1="0" x2="100" y2="50" stroke="rgba(240,237,228,0.06)" strokeWidth="0.5"/>
            <line x1="100" y1="0" x2="0" y2="50" stroke="rgba(240,237,228,0.06)" strokeWidth="0.5"/>
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: Math.max(20, size * 0.35), height: Math.max(20, size * 0.35), borderRadius: '50%', background: 'var(--alarm)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: Math.max(9, size * 0.15), zIndex: 1 }}>✕</div>
          <div style={{ fontFamily: 'var(--font-mono)', position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>SEALED</div>
        </>
      )}
      {!sealed && !faceDown && c}
    </div>
  )
}

function CardDuelMatch({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = parseKr(searchParams.get('kr'))

  const [botSeq] = useState<Move[]>(['P', 'R', 'S', 'R', 'P', 'S', 'S', 'R', 'P'] as Move[])
  const [mySlots, setMySlots] = useState<(Move | null)[]>(Array(9).fill(null))
  const [selCard,  setSelCard]  = useState<Move | null>(null)
  const mySlotsRef = useRef<(Move | null)[]>(Array(9).fill(null))
  const [botCount, setBotCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [myLocked, setMyLocked] = useState(false)

  const [phase,     setPhase]     = useState<CardPhase>('arrange')
  const [revealIdx, setRevealIdx] = useState(-1)
  const [score,     setScore]     = useState({ me: 0, opp: 0 })

  const [sdPick, setSdPick] = useState<Move | null>(null)
  const [sdBot,  setSdBot]  = useState<Move | null>(null)
  const [sdBusy, setSdBusy] = useState(false)
  const [sdRound,setSdRound]= useState(0)

  const myHand = (() => {
    const h: Record<Move, number> = { R: 3, P: 3, S: 3 }
    for (const c of mySlots) { if (c) h[c]-- }
    return h
  })()
  const slotsUsed = mySlots.filter(Boolean).length
  const allFilled = slotsUsed === 9

  useEffect(() => { mySlotsRef.current = mySlots }, [mySlots])

  useEffect(() => {
    if (phase !== 'arrange' || myLocked || botCount >= 9) return
    const id = setTimeout(() => setBotCount(c => c + 1), 2200 + Math.random() * 2800)
    return () => clearTimeout(id)
  }, [botCount, phase, myLocked])

  useEffect(() => {
    if (phase !== 'arrange' || myLocked || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, phase, myLocked])

  useEffect(() => {
    if (timeLeft > 0 || phase !== 'arrange' || myLocked) return
    // auto-fill any empty slots before locking
    const cur = mySlotsRef.current
    const h: Record<Move, number> = { R: 3, P: 3, S: 3 }
    for (const c of cur) { if (c) h[c as Move]-- }
    const rem: Move[] = []
    for (const [card, cnt] of Object.entries(h)) {
      for (let i = 0; i < (cnt as number); i++) rem.push(card as Move)
    }
    const filled = shuffleArray(rem)
    const next = [...cur]; let ri = 0
    for (let i = 0; i < 9; i++) { if (!next[i]) next[i] = filled[ri++] }
    setMySlots(next)
    setMyLocked(true)
  }, [timeLeft, phase, myLocked])

  useEffect(() => {
    if (!myLocked || phase !== 'arrange') return
    setBotCount(9)
    const id = setTimeout(() => { setPhase('reveal'); setRevealIdx(0) }, 800)
    return () => clearTimeout(id)
  }, [myLocked, phase])

  useEffect(() => {
    if (phase !== 'reveal' || revealIdx < 0 || revealIdx >= 9) return
    const isDecidingSlot = revealIdx === 8 && score.me === score.opp
    const id = setTimeout(() => {
      const slots = mySlotsRef.current
      const myMove  = slots[revealIdx] as Move
      const oppMove = botSeq[revealIdx]
      const result  = cardOutcome(myMove, oppMove)
      setScore(s => ({ me: s.me + (result === 'win' ? 1 : 0), opp: s.opp + (result === 'loss' ? 1 : 0) }))
      if (revealIdx === 8) {
        let fm = 0, fo = 0
        for (let i = 0; i < 9; i++) {
          const r = cardOutcome(slots[i] as Move, botSeq[i])
          if (r === 'win') fm++; else if (r === 'loss') fo++
        }
        setTimeout(() => {
          if (fm === fo) {
            setPhase('sudden')
          } else {
            saveMatchResult({ game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee, winnerGets: tier.winnerGets, outcome: fm > fo ? 'win' : 'loss', myScore: fm, oppScore: fo, mySeq: slots as Move[], oppSeq: botSeq })
            setPhase('done')
            setTimeout(() => router.push(`/play/${slug}/result`), 1200)
          }
        }, 700)
      } else {
        setRevealIdx(i => i + 1)
      }
    }, isDecidingSlot ? 3400 : 2800)
    return () => clearTimeout(id)
  }, [phase, revealIdx, score, botSeq, slug, tier, router])

  function handleHandTap(card: Move) {
    if (myLocked || myHand[card] <= 0) return
    setSelCard(prev => prev === card ? null : card)
  }

  function handleSlotTap(i: number) {
    if (myLocked) return
    const current = mySlots[i]
    if (current !== null) {
      const next = [...mySlots]; next[i] = null; setMySlots(next)
      setSelCard(current); return
    }
    if (selCard !== null && myHand[selCard] > 0) {
      const next = [...mySlots]; next[i] = selCard; setMySlots(next)
      if (myHand[selCard] - 1 === 0) setSelCard(null)
    }
  }

  function handleReset() { setMySlots(Array(9).fill(null)); setSelCard(null) }

  function handleSuddenPick(card: Move) {
    if (sdBusy || sdPick) return
    setSdPick(card)
    setSdBusy(true)
    const bot = (['R', 'P', 'S'] as Move[])[Math.floor(Math.random() * 3)]
    setSdBot(bot)
    setTimeout(() => {
      const result = cardOutcome(card, bot)
      if (result === 'tie') {
        setSdRound(r => r + 1); setSdPick(null); setSdBot(null); setSdBusy(false)
      } else {
        const slots = mySlotsRef.current
        let fm = 0, fo = 0
        for (let i = 0; i < 9; i++) { const r = cardOutcome(slots[i] as Move, botSeq[i]); if (r === 'win') fm++; else if (r === 'loss') fo++ }
        if (result === 'win') fm++; else fo++
        saveMatchResult({ game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee, winnerGets: tier.winnerGets, outcome: result, myScore: fm, oppScore: fo, mySeq: slots as Move[], oppSeq: botSeq })
        setPhase('done')
        setTimeout(() => router.push(`/play/${slug}/result`), 1200)
      }
    }, 900)
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timerStr = `${mins}:${secs.toString().padStart(2, '0')}`

  const phaseLabel =
    phase === 'arrange' && !myLocked ? 'PLACING'
    : phase === 'arrange' ? 'WAITING'
    : phase === 'reveal'  ? `REVEAL · SLOT ${revealIdx + 1}`
    : phase === 'sudden'  ? 'SUDDEN DEATH'
    : 'MATCH COMPLETE'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: 'var(--concrete)', color: 'var(--bone-on-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Match nav */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '14px 28px', borderBottom: div, background: 'var(--concrete-2)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)', letterSpacing: '0.08em' }}>
          CARD DUEL · <span style={{ fontVariantNumeric: 'tabular-nums' }}>STAKE {tier.stakeKr} KR</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--alarm)', letterSpacing: '0.16em' }}>● {phaseLabel}</div>
        <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)', fontVariantNumeric: 'tabular-nums' }}>
          POT {tier.winnerGets} KR
        </div>
      </div>

      {/* STATE A — PLACING */}
      {phase === 'arrange' && !myLocked && (
        <>
          <section style={{ padding: '12px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--bone-ghost)' }}>opponent </span>
              <strong style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--bone-on-dark)' }}>LASERHAWK</strong>
              {' '}<span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)' }}>1240</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)' }}>{botCount} / 9 locked</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: timeLeft <= 10 ? 'var(--alarm)' : 'var(--bone-faint)', fontVariantNumeric: 'tabular-nums' }}>{timerStr}</span>
            </div>
          </section>

          {/* THEIR row */}
          <section style={{ padding: '14px 32px 10px', borderBottom: divS }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 8 }}>THEIR PLAN · SEALED</div>
            <div style={{ display: 'flex', gap: 5 }}>
              {Array(9).fill(null).map((_, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <CDCard size={52} sealed={i < botCount} ghost={i >= botCount} />
                </div>
              ))}
            </div>
          </section>

          {/* Round rail */}
          <div style={{ display: 'flex', gap: 5, padding: '7px 32px' }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <div key={n} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)' }}>{n}</div>
            ))}
          </div>

          {/* YOUR row */}
          <section style={{ padding: '0 32px 4px', borderTop: divS }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {mySlots.map((card, i) => (
                <div key={i} style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSlotTap(i)}>
                  <CDCard c={card ?? undefined} size={52} ghost={card === null} />
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginTop: 6, textAlign: 'center' }}>YOUR PLAN · LIVE</div>
          </section>

          {/* Hand separator */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 32px', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(240,237,228,0.14)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>your hand · tap to place</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(240,237,228,0.14)' }} />
          </div>

          {/* Hand */}
          <section style={{ padding: '0 32px', flex: 1 }}>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
              {(['R', 'S', 'P'] as Move[]).flatMap((card) => {
                const usedCount = 3 - myHand[card]
                return Array(3).fill(null).map((_, j) => {
                  const isUsed = j < usedCount
                  const isSelected = !isUsed && selCard === card && j === usedCount
                  return (
                    <div key={`${card}-${j}`}
                      style={{ flex: '0 0 auto', opacity: isUsed ? 0.25 : 1, cursor: isUsed ? 'default' : 'pointer' }}
                      onClick={() => !isUsed && handleHandTap(card)}>
                      <CDCard c={card} size={52} glow={isSelected} />
                    </div>
                  )
                })
              })}
            </div>
          </section>

          {/* Bottom bar */}
          <section style={{ padding: '16px 32px 28px', borderTop: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handleReset} style={{ background: 'transparent', border: 'none', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-ghost)', cursor: 'pointer', letterSpacing: '0.08em', padding: '8px 0' }}>
              ← Reset
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)' }}>
              {slotsUsed} of 9 placed
            </span>
            <button onClick={() => allFilled && setMyLocked(true)} disabled={!allFilled}
              style={{ padding: '14px 28px', background: allFilled ? 'var(--amber)' : 'var(--amber-soft)', color: allFilled ? '#0d0d0d' : 'rgba(245,158,11,0.4)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: allFilled ? 'pointer' : 'not-allowed', transition: 'all 0.12s' }}>
              Lock in
            </button>
          </section>
        </>
      )}

      {/* STATE B — WAITING */}
      {phase === 'arrange' && myLocked && (
        <>
          <section style={{ padding: '12px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--bone-ghost)' }}>opponent </span>
              <strong style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--bone-on-dark)' }}>LASERHAWK</strong>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)' }}>9 / 9 locked</span>
          </section>

          <section style={{ padding: '14px 32px 10px', borderBottom: divS }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 8 }}>THEIR PLAN · SEALED</div>
            <div style={{ display: 'flex', gap: 5 }}>
              {Array(9).fill(null).map((_, i) => <div key={i} style={{ flex: 1 }}><CDCard size={52} sealed /></div>)}
            </div>
          </section>

          <section style={{ padding: '10px 32px', borderTop: divS }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 8, textAlign: 'center' }}>YOUR PLAN · LOCKED</div>
            <div style={{ display: 'flex', gap: 5 }}>
              {mySlots.map((c, i) => <div key={i} style={{ flex: 1 }}><CDCard c={c ?? undefined} size={52} sealed /></div>)}
            </div>
          </section>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.18em' }}>● WAITING FOR OPPONENT…</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)' }}>~7s avg lock time at this stake</div>
          </div>
        </>
      )}

      {/* STATE C — REVEAL */}
      {phase === 'reveal' && (
        <>
          <section style={{ padding: '12px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--bone-on-dark)' }}>
              <strong>YOU</strong> {score.me} — {score.opp} LASERHAWK
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)' }}>round {revealIdx + 1} / 9</div>
          </section>

          <section style={{ padding: '20px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', textAlign: 'center', marginBottom: 10 }}>RESOLVING…</div>

            {/* THEIR row */}
            <div style={{ display: 'flex', gap: 5 }}>
              {botSeq.map((move, i) => {
                const isPlayed = i < revealIdx
                const isNext   = i === revealIdx
                const outcome  = isPlayed ? cardOutcome(mySlots[i] as Move, move) : null
                return (
                  <div key={i} style={{ flex: 1 }}>
                    <CDCard c={move} size={56} sealed={!isPlayed && !isNext} faceDown={isNext}
                      win={isPlayed && outcome === 'loss'} loss={isPlayed && outcome === 'win'} />
                  </div>
                )
              })}
            </div>

            {/* Round rail with ▼ on active slot */}
            <div style={{ display: 'flex', gap: 5, margin: '10px 0' }}>
              {[1,2,3,4,5,6,7,8,9].map(n => {
                const isActive = n === revealIdx + 1
                return (
                  <div key={n} style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: isActive ? 'var(--accent)' : 'var(--bone-ghost)', fontWeight: isActive ? 700 : 400 }}>
                      {isActive ? '▼' : n}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* YOUR row */}
            <div style={{ display: 'flex', gap: 5 }}>
              {mySlots.map((card, i) => {
                const isPlayed = i < revealIdx
                const isNext   = i === revealIdx
                const outcome  = isPlayed ? cardOutcome(card as Move, botSeq[i]) : null
                return (
                  <div key={i} style={{ flex: 1 }}>
                    <CDCard c={card ?? undefined} size={56} sealed={!isPlayed && !isNext} faceDown={isNext}
                      win={isPlayed && outcome === 'win'} loss={isPlayed && outcome === 'loss'} glow={isNext} />
                  </div>
                )
              })}
            </div>

            {/* Scoreboard */}
            <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: div }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', textAlign: 'center', marginBottom: 8 }}>SCOREBOARD</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>YOU</div>
                  <motion.div key={`me-${score.me}`} animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 0.25 }}
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', lineHeight: 0.88 }}>
                    {score.me}
                  </motion.div>
                </div>
                <div style={{ width: 2, height: 56, background: 'rgba(240,237,228,0.2)', flexShrink: 0 }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>THEM</div>
                  <motion.div key={`opp-${score.opp}`} animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 0.25 }}
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88, color: 'var(--bone-faint)', fontVariantNumeric: 'tabular-nums', lineHeight: 0.88 }}>
                    {score.opp}
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* STATE E — SUDDEN DEATH */}
      {phase === 'sudden' && (
        <>
          <section style={{ padding: '16px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>
              {score.me}–{score.opp} · ONE SLOT DECIDES
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>POT {tier.winnerGets} KR</span>
          </section>

          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', gap: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.20em' }}>
              ● TIE · SUDDEN DEATH{sdRound > 0 ? ` · ROUND ${sdRound + 1}` : ''}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginTop: 6, color: 'var(--bone-on-dark)' }}>
              ONE PICK. ONE WINNER.
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, marginTop: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>YOU</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, fontVariantNumeric: 'tabular-nums' }}>{score.me}</div>
              </div>
              <div style={{ width: 1, height: 48, background: 'rgba(240,237,228,0.14)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>THEM</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums' }}>{score.opp}</div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: div, width: '100%', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 16 }}>FRESH HAND · PICK ONE</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                {(['R', 'P', 'S'] as Move[]).map(card => (
                  <div key={card} style={{ textAlign: 'center' }}>
                    <button onClick={() => handleSuddenPick(card)} disabled={sdBusy || !!sdPick}
                      style={{ background: 'transparent', border: 'none', cursor: sdBusy || !!sdPick ? 'not-allowed' : 'pointer', padding: 0 }}>
                      <CDCard c={card} size={96} glow={sdPick === card} win={sdPick === card && !!sdBot && cardOutcome(card, sdBot!) === 'win'} />
                    </button>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: sdPick === card ? 'var(--alarm)' : 'var(--bone-ghost)', marginTop: 8, letterSpacing: '0.10em', fontWeight: sdPick === card ? 700 : 400 }}>
                      {sdPick === card ? '● PICKED' : 'TAP'}
                    </div>
                  </div>
                ))}
                {sdBot && (
                  <div style={{ textAlign: 'center', marginLeft: 16 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', marginBottom: 8 }}>BOT</div>
                    <CDCard c={sdBot} size={96} loss />
                  </div>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', marginTop: 12, letterSpacing: '0.10em' }}>simultaneous reveal</div>
            </div>

            {sdPick && sdBot && (
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: cardOutcome(sdPick, sdBot) === 'win' ? 'var(--money)' : cardOutcome(sdPick, sdBot) === 'loss' ? 'var(--alarm)' : 'var(--bone-faint)', marginTop: 16 }}>
                {cardOutcome(sdPick, sdBot) === 'tie' ? 'TIE — AGAIN' : cardOutcome(sdPick, sdBot) === 'win' ? 'NOVASTRIKE WINS.' : 'BOT WINS.'}
              </div>
            )}
          </section>

          <section style={{ padding: '16px 32px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-faint)', letterSpacing: '0.12em' }}>
              TIE AGAIN → INSTANT REPLAY · NO LIMIT
            </div>
          </section>
        </>
      )}

      {/* DONE */}
      {phase === 'done' && (() => {
        const slots = mySlotsRef.current
        let fm = 0, fo = 0
        for (let i = 0; i < 9; i++) { const r = cardOutcome(slots[i] as Move, botSeq[i]); if (r === 'win') fm++; else if (r === 'loss') fo++ }
        const won = fm > fo
        return (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 120, textTransform: 'uppercase', letterSpacing: '-0.03em', color: won ? 'var(--money)' : 'var(--alarm)' }}>
                {won ? 'NOVASTRIKE WINS.' : 'BOT WINS.'}
              </div>
            </motion.div>
          </div>
        )
      })()}
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

const CYCLE_KEY: Record<CycleMove, string> = { Feint: 'F', Guard: 'G', Strike: 'S', Rush: 'R', Grab: 'A' }

// CycleCard for match screen — bone bg / ink border to pop against dark bunker
function CycleMCard({ move, size = 56, win, loss, locked, faceDown, dim, onClick, selected }: {
  move?: CycleMove; size?: number; win?: boolean; loss?: boolean; locked?: boolean; faceDown?: boolean; dim?: boolean; onClick?: () => void; selected?: boolean;
}) {
  const k = move ? CYCLE_KEY[move] : '?'
  return (
    <div onClick={onClick} style={{
      width: size, height: size * 1.35,
      border: `1.5px solid ${win ? 'var(--money)' : loss ? 'var(--alarm)' : selected ? 'var(--alarm)' : 'var(--ink)'}`,
      background: faceDown ? 'var(--ink)' : win ? 'rgba(56,143,79,0.10)' : loss ? 'rgba(239,0,0,0.06)' : locked ? 'rgba(240,237,228,0.85)' : selected ? 'rgba(239,0,0,0.04)' : 'var(--bone)',
      color: faceDown ? 'rgba(239,237,228,0.4)' : 'var(--ink)',
      opacity: dim ? 0.4 : 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 4, cursor: onClick ? 'pointer' : 'default', transition: 'background 0.2s', flexShrink: 0,
    }}>
      {faceDown ? (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: size * 0.18, letterSpacing: '0.10em' }}>CYC</span>
      ) : (
        <>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.5, lineHeight: 1 }}>{k}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: size * 0.13, marginTop: 2, color: 'var(--ink-faint)', letterSpacing: '0.08em' }}>
            {move?.toUpperCase() ?? ''}
          </span>
        </>
      )}
    </div>
  )
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
  const tier = parseKr(searchParams.get('kr'))

  const initHand = (): Record<CycleMove, number> => ({ Feint: 2, Guard: 2, Strike: 2, Rush: 2, Grab: 2 })

  const [block,    setBlock]    = useState(1)
  const [hand,     setHand]     = useState<Record<CycleMove, number>>(initHand)
  const [botHand,  setBotHand]  = useState<Record<CycleMove, number>>(initHand)
  const [sequence, setSequence] = useState<(CycleMove | null)[]>([null, null, null])
  const [score,    setScore]    = useState({ me: 0, opp: 0 })
  const [myPeek,   setMyPeek]   = useState<CycleMove | null>(null)
  const [oppPeek,  setOppPeek]  = useState<CycleMove | null>(null)
  const [blockPhase, setBlockPhase] = useState<'choosePeek' | 'bench' | 'lock' | 'resolving'>('choosePeek')
  const [benchCards, setBenchCards] = useState<CycleMove[]>([])
  const [timeLeft,   setTimeLeft]   = useState(30)
  const [botBlockSeq,    setBotBlockSeq]    = useState<CycleMove[]>([])
  const [blockRevealIdx, setBlockRevealIdx] = useState(0)

  const [gamePhase, setGamePhase] = useState<'game' | 'sudden' | 'done'>('game')
  const [sdPick,    setSdPick]    = useState<CycleMove | null>(null)
  const [sdBot,     setSdBot]     = useState<CycleMove | null>(null)
  const [sdBusy,    setSdBusy]    = useState(false)
  const [sdRound,   setSdRound]   = useState(0)
  const roundMovesRef = useRef<{ my: CycleMove; bot: CycleMove }[]>([])

  const totalHand = Object.values(hand).reduce((a, b) => a + b, 0)
  const seqFull   = sequence.every(s => s !== null)
  const nextEmpty = sequence.findIndex(s => s === null)

  useEffect(() => {
    if (blockPhase !== 'lock' || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, blockPhase])

  const setupBlock = useCallback((b: number, h: Record<CycleMove, number>, bh: Record<CycleMove, number>) => {
    const botPeekCard = randomFromHand(bh)
    setOppPeek(botPeekCard)
    setMyPeek(null)
    setSequence([null, null, null])
    setTimeLeft(30)
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

    const mySeq = sequence as CycleMove[]
    const botSeq = randomSeq(botHand, 3, oppPeek ?? undefined)
    const usedByBot = { ...botHand }
    botSeq.forEach(c => { usedByBot[c] = Math.max(0, usedByBot[c] - 1) })

    roundMovesRef.current = [...roundMovesRef.current, ...mySeq.map((my, i) => ({ my, bot: botSeq[i] }))]

    let newMe = score.me, newOpp = score.opp
    for (let i = 0; i < 3; i++) {
      const res = cycleOutcome(mySeq[i], botSeq[i])
      if (res === 'win')  newMe++
      if (res === 'loss') newOpp++
    }

    setScore({ me: newMe, opp: newOpp })
    setBotBlockSeq(botSeq)
    setBotHand(usedByBot)
    setBlockRevealIdx(0)
    setBlockPhase('resolving')
  }, [seqFull, blockPhase, sequence, botHand, oppPeek, score])

  // Slot-by-slot reveal within a block
  useEffect(() => {
    if (blockPhase !== 'resolving' || blockRevealIdx >= 3) return
    const id = setTimeout(() => setBlockRevealIdx(i => i + 1), 1400)
    return () => clearTimeout(id)
  }, [blockPhase, blockRevealIdx])

  // After all 3 revealed, advance to next block or end game
  useEffect(() => {
    if (blockPhase !== 'resolving' || blockRevealIdx < 3) return
    const id = setTimeout(() => {
      if (block === 3) {
        if (score.me === score.opp) {
          setGamePhase('sudden')
        } else {
          const outcome = score.me > score.opp ? 'win' : 'loss'
          saveMatchResult({
            game: slug, tierId: tier.id, stakeKr: tier.stakeKr, entryFee: tier.entryFee,
            winnerGets: tier.winnerGets, outcome, myScore: score.me, oppScore: score.opp,
            mySeq: roundMovesRef.current.map(r => r.my),
            oppSeq: roundMovesRef.current.map(r => r.bot),
            myMoves: [0,1,2].map(b => roundMovesRef.current.slice(b*3, b*3+3).map(r => r.my)),
            oppMoves: [0,1,2].map(b => roundMovesRef.current.slice(b*3, b*3+3).map(r => r.bot)),
          })
          setGamePhase('done')
          setTimeout(() => router.push(`/play/${slug}/result`), 1200)
        }
      } else {
        const nextBlock = block + 1
        setBlock(nextBlock)
        setupBlock(nextBlock, hand, botHand)
      }
    }, 1500)
    return () => clearTimeout(id)
  }, [blockPhase, blockRevealIdx, block, score, slug, tier, hand, botHand, router, setupBlock])

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

  const cyPhaseLabel =
    gamePhase === 'sudden' ? `SUDDEN DEATH${sdRound > 0 ? ` · ROUND ${sdRound + 1}` : ''}`
    : gamePhase === 'done' ? 'MATCH COMPLETE'
    : blockPhase === 'choosePeek' ? `BLOCK ${block} OF 3 · REVEAL YOUR CARD`
    : blockPhase === 'bench' ? 'BLOCK 3 · BENCH ONE CARD'
    : blockPhase === 'lock' ? `PEEK + LOCK · BLOCK ${block} OF 3`
    : blockPhase === 'resolving' ? `REVEAL · BLOCK ${block} OF 3`
    : 'MATCH COMPLETE'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: 'var(--concrete)', color: 'var(--bone-on-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <BunkerTop phase={cyPhaseLabel} pot={tier.winnerGets} game="CYCLEDUEL" />

      {/* Context strip — block progress (always visible during game) */}
      {gamePhase === 'game' && (
        <section style={{ padding: '12px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-faint)' }}>LASERHAWK · OPP</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3].map(b => (
              <div key={b} style={{ width: 8, height: 8, borderRadius: '50%', background: b < block ? 'var(--bone-on-dark)' : b === block ? 'rgba(240,237,228,0.5)' : 'rgba(240,237,228,0.12)', border: b === block ? '1.5px solid rgba(240,237,228,0.5)' : 'none' }} />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)' }}>
            BLOCK {block} OF 3 · ROUND {(block - 1) * 3 + sequence.filter(Boolean).length + 1} OF 9
          </span>
        </section>
      )}

      {/* CHOOSE PEEK PHASE */}
      {gamePhase === 'game' && blockPhase === 'choosePeek' && (
        <>
          <section style={{ padding: '24px 32px', textAlign: 'center', borderBottom: div }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alarm)', letterSpacing: '0.18em', fontWeight: 700 }}>● REVEAL ONE CARD TO YOUR OPPONENT</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--bone-faint)', marginTop: 8 }}>
              They see the type but not where you'll play it.
            </div>
          </section>
          <section style={{ flex: 1, background: 'var(--concrete-2)', borderTop: div, borderBottom: div, padding: '32px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>YOUR HAND · TAP TO REVEAL</div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              {CYCLE_ALL.map(move => {
                if (hand[move] === 0) return null
                return (
                  <div key={move} style={{ textAlign: 'center' }}>
                    <CycleMCard move={move} size={88} onClick={() => choosePeek(move)} />
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--bone-ghost)', marginTop: 8, letterSpacing: '0.08em' }}>
                      ×{hand[move]}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}

      {/* BENCH PHASE (Block 3) */}
      {gamePhase === 'game' && blockPhase === 'bench' && (
        <>
          <section style={{ padding: '24px 32px', textAlign: 'center', borderBottom: div }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alarm)', letterSpacing: '0.18em', fontWeight: 700 }}>● BLOCK 3 · BENCH ONE CARD</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--bone-faint)', marginTop: 8 }}>
              It sits out this block. Your choice — the other four play.
            </div>
          </section>
          <section style={{ flex: 1, background: 'var(--concrete-2)', borderTop: div, borderBottom: div, padding: '32px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>TAP TO BENCH</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {benchCards.map((card, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <CycleMCard move={card} size={88} onClick={() => benchCard(card)} />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--alarm)', marginTop: 8, letterSpacing: '0.10em' }}>BENCH</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* LOCK PHASE */}
      {gamePhase === 'game' && blockPhase === 'lock' && (
        <>
          {/* Peek + cycle diagram side-by-side */}
          <section style={{ padding: '20px 32px', borderBottom: div }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 12 }}>
                  OPPONENT'S FIRST CARD · THIS BLOCK
                </div>
                {oppPeek
                  ? <CycleMCard move={oppPeek} size={88} />
                  : <CycleMCard faceDown size={88} />
                }
                {oppPeek && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--bone-faint)', marginTop: 8, letterSpacing: '0.10em' }}>
                    BEATS {CYCLE_BEATS[oppPeek][0].toUpperCase()} · LOSES TO {CYCLE_BEATS[oppPeek][1].toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ width: 160, border: `1px solid rgba(240,237,228,0.24)`, padding: '14px 16px', background: 'var(--concrete-3)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 10 }}>THE CYCLE</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-faint)', lineHeight: 1.8 }}>
                  FEINT → GUARD<br/>
                  ↑&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
                  GRAB&nbsp;&nbsp;&nbsp;&nbsp;STRIKE<br/>
                  ↑&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;RUSH&nbsp;←
                </div>
              </div>
            </div>
          </section>

          {/* Sequence + hand */}
          <section style={{ flex: 1, background: 'var(--concrete-2)', borderTop: div, borderBottom: div, padding: '24px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>YOUR BLOCK · 3 SLOTS</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)' }}>LOCK IN</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {mins}:{secs.toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
              {sequence.map((move, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <button onClick={() => move && removeFromSequence(i)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: move ? 'pointer' : 'default' }}>
                    <CycleMCard move={move ?? undefined} size={96} locked={!!move} dim={!move} />
                  </button>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: move ? 'var(--alarm)' : 'var(--bone-faint)', marginTop: 6, letterSpacing: '0.10em' }}>
                    {move ? 'TAP REMOVE' : `SLOT ${i + 1}`}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: div, marginTop: 20, paddingTop: 18 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.10em', marginBottom: 12 }}>YOUR HAND</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
                {CYCLE_ALL.map(move => {
                  const count = hand[move]
                  const disabled = seqFull || count === 0
                  return (
                    <div key={move} style={{ textAlign: 'center' }}>
                      <CycleMCard move={move} size={72} onClick={!disabled ? () => addToSequence(move) : undefined} dim={disabled} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: count === 0 ? 'rgba(240,237,228,0.25)' : 'var(--bone-faint)', marginTop: 4, letterSpacing: '0.08em', borderStyle: count === 0 ? 'dashed' : 'solid' }}>
                        {move.toUpperCase().slice(0, 3)}×{count}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section style={{ padding: '16px 32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)' }}>
              {sequence.filter(Boolean).length} OF 3 PLACED
            </span>
            <button onClick={lockBlock} disabled={!seqFull}
              style={{ padding: '14px 28px', background: seqFull ? 'var(--alarm)' : 'rgba(239,0,0,0.15)', color: seqFull ? '#fff' : 'rgba(239,0,0,0.35)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: seqFull ? 'pointer' : 'not-allowed' }}>
              LOCK IN BLOCK →
            </button>
          </section>
        </>
      )}

      {/* RESOLVING PHASE — slot-by-slot reveal with cycle reasoning */}
      {gamePhase === 'game' && blockPhase === 'resolving' && (() => {
        const mySeq = sequence as CycleMove[]
        return (
          <>
            <section style={{ padding: '16px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--bone-on-dark)' }}>
                YOU {score.me} — {score.opp} OPP
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)' }}>
                BLOCK {block} REVEAL
              </div>
            </section>

            <section style={{ flex: 1, background: 'var(--concrete-2)', borderTop: div, borderBottom: div, padding: '24px 32px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 12 }}>THEM</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {botBlockSeq.map((move, i) => (
                  <CycleMCard key={i} size={96}
                    move={i < blockRevealIdx ? move : undefined}
                    faceDown={i >= blockRevealIdx}
                    win={i < blockRevealIdx && cycleOutcome(mySeq[i], move) === 'loss'}
                    loss={i < blockRevealIdx && cycleOutcome(mySeq[i], move) === 'win'}
                  />
                ))}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginTop: 24, marginBottom: 12, textAlign: 'right' }}>YOU</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {mySeq.map((move, i) => {
                  if (i >= blockRevealIdx) return <CycleMCard key={i} size={96} dim />
                  const o = cycleOutcome(move, botBlockSeq[i])
                  return <CycleMCard key={i} move={move} size={96} win={o === 'win'} loss={o === 'loss'} />
                })}
              </div>

              {blockRevealIdx > 0 && (
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: div }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 10 }}>CYCLE REASONING</div>
                  {Array.from({ length: Math.min(blockRevealIdx, 3) }).map((_, i) => {
                    const o = cycleOutcome(mySeq[i], botBlockSeq[i])
                    return (
                      <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7, color: o === 'win' ? 'var(--money)' : o === 'loss' ? 'var(--alarm)' : 'rgba(240,237,228,0.4)' }}>
                        {mySeq[i].toUpperCase()} {o === 'win' ? 'BEATS' : o === 'loss' ? 'LOSES TO' : 'TIES'} {botBlockSeq[i].toUpperCase()} → {o === 'win' ? '+1' : o === 'loss' ? '−1' : '0'}
                      </div>
                    )
                  })}
                  {blockRevealIdx < 3 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', lineHeight: 1.7 }}>
                      SLOT {blockRevealIdx + 1} PENDING…
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )
      })()}

      {/* SUDDEN DEATH */}
      {gamePhase === 'sudden' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <section style={{ padding: '40px 56px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alarm)', letterSpacing: '0.22em', fontWeight: 700 }}>
              ● ONE PICK · NO PEEK{sdRound > 0 ? ` · ROUND ${sdRound + 1}` : ''}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 180, marginTop: 6, lineHeight: 0.85, color: 'var(--alarm)' }}>
              SUDDEN.
            </div>
            <div style={{ fontSize: 22, color: 'var(--bone-faint)', marginTop: 6 }}>
              Tied. Pick one of five. So do they. Highest beats wins the pot.
            </div>
          </section>
          <section style={{ flex: 1, background: 'var(--concrete-2)', borderTop: div, borderBottom: div, padding: '32px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>PICK ONE</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {CYCLE_ALL.map(move => (
                <div key={move} style={{ textAlign: 'center' }}>
                  <CycleMCard move={move} size={88} selected={sdPick === move} onClick={() => handleSuddenPick(move)} dim={!!sdPick && sdPick !== move} />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: sdPick === move ? 'var(--alarm)' : 'var(--bone-ghost)', marginTop: 8, letterSpacing: '0.10em', fontWeight: sdPick === move ? 700 : 400 }}>
                    {sdPick === move ? '● PICKED' : 'TAP'}
                  </div>
                </div>
              ))}
            </div>
            {sdPick && !sdBot && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-on-dark)', letterSpacing: '0.14em', textAlign: 'center' }}>
                {sdPick.toUpperCase()} — BEATS {CYCLE_BEATS[sdPick][0].toUpperCase()} · LOSES TO {CYCLE_BEATS[sdPick][1].toUpperCase()}
              </div>
            )}
            {sdBot && sdPick && (
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: cycleOutcome(sdPick, sdBot) === 'win' ? 'var(--money)' : cycleOutcome(sdPick, sdBot) === 'loss' ? 'var(--alarm)' : 'var(--bone-faint)', marginTop: 12 }}>
                {cycleOutcome(sdPick, sdBot) === 'tie' ? 'TIE — AGAIN' : cycleOutcome(sdPick, sdBot) === 'win' ? 'NOVASTRIKE WINS.' : 'BOT WINS.'}
              </div>
            )}
          </section>
          <section style={{ padding: '24px 32px 32px' }}>
            <button className="btn bunker-alarm block" style={{ width: '100%', padding: 20, background: sdPick ? 'var(--alarm)' : 'rgba(239,0,0,0.15)', color: sdPick ? '#fff' : 'rgba(239,0,0,0.35)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: sdPick ? 'pointer' : 'not-allowed' }}>
              LOCK PICK — REVEAL
            </button>
          </section>
        </div>
      )}

      {/* DONE */}
      {gamePhase === 'done' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 120, color: score.me > score.opp ? 'var(--money)' : 'var(--alarm)' }}>
            {score.me > score.opp ? 'NOVASTRIKE WINS.' : 'BOT WINS.'}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// DROPDUEL
// ════════════════════════════════════════════════════════════════

type CellState = null | 'me' | 'opp' | 'block-me' | 'block-opp'
const ROWS = 6, COLS = 7
const DROP_COL_LABELS = ['A','B','C','D','E','F','G']

function DropMCell({ fill, block, ghost, picked, last, size = 44 }: {
  fill?: 'you' | 'opp' | null; block?: boolean; ghost?: boolean; picked?: boolean; last?: boolean; size?: number;
}) {
  let bg = 'var(--concrete-2)', border = 'none'
  if (fill === 'you')  { bg = 'var(--amber)' }
  else if (fill === 'opp') { bg = 'var(--accent)' }
  else if (block)      { bg = 'rgba(80,76,70,0.7)'; border = '1.5px solid rgba(90,86,79,0.9)' }
  else if (ghost)      { bg = 'var(--amber-soft)'; border = '1.5px dashed var(--amber)' }
  else if (picked)     { bg = 'var(--amber)' }
  if (last && !block)  { border = '2px solid var(--bone-on-dark)' }
  return (
    <div style={{ width: size, height: size, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: size * 0.78, height: size * 0.78, borderRadius: '50%', background: bg, border, transition: 'background 0.15s' }} />
    </div>
  )
}

function cellToFill(cell: CellState): 'you' | 'opp' | null {
  if (cell === 'me')  return 'you'
  if (cell === 'opp') return 'opp'
  return null
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
  const tier = parseKr(searchParams.get('kr'))

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

  const [board, setBoard] = useState<CellState[][]>(() =>
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  )
  const [myTurn, setMyTurn] = useState(true)
  const [playTimer, setPlayTimer] = useState(14)
  const [winner, setWinner] = useState<'me' | 'opp' | null>(null)
  const [winCells, setWinCells] = useState<[number, number][]>([])
  const [isDraw, setIsDraw] = useState(false)
  const [lastCell, setLastCell] = useState<[number, number] | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const prevBoardRef = useRef<CellState[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)))

  const getGhostRow = (col: number): number | null => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) return r
    }
    return null
  }

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

  useEffect(() => {
    if (dropPhase !== 'block' || blockTimer <= 0) return
    const id = setTimeout(() => setBlockTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [blockTimer, dropPhase])

  useEffect(() => {
    if (dropPhase !== 'block' || blockTimer > 0) return
    const cell = myBlockRef.current ?? [
      1 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * COLS),
    ] as [number, number]
    doReveal(cell)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockTimer, dropPhase])

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
          setLastCell([r, col])
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
    setLastCell([row, col])
    setPlayTimer(14)
    const w = checkWinner(next)
    if (w) { finishGame(w, next); return }
    const full = next.every(row => row.every(c => c !== null))
    if (full) { finishGame('draw', next); return }
    setMyTurn(false)
    setTimeout(() => botDrop(next), 900)
  }

  useEffect(() => {
    if (playTimer > 0 || !myTurn || winner || dropPhase !== 'play') return
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) { dropPiece(c); break }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playTimer, myTurn, winner, dropPhase])

  const canDrop = (col: number) => board[0][col] === null

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

  const CELL_SIZE = 56
  const dropPhaseLabel =
    dropPhase === 'block' ? 'BLOCK PLACEMENT · HIDDEN'
    : dropPhase === 'reveal' ? 'BLOCKS REVEALED'
    : winner ? (winner === 'me' ? '4 IN A ROW · YOU WIN' : '4 IN A ROW · BOT WINS')
    : isDraw ? 'DRAW · SPLIT POT'
    : `PLAY · ${myTurn ? 'YOUR DROP' : 'BOT THINKING'}`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: 'var(--concrete)', color: 'var(--bone-on-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <BunkerTop phase={dropPhaseLabel} pot={tier.winnerGets} game="DROPDUEL" />

      {/* BLOCK PLACEMENT PHASE */}
      {dropPhase === 'block' && (
        <>
          <section style={{ padding: '14px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)', fontWeight: 700, letterSpacing: '0.18em' }}>
              ● PHASE 1 · PLACE ONE BLOCKED CELL
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: blockTimer <= 5 ? 'var(--alarm)' : 'var(--bone-faint)', fontVariantNumeric: 'tabular-nums' }}>
              {`00:${blockTimer.toString().padStart(2, '0')}`}
            </div>
          </section>

          <section style={{ flex: 1, background: 'var(--concrete-2)', borderTop: div, borderBottom: div, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px 32px' }}>
            <div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                {DROP_COL_LABELS.map(c => (
                  <div key={c} style={{ width: CELL_SIZE, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{c}</div>
                ))}
              </div>
              <div style={{ background: 'var(--ink)', padding: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`, gap: 3 }}>
                  {Array.from({ length: ROWS * COLS }).map((_, idx) => {
                    const r = Math.floor(idx / COLS)
                    const c = idx % COLS
                    const validRow = r >= 1 && r <= 4
                    const isTopBot = r === 0 || r === ROWS - 1
                    const isPicked = myBlockCell?.[0] === r && myBlockCell?.[1] === c
                    return (
                      <div key={idx}
                        onClick={() => { if (validRow) selectBlock(isPicked ? null : [r, c]) }}
                        style={{ cursor: validRow ? 'pointer' : 'default', width: CELL_SIZE, height: CELL_SIZE, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{
                          width: CELL_SIZE * 0.78, height: CELL_SIZE * 0.78, borderRadius: '50%',
                          background: isPicked ? 'var(--amber)' : 'var(--concrete-2)',
                          border: isTopBot && !isPicked ? '1.5px dashed rgba(240,237,228,0.12)' : 'none',
                          opacity: isTopBot && !isPicked ? 0.35 : 1,
                          transition: 'background 0.12s',
                        }} />
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>
                  TOP + BOTTOM ROWS LOCKED · ROWS 2–5 VALID
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: myBlockCell ? 'var(--amber)' : 'var(--bone-faint)', fontWeight: 700, letterSpacing: '0.10em' }}>
                  {myBlockCell ? `${DROP_COL_LABELS[myBlockCell[1]]}${myBlockCell[0] + 1} SELECTED` : 'TAP A CELL'}
                </span>
              </div>
            </div>
          </section>

          <section style={{ padding: '20px 32px 28px' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => selectBlock(null)} style={{ padding: '16px 24px', background: 'transparent', border: `1.5px solid rgba(240,237,228,0.3)`, color: 'var(--bone-on-dark)', fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer', fontWeight: 700, letterSpacing: '0.08em' }}>
                CLEAR
              </button>
              <button onClick={() => { if (myBlockCell) doReveal(myBlockCell) }} disabled={!myBlockCell}
                style={{ flex: 1, padding: 18, background: myBlockCell ? 'var(--amber)' : 'var(--amber-soft)', color: myBlockCell ? '#0d0d0d' : 'rgba(245,158,11,0.4)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: myBlockCell ? 'pointer' : 'not-allowed', transition: 'all 0.1s' }}>
                {myBlockCell ? `CONFIRM BLOCK — ${DROP_COL_LABELS[myBlockCell[1]]}${myBlockCell[0] + 1}` : 'SELECT A CELL FIRST'}
              </button>
            </div>
          </section>
        </>
      )}

      {/* REVEAL flash */}
      {dropPhase === 'reveal' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alarm)', letterSpacing: '0.22em', fontWeight: 700, marginBottom: 12 }}>● BLOCKS REVEALED</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 120, lineHeight: 0.85 }}>PLAY.</div>
          </div>
        </div>
      )}

      {/* PLAY PHASE */}
      {dropPhase === 'play' && (
        <>
          <section style={{ padding: '14px 32px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>OPPONENT</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--bone-on-dark)', marginTop: 2 }}>LASERHAWK</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums' }}>
                {myTurn && !winner ? `00:${playTimer.toString().padStart(2, '0')}` : '—:——'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: myTurn && !winner ? 'var(--amber)' : 'var(--bone-ghost)', fontWeight: 700, letterSpacing: '0.14em' }}>
                {winner ? (winner === 'me' ? '4 IN A ROW' : 'OPPONENT WINS') : isDraw ? 'DRAW' : myTurn ? '● YOUR MOVE' : '● BOT THINKING'}
              </div>
            </div>
          </section>

          <section style={{ flex: 1, background: 'var(--concrete-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 32px' }}>
            <div onMouseLeave={() => setHoveredCol(null)}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                {DROP_COL_LABELS.map((l, ci) => (
                  <div key={l} style={{ width: CELL_SIZE, textAlign: 'center', cursor: myTurn && canDrop(ci) && !winner ? 'pointer' : 'default' }}
                    onClick={() => myTurn && canDrop(ci) && !winner && dropPiece(ci)}
                    onMouseEnter={() => myTurn && !winner && setHoveredCol(ci)}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{l}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: CELL_SIZE * 0.5, color: myTurn && canDrop(ci) && !winner ? 'var(--amber)' : 'rgba(240,237,228,0.10)', lineHeight: 1.1 }}>↓</div>
                  </div>
                ))}
              </div>

              <div id="drop-board" style={{ background: 'var(--ink)', padding: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`, gap: 3 }}>
                  {board.flatMap((row, r) => row.map((cell, c) => {
                    const isWin = winCells.some(([wr, wc]) => wr === r && wc === c)
                    const isLast = lastCell?.[0] === r && lastCell?.[1] === c
                    const isBlock = cell === 'block-me' || cell === 'block-opp'
                    const gRow = hoveredCol === c ? getGhostRow(c) : null
                    const isGhost = !isBlock && cell === null && r === gRow && myTurn && !winner
                    const f = isBlock ? null : cellToFill(cell)
                    return (
                      <div key={`${r}-${c}`} id={`cell-${r}-${c}`} className="board-cell"
                        onClick={() => myTurn && canDrop(c) && !winner && dropPiece(c)}
                        onMouseEnter={() => myTurn && !winner && setHoveredCol(c)}
                        style={{ cursor: myTurn && canDrop(c) && !winner ? 'pointer' : 'default', position: 'relative' }}>
                        {isWin ? (
                          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                            style={{ width: CELL_SIZE, height: CELL_SIZE, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: CELL_SIZE * 0.78, height: CELL_SIZE * 0.78, borderRadius: '50%', background: cell === 'me' ? 'var(--amber)' : 'var(--accent)', border: '2px solid var(--bone-on-dark)' }} />
                          </motion.div>
                        ) : (
                          <DropMCell size={CELL_SIZE} fill={f} block={isBlock} ghost={isGhost} last={isLast} />
                        )}
                      </div>
                    )
                  }))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
                {[
                  { color: 'var(--amber)', label: 'YOU' },
                  { color: 'var(--accent)', label: 'THEM' },
                  { color: 'rgba(80,76,70,0.9)', label: 'BLOCK' },
                ].map(({ color, label }) => (
                  <span key={label} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-faint)', letterSpacing: '0.10em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '20px 32px 28px' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ padding: '16px 24px', background: 'transparent', border: `1.5px solid rgba(240,237,228,0.3)`, color: 'var(--bone-on-dark)', fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer', fontWeight: 700, letterSpacing: '0.08em' }}>
                FORFEIT
              </button>
              <button style={{ flex: 1, padding: 18, background: myTurn && !winner && !isDraw ? 'var(--amber)' : 'var(--amber-soft)', color: myTurn && !winner && !isDraw ? '#0d0d0d' : 'rgba(245,158,11,0.4)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'default' }}>
                {winner === 'me' ? 'YOU WIN →' : winner === 'opp' ? 'OPPONENT WINS' : isDraw ? 'DRAW · SPLIT POT' : myTurn ? 'TAP A COLUMN TO DROP' : 'BOT IS THINKING…'}
              </button>
            </div>
          </section>
        </>
      )}
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
