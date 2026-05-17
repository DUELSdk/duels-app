'use client'

import { useState, useEffect } from 'react'

const OPP_CARDS = ['R','S','P','R','S','P','R','S','P']
const YOU_CARDS = ['P','R','S','S','R','P','P','R','S']

function result(o: string, y: string): 'win' | 'loss' | 'tie' {
  if (o === y) return 'tie'
  if ((y === 'R' && o === 'S') || (y === 'P' && o === 'R') || (y === 'S' && o === 'P')) return 'win'
  return 'loss'
}

function Slot({ children, size = 28, win, loss, faceDown, sealed, empty, ghost }: {
  children?: string; size?: number;
  win?: boolean; loss?: boolean; faceDown?: boolean; sealed?: boolean; empty?: boolean; ghost?: boolean;
}) {
  let bg = 'transparent', fg = 'var(--ink)', border = 'var(--ink)'
  if (faceDown || sealed) { bg = 'var(--ink)'; fg = 'transparent' }
  else if (win)   { bg = 'var(--money)'; fg = '#fff'; border = 'var(--money)' }
  else if (loss)  { bg = 'var(--alarm)'; fg = '#fff'; border = 'var(--alarm)' }
  else if (empty) { bg = 'transparent'; fg = 'transparent'; border = 'var(--rule-soft)' }
  else if (ghost) { bg = 'transparent'; fg = 'var(--ink-ghost)'; border = 'var(--rule-soft)' }
  return (
    <div style={{
      width: size, height: Math.round(size * 1.4),
      border: `1.5px solid ${border}`,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.5,
      letterSpacing: '-0.02em', flexShrink: 0,
    }}>
      {children}
    </div>
  )
}

function Panel({ n, label, active, time, children, caption }: {
  n: string; label: string; active: boolean; time: string; children: React.ReactNode; caption: string;
}) {
  return (
    <div style={{
      background: 'var(--bone)',
      border: active ? '2px solid var(--ink)' : '1px solid var(--rule-soft)',
      padding: 20,
      display: 'flex', flexDirection: 'column',
      transition: 'border 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          color: active ? 'var(--alarm)' : 'var(--ink-faint)',
        }}>
          {active && '● '}{n} · {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)' }}>{time}</span>
      </div>
      <div style={{ height: 1, background: 'var(--ink)', width: '100%' }} />
      <div style={{
        flex: 1, minHeight: 180,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 0',
      }}>
        {children}
      </div>
      <div style={{ height: 1, background: 'var(--rule-soft)', width: '100%', marginTop: 'auto' }} />
      <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 12 }}>{caption}</p>
    </div>
  )
}

export function HowItPlays() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT(x => x + 1), 500)
    return () => clearInterval(id)
  }, [])

  const phase = Math.floor((t % 24) / 6)
  const sub   = t % 6

  const lockFill    = phase === 1 ? Math.min(9, Math.floor(sub * 1.6)) : (phase > 1 ? 9 : 0)
  const revealCount = phase === 2 ? Math.min(9, Math.floor(sub * 1.6)) : (phase > 2 ? 9 : 0)
  const potTarget   = 450
  const potNow      = phase === 3 ? Math.round(potTarget * Math.min(1, sub / 4)) : (phase < 3 ? 0 : potTarget)

  let youScore = 0, oppScore = 0
  for (let i = 0; i < revealCount; i++) {
    const r = result(OPP_CARDS[i], YOU_CARDS[i])
    if (r === 'win') youScore++
    else if (r === 'loss') oppScore++
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6, borderBottom: '3px double var(--ink)', paddingBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--alarm)' }}>● HOW A DUEL PLAYS</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9, marginTop: 6 }}>FOUR BEATS.</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>AVERAGE MATCH · 2m 04s</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>LIVE DEMO · REPLAYS ON LOOP</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
        {/* 01 QUEUE */}
        <Panel n="01" label="QUEUE" active={phase === 0} time="~6s"
          caption="Pick a room and stake. We pair you with someone within ±100 ELO at the same buy-in.">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>50 KR ROOM · CARD DUEL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.85, marginTop: 12, color: phase === 0 ? 'var(--ink)' : 'var(--ink-ghost)' }}>
              {phase === 0 ? (sub < 3 ? 'FINDING' : 'PAIRED') : 'PAIRED'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: phase === 0 && (sub % 3) === i ? 'var(--alarm)' : 'var(--ink-ghost)',
                  transition: 'background 0.2s', display: 'inline-block',
                }} />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', marginTop: 14, letterSpacing: '0.10em' }}>
              YOU 1.842 · LASERHAWK 1.798
            </div>
          </div>
        </Panel>

        {/* 02 LOCK */}
        <Panel n="02" label="LOCK" active={phase === 1} time="60s"
          caption="Both players seal 9 cards blind. Rock, paper, scissors — but you commit the whole hand at once.">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)' }}>YOUR HAND</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {YOU_CARDS.map((_, i) => (
                <Slot key={i} size={28} faceDown={i < lockFill} empty={i >= lockFill} />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, fontVariantNumeric: 'tabular-nums', marginTop: 8, color: phase === 1 ? 'var(--alarm)' : 'var(--ink-ghost)' }}>
              {String(Math.max(0, 60 - sub * 10)).padStart(2,'0')}s
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>
              {lockFill}/9 SLOTS SEALED
            </div>
          </div>
        </Panel>

        {/* 03 REVEAL */}
        <Panel n="03" label="REVEAL" active={phase === 2} time="~15s"
          caption="Slots flip one by one. Each is one of three outcomes — you take it, they take it, or a push.">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {OPP_CARDS.map((c, i) => {
                const r = i < revealCount
                const res = result(OPP_CARDS[i], YOU_CARDS[i])
                return <Slot key={i} size={26} faceDown={!r} win={r && res === 'loss'} loss={r && res === 'win'}>{r ? c : ''}</Slot>
              })}
            </div>
            <div style={{ display: 'flex', gap: 4, margin: '2px 0' }}>
              {OPP_CARDS.map((_, i) => {
                const r = i < revealCount
                const res = result(OPP_CARDS[i], YOU_CARDS[i])
                return (
                  <div key={i} style={{
                    width: 26, height: 4,
                    background: r ? (res === 'win' ? 'var(--money)' : res === 'loss' ? 'var(--alarm)' : 'var(--ink-ghost)') : 'transparent',
                    border: !r ? '1px solid var(--rule-soft)' : 'none',
                    transition: 'background 0.2s',
                  }} />
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {YOU_CARDS.map((c, i) => {
                const r = i < revealCount
                const res = result(OPP_CARDS[i], YOU_CARDS[i])
                return <Slot key={i} size={26} faceDown={!r} win={r && res === 'win'} loss={r && res === 'loss'}>{r ? c : ''}</Slot>
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginTop: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums' }}>{oppScore}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-faint)' }}>—</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--money)', fontVariantNumeric: 'tabular-nums' }}>{youScore}</span>
            </div>
          </div>
        </Panel>

        {/* 04 POT */}
        <Panel n="04" label="POT" active={phase === 3} time="instant"
          caption="First to 5 takes everything. Pot lands in your wallet — minus 10% rake. Receipt is permanent.">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--money)' }}>YOU TAKE THE POT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88, letterSpacing: '-0.03em', lineHeight: 0.9, marginTop: 6, color: phase === 3 ? 'var(--money)' : 'var(--ink-ghost)', fontVariantNumeric: 'tabular-nums' }}>
              {potNow}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginTop: -2, textTransform: 'uppercase' }}>KR · NET TO YOU</div>
            <div style={{
              marginTop: 14, padding: '6px 12px',
              border: '1.5px solid var(--ink)', display: 'inline-block',
              background: phase === 3 ? 'var(--ink)' : 'transparent',
              color: phase === 3 ? 'var(--bone)' : 'var(--ink)',
              transition: 'all 0.3s',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', fontWeight: 700 }}>5 — 3 · FINAL</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Phase progress bar */}
      <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, background: i === phase ? 'var(--alarm)' : 'var(--rule-soft)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)' }}>NO LUCK · NO CARDS DEALT · NO HOUSE PLAYING</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink)', letterSpacing: '0.10em' }}>READ THE FULL RULES →</span>
      </div>
    </div>
  )
}
