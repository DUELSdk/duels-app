'use client'

import { useState, useEffect, Suspense } from 'react'
import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { getGameDetail } from '@/lib/mock-data'
import { useBalance } from '@/hooks/useBalance'
import { useSession } from '@/hooks/useSession'
import { TIERS } from '@/lib/tiers'
import { notFound } from 'next/navigation'

type Room = { tierId: string; kr: number; isHot?: boolean }

const ROOMS: Room[] = [
  { tierId: 'starter',  kr: 10  },
  { tierId: 'standard', kr: 25  },
  { tierId: 'serious',  kr: 50,  isHot: true },
  { tierId: 'high',     kr: 100 },
  { tierId: 'elite',    kr: 250 },
  { tierId: 'max',      kr: 500 },
]

function LobbyContent({ slug }: { slug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const detail = getGameDetail(slug)
  if (!detail) notFound()

  const { balance } = useBalance()
  const { user, loading: sessionLoading } = useSession()

  const krParam      = parseInt(searchParams.get('kr') ?? '0')
  const availRooms   = ROOMS.filter(r => detail.stakeRooms.some(sr => sr.kr === r.kr))
  const defaultKr    = availRooms.find(r => r.kr === krParam)?.kr ?? availRooms[0]?.kr ?? 10

  const [selectedKr, setSelectedKr] = useState(defaultKr)
  const [joining, setJoining]        = useState(false)
  const [joinError, setJoinError]    = useState<string | null>(null)

  useEffect(() => {
    const kr = parseInt(searchParams.get('kr') ?? '0')
    const match = availRooms.find(r => r.kr === kr)
    if (match) setSelectedKr(match.kr)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!sessionLoading && !user) router.replace('/auth')
  }, [user, sessionLoading, router])

  const selectedRoom = availRooms.find(r => r.kr === selectedKr)
  const tier = TIERS.find(t => t.stakeKr === selectedKr)
  const winnerGets = tier?.winnerGets ?? selectedKr * 2 - Math.round(selectedKr * 2 * 0.1)
  const entryFee   = tier?.entryFee ?? Math.round(selectedKr * 0.1)
  const gameLabel  = detail.name
  const hasEnough  = balance !== null && balance >= selectedKr

  async function handleJoin() {
    if (!selectedRoom || !hasEnough || joining) return
    setJoining(true)
    setJoinError(null)

    const res = await fetch('/api/queue/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: slug, tierId: selectedRoom.tierId, stakeKr: selectedKr }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      setJoinError(data.error ?? 'SOMETHING WENT WRONG')
      setJoining(false)
      return
    }

    // Navigate to finding page with queue context
    router.push(`/play/${slug}/finding?kr=${selectedKr}&queueId=${data.queue_id}&matchId=${data.match_id ?? ''}`)
  }

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
          cursor: 'pointer', position: 'relative',
          transition: 'background 0.15s',
        }}
      >
        {room.isHot && (
          <div style={{ position: 'absolute', top: 8, right: 8, ...s.mono, fontSize: 8, color: 'var(--alarm)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
            HOT
          </div>
        )}
        <div style={{ ...s.mono, fontSize: 9, color: selected ? 'rgba(240,237,228,0.5)' : 'var(--ink-faint)', marginBottom: 8 }}>
          ROOM 0{i + 1}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {room.kr}
        </div>
        <div style={{ ...s.mono, fontSize: 9, color: selected ? 'rgba(240,237,228,0.5)' : 'var(--ink-faint)', marginBottom: 12 }}>KR</div>
      </button>
    )
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="games" />
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
              {gameLabel}
            </div>
            <h1 style={{ ...s.display(80), lineHeight: 0.85 }}>PICK A ROOM.</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 14, maxWidth: 460 }}>
              Stake is deducted on entry. No decline once paired.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>YOUR BALANCE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {balance !== null ? balance.toLocaleString('da-DK') : '—'} KR
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div style={{ border: '1.5px solid var(--ink)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${availRooms.length}, 1fr)` }}>
            {availRooms.map((room, i) => (
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
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', letterSpacing: '0.20em', fontWeight: 700, marginBottom: 4 }}>● ELITE ROOM · 1,000 KR MINIMUM</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--bone)', letterSpacing: '-0.02em' }}>1,000+ KR · CHALLENGE BOARD</div>
            <div style={{ ...s.mono, fontSize: 9, color: 'rgba(240,237,228,0.4)', marginTop: 4, letterSpacing: '0.10em' }}>NO AUTO-QUEUE · POST YOUR TERMS · SET YOUR STAKE</div>
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
              { label: 'YOU PAY',      value: selectedKr,  color: 'var(--ink)' },
              { label: 'OPP PAYS',     value: selectedKr,  color: 'var(--ink)', prefix: '+' },
              { label: 'WINNER TAKES', value: winnerGets,  color: 'var(--alarm)', prefix: '=' },
              { label: 'ENTRY FEE',    value: entryFee,    color: 'var(--ink-faint)' },
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
          {joinError && (
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)', textAlign: 'center', marginBottom: 12 }}>
              {joinError}
            </div>
          )}

          {!hasEnough ? (
            <>
              <div style={{
                display: 'block', textAlign: 'center',
                background: 'rgba(13,13,13,0.1)', color: 'var(--ink-ghost)',
                padding: '22px 32px',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.02em',
                cursor: 'not-allowed',
              }}>
                FIND OPPONENT — {selectedKr} KR →
              </div>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)', textAlign: 'center', marginTop: 10 }}>
                INSUFFICIENT BALANCE
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleJoin}
                disabled={joining}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: joining ? 'rgba(13,13,13,0.6)' : 'var(--alarm)',
                  color: '#fff', border: 'none',
                  padding: '22px 32px',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.02em',
                  cursor: joining ? 'not-allowed' : 'pointer',
                }}
              >
                {joining ? 'JOINING QUEUE…' : `FIND OPPONENT — ${selectedKr} KR →`}
              </button>
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

export default function LobbyPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = use(params)
  return (
    <Suspense fallback={<div style={{ background: 'var(--bone)', minHeight: '100vh' }} />}>
      <LobbyContent slug={slug} />
    </Suspense>
  )
}
