'use client'

import { useState } from 'react'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getLeaderboard, type LeaderEntry } from '@/lib/mock-data'

type Period = 'today' | 'week' | 'allTime'

const board = getLeaderboard()

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('today')

  const entries = board[period]

  const tabStyle = (active: boolean): React.CSSProperties => ({
    ...s.mono,
    fontSize: 11,
    padding: '10px 20px',
    border: 'none',
    borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
    background: 'transparent',
    color: active ? 'var(--ink)' : 'var(--ink-faint)',
    cursor: 'pointer',
  })

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" activePage="leaderboard" />

      <section style={{ padding: `56px ${s.px} 32px` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>
          STANDINGS · RANKINGS GO LIVE AT LAUNCH
        </div>
        <h1 style={{ ...s.display(96), lineHeight: 0.85 }}>LEADERBOARD.</h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginTop: 20, maxWidth: 480, lineHeight: 1.5 }}>
          Ranked by net earnings. Skill only — no house edge, no luck.
        </p>
      </section>

      <section style={{ padding: `0 ${s.px} 56px` }}>
        {/* Period tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--rule-soft)', marginBottom: 32 }}>
          <button style={tabStyle(period === 'today')}   onClick={() => setPeriod('today')}>TODAY</button>
          <button style={tabStyle(period === 'week')}    onClick={() => setPeriod('week')}>THIS WEEK</button>
          <button style={tabStyle(period === 'allTime')} onClick={() => setPeriod('allTime')}>ALL TIME</button>
        </div>

        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '48px 1fr 80px 80px 80px 120px 80px',
          gap: 16,
          padding: '0 0 10px',
          borderBottom: '1.5px solid var(--ink)',
        }}>
          {['#', 'HANDLE', 'WINS', 'LOSSES', 'WIN%', 'NET KR', 'STREAK'].map(col => (
            <span key={col} style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textAlign: col === '#' || col === 'HANDLE' ? 'left' : 'right' }}>
              {col}
            </span>
          ))}
        </div>

        {/* Entries or empty state */}
        {entries.length > 0 ? (
          entries.map((entry, i) => (
            <LeaderRow key={entry.handle} entry={entry} isTop3={i < 3} />
          ))
        ) : (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--ink-ghost)', marginBottom: 12 }}>
              NO RANKINGS YET
            </div>
            <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)' }}>
              LEADERBOARD POPULATES WHEN REAL MATCHES ARE PLAYED.
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

function LeaderRow({ entry, isTop3 }: { entry: LeaderEntry; isTop3: boolean }) {
  const winPct = entry.wins + entry.losses > 0
    ? Math.round(entry.wins / (entry.wins + entry.losses) * 100)
    : 0

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '48px 1fr 80px 80px 80px 120px 80px',
      gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid var(--rule-soft)',
      alignItems: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: isTop3 ? 22 : 16,
        color: isTop3 ? 'var(--ink)' : 'var(--ink-ghost)',
      }}>
        {String(entry.rank).padStart(2, '0')}
      </span>

      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase' }}>
          {entry.handle}
        </div>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>
          {entry.topGame} · {entry.streak > 0 ? `${entry.streak}W STREAK` : 'NO STREAK'}
        </div>
      </div>

      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, textAlign: 'right', color: 'var(--money)' }}>
        {entry.wins}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, textAlign: 'right', color: 'var(--alarm)' }}>
        {entry.losses}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, textAlign: 'right', color: 'var(--ink-soft)' }}>
        {winPct}%
      </span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
        textAlign: 'right', fontVariantNumeric: 'tabular-nums',
        color: entry.netKr >= 0 ? 'var(--ink)' : 'var(--alarm)',
      }}>
        {entry.netKr >= 0 ? '+' : ''}{entry.netKr.toLocaleString('da-DK')}
      </span>
      <span style={{ ...s.mono, fontSize: 11, textAlign: 'right', color: entry.streak > 0 ? 'var(--money)' : 'var(--ink-ghost)' }}>
        {entry.streak > 0 ? `${entry.streak}W` : '—'}
      </span>
    </div>
  )
}
