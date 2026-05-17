'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { setAuth } from '@/lib/auth'
import { s } from '@/lib/styles'

const BANNED_NAMES = new Set(['admin', 'duels', 'support', 'staff', 'moderator', 'mod'])

function validateUsername(v: string): string | null {
  if (v.length < 3)  return 'MIN 3 CHARACTERS'
  if (v.length > 16) return 'MAX 16 CHARACTERS'
  if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'LETTERS, NUMBERS AND _ ONLY'
  if (BANNED_NAMES.has(v.toLowerCase())) return 'NAME NOT AVAILABLE'
  return null
}

export default function OnboardingPage() {
  const router = useRouter()
  const [username, setUsername]   = useState('')
  const [checked18, setChecked18] = useState(false)
  const [checkedTC, setCheckedTC] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)

  const nameError = username.length > 0 ? validateUsername(username) : null
  const canSubmit = !nameError && username.length >= 3 && checked18 && checkedTC && !saving

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validateUsername(username)
    if (err) { setError(err); return }
    setSaving(true)
    // Simulate a brief server-side name-check delay
    setTimeout(() => {
      setAuth({ username: username.toUpperCase(), joinedAt: Date.now() })
      router.replace('/')
    }, 800)
  }

  return (
    <div style={{
      background: 'var(--bone)', color: 'var(--ink)',
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '14px 40px',
        borderBottom: '1px solid var(--rule-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ ...s.display(20), textDecoration: 'none', color: 'var(--ink)' }}>
          DUELS.
        </Link>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>18+ · PLAY WITHIN MEANS</span>
      </div>

      {/* Split layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        {/* Left — context */}
        <div style={{ padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...s.mono, fontSize: 11, color: 'var(--money)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
              IDENTITY VERIFIED
            </div>
            <h1 style={{ ...s.display(88), lineHeight: 0.84, marginBottom: 32 }}>
              ONE LAST<br />THING.
            </h1>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.4,
              maxWidth: 400, color: 'var(--ink-soft)',
            }}>
              PICK A HANDLE. THIS IS HOW YOUR OPPONENTS WILL KNOW YOU ON THE BOARD.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--rule-soft)', paddingTop: 32 }}>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', lineHeight: 1.9 }}>
              YOUR HANDLE IS PUBLIC. YOUR REAL NAME AND CPR STAY PRIVATE. THEY NEVER LEAVE THE MITID SYSTEM.
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: 'var(--ink)', padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Username field */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', display: 'block', marginBottom: 10 }}>
                YOUR HANDLE
              </label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(null) }}
                placeholder="NOVASTRIKE"
                maxLength={16}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${nameError ? 'var(--alarm)' : username.length >= 3 && !nameError ? 'var(--money)' : 'rgba(240,237,228,0.25)'}`,
                  color: 'var(--bone-on-dark)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 40,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  padding: '8px 0',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{
                ...s.mono, fontSize: 9,
                color: nameError ? 'var(--alarm)' : 'var(--bone-ghost)',
                marginTop: 8, minHeight: 16,
              }}>
                {nameError ?? `${username.length}/16 · LETTERS, NUMBERS, UNDERSCORE`}
              </div>
              {error && (
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', marginTop: 4 }}>{error}</div>
              )}
            </div>

            {/* Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              {[
                {
                  id: 'age',
                  checked: checked18,
                  onChange: () => setChecked18(v => !v),
                  label: 'I CONFIRM I AM 18 OR OLDER',
                },
                {
                  id: 'tc',
                  checked: checkedTC,
                  onChange: () => setCheckedTC(v => !v),
                  label: 'I ACCEPT THE TERMS AND CONDITIONS',
                },
              ].map(item => (
                <label key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                }}>
                  <div
                    onClick={item.onChange}
                    style={{
                      width: 18, height: 18, flexShrink: 0,
                      border: `1.5px solid ${item.checked ? 'var(--money)' : 'rgba(240,237,228,0.3)'}`,
                      background: item.checked ? 'var(--money)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {item.checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#0d0d0d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', letterSpacing: '0.10em' }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
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
              {saving ? 'CREATING ACCOUNT…' : 'ENTER THE ARENA →'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'var(--ink)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)' }}>
          SPILLELOVEN-EXEMPT · SKILL-BASED 1V1 ONLY · CVR 99999999
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['SUPPORT', 'TERMS', 'STOPSPILLET.DK'].map(l => (
            <Link key={l} href="#" style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
