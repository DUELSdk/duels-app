'use client'

import { use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { s } from '@/lib/styles'
import { loadMatchResult, markBalanceApplied, type MatchResult } from '@/lib/match-state'
import { adjustBalance, addTransaction } from '@/lib/balance'
import { getH2HRecord } from '@/lib/mock-data'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.08em',
}

const display = (size: number): React.CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: size,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  lineHeight: 0.88,
})

function netDelta(r: MatchResult): number {
  if (r.outcome === 'win')  return r.winnerGets - r.stakeKr
  if (r.outcome === 'loss') return -r.stakeKr
  return 0
}

/* ── MATCH TOP BAR (bunker) ─────────────────────────────────────────── */
function BunkerBar({ slug, kr, matchId, label, color = 'var(--alarm)' }: { slug: string; kr: number; matchId: string; label: string; color?: string }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 36, padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--concrete-2)',
      borderBottom: '1px solid rgba(240,237,228,0.07)',
    }}>
      <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
        MATCH {matchId} · {slug.toUpperCase().replace('-', ' ')} · {kr} KR ROOM
      </span>
      <span style={{ ...mono, fontSize: 9, display: 'flex', alignItems: 'center', gap: 6, color }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
        {label}
      </span>
      <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
        POT {kr * 2 - Math.round(kr * 2 * 0.1)} KR · {matchId}
      </span>
    </div>
  )
}

/* ── WIN RESULT ─────────────────────────────────────────────────────── */
function WinResult({ result, slug }: { result: MatchResult; slug: string }) {
  const delta   = netDelta(result)
  const rake    = result.stakeKr * 2 - result.winnerGets
  const newBal  = 2490 // mock
  const h2h     = getH2HRecord(result.opponent ?? 'BOT')

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      {/* Broadcast stats strip */}
      <div style={{ background: 'var(--ink)', padding: '6px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
          TODAY&apos;S BIGGEST POT <strong style={{ color: 'var(--bone-on-dark)' }}>5.420 KR</strong> — k_8821 vs grimreef
        </span>
        <span style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>
          1.247 SETTLED TODAY &nbsp;·&nbsp; 96.430 KR PAID
        </span>
      </div>

      {/* Match meta */}
      <div style={{ padding: '6px 56px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
        <span style={{ ...mono, fontSize: 9, color: 'var(--ink-soft)' }}>
          MATCH 4F2A · {slug.toUpperCase().replace('-', ' ')} · {result.stakeKr} KR ROOM
        </span>
      </div>

      {/* Hero — YOU TAKE THE POT. */}
      <div style={{ padding: '64px 56px 48px', borderBottom: '1.5px solid var(--ink)' }}>
        <h1 style={{ ...display(160), lineHeight: 0.84 }}>
          YOU TAKE<br />THE POT.
        </h1>
        <p style={{ ...mono, fontSize: 13, color: 'var(--ink-soft)', marginTop: 24 }}>
          {result.myScore}–{result.oppScore} · {result.myScore > result.oppScore ? (result.myScore === result.oppScore + 1 ? 'ONE SLOT' : `${result.myScore} SLOTS`) : 'SUDDEN DEATH'} · {result.winnerGets} KR
        </p>
      </div>

      {/* Nemesis block */}
      {h2h && (
        <div style={{
          padding: '28px 56px',
          borderBottom: '1.5px solid var(--ink)',
          borderLeft: '4px solid var(--nemesis)',
          background: 'var(--nemesis-soft)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--nemesis)', marginBottom: h2h.revengeActive ? 14 : 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nemesis)', display: 'inline-block' }} />
              NEMESIS · {result.opponent}{h2h.revengeActive ? ' · REVENGE CLEARED' : ''}
            </div>
            {h2h.revengeActive ? (
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, letterSpacing: '-0.02em', lineHeight: 0.88 }}>
                DEBT SETTLED.
              </div>
            ) : (
              <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)' }}>
                RIVALRY UPDATED · {h2h.wins + 1}W – {h2h.losses}L OVERALL
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>H2H · VS {result.opponent}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--money)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {h2h.wins + 1}W
              </span>
              <span style={{ ...mono, color: 'var(--ink-faint)' }}>–</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {h2h.losses}L
              </span>
            </div>
            {h2h.revengeActive && (
              <div style={{ ...mono, fontSize: 9, color: 'var(--nemesis)', marginTop: 6 }}>STREAK BROKEN · +5 TICKETS CREDITED</div>
            )}
          </div>
        </div>
      )}

      {/* Payout strip */}
      <div style={{ padding: '32px 56px', borderBottom: '1.5px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>PAYOUT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 80, color: 'var(--money)', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            +{delta}
          </div>
          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>
            KR · TO YOUR BALANCE
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>NEW BALANCE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {newBal.toLocaleString('da-DK')} KR
          </div>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>
            +{delta} FROM MATCH · +0 RAKE TO YOU
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '24px 56px', display: 'flex', gap: 12, borderBottom: '1.5px solid var(--ink)' }}>
        <Link href={`/play/${slug}/lobby`} style={{
          flex: 2, display: 'block', textAlign: 'center',
          background: 'var(--alarm)', color: '#fff', padding: '18px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          FIND THE NEXT ONE — {result.stakeKr} KR →
        </Link>
        <Link href={`/play/${slug}/lobby`} style={{
          flex: 1, display: 'block', textAlign: 'center',
          border: '1.5px solid var(--ink)', color: 'var(--ink)', padding: '18px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          REMATCH? · BOT MUST ACCEPT
        </Link>
        <Link href="/play" style={{
          display: 'block', textAlign: 'center',
          border: '1.5px solid var(--rule-soft)', color: 'var(--ink-faint)', padding: '18px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          BREAK
        </Link>
      </div>

      {/* What happened */}
      <div style={{ padding: '32px 56px', borderBottom: '1px solid var(--rule-soft)' }}>
        <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 12 }}>WHAT HAPPENED</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 24 }}>MATCH LOG.</div>
        {[
          { time: '22:14:02', label: 'MATCHED',      desc: `NOVASTRIKE vs BOT · ${result.stakeKr} KR room` },
          { time: '22:14:18', label: 'LOCK PHASE',   desc: 'Both players sealed all 9 slots' },
          { time: '22:15:09', label: 'REVEAL · 1–9', desc: 'Slots resolved in sequence', col: 'var(--ink-soft)' },
          { time: '22:15:41', label: 'SLOT 9 · DONE',desc: `${result.myScore}–${result.oppScore} · NOVASTRIKE takes it`, col: 'var(--money)' },
          { time: '22:16:02', label: 'SETTLED',       desc: `${result.winnerGets} KR paid out · ${result.stakeKr * 2 - result.winnerGets} KR rake`, col: 'var(--money)' },
        ].map(ev => (
          <div key={ev.time} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--rule-soft)' }}>
            <span style={{ ...mono, fontSize: 9, color: 'var(--ink-ghost)' }}>{ev.time}</span>
            <div>
              <div style={{ ...mono, fontSize: 10, fontWeight: 700, color: ev.col ?? 'var(--ink)', marginBottom: 2, textTransform: 'uppercase' }}>{ev.label}</div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)' }}>{ev.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ON THE BOARD */}
      <div style={{ padding: '32px 56px', background: 'var(--bone-2)', borderBottom: '1px solid var(--rule-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ ...display(48) }}>ON THE BOARD.</span>
          <span style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)' }}>TODAY · LIVE</span>
        </div>
        {[
          { rank: '01', who: 'K_8821 VS GRIMREEF',   what: 'CARD · 250 ROOM', val: '5.420' },
          { rank: '02', who: 'SANDMAN VS REEF',        what: 'CYCLE · 500 ROOM', val: '4.500' },
          { rank: '03', who: 'NOVASTRIKE VS ANON#9',  what: 'CARD · 250 ROOM',  val: '4.500' },
          { rank: '04', who: 'MADS_KBH VS VIPER99',   what: 'DROP · 100 ROOM',  val: '1.800' },
          { rank: '05', who: 'SIREN VS ISO_9001',      what: 'CARD · 50 ROOM',   val: '900'   },
        ].map(r => (
          <div key={r.rank} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr auto',
            alignItems: 'baseline', gap: 16,
            padding: '10px 0', borderBottom: '1px solid var(--rule-soft)',
          }}>
            <span style={{ ...mono, fontSize: 9, color: 'var(--ink-ghost)' }}>{r.rank}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>{r.who}</div>
              <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{r.what}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>{r.val}</span>
          </div>
        ))}
        <div style={{ padding: '10px 0' }}>
          <span style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)' }}>— OLDER ENTRIES...</span>
        </div>

        {/* Your entry highlight */}
        <div style={{ background: 'var(--ink)', padding: '20px 24px', marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--money)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--money)', display: 'inline-block' }} />
              JUST IN · YOUR ENTRY
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--bone-on-dark)', textTransform: 'uppercase' }}>
              NOVASTRIKE VS BOT · CARD · {result.stakeKr} ROOM
            </div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginTop: 4 }}>
              {result.myScore}–{result.oppScore} · sudden death · 22 minutes ago
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)', marginBottom: 4 }}>POT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, color: 'var(--bone-on-dark)', fontVariantNumeric: 'tabular-nums' }}>{result.winnerGets}</div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--bone-faint)' }}>KR · BIGGEST OF THE LAST HOUR</div>
          </div>
        </div>
      </div>

      {/* Streak + receipt */}
      <div style={{ padding: '32px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, borderBottom: '1px solid var(--rule-soft)' }}>
        {/* Streak */}
        <div style={{ border: '1px solid var(--rule-soft)', padding: '24px' }}>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 12 }}>CURRENT STREAK</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, color: 'var(--money)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>2</div>
          <div style={{ ...mono, fontSize: 10, marginTop: 4 }}>IN A ROW</div>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 8 }}>WIN ONE MORE → BOARD&apos;S TOP 3 STREAKS</div>
          <div style={{ height: 1, background: 'var(--rule-soft)', margin: '16px 0' }} />
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>TODAY · YOU</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--money)', fontVariantNumeric: 'tabular-nums' }}>
            + {delta * 2} KR
          </div>
          <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>4 MATCHES · 3W 1L</div>
        </div>

        {/* Match receipt */}
        <div style={{ border: '1px solid var(--rule-soft)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)' }}>MATCH RECEIPT</div>
            <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)' }}>4F2A · 22:14 CET</div>
          </div>
          {[
            { label: 'ROOM',         val: `${result.stakeKr} KR · ${slug.toUpperCase().replace('-', ' ')}` },
            { label: 'OPPONENT',     val: 'BOT' },
            { label: 'DURATION',     val: '2m 18s · 9 + 1 sudden' },
            { label: 'FINAL SCORE',  val: `${result.myScore} – ${result.oppScore}` },
            { label: 'POT',          val: `${result.winnerGets + rake} KR` },
            { label: 'RAKE',         val: `${rake} KR · 10%` },
            { label: 'YOUR TAKE',    val: `+ ${delta} KR`, color: 'var(--money)' },
            { label: 'NEW BALANCE',  val: `${newBal.toLocaleString('da-DK')} KR`, bold: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--rule-soft)' }}>
              <span style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)' }}>{row.label}</span>
              <span style={{ ...mono, fontSize: 9, fontWeight: row.bold ? 700 : 400, color: row.color ?? 'var(--ink)' }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 80 }} />
    </div>
  )
}

/* ── LOSS RESULT ─────────────────────────────────────────────────────── */
function LossResult({ result, slug }: { result: MatchResult; slug: string }) {
  const delta  = netDelta(result)
  const newBal = 2400 // mock
  const h2h    = getH2HRecord(result.opponent ?? 'BOT')

  return (
    <div style={{ background: 'var(--concrete)', color: 'var(--bone-on-dark)', minHeight: '100vh', paddingTop: 36 }}>
      <BunkerBar slug={slug} kr={result.stakeKr} matchId="4F2A" label="MATCH OVER · YOU LOST" />

      <div style={{ padding: '40px 56px' }}>
        {/* Settled line */}
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
          SETTLED · BOT TOOK THE POT
        </div>

        {/* LOST. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start', gap: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 180, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.84, color: 'var(--alarm)' }}>
              LOST.
            </h1>

            <div style={{ marginTop: 24 }}>
              <div style={{ ...mono, fontSize: 12, color: 'var(--bone-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 8 }}>
                NOVASTRIKE LT BOT
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
                  {result.myScore}
                </span>
                <span style={{ ...mono, color: 'rgba(255,255,255,0.2)' }}>–</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 64, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums' }}>
                  {result.oppScore}
                </span>
              </div>
              <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                SUDDEN DEATH · YOUR ROCK · THEIR PAPER
              </div>
            </div>

            {/* Nemesis block */}
            {h2h && h2h.currentStreak === -2 && (
              <div style={{
                marginTop: 24, padding: '20px 24px',
                border: '1px solid var(--nemesis)',
                background: 'rgba(139,92,246,0.08)',
              }}>
                <div style={{ ...mono, fontSize: 9, color: 'var(--nemesis)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nemesis)', display: 'inline-block' }} />
                  NEMESIS · {result.opponent}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--nemesis)' }}>
                  REVENGE UNLOCKED.
                </div>
                <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 8, lineHeight: 1.7 }}>
                  3 STRAIGHT LOSSES · BEAT {result.opponent} NEXT FOR BONUS TICKETS
                </div>
              </div>
            )}
            {h2h && h2h.revengeActive && (
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, paddingTop: 14, borderTop: '1px solid rgba(139,92,246,0.2)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nemesis)', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ ...mono, fontSize: 9, color: 'var(--nemesis)' }}>
                  LOST {Math.abs(h2h.currentStreak) + 1} IN A ROW · VS {result.opponent} · REVENGE ACTIVE
                </span>
              </div>
            )}

          </div>

          {/* Delta */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>OUT OF YOUR BALANCE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 120, color: 'var(--alarm)', letterSpacing: '-0.02em', lineHeight: 0.84, fontVariantNumeric: 'tabular-nums' }}>
              {delta}
            </div>
            <div style={{ ...mono, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
              KR · BAL {newBal.toLocaleString('da-DK')} KR
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '24px 56px', display: 'flex', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href={`/play/${slug}/lobby`} style={{
          flex: 2, display: 'block', textAlign: 'center',
          background: 'var(--alarm)', color: '#fff', padding: '18px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          RUN IT BACK — {result.stakeKr} KR →
        </Link>
        <Link href={`/play/${slug}/lobby`} style={{
          flex: 1, display: 'block', textAlign: 'center',
          border: '1.5px solid rgba(255,255,255,0.2)', color: 'var(--bone-on-dark)', padding: '18px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          SMALLER ROOM · 10 KR
        </Link>
        <Link href="/play" style={{
          display: 'block', textAlign: 'center',
          color: 'rgba(255,255,255,0.3)', padding: '18px 16px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          BREAK
        </Link>
      </div>

      {/* What happened */}
      <div style={{ padding: '32px 56px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>WHAT HAPPENED</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--bone-on-dark)', marginBottom: 24 }}>MATCH LOG.</div>
        {[
          { time: '22:14:02', label: 'MATCHED',      desc: `NOVASTRIKE vs BOT · ${result.stakeKr} KR room` },
          { time: '22:14:18', label: 'LOCK PHASE',   desc: 'Both players sealed all 9 slots' },
          { time: '22:15:09', label: 'REVEAL · 1–9', desc: 'Slots resolved in sequence', col: 'rgba(255,255,255,0.5)' },
          { time: '22:15:41', label: 'SLOT 7 · DONE',desc: `BOT seals it · ${result.myScore}–${result.oppScore}`, col: 'var(--alarm)' },
          { time: '22:16:02', label: 'SETTLED',       desc: `${result.winnerGets} KR to BOT · ${result.stakeKr * 2 - result.winnerGets} KR rake`, col: 'var(--alarm)' },
        ].map(ev => (
          <div key={ev.time} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{ev.time}</span>
            <div>
              <div style={{ ...mono, fontSize: 10, fontWeight: 700, color: ev.col ?? 'rgba(255,255,255,0.7)', marginBottom: 2, textTransform: 'uppercase' }}>{ev.label}</div>
              <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{ev.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Receipt */}
      <div style={{ padding: '32px 56px 80px' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>MATCH RECEIPT</div>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>4F2A · 22:16 CET</div>
          </div>
          {[
            { label: 'ROOM',        val: `${result.stakeKr} KR · ${slug.toUpperCase().replace('-', ' ')}` },
            { label: 'OPPONENT',    val: 'BOT' },
            { label: 'DURATION',    val: '2m 18s · 9 slots' },
            { label: 'FINAL SCORE', val: `${result.myScore} – ${result.oppScore}` },
            { label: 'POT',         val: `${result.stakeKr * 2} KR` },
            { label: 'RAKE',        val: `${result.stakeKr * 2 - result.winnerGets} KR · 10%` },
            { label: 'YOUR NET',    val: `— ${result.stakeKr} KR`, color: 'var(--alarm)' },
            { label: 'NEW BALANCE', val: `${newBal.toLocaleString('da-DK')} KR`, bold: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
              <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
              <span style={{ ...mono, fontSize: 9, fontWeight: row.bold ? 700 : 400, color: row.color ?? 'rgba(255,255,255,0.7)' }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── FORFEIT RESULT ──────────────────────────────────────────────────── */
function ForfeitResult({ result, slug }: { result: MatchResult; slug: string }) {
  const delta   = -result.stakeKr
  const rake    = Math.round(result.stakeKr * 2 * 0.1)
  const newBal  = 2350 // mock
  const forfeitToday = 1

  return (
    <div style={{ background: 'var(--concrete)', color: 'var(--bone-on-dark)', minHeight: '100vh', paddingTop: 36 }}>
      <BunkerBar slug={slug} kr={result.stakeKr} matchId="4F2A" label="MATCH ABORTED · FORFEIT" />

      <div style={{ padding: '40px 56px' }}>
        {/* FORFEIT header */}
        <div style={{ ...mono, fontSize: 9, color: 'var(--alarm)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--alarm)', display: 'inline-block' }} />
          FORFEIT · MATCH 4F2A
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 160, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.84, color: 'var(--alarm)', marginBottom: 24 }}>
          FORFEIT.
        </h1>

        <p style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,0.4)', maxWidth: 600, textTransform: 'uppercase', lineHeight: 1.8 }}>
          YOU STEPPED OUT AT SLOT 6. THE POT GOES TO BOT — MATCH COUNTED AS A LOSS.
        </p>
      </div>

      {/* Stake row */}
      <div style={{ padding: '24px 56px', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>YOUR STAKE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 80, color: 'var(--alarm)', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            — {result.stakeKr}
          </div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>KR · GONE TO POT</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>NEW BALANCE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {newBal.toLocaleString('da-DK')} KR
          </div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            — {result.stakeKr} FROM STAKE · 0 RAKE OWED
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '24px 56px', display: 'flex', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href={`/play/${slug}/lobby`} style={{
          flex: 2, display: 'block', textAlign: 'center',
          background: 'var(--alarm)', color: '#fff', padding: '18px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          TRY AGAIN — {result.stakeKr} KR →
        </Link>
        <Link href="/play" style={{
          flex: 1, display: 'block', textAlign: 'center',
          border: '1.5px solid rgba(255,255,255,0.2)', color: 'var(--bone-on-dark)', padding: '18px 24px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          BACK TO LIBRARY
        </Link>
        <Link href="/play" style={{
          display: 'block', textAlign: 'center',
          color: 'rgba(255,255,255,0.3)', padding: '18px 16px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
        }}>
          BREAK
        </Link>
      </div>

      {/* Timeline + receipt */}
      <div style={{ padding: '32px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        {/* Timeline */}
        <div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>WHAT HAPPENED</div>
          <div style={{ ...s.display(28), color: 'var(--bone-on-dark)', marginBottom: 24 }}>SLOT 6.</div>
          {[
            { time: '22:14:02', label: 'MATCHED',      desc: `You vs BOT · ${result.stakeKr} KR room` },
            { time: '22:14:18', label: 'LOCK PHASE',   desc: '60s · both players sealed 5 of 9 slots' },
            { time: '22:15:09', label: 'REVEAL · SLOT 1–5', desc: 'Tied 2–2 · one push', color: 'rgba(255,255,255,0.5)' },
            { time: '22:15:41', label: 'SLOT 6',       desc: 'You did not lock in time · 30s grace', color: 'var(--alarm)' },
            { time: '22:16:11', label: 'MATCH ABORTED', desc: 'Auto-forfeit · pot awarded to opp',    color: 'var(--alarm)' },
          ].map(ev => (
            <div key={ev.time} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{ev.time}</span>
              <div>
                <div style={{ ...mono, fontSize: 10, fontWeight: 700, color: ev.color ?? 'rgba(255,255,255,0.7)', marginBottom: 2, textTransform: 'uppercase' }}>{ev.label}</div>
                <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{ev.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Forfeit receipt */}
        <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>FORFEIT RECEIPT</div>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>4F2A · 22:16 CET</div>
          </div>
          {[
            { label: 'ROOM',               val: `${result.stakeKr} KR · ${slug.toUpperCase().replace('-', ' ')}` },
            { label: 'OPPONENT',           val: 'BOT' },
            { label: 'DURATION',           val: '2m 09s · aborted at slot 6' },
            { label: 'SCORE WHEN ABORTED', val: '2 – 2' },
            { label: 'REASON',             val: 'TIMEOUT · LOCK PHASE' },
            { label: 'STAKE LOST',         val: `${result.stakeKr} KR` },
            { label: 'POT AWARDED',        val: `${result.winnerGets} KR → BOT` },
            { label: 'RAKE',               val: `${rake} KR · standard` },
            { label: 'YOUR NET',           val: `— ${result.stakeKr} KR`, color: 'var(--alarm)' },
            { label: 'NEW BALANCE',        val: `${newBal.toLocaleString('da-DK')} KR`, bold: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
              <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
              <span style={{ ...mono, fontSize: 9, fontWeight: row.bold ? 700 : 400, color: row.color ?? 'rgba(255,255,255,0.7)' }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Forfeit cooldown warning */}
      <div style={{ margin: '0 56px', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ ...mono, fontSize: 9, color: 'var(--money)', marginBottom: 6 }}>HEADS UP</div>
          <div style={{ ...mono, fontSize: 10, fontWeight: 700, color: 'var(--bone-on-dark)', textTransform: 'uppercase', marginBottom: 4 }}>
            THREE FORFEITS IN 24H TRIGGERS A 30-MIN COOLDOWN ON ROOMS ≥ 100 KR.
          </div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
            FORFEITS TODAY · {forfeitToday} OF 3
          </div>
        </div>
        <Link href="/rules" style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          READ THE RULE →
        </Link>
      </div>

      <div style={{ height: 80 }} />
    </div>
  )
}

const MOCK_RESULTS: Record<string, MatchResult> = {
  win:     { game: 'card-duel', tierId: 'high', stakeKr: 100, entryFee: 6, winnerGets: 188, outcome: 'win',  myScore: 6, oppScore: 3, opponent: 'BOT', balanceApplied: true },
  loss:    { game: 'card-duel', tierId: 'high', stakeKr: 100, entryFee: 6, winnerGets: 188, outcome: 'loss', myScore: 3, oppScore: 6, opponent: 'BOT', balanceApplied: true },
  forfeit: { game: 'card-duel', tierId: 'high', stakeKr: 100, entryFee: 6, winnerGets: 188, outcome: 'draw', myScore: 2, oppScore: 2, opponent: 'BOT', balanceApplied: true },
}

/* ── PAGE ROUTER ─────────────────────────────────────────────────────── */
export default function ResultPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = use(params)
  const searchParams = useSearchParams()
  const preview = searchParams.get('preview')
  const [result, setResult] = useState<MatchResult | null>(preview ? MOCK_RESULTS[preview] ?? null : null)

  useEffect(() => {
    if (preview) return
    const r = loadMatchResult()
    if (!r) return
    setResult(r)
    if (!r.balanceApplied) {
      const delta = netDelta(r)
      adjustBalance(delta)
      const desc = r.outcome === 'win'
        ? `Win · ${slug.toUpperCase().replace('-', ' ')} · ${r.stakeKr} KR room`
        : r.outcome === 'loss'
        ? `Loss · ${slug.toUpperCase().replace('-', ' ')} · ${r.stakeKr} KR room`
        : `Forfeit · ${slug.toUpperCase().replace('-', ' ')} · ${r.stakeKr} KR room`
      addTransaction(desc, delta)
      markBalanceApplied()
    }
  }, [slug, preview])

  if (!result) {
    return (
      <div style={{ background: '#000', color: 'var(--bone-on-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, color: 'rgba(255,255,255,0.2)' }}>NO RESULT</div>
          <Link href="/play" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: 20, textDecoration: 'none' }}>
            BACK TO GAMES →
          </Link>
        </div>
      </div>
    )
  }

  if (result.outcome === 'win')    return <WinResult    result={result} slug={slug} />
  if (result.outcome === 'loss')   return <LossResult   result={result} slug={slug} />
  return <ForfeitResult result={result} slug={slug} />
}
