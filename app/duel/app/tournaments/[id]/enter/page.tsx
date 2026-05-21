import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { s } from '@/lib/styles'
import { getTournamentDetail } from '@/lib/mock-data'

const fmtKr = (n: number) => n.toLocaleString('da-DK')

export default async function TournamentEnterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = getTournamentDetail(id)
  if (!t) notFound()
  if (t.status !== 'OPEN') notFound()

  const seatsLeft  = t.seatsTotal - t.seatsFilled
  const rakeKr     = Math.round(t.fee * t.seatsTotal * 0.15)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="tournaments" />

      <main style={{ maxWidth: 560, margin: '0 auto', padding: `48px ${s.px} 80px` }}>

        {/* Breadcrumb */}
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/tournaments" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>TOURNAMENTS</Link>
          <span>/</span>
          <Link href={`/tournaments/${id}`} style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>{t.name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>ENTER</span>
        </div>

        {/* Header */}
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>
          {t.game} · {t.fmt} · STARTS {t.start}
        </div>
        <h1 style={{ ...s.display(56), lineHeight: 0.88, marginBottom: 32 }}>{t.name}.</h1>

        {/* Entry summary */}
        <div style={{ border: '1.5px solid var(--ink)', marginBottom: 2 }}>
          {[
            { label: 'TOURNAMENT',  value: t.name },
            { label: 'GAME',        value: t.game },
            { label: 'FORMAT',      value: t.fmt },
            { label: 'SEATS LEFT',  value: `${seatsLeft} of ${t.seatsTotal}` },
            { label: 'YOU PAY',     value: `${t.fee} KR`, large: true },
            { label: 'TOTAL PURSE', value: `${fmtKr(t.pool)} KR`, color: 'var(--money)', large: true },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '14px 20px', borderBottom: '1px solid rgba(13,13,13,0.18)',
            }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>{row.label}</span>
              <span style={{
                fontFamily: row.large ? 'var(--font-display)' : 'var(--font-mono)',
                fontWeight: row.large ? 800 : 600,
                fontSize: row.large ? 22 : 12,
                color: row.color ?? 'var(--ink)',
                letterSpacing: row.large ? '-0.02em' : '0.04em',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {row.value}
              </span>
            </div>
          ))}
          <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>15% RAKE · {fmtKr(rakeKr)} KR</span>
            <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>WINNER TAKES {fmtKr(t.pool)} KR</span>
          </div>
        </div>

        {/* Prize breakdown */}
        <div style={{ border: '1.5px solid var(--ink)', borderTop: 'none', marginBottom: 32 }}>
          <div style={{ padding: '8px 20px', borderBottom: '1px solid rgba(13,13,13,0.18)' }}>
            <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>PRIZE BREAKDOWN</span>
          </div>
          {[
            { place: '1ST — WINNER', kr: t.pool, color: 'var(--money)' },
            { place: 'PLATFORM RAKE (15%)', kr: rakeKr, color: 'var(--ink-faint)' },
          ].map(p => (
            <div key={p.place} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 20px', borderBottom: '1px solid rgba(13,13,13,0.10)',
            }}>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)' }}>{p.place}</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                color: p.color, fontVariantNumeric: 'tabular-nums',
              }}>
                {fmtKr(p.kr)} KR
              </span>
            </div>
          ))}
        </div>

        {/* Confirm CTA */}
        <Link
          href={`/tournaments/${id}/waiting`}
          style={{
            display: 'block', textAlign: 'center',
            background: 'var(--alarm)', color: '#fff',
            padding: '22px 32px',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.02em',
            textDecoration: 'none',
          }}
        >
          CONFIRM ENTRY · {t.fee} KR →
        </Link>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 10 }}>
          ENTRY IS LOCKED ONCE CONFIRMED. NO REFUNDS AFTER LAST SEAT FILLS.
        </div>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link href={`/tournaments/${id}`} style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none' }}>
            ← BACK TO TOURNAMENT
          </Link>
        </div>
      </main>
    </div>
  )
}
