'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.1em',
}

const display = (size: number | string): React.CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: typeof size === 'number' ? `${size}px` : size,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  lineHeight: 0.88,
})

/* ── Hooks ────────────────────────────────────────────────────────────────── */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%*+'

function useScramble(target: string, { delay = 1000, duration = 700 } = {}) {
  const [value, setValue] = useState('')
  useEffect(() => {
    let frame: number
    let startTime: number | null = null
    const timer = setTimeout(() => {
      const step = (ts: number) => {
        if (!startTime) startTime = ts
        const progress = Math.min((ts - startTime) / duration, 1)
        const locked = Math.floor(progress * target.length)
        let result = target.slice(0, locked)
        for (let i = locked; i < target.length; i++) {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }
        setValue(result)
        if (progress < 1) frame = requestAnimationFrame(step)
        else setValue(target)
      }
      frame = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(timer); cancelAnimationFrame(frame) }
  }, [target, delay, duration])
  return value
}

/* ── CSS ──────────────────────────────────────────────────────────────────── */

const P6_CSS = `
  .p6-root {
    position: fixed; inset: 0;
    background: #0a0a0a;
    overflow: hidden;
    z-index: 20;
  }

  /* 3-column: YOU | seam | OPP */
  .p6-body {
    display: grid;
    grid-template-columns: 1fr 90px 1fr;
    height: 100%;
  }

  /* YOU — left panel, slides in from left */
  .p6-banner.you {
    background: #131311;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px;
    overflow: hidden;
    transform: translateX(-100%);
    animation: p6-slide-you 0.6s 0.35s forwards cubic-bezier(0.2,0.85,0.3,1);
  }

  /* OPP — right panel, slides in from right */
  .p6-banner.opp {
    background: #0a0a0a;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px;
    overflow: hidden;
    transform: translateX(100%);
    animation: p6-slide-opp 0.6s 0.45s forwards cubic-bezier(0.2,0.85,0.3,1);
  }

  /* Seam — vertical RED column, slams down from top */
  .p6-seam {
    background: var(--alarm);
    transform: scaleY(0);
    transform-origin: top center;
    animation: p6-slam 0.45s 0.1s forwards cubic-bezier(0.85,0,0.15,1);
  }

  /* VS — centered on seam */
  .p6-vs {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-display); font-weight: 900;
    font-size: clamp(80px, 14vw, 200px);
    letter-spacing: -0.04em; line-height: 1;
    color: #fff; text-transform: uppercase;
    opacity: 0;
    animation: p6-vs-scale-in 0.4s 0.5s forwards cubic-bezier(0.2,0.7,0.3,1.4);
    pointer-events: none;
  }

  /* Tagline — bottom center */
  .p6-meta-seam {
    position: absolute;
    bottom: 28px; left: 0; right: 0; text-align: center;
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.18em;
    color: rgba(240,237,228,0.35);
    opacity: 0;
    animation: p6-fade-in 0.4s 0.8s forwards;
    pointer-events: none;
  }

  .p6-label {
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.2em;
    color: rgba(240,237,228,0.35);
    opacity: 0;
    animation: p6-fade-in 0.5s 1.4s forwards;
  }

  .p6-name {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(48px, 7vw, 110px);
    text-transform: uppercase;
    letter-spacing: -0.02em; line-height: 0.88;
    color: var(--bone-on-dark);
    opacity: 0;
  }
  .p6-banner.you .p6-name { animation: p6-name-in 0.5s 0.9s forwards ease-out; }
  .p6-banner.opp .p6-name { animation: p6-name-in 0.5s 1.0s forwards ease-out; }

  .p6-meta {
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.12em;
    color: rgba(240,237,228,0.25);
    opacity: 0;
    animation: p6-fade-in 0.4s 1.6s forwards;
  }

  .p6-blackout {
    position: absolute; inset: 0;
    background: #0a0a0a;
    opacity: 0; pointer-events: none;
  }

  /* ── Enter keyframes ─────────────────────────────────── */
  @keyframes p6-slide-you  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
  @keyframes p6-slide-opp  { from{transform:translateX(100%)}  to{transform:translateX(0)} }
  @keyframes p6-slam {
    0%  { transform:scaleY(0) }
    60% { transform:scaleY(1.02) }
    100%{ transform:scaleY(1) }
  }
  @keyframes p6-vs-scale-in {
    from { opacity:0; transform:translate(-50%,-50%) scale(0.85) }
    to   { opacity:1; transform:translate(-50%,-50%) scale(1) }
  }
  @keyframes p6-name-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes p6-fade-in { from{opacity:0} to{opacity:1} }

  /* ── Exit overrides ──────────────────────────────────── */
  .p6-root.exiting .p6-banner.you {
    animation: p6-exit-left 0.6s forwards cubic-bezier(0.55,0,0.85,0.45) !important;
  }
  .p6-root.exiting .p6-banner.opp {
    animation: p6-exit-right 0.6s forwards cubic-bezier(0.55,0,0.85,0.45) !important;
  }
  .p6-root.exiting .p6-seam {
    transform-origin: center center;
    animation: p6-seam-out 0.9s 0.05s forwards cubic-bezier(0.6,0,0.4,1) !important;
  }
  .p6-root.exiting .p6-vs {
    animation: p6-vs-out 0.5s 0.05s forwards ease-in !important;
  }
  .p6-root.exiting .p6-label,
  .p6-root.exiting .p6-name,
  .p6-root.exiting .p6-meta,
  .p6-root.exiting .p6-meta-seam {
    animation: p6-fade-out 0.2s forwards !important;
  }
  .p6-root.exiting .p6-blackout {
    animation: p6-blackout 0.4s 0.85s forwards ease-in;
  }

  /* ── Exit keyframes ──────────────────────────────────── */
  @keyframes p6-exit-left {
    0%   { transform: translate(0,0) skewY(0) }
    100% { transform: translate(-115%,0) skewY(4deg) }
  }
  @keyframes p6-exit-right {
    0%   { transform: translate(0,0) skewY(0) }
    100% { transform: translate(115%,0) skewY(-4deg) }
  }
  @keyframes p6-seam-out {
    0%   { transform: scaleX(1) scaleY(1); background: var(--alarm); }
    25%  { transform: scaleX(1.4) scaleY(1.02); background: #fff; }
    100% { transform: scaleX(22) scaleY(1); background: var(--alarm); }
  }
  @keyframes p6-vs-out {
    0%   { opacity:1; transform:translate(-50%,-50%) scale(1); color:#fff; }
    50%  { opacity:1; transform:translate(-50%,-50%) scale(1.4); color:#000; }
    100% { opacity:0; transform:translate(-50%,-50%) scale(2.2); color:#000; }
  }
  @keyframes p6-fade-out { to { opacity:0 } }
  @keyframes p6-blackout { to { opacity:1 } }
`

/* ── SearchDots ───────────────────────────────────────────────────────────── */

function SearchDots() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT(x => x + 1), 240)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
      {[0,1,2,3,4,5,6].map(i => (
        <span key={i} style={{
          width: 10, height: 10,
          background: (t % 7) === i ? 'var(--alarm)' : 'rgba(240,237,228,0.25)',
          transition: 'background 0.15s',
          display: 'inline-block',
        }} />
      ))}
    </div>
  )
}

/* ── TopBar ───────────────────────────────────────────────────────────────── */

function TopBar({ game, kr, phase }: { game: string; kr: number; phase: 'finding' | 'matched' }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', padding: '14px 28px',
      borderBottom: '1px solid rgba(240,237,228,0.14)',
      background: 'var(--concrete-2)',
    }}>
      <span style={{ ...mono, fontSize: 11, color: 'var(--bone-faint)' }}>
        MATCH — · {game} · {kr} KR ROOM
      </span>
      <span style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--alarm)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
        {phase === 'finding' ? 'FINDING OPPONENT' : 'OPPONENT FOUND'}
      </span>
      <span style={{ ...mono, fontSize: 11, color: 'var(--bone-ghost)', textAlign: 'right' }}>
        POT {kr * 2 - Math.round(kr * 2 * 0.1)} KR
      </span>
    </div>
  )
}

/* ── PairedScreen — V6 ────────────────────────────────────────────────────── */

function PairedScreen({ game, kr, me, opp, onDone }: {
  game: string; kr: number; me: string; opp: string; onDone: () => void
}) {
  const [exiting, setExiting] = useState(false)
  const oppName = useScramble(opp, { delay: 700, duration: 600 })

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 3500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(onDone, 1400)
    return () => clearTimeout(t)
  }, [exiting, onDone])

  return (
    <div className={`p6-root${exiting ? ' exiting' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: P6_CSS }} />

      {/* 3-row grid: YOU / seam / OPP */}
      <div className="p6-body">
        <div className="p6-banner you">
          <div className="p6-label">YOU</div>
          <div className="p6-name">{me}</div>
          <div className="p6-meta">{kr} KR · {game}</div>
        </div>

        <div className="p6-seam" />

        <div className="p6-banner opp">
          <div className="p6-label">OPP</div>
          <div className="p6-name">{oppName}</div>
          <div className="p6-meta">NO DECLINE · ONE FIGHT</div>
        </div>
      </div>

      {/* VS — centered on seam at viewport 50% */}
      <div className="p6-vs">VS.</div>

      {/* Tagline below VS */}
      <div className="p6-meta-seam">NO DECLINE · ONE FIGHT</div>

      <div className="p6-blackout" />
    </div>
  )
}

/* ── FindingContent ───────────────────────────────────────────────────────── */

function FindingContent({ game, kr, preview }: { game: string; kr: number; preview: string | null }) {
  const router = useRouter()
  const [phase, setPhase] = useState<'finding' | 'matched'>(preview === 'paired' ? 'matched' : 'finding')
  const [sec, setSec] = useState(0)

  const gameLabel = game === 'card-duel' ? 'CARD DUEL'
    : game === 'cycleduel' ? 'CYCLEDUEL'
    : 'DROPDUEL'

  const myHandle  = 'NOVASTRIKE'
  const oppHandle = 'REAPER'

  useEffect(() => {
    const id = setInterval(() => setSec(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (preview) return
    const t = setTimeout(() => setPhase('matched'), 3000)
    return () => clearTimeout(t)
  }, [preview])

  const handleDone = useCallback(() => {
    if (preview === 'paired') {
      setPhase('matched')  // loop: replay PairedScreen on done
    } else {
      router.push(`/play/${game}/match?kr=${kr}`)
    }
  }, [router, game, kr, preview])

  const elapsedMin = String(Math.floor(sec / 60)).padStart(2, '0')
  const elapsedSec = String(sec % 60).padStart(2, '0')

  const criteria = [
    ['GAME',   gameLabel],
    ['STAKE',  `${kr} KR`],
    ['FORMAT', '1V1'],
    ['POOL',   '14 ELIGIBLE'],
  ]

  return (
    <div style={{ background: 'var(--concrete)', color: 'var(--bone-on-dark)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar game={gameLabel} kr={kr} phase={phase} />

      {phase === 'finding' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <section style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: '64px 56px', textAlign: 'center',
          }}>
            <div style={{ ...mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: 'var(--money)' }}>
              ● {kr} KR ROOM · {gameLabel}
            </div>
            <div style={{ ...display(220), color: 'var(--bone-on-dark)', lineHeight: 0.85, marginTop: 14 }}>
              SEARCHING.
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 22, color: 'var(--bone-faint)', marginTop: 12,
            }}>
              Pairing you with a player in the same room.
            </div>
            <div style={{ marginTop: 40 }}>
              <SearchDots />
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 56, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
              color: 'var(--bone-on-dark)', marginTop: 36,
            }}>
              {elapsedMin}:{elapsedSec}
            </div>
            <div style={{ ...mono, fontSize: 11, color: 'var(--bone-faint)', letterSpacing: '0.14em', marginTop: 6 }}>
              ELAPSED · AVG WAIT 6s
            </div>
          </section>

          <section style={{ padding: '24px 56px 32px' }}>
            <div style={{ padding: '24px 32px', border: '1px solid rgba(240,237,228,0.18)' }}>
              <div style={{ ...mono, fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
                SEARCH CRITERIA
              </div>
              <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', justifyContent: 'center' }}>
                {criteria.map(([l, v]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ ...mono, fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 4 }}>{l}</div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 32, letterSpacing: '-0.02em', color: 'var(--bone-on-dark)', lineHeight: 1,
                    }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => router.push(`/play/${game}/lobby`)} style={{
              display: 'block', width: '100%', marginTop: 16, padding: '18px 0',
              fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'var(--bone-on-dark)', background: 'transparent',
              border: '1px solid rgba(240,237,228,0.3)', cursor: 'pointer',
            }}>
              CANCEL SEARCH · REFUND STAKE
            </button>
          </section>
        </div>
      ) : (
        <PairedScreen
          game={gameLabel}
          kr={kr}
          me={myHandle}
          opp={oppHandle}
          onDone={handleDone}
        />
      )}
    </div>
  )
}

function FindingWrapper({ game }: { game: string }) {
  const searchParams = useSearchParams()
  const kr = parseInt(searchParams.get('kr') ?? '50') || 50
  const preview = searchParams.get('preview')
  return <FindingContent game={game} kr={kr} preview={preview} />
}

export default function FindingPage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = use(params)
  return (
    <Suspense fallback={<div style={{ background: 'var(--concrete)', minHeight: '100vh' }} />}>
      <FindingWrapper game={game} />
    </Suspense>
  )
}
