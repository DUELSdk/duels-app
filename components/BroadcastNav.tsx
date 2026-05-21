'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useBalance } from '@/hooks/useBalance'
import { useTournament } from './TournamentContext'
import { useActiveMatch } from './ActiveMatchContext'
import { supabase } from '@/lib/supabase'

interface BroadcastNavProps {
  activePage?: 'live' | 'games' | 'tournaments' | 'standings'
  loggedOut?: boolean
  dark?: boolean
}

const NAV_LINKS = [
  { id: 'live',      label: 'LIVE',      href: '/'            },
  { id: 'games',     label: 'GAMES',     href: '/play'        },
  { id: 'tournaments', label: 'TOURNAMENTS', href: '/tournaments' },
  { id: 'standings', label: 'STANDINGS', href: '/leaderboard' },
] as const

export function BroadcastNav({ activePage, loggedOut, dark }: BroadcastNavProps) {
  const { balance } = useBalance()
  const { tournament, openDrawer } = useTournament()
  const { activeMatch, openDrawer: openMatchDrawer } = useActiveMatch()
  const balStr = balance !== null ? balance.toLocaleString('da-DK') : null
  const isLoggedOut = loggedOut ?? balStr === null

  const bg      = dark ? '#0a0a09'                    : 'var(--bone)'
  const textPri = dark ? '#f0ede4'                    : 'var(--ink)'
  const textDim = dark ? 'rgba(240,237,228,0.35)'     : 'var(--ink-faint)'
  const textAct = dark ? '#f0ede4'                    : 'var(--ink)'
  const borderEl= dark ? 'rgba(240,237,228,0.18)'     : 'var(--ink)'

  return (
    <>
    <StadiumStrip />
    <nav style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '12px 24px',
      borderBottom: '1px solid var(--ink)',
      background: bg,
      color: textPri,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 26, lineHeight: 1,
          textDecoration: 'none', color: textPri,
          letterSpacing: '-0.01em', textTransform: 'uppercase',
        }}>
          DUELS
        </Link>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: textDim }}>
          DK · EST.2025
        </span>
      </div>

      <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.12em', fontWeight: 500,
              color: activePage === link.id ? textAct : textDim,
              display: 'flex', alignItems: 'center', gap: 6,
              textDecoration: 'none',
            }}
          >
            {link.id === 'live' && <span className="live-dot" style={{ marginRight: 2 }} />}
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
        {isLoggedOut ? (
          <>
            <Link href="/auth" style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: textDim,
              textDecoration: 'none',
            }}>
              SIGN IN
            </Link>
            <Link href="/auth" style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
              background: textPri, color: bg,
              padding: '6px 12px', textDecoration: 'none',
            }}>
              Enter
            </Link>
          </>
        ) : (
          <>
            {activeMatch && (
              <button
                onClick={openMatchDrawer}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'var(--alarm)', border: 'none',
                  padding: '5px 10px', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'white', letterSpacing: '0.10em', fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', flexShrink: 0 }} />
                IN MATCH
              </button>
            )}
            {tournament && (
              <button
                onClick={openDrawer}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'none', border: `1.5px solid var(--alarm)`,
                  padding: '5px 10px', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--alarm)', letterSpacing: '0.10em', fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alarm)', flexShrink: 0 }} />
                {tournament.label.length > 12 ? tournament.label.slice(0, 12) + '…' : tournament.label}
                <span style={{ opacity: 0.6, fontWeight: 400 }}>
                  {tournament.filled}/{tournament.seats}
                </span>
              </button>
            )}
            <Link href="/wallet" style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              fontVariantNumeric: 'tabular-nums',
              color: textPri, textDecoration: 'none',
              border: `1.5px solid ${borderEl}`,
              padding: '5px 12px',
            }}>
              {balStr} KR
            </Link>
            <Link
              href="/profile"
              style={{
                display: 'inline-block',
                width: 28, height: 28,
                border: `1.5px solid ${borderEl}`,
                textDecoration: 'none',
                flexShrink: 0,
              }}
            />
          </>
        )}
      </div>
    </nav>
    <LiveTicker dark={dark} />
    </>
  )
}

/* ── Stadium Strip ── */
type StripData = {
  biggestPotWho: string
  biggestPotKr: string
  settledToday: number
  totalPaidKr: string
}

export function StadiumStrip() {
  const [strip, setStrip] = useState<StripData | null>(null)

  useEffect(() => {
    supabase.rpc('rpc_get_stats_strip').then(({ data }) => {
      if (!data) return
      const d = data as { biggest_pot_who: string; biggest_pot_ore: number; settled_today: number; total_paid_ore: number }
      setStrip({
        biggestPotWho: d.biggest_pot_who ?? '—',
        biggestPotKr:  ((d.biggest_pot_ore  ?? 0) / 100).toLocaleString('da-DK'),
        settledToday:   d.settled_today ?? 0,
        totalPaidKr:   ((d.total_paid_ore  ?? 0) / 100).toLocaleString('da-DK'),
      })
    })
  }, [])

  const potKr   = strip?.biggestPotKr ?? '—'
  const potWho  = strip?.biggestPotWho ?? '—'
  const settled = strip?.settledToday ?? 0
  const paidKr  = strip?.totalPaidKr ?? '—'

  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--bone)',
      padding: '8px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="live-dot money" />
        <span style={{ opacity: 0.8 }}>TODAY&apos;S BIGGEST POT</span>
        <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{potKr} KR</span>
        <span style={{ opacity: 0.5 }}>—</span>
        <span style={{ opacity: 0.8 }}>{potWho}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ opacity: 0.5 }}>{settled.toLocaleString('da-DK')} SETTLED TODAY</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ opacity: 0.5 }}>{paidKr} KR PAID</span>
      </span>
    </div>
  )
}

type TickerItem = { game: string; text: string; money?: boolean; alarm?: boolean; soft?: boolean }

const FALLBACK_TICKER: TickerItem[] = [
  { game: 'CARD',  text: 'k_8821 takes 90 KR',          money: true },
  { game: 'DROP',  text: 'sandman locks 4 of 9',         soft: true },
  { game: 'CARD',  text: 'NEW SEARCH — 250 KR ROOM',     },
  { game: 'CYCLE', text: 'reef vs piloto · sudden death', alarm: true },
  { game: 'CARD',  text: 'siren takes 90 KR',            money: true },
  { game: 'DROP',  text: 'mads_kbh forfeits',            soft: true },
  { game: 'CARD',  text: 'NovaStrike on 4-streak',       alarm: true },
  { game: 'CYCLE', text: 'ghost_n locks slot 7',         soft: true },
  { game: 'CARD',  text: 'anon#3 takes 180 KR',          money: true },
  { game: 'CARD',  text: 'iso_9001 vs jeppe_92 · live',  },
]

/* ── Live Ticker — CSS scroll, no React state ── */
export function LiveTicker({ dark }: { dark?: boolean }) {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_TICKER)

  useEffect(() => {
    supabase.rpc('rpc_get_ticker').then(({ data }) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setItems((data as { game: string; text: string }[]).map(d => ({
          game: d.game,
          text: d.text,
          money: true,
        })))
      }
    })
  }, [])

  const doubled = [...items, ...items]
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: dark ? '1px solid rgba(240,237,228,0.14)' : '1px solid var(--ink)',
      borderBottom: dark ? '1px solid rgba(240,237,228,0.14)' : '1px solid var(--ink)',
      padding: '10px 0',
    }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'tickerScroll 60s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '0 24px',
            fontFamily: 'var(--font-mono)', fontSize: 12,
            borderRight: `1px solid ${dark ? 'rgba(240,237,228,0.14)' : 'var(--rule-soft)'}`,
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: dark ? 'var(--bone-faint)' : 'var(--ink-faint)', fontSize: 10 }}>
              {item.game}
            </span>
            <span style={{
              color: item.money ? 'var(--money)'
                   : item.alarm ? 'var(--alarm)'
                   : dark ? 'var(--bone-faint)' : 'var(--ink-soft)',
              fontWeight: item.money || item.alarm ? 600 : 400,
            }}>
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
