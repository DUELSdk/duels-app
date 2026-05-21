'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { supabase } from '@/lib/supabase'

type Pot    = { rank: number; who: string; what: string; value_ore: number }
type Streak = { rank: number; handle: string; streak: number }
type Day    = { rank: number; handle: string; match_count: number; wins: number; losses: number; net_ore: number }
type Board  = { biggest_pots: Pot[]; longest_streaks: Streak[]; biggest_days: Day[] }
type UserStats = { handle: string; rank: number; wins: number; losses: number; net_ore: number; error?: string }

const TIMEFRAMES = ['LIVE NOW', 'TODAY', 'THIS WEEK', 'ALL-TIME'] as const
const GAMES      = ['ALL GAMES', 'CARD DUEL', 'CYCLEDUEL', 'DROPDUEL'] as const
type Timeframe   = typeof TIMEFRAMES[number]
type Game        = typeof GAMES[number]

function fmtKr(ore: number) {
  return Math.round(ore / 100).toLocaleString('da-DK')
}

function fmtRank(n: number) {
  return String(n).padStart(2, '0')
}

function fmtWhat(raw: string) {
  return raw.replace('CARD-DUEL', 'CARD DUEL').replace('CYCLE-DUEL', 'CYCLEDUEL').replace('DROP-DUEL', 'DROPDUEL')
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('TODAY')
  const [game,      setGame]      = useState<Game>('ALL GAMES')
  const [board,     setBoard]     = useState<Board | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [live,      setLive]      = useState(0)
  const [settled,   setSettled]   = useState(0)

  useEffect(() => {
    supabase.rpc('rpc_get_board').then(({ data }) => {
      if (data) setBoard(data as Board)
    })
    supabase.rpc('rpc_get_live_counts').then(({ data }) => {
      if (data) {
        const d = data as { live: number; settled_today: number }
        setLive(d.live)
        setSettled(d.settled_today)
      }
    })
    supabase.rpc('rpc_get_user_stats').then(({ data }) => {
      if (data && !(data as any).error) setUserStats(data as UserStats)
    })
  }, [])

  const pots    = board?.biggest_pots    ?? []
  const streaks = board?.longest_streaks ?? []
  const days    = board?.biggest_days    ?? []
  const featured = pots[0] ?? null

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav activePage="standings" />

      {/* ── Masthead ── */}
      <section style={{ padding: `56px ${s.px} 0` }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          borderBottom: '3px double var(--ink)', paddingBottom: 16,
        }}>
          <div>
            <div style={{ ...s.mono, fontSize: 11, fontWeight: 700, color: 'var(--money)', letterSpacing: '0.18em', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
              LIVE STANDINGS · UPDATING
            </div>
            <h1 style={{ ...s.display(120), lineHeight: 0.88 }}>STANDINGS.</h1>
          </div>
          <div style={{ textAlign: 'right', paddingBottom: 4 }}>
            <div style={{ ...s.mono, fontSize: 12, color: 'var(--ink-faint)', fontVariantNumeric: 'tabular-nums' }}>
              {live} LIVE · {settled.toLocaleString('da-DK')} SETTLED TODAY
            </div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>
              RANKINGS REWRITE EVERY MATCH
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {TIMEFRAMES.map(t => (
              <button key={t} onClick={() => setTimeframe(t)} style={{
                ...s.mono, fontSize: 11, padding: '6px 14px',
                border: '1.5px solid var(--ink)',
                background: timeframe === t ? 'var(--ink)' : 'transparent',
                color: timeframe === t ? 'var(--bone)' : 'var(--ink)',
                cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {GAMES.map(g => (
              <button key={g} onClick={() => setGame(g)} style={{
                ...s.mono, fontSize: 11, padding: '6px 14px',
                border: '1.5px solid var(--ink)',
                background: game === g ? 'var(--ink)' : 'transparent',
                color: game === g ? 'var(--bone)' : 'var(--ink-faint)',
                cursor: 'pointer',
              }}>{g}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured match hero ── */}
      {featured && (
        <section style={{ padding: `0 ${s.px} 0` }}>
          <div style={{ background: 'var(--ink)', color: 'var(--bone-on-dark)', padding: '32px 56px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)', letterSpacing: '0.16em', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
                  BIGGEST POT TODAY · {fmtWhat(featured.what)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginTop: 4 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
                    letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase',
                    textAlign: 'right',
                  }}>
                    {featured.who.split(' VS ')[0]}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px', flexShrink: 0 }}>
                    <span style={{ width: 28, height: 3, background: 'var(--alarm)', display: 'block' }} />
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20,
                      color: 'var(--bone-faint)', letterSpacing: '0.04em',
                    }}>VS</span>
                    <span style={{ width: 28, height: 3, background: 'var(--alarm)', display: 'block' }} />
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
                    letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase',
                  }}>
                    {featured.who.split(' VS ')[1]}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', marginBottom: 4 }}>PURSE</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72,
                  letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  color: 'var(--money)',
                }}>
                  {fmtKr(featured.value_ore)}
                </div>
                <div style={{ ...s.mono, fontSize: 12, color: 'var(--bone-faint)', marginTop: 4 }}>KR</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Three equal columns ── */}
      <section style={{ padding: `32px ${s.px} 32px`, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>

          {/* BIGGEST POTS — rows 2+ */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h2 style={{ ...s.display(28) }}>BIGGEST POTS.</h2>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>TODAY</span>
            </div>
            <div style={s.rule} />
            {pots.slice(1).map((r) => (
              <div key={r.rank} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                gap: 12, alignItems: 'baseline',
                padding: '12px 0',
                borderBottom: '1px solid var(--rule-soft)',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', fontWeight: 700 }}>
                  {fmtRank(r.rank)}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {r.who}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2, letterSpacing: '0.06em' }}>
                    {fmtWhat(r.what)}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                  {fmtKr(r.value_ore)}
                </div>
              </div>
            ))}
            {pots.length <= 1 && (
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', padding: '12px 0' }}>NO DATA YET</div>
            )}
          </div>

          {/* STREAKS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h2 style={{ ...s.display(28) }}>STREAKS.</h2>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
                {streaks.length} ACTIVE
              </span>
            </div>
            <div style={s.rule} />
            {streaks.map((r, i) => (
              <div key={r.rank} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--rule-soft)',
                background: i === 0 ? 'rgba(239,0,0,0.03)' : 'transparent',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: i === 0 ? 'var(--alarm)' : 'var(--ink-ghost)', fontWeight: 700 }}>
                  {fmtRank(r.rank)}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 16 : 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {r.handle}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, marginTop: 2, color: 'var(--money)', letterSpacing: '0.06em' }}>
                    ACTIVE
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: i === 0 ? 32 : 24, letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                  color: i === 0 ? 'var(--alarm)' : 'var(--ink)',
                }}>
                  {r.streak}
                </div>
              </div>
            ))}
            {streaks.length === 0 && (
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', padding: '12px 0' }}>NO DATA YET</div>
            )}
          </div>

          {/* TODAY'S TAKERS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h2 style={{ ...s.display(28) }}>TODAY&apos;S TAKERS.</h2>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>NET</span>
            </div>
            <div style={s.rule} />
            {days.map((r, i) => (
              <div key={r.rank} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--rule-soft)',
                background: i === 0 ? 'rgba(29,138,58,0.05)' : 'transparent',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: i === 0 ? 'var(--money)' : 'var(--ink-ghost)', fontWeight: 700 }}>
                  {fmtRank(r.rank)}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 16 : 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {r.handle}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2, letterSpacing: '0.06em' }}>
                    {r.wins}W · {r.losses}L
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: i === 0 ? 22 : 18, letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--money)', textAlign: 'right',
                }}>
                  +{fmtKr(r.net_ore)}
                </div>
              </div>
            ))}
            {days.length === 0 && (
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', padding: '12px 0' }}>NO DATA YET</div>
            )}
          </div>
        </div>
      </section>

      {/* ── You-card ── */}
      {userStats && (
        <section style={{ padding: `0 ${s.px} 56px` }}>
          <div style={{ background: 'var(--ink)', color: 'var(--bone-on-dark)', borderTop: '3px solid var(--alarm)' }}>

            {/* Identity row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '18px 40px 16px',
              borderBottom: '1px solid rgba(240,237,228,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ ...s.mono, fontSize: 10, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.18em' }}>YOU</span>
                <span style={{ width: 1, height: 12, background: 'rgba(240,237,228,0.18)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  {userStats.handle}
                </span>
              </div>
              <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.1em' }}>
                {userStats.wins}W · {userStats.losses}L ALL TIME
              </div>
            </div>

            {/* Stats + CTA row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px 28px' }}>
              <div style={{ display: 'flex', gap: 56, alignItems: 'flex-end' }}>

                {/* RANK */}
                <div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>ALL-TIME RANK</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                      {fmtRank(userStats.rank)}
                    </span>
                  </div>
                </div>

                {/* Vertical rule */}
                <div style={{ width: 1, height: 56, background: 'rgba(240,237,228,0.1)', alignSelf: 'flex-end', marginBottom: 4 }} />

                {/* WINS */}
                <div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>WINS</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--money)', lineHeight: 1 }}>
                      {userStats.wins}
                    </span>
                  </div>
                </div>

                {/* NET */}
                <div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>NET ALL TIME</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48,
                    letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                    color: userStats.net_ore >= 0 ? 'var(--money)' : 'var(--alarm)',
                  }}>
                    {userStats.net_ore >= 0 ? '+' : '−'}{fmtKr(Math.abs(userStats.net_ore))}
                  </div>
                </div>

              </div>
              <Link href="/play" style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                textTransform: 'uppercase', letterSpacing: '-0.01em',
                background: 'var(--alarm)', color: '#fff',
                padding: '16px 28px', textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                FIND THE NEXT →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
