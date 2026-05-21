'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { useBalance } from '@/hooks/useBalance'
import { supabase } from '@/lib/supabase'

type Txn = { id: string; ts: number; desc: string; amount: number }
type LedgerFilter = 'ALL' | 'DEPOSITS' | 'WINS' | 'LOSSES' | 'WITHDRAWALS'

function txType(amount: number, desc: string): string {
  if (desc.toLowerCase().includes('deposit'))  return 'DEPOSIT'
  if (desc.toLowerCase().includes('withdraw')) return 'WITHDRAW'
  if (amount > 0) return 'WIN'
  return 'LOSS'
}

function txColor(t: string): string {
  if (t === 'WIN')     return 'var(--money)'
  if (t === 'LOSS')    return 'var(--alarm)'
  if (t === 'DEPOSIT') return 'var(--ink)'
  return 'var(--ink-faint)'
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  if (d.toDateString() === now.toDateString()) return `${h}:${m} TODAY`
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'YESTERDAY'
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
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
  const { balance: supaBalance } = useBalance()
  const balance = supaBalance ?? 0
  const [txs,    setTxs]    = useState<Txn[]>([])
  const [filter, setFilter] = useState<LedgerFilter>('ALL')
  const [handle, setHandle] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load handle
      const { data: profile } = await supabase
        .from('public_profiles')
        .select('handle')
        .eq('id', user.id)
        .single()
      if (profile) setHandle(profile.handle)

      // Load transactions
      const { data: rows } = await supabase
        .from('transactions')
        .select('id, amount_ore, description, created_at')
        .eq('user_id', user.id)
        .eq('status', 'settled')
        .order('created_at', { ascending: false })
        .limit(50)

      if (rows) {
        setTxs(rows.map(row => ({
          id:     row.id,
          ts:     new Date(row.created_at).getTime(),
          desc:   row.description ?? '',
          amount: row.amount_ore / 100,
        })))
      }
    }
    load()
  }, [])

  const todayTs      = new Date().setHours(0, 0, 0, 0)
  const todayTxs     = txs.filter(t => t.ts >= todayTs)
  const netToday     = todayTxs.reduce((n, t) => n + t.amount, 0)
  const held         = 50
  const withdrawable = Math.max(0, balance - held)
  const visible      = filterTxs(txs, filter)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav />

      {/* ── Header ── */}
      <section style={{ padding: `40px ${s.px} 16px` }}>
        <div style={{ borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
          <div style={{ ...s.mono, fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-faint)' }}>
            WALLET{handle ? ` · ${handle.toUpperCase()}` : ''}
          </div>
          <h1 style={{ ...s.display(88), lineHeight: 0.9, marginTop: 6 }}>BALANCE.</h1>
        </div>
      </section>

      {/* ── Balance card + actions ── */}
      <section style={{ padding: `16px ${s.px} 32px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'stretch' }}>

          {/* Left — balance */}
          <div style={{ background: 'var(--ink)', color: 'var(--bone-on-dark)', padding: '36px 40px' }}>
            <div style={{ ...s.mono, fontSize: 11, color: 'rgba(240,237,228,0.6)', letterSpacing: '0.18em' }}>
              AVAILABLE TO PLAY
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 160,
                letterSpacing: '-0.04em', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums',
              }}>
                {balance.toLocaleString('da-DK')}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--bone-faint)' }}>KR</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 28, paddingTop: 16,
              borderTop: '1px solid rgba(240,237,228,0.18)',
            }}>
              {[
                { label: 'HELD IN ACTIVE MATCHES', value: held.toLocaleString('da-DK'),         color: 'var(--bone-on-dark)' },
                { label: 'WITHDRAWABLE NOW',        value: withdrawable.toLocaleString('da-DK'), color: 'var(--bone-on-dark)' },
                { label: 'NET TODAY',               value: (netToday >= 0 ? '+ ' : '− ') + Math.abs(netToday).toLocaleString('da-DK'), color: netToday >= 0 ? 'var(--money)' : 'var(--alarm)' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ ...s.mono, fontSize: 10, color: 'rgba(240,237,228,0.6)', marginBottom: 2 }}>{stat.label}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24,
                    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: stat.color, marginTop: 2,
                  }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/wallet/deposit" style={{
              display: 'block', textAlign: 'center',
              background: 'var(--ink)', color: 'var(--bone)',
              padding: '20px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              textDecoration: 'none',
            }}>
              DEPOSIT — MITID
            </Link>
            <Link href="/wallet/withdraw" style={{
              display: 'block', textAlign: 'center',
              border: '1.5px solid var(--ink)',
              padding: '20px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              background: 'transparent', color: 'var(--ink)',
              textDecoration: 'none',
            }}>
              WITHDRAW
            </Link>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 4 }}>
              INSTANT IN · 1–2 DAYS OUT · NO FEES
            </div>
          </div>
        </div>
      </section>

      {/* ── Ledger ── */}
      <section style={{ padding: `0 ${s.px} 56px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <h2 style={{ ...s.display(44) }}>LEDGER.</h2>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['ALL', 'WINS', 'LOSSES', 'DEPOSITS', 'WITHDRAWALS'] as LedgerFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                ...s.mono, fontSize: 10,
                padding: '5px 10px',
                border: '1px solid var(--ink)',
                background: filter === f ? 'var(--ink)' : 'transparent',
                color: filter === f ? 'var(--bone)' : 'var(--ink-faint)',
                cursor: 'pointer',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={s.rule} />

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
              display: 'grid', gridTemplateColumns: '160px 100px 1fr 120px',
              alignItems: 'baseline', gap: 16,
              padding: '14px 0', borderBottom: '1px solid var(--rule-soft)',
            }}>
              <span style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.10em', fontVariantNumeric: 'tabular-nums' }}>
                {formatDate(tx.ts)}
              </span>
              <span style={{ ...s.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color }}>
                {type}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>
                {tx.desc}
              </span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
                textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                color: tx.amount > 0 ? 'var(--money)' : tx.amount < 0 ? 'var(--alarm)' : 'var(--ink-faint)',
              }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('da-DK')}
              </span>
            </div>
          )
        })}
      </section>

      <Footer />
    </div>
  )
}
