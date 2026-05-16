'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav, StadiumStrip } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { getGameDetail } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

type Room = {
  kr: number
  liveCount: number
  waitSec: number
  isHot?: boolean
}

const ROOMS: Room[] = [
  { kr: 10,  liveCount: 4,  waitSec: 12 },
  { kr: 25,  liveCount: 6,  waitSec: 8  },
  { kr: 50,  liveCount: 12, waitSec: 4, isHot: true },
  { kr: 100, liveCount: 5,  waitSec: 14 },
  { kr: 250, liveCount: 2,  waitSec: 40 },
  { kr: 500, liveCount: 1,  waitSec: 120 },
]

const HIGH_ROLLER_KR: number[] = []
const MOCK_BALANCE = 2450

function waitLabel(sec: number) {
  if (sec < 60) return `~${sec}s`
  return `~${Math.round(sec / 60)}m`
}

export default function LobbyPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = use(params)
  const detail = getGameDetail(slug)
  if (!detail) notFound()

  const searchParams = useSearchParams()
  const krParam = parseInt(searchParams.get('kr') ?? '0')

  const availableRooms = ROOMS.filter(r => detail.stakeRooms.some(sr => sr.kr === r.kr))
  const defaultKr = availableRooms.find(r => r.kr === krParam)?.kr ?? availableRooms[0]?.kr ?? 10

  const [selectedKr, setSelectedKr] = useState(defaultKr)

  useEffect(() => {
    const kr = parseInt(searchParams.get('kr') ?? '0')
    const match = availableRooms.find(r => r.kr === kr)
    if (match) setSelectedKr(match.kr)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rake = Math.round(selectedKr * 2 * 0.1)
  const winnerGets = selectedKr * 2 - rake
  const gameLabel = detail.name
  const formatLabel = detail.format.split('·')[0].trim()
  const matchHref = `/play/${slug}/finding?kr=${selectedKr}`

  const standardRooms   = availableRooms.filter(r => !HIGH_ROLLER_KR.includes(r.kr))
  const highRollerRooms = availableRooms.filter(r => HIGH_ROLLER_KR.includes(r.kr))

  function RoomButton({ room, i }: { room: Room; i: number }) {
    const selected = selectedKr === room.kr
    return (
      <button
        onClick={() => setSelectedKr(room.kr)}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 16px 20px',
          borderLeft: i > 0 ? '1px solid var(--ink)' : 'none',
          background: selected ? 'var(--ink)' : 'transparent',
          color: selected ? 'var(--bone)' : 'var(--ink)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.15s',
        }}
      >
        {room.isHot && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            ...s.mono, fontSize: 8, color: 'var(--alarm)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
            HOT
          </div>
        )}
        <div style={{ ...s.mono, fontSize: 9, color: selected ? 'rgba(240,237,228,0.5)' : 'var(--ink-faint)', marginBottom: 8 }}>
          ROOM 0{i + 1}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {room.kr}
        </div>
        <div style={{ ...s.mono, fontSize: 9, color: selected ? 'rgba(240,237,228,0.5)' : 'var(--ink-faint)', marginBottom: 12 }}>
          KR
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: room.liveCount > 0 ? 'var(--alarm)' : selected ? 'rgba(240,237,228,0.3)' : 'var(--ink-ghost)', display: 'inline-block' }} />
          <span style={{ ...s.mono, fontSize: 9, color: selected ? 'rgba(240,237,228,0.6)' : 'var(--ink-faint)' }}>
            {room.liveCount} LIVE
          </span>
        </div>
        <div style={{ ...s.mono, fontSize: 9, color: selected ? 'rgba(240,237,228,0.4)' : 'var(--ink-ghost)', marginTop: 3 }}>
          WAIT {waitLabel(room.waitSec)}
        </div>
      </button>
    )
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="games" />
      <StadiumStrip />

      <main style={{ padding: `28px ${s.px} 80px`, maxWidth: 1200 }}>

        {/* Breadcrumb */}
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href={`/play/${slug}`} style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>{gameLabel}</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>LOBBY</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>
              {gameLabel} · {formatLabel}
            </div>
            <h1 style={{ ...s.display(80), lineHeight: 0.85 }}>PICK A ROOM.</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 14, maxWidth: 460 }}>
              Each room takes the stake on entry. Rake 10%. No decline once paired.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>YOUR BALANCE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {MOCK_BALANCE.toLocaleString('da-DK')} KR
            </div>
            <Link href="/wallet" style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)', textDecoration: 'none', marginTop: 4, display: 'block' }}>
              + DEPOSIT
            </Link>
          </div>
        </div>

        {/* Rooms */}
        <div style={{ border: '1.5px solid var(--ink)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${availableRooms.length}, 1fr)` }}>
            {availableRooms.map((room, i) => (
              <RoomButton key={room.kr} room={room} i={i} />
            ))}
          </div>
        </div>

        {/* Elite banner */}
        <Link href={`/play/${slug}/elite`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 2, padding: '18px 24px',
          background: 'var(--ink)', textDecoration: 'none',
          border: '1.5px solid var(--ink)',
        }}>
          <div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', letterSpacing: '0.20em', fontWeight: 700, marginBottom: 4 }}>● ELITE ROOM</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--bone)', letterSpacing: '-0.02em' }}>1,000+ KR · CUSTOM</div>
            <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', marginTop: 4, letterSpacing: '0.10em' }}>POST A CHALLENGE · SET YOUR TERMS</div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--alarm)', letterSpacing: '-0.01em' }}>ENTER →</span>
        </Link>

        {/* Math */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1.5px solid var(--ink)' }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>
            SELECTED · {selectedKr} KR ROOM
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
            {[
              { label: 'YOU PAY',      value: selectedKr,   color: 'var(--ink)' },
              { label: 'OPP PAYS',     value: selectedKr,   color: 'var(--ink)', prefix: '+' },
              { label: 'WINNER TAKES', value: winnerGets,   color: 'var(--alarm)', prefix: '=' },
              { label: 'ENTRY FEE',    value: rake / 2,     color: 'var(--ink-faint)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: i > 0 && i < 3 ? 12 : 0 }}>
                {item.prefix && (
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--ink-ghost)', marginBottom: 4, marginRight: 8 }}>
                    {item.prefix}
                  </span>
                )}
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, color: item.color, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {item.value}
                  </div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 24 }}>
          {selectedKr > MOCK_BALANCE ? (
            <>
              <div style={{
                display: 'block', textAlign: 'center',
                background: 'rgba(13,13,13,0.1)',
                color: 'var(--ink-ghost)',
                padding: '22px 32px',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.02em',
                cursor: 'not-allowed',
              }}>
                FIND OPPONENT — {selectedKr} KR →
              </div>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)', textAlign: 'center', marginTop: 10 }}>
                INSUFFICIENT BALANCE · <Link href="/wallet/deposit" style={{ color: 'var(--alarm)' }}>DEPOSIT →</Link>
              </div>
            </>
          ) : (
            <>
              <Link
                href={matchHref}
                style={{
                  display: 'block', textAlign: 'center',
                  background: 'var(--alarm)',
                  color: '#fff',
                  border: 'none',
                  padding: '22px 32px',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.02em',
                  textDecoration: 'none',
                }}
              >
                FIND OPPONENT — {selectedKr} KR →
              </Link>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 10 }}>
                SEARCH IS A COMMITMENT. NO DECLINE ONCE PAIRED.
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
