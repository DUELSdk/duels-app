'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { loadMatchResult, markBalanceApplied, type MatchResult } from '@/lib/match-state'
import { adjustBalance, addTransaction } from '@/lib/balance'

type Move = 'R' | 'P' | 'S'
type CycleMove = 'Feint' | 'Guard' | 'Strike' | 'Rush' | 'Grab'

function cardOutcome(me: Move, opp: Move): 'win' | 'loss' | 'tie' {
  if (me === opp) return 'tie'
  if ((me === 'R' && opp === 'S') || (me === 'S' && opp === 'P') || (me === 'P' && opp === 'R')) return 'win'
  return 'loss'
}

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
const CYCLE_ABBR: Record<CycleMove, string> = { Feint: 'Fe', Guard: 'Gu', Strike: 'St', Rush: 'Ru', Grab: 'Gb' }
const CYCLE_COLOR: Record<CycleMove, string> = {
  Feint:  'rgba(139,92,246,0.55)',
  Guard:  'rgba(59,130,246,0.55)',
  Strike: 'rgba(239,68,68,0.55)',
  Rush:   'rgba(34,197,94,0.55)',
  Grab:   'rgba(245,158,11,0.55)',
}

function CycleRoundResult({ myMove, oppMove, round }: { myMove: CycleMove; oppMove: CycleMove; round: number }) {
  const result = cycleOutcome(myMove, oppMove)
  const barColor = result === 'win' ? 'var(--money)' : result === 'loss' ? 'var(--alarm)' : 'var(--ink-ghost)'
  const myBorder = result === 'win' ? 'var(--money)' : result === 'loss' ? 'var(--alarm)' : 'var(--rule-soft)'
  const oppBorder = result === 'loss' ? 'var(--money)' : 'var(--rule-soft)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)' }}>{round}</span>
      <div style={{ width: 36, height: 36, border: `1.5px solid ${oppBorder}`, background: result === 'loss' ? 'rgba(29,138,58,0.08)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: CYCLE_COLOR[oppMove] }}>
        {CYCLE_ABBR[oppMove]}
      </div>
      <div style={{ width: 36, height: 4, background: barColor }} />
      <div style={{ width: 36, height: 36, border: `1.5px solid ${myBorder}`, background: result === 'win' ? 'rgba(29,138,58,0.08)' : result === 'loss' ? 'rgba(239,0,0,0.06)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: CYCLE_COLOR[myMove] }}>
        {CYCLE_ABBR[myMove]}
      </div>
    </div>
  )
}

function SlotResult({ myMove, oppMove, slot }: { myMove: Move; oppMove: Move; slot: number }) {
  const result = cardOutcome(myMove, oppMove)
  const color  = result === 'win' ? 'var(--money)' : result === 'loss' ? 'var(--alarm)' : 'var(--ink-ghost)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)' }}>{slot}</span>
      <div style={{ width: 40, height: 40, border: `1.5px solid ${result === 'loss' ? 'var(--money)' : 'var(--rule-soft)'}`, background: result === 'loss' ? 'rgba(29,138,58,0.08)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: result === 'loss' ? 'var(--money)' : 'var(--ink-soft)' }}>{oppMove}</div>
      <div style={{ width: 40, height: 4, background: color }} />
      <div style={{ width: 40, height: 40, border: `1.5px solid ${result === 'win' ? 'var(--money)' : result === 'loss' ? 'var(--alarm)' : 'var(--rule-soft)'}`, background: result === 'win' ? 'rgba(29,138,58,0.08)' : result === 'loss' ? 'rgba(239,0,0,0.06)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: result === 'win' ? 'var(--money)' : result === 'loss' ? 'var(--alarm)' : 'var(--ink-soft)' }}>{myMove}</div>
    </div>
  )
}

function netDelta(r: MatchResult): number {
  if (r.outcome === 'win')  return r.winnerGets - r.stakeKr
  if (r.outcome === 'loss') return -r.stakeKr
  // draw: stake returned, no fee
  return 0
}

function netLabel(r: MatchResult): string {
  const d = netDelta(r)
  if (d > 0) return `+${d} KR`
  if (d < 0) return `${d} KR`
  return '±0 KR'
}

export default function ResultPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = use(params)
  const [result, setResult] = useState<MatchResult | null>(null)

  useEffect(() => {
    const r = loadMatchResult()
    if (!r) return
    setResult(r)
    if (!r.balanceApplied) {
      const delta = netDelta(r)
      adjustBalance(delta)
      const desc = r.outcome === 'win'
        ? `Win · ${slug.toUpperCase().replace('-', ' ')} · ${r.stakeKr} KR room`
        : r.outcome === 'loss'
        ? `Loss · ${slug.toUpperCase().replace('-', ' ')} · ${r.stakeKr} KR room`
        : `Draw · ${slug.toUpperCase().replace('-', ' ')} · ${r.stakeKr} KR room`
      addTransaction(desc, delta)
      markBalanceApplied()
    }
  }, [slug])

  if (!result) {
    return (
      <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
        <BroadcastNav activePage="games" />
        <section style={{ padding: `56px ${s.px}` }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, color: 'var(--ink-ghost)' }}>MATCH COMPLETE.</div>
          <div style={{ ...s.mono, color: 'var(--ink-faint)', marginTop: 16 }}>No result data found.</div>
          <Link href="/play" style={{ ...s.mono, display: 'inline-block', marginTop: 32, border: '1.5px solid var(--ink)', padding: '12px 24px', textDecoration: 'none', color: 'var(--ink)' }}>BACK TO GAMES →</Link>
        </section>
        <Footer />
      </div>
    )
  }

  const won        = result.outcome === 'win'
  const tied       = result.outcome === 'draw'
  const delta      = netDelta(result)
  const isCardDuel  = result.game === 'card-duel' && result.mySeq && result.oppSeq && result.mySeq.length === 9
  const isCycleDuel = result.game === 'cycleduel' && result.mySeq && result.oppSeq && result.mySeq.length > 0

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="games" />

      <section style={{ padding: `56px ${s.px} 48px` }}>
        {/* Outcome headline */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>
            {slug.toUpperCase().replace('-', ' ')} · {result.stakeKr} KR ROOM · {result.tierId.toUpperCase()}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 120, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.85, color: won ? 'var(--money)' : tied ? 'var(--ink)' : 'var(--alarm)' }}>
            {won ? 'YOU WIN.' : tied ? 'SPLIT.' : 'YOU LOSE.'}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48 }}>{result.myScore}</span>
              <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>—</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, color: 'var(--ink-ghost)' }}>{result.oppScore}</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: delta > 0 ? 'var(--money)' : delta < 0 ? 'var(--alarm)' : 'var(--ink-soft)' }}>
                {netLabel(result)}
              </div>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>
                {won
                  ? `WINNER TAKES ${result.winnerGets} KR · ENTRY FEE ${result.entryFee * 2} KR`
                  : tied
                  ? 'DRAW · ENTRY RETURNED'
                  : `ENTRY ${result.stakeKr} KR · BETTER LUCK NEXT TIME`}
              </div>
            </div>
          </div>
        </div>

        {/* Card Duel: full sequence reveal */}
        {isCardDuel && result.mySeq && result.oppSeq && (
          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>
              FULL SEQUENCE REVEAL — SLOT 1→9
            </div>
            <div style={s.rule} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 13, paddingBottom: 13, alignItems: 'flex-end', minWidth: 80 }}>
                <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', height: 40, display: 'flex', alignItems: 'center' }}>BOT</span>
                <div style={{ height: 4 }} />
                <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', height: 40, display: 'flex', alignItems: 'center' }}>YOU</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {result.mySeq.map((myMove, i) => (
                  <SlotResult key={i} myMove={myMove as Move} oppMove={(result.oppSeq as string[])[i] as Move} slot={i + 1} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 13, paddingBottom: 13, paddingLeft: 24, borderLeft: '1px solid var(--rule-soft)', minWidth: 80 }}>
                <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', height: 40, display: 'flex', alignItems: 'center' }}>{result.oppScore} WON</span>
                <div style={{ height: 4 }} />
                <span style={{ ...s.mono, fontSize: 9, color: won ? 'var(--money)' : 'var(--alarm)', height: 40, display: 'flex', alignItems: 'center', fontWeight: 700 }}>{result.myScore} WON</span>
              </div>
            </div>
          </div>
        )}

        {/* CycleDuel: round-by-round breakdown */}
        {isCycleDuel && result.mySeq && result.oppSeq && (
          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>
              ROUND BREAKDOWN — 9 ROUNDS · 3 BLOCKS
            </div>
            <div style={s.rule} />
            {[0, 1, 2].map(b => (
              <div key={b} style={{ marginTop: 24 }}>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', marginBottom: 12 }}>BLOCK {b + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', minWidth: 64 }}>
                    <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', height: 36, display: 'flex', alignItems: 'center' }}>BOT</span>
                    <div style={{ height: 4 }} />
                    <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', height: 36, display: 'flex', alignItems: 'center' }}>YOU</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2].map(r => {
                      const idx = b * 3 + r
                      return (
                        <CycleRoundResult
                          key={r}
                          myMove={result.mySeq![idx] as CycleMove}
                          oppMove={result.oppSeq![idx] as CycleMove}
                          round={idx + 1}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DropDuel: simple score breakdown */}
        {!isCardDuel && !isCycleDuel && (
          <div style={{ padding: '24px', background: 'var(--bone-2)', border: '1px solid var(--rule-soft)', maxWidth: 480 }}>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 16 }}>MATCH SUMMARY</div>
            <div style={{ display: 'flex', gap: 40 }}>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>YOUR SCORE</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48 }}>{result.myScore}</div>
              </div>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>BOT SCORE</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, color: 'var(--ink-ghost)' }}>{result.oppScore}</div>
              </div>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>NET</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, color: delta > 0 ? 'var(--money)' : delta < 0 ? 'var(--alarm)' : 'var(--ink-soft)' }}>
                  {netLabel(result)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opponent reveal */}
        <div style={{ marginTop: 40, padding: '20px 24px', background: 'var(--bone-2)', border: '1px solid var(--rule-soft)', maxWidth: 480 }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>OPPONENT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase' }}>BOT</div>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>PRACTICE MATCH · BOT MODE</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          <Link href={`/play/${slug}/lobby`} style={{ background: 'var(--ink)', color: 'var(--bone)', border: '1.5px solid var(--ink)', padding: '16px 32px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none' }}>
            REMATCH →
          </Link>
          <Link href="/play" style={{ border: '1.5px solid var(--ink)', padding: '16px 32px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none', color: 'var(--ink)', background: 'transparent' }}>
            GAMES
          </Link>
          <Link href="/" style={{ border: '1.5px solid var(--rule-soft)', padding: '16px 32px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none', color: 'var(--ink-faint)', background: 'transparent' }}>
            LIVE BOARD
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
