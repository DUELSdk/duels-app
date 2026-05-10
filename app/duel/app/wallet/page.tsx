'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getBalance, getTransactions, type Txn } from '@/lib/balance'

function txType(amount: number, desc: string): string {
  if (desc.toLowerCase().includes('deposit')) return 'DEPOSIT'
  if (desc.toLowerCase().includes('withdraw')) return 'WITHDRAW'
  if (amount > 0) return 'WIN'
  return 'LOSS'
}

function txColor(amount: number, desc: string): string {
  const t = txType(amount, desc)
  if (t === 'WIN' || t === 'DEPOSIT') return 'var(--money)'
  if (t === 'LOSS') return 'var(--alarm)'
  return 'var(--ink-faint)'
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  if (isToday) return `TODAY ${h}:${m}`
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return `YESTERDAY ${h}:${m}`
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${h}:${m}`
}

export default function Wallet() {
  const [balance, setBalance] = useState<number>(500)
  const [txs, setTxs] = useState<Txn[]>([])

  useEffect(() => {
    setBalance(getBalance())
    setTxs(getTransactions())
  }, [])

  const todayTs = new Date().setHours(0, 0, 0, 0)
  const todayTxs = txs.filter(t => t.ts >= todayTs)
  const winsToday  = todayTxs.filter(t => t.amount > 0 && !t.desc.toLowerCase().includes('deposit')).reduce((n, t) => n + t.amount, 0)
  const lossesToday = todayTxs.filter(t => t.amount < 0 && !t.desc.toLowerCase().includes('withdraw')).reduce((n, t) => n + t.amount, 0)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav />

      <section style={{ padding: `56px ${s.px} 40px`, maxWidth: 900 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>WALLET</div>
        <h1 style={{ ...s.display(80), lineHeight: 0.85 }}>YOUR BALANCE.</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginTop: 40 }}>
          {[
            { label: 'BALANCE',     value: `${balance.toLocaleString('da-DK')} KR`,                              color: 'var(--ink)'    },
            { label: 'WON TODAY',   value: winsToday   > 0 ? `+${winsToday} KR`   : '0 KR',                     color: 'var(--money)'  },
            { label: 'LOST TODAY',  value: lossesToday < 0 ? `${lossesToday} KR`  : '0 KR',                     color: 'var(--alarm)'  },
          ].map(item => (
            <div key={item.label} style={{ border: '1.5px solid var(--ink)', padding: '20px 24px' }}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 10 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <Link href="/wallet/deposit" style={{ background: 'var(--ink)', color: 'var(--bone)', border: '1.5px solid var(--ink)', padding: '14px 28px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
            DEPOSIT →
          </Link>
          <Link href="/wallet/withdraw" style={{ border: '1.5px solid var(--ink)', padding: '14px 28px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', background: 'transparent', color: 'var(--ink)', textDecoration: 'none', display: 'inline-block' }}>
            WITHDRAW
          </Link>
        </div>

        <p style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 10 }}>
          PAYMENTS VIA TRUSTLY · INSTANT DEPOSIT · 1-2 DAY WITHDRAW · MitID REQUIRED
        </p>
      </section>

      <section style={{ padding: `0 ${s.px} 56px`, maxWidth: 900 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>TRANSACTION HISTORY</div>
        <div style={s.rule} />

        {txs.length === 0 ? (
          <div style={{ padding: '48px 0' }}>
            <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-ghost)' }}>NO TRANSACTIONS YET</div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 8 }}>TRANSACTIONS APPEAR HERE AFTER MATCHES AND DEPOSITS</div>
          </div>
        ) : txs.map(tx => (
          <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', alignItems: 'center', gap: 24, padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
            <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{formatDate(tx.ts)}</span>
            <div>
              <div style={{ ...s.mono, fontSize: 10, fontWeight: 600, color: txColor(tx.amount, tx.desc) }}>{txType(tx.amount, tx.desc)}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{tx.desc}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: tx.amount > 0 ? 'var(--money)' : 'var(--alarm)', fontVariantNumeric: 'tabular-nums' }}>
              {tx.amount > 0 ? '+' : ''}{tx.amount} KR
            </span>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}
