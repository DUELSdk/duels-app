import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getTournamentDetail, type TournamentDetail } from '@/lib/mock-data'

const fmtKr = (n: number) => n.toLocaleString('da-DK')

type TStatus = TournamentDetail['status']

function GameTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
      padding: '3px 8px', border: '1px solid var(--ink)', color: 'var(--ink)',
    }}>
      {children}
    </span>
  )
}

function StatusBit({ status }: { status: TStatus }) {
  const map: Record<TStatus, { dot: string; label: string; color: string }> = {
    LIVE: { dot: 'var(--alarm)',      label: 'LIVE NOW',   color: 'var(--alarm)'    },
    OPEN: { dot: 'var(--money)',      label: 'OPEN ENTRY', color: 'var(--money)'    },
    DONE: { dot: 'var(--ink-ghost)', label: 'SETTLED',    color: 'var(--ink-ghost)' },
  }
  const { dot, label, color } = map[status]
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
      letterSpacing: '0.10em', color, display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0,
        animation: status === 'LIVE' ? 'pulse 1.4s infinite' : 'none',
      }} />
      {label}
    </span>
  )
}

function bracketTiers(seatsTotal: number) {
  const rounds = Math.log2(seatsTotal)
  return Array.from({ length: rounds }, (_, r) => {
    const n = seatsTotal / Math.pow(2, r + 1)
    const isFinalRound = r === rounds - 1
    const isSemi      = r === rounds - 2
    const isQuarter   = r === rounds - 3
    const label = isFinalRound ? 'FINAL'
                : isSemi       ? 'SEMIS'
                : isQuarter    ? 'QUARTERS'
                : `ROUND OF ${seatsTotal / Math.pow(2, r)}`
    const key = isFinalRound ? 'FINAL'
              : isSemi       ? 'SF'
              : isQuarter    ? 'QF'
              : `R${seatsTotal / Math.pow(2, r)}`
    return { label, key, n }
  })
}

function Bracket({ t }: { t: TournamentDetail }) {
  const tiers = bracketTiers(t.seatsTotal)
  const CELL_H = 28

  return (
    <div style={{ border: '1.5px solid var(--ink)', background: 'var(--bone)', padding: '24px 24px 28px', overflowX: 'auto' }}>
      {/* Tier labels */}
      <div style={{ display: 'flex', marginBottom: 16 }}>
        {tiers.map((tier, ci) => (
          <div key={tier.key} style={{ flex: 1, textAlign: ci === 0 ? 'left' : 'center' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: tier.key === 'F' ? 'var(--alarm)' : 'var(--ink-faint)',
            }}>
              {tier.label}
            </span>
          </div>
        ))}
      </div>

      {/* Columns */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
        {tiers.map((tier, ci) => {
          const isFirst = ci === 0
          const isFinal = tier.key === 'FINAL'
          const totalH = (t.seatsTotal / 2) * (CELL_H + 6)

          return (
            <div key={tier.key} style={{
              flex: 1, height: totalH,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
            }}>
              {Array.from({ length: tier.n }).map((_, i) => {
                const filled = isFirst && i < t.seatsFilled
                const hot = isFinal
                return (
                  <div key={i} style={{
                    height: CELL_H,
                    border: hot ? '1.5px solid var(--ink)' : '1px solid var(--rule-soft)',
                    background: hot ? 'var(--ink)' : filled ? 'var(--bone)' : 'var(--bone-2)',
                    color: hot ? 'var(--bone)' : 'var(--ink)',
                    display: 'flex', alignItems: 'center', padding: '0 8px',
                    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.04em',
                    whiteSpace: 'nowrap' as const, overflow: 'hidden',
                  }}>
                    {isFinal
                      ? `CHAMPION · ${fmtKr(t.pool)} KR`
                      : tier.n <= 4
                        ? `WINNER ${i + 1}`
                        : filled
                          ? `SEAT ${String(i + 1).padStart(2, '0')} · SEALED`
                          : `SEAT ${String(i + 1).padStart(2, '0')} · OPEN`
                    }
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--rule-soft)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)' }}>
          {t.seatsFilled} SEATED · {t.seatsTotal - t.seatsFilled} OPEN · BRACKET FREEZES AT START
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600 }}>
          FULL BRACKET RESOLVES IN ~{Math.round(Math.log2(t.seatsTotal) * 4 + 5)} MIN AFTER START
        </span>
      </div>
    </div>
  )
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = getTournamentDetail(id)
  if (!t) notFound()

  const seatsLeft = t.seatsTotal - t.seatsFilled
  const openSeats = Array.from({ length: seatsLeft })
  const rake = Math.round(t.fee * t.seatsTotal * 0.15)
  const winnerKr = t.pool
  const gameSlug = t.game.toLowerCase().replace(' ', '-')
  const roundCount = Math.log2(t.seatsTotal)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav activePage="tournaments" />

      {/* Breadcrumb + ID strip */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `12px ${s.px}`, borderBottom: '1px solid var(--rule-soft)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)', display: 'flex', gap: 8 }}>
          <Link href="/tournaments" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>TOURNAMENTS</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{t.name}</span>
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)' }}>
          ID · {t.id} · COPY LINK ↗
        </span>
      </div>

      {/* HEADER */}
      <section style={{ padding: `56px ${s.px} 32px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 64, alignItems: 'start' }}>

          {/* Left */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <GameTag>{t.game.split(' ')[0]}</GameTag>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>{t.fmt}</span>
              <StatusBit status={t.status} />
            </div>
            <h1 style={{ ...s.display(96), lineHeight: 0.85 }}>{t.name}.</h1>
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginTop: 20, maxWidth: 520, lineHeight: 1.45 }}>
              {t.description}
            </p>
            <div style={{
              display: 'flex', gap: 48, marginTop: 32,
              paddingTop: 24, borderTop: '1px solid var(--rule-soft)',
            }}>
              {[
                { label: 'ENTRY KR',   value: String(t.fee)         },
                { label: 'SEATS',      value: String(t.seatsTotal)   },
                { label: 'ROUNDS',     value: String(roundCount)     },
                { label: 'MIN TOTAL',  value: `~${Math.round(roundCount * 4 + 5)}` },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40,
                    letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
                    letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — ink pot panel */}
          <div style={{ background: 'var(--ink)', color: 'var(--bone)', padding: 28 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: 'rgba(239,237,228,0.6)', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: 4,
            }}>
              WINNER TAKES
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88,
              letterSpacing: '-0.03em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums',
            }}>
              {fmtKr(winnerKr)}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              color: 'rgba(239,237,228,0.6)',
            }}>
              KR
            </div>

            <div style={{ height: 1, background: 'rgba(239,237,228,0.14)', margin: '20px 0 16px' }} />

            {[
              { label: 'STARTS IN', value: t.start,                              color: t.status === 'LIVE' ? 'var(--alarm)' : undefined, large: true },
              { label: 'SEATS',     value: `${t.seatsFilled} / ${t.seatsTotal}`, sub: seatsLeft > 0 ? `${seatsLeft} OPEN` : 'FULL' },
              { label: 'RAKE',      value: '15%' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginTop: 10,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>{row.label}</span>
                <span style={{
                  fontFamily: row.large ? 'var(--font-display)' : 'var(--font-mono)',
                  fontWeight: row.large ? 800 : 500,
                  fontSize: row.large ? 28 : 13,
                  color: row.color ?? 'var(--bone-on-dark)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {row.value}
                  {row.sub && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--money)', marginLeft: 6 }}>
                      · {row.sub}
                    </span>
                  )}
                </span>
              </div>
            ))}

            {t.status === 'LIVE' ? (
              <div style={{
                display: 'block', textAlign: 'center',
                background: 'rgba(239,0,0,0.15)',
                border: '1px solid rgba(239,0,0,0.4)',
                color: 'var(--alarm)',
                padding: '20px',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em',
                marginTop: 24,
              }}>
                ● MATCH IN PROGRESS
              </div>
            ) : t.status !== 'DONE' && (
              <>
                <Link href={`/tournaments/${t.id}/enter`} style={{
                  display: 'block', textAlign: 'center',
                  background: seatsLeft === 0 ? 'rgba(239,0,0,0.4)' : 'var(--alarm)',
                  color: '#fff',
                  padding: '20px',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em',
                  textDecoration: 'none', marginTop: 24,
                  pointerEvents: seatsLeft === 0 ? 'none' : 'auto',
                }}>
                  {seatsLeft === 0 ? 'FULLY SEATED' : `TAKE A SEAT — ${t.fee} KR →`}
                </Link>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, textAlign: 'center',
                  marginTop: 10, opacity: 0.5, letterSpacing: '0.10em',
                }}>
                  NO DECLINE ONCE SEATED
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* BRACKET */}
      <section style={{ padding: `32px ${s.px}` }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16,
        }}>
          <h2 style={{ ...s.display(56), lineHeight: 0.9 }}>BRACKET.</h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>
            GREYED UNTIL START · LIVE-FILLS AS ROUNDS RESOLVE
          </span>
        </div>
        <Bracket t={t} />
      </section>

      {/* SEATED LIST + PRIZE SPLIT */}
      <section style={{ padding: `32px ${s.px} 56px`, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>

        {/* Seated list */}
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12,
          }}>
            SEATED · {t.seatsFilled} OF {t.seatsTotal}
          </div>
          <div style={{
            border: '1.5px solid var(--ink)', padding: '8px 0',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            {t.seatedHandles.map((handle, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                borderBottom: i < t.seatedHandles.length - (t.seatedHandles.length % 4 || 4) ? '1px solid var(--rule-soft)' : 'none',
                borderRight: (i + 1) % 4 !== 0 ? '1px solid var(--rule-soft)' : 'none',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 9, color: 'var(--ink-faint)', width: 18, fontVariantNumeric: 'tabular-nums' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{handle}</span>
              </div>
            ))}
            {openSeats.map((_, i) => (
              <div key={`open-${i}`} style={{
                padding: '10px 14px',
                borderBottom: i < openSeats.length - (openSeats.length % 4 || 4) ? '1px solid var(--rule-soft)' : 'none',
                borderRight: (t.seatsFilled + i + 1) % 4 !== 0 ? '1px solid var(--rule-soft)' : 'none',
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-ghost)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 9, width: 18, fontVariantNumeric: 'tabular-nums' }}>
                  {String(t.seatsFilled + i + 1).padStart(2, '0')}
                </span>
                <span>· OPEN ·</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', marginTop: 8, lineHeight: 1.5 }}>
            Handles are anonymous and do not affect seeding. Bracket pairs are randomized at lock.
          </div>
        </div>

        {/* Prize split + Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Prize split */}
          <div style={{ border: '1.5px solid var(--ink)', padding: 24 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              PRIZE SPLIT · {t.seatsTotal} × {t.fee} KR = {fmtKr(t.fee * t.seatsTotal)} KR
            </div>
            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48,
                  letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>
                  {fmtKr(winnerKr)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--alarm)',
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4,
                }}>
                  WINNER · 85%
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32,
                  letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                  color: 'var(--ink-faint)', lineHeight: 1,
                }}>
                  {fmtKr(rake)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4,
                }}>
                  RAKE · 15%
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', marginTop: 16, lineHeight: 1.6 }}>
              Single elimination. One pot. Last one standing takes everything after rake. No consolation, no minimum cash.
            </p>
          </div>

          {/* Rules shorthand */}
          <div style={{ border: '1.5px dashed var(--ink)', padding: 20 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              RULES SHORTHAND
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '· 60s lock · 10s reveal per slot',
                '· Sudden death on tied final slots',
                '· Forfeit on disconnect > 30s',
                '· Bracket frozen at start time, no late entries',
              ].map(rule => (
                <div key={rule} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
