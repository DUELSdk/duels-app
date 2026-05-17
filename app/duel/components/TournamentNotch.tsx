'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTournament } from './TournamentContext'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
}

function SeatGrid({ seats, filled }: { seats: number; filled: number }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginTop: 20 }}>
      {Array.from({ length: seats }).map((_, i) => (
        <div key={i} style={{
          width: 16, height: 16,
          background: i < filled ? 'var(--bone)' : 'transparent',
          border: '1px solid rgba(240,237,228,0.3)',
        }} />
      ))}
    </div>
  )
}

export function TournamentNotch() {
  const { tournament, drawerOpen, closeDrawer } = useTournament()
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setDots(d => (d + 1) % 4), 700)
    return () => clearInterval(iv)
  }, [])

  if (!tournament) return null

  const seatsLeft = tournament.seats - tournament.filled

  return (
    <>
      {drawerOpen && (
        <div
          onClick={closeDrawer}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(13,13,13,0.5)',
            zIndex: 49,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 440,
        background: 'var(--bone)',
        borderLeft: '1.5px solid var(--ink)',
        zIndex: 50,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid rgba(13,13,13,0.18)',
          position: 'sticky', top: 0, background: 'var(--bone)', zIndex: 1,
        }}>
          <div style={{ ...mono, fontSize: 9, color: 'var(--alarm)', letterSpacing: '0.18em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
            IN TOURNAMENT
          </div>
          <button
            onClick={closeDrawer}
            style={{ ...mono, fontSize: 16, color: 'var(--ink-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
          >×</button>
        </div>

        <div style={{ padding: '32px 24px', flex: 1 }}>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>
            {tournament.game} · {tournament.time}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
            textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9, marginBottom: 28,
          }}>
            {tournament.label}.
          </h2>

          <div style={{ border: '1.5px solid var(--ink)', padding: '28px 24px', textAlign: 'center', marginBottom: 16 }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 12, letterSpacing: '0.12em' }}>
              WAITING FOR BRACKET TO FILL
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 80,
              letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
            }}>
              {seatsLeft}
            </div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 6 }}>
              SEAT{seatsLeft !== 1 ? 'S' : ''} LEFT OF {tournament.seats}
            </div>
            <SeatGrid seats={tournament.seats} filled={tournament.filled} />
          </div>

          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 24 }}>
            WAITING FOR PLAYERS{'.' .repeat(dots)}
          </div>

          <div style={{ display: 'flex', gap: 0, border: '1.5px solid var(--ink)', marginBottom: 24 }}>
            {[
              { label: 'ENTRY PAID',  value: `${tournament.entryKr} KR` },
              { label: '1ST PLACE',   value: `${tournament.prizeFirst.toLocaleString('da-DK')} KR`, color: 'var(--money)' },
            ].map((item, i) => (
              <div key={item.label} style={{
                flex: 1, padding: '16px 16px', textAlign: 'center',
                borderLeft: i > 0 ? '1px solid rgba(13,13,13,0.18)' : 'none',
              }}>
                <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 6 }}>{item.label}</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                  letterSpacing: '-0.02em', color: item.color ?? 'var(--ink)', fontVariantNumeric: 'tabular-nums',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/tournaments/${tournament.id}/waiting`}
            style={{
              display: 'block', textAlign: 'center',
              border: '1.5px solid var(--ink)', padding: '14px 20px',
              ...mono, fontSize: 11, fontWeight: 700, color: 'var(--ink)',
              textDecoration: 'none', letterSpacing: '0.10em',
            }}
          >
            OPEN FULL PAGE →
          </Link>
        </div>
      </div>
    </>
  )
}
