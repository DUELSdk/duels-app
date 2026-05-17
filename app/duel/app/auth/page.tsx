'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { s } from '@/lib/styles'
import { getStatsStrip, getLiveMatchCount } from '@/lib/mock-data'

const STATS_STRIP_STYLE: React.CSSProperties = {
  background: 'var(--ink)',
  color: 'var(--bone-on-dark)',
  padding: '6px 56px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const MINIMAL_NAV_STYLE: React.CSSProperties = {
  borderBottom: '1px solid var(--rule-soft)',
  padding: '14px 56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'var(--bone)',
}

export default function AuthPage() {
  const stats  = getStatsStrip()
  const counts = getLiveMatchCount()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleMitID() {
    if (loading) return
    setLoading(true)
    setTimeout(() => router.push('/auth/callback'), 1400)
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Stats strip */}
      <div style={STATS_STRIP_STYLE}>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
          TODAY&apos;S BIGGEST POT <span style={{ color: 'var(--bone-on-dark)', fontWeight: 600 }}>{stats.biggestPotAmount} KR</span> — {stats.biggestPotWho}
        </span>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)' }}>
          {counts.settledToday.toLocaleString('da-DK')} SETTLED TODAY &nbsp;·&nbsp; {stats.totalPaidToday} KR PAID
        </span>
      </div>

      {/* Minimal nav */}
      <div style={MINIMAL_NAV_STYLE}>
        <Link href="/" style={{ ...s.display(18), letterSpacing: '-0.01em', textDecoration: 'none', color: 'var(--ink)' }}>
          DUELS.
        </Link>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>18+ &nbsp;·&nbsp; PLAY WITHIN MEANS</span>
      </div>

      {/* Split layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        {/* Left — bone */}
        <div style={{ padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...s.mono, fontSize: 11, color: 'var(--alarm)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
              {counts.live} MATCHES IN PROGRESS
            </div>

            <h1 style={{ ...s.display(120), lineHeight: 0.84, marginBottom: 40 }}>
              SIGN IN.
            </h1>

            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.3, maxWidth: 480, color: 'var(--ink)' }}>
              ONE DOOR. VERIFIED BY MITID.{' '}
              <span style={{ color: 'var(--ink-soft)' }}>
                NO USERNAMES TO REMEMBER. NO PASSWORDS TO FORGET. THE STAKES ARE REAL — SO IS THE CHECK.
              </span>
            </p>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 40, paddingTop: 40, borderTop: '1px solid var(--rule-soft)' }}>
            {[
              { label: 'INSTANT', sub: 'VERIFICATION' },
              { label: '18+', sub: 'GATE' },
              { label: 'SKILL ONLY', sub: 'NO HOUSE' },
            ].map(b => (
              <div key={b.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{b.label}</div>
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — black panel */}
        <div style={{ background: 'var(--ink)', padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', marginBottom: 20 }}>ONE WAY IN</div>

            {/* MITID. wordmark */}
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 28 }}>
              <span style={{ color: 'var(--bone-on-dark)' }}>MIT</span>
              <span style={{ color: 'var(--alarm)' }}>ID.</span>
            </div>

            <p style={{ ...s.mono, fontSize: 11, color: 'var(--bone-faint)', lineHeight: 1.7, maxWidth: 380 }}>
              REQUIRED BY DANISH LAW FOR REAL-MONEY SKILL GAMES. YOUR CPR STAYS WITH THE AUTH PROVIDER — WE NEVER SEE IT.
            </p>
          </div>

          <div>
            <button
              onClick={handleMitID}
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--bone)',
                color: 'var(--ink)',
                border: 'none',
                padding: '22px 32px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: 16,
              }}
            >
              {loading ? 'CONNECTING TO MITID...' : 'CONTINUE WITH MITID →'}
            </button>

            <p style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', textAlign: 'center', lineHeight: 1.7 }}>
              BY CONTINUING YOU AGREE TO THE TERMS AND CONFIRM YOU ARE 18 OR OVER.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'var(--ink)', padding: '14px 56px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)' }}>
          SPILLELOVEN-EXEMPT &nbsp;·&nbsp; SKILL-BASED 1V1 ONLY &nbsp;·&nbsp; CVR 99999999
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['SUPPORT', 'RULES', 'STOPSPILLET.DK'].map(l => (
            <Link key={l} href="#" style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
