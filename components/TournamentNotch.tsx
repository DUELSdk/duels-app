'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// Mock — replace with real session data when auth/Supabase wired up
const MOCK_ACTIVE = {
  id: 't1',
  label: "TONIGHT'S MARQUEE",
  game: 'CARD DUEL',
  time: '20:00',
  entryKr: 250,
  seats: 16,
  filled: 14,
  purseKr: 3600,
  prizeFirst: 2520,
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
}

export function TournamentNotch() {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [dots,        setDots]        = useState(0)

  // Animate waiting dots
  useEffect(() => {
    const iv = setInterval(() => setDots(d => (d + 1) % 4), 700)
    return () => clearInterval(iv)
  }, [])

  // ESC closes drawer
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { setDrawerOpen(false); setPopoverOpen(false) }
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onKey])

  const seatsLeft = MOCK_ACTIVE.seats - MOCK_ACTIVE.filled

  function openDrawer() {
    setPopoverOpen(false)
    setDrawerOpen(true)
  }

  // Seat grid
  function SeatGrid() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginTop: 20 }}>
        {Array.from({ length: MOCK_ACTIVE.seats }).map((_, i) => (
          <div key={i} style={{
            width: 16, height: 16,
            background: i < MOCK_ACTIVE.filled ? 'var(--bone)' : 'transparent',
            border: '1px solid rgba(240,237,228,0.3)',
          }} />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* ── Overlay behind drawer ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(13,13,13,0.5)',
            zIndex: 49,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Drawer ── */}
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
        {/* Drawer header */}
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
            onClick={() => setDrawerOpen(false)}
            style={{ ...mono, fontSize: 16, color: 'var(--ink-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
          >×</button>
        </div>

        {/* Drawer body */}
        <div style={{ padding: '32px 24px', flex: 1 }}>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>
            {MOCK_ACTIVE.game} · {MOCK_ACTIVE.time}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
            textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9, marginBottom: 28,
          }}>
            {MOCK_ACTIVE.label}.
          </h2>

          {/* Seat counter */}
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
              SEAT{seatsLeft !== 1 ? 'S' : ''} LEFT OF {MOCK_ACTIVE.seats}
            </div>
            <SeatGrid />
          </div>

          {/* Status */}
          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 24 }}>
            WAITING FOR PLAYERS{'.' .repeat(dots)}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, border: '1.5px solid var(--ink)', marginBottom: 24 }}>
            {[
              { label: 'ENTRY PAID',  value: `${MOCK_ACTIVE.entryKr} KR` },
              { label: '1ST PLACE',   value: `${MOCK_ACTIVE.prizeFirst.toLocaleString('da-DK')} KR`, color: 'var(--money)' },
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

          {/* Full page link */}
          <Link
            href={`/tournaments/${MOCK_ACTIVE.id}/waiting`}
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

      {/* ── Popover ── */}
      {popoverOpen && !drawerOpen && (
        <div style={{
          position: 'fixed', bottom: 80, right: 20,
          width: 280,
          background: 'var(--bone)', border: '1.5px solid var(--ink)',
          zIndex: 48,
          boxShadow: '0 8px 32px rgba(13,13,13,0.18)',
        }}>
          {/* Tournament info */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(13,13,13,0.18)' }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--alarm)', letterSpacing: '0.16em', fontWeight: 700, marginBottom: 6 }}>
              ● IN TOURNAMENT
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
              textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.1,
            }}>
              {MOCK_ACTIVE.label}
            </div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>
              {MOCK_ACTIVE.game} · {MOCK_ACTIVE.time}
            </div>
          </div>

          {/* Seat count */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(13,13,13,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>SEATS LEFT</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {seatsLeft} <span style={{ fontSize: 14, color: 'var(--ink-faint)' }}>/ {MOCK_ACTIVE.seats}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, width: 80, justifyContent: 'flex-end' }}>
              {Array.from({ length: MOCK_ACTIVE.seats }).map((_, i) => (
                <div key={i} style={{
                  width: 10, height: 10,
                  background: i < MOCK_ACTIVE.filled ? 'var(--ink)' : 'transparent',
                  border: '1px solid rgba(13,13,13,0.3)',
                }} />
              ))}
            </div>
          </div>

          {/* Open button */}
          <button
            onClick={openDrawer}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: 'var(--ink)', color: 'var(--bone)',
              padding: '14px 18px', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
              textTransform: 'uppercase', letterSpacing: '0.02em',
            }}
          >
            OPEN FULL →
          </button>
        </div>
      )}

      {/* ── Persistent pill ── */}
      <button
        onClick={() => {
          if (drawerOpen) { setDrawerOpen(false); return }
          setPopoverOpen(p => !p)
        }}
        style={{
          position: 'fixed', bottom: 20, right: 20,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--ink)', color: 'var(--bone)',
          border: '1.5px solid var(--ink)',
          padding: '10px 16px',
          cursor: 'pointer', zIndex: 48,
          transition: 'opacity 0.15s',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
          {MOCK_ACTIVE.label.length > 14 ? MOCK_ACTIVE.label.slice(0, 14) + '…' : MOCK_ACTIVE.label}
        </span>
        <span style={{ ...mono, fontSize: 10, color: 'rgba(240,237,228,0.5)', fontVariantNumeric: 'tabular-nums' }}>
          {MOCK_ACTIVE.filled}/{MOCK_ACTIVE.seats}
        </span>
        <span style={{ ...mono, fontSize: 10, color: 'rgba(240,237,228,0.4)', marginLeft: 2 }}>
          {popoverOpen || drawerOpen ? '↓' : '↑'}
        </span>
      </button>
    </>
  )
}
