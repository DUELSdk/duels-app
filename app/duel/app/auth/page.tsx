'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { s } from '@/lib/styles'
import { signIn, signUp, hasProfile, signInAsGuest } from '@/lib/auth'
import { getStatsStrip, getLiveMatchCount } from '@/lib/mock-data'

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function AuthPage() {
  const stats  = getStatsStrip()
  const counts = getLiveMatchCount()
  const router = useRouter()

  const [mode, setMode]       = useState<'signin' | 'signup'>('signup')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailOk    = validateEmail(email)
  const passwordOk = password.length >= 8
  const canSubmit  = emailOk && passwordOk && !loading

  async function handleGuest() {
    setLoading(true)
    setError(null)
    const { error: err } = await signInAsGuest()
    if (err) { setError(err.message.toUpperCase()); setLoading(false); return }
    router.replace('/auth/onboarding')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)

    if (mode === 'signup') {
      const { error: err } = await signUp(email, password)
      if (err) { setError(err.message.toUpperCase()); setLoading(false); return }
      // After signup: if email confirmation disabled in Supabase → session exists → check profile
      const hasPro = await hasProfile()
      router.replace(hasPro ? '/' : '/auth/onboarding')
    } else {
      const { error: err } = await signIn(email, password)
      if (err) { setError(err.message.toUpperCase()); setLoading(false); return }
      const hasPro = await hasProfile()
      router.replace(hasPro ? '/' : '/auth/onboarding')
    }
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Stats strip */}
      <div style={{ background: 'var(--ink)', color: 'var(--bone-on-dark)', padding: '6px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
          TODAY&apos;S BIGGEST POT <span style={{ color: 'var(--bone-on-dark)', fontWeight: 600, marginLeft: 4 }}>{stats.biggestPotAmount} KR</span>
        </span>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)' }}>
          {counts.settledToday.toLocaleString('da-DK')} SETTLED TODAY
        </span>
      </div>

      {/* Nav */}
      <div style={{ borderBottom: '1px solid var(--rule-soft)', padding: '14px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bone)' }}>
        <Link href="/" style={{ ...s.display(18), letterSpacing: '-0.01em', textDecoration: 'none', color: 'var(--ink)' }}>
          DUELS.
        </Link>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>TEST MODE &nbsp;·&nbsp; NO REAL MONEY</span>
      </div>

      {/* Split layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        {/* Left */}
        <div style={{ padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...s.mono, fontSize: 11, color: 'var(--alarm)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
              {counts.live} MATCHES IN PROGRESS
            </div>
            <h1 style={{ ...s.display(100), lineHeight: 0.84, marginBottom: 40 }}>
              {mode === 'signup' ? 'CREATE\nACCOUNT.' : 'SIGN IN.'}
            </h1>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.4, maxWidth: 440, color: 'var(--ink-soft)' }}>
              {mode === 'signup'
                ? 'PICK AN EMAIL AND PASSWORD. YOU GET 5.000 KR PLAY MONEY ON YOUR FIRST LOGIN.'
                : 'WELCOME BACK. ENTER YOUR CREDENTIALS.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 40, paddingTop: 40, borderTop: '1px solid var(--rule-soft)' }}>
            {(mode === 'signup'
              ? [{ label: '5.000 KR', sub: 'PLAY MONEY' }, { label: 'NO MITID', sub: 'TEST MODE' }, { label: 'SKILL ONLY', sub: 'NO HOUSE' }]
              : [{ label: 'REAL LOOP', sub: 'FULL GAME' }, { label: 'NO MITID', sub: 'TEST MODE' }, { label: 'SKILL ONLY', sub: 'NO HOUSE' }]
            ).map(b => (
              <div key={b.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{b.label}</div>
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: 'var(--ink)', padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', marginBottom: 40, borderBottom: '1px solid rgba(240,237,228,0.12)' }}>
            {(['signup', 'signin'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null) }}
                style={{
                  ...s.mono, fontSize: 10, letterSpacing: '0.12em',
                  padding: '10px 0',
                  marginRight: 32,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: mode === m ? 'var(--bone-on-dark)' : 'var(--bone-ghost)',
                  borderBottom: mode === m ? '2px solid var(--alarm)' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {m === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Email */}
            <div>
              <label style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', display: 'block', marginBottom: 10 }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null) }}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${email && !emailOk ? 'var(--alarm)' : emailOk ? 'var(--money)' : 'rgba(240,237,228,0.25)'}`,
                  color: 'var(--bone-on-dark)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 16,
                  padding: '8px 0',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', display: 'block', marginBottom: 10 }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null) }}
                placeholder="Min. 8 characters"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${password && !passwordOk ? 'var(--alarm)' : passwordOk ? 'var(--money)' : 'rgba(240,237,228,0.25)'}`,
                  color: 'var(--bone-on-dark)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 16,
                  padding: '8px 0',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {mode === 'signup' && (
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginTop: 6 }}>
                  MINIMUM 8 CHARACTERS
                </div>
              )}
            </div>

            {error && (
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)' }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                marginTop: 12,
                background: canSubmit ? 'var(--bone)' : 'rgba(240,237,228,0.15)',
                color: canSubmit ? 'var(--ink)' : 'rgba(240,237,228,0.3)',
                border: 'none',
                padding: '20px 32px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700, fontSize: 18,
                textTransform: 'uppercase', letterSpacing: '0.02em',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {loading
                ? (mode === 'signup' ? 'CREATING…' : 'SIGNING IN…')
                : (mode === 'signup' ? 'CREATE ACCOUNT →' : 'SIGN IN →')}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(240,237,228,0.12)' }}>
            <button
              onClick={handleGuest}
              disabled={loading}
              style={{
                width: '100%',
                background: 'transparent',
                color: 'rgba(240,237,228,0.5)',
                border: '1px solid rgba(240,237,228,0.2)',
                padding: '14px 32px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600, fontSize: 14,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              PLAY AS GUEST — NO ACCOUNT
            </button>
            <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.3)', textAlign: 'center', marginTop: 8 }}>
              TEST MODE · 5.000 KR PLAY MONEY · SESSION ONLY
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'var(--ink)', padding: '14px 56px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)' }}>
          SPILLELOVEN-EXEMPT &nbsp;·&nbsp; SKILL-BASED 1V1 ONLY
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
