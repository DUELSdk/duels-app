'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { getBalance } from '@/lib/balance'

type Phase = 'input' | 'confirming' | 'confirmed'

const MOCK_BANK = { name: 'DANSKE BANK', last4: '4821' }
const MIN_WITHDRAW = 100

export default function WithdrawPage() {
  const router = useRouter()
  const [balance, setBalance]   = useState(0)
  const [amount, setAmount]     = useState('')
  const [phase, setPhase]       = useState<Phase>('input')
  const [dots, setDots]         = useState(0)

  useEffect(() => { setBalance(getBalance()) }, [])

  useEffect(() => {
    if (phase !== 'confirming') return
    const iv = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => clearInterval(iv)
  }, [phase])

  const numAmount = parseInt(amount || '0')
  const isValid   = numAmount >= MIN_WITHDRAW && numAmount <= balance
  const remaining = balance - (isValid ? numAmount : 0)

  function handleConfirmWithMitID() {
    if (!isValid) return
    setPhase('confirming')
    setTimeout(() => {
      setPhase('confirmed')
      setTimeout(() => {
        router.replace(`/wallet/withdraw/success?amount=${numAmount}`)
      }, 900)
    }, 2800)
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      <div style={{ flex: 1, maxWidth: 640, margin: '0 auto', width: '100%', padding: '56px 24px' }}>

        <Link href="/wallet" style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none', display: 'block', marginBottom: 40 }}>
          ← WALLET
        </Link>

        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>TAKE FUNDS OUT</div>
        <h1 style={{ ...s.display(72), lineHeight: 0.85, marginBottom: 48 }}>WITHDRAW.</h1>

        {/* Current balance */}
        <div style={{
          background: 'var(--ink)', color: 'var(--bone-on-dark)',
          padding: '20px 24px', marginBottom: 40,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 4 }}>AVAILABLE BALANCE</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
              letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
            }}>
              {balance.toLocaleString('da-DK')} <span style={{ fontSize: 18, color: 'var(--bone-faint)', fontWeight: 400 }}>KR</span>
            </div>
          </div>
          {isValid && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 4 }}>REMAINING AFTER</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
                letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: 'var(--bone-faint)',
              }}>
                {remaining.toLocaleString('da-DK')} <span style={{ fontSize: 18, fontWeight: 400 }}>KR</span>
              </div>
            </div>
          )}
        </div>

        {/* Amount input */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>AMOUNT TO WITHDRAW (KR)</div>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="0"
              disabled={phase !== 'input'}
              style={{
                width: '100%',
                border: `2px solid ${amount && !isValid && numAmount > 0 ? 'var(--alarm)' : isValid ? 'var(--ink)' : 'rgba(13,13,13,0.2)'}`,
                background: 'transparent',
                padding: '20px 64px 20px 24px',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40,
                letterSpacing: '-0.02em', color: 'var(--ink)',
                outline: 'none', boxSizing: 'border-box',
                fontVariantNumeric: 'tabular-nums',
              }}
            />
            <span style={{ ...s.mono, fontSize: 14, color: 'var(--ink-faint)', position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }}>
              KR
            </span>
          </div>
          <div style={{ ...s.mono, fontSize: 9, marginTop: 8, minHeight: 14, color: 'var(--ink-faint)' }}>
            {numAmount > balance
              ? <span style={{ color: 'var(--alarm)' }}>EXCEEDS AVAILABLE BALANCE</span>
              : numAmount > 0 && numAmount < MIN_WITHDRAW
                ? <span style={{ color: 'var(--alarm)' }}>MINIMUM WITHDRAWAL IS {MIN_WITHDRAW} KR</span>
                : isValid
                  ? `${numAmount.toLocaleString('da-DK')} KR · ARRIVES WITHIN 1–2 BUSINESS DAYS`
                  : `MINIMUM ${MIN_WITHDRAW} KR`
            }
          </div>
        </div>

        {balance > 0 && phase === 'input' && (
          <button
            onClick={() => setAmount(String(balance))}
            style={{
              ...s.mono, fontSize: 10, color: 'var(--ink-faint)',
              background: 'none', border: '1px solid rgba(13,13,13,0.2)',
              padding: '8px 16px', cursor: 'pointer', marginBottom: 40,
            }}
          >
            WITHDRAW ALL {balance.toLocaleString('da-DK')} KR
          </button>
        )}

        {/* Destination */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>DESTINATION</div>
          <div style={{
            border: '1.5px solid rgba(13,13,13,0.2)',
            padding: '20px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                {MOCK_BANK.name}
              </div>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>
                ACCOUNT ENDING ···· {MOCK_BANK.last4}
              </div>
            </div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>VIA TRUSTLY</div>
          </div>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', marginTop: 8 }}>
            BANK ACCOUNT SET FROM MITID-VERIFIED IDENTITY. TO CHANGE, CONTACT SUPPORT.
          </div>
        </div>

        {/* Confirm section */}
        <div style={{ borderTop: '1.5px solid var(--ink)', paddingTop: 32 }}>
          {phase === 'input' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
                <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>WITHDRAWAL AMOUNT</span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
                  letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                  color: isValid ? 'var(--ink)' : 'var(--ink-ghost)',
                }}>
                  {isValid ? numAmount.toLocaleString('da-DK') : '—'} <span style={{ fontSize: 18, fontWeight: 400, color: 'var(--ink-faint)' }}>KR</span>
                </span>
              </div>

              <button
                onClick={handleConfirmWithMitID}
                disabled={!isValid}
                style={{
                  width: '100%', background: isValid ? 'var(--ink)' : 'rgba(13,13,13,0.12)',
                  color: isValid ? 'var(--bone)' : 'var(--ink-ghost)',
                  border: 'none', padding: '20px 32px',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                  textTransform: 'uppercase', letterSpacing: '0.02em',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s', marginBottom: 12,
                }}
              >
                CONFIRM WITH MITID →
              </button>
              <p style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textAlign: 'center', lineHeight: 1.8 }}>
                REQUIRES MITID VERIFICATION · ARRIVAL WITHIN 1–2 BUSINESS DAYS
              </p>
            </>
          )}

          {phase === 'confirming' && (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, textTransform: 'uppercase', marginBottom: 8 }}>
                MIT<span style={{ color: 'var(--alarm)' }}>ID.</span>
              </div>
              <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.12em', fontWeight: 600 }}>
                VERIFYING IDENTITY{'.' .repeat(dots)}
              </div>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 8 }}>
                CHECK YOUR MITID APP TO APPROVE
              </div>
            </div>
          )}

          {phase === 'confirmed' && (
            <div style={{ padding: '32px 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
              <span style={{ ...s.mono, fontSize: 13, color: 'var(--money)', fontWeight: 700, letterSpacing: '0.14em' }}>
                IDENTITY CONFIRMED
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
