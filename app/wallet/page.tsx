'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getBalance, getTransactions, type Txn } from '@/lib/balance'

type LedgerFilter = 'ALL' | 'DEPOSITS' | 'WINS' | 'LOSSES' | 'WITHDRAWALS'

function txType(amount: number, desc: string): string {
  if (desc.toLowerCase().includes('deposit'))  return 'DEPOSIT'
  if (desc.toLowerCase().includes('withdraw')) return 'WITHDRAW'
  if (amount > 0) return 'WIN'
  return 'LOSS'
}

function txColor(t: string): string {
  if (t === 'WIN' || t === 'DEPOSIT') return 'var(--money)'
  if (t === 'LOSS')                   return 'var(--alarm)'
  return 'var(--ink-faint)'
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  if (d.toDateString() === now.toDateString()) return `TODAY ${h}:${m}`
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return `YESTERDAY ${h}:${m}`
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${h}:${m}`
}

function filterTxs(txs: Txn[], filter: LedgerFilter): Txn[] {
  if (filter === 'ALL')         return txs
  if (filter === 'DEPOSITS')    return txs.filter(t => txType(t.amount, t.desc) === 'DEPOSIT')
  if (filter === 'WINS')        return txs.filter(t => txType(t.amount, t.desc) === 'WIN')
  if (filter === 'LOSSES')      return txs.filter(t => txType(t.amount, t.desc) === 'LOSS')
  if (filter === 'WITHDRAWALS') return txs.filter(t => txType(t.amount, t.desc) === 'WITHDRAW')
  return txs
}

export default function Wallet() {
  const [balance, setBalance] = useState<number>(2450)
  const [txs, setTxs] = useState<Txn[]>([])
  const [filter, setFilter] = useState<LedgerFilter>('ALL')

  useEffect(() => {
    setBalance(getBalance())
    setTxs(getTransactions())
  }, [])

  const todayTs = new Date().setHours(0, 0, 0, 0)
  const todayTxs   = txs.filter(t => t.ts >= todayTs)
  const winsToday  = todayTxs.filter(t => t.amount > 0 && !t.desc.toLowerCase().includes('deposit')).reduce((n, t) => n + t.amount, 0)
  const lossesToday = todayTxs.filter(t => t.amount < 0 && !t.desc.toLowerCase().includes('withdraw')).reduce((n, t) => n + t.amount, 0)

  const visible = filterTxs(txs, filter)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav />

      {/* Header */}
      <section style={{ padding: `40px ${s.px} 32px` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>WALLET</div>
        <h1 style={{ ...s.display(96), lineHeight: 0.85 }}>BALANCE.</h1>
      </section>

      {/* Black balance card */}
      <section style={{ padding: `0 ${s.px} 32px` }}>
        <div style={{ background: 'var(--ink)', color: 'var(--bone-on-dark)', padding: '40px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--bone-faint)', marginBottom: 16 }}>AVAILABLE TO PLAY</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 80,
                letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>
                {balance.toLocaleString('da-DK')} <span style={{ fontSize: 32, color: 'var(--bone-faint)' }}>KR</span>
              </div>
              <div style={{ display: 'flex', gap: 40, marginTop: 24 }}>
                {[
                  { label: 'WON TODAY',  value: winsToday > 0 ? `+${winsToday}` : '0',      color: 'var(--money)' },
                  { label: 'LOST TODAY', value: lossesToday < 0 ? `${lossesToday}` : '0',    color: 'var(--alarm)' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: item.color, fontVariantNumeric: 'tabular-nums' }}>
                      {item.value} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--bone-faint)' }}>KR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }}>
              <Link href="/wallet" style={{
                display: 'block', textAlign: 'center',
                background: 'var(--bone)', color: 'var(--ink)',
                padding: '16px 24px',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                textTransform: 'uppercase', letterSpacing: '-0.01em',
                textDecoration: 'none',
              }}>
                + DEPOSIT →
              </Link>
              <Link href="/wallet" style={{
                display: 'block', textAlign: 'center',
                border: '1px solid rgba(240,237,228,0.2)',
                padding: '14px 24px',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                textTransform: 'uppercase', letterSpacing: '-0.01em',
                background: 'transparent', color: 'var(--bone-faint)',
                textDecoration: 'none',
              }}>
                WITHDRAW
              </Link>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--bone-faint)', textAlign: 'center' }}>
                VIA TRUSTLY · MitID REQUIRED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ledger */}
      <section style={{ padding: `0 ${s.px} 56px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>LEDGER</div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1.5px solid var(--ink)', marginBottom: 0 }}>
          {(['ALL', 'DEPOSITS', 'WINS', 'LOSSES', 'WITHDRAWALS'] as LedgerFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...s.mono, fontSize: 10, fontWeight: 700,
                padding: '10px 16px',
                border: 'none',
                borderBottom: filter === f ? '2px solid var(--alarm)' : '2px solid transparent',
                marginBottom: -2,
                background: 'transparent',
                color: filter === f ? 'var(--ink)' : 'var(--ink-faint)',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div style={{ padding: '48px 0' }}>
            <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-ghost)' }}>NO TRANSACTIONS YET</div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 8 }}>PLAY A MATCH TO SEE YOUR LEDGER</div>
          </div>
        ) : visible.map(tx => {
          const type  = txType(tx.amount, tx.desc)
          const color = txColor(type)
          return (
            <div key={tx.id} style={{
              display: 'grid', gridTemplateColumns: '160px 64px 1fr auto auto',
              alignItems: 'center', gap: 24,
              padding: '16px 0', borderBottom: '1px solid var(--rule-soft)',
            }}>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{formatDate(tx.ts)}</span>
              <span style={{ ...s.mono, fontSize: 10, fontWeight: 700, color }}>{type}</span>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{tx.desc}</div>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
                color, fontVariantNumeric: 'tabular-nums',
              }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </span>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>KR</span>
            </div>
          )
        })}
      </section>

      <Footer />
    </div>
  )
}
