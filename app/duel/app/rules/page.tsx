import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

export default function RulesPage() {
  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" />

      <section style={{ padding: `56px ${s.px} 48px`, maxWidth: 800 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>PLATFORM RULES</div>
        <h1 style={{ ...s.display(80), lineHeight: 0.85, marginBottom: 40 }}>HOW TO PLAY.</h1>

        {/* General rules */}
        <Section title="GENERAL RULES">
          {[
            { t: 'ONE ACCOUNT PER PERSON',   d: 'Multiple accounts are strictly prohibited. Detected duplicates result in permanent ban and forfeiture of balance.' },
            { t: 'NO COLLUSION',             d: 'Coordinating with an opponent or third party to manipulate match outcomes is prohibited. Accounts involved will be permanently banned.' },
            { t: 'NO BOTS OR AUTOMATION',    d: 'Automated play of any kind is prohibited. You must play yourself, in real time.' },
            { t: 'NO DECLINE ONCE PAIRED',   d: 'Entering a room is a commitment. Once matched with an opponent, the entry fee is locked. You cannot back out.' },
            { t: 'DISCONNECTION POLICY',     d: 'Disconnecting mid-match does not void the match. Reconnect within 30 seconds or the match resolves in favour of the connected player.' },
            { t: 'DISPUTE RESOLUTION',       d: 'All match outcomes are recorded server-side. In case of dispute, DUEL\'s server log is definitive. Contact support with your match ID.' },
          ].map(item => (
            <div key={item.t} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, padding: '16px 0', borderBottom: '1px solid var(--rule-soft)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', paddingTop: 2 }}>{item.t}</div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{item.d}</p>
            </div>
          ))}
        </Section>

        {/* Card Duel */}
        <GameSection
          num="01" name="CARD DUEL" slug="card-duel"
          desc="Sealed sequential rock paper scissors. Both players arrange a 9-card sequence blind and lock simultaneously."
          rules={[
            { t: 'HAND',       d: '9 cards: 3× Rock, 3× Paper, 3× Scissors. Both players have the same hand.' },
            { t: 'LOCK PHASE', d: 'Arrange all 9 cards into a sequence. Lock simultaneously. Opponent\'s locked slots are hidden (face-down ■) until reveal.' },
            { t: 'RESOLVE',    d: 'Slots resolve sequentially 1→9. Win = 1pt, tie = 0 each. Opponent\'s card revealed per slot.' },
            { t: 'WINNER',     d: 'Most points after 9 slots wins the pot.' },
            { t: 'TIEBREAKER', d: 'Equal score → sudden death. Each player picks one card secretly. Simultaneous reveal. Repeat until broken.' },
          ]}
        />

        {/* CycleDuel */}
        <GameSection
          num="02" name="CYCLEDUEL" slug="cycle-duel"
          desc="Five-type cycle game with a peek mechanic. Information is revealed before each block."
          rules={[
            { t: 'HAND',       d: '10 cards: 2× Feint, 2× Guard, 2× Strike, 2× Rush, 2× Grab.' },
            { t: 'THE CYCLE',  d: 'Feint > Guard, Strike | Guard > Strike, Rush | Strike > Rush, Grab | Rush > Grab, Feint | Grab > Feint, Guard. Chart always visible.' },
            { t: 'BLOCKS',     d: '3 blocks of 3 rounds = 9 rounds total. 1 card benched before block 3 (player chooses).' },
            { t: 'PEEK',       d: 'At the start of each block, both players reveal one card to each other simultaneously. Position of the revealed card is not fixed.' },
            { t: 'LOCK',       d: 'Lock a 3-card sequence for the block. The peeked card can go in any slot.' },
            { t: 'WINNER',     d: 'Most points after all 9 rounds wins. Tiebreaker: sudden death pick from 5 types.' },
          ]}
        />

        {/* DropDuel */}
        <GameSection
          num="03" name="DROPDUEL" slug="drop-duel"
          desc="Two-phase Connect Four. Both players secretly place one blocked cell before the game begins."
          rules={[
            { t: 'PHASE 1',    d: 'Each player secretly places 1 blocked cell on the 6×7 board. Not bottom row, not top row. Both revealed simultaneously at game start.' },
            { t: 'PHASE 2',    d: 'Standard Connect Four on the modified board. Pieces stack on top of blocked cells.' },
            { t: 'TIME LIMIT', d: 'Per-move time limit enforced. On timeout, piece auto-places in the first available column (right to left).' },
            { t: 'WINNER',     d: 'First to connect four pieces in a row (horizontal, vertical, or diagonal) wins the pot.' },
            { t: 'DRAW',       d: 'If the board fills with no winner: pot is split, no platform fee taken.' },
          ]}
        />

        {/* Scoring & fees */}
        <Section title="SCORING & FEES">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 16 }}>
            {[
              { label: 'WINNER TAKES', value: '90% OF POT' },
              { label: 'PLATFORM FEE', value: '10% PER MATCH' },
              { label: 'DRAW',         value: 'FULL REFUND' },
            ].map(item => (
              <div key={item.label} style={{ border: '1.5px solid var(--ink)', padding: '20px' }}>
                <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 560 }}>
            Tournament rake is 15% of total purse. Prize breakdown published per event.
            No additional fees for deposits or withdrawals from DUEL. Bank transfer fees may apply on Trustly side.
          </p>
        </Section>

      </section>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>{title}</div>
      <div style={{ height: 1, background: 'var(--ink)', marginBottom: 20 }} />
      {children}
    </div>
  )
}

function GameSection({ num, name, slug, desc, rules }: {
  num: string; name: string; slug: string; desc: string
  rules: { t: string; d: string }[]
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
          <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)' }}>{num}</span>
          <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>GAME RULES · {name}</span>
        </div>
        <Link href={`/play/${slug}`} style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', textDecoration: 'none' }}>
          PLAY →
        </Link>
      </div>
      <div style={{ height: 1, background: 'var(--ink)', marginBottom: 16 }} />
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 20, maxWidth: 520 }}>{desc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {rules.map(r => (
          <div key={r.t} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, padding: '12px 0', borderBottom: '1px solid var(--rule-soft)' }}>
            <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', paddingTop: 2 }}>{r.t}</span>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{r.d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
