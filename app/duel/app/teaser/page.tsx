'use client'

import { useState, useEffect, useRef } from 'react'

const REVEAL_DATE: string | null = null
const LAUNCH_POT_KR   = 25000
const PLAYERS_IN_ROOM = 847

function fmt(n: number) { return n.toLocaleString('da-DK') }

const D = {
  bg:     '#080807',
  bone:   '#f0ede4',
  soft:   'rgba(240,237,228,0.45)',
  ghost:  'rgba(240,237,228,0.18)',
  faint:  'rgba(240,237,228,0.10)',
  alarm:  '#ef0000',
  mono:   { fontFamily: 'var(--font-mono)', letterSpacing: '0.10em', textTransform: 'uppercase' } as React.CSSProperties,
  disp:   (sz: string): React.CSSProperties => ({
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: sz, letterSpacing: '-0.04em', lineHeight: 0.85,
    textTransform: 'uppercase', fontVariantNumeric: 'tabular-nums',
  }),
}

function RedactedPot() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(5px, 0.9vw, 14px)' }}>
      {[1, 2, '.', 3, 4, 5].map((c, i) => {
        if (c === '.') return (
          <div key={i} style={{
            width: 'clamp(10px, 1.6vw, 22px)', height: 'clamp(10px, 1.6vw, 22px)',
            background: D.bone, flexShrink: 0,
            marginBottom: 'clamp(12px, 2vw, 28px)', opacity: 0.25,
          }} />
        )
        return (
          <div key={i} style={{
            width: 'clamp(48px, 9.5vw, 130px)',
            height: 'clamp(76px, 16.5vw, 220px)',
            background: D.bone, flexShrink: 0, opacity: 0.15,
          }} />
        )
      })}
    </div>
  )
}

export default function TeaserPage() {
  const isRevealed = REVEAL_DATE !== null
  const [email, setEmail]           = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [displayPot, setDisplayPot] = useState(0)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRevealed) return
    const duration = 2400
    const delay = setTimeout(() => {
      const start = Date.now()
      const tick = () => {
        const t = Math.min((Date.now() - start) / duration, 1)
        setDisplayPot(Math.round((1 - Math.pow(1 - t, 3)) * LAUNCH_POT_KR))
        if (t < 1) animRef.current = requestAnimationFrame(tick)
      }
      animRef.current = requestAnimationFrame(tick)
    }, 400)
    return () => {
      clearTimeout(delay)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isRevealed])

  return (
    <>
      <style>{`
        @keyframes pot-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pot-reveal  { animation: pot-in  0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up     { animation: fade-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .notify-btn:hover { background: #c40000 !important; }
        input[type='email']:focus { border-color: rgba(240,237,228,0.4) !important; outline: none; }
      `}</style>

      <div style={{
        background: D.bg, color: D.bone,
        minHeight: '100dvh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px)',
        textAlign: 'center',
        position: 'relative',
      }}>

        {/* Corner brand */}
        <div style={{
          position: 'absolute', top: 22, left: 32,
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(18px, 2.2vw, 28px)',
          letterSpacing: '-0.03em', textTransform: 'uppercase',
          color: 'rgba(240,237,228,0.55)',
        }}>
          DUELS
        </div>

        {/* Corner status */}
        <div style={{
          position: 'absolute', top: 24, right: 32,
          ...D.mono, fontSize: 9,
          color: isRevealed ? D.alarm : D.ghost,
          fontWeight: isRevealed ? 700 : 400,
        }}>
          {isRevealed && REVEAL_DATE
            ? `● ${new Date(REVEAL_DATE).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}`
            : '● DATE UNKNOWN'}
        </div>

        {/* Event tag */}
        <div style={{ ...D.mono, fontSize: 10, color: D.ghost, marginBottom: 'clamp(28px, 4vw, 52px)' }}>
          INVITE ONLY · SKILL ONLY · ONE NIGHT
        </div>

        {/* POT */}
        <div style={{ marginBottom: 'clamp(16px, 2.5vw, 32px)' }}>
          {isRevealed ? (
            <div className="pot-reveal" style={{ ...D.disp('clamp(80px, 17vw, 240px)'), color: D.alarm }}>
              {fmt(displayPot)} KR
            </div>
          ) : (
            <RedactedPot />
          )}
        </div>

        <div style={{ ...D.mono, fontSize: 10, color: D.soft, marginBottom: 'clamp(20px, 3.5vw, 44px)' }}>
          {isRevealed ? 'THE PURSE.' : 'PURSE UNKNOWN.'}
        </div>

        {/* Divider */}
        <div style={{ width: 'clamp(120px, 20vw, 280px)', height: 1, background: D.faint, marginBottom: 'clamp(20px, 3.5vw, 44px)' }} />

        {/* PLAYERS */}
        <div className="fade-up">
          <div style={{ ...D.disp('clamp(52px, 9vw, 120px)'), color: D.bone, marginBottom: 12 }}>
            {fmt(PLAYERS_IN_ROOM)}
          </div>
          <div style={{ ...D.mono, fontSize: 10, color: D.soft }}>
            ALREADY WAITING
          </div>
        </div>

        {/* Email */}
        <div style={{ marginTop: 'clamp(36px, 5.5vw, 64px)', width: '100%', maxWidth: 440 }}>
          {submitted ? (
            <div style={{ ...D.mono, fontSize: 11, color: D.soft, padding: '14px 0', borderTop: `1px solid ${D.faint}`, borderBottom: `1px solid ${D.faint}` }}>
              ✓ YOU&apos;RE IN.
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }} style={{ display: 'flex' }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="din@email.dk" required
                style={{
                  flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12,
                  padding: '14px 16px',
                  background: 'transparent', color: D.bone,
                  border: `1px solid ${D.faint}`, borderRight: 'none',
                  transition: 'border-color 0.12s',
                }}
              />
              <button type="submit" className="notify-btn" style={{
                ...D.mono, fontSize: 11, fontWeight: 700,
                padding: '14px 22px',
                background: D.alarm, color: '#fff',
                border: `1px solid ${D.alarm}`,
                cursor: 'pointer', transition: 'background 0.12s',
              }}>
                I&apos;M IN →
              </button>
            </form>
          )}
          <div style={{ ...D.mono, fontSize: 9, color: D.ghost, marginTop: 10 }}>
            DATE DROPS HERE FIRST.
          </div>
        </div>

      </div>
    </>
  )
}
