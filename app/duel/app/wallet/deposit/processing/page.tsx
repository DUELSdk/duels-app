'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { s } from '@/lib/styles'
import { Suspense } from 'react'

function ProcessingContent() {
  const router       = useRouter()
  const params       = useSearchParams()
  const amount       = parseInt(params.get('amount') ?? '0')
  const method       = params.get('method') ?? 'mobilepay'
  const isMobilePay  = method === 'mobilepay'

  const [dots, setDots]         = useState(0)
  const [phase, setPhase]       = useState<'waiting' | 'confirmed' | 'cancelled'>('waiting')
  const cancelledRef            = useRef(false)

  useEffect(() => {
    const iv = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    // Auto-confirm after mock delay (simulates user completing payment in app/bank)
    const t = setTimeout(() => {
      if (!cancelledRef.current) {
        setPhase('confirmed')
        setTimeout(() => {
          router.replace(`/wallet/deposit/success?amount=${amount}`)
        }, 1200)
      }
    }, 4000)
    return () => clearTimeout(t)
  }, [router, amount])

  function handleCancel() {
    cancelledRef.current = true
    setPhase('cancelled')
    setTimeout(() => router.replace('/wallet/deposit/failed'), 600)
  }

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
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)' }}>
          SECURE PAYMENT SESSION
        </span>
      </div>

      {/* Center */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 40px',
      }}>

        {/* Provider wordmark */}
        <div style={{ ...s.display(56), marginBottom: 16, color: 'var(--bone-faint)' }}>
          {isMobilePay ? 'MOBILEPAY.' : 'TRUSTLY.'}
        </div>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 64 }}>
          {isMobilePay ? 'VIPPS MOBILEPAY A/S' : 'TRUSTLY GROUP AB'}
        </div>

        {/* Amount display */}
        <div style={{
          border: '1.5px solid rgba(240,237,228,0.15)',
          padding: '40px 64px', textAlign: 'center', marginBottom: 48,
        }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 12 }}>DEPOSIT AMOUNT</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72,
            letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>
            {amount.toLocaleString('da-DK')}
          </div>
          <div style={{ ...s.mono, fontSize: 14, color: 'var(--bone-faint)', marginTop: 8 }}>KR</div>
        </div>

        {/* Status message */}
        {phase === 'waiting' && (
          <>
            <div style={{
              ...s.mono, fontSize: 13, color: 'var(--bone-on-dark)',
              letterSpacing: '0.14em', marginBottom: 12, fontWeight: 700,
            }}>
              {isMobilePay
                ? `CHECK YOUR MOBILEPAY APP${'.'.repeat(dots)}`
                : `CONNECTING TO YOUR BANK${'.'.repeat(dots)}`
              }
            </div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 64 }}>
              {isMobilePay
                ? 'A PAYMENT REQUEST HAS BEEN SENT TO YOUR PHONE'
                : 'YOU WILL BE REDIRECTED TO YOUR BANK SHORTLY'
              }
            </div>
            <button
              onClick={handleCancel}
              style={{
                background: 'none',
                border: '1px solid rgba(240,237,228,0.2)',
                color: 'var(--bone-faint)',
                padding: '12px 28px',
                ...s.mono, fontSize: 10, letterSpacing: '0.12em',
                cursor: 'pointer',
              }}
            >
              CANCEL PAYMENT
            </button>
          </>
        )}

        {phase === 'confirmed' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
            <span style={{ ...s.mono, fontSize: 13, color: 'var(--money)', fontWeight: 700, letterSpacing: '0.14em' }}>
              PAYMENT CONFIRMED
            </span>
          </div>
        )}

        {phase === 'cancelled' && (
          <div style={{ ...s.mono, fontSize: 13, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.14em' }}>
            CANCELLING…
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 40px',
        borderTop: '1px solid rgba(240,237,228,0.08)',
      }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--bone-ghost)' }}>
          SSL ENCRYPTED · DO NOT CLOSE THIS WINDOW
        </span>
      </div>
    </div>
  )
}

export default function DepositProcessingPage() {
  return (
    <Suspense>
      <ProcessingContent />
    </Suspense>
  )
}
