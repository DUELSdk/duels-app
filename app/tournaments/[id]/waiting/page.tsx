'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { getTournamentDetail } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

export default function TournamentWaitingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = getTournamentDetail(id)
  if (!t) notFound()

  const [dots, setDots] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => clearInterval(iv)
  }, [])

  function handleInvite() {
    const url = `${window.location.origin}/tournaments/${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const seatsLeft = t.seatsTotal - t.seatsFilled
  const dotStr = '.'.repeat(dots)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="tournaments" />

      <main style={{ maxWidth: 560, margin: '0 auto', padding: `80px ${s.px}`, textAlign: 'center' }}>

        {/* Live pulse */}
        <div style={{ ...s.mono, fontSize: 11, color: 'var(--alarm)', letterSpacing: '0.18em', fontWeight: 700, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block', animation: 'pulse 1.2s ease-in-out infinite' }} />
          YOU ARE IN
        </div>

        <h1 style={{ ...s.display(72), lineHeight: 0.88, marginBottom: 16 }}>{t.name}.</h1>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 48 }}>
          {t.game} · {t.fmt} · STARTS {t.start}
        </div>

        {/* Seat counter */}
        <div style={{ border: '1.5px solid var(--ink)', padding: '40px 32px', marginBottom: 32 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>WAITING FOR BRACKET TO FILL</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 96, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {seatsLeft}
          </div>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginTop: 8 }}>
            SEAT{seatsLeft !== 1 ? 'S' : ''} REMAINING OF {t.seatsTotal}
          </div>

          {/* Seat grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 28 }}>
            {Array.from({ length: t.seatsTotal }).map((_, i) => (
              <div key={i} style={{
                width: 20, height: 20,
                background: i < t.seatsFilled ? 'var(--ink)' : 'transparent',
                border: '1.5px solid var(--ink)',
              }} />
            ))}
          </div>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 12, letterSpacing: '0.10em' }}>
            ■ = FILLED
          </div>
        </div>

        {/* Status */}
        <div style={{ ...s.mono, fontSize: 12, color: 'var(--ink-soft)', letterSpacing: '0.06em', marginBottom: 8 }}>
          WAITING FOR PLAYERS{dotStr}
        </div>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 48 }}>
          BRACKET POSTS WHEN LAST SEAT FILLS · YOUR MATCH STARTS AT {t.start}
        </div>

        {/* Prize reminder */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, paddingTop: 32, borderTop: '1px solid var(--rule-soft)' }}>
          {[
            { label: 'ENTRY PAID',  value: `${t.fee} KR` },
            { label: '1ST PLACE',   value: `${t.pool.toLocaleString('da-DK')} KR`, color: 'var(--money)' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: item.color ?? 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Invite */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <button
            onClick={handleInvite}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              background: copied ? 'var(--money)' : 'var(--ink)',
              color: '#fff',
              border: 'none', cursor: 'pointer',
              padding: '16px 32px',
              transition: 'background 0.15s',
              width: '100%',
            }}
          >
            {copied ? 'LINK COPIED ✓' : `INVITE PLAYERS — ${seatsLeft} SEAT${seatsLeft !== 1 ? 'S' : ''} LEFT`}
          </button>
          <Link href={`/tournaments/${id}`} style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none' }}>
            VIEW TOURNAMENT →
          </Link>
        </div>
      </main>
    </div>
  )
}
