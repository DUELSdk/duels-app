'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

const FAQS = [
  {
    q: 'Is DUEL gambling?',
    a: 'No. DUEL is a skill competition platform. All games are 100% skill-based — no dice, no randomness, no house edge. Under Danish law (Spilleloven §5), pure skill competitions are not classified as gambling and do not require a gambling license.',
  },
  {
    q: 'How does the entry fee work?',
    a: 'Both players pay the same entry into the pot. The winner takes the pot minus a 10% platform fee. Example: both pay 100 KR → total pot 200 KR → winner takes 180 KR → DUEL keeps 20 KR.',
  },
  {
    q: 'How do I deposit money?',
    a: 'Go to Wallet → Deposit. Select an amount and click "Deposit via Trustly." You\'ll be redirected to Trustly where you confirm the transfer with your bank and MitID. Funds are credited instantly.',
  },
  {
    q: 'How do I withdraw?',
    a: 'Go to Wallet → Withdraw. Enter an amount and confirm via Trustly with MitID. Funds arrive in your bank account within 1–2 banking days. Minimum withdrawal is 100 KR.',
  },
  {
    q: 'What happens if the match ends in a tie?',
    a: 'For Card Duel and CycleDuel: tied score triggers sudden death. Each player picks one card secretly, simultaneous reveal. Repeat until broken. For DropDuel: if the board fills with no winner, the pot is split and no platform fee is taken.',
  },
  {
    q: 'What if my opponent disconnects?',
    a: 'Opponents have 30 seconds to reconnect. If they fail to reconnect within that window, the match resolves in your favour and you are awarded the pot.',
  },
  {
    q: 'Can I play from outside Denmark?',
    a: 'Currently no. DUEL requires MitID for account creation, which is only available to Danish residents. We plan to expand to other Nordic markets in the future.',
  },
  {
    q: 'Can I see my opponent\'s moves before I lock mine?',
    a: 'In Card Duel: no. Both players lock their full sequence simultaneously. You can see how many slots the opponent has locked, but not which cards. Slots are revealed sequentially after both are fully locked. In CycleDuel: yes — one card per block is revealed to both players before locking the block sequence (the peek mechanic). Position of the peeked card within the 3-slot block is still your choice.',
  },
  {
    q: 'What is the platform fee for tournaments?',
    a: 'Tournaments use a 15% rake on the total purse. Prize breakdown is published per event on the tournament page. The fee is higher than per-match because tournament organisation, bracket management, and tiebreaker handling add overhead.',
  },
  {
    q: 'How is my identity kept private?',
    a: 'MitID verifies your age and identity at registration. Your real name is never stored or shown on the platform. Only your handle is visible to opponents. Match history shows handles only.',
  },
  {
    q: 'Can I have more than one account?',
    a: 'No. Multiple accounts are strictly prohibited. Detected duplicates result in permanent ban and forfeiture of all balances. MitID verification makes it very difficult to create duplicates.',
  },
  {
    q: 'How do I set deposit limits?',
    a: 'Go to Profile → Account Settings → Deposit Limits. Set a daily, weekly, or monthly cap. Limits take effect immediately. To increase a limit you must wait 24 hours after requesting the change.',
  },
  {
    q: 'What games are available?',
    a: 'Three games at launch: Card Duel (sealed sequential RPS), CycleDuel (five-type cycle with peek mechanic), and DropDuel (Connect Four with block placement). More games are in development.',
  },
  {
    q: 'Something went wrong in a match — what do I do?',
    a: 'Contact support at support@duel.dk with your match ID (visible in the match URL and on the result screen). All match states are recorded server-side. We will investigate and respond within 48 hours.',
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" />

      <section style={{ padding: `56px ${s.px} 48px`, maxWidth: 800 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>HELP</div>
        <h1 style={{ ...s.display(80), lineHeight: 0.85, marginBottom: 40 }}>FAQ.</h1>

        <div style={s.rule} />

        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left', gap: 24,
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: 'var(--ink)' }}>
                {faq.q}
              </span>
              <span style={{ ...s.mono, fontSize: 16, color: 'var(--ink-faint)', flexShrink: 0 }}>
                {open === i ? '−' : '+'}
              </span>
            </button>
            {open === i && (
              <div style={{ paddingBottom: 20 }}>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: 600 }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 48, padding: '24px 28px', border: '1.5px solid var(--ink)' }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>STILL NEED HELP?</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 16 }}>
            Contact us at <strong>support@duel.dk</strong> — we respond within 48 hours.
            For match disputes include your match ID.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/rules" style={{
              ...s.mono, fontSize: 11,
              border: '1.5px solid var(--ink)', padding: '8px 16px',
              textDecoration: 'none', color: 'var(--ink)',
            }}>
              READ RULES →
            </Link>
            <Link href="/responsible-gaming" style={{
              ...s.mono, fontSize: 11,
              border: '1px solid var(--rule-soft)', padding: '8px 16px',
              textDecoration: 'none', color: 'var(--ink-faint)',
            }}>
              RESPONSIBLE GAMING
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
