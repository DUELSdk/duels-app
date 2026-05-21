'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { getLiveMatchCount } from '@/lib/mock-data'

const POTS = [
  { rank: '01', who: 'k_8821 vs grimreef',   meta: 'CARD · 250 ROOM',  kr: '5.420', ago: '12 MIN' },
  { rank: '02', who: 'sandman vs reef',       meta: 'CYCLE · 500 ROOM', kr: '4.500', ago: '34 MIN' },
  { rank: '03', who: 'NOVASTRIKE vs anon#9',  meta: 'CARD · 250 ROOM',  kr: '4.500', ago: '1 HR'   },
  { rank: '04', who: 'mads_kbh vs viper99',   meta: 'DROP · 100 ROOM',  kr: '1.800', ago: '1 HR'   },
  { rank: '05', who: 'siren vs iso_9001',     meta: 'CARD · 50 ROOM',   kr: '900',   ago: '2 HR'   },
  { rank: '06', who: 'piloto vs ghost_n',     meta: 'CYCLE · 50 ROOM',  kr: '900',   ago: '2 HR'   },
]

const STREAKS = [
  { rank: '01', who: 'NOVASTRIKE', game: 'CARD',  streak: '7', active: true  },
  { rank: '02', who: 'k_8821',     game: 'CARD',  streak: '5', active: true  },
  { rank: '03', who: 'grimreef',   game: 'CYCLE', streak: '5', active: true  },
  { rank: '04', who: 'piloto',     game: 'CYCLE', streak: '4', active: false },
  { rank: '05', who: 'reef',       game: 'CYCLE', streak: '3', active: true  },
  { rank: '06', who: 'sandman',    game: 'CYCLE', streak: '3', active: true  },
]

const TAKERS = [
  { rank: '01', who: 'k_8821',     record: '11W · 3L', kr: '+8.420' },
  { rank: '02', who: 'grimreef',   record: '7W · 2L',  kr: '+5.100' },
  { rank: '03', who: 'NOVASTRIKE', record: '6W · 2L',  kr: '+4.200' },
  { rank: '04', who: 'reef',       record: '5W · 1L',  kr: '+3.100' },
  { rank: '05', who: 'mads_kbh',   record: '7W · 5L',  kr: '+2.450' },
  { rank: '06', who: 'viper99',    record: '4W · 2L',  kr: '+1.800' },
]

const TIMEFRAMES = ['LIVE NOW', 'TODAY', 'THIS WEEK', 'ALL-TIME'] as const
const GAMES      = ['ALL GAMES', 'CARD DUEL', 'CYCLEDUEL', 'DROPDUEL'] as const
type Timeframe   = typeof TIMEFRAMES[number]
type Game        = typeof GAMES[number]

const featured = POTS[0]

export default function LeaderboardPage() {
  const counts = getLiveMatchCount()
  const [timeframe, setTimeframe] = useState<Timeframe>('TODAY')
  const [game,      setGame]      = useState<Game>('ALL GAMES')

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
              {counts.live} LIVE · {counts.settledToday.toLocaleString('da-DK')} SETTLED TODAY
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
      <section style={{ padding: `0 ${s.px} 0` }}>
        <div style={{ background: 'var(--ink)', color: 'var(--bone-on-dark)', padding: '32px 56px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)', letterSpacing: '0.16em', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
                BIGGEST POT TODAY · {featured.meta} · {featured.ago} AGO
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginTop: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
                  letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase',
                  textAlign: 'right',
                }}>
                  {featured.who.split(' vs ')[0]}
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
                  {featured.who.split(' vs ')[1]}
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
                {featured.kr}
              </div>
              <div style={{ ...s.mono, fontSize: 12, color: 'var(--bone-faint)', marginTop: 4 }}>KR</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three equal columns ── */}
      <section style={{ padding: `32px ${s.px} 32px`, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>

          {/* BIGGEST POTS — rows 2–6 (hero handles #1) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h2 style={{ ...s.display(28) }}>BIGGEST POTS.</h2>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{timeframe}</span>
            </div>
            <div style={s.rule} />
            {POTS.slice(1).map((r, i) => (
              <div key={r.rank} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                gap: 12, alignItems: 'baseline',
                padding: '12px 0',
                borderBottom: '1px solid var(--rule-soft)',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', fontWeight: 700 }}>
                  {r.rank}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {r.who}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2, letterSpacing: '0.06em' }}>
                    {r.meta} · {r.ago}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                  {r.kr}
                </div>
              </div>
            ))}
          </div>

          {/* STREAKS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h2 style={{ ...s.display(28) }}>STREAKS.</h2>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
                {STREAKS.filter(r => r.active).length} LIVE
              </span>
            </div>
            <div style={s.rule} />
            {STREAKS.map((r, i) => (
              <div key={r.rank} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--rule-soft)',
                background: i === 0 ? 'rgba(239,0,0,0.03)' : 'transparent',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: i === 0 ? 'var(--alarm)' : 'var(--ink-ghost)', fontWeight: 700 }}>
                  {r.rank}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 16 : 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {r.who}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, marginTop: 2, color: r.active ? 'var(--money)' : 'var(--ink-ghost)', letterSpacing: '0.06em' }}>
                    {r.game} · {r.active ? 'ACTIVE' : 'BROKEN'}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: i === 0 ? 32 : 24, letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                  color: i === 0 ? 'var(--alarm)' : r.active ? 'var(--ink)' : 'var(--ink-ghost)',
                }}>
                  {r.streak}
                </div>
              </div>
            ))}
          </div>

          {/* TODAY'S TAKERS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h2 style={{ ...s.display(28) }}>TODAY'S TAKERS.</h2>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>NET</span>
            </div>
            <div style={s.rule} />
            {TAKERS.map((r, i) => (
              <div key={r.rank} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--rule-soft)',
                background: i === 0 ? 'rgba(29,138,58,0.05)' : 'transparent',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: i === 0 ? 'var(--money)' : 'var(--ink-ghost)', fontWeight: 700 }}>
                  {r.rank}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 16 : 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {r.who}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2, letterSpacing: '0.06em' }}>
                    {r.record}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: i === 0 ? 22 : 18, letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--money)', textAlign: 'right',
                }}>
                  {r.kr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── You-card ── */}
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
                NOVASTRIKE
              </span>
            </div>
            <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.35)', letterSpacing: '0.1em' }}>
              6W · 2L TODAY
            </div>
          </div>

          {/* Stats + CTA row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px 28px' }}>
            <div style={{ display: 'flex', gap: 56, alignItems: 'flex-end' }}>

              {/* POT RANK — hero stat */}
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>POT RANK</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    03
                  </span>
                  <span style={{ ...s.mono, fontSize: 10, color: 'var(--money)', fontWeight: 700, letterSpacing: '0.04em' }}>↑2</span>
                </div>
              </div>

              {/* Vertical rule */}
              <div style={{ width: 1, height: 56, background: 'rgba(240,237,228,0.1)', alignSelf: 'flex-end', marginBottom: 4 }} />

              {/* STREAK */}
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>STREAK</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--alarm)', lineHeight: 1 }}>2</span>
                  <span style={{ ...s.mono, fontSize: 9, color: 'rgba(239,0,0,0.6)', letterSpacing: '0.06em' }}>ACTIVE</span>
                </div>
              </div>

              {/* TAKEN TODAY */}
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>TAKEN TODAY</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--money)', lineHeight: 1 }}>
                  +230
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
    </div>
  )
}
