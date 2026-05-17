import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'

export default function DepositFailedPage() {
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
          ...s.mono, fontSize: 11, color: 'var(--alarm)', fontWeight: 700,
          letterSpacing: '0.14em', marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
          PAYMENT CANCELLED
        </div>

        <h1 style={{ ...s.display(80), lineHeight: 0.85, marginBottom: 20 }}>
          NOTHING<br />CHARGED.
        </h1>

        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '-0.01em',
          color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: 380, marginBottom: 56,
        }}>
          YOUR PAYMENT WAS CANCELLED OR FAILED. NO MONEY HAS BEEN TAKEN FROM YOUR ACCOUNT.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <Link href="/wallet/deposit" style={{
            display: 'block', textAlign: 'center',
            background: 'var(--ink)', color: 'var(--bone)',
            padding: '18px 32px',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            textTransform: 'uppercase', letterSpacing: '0.02em',
            textDecoration: 'none',
          }}>
            TRY AGAIN →
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
