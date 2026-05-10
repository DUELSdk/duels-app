'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getBalance, adjustBalance, addTransaction } from '@/lib/balance'

const PRESETS = [100, 250, 500, 1000, 2000, 5000]

export default function DepositPage() {
  const [selected, setSelected] = useState<number | null>(500)
  const [custom, setCustom] = useState('')
  const [balance, setBalance] = useState(500)

  useEffect(() => { setBalance(getBalance()) }, [])

  const activeKr = custom ? parseInt(custom) || 0 : selected ?? 0

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      <main style={{ flex: 1, padding: `56px ${s.px}`, maxWidth: 760, width: '100%' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 40 }}>
          <Link href="/wallet" style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none' }}>WALLET</Link>
          <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>/</span>
          <span style={{ ...s.mono, fontSize: 10 }}>DEPOSIT</span>
        </div>

        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>ADD FUNDS</div>
        <h1 style={{ ...s.display(72), lineHeight: 0.85, marginBottom: 40 }}>DEPOSIT.</h1>

        {/* Amount grid */}
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 12 }}>SELECT AMOUNT</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 2 }}>
          {PRESETS.map(kr => {
            const isSelected = selected === kr && !custom
            return (
              <button
                key={kr}
                onClick={() => { setSelected(kr); setCustom('') }}
                style={{
                  border: isSelected ? '2px solid var(--ink)' : '1.5px solid var(--rule-soft)',
                  background: isSelected ? 'var(--ink)' : 'transparent',
                  color: isSelected ? 'var(--bone)' : 'var(--ink)',
                  padding: '20px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>
                  {kr.toLocaleString('da-DK')}
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 4 }}>KR</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Custom */}
        <div style={{ border: '1.5px dashed var(--rule-soft)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>CUSTOM AMOUNT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number" min={50} max={20000} placeholder="750"
              value={custom}
              onChange={e => { setCustom(e.target.value); setSelected(null) }}
              style={{
                width: 90, padding: '6px 10px',
                border: '1.5px solid var(--ink)', background: 'var(--bone)',
                fontFamily: 'var(--font-mono)', fontSize: 13,
                color: 'var(--ink)', outline: 'none',
              }}
            />
            <span style={{ ...s.mono, fontSize: 11 }}>KR</span>
          </div>
        </div>

        {/* Summary */}
        {activeKr > 0 && (
          <div style={{ border: '1.5px solid var(--ink)', padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>CURRENT BALANCE</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{balance.toLocaleString('da-DK')} KR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>DEPOSIT</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--money)' }}>
                +{activeKr.toLocaleString('da-DK')} KR
              </span>
            </div>
            <div style={{ height: 1, background: 'var(--rule-soft)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>NEW BALANCE</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28 }}>
                {(balance + activeKr).toLocaleString('da-DK')} KR
              </span>
            </div>
          </div>
        )}

        {/* Trustly CTA */}
        <TrustlyButton amount={activeKr} />

        <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bone-2)', border: '1px solid var(--rule-soft)' }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>RESPONSIBLE GAMING</div>
          <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            You can set personal deposit limits in your{' '}
            <Link href="/profile" style={{ color: 'var(--ink)' }}>account settings</Link>.
            If you are concerned about your gaming habits, visit{' '}
            <a href="https://www.stopspillet.dk" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)' }}>StopSpillet.dk</a>{' '}
            or call <strong>+45 70 22 28 25</strong>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function TrustlyButton({ amount }: { amount: number }) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  function handleClick() {
    if (amount < 50 || processing) return
    setProcessing(true)
    setTimeout(() => {
      adjustBalance(amount)
      addTransaction(`Deposit · Trustly · DK bank`, amount)
      setConfirmed(true)
      setTimeout(() => router.push('/wallet'), 1200)
    }, 2000)
  }

  if (confirmed) {
    return (
      <div style={{
        padding: '20px 24px', background: 'var(--money)',
        color: '#fff', fontFamily: 'var(--font-display)',
        fontWeight: 700, fontSize: 18, textAlign: 'center',
      }}>
        ✓ DEPOSIT CONFIRMED · UPDATING BALANCE...
      </div>
    )
  }

  const active = amount >= 50 && !processing
  return (
    <div>
      <button
        disabled={!active}
        onClick={handleClick}
        style={{
          width: '100%',
          background: active ? 'var(--ink)' : 'var(--rule-soft)',
          color: active ? 'var(--bone)' : 'var(--ink-ghost)',
          border: 'none',
          padding: '18px 24px',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          cursor: active ? 'pointer' : 'not-allowed',
        }}
      >
        {processing
          ? 'PROCESSING VIA TRUSTLY...'
          : amount >= 50
            ? `DEPOSIT ${amount.toLocaleString('da-DK')} KR VIA TRUSTLY →`
            : 'SELECT AN AMOUNT TO CONTINUE'
        }
      </button>
      <div style={{
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.04)',
        border: '1px solid var(--rule-soft)',
        borderTop: 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>
          {processing ? 'CONNECTING TO YOUR BANK — DO NOT CLOSE THIS PAGE' : 'TRUSTLY · INSTANT BANK TRANSFER · MITID REQUIRED'}
        </span>
        {!processing && (
          <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>
            MIN 50 KR · MAX 20.000 KR
          </span>
        )}
      </div>
    </div>
  )
}
