'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { s } from '@/lib/styles'
import { signIn, signUp, hasProfile } from '@/lib/auth'

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function AuthPage() {
  const router = useRouter()

  const [mode, setMode]       = useState<'signin' | 'signup'>('signup')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailOk    = validateEmail(email)
  const passwordOk = password.length >= 8
  const canSubmit  = emailOk && passwordOk && !loading

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

      {/* Nav */}
      <div style={{ borderBottom: '1px solid var(--rule-soft)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bone)' }}>
        <Link href="/" style={{ ...s.display(18), letterSpacing: '-0.01em', textDecoration: 'none', color: 'var(--ink)' }}>
          DUELS.
        </Link>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>TEST MODE · NO REAL MONEY</span>
      </div>

      {/* Layout — stacked on mobile, split on desktop */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Form — full width, shown first on mobile */}
        <div style={{ background: 'var(--ink)', padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

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
