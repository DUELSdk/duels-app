'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

export default function AuthPage() {
  const [tab, setTab] = useState<'signin' | 'register'>('signin')

  const tabStyle = (active: boolean): React.CSSProperties => ({
    ...s.mono,
    fontSize: 11,
    padding: '10px 24px',
    border: 'none',
    borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
    background: 'transparent',
    color: active ? 'var(--ink)' : 'var(--ink-faint)',
    cursor: 'pointer',
  })

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `56px ${s.px}` }}>
        <div style={{ width: '100%', maxWidth: 460 }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>DUEL · ACCESS</div>
            <h1 style={{ ...s.display(64), lineHeight: 0.85 }}>
              {tab === 'signin' ? 'SIGN IN.' : 'JOIN DUEL.'}
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--rule-soft)', marginBottom: 40 }}>
            <button style={tabStyle(tab === 'signin')} onClick={() => setTab('signin')}>RETURNING PLAYER</button>
            <button style={tabStyle(tab === 'register')} onClick={() => setTab('register')}>NEW PLAYER</button>
          </div>

          {tab === 'signin' ? (
            <SignInForm />
          ) : (
            <RegisterForm />
          )}

          <p style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 32, lineHeight: 1.8 }}>
            DUEL IS A SKILL COMPETITION PLATFORM. 18+ ONLY. IDENTITY VERIFIED VIA MITID.
            DANISH RESIDENTS ONLY. BY CONTINUING YOU AGREE TO OUR{' '}
            <Link href="/terms" style={{ color: 'var(--ink-soft)', textDecoration: 'underline' }}>TERMS</Link>{' '}
            AND{' '}
            <Link href="/privacy" style={{ color: 'var(--ink-soft)', textDecoration: 'underline' }}>PRIVACY POLICY</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function SignInForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>HANDLE OR EMAIL</div>
        <input
          type="text"
          placeholder="your handle"
          style={{
            width: '100%', padding: '12px 16px',
            border: '1.5px solid var(--ink)', background: 'var(--bone)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ height: 1, background: 'var(--rule-soft)', margin: '8px 0' }} />

      {/* MitID primary CTA */}
      <MitIDButton label="SIGN IN WITH MitID →" />

      <p style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textAlign: 'center' }}>
        MitID verifies your identity. Required for all accounts.
      </p>
    </div>
  )
}

function RegisterForm() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ padding: '16px 20px', background: 'var(--bone-2)', border: '1px solid var(--rule-soft)' }}>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 6 }}>HOW IT WORKS</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          MitID verifies your age and identity. Your real name is never shown to opponents — only your handle.
          One account per person. Accounts are non-transferable.
        </div>
      </div>

      <div>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>CHOOSE A HANDLE</div>
        <input
          type="text"
          placeholder="e.g. SANDSTORM"
          maxLength={18}
          style={{
            width: '100%', padding: '12px 16px',
            border: '1.5px solid var(--ink)', background: 'var(--bone)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
            textTransform: 'uppercase',
          }}
        />
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', marginTop: 6 }}>
          MAX 18 CHARACTERS · VISIBLE TO OPPONENTS · CANNOT BE CHANGED
        </div>
      </div>

      {/* Age declaration */}
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--ink)', flexShrink: 0 }}
        />
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          I am 18 years or older and a resident of Denmark. I understand DUEL is a skill competition platform and I accept the Terms of Service.
        </span>
      </label>

      <div style={{ height: 1, background: 'var(--rule-soft)' }} />

      <MitIDButton label="CREATE ACCOUNT WITH MitID →" disabled={!agreed} />

      <p style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textAlign: 'center' }}>
        MitID confirms you are 18+ and a Danish resident. Required.
      </p>
    </div>
  )
}

function MitIDButton({ label, disabled }: { label: string; disabled?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleClick() {
    if (disabled || loading) return
    setLoading(true)
    setTimeout(() => router.push('/'), 2200)
  }

  const isDisabled = disabled || loading
  return (
    <div>
      <button
        disabled={isDisabled}
        onClick={handleClick}
        style={{
          width: '100%',
          background: isDisabled ? 'var(--ink-ghost)' : 'var(--ink)',
          color: 'var(--bone)',
          border: 'none',
          padding: '18px 24px',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <span style={{
          display: 'inline-block',
          width: 20, height: 20,
          border: '2px solid currentColor',
          borderRadius: '50%',
          flexShrink: 0,
          opacity: loading ? 0.4 : 1,
        }} />
        {loading ? 'CONNECTING TO MITID...' : label}
      </button>
      <div style={{
        padding: '8px 16px',
        background: isDisabled ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.05)',
        border: '1px solid var(--rule-soft)',
        borderTop: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>
          {loading ? 'REDIRECTING TO MITID — DO NOT CLOSE THIS PAGE' : 'MITID · DIGITAL IDENTITY · AGE VERIFIED · DANISH RESIDENTS'}
        </span>
      </div>
    </div>
  )
}
