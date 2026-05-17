'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { s } from '@/lib/styles'

type Phase = 'connecting' | 'verifying' | 'confirmed' | 'routing'

const PHASES: { phase: Phase; label: string; duration: number }[] = [
  { phase: 'connecting', label: 'CONNECTING TO MITID',    duration: 1200 },
  { phase: 'verifying',  label: 'VERIFYING IDENTITY',     duration: 1400 },
  { phase: 'confirmed',  label: 'IDENTITY CONFIRMED',     duration: 900  },
  { phase: 'routing',    label: 'LOADING YOUR ACCOUNT',   duration: 500  },
]

export default function AuthCallbackPage() {
  const router = useRouter()
  const [phaseIdx, setPhaseIdx] = useState(0)

  useEffect(() => {
    let idx = 0
    function next() {
      idx++
      if (idx < PHASES.length) {
        setPhaseIdx(idx)
        setTimeout(next, PHASES[idx].duration)
      } else {
        const user = getAuth()
        router.replace(user ? '/' : '/auth/onboarding')
      }
    }
    setTimeout(next, PHASES[0].duration)
  }, [router])

  const current = PHASES[phaseIdx]
  const done    = phaseIdx

  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--bone-on-dark)',
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '14px 40px',
        borderBottom: '1px solid rgba(240,237,228,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ ...s.display(20), textDecoration: 'none', color: 'var(--bone-on-dark)' }}>
          DUELS.
        </Link>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)' }}>SECURE SESSION</span>
      </div>

      {/* Center content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 40px',
      }}>
        {/* MitID wordmark */}
        <div style={{ ...s.display(48), marginBottom: 64, color: 'var(--bone-faint)' }}>
          MIT<span style={{ color: 'var(--alarm)' }}>ID.</span>
        </div>

        {/* Phase steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 360 }}>
          {PHASES.slice(0, -1).map((p, i) => {
            const isActive   = i === phaseIdx
            const isComplete = i < phaseIdx

            return (
              <div key={p.phase} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                opacity: i > phaseIdx ? 0.2 : 1,
                transition: 'opacity 0.3s',
              }}>
                {/* Status indicator */}
                <div style={{ width: 20, height: 20, flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isComplete ? (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--money)' }} />
                  ) : isActive ? (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'var(--alarm)',
                      animation: 'pulse 1s ease-in-out infinite',
                    }} />
                  ) : (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', border: '1px solid rgba(240,237,228,0.3)' }} />
                  )}
                </div>

                <span style={{
                  ...s.mono, fontSize: 11, letterSpacing: '0.14em', fontWeight: 700,
                  color: isComplete ? 'var(--money)' : isActive ? 'var(--bone-on-dark)' : 'var(--bone-faint)',
                }}>
                  {p.label}
                  {isComplete && <span style={{ marginLeft: 8, fontSize: 9, opacity: 0.7 }}>✓</span>}
                </span>
              </div>
            )
          })}
        </div>

        {/* CPR note */}
        <p style={{
          ...s.mono, fontSize: 9, color: 'var(--bone-ghost)',
          textAlign: 'center', lineHeight: 1.8, maxWidth: 320, marginTop: 64,
        }}>
          YOUR CPR IS VERIFIED BY MITID AND NEVER STORED BY DUELS.
        </p>
      </div>

      {/* Footer strip */}
      <div style={{
        padding: '12px 40px',
        borderTop: '1px solid rgba(240,237,228,0.08)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)' }}>
          SPILLELOVEN-EXEMPT · SKILL-BASED ONLY
        </span>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)' }}>
          SSL ENCRYPTED
        </span>
      </div>
    </div>
  )
}
