'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { adjustBalance, addTransaction } from '@/lib/balance'
import { Suspense } from 'react'

function WithdrawSuccessContent() {
  const params   = useSearchParams()
  const amount   = parseInt(params.get('amount') ?? '0')
  const debited  = useRef(false)

  useEffect(() => {
    if (debited.current || amount <= 0) return
    debited.current = true
    adjustBalance(-amount)
    addTransaction(`Withdrawal to bank account`, -amount)
  }, [amount])

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      <div style={{
        flex: 1, maxWidth: 560, margin: '0 auto', width: '100%',
        padding: '80px 24px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>

        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          ...s.mono, fontSize: 11, color: 'var(--money)', fontWeight: 700,
          letterSpacing: '0.14em', marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
          WITHDRAWAL INITIATED
        </div>

        {/* Amount */}
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 96,
          letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          marginBottom: 8,
        }}>
          {amount.toLocaleString('da-DK')}
        </div>
        <div style={{ ...s.mono, fontSize: 16, color: 'var(--ink-faint)', marginBottom: 48 }}>KR ON THE WAY</div>

        {/* Info card */}
        <div style={{
          border: '1.5px solid rgba(13,13,13,0.2)',
          padding: '28px 40px', width: '100%', boxSizing: 'border-box',
          textAlign: 'left', marginBottom: 48,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {[
            { label: 'ARRIVES',   value: '1–2 BUSINESS DAYS' },
            { label: 'METHOD',    value: 'TRUSTLY BANK TRANSFER' },
            { label: 'VERIFIED',  value: 'MITID CONFIRMED' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{row.label}</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                textTransform: 'uppercase', letterSpacing: '-0.01em',
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <Link href="/wallet" style={{
            display: 'block', textAlign: 'center',
            background: 'var(--ink)', color: 'var(--bone)',
            padding: '18px 32px',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            textTransform: 'uppercase', letterSpacing: '0.02em',
            textDecoration: 'none',
          }}>
            BACK TO WALLET
          </Link>
          <Link href="/play" style={{
            display: 'block', textAlign: 'center',
            border: '1.5px solid rgba(13,13,13,0.2)',
            padding: '14px 32px',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
            textTransform: 'uppercase', letterSpacing: '0.02em',
            textDecoration: 'none', color: 'var(--ink-faint)',
          }}>
            PLAY ANOTHER MATCH
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function WithdrawSuccessPage() {
  return (
    <Suspense>
      <WithdrawSuccessContent />
    </Suspense>
  )
}
