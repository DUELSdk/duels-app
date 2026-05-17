'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.1em',
}

const display = (size: number): React.CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: size,
  textTransform: 'uppercase' as const,
  letterSpacing: '-0.02em',
  lineHeight: 0.88,
})

/* 7 squares cycling alarm colour — matches bundle SearchDots */
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

function FindingContent({ game, kr }: { game: string; kr: number }) {
  const router = useRouter()
  const [phase, setPhase] = useState<'finding' | 'matched'>('finding')
  const [sec, setSec] = useState(0)
  const [progress, setProgress] = useState(0)

  const gameLabel = game === 'card-duel' ? 'CARD DUEL'
    : game === 'cycleduel' ? 'CYCLEDUEL'
    : 'DROPDUEL'

  const myHandle = 'NOVASTRIKE'
  const BOT_NAME = 'BOT'

  /* Elapsed timer during search */
  useEffect(() => {
    const id = setInterval(() => setSec(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  /* Transition to matched after 3s */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('matched'), 3000)
    return () => clearTimeout(t1)
  }, [])

  /* Progress bar fill after matched */
  useEffect(() => {
    if (phase !== 'matched') return
    const start = Date.now()
    const duration = 3000
    const tick = () => {
      const pct = Math.min((Date.now() - start) / duration, 1)
      setProgress(pct)
      if (pct < 1) requestAnimationFrame(tick)
      else router.push(`/play/${game}/match?kr=${kr}`)
    }
    requestAnimationFrame(tick)
  }, [phase, game, kr, router])

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

      <AnimatePresence mode="wait">
        {phase === 'finding' ? (

          /* ── FINDING OPPONENT ── */
          <motion.div
            key="finding"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {/* Centre */}
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

            {/* Bottom — criteria + cancel */}
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
                      }}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => router.push(`/play/${game}/lobby`)} style={{
                display: 'block', width: '100%', marginTop: 16, padding: '18px 0',
                fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.10em',
                textTransform: 'uppercase' as const,
                color: 'var(--bone-on-dark)', background: 'transparent',
                border: '1px solid rgba(240,237,228,0.3)', cursor: 'pointer',
              }}>
                CANCEL SEARCH · REFUND STAKE
              </button>
            </section>
          </motion.div>

        ) : (

          /* ── OPPONENT FOUND (PairedDesktop) ── */
          <motion.div
            key="matched"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              flex: 1,
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', inset: 60,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ ...mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: 'var(--alarm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
                MATCHED
              </div>

              <div style={{ ...display(220), color: 'var(--bone-on-dark)', lineHeight: 0.85, marginTop: 8 }}>
                VS.
              </div>

              <div style={{ width: 200, height: 3, background: 'var(--alarm)', margin: '20px auto 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 24 }}>
                <div style={{ width: 240, textAlign: 'right', paddingRight: 40 }}>
                  <div style={{ ...mono, fontSize: 11, color: 'var(--bone-ghost)' }}>YOU</div>
                  <div style={{ ...display(42), color: 'var(--bone-on-dark)', marginTop: 4 }}>{myHandle}</div>
                  <div style={{ ...mono, fontSize: 10, color: 'var(--bone-faint)', marginTop: 4 }}>· 28 ms ·</div>
                </div>
                <div style={{ width: 1, height: 64, background: 'rgba(240,237,228,0.18)', flexShrink: 0 }} />
                <div style={{ width: 240, textAlign: 'left', paddingLeft: 40 }}>
                  <div style={{ ...mono, fontSize: 11, color: 'var(--bone-ghost)' }}>OPP</div>
                  <div style={{ ...display(42), color: 'var(--alarm)', marginTop: 4 }}>{BOT_NAME}</div>
                  <div style={{ ...mono, fontSize: 10, color: 'var(--bone-faint)', marginTop: 4 }}>· STRANGER ·</div>
                </div>
              </div>

              <div style={{ width: 480, marginTop: 56 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ ...mono, fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>BUILDING TABLE</span>
                  <span style={{ ...mono, fontSize: 10, color: 'var(--bone-ghost)' }}>{(progress * 3.5).toFixed(1)}s</span>
                </div>
                <div style={{ height: 4, background: 'rgba(240,237,228,0.10)', position: 'relative', overflow: 'hidden' }}>
                  <motion.div
                    style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--alarm)' }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div style={{ ...mono, fontSize: 10, color: 'var(--bone-faint)', textAlign: 'center', marginTop: 14, letterSpacing: '0.08em' }}>
                  NO DECLINE. NO REMATCH GUARANTEE. ONE FIGHT.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FindingWrapper({ game }: { game: string }) {
  const searchParams = useSearchParams()
  const kr = parseInt(searchParams.get('kr') ?? '50') || 50
  return <FindingContent game={game} kr={kr} />
}

export default function FindingPage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = use(params)
  return (
    <Suspense fallback={<div style={{ background: 'var(--concrete)', minHeight: '100vh' }} />}>
      <FindingWrapper game={game} />
    </Suspense>
  )
}
