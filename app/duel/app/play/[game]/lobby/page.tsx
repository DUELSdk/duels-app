'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getGameDetail } from '@/lib/mock-data'
import { TIERS, customTier, type Tier } from '@/lib/tiers'
import { notFound } from 'next/navigation'
import { use } from 'react'

export default function LobbyPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = use(params)
  const detail = getGameDetail(slug)
  if (!detail) notFound()

  const [selectedId, setSelectedId] = useState<string>('serious')
  const [custom, setCustom] = useState('')

  const activeTier: Tier = custom && parseInt(custom) >= 501
    ? customTier(parseInt(custom))
    : TIERS.find(t => t.id === selectedId) ?? TIERS[2]

  const matchHref = `/play/${slug}/finding?tier=${activeTier.id === 'custom' ? `custom-${parseInt(custom)}` : activeTier.id}`

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="games" />

      {/* Breadcrumb */}
      <div style={{ padding: `16px ${s.px} 0`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/play" style={{ ...s.mono, color: 'var(--ink-faint)', textDecoration: 'none' }}>GAMES</Link>
        <span style={{ ...s.mono, color: 'var(--ink-ghost)' }}>/</span>
        <Link href={`/play/${slug}`} style={{ ...s.mono, color: 'var(--ink-faint)', textDecoration: 'none' }}>{detail.name}</Link>
        <span style={{ ...s.mono, color: 'var(--ink-ghost)' }}>/</span>
        <span style={{ ...s.mono }}>LOBBY</span>
      </div>

      <section style={{ padding: `40px ${s.px} 56px`, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 64, alignItems: 'start' }}>
        {/* Left */}
        <div>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>
            {detail.name} / LOBBY
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 80, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.88 }}>
            PICK A ROOM.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 16, maxWidth: 480, lineHeight: 1.5 }}>
            Fixed entry fee per player — platform earns that only. Winner takes the full stake pot.
          </p>

          {/* Tier grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginTop: 40 }}>
            {TIERS.map(tier => {
              const isSel = selectedId === tier.id && !custom
              return (
                <button
                  key={tier.id}
                  onClick={() => { setSelectedId(tier.id); setCustom('') }}
                  style={{
                    border: isSel ? '2px solid var(--ink)' : '1.5px solid var(--rule-soft)',
                    background: isSel ? 'var(--ink)' : 'transparent',
                    color: isSel ? 'var(--bone)' : 'var(--ink)',
                    padding: '20px 16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.1s',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em' }}>
                    {tier.stakeKr}
                    <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 4 }}>KR</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, marginTop: 8, color: isSel ? 'rgba(240,237,228,0.5)' : 'var(--ink-faint)' }}>
                    {tier.label} · {tier.entryFee} KR FEE
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, marginTop: 3, color: isSel ? 'rgba(240,237,228,0.4)' : 'var(--ink-ghost)' }}>
                    WIN {tier.winnerGets} KR
                  </div>
                </button>
              )
            })}
          </div>

          {/* Custom room */}
          <div style={{ marginTop: 2, border: '1.5px dashed var(--rule-soft)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>+ CUSTOM ROOM</div>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', marginTop: 3 }}>501 — 10.000 KR · 3% ENTRY FEE</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number" min={501} max={10000} placeholder="750"
                value={custom}
                onChange={e => { setCustom(e.target.value); setSelectedId('') }}
                style={{
                  width: 80, padding: '6px 10px',
                  border: '1.5px solid var(--ink)', background: 'var(--bone)',
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                  color: 'var(--ink)', outline: 'none',
                }}
              />
              <span style={{ ...s.mono, fontSize: 11 }}>KR</span>
            </div>
          </div>

          {/* Pot math */}
          <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid var(--rule-soft)', borderBottom: '1px solid var(--rule-soft)', display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ ...s.mono, fontSize: 14, fontWeight: 600 }}>{activeTier.stakeKr} KR</span>
            <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>each in</span>
            <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>−</span>
            <span style={{ ...s.mono, fontSize: 12 }}>{activeTier.entryFee} KR fee each</span>
            <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>=</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--alarm)' }}>
              {activeTier.winnerGets} KR
            </span>
            <span style={{ ...s.mono, color: 'var(--ink-faint)', fontSize: 10 }}>WINNER TAKES</span>
          </div>
        </div>

        {/* Right — CTA panel */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>
            SELECTED · {activeTier.label} · {activeTier.stakeKr} KR
          </div>

          <div style={{ background: 'var(--bone-2)', border: '1px solid var(--rule-soft)', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>YOU PUT IN</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{activeTier.stakeKr} KR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>OPP PUTS IN</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{activeTier.stakeKr} KR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>PLATFORM FEE</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{activeTier.entryFee * 2} KR total</span>
            </div>
            <div style={{ height: 1, background: 'var(--rule-soft)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>WINNER TAKES</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--alarm)' }}>
                {activeTier.winnerGets} KR
              </span>
            </div>
          </div>

          <Link href={matchHref} style={{
            display: 'block', textAlign: 'center',
            background: 'var(--alarm)', color: '#fff',
            border: 'none', padding: '20px 24px',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.04em',
            textDecoration: 'none',
          }}>
            FIND OPPONENT — {activeTier.stakeKr} KR →
          </Link>
          <p style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textAlign: 'center' }}>
            SEARCH IS A COMMITMENT. NO DECLINE ONCE PAIRED.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
