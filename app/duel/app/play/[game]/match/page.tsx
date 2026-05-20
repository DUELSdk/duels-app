'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { animate, stagger } from 'animejs'
import { tierFromKr, DEFAULT_TIER, type Tier } from '@/lib/tiers'
import { saveMatchResult } from '@/lib/match-state'
import { supabase } from '@/lib/supabase'

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

const MOVE_NAME: Record<Move, string> = { R: 'ROCK', P: 'PAPER', S: 'SCISSORS' }

function cardOutcome(me: Move, opp: Move): 'win' | 'loss' | 'tie' {
  if (me === opp) return 'tie'
  if ((me === 'R' && opp === 'S') || (me === 'S' && opp === 'P') || (me === 'P' && opp === 'R')) return 'win'
  return 'loss'
}

// ── CDCard — matches design handoff exactly ────────────────────
function CDCard({
  k, slot, size = 80,
  faceDown, sealed, active, win, loss, tie, empty, ghost, dim,
}: {
  k?: Move; slot?: number; size?: number;
  faceDown?: boolean; sealed?: boolean; active?: boolean;
  win?: boolean; loss?: boolean; tie?: boolean;
  empty?: boolean; ghost?: boolean; dim?: boolean;
}) {
  const w = size
  const h = Math.round(size * 1.40)

  let bg = 'var(--concrete-2)'
  let fg = 'var(--bone-on-dark)'
  let border = 'rgba(240,237,228,0.16)'

  if (faceDown || sealed) { bg = 'var(--concrete-3)'; fg = 'transparent'; border = 'rgba(240,237,228,0.10)' }
  if (active)  { border = 'var(--alarm)'; bg = 'rgba(239,0,0,0.06)' }
  if (win)     { border = 'var(--money)'; bg = 'rgba(29,138,58,0.10)'; fg = 'var(--bone-on-dark)' }
  if (loss)    { border = 'var(--alarm)'; bg = 'rgba(239,0,0,0.08)'; fg = 'var(--bone-on-dark)' }
  if (tie)     { border = 'rgba(240,237,228,0.20)'; bg = 'var(--concrete-3)' }
  if (empty)   { border = 'rgba(240,237,228,0.10)'; bg = 'transparent'; fg = 'transparent' }
  if (ghost)   { bg = 'transparent'; fg = 'var(--bone-ghost)'; border = 'rgba(240,237,228,0.10)' }

  return (
    <div style={{
      width: w, height: h,
      border: `1.5px solid ${border}`,
      background: bg, color: fg,
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: dim ? 0.45 : 1,
      flexShrink: 0,
      transition: 'background 0.15s, border-color 0.15s',
    }}>
      {/* slot stamp */}
      {slot != null && !empty && (
        <div style={{
          position: 'absolute', top: 5, left: 6,
          fontFamily: 'var(--font-mono)', fontSize: Math.max(8, w * 0.11),
          color: sealed || faceDown ? 'rgba(240,237,228,0.30)'
               : active ? 'var(--alarm)'
               : 'var(--bone-ghost)',
          letterSpacing: '0.10em', fontWeight: 600,
        }}>
          {String(slot).padStart(2, '0')}
        </div>
      )}

      {/* wax seal X */}
      {sealed && (
        <>
          <svg viewBox="0 0 100 100" width={w * 0.48} height={w * 0.48} style={{ opacity: 0.55 }}>
            <line x1="20" y1="20" x2="80" y2="80" stroke="var(--alarm)" strokeWidth="6" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="var(--alarm)" strokeWidth="6" />
          </svg>
          <div style={{
            position: 'absolute', bottom: 7, left: 0, right: 0, textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: Math.max(8, w * 0.11),
            color: 'rgba(240,237,228,0.4)', letterSpacing: '0.14em',
          }}>SEALED</div>
        </>
      )}

      {/* face-down */}
      {faceDown && !sealed && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: Math.max(9, w * 0.14), color: 'rgba(240,237,228,0.30)', letterSpacing: '0.18em' }}>CARD</span>
      )}

      {/* face-up */}
      {!faceDown && !sealed && !empty && k && (
        <>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: w * 0.78, lineHeight: 0.85, letterSpacing: '-0.04em',
            color: ghost ? 'var(--bone-ghost)' : fg,
          }}>{k}</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: Math.max(8, w * 0.11),
            color: ghost ? 'var(--bone-ghost)' : 'var(--bone-faint)',
            letterSpacing: '0.10em', marginTop: 2, fontWeight: 600,
          }}>{MOVE_NAME[k]}</span>
        </>
      )}

      {/* active marker */}
      {active && (
        <div style={{
          position: 'absolute', top: 5, right: 6,
          fontFamily: 'var(--font-mono)', fontSize: Math.max(8, w * 0.11),
          color: 'var(--alarm)', fontWeight: 700,
        }}>●</div>
      )}
    </div>
  )
}

// ── ProgChip — slot progress strip ─────────────────────────────
function ProgChip({ state, k, isCurrent, size = 40 }: {
  state: 'win' | 'loss' | 'tie' | 'pending' | 'current'
  k?: Move; isCurrent?: boolean; size?: number
}) {
  let bg = 'transparent', fg = 'var(--bone-ghost)', border = 'rgba(240,237,228,0.18)'
  if (state === 'win')  { bg = 'var(--money)'; fg = '#fff'; border = 'var(--money)' }
  if (state === 'loss') { bg = 'var(--alarm)'; fg = '#fff'; border = 'var(--alarm)' }
  if (state === 'tie')  { bg = 'var(--concrete-3)'; fg = 'var(--bone-faint)'; border = 'rgba(240,237,228,0.20)' }
  if (isCurrent)        { bg = 'rgba(239,0,0,0.12)'; border = 'var(--alarm)'; fg = 'var(--alarm)' }
  return (
    <div style={{
      width: size, height: size,
      background: bg, color: fg, border: `1.5px solid ${border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.45, letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>
      {k && !isCurrent ? k : isCurrent ? '●' : ''}
    </div>
  )
}


// ── Card Duel multiplayer types ────────────────────────────────
type CDGameState = {
  phase: 'lock' | 'reveal' | 'sudden_death' | 'complete'
  p1_locked: boolean; p2_locked: boolean
  p1_sequence: string[] | null; p2_sequence: string[] | null
  round_results: string[] | null
  p1_score: number; p2_score: number
  sd_round: number
  sd_p1_card: string | null; sd_p2_card: string | null
}
const TO_CARD: Record<Move, string> = { R: 'rock', P: 'paper', S: 'scissors' }
const TO_MOVE: Record<string, Move> = { rock: 'R', paper: 'P', scissors: 'S' }

function CardDuelMatch({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const matchId = searchParams.get('matchId')

  // ── Supabase state ──────────────────────────────────────────────
  const [iAmP1,     setIAmP1]     = useState(false)
  const [myHandle,  setMyHandle]  = useState('YOU')
  const [oppHandle, setOppHandle] = useState('OPP')
  const [stakeKr,   setStakeKr]   = useState(50)
  const [gs,        setGs]        = useState<CDGameState | null>(null)
  const [loading,   setLoading]   = useState(true)
  const iAmP1Ref = useRef(false)
  // ── Local arrangement ───────────────────────────────────────────
  const [myHand,   setMyHand]   = useState<Move[]>(['R','R','R','P','P','P','S','S','S'])
  const [mySlots,  setMySlots]  = useState<(Move|null)[]>(Array(9).fill(null))
  const [selHand,  setSelHand]  = useState<number|null>(null)
  const [myLocked, setMyLocked] = useState(false)
  const [locking,  setLocking]  = useState(false)
  const [lockError,setLockError]= useState<string|null>(null)

  // ── Reveal animation ────────────────────────────────────────────
  const [revealIdx,   setRevealIdx]   = useState(-1)
  const [slotResults, setSlotResults] = useState<Array<'win'|'loss'|'tie'|'pending'>>(Array(9).fill('pending'))
  const [revealScore, setRevealScore] = useState({ me: 0, opp: 0 })
  const revealStartedRef = useRef(false)
  const prevPhaseRef     = useRef('')

  // ── Sudden death ────────────────────────────────────────────────
  const [sdPick,        setSdPick]        = useState<Move|null>(null)
  const [sdBusy,        setSdBusy]        = useState(false)
  const [sdRevealPhase, setSdRevealPhase] = useState<'picking'|'waiting'|'revealed'>('picking')
  const [sdResult,      setSdResult]      = useState<{my:Move;opp:Move}|null>(null)
  const prevSdCardsRef = useRef('')

  // ── Selection state ────────────────────────────────────────────
  const [selSlot, setSelSlot] = useState<number|null>(null)
  // ── Reveal animation ─────────────────────────────────────────────
  const [clashPhase, setClashPhase] = useState<'facedown'|'revealed'>('facedown')

  // ── Load match + subscribe ──────────────────────────────────────
  useEffect(() => {
    if (!matchId) { router.replace('/play'); return }
    let destroyed = false
    let pollInterval: ReturnType<typeof setInterval>
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || destroyed) return

      const { data: match } = await supabase
        .from('matches')
        .select('player1_id, player2_id, stake_ore')
        .eq('id', matchId)
        .single()
      if (!match || destroyed) return

      const p1 = match.player1_id === user.id
      iAmP1Ref.current = p1
      setIAmP1(p1)
      setStakeKr(Math.round(match.stake_ore / 100))

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, handle')
        .in('id', [match.player1_id, match.player2_id])
      if (profiles && !destroyed) {
        const me = profiles.find(p => p.id === user.id)
        const opp = profiles.find(p => p.id !== user.id)
        if (me)  setMyHandle(me.handle)
        if (opp) setOppHandle(opp.handle)
      }

      const { data: gsInit } = await supabase
        .from('game_state')
        .select('*')
        .eq('match_id', matchId)
        .single()
      if (gsInit && !destroyed) setGs(gsInit as CDGameState)
      if (!destroyed) setLoading(false)

      channel = supabase
        .channel(`gs-${matchId}`)
        .on('postgres_changes', {
          event: 'UPDATE', schema: 'public', table: 'game_state',
          filter: `match_id=eq.${matchId}`,
        }, payload => { if (!destroyed) setGs(payload.new as CDGameState) })
        .subscribe()

      pollInterval = setInterval(async () => {
        if (destroyed) return
        const { data } = await supabase.from('game_state').select('*').eq('match_id', matchId).single()
        if (data && !destroyed) setGs(data as CDGameState)
      }, 2000)
    }

    init()
    return () => { destroyed = true; clearInterval(pollInterval); channel?.unsubscribe() }
  }, [matchId, router])

  // ── Trigger reveal animation when phase becomes 'reveal' ─────────
  useEffect(() => {
    if (!gs || gs.phase !== 'reveal' || revealStartedRef.current) return
    revealStartedRef.current = true
    setRevealIdx(0)
    setSlotResults(Array(9).fill('pending'))
    setRevealScore({ me: 0, opp: 0 })
    setClashPhase('facedown')
  }, [gs])

  // ── Walk reveal slot by slot ─────────────────────────────────────
  useEffect(() => {
    if (!gs || gs.phase !== 'reveal' || !gs.round_results || revealIdx < 0 || revealIdx >= 9) return
    setClashPhase('facedown')
    const flipId = setTimeout(() => {
      const raw = gs.round_results![revealIdx]
      const result: 'win'|'loss'|'tie' =
        raw === 'tie' ? 'tie' :
        (raw === 'p1' && iAmP1Ref.current) || (raw === 'p2' && !iAmP1Ref.current) ? 'win' : 'loss'
      setSlotResults(prev => { const n = [...prev]; n[revealIdx] = result; return n })
      setRevealScore(s => ({ me: s.me + (result === 'win' ? 1 : 0), opp: s.opp + (result === 'loss' ? 1 : 0) }))
      setClashPhase('revealed')
    }, 950)
    const advId = setTimeout(() => {
      if (revealIdx < 8) setRevealIdx(r => r + 1)
      // At slot 9, server transitions phase — Realtime picks it up
    }, 4400)
    return () => { clearTimeout(flipId); clearTimeout(advId) }
  }, [gs, revealIdx])

  // ── SD reveal when both cards appear ────────────────────────────
  useEffect(() => {
    if (!gs || gs.phase !== 'sudden_death') return
    const myCard  = iAmP1Ref.current ? gs.sd_p1_card : gs.sd_p2_card
    const oppCard = iAmP1Ref.current ? gs.sd_p2_card : gs.sd_p1_card
    const key = `${myCard}-${oppCard}`
    if (myCard && oppCard && key !== prevSdCardsRef.current) {
      prevSdCardsRef.current = key
      setSdRevealPhase('revealed')
      setSdResult({ my: TO_MOVE[myCard], opp: TO_MOVE[oppCard] })
    }
    if (!myCard && !oppCard && prevSdCardsRef.current !== '') {
      prevSdCardsRef.current = ''
      setSdPick(null); setSdBusy(false); setSdRevealPhase('picking'); setSdResult(null)
    }
  }, [gs])

  // ── Navigate to result when complete ────────────────────────────
  useEffect(() => {
    if (!gs || gs.phase !== 'complete') return
    const myScore  = iAmP1Ref.current ? gs.p1_score : gs.p2_score
    const oppScore = iAmP1Ref.current ? gs.p2_score : gs.p1_score
    const id = setTimeout(() => {
      router.replace(`/play/${slug}/result?matchId=${matchId}&myScore=${myScore}&oppScore=${oppScore}`)
    }, 1200)
    return () => clearTimeout(id)
  }, [gs, matchId, router, slug])

  // ── Arrangement handlers ─────────────────────────────────────────
  function handleHandClick(idx: number) {
    if (myLocked || !gs || gs.phase !== 'lock') return
    if (selSlot !== null) {
      const handCard = myHand[idx]
      const slotCard = mySlots[selSlot]
      const newSlots = [...mySlots]; newSlots[selSlot] = handCard
      const newHand = [...myHand]
      if (slotCard !== null) { newHand[idx] = slotCard } else { newHand.splice(idx, 1) }
      setMySlots(newSlots); setMyHand(newHand); setSelSlot(null); setSelHand(null)
    } else {
      setSelHand(prev => prev === idx ? null : idx); setSelSlot(null)
    }
  }

  function handleSlotClick(idx: number) {
    if (myLocked || !gs || gs.phase !== 'lock') return
    const slotCard = mySlots[idx]
    if (selHand !== null) {
      const handCard = myHand[selHand]
      const newSlots = [...mySlots]; newSlots[idx] = handCard
      const newHand = [...myHand]
      if (slotCard !== null) { newHand[selHand] = slotCard } else { newHand.splice(selHand, 1) }
      setMySlots(newSlots); setMyHand(newHand); setSelHand(null); setSelSlot(null)
    } else if (selSlot !== null) {
      if (selSlot === idx) { setSelSlot(null); return }
      const newSlots = [...mySlots]
      ;[newSlots[selSlot], newSlots[idx]] = [newSlots[idx], newSlots[selSlot]]
      setMySlots(newSlots); setSelSlot(null)
    } else if (slotCard !== null) {
      setSelSlot(idx); setSelHand(null)
    }
  }

  async function handleLock() {
    if (locking || myLocked || myHand.length > 0 || !matchId) return
    setLocking(true); setLockError(null)
    const sequence = mySlots.map(m => TO_CARD[m!])
    const res = await fetch('/api/card-duel/lock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, sequence }),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'LOCK FAILED' }))
      setLockError(error ?? 'LOCK FAILED'); setLocking(false)
    } else {
      setMyLocked(true); setLocking(false)
    }
  }

  async function handleSdPick(pick: Move) {
    if (sdBusy || sdPick || !matchId) return
    setSdPick(pick); setSdBusy(true); setSdRevealPhase('waiting')
    const res = await fetch('/api/card-duel/sudden-death', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, card: TO_CARD[pick] }),
    })
    if (!res.ok) { setSdPick(null); setSdBusy(false); setSdRevealPhase('picking') }
  }

  // ── Derived values ───────────────────────────────────────────────
  const mySeq  = gs ? (iAmP1 ? gs.p1_sequence : gs.p2_sequence) : null
  const oppSeq = gs ? (iAmP1 ? gs.p2_sequence : gs.p1_sequence) : null
  const oppLocked = gs ? (iAmP1 ? gs.p2_locked : gs.p1_locked) : false
  const potKr  = stakeKr * 2

  const revealMyCard  = mySeq  && revealIdx >= 0 && revealIdx < 9 ? TO_MOVE[mySeq[revealIdx]]  : null
  const revealOppCard = oppSeq && revealIdx >= 0 && revealIdx < 9 ? TO_MOVE[oppSeq[revealIdx]] : null
  const revealResult  = revealMyCard && revealOppCard ? cardOutcome(revealMyCard, revealOppCard) : null

  const CLASH_COPY: Record<string, string> = {
    'R-S': 'ROCK CRUSHES SCISSORS.', 'P-R': 'PAPER COVERS ROCK.', 'S-P': 'SCISSORS CUT PAPER.',
    'S-R': 'ROCK CRUSHES SCISSORS.', 'R-P': 'PAPER COVERS ROCK.', 'P-S': 'SCISSORS CUT PAPER.',
  }
  const clashKey  = revealMyCard && revealOppCard ? `${revealMyCard}-${revealOppCard}` : ''
  const clashCopy = CLASH_COPY[clashKey] || (revealMyCard && revealMyCard === revealOppCard ? `${MOVE_NAME[revealMyCard]} VS ${MOVE_NAME[revealMyCard]} — TIE.` : '')

  // ── LOADING ──────────────────────────────────────────────────────
  if (loading || !gs) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--concrete)', color: 'var(--bone-on-dark)', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-ghost)', letterSpacing: '0.22em' }}
      >LOADING MATCH…</motion.div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--concrete)', color: 'var(--bone-on-dark)', overflow: 'hidden' }}>
      <BunkerTop
        phase={
          gs.phase === 'lock'         ? 'LOCK IN' :
          gs.phase === 'reveal'       ? `SLOT ${revealIdx + 1} / 9` :
          gs.phase === 'sudden_death' ? 'SUDDEN DEATH' : 'MATCH OVER'
        }
        pot={potKr}
        game="CARD DUEL"
      />

      {/* ── LOCK PHASE ──────────────────────────────────────────── */}
      {gs.phase === 'lock' && (
        <>
          {/* Top bar */}
          <div style={{ padding: '10px 40px', borderBottom: div, background: 'var(--concrete-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--alarm)', letterSpacing: '0.16em', fontWeight: 700 }}>
              ● {myHand.length > 0 ? `${9 - myHand.length} / 9 PLACED` : 'ALL PLACED · READY TO SEAL'}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>
              OPP · <span style={{ color: oppLocked ? 'var(--money)' : 'var(--bone-ghost)', fontWeight: 700 }}>
                {oppLocked ? 'SEALED' : 'ARRANGING'}
              </span>
            </span>
          </div>

          {/* Main: two halves */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* OPP HALF */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 40px 10px', background: 'var(--concrete-2)', overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 12, textAlign: 'center' }}>
                OPP · {oppHandle} · {oppLocked ? 'SEALED' : 'ARRANGING'} · MOVES HIDDEN
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flex: 1, alignItems: 'center', overflowX: 'auto' }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <CDCard key={i} faceDown size={72} slot={i + 1} />
                ))}
              </div>
            </div>

            {/* VS divider */}
            <div style={{ flexShrink: 0, height: 48, display: 'flex', alignItems: 'center', padding: '0 40px', background: 'var(--concrete)' }}>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{myHandle}</span>
              </div>
              <div style={{ width: 56, textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: 'var(--bone-ghost)', letterSpacing: '0.22em' }}>VS</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{oppHandle}</span>
              </div>
            </div>

            {/* YOUR HALF */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 40px', background: 'var(--concrete-3)', overflowY: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-on-dark)', letterSpacing: '0.14em', marginBottom: 12, fontWeight: 600, textAlign: 'center' }}>
                YOU · {myHandle} ·{' '}
                {selHand !== null ? 'CLICK A SLOT TO PLACE' :
                 selSlot !== null ? 'CLICK SLOT OR HAND CARD TO MOVE' :
                 'CLICK A CARD TO SELECT'}
              </div>

              {/* Sequence slots */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', overflowX: 'auto' }}>
                {mySlots.map((k, i) => (
                  <div
                    key={i}
                    onClick={() => handleSlotClick(i)}
                    style={{
                      cursor: myLocked ? 'default' : 'pointer',
                      outline: k === null && selHand !== null ? '1.5px solid rgba(239,0,0,0.45)' : 'none',
                      outlineOffset: 2,
                    }}
                  >
                    <CDCard
                      k={k ?? undefined}
                      slot={i + 1}
                      size={72}
                      active={selSlot === i}
                      empty={k === null}
                      sealed={myLocked && k !== null}
                    />
                  </div>
                ))}
              </div>

              {/* Hand */}
              <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                {myHand.length > 0 ? (
                  <>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 10, textAlign: 'center' }}>
                      HAND · {myHand.length} REMAINING
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', overflowX: 'auto' }}>
                      {myHand.map((k, i) => (
                        <div key={i} onClick={() => handleHandClick(i)} style={{ cursor: myLocked ? 'default' : 'pointer' }}>
                          <CDCard k={k} size={72} active={selHand === i} dim={selHand !== null && selHand !== i} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--money)', letterSpacing: '0.14em', fontWeight: 700 }}>
                    ● ALL 9 PLACED · READY TO SEAL
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '14px 40px', display: 'flex', gap: 12, alignItems: 'center', borderTop: div, flexShrink: 0 }}>
            {lockError && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--alarm)', letterSpacing: '0.10em' }}>{lockError}</span>}
            {myLocked ? (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--alarm)', letterSpacing: '0.22em', fontWeight: 700, flex: 1 }}
              >● WAITING FOR {oppHandle}…</motion.div>
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', flex: 1, letterSpacing: '0.10em' }}>NO CHANGES AFTER SUBMIT</span>
            )}
            <button onClick={handleLock} disabled={myLocked || myHand.length > 0 || locking} style={{
              padding: '16px 32px', border: 'none',
              background: myHand.length === 0 && !myLocked && !locking ? 'var(--alarm)' : 'rgba(240,237,228,0.06)',
              color: myHand.length === 0 && !myLocked && !locking ? '#fff' : 'var(--bone-ghost)',
              fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 16, letterSpacing: '0.04em', fontWeight: 700,
              cursor: myLocked || myHand.length > 0 || locking ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}>{myLocked ? 'SEALED ✓' : locking ? 'SEALING…' : 'SEAL ALL 9 →'}</button>
          </div>
        </>
      )}

      {/* ── REVEAL JUMBOTRON ────────────────────────────────────── */}
      {gs.phase === 'reveal' && revealMyCard && revealOppCard && (
        <>
          {/* Score header */}
          <section style={{ padding: '16px 40px', borderBottom: div, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>YOU · {myHandle}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, lineHeight: 0.85, color: 'var(--money)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{revealScore.me}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alarm)', letterSpacing: '0.22em', fontWeight: 700 }}>● CLASH · SLOT {revealIdx + 1} / 9</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--bone-faint)', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SEQUENCES SEALED · WATCH IT PLAY</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>OPP · {oppHandle}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, lineHeight: 0.85, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{revealScore.opp}</div>
            </div>
          </section>

          {/* Main clash arena */}
          <section style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px',
            background: 'radial-gradient(ellipse at center, var(--concrete-2) 0%, var(--concrete) 80%)',
            position: 'relative', overflow: 'hidden',
          }}>
            <AnimatePresence>
              {clashPhase === 'revealed' && (
                <motion.div
                  key={`flash-${revealIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.65, times: [0, 0.18, 1], ease: 'easeOut' }}
                  style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: revealResult === 'win'
                      ? 'radial-gradient(ellipse at center, rgba(29,138,58,0.24) 0%, transparent 68%)'
                      : revealResult === 'loss'
                      ? 'radial-gradient(ellipse at center, rgba(239,0,0,0.20) 0%, transparent 68%)'
                      : 'radial-gradient(ellipse at center, rgba(240,237,228,0.10) 0%, transparent 68%)',
                  }}
                />
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48 }}>
              {/* My card */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: 320 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 16 }}>YOUR SLOT {revealIdx + 1}</div>
                <div style={{ display: 'inline-block', perspective: '700px' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`my-${revealIdx}-${clashPhase}`}
                      initial={clashPhase === 'facedown' ? { y: -18, opacity: 0 } : { rotateY: -90, opacity: 0 }}
                      animate={{ y: 0, rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0, transition: { duration: 0.14, ease: 'easeIn' } }}
                      transition={{ duration: clashPhase === 'facedown' ? 0.28 : 0.22, ease: 'easeOut' }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <CDCard
                        k={clashPhase === 'revealed' ? revealMyCard : undefined}
                        faceDown={clashPhase === 'facedown'}
                        slot={revealIdx + 1} size={180}
                        win={clashPhase === 'revealed' && revealResult === 'win'}
                        loss={clashPhase === 'revealed' && revealResult === 'loss'}
                        tie={clashPhase === 'revealed' && revealResult === 'tie'}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* VS */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, lineHeight: 0.85, color: 'var(--bone-faint)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>VS</span>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 200, height: 200, border: '2px solid var(--money)', borderRadius: '50%', transform: 'translate(-50%,-50%)', opacity: 0.2 }} />
                <AnimatePresence>
                  {clashPhase === 'facedown' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--alarm)', letterSpacing: '0.22em', fontWeight: 700 }}
                    >●●●</motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Opp card */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: 320 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 16 }}>OPP SLOT {revealIdx + 1}</div>
                <div style={{ display: 'inline-block', perspective: '700px' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`opp-${revealIdx}-${clashPhase}`}
                      initial={clashPhase === 'facedown' ? { y: -18, opacity: 0 } : { rotateY: 90, opacity: 0 }}
                      animate={{ y: 0, rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0, transition: { duration: 0.14, ease: 'easeIn' } }}
                      transition={{ duration: clashPhase === 'facedown' ? 0.28 : 0.22, ease: 'easeOut' }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <CDCard
                        k={clashPhase === 'revealed' ? revealOppCard : undefined}
                        faceDown={clashPhase === 'facedown'}
                        slot={revealIdx + 1} size={180}
                        win={clashPhase === 'revealed' && revealResult === 'loss'}
                        loss={clashPhase === 'revealed' && revealResult === 'win'}
                        tie={clashPhase === 'revealed' && revealResult === 'tie'}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Result announcement */}
            <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center' }}>
              <AnimatePresence mode="wait">
                {clashPhase === 'facedown' ? (
                  <motion.div
                    key={`suspense-${revealIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.2 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--bone-ghost)', letterSpacing: '0.26em', fontWeight: 600 }}
                  >SLOT {revealIdx + 1} · RESOLVING</motion.div>
                ) : (
                  <motion.div
                    key={`result-${revealIdx}`}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, lineHeight: 0.9,
                      letterSpacing: '-0.02em', textTransform: 'uppercase',
                      color: revealResult === 'win' ? 'var(--money)' : revealResult === 'loss' ? 'var(--alarm)' : 'var(--bone-faint)',
                    }}>{clashCopy}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-on-dark)', letterSpacing: '0.20em', marginTop: 10, fontWeight: 600 }}>
                      {revealResult === 'win' ? `${myHandle} TAKES SLOT ${revealIdx + 1} · +1` :
                       revealResult === 'loss' ? `${oppHandle} TAKES SLOT ${revealIdx + 1} · +1` :
                       `SLOT ${revealIdx + 1} · TIE · NO POINTS`}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Progress strip */}
          <section style={{ padding: '16px 40px', background: 'var(--concrete-2)', borderTop: div }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>SLOT PROGRESS · {revealIdx + 1} / 9</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-faint)', letterSpacing: '0.10em' }}>
                {clashPhase === 'facedown' ? 'RESOLVING...' : 'NEXT IN ~1.7s'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {slotResults.map((state, i) => (
                <ProgChip
                  key={i}
                  state={i === revealIdx ? 'current' : state}
                  k={state !== 'pending' && i < revealIdx && mySeq ? TO_MOVE[mySeq[i]] : undefined}
                  isCurrent={i === revealIdx}
                  size={44}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── SUDDEN DEATH ────────────────────────────────────────── */}
      {gs.phase === 'sudden_death' && (
        <>
          <section style={{ padding: '28px 40px', textAlign: 'center', borderBottom: div }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alarm)', letterSpacing: '0.22em', fontWeight: 700 }}>
              ● FULL HAND USED · TIED {gs.p1_score} — {gs.p2_score} · ONE CARD DECIDES
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 140, lineHeight: 0.82, marginTop: 6, color: 'var(--alarm)', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
              SUDDEN<br />DEATH.
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--bone-faint)', marginTop: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {sdRevealPhase === 'picking' ? 'Pick one of three. So do they. Highest beats wins.' :
               sdRevealPhase === 'waiting' ? 'Both cards locked. Outcome unknown.' : 'Cards revealed.'}
            </div>
            {gs.sd_round > 0 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', marginTop: 8, letterSpacing: '0.14em' }}>REPLAY · ROUND {gs.sd_round + 1}</div>}
          </section>

          <section style={{ flex: 1, background: 'var(--concrete-2)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 40px', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">

              {/* ── PICKING ── */}
              {sdRevealPhase === 'picking' && (
                <motion.div key="sd-picking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }} transition={{ duration: 0.22 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 28, textAlign: 'center' }}>
                    PICK ONE · OPPONENT PICKS SIMULTANEOUSLY
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                    {(['R', 'P', 'S'] as Move[]).map(k => (
                      <div key={k} style={{ textAlign: 'center' }}>
                        <div onClick={() => handleSdPick(k)} style={{ cursor: 'pointer' }}>
                          <CDCard k={k} size={150} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bone-ghost)', marginTop: 12, letterSpacing: '0.14em' }}>TAP</div>
                      </div>
                    ))}
                  </div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ textAlign: 'center', marginTop: 32, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--alarm)', letterSpacing: '0.18em', fontWeight: 700 }}
                  >● {oppHandle} THINKING…</motion.div>
                </motion.div>
              )}

              {/* ── WAITING + REVEALED ── */}
              {(sdRevealPhase === 'waiting' || sdRevealPhase === 'revealed') && sdPick && (
                <motion.div key="sd-clash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                  <AnimatePresence>
                    {sdRevealPhase === 'revealed' && sdResult && (
                      <motion.div
                        key={`sd-flash-${gs.sd_round}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.75, times: [0, 0.15, 1], ease: 'easeOut' }}
                        style={{
                          position: 'absolute', inset: 0, pointerEvents: 'none',
                          background: cardOutcome(sdResult.my, sdResult.opp) === 'win'
                            ? 'radial-gradient(ellipse at center, rgba(29,138,58,0.30) 0%, transparent 62%)'
                            : cardOutcome(sdResult.my, sdResult.opp) === 'loss'
                            ? 'radial-gradient(ellipse at center, rgba(239,0,0,0.25) 0%, transparent 62%)'
                            : 'radial-gradient(ellipse at center, rgba(240,237,228,0.12) 0%, transparent 62%)',
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 56 }}>
                    {/* My card */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 14 }}>YOU · LOCKED IN</div>
                      <CDCard
                        k={sdPick} size={160}
                        active={sdRevealPhase === 'waiting'}
                        win={sdRevealPhase === 'revealed' && !!sdResult && cardOutcome(sdResult.my, sdResult.opp) === 'win'}
                        loss={sdRevealPhase === 'revealed' && !!sdResult && cardOutcome(sdResult.my, sdResult.opp) === 'loss'}
                        tie={sdRevealPhase === 'revealed' && !!sdResult && cardOutcome(sdResult.my, sdResult.opp) === 'tie'}
                      />
                    </div>

                    {/* VS */}
                    <div style={{ textAlign: 'center' }}>
                      <motion.div
                        animate={sdRevealPhase === 'waiting' ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                        transition={{ duration: 1.3, repeat: sdRevealPhase === 'waiting' ? Infinity : 0, ease: 'easeInOut' }}
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 60, lineHeight: 0.85, letterSpacing: '-0.02em', textTransform: 'uppercase', color: sdRevealPhase === 'waiting' ? 'var(--alarm)' : 'var(--bone-faint)' }}
                      >VS</motion.div>
                    </div>

                    {/* Opp card */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 14 }}>OPP · {oppHandle}</div>
                      <div style={{ perspective: '700px' }}>
                        <AnimatePresence mode="wait">
                          {sdRevealPhase === 'waiting' ? (
                            <motion.div key={`opp-hidden-${gs.sd_round}`} exit={{ rotateY: 90, opacity: 0, transition: { duration: 0.14, ease: 'easeIn' } }}>
                              <motion.div
                                animate={{ boxShadow: ['0 0 0px 0px rgba(239,0,0,0)', '0 0 22px 4px rgba(239,0,0,0.28)', '0 0 0px 0px rgba(239,0,0,0)'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <CDCard faceDown size={160} />
                              </motion.div>
                            </motion.div>
                          ) : (
                            <motion.div key={`opp-revealed-${gs.sd_round}`} initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.26, ease: 'easeOut' }} style={{ transformStyle: 'preserve-3d' }}>
                              {sdResult && (
                                <CDCard
                                  k={sdResult.opp} size={160}
                                  win={cardOutcome(sdResult.my, sdResult.opp) === 'loss'}
                                  loss={cardOutcome(sdResult.my, sdResult.opp) === 'win'}
                                  tie={cardOutcome(sdResult.my, sdResult.opp) === 'tie'}
                                />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: 36, minHeight: 64 }}>
                    <AnimatePresence mode="wait">
                      {sdRevealPhase === 'waiting' && (
                        <motion.div key="sd-waiting-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.2 }}>
                          <motion.div
                            animate={{ opacity: [0.45, 1, 0.45] }}
                            transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--alarm)', letterSpacing: '0.26em', fontWeight: 700 }}
                          >● BOTH LOCKED · REVEALING</motion.div>
                        </motion.div>
                      )}
                      {sdRevealPhase === 'revealed' && sdResult && (
                        <motion.div key="sd-result-text" initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}>
                          <div style={{
                            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, lineHeight: 0.9,
                            letterSpacing: '-0.02em', textTransform: 'uppercase',
                            color: cardOutcome(sdResult.my, sdResult.opp) === 'win' ? 'var(--money)' : cardOutcome(sdResult.my, sdResult.opp) === 'loss' ? 'var(--alarm)' : 'var(--bone-faint)',
                          }}>
                            {cardOutcome(sdResult.my, sdResult.opp) === 'tie' ? 'TIE — AGAIN.' : cardOutcome(sdResult.my, sdResult.opp) === 'win' ? `${myHandle} WINS.` : `${oppHandle} WINS.`}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </section>

          <section style={{ padding: '20px 40px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>TIE AGAIN → INSTANT REPLAY · NO LIMIT</div>
          </section>
        </>
      )}

      {/* ── COMPLETE ────────────────────────────────────────────── */}
      {gs.phase === 'complete' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bone-ghost)', letterSpacing: '0.22em' }}
          >MATCH COMPLETE · LOADING RESULT…</motion.div>
        </div>
      )}
    </div>
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
