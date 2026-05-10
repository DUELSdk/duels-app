import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" />

      <section style={{ padding: `56px ${s.px} 48px`, maxWidth: 800 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>ABOUT</div>
        <h1 style={{ ...s.display(88), lineHeight: 0.85, marginBottom: 40 }}>WHAT IS DUEL.</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>THE PITCH</div>
            <div style={s.rule} />
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: 20, maxWidth: 580 }}>
              DUEL is a 1v1 skill competition platform. Two players. Real money on the table.
              No randomness — no dice, no draws, no house edge. The better player wins.
              Always.
            </p>
          </div>

          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>THE GAMES</div>
            <div style={s.rule} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginTop: 20 }}>
              {[
                { name: 'CARD DUEL',  desc: 'Sealed sequential RPS. Nine moves locked blind. Pure psychology.',         slug: 'card-duel'  },
                { name: 'CYCLEDUEL', desc: 'Five-type cycle with information reveals. Misdirection wins.',               slug: 'cycle-duel' },
                { name: 'DROPDUEL',  desc: 'Connect Four with hidden block placement. Position beats reflex.',          slug: 'drop-duel'  },
              ].map(g => (
                <Link key={g.slug} href={`/play/${g.slug}`} style={{ border: '1.5px solid var(--rule-soft)', padding: '20px 20px', textDecoration: 'none', color: 'var(--ink)', display: 'block' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase' }}>{g.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>{g.desc}</div>
                  <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 12 }}>VIEW →</div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>HOW IT WORKS</div>
            <div style={s.rule} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 20 }}>
              {[
                { step: '01', title: 'SIGN UP',     desc: 'Create an account with MitID. Age and identity verified. 18+ only. One account per person.' },
                { step: '02', title: 'DEPOSIT',     desc: 'Add funds via Trustly. Instant bank transfer. Min 50 KR — max 20.000 KR.' },
                { step: '03', title: 'PICK A ROOM', desc: 'Choose a game and a stake level. Enter the room. Wait for an opponent.' },
                { step: '04', title: 'DUEL',        desc: 'Play the match. The better player wins the pot.' },
                { step: '05', title: 'COLLECT',     desc: "Winner takes the pot minus platform fee. Losers take nothing. Withdraw anytime." },
              ].map(item => (
                <div key={item.step} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 20, padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                  <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', paddingTop: 2 }}>{item.step}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>LEGAL STATUS</div>
            <div style={s.rule} />
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: 20, maxWidth: 580 }}>
              DUEL is a skill competition platform, not a casino. All games are 100% skill-based
              with zero randomness. Under Danish law (Spilleloven §5), pure skill competitions
              for money do not require a gambling license. DUEL is registered as a commercial
              entity under Danish law.
            </p>
          </div>

          <div>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>COMPANY</div>
            <div style={s.rule} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 20 }}>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>ENTITY</div>
                <div style={{ fontSize: 14, color: 'var(--ink)' }}>DUEL APS</div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 8, marginBottom: 4 }}>CVR</div>
                <div style={{ fontSize: 14, color: 'var(--ink)' }}>45XXXXXX</div>
              </div>
              <div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 4 }}>FOUNDED</div>
                <div style={{ fontSize: 14, color: 'var(--ink)' }}>2025 · Copenhagen, Denmark</div>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 8, marginBottom: 4 }}>CONTACT</div>
                <div style={{ fontSize: 14, color: 'var(--ink)' }}>hello@duel.dk</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
