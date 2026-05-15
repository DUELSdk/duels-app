'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'

const BIGGEST_POTS = [
  { rank: '01', who: 'k_8821 vs grimreef',         game: 'CARD DUEL',  kr: '5.420', room: '250 KR' },
  { rank: '02', who: 'LASERHAWK vs NOVASTRIKE',    game: 'CARD DUEL',  kr: '1.800', room: '100 KR' },
  { rank: '03', who: 'SANDSTORM vs zael',          game: 'CYCLEDUEL',  kr: '900',   room: '50 KR'  },
  { rank: '04', who: 'IRONVEIL vs pulse99',         game: 'DROPDUEL',   kr: '450',   room: '25 KR'  },
  { rank: '05', who: 'REDHEX vs COASTLINE',        game: 'CARD DUEL',  kr: '180',   room: '10 KR'  },
  { rank: '06', who: 'grimreef vs SANDSTORM',      game: 'CYCLEDUEL',  kr: '900',   room: '50 KR'  },
  { rank: '07', who: 'k_8821 vs IRONVEIL',         game: 'CARD DUEL',  kr: '450',   room: '25 KR'  },
  { rank: '08', who: 'REDHEX vs pulse99',          game: 'DROPDUEL',   kr: '180',   room: '10 KR'  },
  { rank: '09', who: 'NOVASTRIKE vs zael',         game: 'CARD DUEL',  kr: '900',   room: '50 KR'  },
  { rank: '10', who: 'COASTLINE vs LASERHAWK',     game: 'CYCLEDUEL',  kr: '450',   room: '25 KR'  },
]

const STREAKS = [
  { rank: '01', who: 'k_8821',      game: 'CARD DUEL',  streak: '7W',  netKr: '+2.840' },
  { rank: '02', who: 'LASERHAWK',   game: 'CYCLEDUEL',  streak: '5W',  netKr: '+1.620' },
  { rank: '03', who: 'pulse99',     game: 'DROPDUEL',   streak: '4W',  netKr: '+720'   },
  { rank: '04', who: 'COASTLINE',   game: 'CARD DUEL',  streak: '3W',  netKr: '+540'   },
  { rank: '05', who: 'IRONVEIL',    game: 'CARD DUEL',  streak: '3W',  netKr: '+270'   },
]

const TODAY_TAKERS = [
  { rank: '01', who: 'k_8821',      netKr: '+4.860', matches: 18, game: 'CARD DUEL'  },
  { rank: '02', who: 'grimreef',    netKr: '+2.160', matches: 12, game: 'CYCLEDUEL'  },
  { rank: '03', who: 'LASERHAWK',   netKr: '+1.440', matches: 8,  game: 'CARD DUEL'  },
  { rank: '04', who: 'NOVASTRIKE',  netKr: '+900',   matches: 6,  game: 'DROPDUEL'   },
  { rank: '05', who: 'SANDSTORM',   netKr: '+540',   matches: 4,  game: 'CARD DUEL'  },
]

type Tab = 'pots' | 'streaks' | 'takers'

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>('pots')

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav activePage="standings" />

      {/* Header */}
      <section style={{ padding: `40px ${s.px} 32px` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>STANDINGS · UPDATED LIVE</div>
        <h1 style={{ ...s.display(96), lineHeight: 0.85 }}>LEADERBOARD.</h1>
        <p style={{ fontSize: 16, lineHeight: 1.5, marginTop: 16, maxWidth: 480, color: 'var(--ink-soft)' }}>
          Today&apos;s numbers. Resets at midnight.
        </p>
      </section>

      {/* Tabs */}
      <section style={{ padding: `0 ${s.px}` }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid var(--ink)' }}>
          {([
            { id: 'pots' as Tab,    label: 'BIGGEST POTS'   },
            { id: 'streaks' as Tab, label: 'STREAKS'         },
            { id: 'takers' as Tab,  label: "TODAY'S TAKERS"  },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...s.mono, fontSize: 11, fontWeight: 700,
                padding: '12px 24px',
                border: 'none',
                borderBottom: tab === t.id ? '2px solid var(--alarm)' : '2px solid transparent',
                marginBottom: -2,
                background: 'transparent',
                color: tab === t.id ? 'var(--ink)' : 'var(--ink-faint)',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Table */}
      <section style={{ flex: 1, padding: `0 ${s.px} 40px` }}>
        {tab === 'pots' && (
          <>
            <div style={{ height: 2, background: 'var(--alarm)', marginBottom: 0 }} />
            {BIGGEST_POTS.map((row, i) => (
              <div key={row.rank} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 120px 120px 120px',
                alignItems: 'center', gap: 24,
                padding: '18px 0', borderBottom: '1px solid rgba(13,13,13,0.22)',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>{row.rank}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 22 : 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {row.who}
                  </div>
                </div>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{row.game}</span>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{row.room}</span>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: i === 0 ? 32 : 24, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {row.kr} KR
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'streaks' && (
          <>
            <div style={{ height: 2, background: 'var(--alarm)', marginBottom: 0 }} />
            {STREAKS.map((row, i) => (
              <div key={row.rank} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 120px 120px 100px',
                alignItems: 'center', gap: 24,
                padding: '20px 0', borderBottom: '1px solid rgba(13,13,13,0.22)',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>{row.rank}</span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 22 : 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                  {row.who}
                </div>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{row.game}</span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: i === 0 ? 36 : 28, color: 'var(--money)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {row.streak}
                </div>
                <div style={{ textAlign: 'right', ...s.mono, fontSize: 11, color: 'var(--money)' }}>{row.netKr} KR</div>
              </div>
            ))}
          </>
        )}

        {tab === 'takers' && (
          <>
            <div style={{ height: 2, background: 'var(--alarm)', marginBottom: 0 }} />
            {TODAY_TAKERS.map((row, i) => (
              <div key={row.rank} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 120px 80px 120px',
                alignItems: 'center', gap: 24,
                padding: '20px 0', borderBottom: '1px solid rgba(13,13,13,0.22)',
              }}>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>{row.rank}</span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 22 : 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                  {row.who}
                </div>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{row.game}</span>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{row.matches} MATCHES</span>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: i === 0 ? 32 : 24, color: 'var(--money)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {row.netKr} KR
                </div>
              </div>
            ))}
          </>
        )}
      </section>

      {/* Player stats bar at bottom */}
      <div style={{
        background: 'var(--ink)', color: 'var(--bone-on-dark)',
        padding: `20px ${s.px}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 4 }}>YOUR POSITION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>NOVASTRIKE</span>
            <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)' }}>RANK #42</span>
            <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)' }}>STREAK <span style={{ color: 'var(--alarm)', fontWeight: 700 }}>4W</span></span>
            <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)' }}>NET +840 KR TODAY</span>
          </div>
        </div>
        <Link href="/play" style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '-0.01em',
          background: 'var(--alarm)', color: '#fff',
          padding: '14px 24px', textDecoration: 'none',
        }}>
          FIND THE NEXT →
        </Link>
      </div>
    </div>
  )
}
