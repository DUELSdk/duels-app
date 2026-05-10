'use client'

import Link from 'next/link'
import { s } from '@/lib/styles'
import { useBalance } from '@/hooks/useBalance'

interface BroadcastNavProps {
  balance?: string  // ignored — real balance comes from localStorage
  activePage?: 'live' | 'games' | 'tournaments' | 'leaderboard'
}

const NAV_LINKS = [
  { id: 'live',        label: 'LIVE',        href: '/'             },
  { id: 'games',       label: 'GAMES',       href: '/play'         },
  { id: 'tournaments', label: 'TOURNAMENTS', href: '/tournaments'  },
  { id: 'leaderboard', label: 'STANDINGS',   href: '/leaderboard'  },
] as const

export function BroadcastNav({ activePage }: BroadcastNavProps) {
  const { balance } = useBalance()

  const balStr = balance !== null
    ? balance.toLocaleString('da-DK')
    : null

  return (
    <nav style={{
      borderBottom: '1.5px solid var(--ink)',
      padding: `14px ${s.px}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, background: 'var(--bone)', zIndex: 50,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 12, textDecoration: 'none' }}>
        <span style={{ ...s.display(18), letterSpacing: '-0.01em' }}>DUEL</span>
        <span style={{ ...s.mono, color: 'var(--ink-faint)', fontSize: 10 }}>DK · EST.2025</span>
      </Link>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.id}
            href={link.href}
            style={{
              ...s.mono,
              color: activePage === link.id ? 'var(--ink)' : 'var(--ink-faint)',
              display: 'flex', alignItems: 'center', gap: 8,
              textDecoration: 'none',
            }}
          >
            {link.id === 'live' && <span className="live-dot" />}
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {balStr !== null ? (
          <Link href="/wallet" style={{ ...s.mono, color: 'var(--ink-soft)', textDecoration: 'none' }}>
            {balStr} KR
          </Link>
        ) : null}
        <Link
          href={balStr !== null ? '/profile' : '/auth'}
          style={{
            ...s.mono,
            border: '1.5px solid var(--ink)',
            padding: '6px 14px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          {balStr !== null ? 'ACCOUNT' : 'SIGN IN'}
        </Link>
      </div>
    </nav>
  )
}
