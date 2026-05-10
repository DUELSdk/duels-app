import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

export default function ResponsibleGamingPage() {
  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" />

      <section style={{ padding: `56px ${s.px} 48px`, maxWidth: 800 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>PLAYER SAFETY</div>
        <h1 style={{ ...s.display(72), lineHeight: 0.85, marginBottom: 32 }}>RESPONSIBLE GAMING.</h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 560, marginBottom: 48 }}>
          DUEL is built on skill, not chance. But that does not make the money less real.
          We take player wellbeing seriously. These tools are here for you.
        </p>

        {/* Tools */}
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>YOUR TOOLS</div>
        <div style={s.rule} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 48 }}>
          {[
            {
              title: 'DEPOSIT LIMITS',
              desc: 'Set a daily, weekly, or monthly deposit cap from your account settings. Limits take effect immediately. Increases require a 24-hour cooling period.',
            },
            {
              title: 'SESSION LIMITS',
              desc: 'Cap how long you can play in a single session. When the limit is reached you are automatically logged out. Set it in account settings.',
            },
            {
              title: 'REALITY CHECK',
              desc: 'Receive a pop-up every 30 minutes showing your session time and net result for the session. Keeps you informed while you play.',
            },
            {
              title: 'SELF-EXCLUSION',
              desc: 'Exclude yourself from DUEL for 1 month, 3 months, 6 months, or permanently. Self-exclusion cannot be reversed early. Contact support to initiate.',
            },
            {
              title: 'COOLING-OFF PERIOD',
              desc: 'Take a short break. Lock your account for 24 hours, 48 hours, or 7 days without permanent exclusion. No reasons required.',
            },
          ].map(item => (
            <div key={item.title} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, padding: '20px 0', borderBottom: '1px solid var(--rule-soft)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase' }}>{item.title}</div>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Warning signs */}
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>WARNING SIGNS</div>
        <div style={s.rule} />
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: 16, marginBottom: 16, maxWidth: 560 }}>
          Consider seeking help if you recognise any of the following:
        </p>
        <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
          {[
            'Playing to recover money you have lost',
            'Lying to others about how much you play or spend',
            'Feeling restless or irritable when not playing',
            'Neglecting work, family, or other responsibilities to play',
            'Borrowing money to fund your play',
            'Continuing to play despite wanting to stop',
          ].map(sign => (
            <li key={sign} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--alarm)', paddingTop: 2 }}>→</span>
              <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{sign}</span>
            </li>
          ))}
        </ul>

        {/* Help resources */}
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>GET HELP</div>
        <div style={s.rule} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 20 }}>
          {[
            { org: 'STOPSPILLET.DK', desc: 'The Danish national helpline for gaming and gambling problems.', contact: 'stopspillet.dk', phone: '+45 70 22 28 25' },
            { org: 'LUDOMANI.DK',    desc: 'Treatment and counselling for gambling and gaming addiction.',   contact: 'ludomani.dk',    phone: '+45 43 43 01 88' },
            { org: 'SPILLEMYNDIGHEDEN', desc: 'The Danish Gambling Authority. Register for national self-exclusion (ROFUS).', contact: 'spillemyndigheden.dk', phone: null },
          ].map(item => (
            <div key={item.org} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 160px', gap: 24, padding: '20px 0', borderBottom: '1px solid var(--rule-soft)', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>{item.org}</div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{item.desc}</p>
              <div>
                <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink)' }}>{item.contact}</div>
                {item.phone && <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4 }}>{item.phone}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* 18+ notice */}
        <div style={{ marginTop: 48, padding: '24px 28px', border: '1.5px solid var(--ink)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, marginBottom: 8 }}>18+</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            DUEL is strictly for adults. All accounts require MitID verification. Identity and age
            are confirmed at registration. Underage play is not permitted under any circumstances.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
