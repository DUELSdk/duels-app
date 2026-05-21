'use client'

import Link from 'next/link'
import { useActiveMatch } from './ActiveMatchContext'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
}

const GAME_LABELS: Record<string, string> = {
  'card-duel': 'CARD DUEL',
  'cycleduel': 'CYCLEDUEL',
  'dropduel':  'DROPDUEL',
}

export function ActiveMatchNotch() {
  const { activeMatch, drawerOpen, closeDrawer } = useActiveMatch()

  if (!activeMatch) return null

  const label = GAME_LABELS[activeMatch.game] ?? activeMatch.game.toUpperCase()
  const rejoinHref = `/play/${activeMatch.game}/match?matchId=${activeMatch.matchId}`

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
        width: 380,
        background: 'var(--concrete)',
        borderLeft: '1.5px solid rgba(240,237,228,0.18)',
        zIndex: 50,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
        color: 'var(--bone-on-dark)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(240,237,228,0.14)',
          position: 'sticky', top: 0, background: 'var(--concrete-2)', zIndex: 1,
        }}>
          <div style={{
            ...mono, fontSize: 9, color: 'var(--alarm)',
            letterSpacing: '0.18em', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--alarm)', display: 'inline-block',
            }} />
            MATCH IN PROGRESS
          </div>
          <button
            onClick={closeDrawer}
            style={{
              ...mono, fontSize: 16, color: 'rgba(240,237,228,0.4)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 4px', lineHeight: 1,
            }}
          >×</button>
        </div>

        <div style={{ padding: '32px 24px', flex: 1 }}>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', marginBottom: 8 }}>
            {label}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
            textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9,
            color: 'var(--bone-on-dark)', marginBottom: 32,
          }}>
            VS {activeMatch.opponentHandle}.
          </h2>

          <div style={{
            border: '1.5px solid rgba(240,237,228,0.18)',
            padding: '24px', marginBottom: 24, textAlign: 'center',
          }}>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', marginBottom: 12, letterSpacing: '0.12em' }}>
              MATCH ONGOING
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72,
              letterSpacing: '-0.04em', lineHeight: 1,
              color: 'var(--bone-on-dark)', fontVariantNumeric: 'tabular-nums',
            }}>
              {activeMatch.stakeKr}
            </div>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', marginTop: 6 }}>
              KR STAKE
            </div>
          </div>

          <div style={{ ...mono, fontSize: 10, color: 'rgba(240,237,228,0.4)', textAlign: 'center', marginBottom: 24 }}>
            YOUR MATCH IS WAITING
          </div>

          <Link
            href={rejoinHref}
            style={{
              display: 'block', textAlign: 'center',
              background: 'var(--alarm)', padding: '16px 20px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
              color: 'white', textDecoration: 'none',
              letterSpacing: '-0.01em', textTransform: 'uppercase',
            }}
          >
            REJOIN MATCH →
          </Link>
        </div>
      </div>
    </>
  )
}
