'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { getBalance } from '@/lib/balance'

const PRESETS = [50, 100, 200, 500, 1000]

type Method = 'mobilepay' | 'trustly'

export default function DepositPage() {
  const router = useRouter()
  const [amount, setAmount]     = useState<number | ''>(200)
  const [custom, setCustom]     = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [method, setMethod]     = useState<Method>('mobilepay')
  const [loading, setLoading]   = useState(false)

  const effectiveAmount = useCustom ? parseInt(custom || '0') : (amount as number)
  const isValid = effectiveAmount >= 50 && effectiveAmount <= 10000

  function selectPreset(v: number) {
    setAmount(v)
    setUseCustom(false)
    setCustom('')
  }

  function handleCustomChange(v: string) {
    setCustom(v.replace(/\D/g, ''))
    setUseCustom(true)
    setAmount('')
  }

  function handleSubmit() {
    if (!isValid || loading) return
    setLoading(true)
    router.push(`/wallet/deposit/processing?amount=${effectiveAmount}&method=${method}`)
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav />

      <div style={{ flex: 1, maxWidth: 640, margin: '0 auto', width: '100%', padding: '56px 24px' }}>

        {/* Back link */}
        <Link href="/wallet" style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none', display: 'block', marginBottom: 40 }}>
          ← WALLET
        </Link>

        {/* Header */}
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>ADD FUNDS</div>
        <h1 style={{ ...s.display(72), lineHeight: 0.85, marginBottom: 48 }}>DEPOSIT.</h1>

        {/* Amount section */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>AMOUNT (KR)</div>

          {/* Preset grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => selectPreset(p)}
                style={{
                  border: (!useCustom && amount === p) ? '2px solid var(--ink)' : '1.5px solid rgba(13,13,13,0.2)',
                  background: (!useCustom && amount === p) ? 'var(--ink)' : 'transparent',
                  color: (!useCustom && amount === p) ? 'var(--bone)' : 'var(--ink)',
                  padding: '14px 8px',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
                  letterSpacing: '-0.01em', cursor: 'pointer',
                  fontVariantNumeric: 'tabular-nums',
                  transition: 'all 0.1s',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="CUSTOM AMOUNT"
                value={custom}
                onChange={e => handleCustomChange(e.target.value)}
                onFocus={() => { if (custom) setUseCustom(true) }}
                maxLength={5}
                style={{
                  width: '100%',
                  border: useCustom ? '1.5px solid var(--ink)' : '1.5px solid rgba(13,13,13,0.2)',
                  background: 'transparent',
                  padding: '14px 48px 14px 16px',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                  letterSpacing: '-0.01em', color: 'var(--ink)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <span style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)', position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                KR
              </span>
            </div>
          </div>

          {useCustom && custom && (
            <div style={{ ...s.mono, fontSize: 9, color: effectiveAmount < 50 ? 'var(--alarm)' : effectiveAmount > 10000 ? 'var(--alarm)' : 'var(--ink-faint)', marginTop: 8 }}>
              {effectiveAmount < 50 ? 'MINIMUM DEPOSIT IS 50 KR' : effectiveAmount > 10000 ? 'MAXIMUM DEPOSIT IS 10.000 KR' : `${effectiveAmount.toLocaleString('da-DK')} KR SELECTED`}
            </div>
          )}
        </div>

        {/* Method section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>PAYMENT METHOD</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {([
              {
                id: 'mobilepay' as Method,
                label: 'MOBILEPAY',
                sub:   'SENT TO YOUR MOBILEPAY APP · INSTANT',
                badge: 'RECOMMENDED',
              },
              {
                id: 'trustly' as Method,
                label: 'TRUSTLY — BANK TRANSFER',
                sub:   'DIRECT FROM YOUR BANK · INSTANT',
                badge: null,
              },
            ] as const).map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                style={{
                  border: method === m.id ? '2px solid var(--ink)' : '1.5px solid rgba(13,13,13,0.2)',
                  background: method === m.id ? 'var(--ink)' : 'transparent',
                  padding: '20px 24px',
                  cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.1s',
                }}
              >
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
                    textTransform: 'uppercase', letterSpacing: '-0.01em',
                    color: method === m.id ? 'var(--bone-on-dark)' : 'var(--ink)',
                  }}>
                    {m.label}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, marginTop: 4, color: method === m.id ? 'var(--bone-faint)' : 'var(--ink-faint)' }}>
                    {m.sub}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {m.badge && (
                    <span style={{
                      ...s.mono, fontSize: 8, fontWeight: 700,
                      color: method === m.id ? 'var(--money)' : 'var(--money)',
                      border: '1px solid var(--money)',
                      padding: '2px 6px',
                    }}>
                      {m.badge}
                    </span>
                  )}
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: `2px solid ${method === m.id ? 'var(--bone-on-dark)' : 'rgba(13,13,13,0.3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {method === m.id && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bone-on-dark)' }} />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary + CTA */}
        <div style={{ borderTop: '1.5px solid var(--ink)', paddingTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>DEPOSIT AMOUNT</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
              letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
              color: isValid ? 'var(--ink)' : 'var(--ink-ghost)',
            }}>
              {isValid ? effectiveAmount.toLocaleString('da-DK') : '—'} <span style={{ fontSize: 18, fontWeight: 400, color: 'var(--ink-faint)' }}>KR</span>
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            style={{
              width: '100%',
              background: isValid && !loading ? 'var(--ink)' : 'rgba(13,13,13,0.15)',
              color: isValid && !loading ? 'var(--bone)' : 'var(--ink-ghost)',
              border: 'none', padding: '20px 32px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
              textTransform: 'uppercase', letterSpacing: '0.02em',
              cursor: isValid && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'CONNECTING…' : `DEPOSIT ${isValid ? effectiveAmount.toLocaleString('da-DK') + ' KR' : ''} →`}
          </button>

          <p style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 12, lineHeight: 1.8 }}>
            FUNDS CREDITED INSTANTLY · WITHDRAWALS VIA TRUSTLY ONLY · 18+
          </p>
        </div>
      </div>
    </div>
  )
}
