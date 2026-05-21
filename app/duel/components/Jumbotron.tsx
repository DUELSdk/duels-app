'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── Design helpers ───────────────────────────────────────────────────────────
const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.1em',
}
const display = (size: number): React.CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: size,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
})

// ── Types — mirror Supabase match data shape exactly ─────────────────────────
type CardMove  = 'R' | 'S' | 'P' | null
type CycleMove = 'F' | 'G' | 'S' | 'R' | 'A' | null

type CardBoard  = { kind: 'card-duel'; a: CardMove[];  b: CardMove[] }
type CycleBoard = { kind: 'cycleduel'; blocks: { a: CycleMove[]; b: CycleMove[] }[] }
type DropBoard  = { kind: 'dropduel';  grid: ('A' | 'B' | null)[][] }

export type LiveMatch = {
  id: string; gameLabel: string; stakeKr: number; pot: number
  playerA: string; playerB: string; watching: number; status: string
  board: CardBoard | CycleBoard | DropBoard
}

export type ScheduleItem = {
  day: string; time: string; startsIn: string
  name: string; game: string; pool: number; seats: string
}

export type JumboState =
  | { kind: 'live';    match: LiveMatch }
  | { kind: 'final';   match: LiveMatch; tournamentName: string; prize: number; round: string }
  | { kind: 'between'; schedule: ScheduleItem[] }


// ── Card Duel board ──────────────────────────────────────────────────────────
function cardResult(a: CardMove, b: CardMove): 'win' | 'loss' | 'tie' | null {
  if (!a || !b) return null
  if (a === b) return 'tie'
  if ((a==='R'&&b==='S')||(a==='P'&&b==='R')||(a==='S'&&b==='P')) return 'win'
  return 'loss'
}

function JSlot({ move, result }: { move: CardMove; result: 'win'|'loss'|'tie'|null }) {
  let bg = 'transparent', fg = 'var(--ink)', border = 'var(--ink)'
  if (move === null)        { bg = 'var(--ink)';   fg = 'transparent' }
  else if (result==='win')  { bg = 'var(--money)'; fg = '#fff'; border = 'var(--money)' }
  else if (result==='loss') { bg = 'var(--alarm)'; fg = '#fff'; border = 'var(--alarm)' }
  return (
    <div style={{
      width: 32, height: 44, border: `1.5px solid ${border}`,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
    }}>
      {move ?? ''}
    </div>
  )
}

function CardDuelBoard({ board, side }: { board: CardBoard; side: 'a'|'b' }) {
  const mine   = side === 'a' ? board.a : board.b
  const theirs = side === 'a' ? board.b : board.a
  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: side === 'b' ? 'flex-end' : 'flex-start' }}>
      {mine.map((m, i) => <JSlot key={i} move={m} result={cardResult(m, theirs[i])} />)}
    </div>
  )
}

// ── CycleDuel board ──────────────────────────────────────────────────────────
function CycleSlot({ move }: { move: CycleMove }) {
  return (
    <div style={{
      width: 28, height: 36, border: '1.5px solid var(--ink)',
      background: move ? 'var(--bone-2)' : 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
      color: move ? 'var(--ink)' : 'transparent',
    }}>
      {move ?? ''}
    </div>
  )
}

function CycleDuelBoard({ board, side }: { board: CycleBoard; side: 'a'|'b' }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: side === 'b' ? 'flex-end' : 'flex-start' }}>
      {board.blocks.map((block, bi) => (
        <div key={bi} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <div style={{ ...mono, fontSize: 8, color: 'var(--ink-faint)' }}>B{bi + 1}</div>
          <div style={{ display: 'flex', gap: 2 }}>
            {(side === 'a' ? block.a : block.b).map((m, i) => <CycleSlot key={i} move={m} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── DropDuel board ───────────────────────────────────────────────────────────
function DropDuelBoard({ board, side }: { board: DropBoard; side: 'a'|'b' }) {
  return (
    <div style={{ display: 'flex', justifyContent: side === 'b' ? 'flex-end' : 'flex-start' }}>
      <div style={{ background: 'var(--ink)', padding: 5 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 22px)', gap: 2 }}>
          {board.grid.flatMap((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: cell === 'A' ? 'var(--bone)' : cell === 'B' ? 'var(--alarm)' : 'rgba(13,13,13,0.12)',
              }} />
            </div>
          )))}
        </div>
      </div>
    </div>
  )
}

function GameBoard({ board, side }: { board: LiveMatch['board']; side: 'a'|'b' }) {
  if (board.kind === 'card-duel') return <CardDuelBoard board={board} side={side} />
  if (board.kind === 'cycleduel') return <CycleDuelBoard board={board} side={side} />
  return <DropDuelBoard board={board} side={side} />
}

function calcScore(board: LiveMatch['board']): [number, number] {
  if (board.kind !== 'card-duel') return [0, 0]
  return [
    board.a.filter((m, i) => cardResult(m, board.b[i]) === 'win').length,
    board.b.filter((m, i) => cardResult(m, board.a[i]) === 'win').length,
  ]
}

// ── Shared match panel ───────────────────────────────────────────────────────
function MatchPanel({ match, isFinal = false }: { match: LiveMatch; isFinal?: boolean }) {
  const [scoreA, scoreB] = calcScore(match.board)
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ ...mono, fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          LIVE · MATCH {match.id} · {match.gameLabel} · {match.stakeKr} KR ROOM
        </span>
        <span style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)' }}>{match.watching} WATCHING</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'center' }}>
        <div>
          <div style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>OPPONENT</div>
          <div style={{ ...display(56), lineHeight: 0.9 }}>{match.playerA}</div>
          <div style={{ marginTop: 14 }}><GameBoard board={match.board} side="a" /></div>
        </div>

        <div style={{ textAlign: 'center', minWidth: 120 }}>
          <div style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>
            {isFinal ? 'PRIZE' : 'POT'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88, letterSpacing: '-0.03em', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>
            {match.pot.toLocaleString('da-DK')}
          </div>
          <div style={{ ...display(18), marginTop: -4, letterSpacing: '0.02em' }}>KR</div>
          {match.board.kind === 'card-duel' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, marginTop: 14 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, fontVariantNumeric: 'tabular-nums' }}>{scoreA}</span>
              <div style={{ width: 3, height: 40, background: 'var(--alarm)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums' }}>{scoreB}</span>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>CHALLENGER</div>
          <div style={{ ...display(56), lineHeight: 0.9 }}>{match.playerB}</div>
          <div style={{ marginTop: 14 }}><GameBoard board={match.board} side="b" /></div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(13,13,13,0.22)' }}>
        <span className="thinking"><span /><span /><span /></span>
        <span style={{ ...mono, fontSize: 11, color: 'var(--ink-soft)' }}>{match.status}</span>
      </div>
    </>
  )
}

// ── State renders ────────────────────────────────────────────────────────────
function StateLive({ match }: { match: LiveMatch }) {
  return (
    <div style={{ border: '1.5px solid var(--ink)', background: 'var(--bone-2)', padding: 32 }}>
      <MatchPanel match={match} />
    </div>
  )
}

function StateFinal({ match, tournamentName, prize, round }: {
  match: LiveMatch; tournamentName: string; prize: number; round: string
}) {
  return (
    <div style={{ border: '2px solid var(--alarm)', background: 'var(--bone-2)' }}>
      <div style={{
        borderBottom: '1.5px solid rgba(239,0,0,0.3)', padding: '14px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(239,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ ...mono, fontSize: 9, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.18em' }}>● TOURNAMENT FINAL</span>
          <span style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>{round}</span>
        </div>
        <div style={{ ...display(20), lineHeight: 1 }}>{tournamentName}</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>WINNER TAKES</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {prize.toLocaleString('da-DK')} KR
          </div>
        </div>
      </div>
      <div style={{ padding: 32 }}>
        <MatchPanel match={match} isFinal />
      </div>
    </div>
  )
}

function StateBetween({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <div style={{ border: '1.5px solid var(--ink)', background: 'var(--bone-2)', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em', marginBottom: 6 }}>NO MATCH LIVE</div>
          <div style={{ ...display(40), lineHeight: 0.9 }}>UP NEXT · TONIGHT.</div>
        </div>
        <Link href="/tournaments" style={{ ...mono, fontSize: 10, color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--ink)', paddingBottom: 2 }}>
          VIEW ALL →
        </Link>
      </div>
      <div style={{ borderTop: '1.5px solid var(--ink)' }}>
        {schedule.map((item, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '80px 1fr 140px 140px 90px',
            gap: 24, alignItems: 'center', padding: '16px 0',
            borderBottom: i < schedule.length - 1 ? '1px solid var(--rule-soft)' : 'none',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em', lineHeight: 1 }}>{item.time}</div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--alarm)', marginTop: 2 }}>{item.startsIn}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{item.name}</div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 3 }}>{item.day}</div>
            </div>
            <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.08em' }}>{item.game}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
                {item.pool.toLocaleString('da-DK')} KR
              </div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>PRIZE POOL</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)' }}>{item.seats}</div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>SEATED</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export function Jumbotron({ px }: { px: string }) {
  const [state, setState] = useState<JumboState>({ kind: 'between', schedule: [] })

  useEffect(() => {
    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any).rpc('rpc_get_featured_match')
      if (!data) return

      const board: CardBoard = {
        kind: 'card-duel',
        a: data.board.a as CardMove[],
        b: data.board.b as CardMove[],
      }

      setState({
        kind: 'live',
        match: {
          id:        data.id,
          gameLabel: data.game_label,
          stakeKr:   data.stake_kr,
          pot:       data.pot,
          playerA:   data.player_a,
          playerB:   data.player_b,
          watching:  data.watching,
          status:    data.status_text,
          board,
        },
      })
    }
    load()
  }, [])

  const isBetween = state.kind === 'between'

  return (
    <section style={{ padding: `40px ${px}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ ...mono, fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isBetween && <span className="live-dot" />}
          {isBetween ? "TONIGHT'S CARD" : 'JUMBOTRON · WATCH IT HAPPEN'}
        </div>
      </div>

      {state.kind === 'live'    && <StateLive match={state.match} />}
      {state.kind === 'final'   && <StateFinal match={state.match} tournamentName={state.tournamentName} prize={state.prize} round={state.round} />}
      {state.kind === 'between' && <StateBetween schedule={state.schedule} />}
    </section>
  )
}
