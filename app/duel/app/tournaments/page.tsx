'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BroadcastNav, StadiumStrip, LiveTicker } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

type FilterKey = 'ALL' | 'CARD' | 'CYCLE' | 'DROP' | 'INVITE'

type TourneyStatus = 'LIVE' | 'OPEN' | 'INVITE' | 'LOCKED'

type Tourney = {
  id: string
  day: 'TONIGHT' | 'TOMORROW' | 'SAT'
  time: string
  start: string
  name: string
  game: string
  fmt: string
  fee: number
  pool: number
  seats: string
  status: TourneyStatus
  marquee?: boolean
}

const TOURNEYS: Tourney[] = [
  {
    id: 'TNS50', day: 'TONIGHT', time: '20:00', start: '1H 14M',
    name: 'THURSDAY NIGHT SEALED 50',
    game: 'CARD DUEL', fmt: 'SINGLE ELIM · 32 SEATS',
    fee: 50, pool: 1360, seats: '22/32', status: 'OPEN', marquee: true,
  },
  {
    id: 'QF10', day: 'TONIGHT', time: '20:30', start: 'LIVE NOW',
    name: 'QUICKFIRE 10',
    game: 'CARD DUEL', fmt: 'SINGLE ELIM · 32 SEATS',
    fee: 10, pool: 272, seats: '32/32', status: 'LIVE',
  },
  {
    id: 'COP100', day: 'TONIGHT', time: '21:00', start: '4H',
    name: 'CYCLE OPEN 100',
    game: 'CYCLEDUEL', fmt: 'DOUBLE ELIM · 64 SEATS',
    fee: 100, pool: 5440, seats: '8/64', status: 'OPEN',
  },
  {
    id: 'NW25', day: 'TONIGHT', time: '23:30', start: '6H',
    name: 'NIGHT WINDOW 25',
    game: 'CARD DUEL', fmt: 'SINGLE ELIM · 16 SEATS',
    fee: 25, pool: 340, seats: '4/16', status: 'OPEN',
  },
  {
    id: 'DB25', day: 'TOMORROW', time: '19:30', start: '24H',
    name: 'DROP BLOCK 25',
    game: 'DROPDUEL', fmt: 'SINGLE ELIM · 32 SEATS',
    fee: 25, pool: 680, seats: '4/32', status: 'OPEN',
  },
  {
    id: 'CD500', day: 'TOMORROW', time: '21:00', start: '25H',
    name: 'CARD DUEL 500',
    game: 'CARD DUEL', fmt: 'INVITE · 16 SEATS',
    fee: 500, pool: 6800, seats: '11/16', status: 'INVITE',
  },
  {
    id: 'WK500', day: 'SAT', time: '20:00', start: 'SAT',
    name: 'WEEKLY 500',
    game: 'CARD DUEL', fmt: 'DOUBLE ELIM · 64 SEATS',
    fee: 500, pool: 27200, seats: '14/64', status: 'OPEN', marquee: true,
  },
]

const fmtKr = (n: number) => n.toLocaleString('da-DK')

function GameTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
      padding: '3px 8px',
      border: '1px solid var(--ink)',
      color: 'var(--ink)',
    }}>
      {children}
    </span>
  )
}

function StatusBit({ status }: { status: TourneyStatus }) {
  const map: Record<TourneyStatus, { dot: string; label: string; color: string }> = {
    LIVE:   { dot: 'var(--alarm)',      label: 'LIVE NOW',    color: 'var(--alarm)'     },
    OPEN:   { dot: 'var(--money)',      label: 'OPEN ENTRY',  color: 'var(--money)'     },
    INVITE: { dot: 'var(--ink)',        label: 'INVITE-ONLY', color: 'var(--ink-soft)'  },
    LOCKED: { dot: 'var(--ink-ghost)', label: 'LOCKED',      color: 'var(--ink-ghost)' },
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

function TourneyRow({ t }: { t: Tourney }) {
  const gameAbbr = t.game.split(' ')[0]
  const btnLabel = t.status === 'LIVE' ? 'WATCH' : 'VIEW'
  const btnBg    = t.status === 'LIVE' ? 'var(--alarm)' : 'var(--ink)'
  const btnColor = '#fff'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '88px 80px 1fr 180px 160px 140px auto',
      alignItems: 'center', gap: 24,
      padding: '22px 0',
      borderBottom: '1px solid var(--rule-soft)',
      background: t.marquee ? 'rgba(13,13,13,0.025)' : 'transparent',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
      }}>
        {t.time}
      </span>

      <GameTag>{gameAbbr}</GameTag>

      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
          textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.05,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {t.name}
          {t.marquee && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--alarm)',
              fontWeight: 700, letterSpacing: '0.14em',
            }}>
              ★ MARQUEE
            </span>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)',
          marginTop: 4, letterSpacing: '0.10em',
        }}>
          {t.fmt} · STARTS {t.start}
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2,
        }}>
          PRIZE POOL
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24,
          letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
        }}>
          {fmtKr(t.pool)} <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>KR</span>
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2,
        }}>
          ENTRY · SEATS
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {t.fee} KR <span style={{ color: 'var(--ink-faint)' }}>·</span> {t.seats}
        </div>
      </div>

      <StatusBit status={t.status} />

      <Link href={`/tournaments/${t.id}`} style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
        textTransform: 'uppercase', letterSpacing: '0.02em',
        background: btnBg, color: btnColor,
        padding: '10px 16px', textDecoration: 'none', whiteSpace: 'nowrap',
      }}>
        {btnLabel} →
      </Link>
    </div>
  )
}

export default function Tournaments() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL')

  function applyFilter(t: Tourney): boolean {
    if (activeFilter === 'ALL')    return true
    if (activeFilter === 'CARD')   return t.game.includes('CARD')
    if (activeFilter === 'CYCLE')  return t.game.includes('CYCLE')
    if (activeFilter === 'DROP')   return t.game.includes('DROP')
    if (activeFilter === 'INVITE') return t.status === 'INVITE'
    return true
  }

  const filtered  = TOURNEYS.filter(applyFilter)
  const tonight   = filtered.filter(t => t.day === 'TONIGHT')
  const tomorrow  = filtered.filter(t => t.day === 'TOMORROW')
  const week      = filtered.filter(t => t.day === 'SAT')
  const marquee   = TOURNEYS.find(t => t.marquee && t.day === 'TONIGHT') ?? TOURNEYS.find(t => t.marquee)

  const liveCount = TOURNEYS.filter(t => t.status === 'LIVE').length
  const openCount = TOURNEYS.filter(t => t.status === 'OPEN').length
  const totalPool = TOURNEYS.reduce((n, t) => n + t.pool, 0)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="tournaments" />
      <StadiumStrip />

      {/* HERO */}
      <section style={{ padding: `56px ${s.px} 24px` }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="live-dot" />
          {liveCount} LIVE · {openCount} OPEN · {fmtKr(totalPool)} KR IN POOLS THIS WEEK
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginTop: 24, gap: 40,
        }}>
          <h1 style={{ ...s.display(144), lineHeight: 0.85 }}>TOURNAMENTS.</h1>
          <p style={{
            fontSize: 16, lineHeight: 1.4, maxWidth: 380,
            paddingBottom: 12, color: 'var(--ink-soft)', flexShrink: 0,
          }}>
            Sit down. Pay once. Last one standing takes the pot.{' '}
            <span style={{ color: 'var(--ink-faint)' }}>Rake 15%, no decline once seated.</span>
          </p>
        </div>
      </section>

      {/* FILTER STRIP */}
      <div style={{
        display: 'flex', gap: 0,
        borderTop: '1px solid var(--ink)',
        borderBottom: '1px solid var(--ink)',
        padding: `0 ${s.px}`,
      }}>
        {([
          { k: 'ALL',    n: TOURNEYS.length } as { k: FilterKey; n: number },
          { k: 'CARD',   n: TOURNEYS.filter(t => t.game.includes('CARD')).length   },
          { k: 'CYCLE',  n: TOURNEYS.filter(t => t.game.includes('CYCLE')).length  },
          { k: 'DROP',   n: TOURNEYS.filter(t => t.game.includes('DROP')).length   },
          { k: 'INVITE', n: TOURNEYS.filter(t => t.status === 'INVITE').length     },
        ]).map((f, i) => (
          <div key={f.k} onClick={() => setActiveFilter(f.k)} style={{
            padding: '14px 24px',
            borderRight: i < 4 ? '1px solid var(--rule-soft)' : 'none',
            background: activeFilter === f.k ? 'var(--ink)' : 'transparent',
            color: activeFilter === f.k ? 'var(--bone)' : 'var(--ink)',
            display: 'flex', alignItems: 'baseline', gap: 8, cursor: 'pointer',
            userSelect: 'none',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em' }}>
              {f.k}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.6, fontVariantNumeric: 'tabular-nums' }}>
              {f.n}
            </span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '14px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)' }}>SORT</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>SOONEST ↓</span>
        </div>
      </div>

      <LiveTicker />

      {/* ★ MARQUEE */}
      {marquee && (
        <section style={{ padding: `40px ${s.px}` }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            ★ MARQUEE · {marquee.day}
          </div>
          <div style={{
            border: '1.5px solid var(--ink)',
            background: 'var(--bone-2)',
            padding: 32,
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: 48,
          }}>
            {/* Left */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <GameTag>{marquee.game.split(' ')[0]}</GameTag>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>
                  {marquee.fmt}
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72,
                textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9,
                marginTop: 16,
              }}>
                {marquee.name}.
              </h2>
              <p style={{
                fontSize: 15, color: 'var(--ink-soft)', marginTop: 16,
                maxWidth: 480, lineHeight: 1.45,
              }}>
                The marquee fight. {marquee.fee} KR entry, {marquee.fmt.toLowerCase()}, last one standing takes {fmtKr(marquee.pool)} KR after rake.
              </p>
              {/* Sealed seats strip */}
              <div style={{
                display: 'flex', gap: 4, marginTop: 28, paddingTop: 24,
                borderTop: '1px solid var(--rule-soft)', alignItems: 'center',
                flexWrap: 'wrap' as const,
              }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{
                    width: 28, height: 28,
                    background: 'var(--ink)', border: '1px solid var(--ink)',
                  }} />
                ))}
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)',
                  marginLeft: 8,
                }}>
                  + {marquee.seats.split('/')[0]} SEALED
                </span>
              </div>
            </div>

            {/* Right — pot panel */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4,
                }}>
                  PRIZE POOL
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88,
                  letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}>
                  {fmtKr(marquee.pool)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                  color: 'var(--ink-faint)',
                }}>
                  KR · WINNER TAKES
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)',
                  marginTop: 12, fontVariantNumeric: 'tabular-nums',
                }}>
                  FEE {marquee.fee} KR · {marquee.seats} SEATED
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
                  color: 'var(--alarm)', marginTop: 16, fontVariantNumeric: 'tabular-nums',
                }}>
                  {marquee.start}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--alarm)',
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2,
                }}>
                  STARTS
                </div>
              </div>
              <Link href={`/tournaments/${marquee.id}`} style={{
                display: 'block', textAlign: 'center',
                background: 'var(--alarm)', color: '#fff',
                padding: '20px 24px',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em',
                textDecoration: 'none', marginTop: 24,
              }}>
                VIEW TOURNAMENT — {marquee.fee} KR →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TONIGHT */}
      {tonight.length > 0 && (
        <section style={{ padding: `24px ${s.px}` }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12,
          }}>
            <h2 style={{ ...s.display(64), lineHeight: 0.9 }}>TONIGHT.</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>
              {tonight.length} FIXTURES · CET
            </span>
          </div>
          <div style={s.rule} />
          {tonight.map(t => <TourneyRow key={t.id} t={t} />)}
        </section>
      )}

      {/* TOMORROW */}
      {tomorrow.length > 0 && (
        <section style={{ padding: `24px ${s.px}` }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12,
          }}>
            <h2 style={{ ...s.display(64), lineHeight: 0.9 }}>TOMORROW.</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>
              {tomorrow.length} FIXTURES
            </span>
          </div>
          <div style={s.rule} />
          {tomorrow.map(t => <TourneyRow key={t.id} t={t} />)}
        </section>
      )}

      {/* THIS WEEK */}
      {week.length > 0 && (
        <section style={{ padding: `24px ${s.px}` }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12,
          }}>
            <h2 style={{ ...s.display(64), lineHeight: 0.9 }}>THIS WEEK.</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>
              {week.length} FIXTURE{week.length !== 1 ? 'S' : ''}
            </span>
          </div>
          <div style={s.rule} />
          {week.map(t => <TourneyRow key={t.id} t={t} />)}
        </section>
      )}

      {/* HOW A TOURNAMENT RESOLVES */}
      <section style={{
        padding: `40px ${s.px} 56px`,
        background: 'var(--bone-2)',
        borderTop: '1px solid var(--ink)',
        marginTop: 40,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)',
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          HOW A TOURNAMENT RESOLVES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            ['01', 'TAKE A SEAT',      'Pay the entry. Seat is anonymous. No declines once seated.'],
            ['02', 'FIGHT THE BRACKET', 'Single or double elim. Same engine as casual rooms — sealed, blind, slot-by-slot.'],
            ['03', 'WINNER TAKES',      'One pot. Last one standing takes everything. 15% rake before payout.'],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ padding: 24, border: '1.5px solid var(--ink)', background: 'var(--bone)' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
                color: 'var(--alarm)', letterSpacing: '-0.02em', lineHeight: 1,
              }}>
                {n}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                textTransform: 'uppercase', letterSpacing: '-0.01em', marginTop: 8,
              }}>
                {title}
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
