import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getTournamentDetail, type BracketMatch } from '@/lib/mock-data'

function statusColor(status: string) {
  return status === 'LIVE' ? 'var(--alarm)' : status === 'OPEN' ? 'var(--money)' : 'var(--ink-ghost)'
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = getTournamentDetail(id)
  if (!t) notFound()

  const seatsLeft = t.seats - t.filled
  const gameSlug = t.game.toLowerCase().replace(' ', '-')

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" activePage="tournaments" />

      {/* Breadcrumb */}
      <div style={{ padding: `16px ${s.px} 0`, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/tournaments" style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none' }}>TOURNAMENTS</Link>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>/</span>
        <span style={{ ...s.mono, fontSize: 10 }}>{t.label}</span>
      </div>

      <section style={{ padding: `40px ${s.px} 48px` }}>
        <div style={{ ...s.mono, fontSize: 10, color: statusColor(t.status), marginBottom: 16 }}>
          ● {t.status} · {t.time} · {t.game}
        </div>
        <h1 style={{ ...s.display(80), lineHeight: 0.85, marginBottom: 32 }}>{t.label}.</h1>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 40 }}>
          {[
            { label: 'ENTRY',    value: `${t.entryKr} KR`                                        },
            { label: 'PURSE',    value: `${t.purseKr.toLocaleString('da-DK')} KR`                 },
            { label: 'SEATS',    value: `${t.filled}/${t.seats}`                                  },
            { label: 'FORMAT',   value: t.format                                                   },
          ].map(item => (
            <div key={item.label} style={{ border: '1.5px solid var(--ink)', padding: '20px 24px' }}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'start' }}>
          {/* Left — bracket */}
          <div>
            {t.bracket.length > 0 ? (
              <>
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>BRACKET</div>
                <div style={s.rule} />
                <div style={{ display: 'flex', gap: 32, marginTop: 24, overflowX: 'auto' }}>
                  {t.bracket.map(round => (
                    <div key={round.round} style={{ minWidth: 180 }}>
                      <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 16 }}>{round.round}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {round.matches.map((m, i) => (
                          <BracketCard key={i} match={m} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: '40px 0' }}>
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>BRACKET</div>
                <div style={{ ...s.rule, marginBottom: 24 }} />
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>
                  BRACKET WILL BE PUBLISHED WHEN REGISTRATION CLOSES
                </div>
              </div>
            )}
          </div>

          {/* Right — CTA + prize */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>PRIZE BREAKDOWN</div>
            <div style={{ border: '1.5px solid var(--ink)', marginBottom: 16 }}>
              {t.prizeBreakdown.map(p => (
                <div key={p.place} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '14px 20px', borderBottom: '1px solid var(--rule-soft)',
                }}>
                  <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{p.place}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--money)' }}>
                    {p.kr.toLocaleString('da-DK')} KR
                  </span>
                </div>
              ))}
              <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>15% RAKE DEDUCTED</span>
                <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>
                  TOTAL {t.purseKr.toLocaleString('da-DK')} KR
                </span>
              </div>
            </div>

            {t.status !== 'DONE' ? (
              <>
                {seatsLeft > 0 && t.status === 'OPEN' ? (
                  <Link href={`/play/${gameSlug}/lobby`} style={{
                    display: 'block', textAlign: 'center',
                    background: 'var(--ink)', color: 'var(--bone)',
                    padding: '18px 24px',
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 18, textTransform: 'uppercase',
                    textDecoration: 'none', letterSpacing: '0.02em',
                  }}>
                    ENTER · {t.entryKr} KR →
                  </Link>
                ) : t.status === 'LIVE' ? (
                  <Link href={`/play/${gameSlug}/match`} style={{
                    display: 'block', textAlign: 'center',
                    background: 'var(--alarm)', color: '#fff',
                    padding: '18px 24px',
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 18, textTransform: 'uppercase',
                    textDecoration: 'none', letterSpacing: '0.02em',
                  }}>
                    WATCH LIVE →
                  </Link>
                ) : (
                  <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)', textAlign: 'center', padding: '18px 0' }}>
                    {seatsLeft === 0 ? 'FULLY BOOKED' : 'REGISTRATION CLOSED'}
                  </div>
                )}
                {seatsLeft > 0 && t.status === 'OPEN' && (
                  <p style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', textAlign: 'center', marginTop: 8 }}>
                    {seatsLeft} SEAT{seatsLeft !== 1 ? 'S' : ''} LEFT
                  </p>
                )}
              </>
            ) : (
              <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-ghost)', textAlign: 'center', padding: '18px 0' }}>
                TOURNAMENT SETTLED
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function BracketCard({ match }: { match: BracketMatch }) {
  return (
    <div style={{ border: '1.5px solid var(--rule-soft)' }}>
      {[{ name: match.p1, won: match.winner === match.p1 }, { name: match.p2, won: match.winner === match.p2 }].map((player, i) => (
        <div key={i} style={{
          padding: '8px 12px',
          borderBottom: i === 0 ? '1px solid var(--rule-soft)' : 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: player.won ? 'rgba(29,138,58,0.06)' : 'transparent',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: player.won ? 700 : 400,
            color: player.won ? 'var(--money)' : player.name === 'TBD' ? 'var(--ink-ghost)' : 'var(--ink)',
          }}>
            {player.name}
          </span>
          {player.won && <span style={{ ...s.mono, fontSize: 8, color: 'var(--money)' }}>W</span>}
        </div>
      ))}
    </div>
  )
}
