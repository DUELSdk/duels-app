import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getCurrentUser, getRivals } from '@/lib/mock-data'

const MOCK_WINS   = 142
const MOCK_LOSSES = 89
const MOCK_TIES   = 12
const MOCK_NET    = 12840
const MOCK_STREAK = 4

const ACHIEVEMENTS = [
  { id: 'a1', label: 'FIRST BLOOD',     sub: 'WIN YOUR FIRST MATCH',        done: true  },
  { id: 'a2', label: 'STREAK · 5W',     sub: 'WIN 5 IN A ROW',              done: true  },
  { id: 'a3', label: 'HIGH ROLLER',     sub: 'WIN A 250 KR ROOM',           done: true  },
  { id: 'a4', label: 'STREAK · 10W',    sub: 'WIN 10 IN A ROW',             done: false },
  { id: 'a5', label: 'TRIPLE CROWN',    sub: 'WIN IN ALL 3 DISCIPLINES',    done: false },
  { id: 'a6', label: 'ELITE',           sub: 'WIN A 500 KR ROOM',           done: false },
]

export default function ProfilePage() {
  const user = getCurrentUser()

  const total    = MOCK_WINS + MOCK_LOSSES + MOCK_TIES
  const winRate  = Math.round(MOCK_WINS / total * 100)
  const winPct   = MOCK_WINS   / total
  const lossPct  = MOCK_LOSSES / total
  const tiePct   = MOCK_TIES   / total

  const topGame    = [...user.gameStats].sort((a, b) => b.played - a.played)[0]?.game ?? '—'
  const biggestWin = Math.max(0, ...user.recentMatches.filter(m => m.result === 'WIN').map(m => m.earnedKr))

  const rivals = getRivals().sort((a, b) => {
    if (a.revengeActive && !b.revengeActive) return -1
    if (!a.revengeActive && b.revengeActive) return 1
    if (a.revengeActive && b.revengeActive) return a.currentStreak - b.currentStreak
    return b.played - a.played
  })
  const activeRival = rivals.find(r => r.revengeActive) ?? null

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      {/* Header */}
      <section style={{ padding: `40px ${s.px} 0` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>
          MEMBER SINCE {user.memberSince} · RANK #{user.rank}
        </div>
        <h1 style={{ ...s.display(120), lineHeight: 0.84 }}>NOVASTRIKE.</h1>
      </section>

      {/* Stats grid */}
      <section style={{ padding: `32px ${s.px} 0` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: '1.5px solid var(--ink)' }}>
          {[
            { label: 'WINS',    value: MOCK_WINS,                              color: 'var(--money)' },
            { label: 'LOSSES',  value: MOCK_LOSSES,                            color: 'var(--alarm)' },
            { label: 'TIES',    value: MOCK_TIES,                              color: 'var(--ink)'   },
            { label: 'NET KR',  value: `+${MOCK_NET.toLocaleString('da-DK')}`, color: 'var(--money)' },
            { label: 'STREAK',  value: `${MOCK_STREAK}W`,                      color: 'var(--ink)'   },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '28px 24px',
              borderLeft: i > 0 ? '1px solid var(--ink)' : 'none',
            }}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 12 }}>{stat.label}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48,
                letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                color: stat.color, lineHeight: 1,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fighter record */}
      <section style={{ padding: `24px ${s.px} 0` }}>
        {/* W / L / T ratio bar */}
        <div style={{ display: 'flex', height: 3, gap: 2, marginBottom: 24 }}>
          <div style={{ flex: winPct,  background: 'var(--money)'    }} />
          <div style={{ flex: lossPct, background: 'var(--alarm)'    }} />
          <div style={{ flex: tiePct,  background: 'rgba(13,13,13,0.2)' }} />
        </div>

        {/* Three fighter stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'WIN RATE',    value: `${winRate}%`    },
            { label: 'TOP GAME',    value: topGame           },
            { label: 'BIGGEST WIN', value: `+${biggestWin} KR` },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              borderLeft: i > 0 ? '1px solid rgba(13,13,13,0.15)' : 'none',
              paddingLeft: i > 0 ? 24 : 0,
            }}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>{stat.label}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32,
                letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Last Ten */}
      <section style={{ padding: `40px ${s.px} 0` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>LAST TEN</div>
            {/* Form dots */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {user.recentMatches.slice(0, 10).map((m, i) => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: m.result === 'WIN' ? 'var(--money)' : m.result === 'LOSS' ? 'var(--alarm)' : 'rgba(13,13,13,0.25)',
                }} />
              ))}
            </div>
          </div>
          <Link href="#" style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textDecoration: 'none' }}>FULL HISTORY →</Link>
        </div>
        <div style={s.rule} />
        {user.recentMatches.slice(0, 10).map((m, i) => {
          const isWin  = m.result === 'WIN'
          const isLoss = m.result === 'LOSS'
          const color  = isWin ? 'var(--money)' : isLoss ? 'var(--alarm)' : 'var(--ink-ghost)'
          return (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '100px 56px 1fr auto auto',
              alignItems: 'center', gap: 24,
              padding: '14px 0', borderBottom: '1px solid rgba(13,13,13,0.22)',
            }}>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{m.ago}</span>
              <div style={{
                ...s.mono, fontSize: 10, fontWeight: 700, color,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                {m.result}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                  {m.game} · VS {m.opponent}
                </div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{m.roomKr} KR ROOM</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color, fontVariantNumeric: 'tabular-nums' }}>
                {isWin ? '+' : isLoss ? '−' : '±'}{Math.abs(m.earnedKr)}
              </div>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>KR</div>
            </div>
          )
        })}
      </section>

      {/* Rivals */}
      <section style={{ padding: `40px ${s.px} 0` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>RIVALS</div>
        <div style={s.rule} />

        {/* Confrontation card — worst active nemesis */}
        {activeRival && (
          <div style={{
            background: 'var(--ink)',
            color: 'var(--bone-on-dark)',
            padding: '32px 40px',
            marginTop: 20,
          }}>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--nemesis)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nemesis)', display: 'inline-block' }} />
              REVENGE ACTIVE · LOST {Math.abs(activeRival.currentStreak)} IN A ROW
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 12 }}>YOUR NEMESIS</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 80, letterSpacing: '-0.02em', lineHeight: 0.88, color: 'var(--bone-on-dark)', textTransform: 'uppercase' }}>
                  {activeRival.handle}.
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 10 }}>HEAD TO HEAD</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, color: 'var(--money)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {activeRival.wins}W
                  </span>
                  <span style={{ ...s.mono, color: 'var(--bone-ghost)' }}>–</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {activeRival.losses}L
                  </span>
                </div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--nemesis)', marginTop: 6 }}>
                  WIN NEXT → BONUS TICKETS
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standings table */}
        <div style={{ marginTop: activeRival ? 0 : 20 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 72px 56px 56px 110px 90px',
            padding: '10px 0',
            borderBottom: '1px solid rgba(13,13,13,0.22)',
          }}>
            {['RIVAL', 'PLAYED', 'W', 'L', 'STREAK', 'STATUS'].map((col, i) => (
              <div key={col} style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textAlign: i > 0 ? 'right' : 'left' }}>
                {col}
              </div>
            ))}
          </div>

          {rivals.map(r => {
            const streakLabel = r.currentStreak > 1
              ? `${r.currentStreak}W RUN`
              : r.currentStreak < -1
                ? `${Math.abs(r.currentStreak)}L RUN`
                : '—'
            const streakColor = r.revengeActive
              ? 'var(--nemesis)'
              : r.currentStreak > 1
                ? 'var(--money)'
                : r.currentStreak < -1
                  ? 'var(--alarm)'
                  : 'var(--ink-ghost)'
            return (
              <div key={r.handle} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 72px 56px 56px 110px 90px',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(13,13,13,0.1)',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                  {r.handle}
                </div>
                <div style={{ ...s.mono, fontSize: 11, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{r.played}</div>
                <div style={{ ...s.mono, fontSize: 11, fontVariantNumeric: 'tabular-nums', color: 'var(--money)', textAlign: 'right' }}>{r.wins}</div>
                <div style={{ ...s.mono, fontSize: 11, fontVariantNumeric: 'tabular-nums', color: 'var(--alarm)', textAlign: 'right' }}>{r.losses}</div>
                <div style={{ ...s.mono, fontSize: 9, color: streakColor, textAlign: 'right' }}>{streakLabel}</div>
                <div style={{ textAlign: 'right' }}>
                  {r.revengeActive ? (
                    <span style={{ ...s.mono, fontSize: 9, color: 'var(--nemesis)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--nemesis)', display: 'inline-block' }} />
                      REVENGE
                    </span>
                  ) : (
                    <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* By Game */}
      <section style={{ padding: `40px ${s.px} 0` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>BY GAME</div>
        <div style={s.rule} />
        {user.gameStats.map(g => {
          const pct = g.played > 0 ? Math.round(g.won / g.played * 100) : 0
          return (
            <div key={g.game}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 80px 120px',
                alignItems: 'center', gap: 24,
                padding: '20px 0 12px',
              }}>
                <Link href={`/play/${g.slug}`} style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                  textTransform: 'uppercase', letterSpacing: '-0.01em',
                  color: 'var(--ink)', textDecoration: 'none',
                }}>
                  {g.game}
                </Link>
                {[
                  { label: 'PLAYED', value: g.played,          color: 'var(--ink)'   },
                  { label: 'WON',    value: g.won,             color: 'var(--money)' },
                  { label: 'LOST',   value: g.played - g.won,  color: 'var(--alarm)' },
                  { label: 'WIN %',  value: `${pct}%`,         color: 'var(--ink)'   },
                ].map(col => (
                  <div key={col.label} style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24,
                      fontVariantNumeric: 'tabular-nums', color: col.color,
                    }}>
                      {col.value}
                    </div>
                    <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{col.label}</div>
                  </div>
                ))}
                <div style={{ textAlign: 'right' }}>
                  <Link href={`/play/${g.slug}/lobby`} style={{
                    ...s.mono, fontSize: 10, fontWeight: 700,
                    background: 'var(--ink)', color: 'var(--bone)',
                    padding: '8px 14px', textDecoration: 'none',
                  }}>
                    PLAY →
                  </Link>
                </div>
              </div>
              {/* Win % bar */}
              <div style={{ height: 2, background: 'rgba(13,13,13,0.1)', marginBottom: 0 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--money)', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ height: 1, background: 'rgba(13,13,13,0.22)', marginTop: 12 }} />
            </div>
          )
        })}
      </section>

      {/* Achievements */}
      <section style={{ padding: `40px ${s.px} 56px` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>ACHIEVEMENTS</div>
        <div style={s.rule} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} style={{
              border: a.done ? '1.5px solid var(--ink)' : '1px solid var(--rule-soft)',
              padding: '20px 24px',
              opacity: a.done ? 1 : 0.5,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
                  textTransform: 'uppercase', letterSpacing: '-0.01em',
                }}>
                  {a.label}
                </div>
                {a.done && (
                  <span style={{ ...s.mono, fontSize: 8, color: 'var(--money)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
                    DONE
                  </span>
                )}
              </div>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{a.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
