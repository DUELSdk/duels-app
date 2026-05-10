'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getBalance, adjustBalance, addTransaction } from '@/lib/balance'

export default function WithdrawPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(500)
  const [amount, setAmount] = useState('')
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => { setBalance(getBalance()) }, [])

  const kr = parseInt(amount) || 0
  const valid = kr >= 100 && kr <= balance

  function handleWithdraw() {
    if (!valid || processing) return
    setProcessing(true)
    setTimeout(() => {
      adjustBalance(-kr)
      addTransaction(`Withdraw · Trustly · DK bank`, -kr)
      setConfirmed(true)
      setTimeout(() => router.push('/wallet'), 1200)
    }, 2000)
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      <main style={{ flex: 1, padding: `56px ${s.px}`, maxWidth: 760, width: '100%' }}>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 40 }}>
          <Link href="/wallet" style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none' }}>WALLET</Link>
          <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>/</span>
          <span style={{ ...s.mono, fontSize: 10 }}>WITHDRAW</span>
        </div>

        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>CASH OUT</div>
        <h1 style={{ ...s.display(72), lineHeight: 0.85, marginBottom: 40 }}>WITHDRAW.</h1>

        {/* Balance card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 32 }}>
          <div style={{ border: '1.5px solid var(--ink)', padding: '20px 24px' }}>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>AVAILABLE balance</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {balance.toLocaleString('da-DK')} KR
            </div>
          </div>
          <div style={{ border: '1.5px solid var(--rule-soft)', padding: '20px 24px' }}>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>PROCESSING TIME</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24 }}>1–2 DAYS</div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>
              VIA TRUSTLY TO YOUR DK BANK
            </div>
          </div>
        </div>

        {/* Amount input */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 12 }}>AMOUNT TO WITHDRAW</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="number"
              min={100}
              max={balance}
              placeholder="500"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                flex: 1, padding: '14px 18px',
                border: `1.5px solid ${kr > balance ? 'var(--alarm)' : 'var(--ink)'}`,
                background: 'var(--bone)',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28,
                color: 'var(--ink)', outline: 'none', letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24 }}>KR</span>
          </div>
          {kr > balance && (
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', marginTop: 6 }}>
              EXCEEDS AVAILABLE balance
            </div>
          )}
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', marginTop: 6 }}>
            MINIMUM 100 KR
          </div>
        </div>

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[500, 1000, balance].map(preset => (
            <button
              key={preset}
              onClick={() => setAmount(String(preset))}
              style={{
                ...s.mono, fontSize: 10,
                border: '1px solid var(--rule-soft)',
                padding: '6px 14px', background: 'transparent',
                color: 'var(--ink-faint)', cursor: 'pointer',
              }}
            >
              {preset === balance ? 'ALL' : `${preset.toLocaleString('da-DK')} KR`}
            </button>
          ))}
        </div>

        {/* Summary */}
        {valid && (
          <div style={{ border: '1.5px solid var(--ink)', padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>WITHDRAW</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--alarm)' }}>
                −{kr.toLocaleString('da-DK')} KR
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>REMAINING balance</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28 }}>
                {(balance - kr).toLocaleString('da-DK')} KR
              </span>
            </div>
          </div>
        )}

        {/* Trustly CTA */}
        {confirmed ? (
          <div style={{
            padding: '20px 24px', background: 'var(--ink)',
            color: 'var(--bone)', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: 18, textAlign: 'center', marginBottom: 32,
          }}>
            ✓ WITHDRAWAL INITIATED · ARRIVING IN 1–2 DAYS
          </div>
        ) : (
          <>
            <button
              disabled={!valid || processing}
              onClick={handleWithdraw}
              style={{
                width: '100%',
                background: valid && !processing ? 'var(--ink)' : 'var(--rule-soft)',
                color: valid && !processing ? 'var(--bone)' : 'var(--ink-ghost)',
                border: 'none',
                padding: '18px 24px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                cursor: valid && !processing ? 'pointer' : 'not-allowed',
                marginBottom: 0,
              }}
            >
              {processing
                ? 'PROCESSING VIA TRUSTLY...'
                : valid
                  ? `WITHDRAW ${kr.toLocaleString('da-DK')} KR VIA TRUSTLY →`
                  : 'ENTER AMOUNT TO CONTINUE'
              }
            </button>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid var(--rule-soft)',
              borderTop: 'none',
              marginBottom: 32,
            }}>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>
                {processing
                  ? 'CONNECTING TO YOUR BANK — DO NOT CLOSE THIS PAGE'
                  : 'TRUSTLY · BANK TRANSFER TO YOUR DK ACCOUNT · MITID CONFIRMATION REQUIRED · 1–2 BANKING DAYS'
                }
              </span>
            </div>
          </>
        )}

        {/* Bank account info */}
        <div style={{ padding: '20px 24px', background: 'var(--bone-2)', border: '1px solid var(--rule-soft)' }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>PAYOUT ACCOUNT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
            BANK ACCOUNT NOT LINKED
          </div>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>
            A BANK ACCOUNT WILL BE LINKED AUTOMATICALLY ON FIRST TRUSTLY WITHDRAWAL.
            PAYMENTS ALWAYS GO TO THE SAME ACCOUNT USED FOR DEPOSITS.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
