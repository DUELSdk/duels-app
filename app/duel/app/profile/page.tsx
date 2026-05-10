import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getCurrentUser, type RecentMatch } from '@/lib/mock-data'

export default function ProfilePage() {
  const user = getCurrentUser()
  const winPct = Math.round(user.wins / (user.wins + user.losses) * 100)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance={user.balance.toLocaleString('da-DK')} />

      <section style={{ padding: `56px ${s.px} 40px`, maxWidth: 900 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>PROFILE</div>
        <h1 style={{ ...s.display(80), lineHeight: 0.85 }}>YOUR STATS.</h1>

        {/* Avatar + handle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40 }}>
          <div style={{
            width: 64, height: 64,
            border: '1.5px solid var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
          }}>
            {user.initials}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, textTransform: 'uppercase' }}>
              {user.handle}
            </div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>
              MEMBER SINCE {user.memberSince} · RANK #{user.rank}
            </div>
          </div>
        </div>

        {/* Overall stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginTop: 40 }}>
          {[
            { label: 'MATCHES PLAYED', value: `${user.wins + user.losses}`                             },
            { label: 'WIN RATE',       value: `${winPct}%`                                             },
            { label: 'NET EARNED',     value: `+${user.netKr.toLocaleString('da-DK')} KR`              },
            { label: 'BALANCE',        value: `${user.balance.toLocaleString('da-DK')} KR`             },
          ].map(stat => (
            <div key={stat.label} style={{ border: '1.5px solid var(--ink)', padding: '20px 24px' }}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 10 }}>{stat.label}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32,
                letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Per-game stats */}
      <section style={{ padding: `0 ${s.px} 40px`, maxWidth: 900 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>BY GAME</div>
        <div style={s.rule} />

        {user.gameStats.map(g => {
          const pct = g.played > 0 ? Math.round(g.won / g.played * 100) : 0
          return (
            <div key={g.game} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 100px 120px 100px',
              alignItems: 'center', gap: 24,
              padding: '16px 0', borderBottom: '1px solid var(--rule-soft)',
            }}>
              <Link href={`/play/${g.slug}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none' }}>
                {g.game}
              </Link>
              {[
                { label: 'PLAYED', value: g.played },
                { label: 'WON',    value: g.won },
                { label: 'WIN RATE', value: `${pct}%` },
                { label: 'LOST',   value: g.played - g.won },
              ].map(col => (
                <div key={col.label} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, fontVariantNumeric: 'tabular-nums' }}>
                    {col.value}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{col.label}</div>
                </div>
              ))}
            </div>
          )
        })}
      </section>

      {/* Recent matches */}
      <section style={{ padding: `0 ${s.px} 40px`, maxWidth: 900 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>RECENT MATCHES</div>
        <div style={s.rule} />

        {user.recentMatches.map(m => (
          <MatchRow key={m.id} match={m} />
        ))}
      </section>

      {/* Account settings */}
      <section style={{ padding: `0 ${s.px} 56px`, maxWidth: 900 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>ACCOUNT</div>
        <div style={s.rule} />

        {[
          { label: 'EMAIL',         value: 'greveabainza@pm.me',  action: 'EDIT' },
          { label: 'MitID',         value: 'VERIFIED',             action: null   },
          { label: 'DEPOSIT LIMIT', value: 'No limit set',         action: 'SET'  },
          { label: 'NOTIFICATIONS', value: 'Off',                  action: 'EDIT' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 0', borderBottom: '1px solid var(--rule-soft)',
          }}>
            <span style={{ ...s.mono, fontSize: 10 }}>{row.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{row.value}</span>
              {row.action && (
                <button disabled style={{
                  ...s.mono, fontSize: 9, color: 'var(--ink-ghost)',
                  border: '1px solid var(--rule-soft)', padding: '4px 10px',
                  background: 'transparent', cursor: 'not-allowed',
                }}>
                  {row.action}
                </button>
              )}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <Link href="/responsible-gaming" style={{
            ...s.mono, fontSize: 10,
            border: '1.5px solid var(--ink)', padding: '10px 18px',
            textDecoration: 'none', color: 'var(--ink)',
          }}>
            RESPONSIBLE GAMING TOOLS
          </Link>
          <button disabled style={{
            ...s.mono, fontSize: 10, color: 'var(--ink-faint)',
            border: '1px solid var(--rule-soft)', padding: '10px 18px',
            background: 'transparent', cursor: 'not-allowed',
          }}>
            SELF-EXCLUSION
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function MatchRow({ match }: { match: RecentMatch }) {
  const color = match.result === 'WIN' ? 'var(--money)' : match.result === 'LOSS' ? 'var(--alarm)' : 'var(--ink-ghost)'
  const sign  = match.result === 'WIN' ? '+' : match.result === 'LOSS' ? '' : '±'

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '140px 80px 1fr 120px 100px',
      alignItems: 'center', gap: 24,
      padding: '14px 0', borderBottom: '1px solid var(--rule-soft)',
    }}>
      <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{match.ago}</span>
      <span style={{ ...s.mono, fontSize: 10, fontWeight: 600, color }}>{match.result}</span>
      <div>
        <div style={{ fontSize: 14, color: 'var(--ink)' }}>
          {match.game} · vs {match.opponent}
        </div>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>
          {match.roomKr} KR ROOM
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
          color, fontVariantNumeric: 'tabular-nums',
        }}>
          {sign}{match.earnedKr !== 0 ? Math.abs(match.earnedKr) : 0}
        </span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>KR</span>
      </div>
    </div>
  )
}
