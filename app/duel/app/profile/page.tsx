import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { SignOutButton } from '@/components/SignOutButton'
import { s } from '@/lib/styles'
import { createSupabaseServerClient } from '@/lib/supabase-server'

type GameStat = { game: string; played: number; won: number }
type RecentMatch = {
  id: string
  game: string
  opponent: string
  result: 'WIN' | 'LOSS' | 'SPLIT'
  net_ore: number
  stake_kr: number
  settled_at: string
}
type RivalEntry = {
  handle: string
  played: number
  wins: number
  losses: number
  current_streak: number
  revenge_active: boolean
}

function timeAgo(ts: string): string {
  const diffMs  = Date.now() - new Date(ts).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 60)  return `${diffMin} MIN`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr  < 24)  return `${diffHr} HR`
  return 'YESTERDAY'
}

function fmtGameLabel(slug: string): string {
  const map: Record<string, string> = {
    'card-duel':  'CARD',
    'cycle-duel': 'CYCLE',
    'drop-duel':  'DROP',
  }
  return map[slug] ?? slug.toUpperCase()
}

const ACHIEVEMENTS = [
  { label: 'FIRST BLOOD',  sub: 'first win'            },
  { label: 'CENTURY',      sub: '100 wins'             },
  { label: 'HEATER',       sub: '5-streak'             },
  { label: 'ROOM CLIMBER', sub: '500 KR room cleared'  },
]

export default async function ProfilePage() {
  const supabaseServer = await createSupabaseServerClient()

  const [statsRes, rivalsRes] = await Promise.all([
    supabaseServer.rpc('rpc_get_user_stats'),
    supabaseServer.rpc('rpc_get_rivals'),
  ])

  const rawStats = statsRes.data as any
  if (!rawStats || rawStats.error === 'NOT_AUTHENTICATED') {
    redirect('/auth')
  }

  const user = rawStats as {
    handle: string
    initials: string
    member_since: string
    balance_ore: number
    rank: number
    wins: number
    losses: number
    net_ore: number
    game_stats: GameStat[]
    recent_matches: RecentMatch[]
  }

  const rivals: RivalEntry[] = (rivalsRes.data as RivalEntry[] | null) ?? []

  // Compute ties from game_stats
  const totalPlayed = user.game_stats.reduce((sum, g) => sum + g.played, 0)
  const ties = totalPlayed - user.wins - user.losses

  // Format net KR
  const netKr = (user.net_ore >= 0 ? '+' : '−') + Math.round(Math.abs(user.net_ore) / 100).toLocaleString('da-DK')

  // Recent matches adapted
  const recentMatches = user.recent_matches.map(m => ({
    id:        m.id,
    ago:       timeAgo(m.settled_at),
    game:      fmtGameLabel(m.game),
    opponent:  m.opponent,
    result:    m.result,
    earnedKr:  Math.round(m.net_ore / 100),
  }))

  // Sort rivals, find active
  const sortedRivals = [...rivals].sort((a, b) => {
    if (a.revenge_active && !b.revenge_active) return -1
    if (!a.revenge_active && b.revenge_active) return 1
    return b.played - a.played
  })
  const activeRival = sortedRivals.find(r => r.revenge_active) ?? null

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      {/* ── Header ── */}
      <section style={{ padding: `40px ${s.px} 24px` }}>
        <div style={{ borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
          <div style={{ ...s.mono, fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-faint)' }}>
            MEMBER SINCE {user.member_since.toUpperCase()} · {totalPlayed} MATCHES · RANK #{user.rank}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
            <h1 style={{ ...s.display(132), lineHeight: 0.85 }}>{user.handle.toUpperCase()}.</h1>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)' }}>ALL-TIME RANK</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
                  letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>#{user.rank}</div>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ padding: `12px ${s.px} 24px` }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--rule-soft)',
          borderBottom: '1px solid var(--rule-soft)',
        }}>
          {[
            ['WINS',    String(user.wins),   'var(--money)'],
            ['LOSSES',  String(user.losses), 'var(--alarm)'],
            ['TIES',    String(Math.max(0, ties)),   'var(--ink)'],
            ['NET KR',  netKr,               user.net_ore >= 0 ? 'var(--money)' : 'var(--alarm)'],
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
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>RECENT</span>
            </div>
            <div style={s.rule} />
            {recentMatches.length === 0 ? (
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', padding: '20px 0' }}>NO MATCHES YET</div>
            ) : recentMatches.slice(0, 10).map((m) => {
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
                  <span style={{ ...s.mono, fontSize: 10, letterSpacing: '0.10em' }}>{m.game}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>VS {m.opponent}</span>
                  <span style={{ ...s.mono, fontSize: 11, fontWeight: 700, color }}>{m.result[0]}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
                    textAlign: 'right', fontVariantNumeric: 'tabular-nums', color,
                  }}>
                    {isWin ? '+' : isLoss ? '−' : '±'}{Math.abs(m.earnedKr).toLocaleString('da-DK')}
                  </span>
                </div>
              )
            })}
          </div>

          {/* BY GAME + ACHIEVEMENTS */}
          <div>
            <h2 style={{ ...s.display(36), marginBottom: 12 }}>BY GAME.</h2>
            <div style={s.rule} />
            {user.game_stats.length === 0 ? (
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', padding: '16px 0' }}>NO GAMES YET</div>
            ) : user.game_stats.map((g, i, a) => {
              const pct = g.played > 0 ? Math.round(g.won / g.played * 100) : 0
              return (
                <div key={g.game} style={{
                  padding: '16px 0',
                  borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>{fmtGameLabel(g.game)}</span>
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
            {ACHIEVEMENTS.map((a) => (
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
              REVENGE ACTIVE · LOST {Math.abs(activeRival.current_streak)} IN A ROW
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 12 }}>YOUR NEMESIS</div>
                <div style={{ ...s.display(80), color: 'var(--bone-on-dark)', lineHeight: 0.88 }}>
                  {activeRival.handle.toUpperCase()}.
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
