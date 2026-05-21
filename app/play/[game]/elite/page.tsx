'use client'

import { useState, use, CSSProperties } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { getGameDetail } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

// ── Dark palette (elite surface) ────────────────────────────────────────────
const D = {
  bg:        '#0a0a09',
  bgCard:    '#141412',
  bgFeat:    '#1c1b18',
  text:      '#f0ede4',
  soft:      'rgba(240,237,228,0.58)',
  faint:     'rgba(240,237,228,0.35)',
  ghost:     'rgba(240,237,228,0.18)',
  border:    'rgba(240,237,228,0.09)',
  borderMid: 'rgba(240,237,228,0.18)',
  alarm:     '#ef0000',
} as const

const mono = (size: number | string = 10): CSSProperties => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
})
const disp = (size: number | string): CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 900,
  fontSize: size,
  letterSpacing: '-0.03em',
  lineHeight: 0.86,
  textTransform: 'uppercase',
})

// ── Types ────────────────────────────────────────────────────────────────────
type Form = 'w' | 'l'
type Challenge = {
  id: string
  player: string
  record: string
  spec: string
  form: Form[]
  kr: number
  minsAgo: number
  featured?: boolean
}

const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c-sandman',  player: 'SANDMAN',    record: '22W · 14L', spec: 'ALL GAMES',            form: ['w','w','l','w','w'], kr: 3000, minsAgo: 22, featured: true },
  { id: 'c-laser',    player: 'LASERHAWK',  record: '31W · 8L',  spec: 'CARD DUEL SPECIALIST', form: ['w','w','w','l','w'], kr: 2500, minsAgo: 2  },
  { id: 'c-k8821',    player: 'k_8821',     record: '47W · 19L', spec: 'VETERAN · CARD DUEL',  form: ['l','w','w','w','l'], kr: 1500, minsAgo: 8  },
  { id: 'c-nova',     player: 'NOVASTRIKE', record: '18W · 5L',  spec: 'RISING · CYCLEDUEL',   form: ['w','l','w','w','w'], kr: 1000, minsAgo: 14 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('da-DK').replace(/,/g, '.') }
function calcWin(kr: number) { return kr * 2 - Math.round(kr * 2 * 0.1) }
function calcFee(kr: number) { return Math.round(kr * 2 * 0.1) / 2 }
function minsLeft(minsAgo: number) { return 30 - minsAgo }
function expirePct(minsAgo: number) { return Math.round((minsAgo / 30) * 100) }

// ── Sub-components ────────────────────────────────────────────────────────────
function FormDots({ form }: { form: Form[] }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {form.map((f, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: f === 'w' ? 'rgba(240,237,228,0.50)' : 'rgba(240,237,228,0.12)',
        }} />
      ))}
    </div>
  )
}

function ExpireBar({ minsAgo, urgent }: { minsAgo: number; urgent?: boolean }) {
  return (
    <div style={{ height: 2, background: D.border, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${expirePct(minsAgo)}%`,
        background: urgent ? D.alarm : D.borderMid,
      }} />
    </div>
  )
}

function MathRow({ label, value, dim, win }: { label: string; value: string; dim?: boolean; win?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0' }}>
      <span style={{ ...mono(9), color: D.ghost }}>{label}</span>
      <span style={{
        ...disp(win ? 32 : dim ? 20 : 26),
        color: win ? D.text : dim ? D.ghost : D.soft,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}<span style={{ ...mono(9), color: D.ghost, marginLeft: 2 }}>KR</span>
      </span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EliteRoomPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = use(params)
  const detail = getGameDetail(slug)
  if (!detail) notFound()

  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stakeRaw, setStakeRaw]     = useState('')
  const [posted, setPosted]         = useState(false)
  const [postedKr, setPostedKr]     = useState(0)

  const stake    = parseInt(stakeRaw) || 0
  const selected = challenges.find(c => c.id === selectedId) ?? null
  const totalKr  = challenges.reduce((s, c) => s + c.kr, 0)
  const biggest  = Math.max(...challenges.map(c => c.kr), 0)
  const openN    = challenges.length + (posted ? 1 : 0)

  function handleCardClick(id: string) {
    if (posted) return
    setSelectedId(prev => prev === id ? null : id)
  }

  function handlePost() {
    if (stake < 1000) return
    setPosted(true)
    setPostedKr(stake)
    setSelectedId(null)
  }

  function handleCancel() {
    setPosted(false)
    setPostedKr(0)
    setStakeRaw('')
  }

  function handleAccept(id: string) {
    setChallenges(prev => prev.filter(c => c.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const cardStyle = (c: Challenge, isSelected: boolean): CSSProperties => ({
    background: c.featured ? D.bgFeat : D.bgCard,
    border: `1px solid ${c.featured ? D.borderMid : D.border}`,
    borderTop: c.featured ? `2px solid ${D.alarm}` : undefined,
    outline: isSelected ? `1.5px solid ${D.ghost}` : undefined,
    outlineOffset: isSelected ? 2 : undefined,
    cursor: posted ? 'default' : 'pointer',
    transition: 'border-color 0.15s',
    marginBottom: 3,
  })

  const btnAccept: CSSProperties = {
    ...mono(10), fontWeight: 700,
    background: D.text, color: D.bg,
    padding: '11px 22px', border: `1.5px solid ${D.text}`,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
  }

  const btnCancel: CSSProperties = {
    ...mono(10), fontWeight: 600, color: D.faint,
    padding: '10px 18px', border: `1.5px solid ${D.borderMid}`,
    background: 'transparent', cursor: 'pointer',
  }

  const TICKER_ITEMS = [
    <><span style={{ color: D.alarm, marginRight: 6 }}>●</span>SANDMAN POSTED <strong style={{ color: 'rgba(240,237,228,0.6)', fontWeight: 600 }}>3.000 KR</strong> ELITE CHALLENGE</>,
    <>LASERHAWK POSTED <strong style={{ color: 'rgba(240,237,228,0.6)', fontWeight: 600 }}>2.500 KR</strong> CHALLENGE</>,
    <>k_8821 POSTED <strong style={{ color: 'rgba(240,237,228,0.6)', fontWeight: 600 }}>1.500 KR</strong> CHALLENGE</>,
    <>NOVASTRIKE POSTED <strong style={{ color: 'rgba(240,237,228,0.6)', fontWeight: 600 }}>1.000 KR</strong> CHALLENGE</>,
    <><span style={{ color: D.alarm, marginRight: 6 }}>●</span>ELITE ROOM · {openN} OPEN · {fmt(posted ? totalKr + postedKr : totalKr)} KR ON BOARD</>,
  ]
  const tickerAll = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      <style>{`
        @keyframes belt { to { transform: translateX(-50%); } }
        @keyframes blink {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.75); }
        }
        @keyframes dotanim {
          0%   { content:''; }
          25%  { content:'.'; }
          50%  { content:'..'; }
          75%  { content:'...'; }
        }
        .live-dot-elite {
          display: inline-block;
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef0000;
          animation: blink 1.8s ease-in-out infinite;
        }
        .dots-anim::after { content:''; animation: dotanim 1.6s steps(4,end) infinite; }
        .ch-el:hover { border-color: rgba(240,237,228,0.18) !important; background: #1c1b18 !important; }
        .btn-acc-el:hover { background: #ef0000 !important; border-color: #ef0000 !important; color: #fff !important; }
        .btn-canc-el:hover { border-color: #ef0000 !important; color: #ef0000 !important; }
        .btn-post-el:hover:not(:disabled) { background: #c40000 !important; }
        .btn-acc-full-el:hover { background: #ef0000 !important; color: #fff !important; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]:focus { border-color: #ef0000 !important; }
      `}</style>

    <div style={{ background: D.bg, color: D.text, minHeight: '100vh' }}>

      {/* Ticker */}
      <div style={{ height: 26, background: '#111110', borderBottom: `1px solid ${D.border}`, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'belt 40s linear infinite' }}>
          {tickerAll.map((item, i) => (
            <span key={i} style={{ ...mono(9), letterSpacing: '0.10em', textTransform: 'uppercase', color: D.ghost, padding: '0 40px' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <BroadcastNav activePage="games" dark />

      {/* Breadcrumb */}
      <div style={{ ...mono(10), color: D.ghost, padding: '16px 56px 0', display: 'flex', gap: 8 }}>
        <Link href={`/play/${slug}`} style={{ color: D.ghost }}>{detail.name}</Link>
        <span>/</span>
        <Link href={`/play/${slug}/lobby`} style={{ color: D.ghost }}>LOBBY</Link>
        <span>/</span>
        <span style={{ color: D.faint }}>ELITE ROOM</span>
      </div>

      {/* Header */}
      <div style={{ padding: '48px 56px 0' }}>
        <div style={{ ...mono(9), color: D.alarm, fontWeight: 700, letterSpacing: '0.22em', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: D.alarm, display: 'inline-block' }} />
          ELITE ROOM · {detail.name}
        </div>
        <div style={{ ...disp(172), fontSize: 'clamp(100px, 14vw, 172px)', marginBottom: 20 }}>
          ELITE.
        </div>
        <div style={{ ...mono(11), color: D.faint, marginBottom: 8 }}>
          1.000 KR MINIMUM · CUSTOM STAKES · CHALLENGE BOARD
        </div>
        <p style={{ fontSize: 15, color: D.soft, lineHeight: 1.5, marginBottom: 36 }}>
          Post your terms. First to accept locks the match.
        </p>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: `1px solid ${D.borderMid}`, borderBottom: `2px solid ${D.alarm}`, marginBottom: 40 }}>
          {[
            { lbl: 'OPEN CHALLENGES',     val: String(openN) },
            { lbl: 'KR ON BOARD',         val: fmt(posted ? totalKr + postedKr : totalKr) + ' KR' },
            { lbl: 'BIGGEST CHALLENGE',   val: biggest ? fmt(biggest) + ' KR' : '—' },
            { lbl: 'ENTRY FEE · EXPIRES', val: '10% · 30 MIN' },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '18px 24px', borderRight: i < 3 ? `1px solid ${D.border}` : 'none' }}>
              <div style={{ ...mono(9), color: D.ghost, marginBottom: 7 }}>{stat.lbl}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: i === 3 ? 18 : 30, letterSpacing: '-0.02em', color: i === 3 ? D.faint : D.text, fontVariantNumeric: 'tabular-nums' }}>
                {stat.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, padding: '0 56px 80px', alignItems: 'start' }}>

        {/* LEFT — Challenge board */}
        <div>
          <div style={{ ...mono(10), color: D.faint, fontWeight: 600, marginBottom: 6 }}>OPEN CHALLENGES · {openN}</div>
          <div style={{ height: 2, background: D.alarm, marginBottom: 3 }} />

          {/* Your posted challenge */}
          {posted && (
            <div style={{ background: 'rgba(239,0,0,0.05)', border: `1.5px solid ${D.alarm}`, marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px 0' }}>
                <div style={{ ...mono(9), color: D.ghost, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: D.alarm }}>●</span> YOUR CHALLENGE · JUST NOW
                </div>
                <div style={{ ...mono(8), color: D.alarm, fontWeight: 700 }}>WAITING FOR TAKER</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 20, padding: '10px 22px 0' }}>
                <div>
                  <div style={{ ...disp(52), color: D.alarm }}>YOU</div>
                  <div style={{ ...mono(9), color: D.ghost, marginTop: 10 }}>CHALLENGE IS LIVE</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...disp(56), fontVariantNumeric: 'tabular-nums' }}>{fmt(postedKr)}</div>
                  <div style={{ ...mono(9), color: D.ghost, marginTop: 3 }}>KR</div>
                  <div style={{ ...mono(9), color: D.soft, marginTop: 5 }}>WINNER: {fmt(calcWin(postedKr))} KR</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '14px 22px', marginTop: 14, borderTop: `1px solid ${D.border}` }}>
                <span style={{ ...mono(9), color: D.ghost, marginRight: 'auto' }} className="dots-anim">SEARCHING</span>
                <button onClick={handleCancel} style={btnCancel}>CANCEL</button>
              </div>
            </div>
          )}

          {/* Featured card */}
          {challenges.filter(c => c.featured).map(c => (
            <div key={c.id} style={cardStyle(c, selectedId === c.id)} onClick={() => handleCardClick(c.id)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px 0' }}>
                <div style={{ ...mono(9), color: D.ghost, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: D.alarm }}>●</span> OPEN · {c.minsAgo} MIN AGO
                </div>
                <div style={{ ...mono(8), color: D.alarm, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: D.alarm, display: 'inline-block' }} />
                  HIGHEST ON BOARD
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 20, padding: '10px 22px 0' }}>
                <div>
                  <div style={{ ...disp(80) }}>{c.player}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                    <span style={{ ...mono(10), color: D.soft }}>{c.record}</span>
                    <span style={{ ...mono(9), color: D.ghost }}>{c.spec}</span>
                    <FormDots form={c.form} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...disp(80), fontVariantNumeric: 'tabular-nums' }}>{fmt(c.kr)}</div>
                  <div style={{ ...mono(9), color: D.ghost, marginTop: 3 }}>KR STAKE</div>
                  <div style={{ ...mono(9), color: D.soft, marginTop: 5 }}>WINNER TAKES {fmt(calcWin(c.kr))} KR</div>
                </div>
              </div>
              <ExpireBar minsAgo={c.minsAgo} urgent={minsLeft(c.minsAgo) <= 10} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '14px 22px', borderTop: `1px solid ${D.border}` }}>
                <span style={{ ...mono(9), color: D.alarm, marginRight: 'auto' }}>{minsLeft(c.minsAgo)} MIN LEFT</span>
                <button onClick={e => { e.stopPropagation(); handleAccept(c.id) }} style={btnAccept}>
                  ACCEPT CHALLENGE →
                  <span style={{ ...mono(9), fontWeight: 400, opacity: 0.45 }}>WIN {fmt(calcWin(c.kr))} KR</span>
                </button>
              </div>
            </div>
          ))}

          {/* Grid: smaller cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {challenges.filter(c => !c.featured).map(c => {
              const urgent = minsLeft(c.minsAgo) <= 10
              return (
                <div key={c.id} style={cardStyle(c, selectedId === c.id)} onClick={() => handleCardClick(c.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '14px 22px 0' }}>
                    <div style={{ ...mono(9), color: D.ghost, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: D.alarm }}>●</span> OPEN · {c.minsAgo} MIN AGO
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 16, padding: '10px 22px 0' }}>
                    <div>
                      <div style={{ ...disp(36) }}>{c.player}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <span style={{ ...mono(10), color: D.soft }}>{c.record}</span>
                        <FormDots form={c.form} />
                      </div>
                      <div style={{ ...mono(9), color: D.ghost, marginTop: 5 }}>{c.spec}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ ...disp(40), fontVariantNumeric: 'tabular-nums' }}>{fmt(c.kr)}</div>
                      <div style={{ ...mono(9), color: D.ghost, marginTop: 3 }}>KR</div>
                      <div style={{ ...mono(9), color: D.soft, marginTop: 4 }}>WIN {fmt(calcWin(c.kr))} KR</div>
                    </div>
                  </div>
                  <ExpireBar minsAgo={c.minsAgo} urgent={urgent} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '12px 22px', borderTop: `1px solid ${D.border}` }}>
                    <span style={{ ...mono(9), color: urgent ? D.alarm : D.ghost, marginRight: 'auto' }}>
                      {minsLeft(c.minsAgo)} MIN LEFT
                    </span>
                    <button onClick={e => { e.stopPropagation(); handleAccept(c.id) }} style={{ ...btnAccept, padding: '10px 18px' }}>
                      ACCEPT →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {challenges.length === 0 && !posted && (
            <div style={{ ...mono(10), color: D.ghost, padding: '24px 0' }}>NO OPEN CHALLENGES. POST ONE.</div>
          )}
        </div>

        {/* RIGHT — Info panel or Post panel */}
        <div style={{ position: 'sticky', top: 64 }}>

          {selected && !posted ? (
            /* Info panel */
            <div style={{ background: D.bgCard, border: `1px solid ${D.borderMid}` }}>
              <button onClick={() => setSelectedId(null)} style={{ ...btnCancel, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderBottom: `1px solid ${D.border}`, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
                ← BACK TO POST
              </button>
              <div style={{ padding: '24px 24px 0' }}>
                <div style={{ ...disp(64), marginBottom: 10 }}>{selected.player}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                  <span style={{ ...mono(10), color: D.soft }}>{selected.record}</span>
                  <span style={{ ...mono(9), color: D.ghost }}>{selected.spec}</span>
                  <FormDots form={selected.form} />
                </div>
                <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: 20, marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <MathRow label="THEIR STAKE"            value={fmt(selected.kr)} />
                  <MathRow label="+ YOUR STAKE"           value={fmt(selected.kr)} />
                  <div style={{ height: 1, background: D.borderMid, margin: '6px 0' }} />
                  <MathRow label="WINNER TAKES"           value={fmt(calcWin(selected.kr))} win />
                  <MathRow label="ENTRY FEE · PER PLAYER" value={fmt(calcFee(selected.kr))} dim />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...mono(9), color: D.ghost }}>EXPIRES</span>
                  <span style={{ ...mono(9), fontWeight: 600, color: minsLeft(selected.minsAgo) <= 10 ? D.alarm : D.faint }}>
                    {minsLeft(selected.minsAgo)} MIN LEFT
                  </span>
                </div>
                <ExpireBar minsAgo={selected.minsAgo} urgent={minsLeft(selected.minsAgo) <= 10} />
              </div>
              <div style={{ padding: '20px 24px 24px' }}>
                <button
                  onClick={() => { handleAccept(selected.id); setSelectedId(null) }}
                  style={{
                    width: '100%', background: D.text, color: D.bg, padding: '20px 24px',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
                    letterSpacing: '0.02em', textTransform: 'uppercase',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  }}
                >
                  ACCEPT →
                  <span style={{ ...mono(10), fontWeight: 400, opacity: 0.45 }}>WIN {fmt(calcWin(selected.kr))} KR</span>
                </button>
              </div>
            </div>
          ) : !posted ? (
            /* Post panel */
            <div style={{ background: D.bgCard, border: `1px solid ${D.borderMid}`, padding: '28px 24px 24px' }}>
              <div style={{ ...mono(9), fontWeight: 600, color: D.faint, marginBottom: 6 }}>POST A CHALLENGE</div>
              <div style={{ height: 2, background: D.alarm, marginBottom: 22 }} />
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <input
                  type="number"
                  value={stakeRaw}
                  onChange={e => setStakeRaw(e.target.value)}
                  placeholder="1.000"
                  min={1000}
                  step={100}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
                    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                    color: D.text, background: D.bg,
                    border: `1.5px solid ${D.borderMid}`,
                    padding: '12px 56px 12px 18px', outline: 'none',
                  } as CSSProperties}
                />
                <span style={{ ...mono(11), color: D.faint, position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>KR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(9), color: D.ghost, marginBottom: 24 }}>
                <span>MIN 1.000 · MAX 2.450</span>
                <span>BALANCE: 2.450 KR</span>
              </div>
              <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: 20, marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <MathRow label="YOU PAY"                  value={stake ? fmt(stake) : '—'} />
                <MathRow label="+ OPP PAYS"               value={stake ? fmt(stake) : '—'} />
                <div style={{ height: 1, background: D.borderMid, margin: '6px 0' }} />
                <MathRow label="WINNER TAKES"             value={stake ? fmt(calcWin(stake)) : '—'} win />
                <MathRow label="ENTRY FEE · PER PLAYER"  value={stake ? fmt(calcFee(stake)) : '—'} dim />
              </div>
              <button
                onClick={handlePost}
                disabled={stake < 1000}
                style={{
                  width: '100%', padding: '20px 24px',
                  background: stake >= 1000 ? D.alarm : D.border,
                  color: stake >= 1000 ? '#fff' : D.ghost,
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  border: 'none', cursor: stake >= 1000 ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                {stake >= 1000 ? `POST — ${fmt(stake)} KR →` : 'POST CHALLENGE →'}
              </button>
              <div style={{ ...mono(9), color: D.ghost, textAlign: 'center', lineHeight: 1.7 }}>
                1 OPEN CHALLENGE PER PLAYER.<br />
                EXPIRES IN 30 MIN IF NOT ACCEPTED.<br />
                CANCEL ANYTIME BEFORE MATCHED.
              </div>
            </div>
          ) : (
            /* Posted state */
            <div style={{ border: `1.5px solid ${D.alarm}`, background: 'rgba(239,0,0,0.06)', padding: '22px 20px' }}>
              <div style={{ ...mono(9), fontWeight: 700, letterSpacing: '0.18em', color: D.alarm, display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <span className="live-dot-elite" />
                YOUR CHALLENGE IS LIVE
              </div>
              <div style={{ ...disp(52), fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{fmt(postedKr)} KR</div>
              <div style={{ ...mono(9), color: D.ghost, marginBottom: 16 }}>{detail.name} · JUST NOW</div>
              <div style={{ ...mono(9), color: D.faint, marginBottom: 16 }} className="dots-anim">SEARCHING FOR CHALLENGER</div>
              <button onClick={handleCancel} style={{ ...btnCancel, width: '100%', display: 'flex', justifyContent: 'center' }}>
                CANCEL CHALLENGE
              </button>
            </div>
          )}
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${D.border}`, padding: '20px 56px', ...mono(9), color: D.ghost, textAlign: 'center' }}>
        DUEL · DK · EST.2025 · 18+ · PLAY WITHIN MEANS · SPILLELOVEN EXEMPT
      </footer>
    </div>
    </>
  )
}
