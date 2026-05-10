import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

export default function Tournaments() {
  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav balance="2.450" activePage="tournaments" />

      <section style={{ padding: `56px ${s.px} 32px` }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>
          TOURNAMENTS · 0 SCHEDULED
        </div>
        <h1 style={{ ...s.display(96), lineHeight: 0.85 }}>TOURNAMENTS.</h1>
        <p style={{ fontSize: 16, lineHeight: 1.5, marginTop: 20, maxWidth: 520, color: 'var(--ink-soft)' }}>
          Fixed-seat events. Entry fee in, winner takes the purse. 15% platform rake.
        </p>
      </section>

      <section style={{ padding: `0 ${s.px} 56px` }}>
        <div style={s.rule} />

        {/* Empty state */}
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--ink-ghost)', marginBottom: 16 }}>
            NO TOURNAMENTS SCHEDULED
          </div>
          <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 32 }}>
            EVENTS WILL APPEAR HERE WHEN SCHEDULED. CHECK BACK SOON.
          </div>
          <Link href="/play" style={{
            ...s.mono, fontSize: 11, fontWeight: 600,
            border: '1.5px solid var(--ink)', padding: '12px 24px',
            textDecoration: 'none', color: 'var(--ink)',
          }}>
            PLAY A RANKED MATCH INSTEAD →
          </Link>
        </div>
      </section>

      <section style={{ padding: `24px ${s.px}`, background: 'var(--bone-2)', borderTop: '1px solid var(--ink)' }}>
        <div style={{ display: 'flex', gap: 48 }}>
          {[
            { label: 'FORMAT', val: 'Single elimination. Lose once, out.' },
            { label: 'RAKE', val: '15% of total purse.' },
            { label: 'TIEBREAKER', val: 'Sudden death per game rules.' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{item.val}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
