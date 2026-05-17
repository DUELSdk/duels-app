'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { adjustBalance, addTransaction, getBalance } from '@/lib/balance'
import { Suspense } from 'react'

function SuccessContent() {
  const params    = useSearchParams()
  const amount    = parseInt(params.get('amount') ?? '0')
  const credited  = useRef(false)

  useEffect(() => {
    if (credited.current || amount <= 0) return
    credited.current = true
    adjustBalance(amount)
    addTransaction(`Deposit via payment provider`, amount)
  }, [amount])

  const newBalance = typeof window !== 'undefined' ? getBalance() : 0

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      <div style={{
        flex: 1, maxWidth: 560, margin: '0 auto', width: '100%',
        padding: '80px 24px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>

        {/* Success indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          ...s.mono, fontSize: 11, color: 'var(--money)', fontWeight: 700,
          letterSpacing: '0.14em', marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
          DEPOSIT CONFIRMED
        </div>

        {/* Amount */}
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 96,
          letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: 'var(--money)',
          marginBottom: 8,
        }}>
          +{amount.toLocaleString('da-DK')}
        </div>
        <div style={{ ...s.mono, fontSize: 16, color: 'var(--ink-faint)', marginBottom: 48 }}>KR ADDED TO YOUR BALANCE</div>

        {/* New balance */}
        <div style={{
          border: '1.5px solid var(--ink)', padding: '24px 48px',
          textAlign: 'center', marginBottom: 48, width: '100%', boxSizing: 'border-box',
        }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>NEW BALANCE</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48,
            letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
          }}>
            {newBalance.toLocaleString('da-DK')} <span style={{ fontSize: 24, fontWeight: 400, color: 'var(--ink-faint)' }}>KR</span>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <Link href="/play" style={{
            display: 'block', textAlign: 'center',
            background: 'var(--ink)', color: 'var(--bone)',
            padding: '18px 32px',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            textTransform: 'uppercase', letterSpacing: '0.02em',
            textDecoration: 'none',
          }}>
            PLAY NOW →
          </Link>
          <Link href="/wallet" style={{
            display: 'block', textAlign: 'center',
            border: '1.5px solid rgba(13,13,13,0.2)',
            padding: '14px 32px',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
            textTransform: 'uppercase', letterSpacing: '0.02em',
            textDecoration: 'none', color: 'var(--ink-faint)',
          }}>
            BACK TO WALLET
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DepositSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
