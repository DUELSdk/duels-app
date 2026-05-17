import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { SignOutButton } from '@/components/SignOutButton'
import { s } from '@/lib/styles'
import { getCurrentUser, getRivals } from '@/lib/mock-data'

const MOCK_WINS   = 142
const MOCK_LOSSES = 89
const MOCK_TIES   = 16
const MOCK_NET    = '+4.260'
const MOCK_STREAK = 7

const ACHIEVEMENTS = [
  { label: 'FIRST BLOOD',  sub: 'first win'            },
  { label: 'CENTURY',      sub: '100 wins'             },
  { label: 'HEATER',       sub: '5-streak'             },
  { label: 'ROOM CLIMBER', sub: '500 KR room cleared'  },
]

export default function ProfilePage() {
  const user   = getCurrentUser()
  const rivals = getRivals().sort((a, b) => {
    if (a.revengeActive && !b.revengeActive) return -1
    if (!a.revengeActive && b.revengeActive) return 1
    return b.played - a.played
  })
  const activeRival = rivals.find(r => r.revengeActive) ?? null

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      {/* ── Header ── */}
      <section style={{ padding: `40px ${s.px} 24px` }}>
        <div style={{ borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
          <div style={{ ...s.mono, fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-faint)' }}>
            MEMBER SINCE {user.memberSince} · {MOCK_WINS + MOCK_LOSSES + MOCK_TIES} MATCHES · LV1 PLAYER
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
            <h1 style={{ ...s.display(132), lineHeight: 0.85 }}>NOVASTRIKE.</h1>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)' }}>ELO · CARD DUEL</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
                  letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>1.842</div>
                <div style={{ ...s.mono, fontSize: 10, fontWeight: 700, color: 'var(--money)', letterSpacing: '0.12em' }}>↑ 24 LAST 7D</div>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ padding: `12px ${s.px} 24px` }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          borderTop: '1px solid var(--rule-soft)',
          borderBottom: '1px solid var(--rule-soft)',
        }}>
          {[
            ['WINS',    String(MOCK_WINS),   'var(--money)'],
            ['LOSSES',  String(MOCK_LOSSES), 'var(--alarm)'],
            ['TIES',    String(MOCK_TIES),   'var(--ink)'],
            ['NET KR',  MOCK_NET,            'var(--money)'],
            ['STREAK',  String(MOCK_STREAK), 'var(--alarm)'],
          ].map(([label, value, color], i, a) => (
            <div key={label} style={{
              padding: '20px 24px',
              borderRight: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none',
            }}>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.14em', marginBottom: 4 }}>{label}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48,
                letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color, lineHeight: 1,
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two-column: Last Ten + By Game ── */}
      <section style={{ padding: `24px ${s.px} 48px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 40 }}>

          {/* LAST TEN */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <h2 style={{ ...s.display(44) }}>LAST TEN.</h2>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>TODAY · RECENT</span>
            </div>
            <div style={s.rule} />
            {user.recentMatches.slice(0, 10).map((m, i) => {
              const isWin  = m.result === 'WIN'
              const isLoss = m.result === 'LOSS'
              const color  = isWin ? 'var(--money)' : isLoss ? 'var(--alarm)' : 'var(--ink-faint)'
              return (
                <div key={m.id} style={{
                  display: 'grid', gridTemplateColumns: '52px 60px 1fr 32px 80px',
                  gap: 12, alignItems: 'baseline',
                  padding: '13px 0', borderBottom: '1px solid var(--rule-soft)',
                }}>
                  <span style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{m.ago}</span>
                  <span style={{ ...s.mono, fontSize: 10, letterSpacing: '0.10em' }}>{m.game.split(' ')[0]}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>VS {m.opponent}</span>
                  <span style={{ ...s.mono, fontSize: 11, fontWeight: 700, color }}>{m.result[0]}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
                    textAlign: 'right', fontVariantNumeric: 'tabular-nums', color,
                  }}>
                    {isWin ? '+' : isLoss ? '−' : '±'}{Math.abs(m.earnedKr)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* BY GAME + ACHIEVEMENTS */}
          <div>
            <h2 style={{ ...s.display(36), marginBottom: 12 }}>BY GAME.</h2>
            <div style={s.rule} />
            {user.gameStats.map((g, i, a) => {
              const pct = g.played > 0 ? Math.round(g.won / g.played * 100) : 0
              return (
                <div key={g.game} style={{
                  padding: '16px 0',
                  borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>{g.game}</span>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                      fontVariantNumeric: 'tabular-nums',
                      color: i === 0 ? 'var(--money)' : 'var(--ink)',
                    }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{g.played} PLAYED</span>
                    <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{g.won}W · {g.played - g.won}L</span>
                  </div>
                </div>
              )
            })}

            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.14em', marginTop: 28, marginBottom: 10 }}>
              ACHIEVEMENTS
            </div>
            <div style={s.rule} />
            {ACHIEVEMENTS.map((a, i) => (
              <div key={a.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '11px 0', borderBottom: '1px solid var(--rule-soft)',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>{a.label}</span>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{a.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rivals ── */}
      {activeRival && (
        <section style={{ padding: `0 ${s.px} 56px` }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>RIVALS</div>
          <div style={s.rule} />
          <div style={{
            background: 'var(--ink)', color: 'var(--bone-on-dark)',
            padding: '32px 40px', marginTop: 20,
          }}>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
              REVENGE ACTIVE · LOST {Math.abs(activeRival.currentStreak)} IN A ROW
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 12 }}>YOUR NEMESIS</div>
                <div style={{ ...s.display(80), color: 'var(--bone-on-dark)', lineHeight: 0.88 }}>
                  {activeRival.handle}.
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 10 }}>HEAD TO HEAD</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64,
                    color: 'var(--money)', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  }}>{activeRival.wins}W</span>
                  <span style={{ ...s.mono, color: 'var(--bone-ghost)' }}>–</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64,
                    color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  }}>{activeRival.losses}L</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
