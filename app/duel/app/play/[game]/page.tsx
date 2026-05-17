import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getGameDetail } from '@/lib/mock-data'

const ROOMS_WIN: Record<number, number> = {
  10: 18, 25: 44, 50: 92, 100: 188, 250: 480, 500: 970,
}

/* ── Shared sticky rooms panel ── */
function RoomsPanel({ slug, stakeRooms }: { slug: string; stakeRooms: { kr: number; liveCount: number }[] }) {
  const standard = stakeRooms.filter(r => r.kr <= 500)

  function RoomRow({ room, bone }: { room: { kr: number; liveCount: number }; bone?: boolean }) {
    const win = ROOMS_WIN[room.kr] ?? room.kr * 2 - Math.round(room.kr * 2 * 0.1)
    return (
      <Link
        href={`/play/${slug}/lobby?kr=${room.kr}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid var(--rule-soft)',
          background: bone ? 'var(--bone-2)' : 'transparent',
          textDecoration: 'none', color: 'inherit',
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {room.kr} KR
          </span>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
            WIN {win} KR
          </div>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {room.liveCount > 0 && <span className="live-dot" />}
          <span style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{room.liveCount} LIVE</span>
        </span>
      </Link>
    )
  }

  return (
    <div style={{ position: 'sticky', top: 60 }}>
      <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12, letterSpacing: '0.12em' }}>STAKE ROOMS · LIVE</div>

      <div style={{ border: '1.5px solid var(--ink)' }}>
        {standard.map((room, i) => (
          <RoomRow key={room.kr} room={room} bone={i === Math.floor(standard.length / 2)} />
        ))}

        <Link href={`/play/${slug}/elite`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px',
          background: 'var(--ink)',
          textDecoration: 'none',
          borderTop: '1px solid rgba(240,237,228,0.08)',
        }}>
          <div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--alarm)', letterSpacing: '0.18em', fontWeight: 700, marginBottom: 4 }}>● ELITE ROOM</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--bone)', letterSpacing: '-0.02em' }}>
              1,000+ KR · CUSTOM
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--alarm)', letterSpacing: '-0.01em' }}>ENTER →</span>
        </Link>
      </div>

      <Link href={`/play/${slug}/lobby`} style={{
        display: 'block', width: '100%', textAlign: 'center',
        background: 'var(--ink)', color: 'var(--bone)',
        padding: '18px 20px', marginTop: 2,
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
        textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: 'none',
      }}>
        OPEN LOBBY →
      </Link>
    </div>
  )
}

/* ── Shared stat bar ── */
function StatBar({ stats }: { stats: [string, string, boolean?][] }) {
  return (
    <div style={{ display: 'flex', gap: 48, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule-soft)' }}>
      {stats.map(([val, lab, alarm]) => (
        <div key={lab}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1, color: alarm ? 'var(--alarm)' : 'inherit' }}>{val}</div>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 4, letterSpacing: '0.12em' }}>{lab}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Shared how-it-plays step grid ── */
function StepGrid({ steps }: { steps: { n: string; title: string; desc: string; viz: React.ReactNode }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 2 }}>
      {steps.map(step => (
        <div key={step.n} style={{ border: '1.5px solid var(--ink)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, color: 'var(--alarm)', letterSpacing: '-0.02em', lineHeight: 1 }}>{step.n}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, textTransform: 'uppercase', letterSpacing: '-0.01em', marginTop: 8 }}>{step.title}</div>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 8 }}>{step.desc}</p>
          <div style={{ marginTop: 20 }}>{step.viz}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Slot (Card Duel) ── */
function Slot({ c, win, loss, sealed }: { c?: string; win?: boolean; loss?: boolean; sealed?: boolean }) {
  let bg = 'transparent', fg = 'var(--ink)', border = 'var(--ink)'
  if (sealed) { bg = 'var(--ink)'; fg = 'transparent' }
  else if (win)  { bg = 'var(--money)'; fg = '#fff'; border = 'var(--money)' }
  else if (loss) { bg = 'var(--alarm)'; fg = '#fff'; border = 'var(--alarm)' }
  return (
    <div style={{
      width: 28, height: 28, border: `1.5px solid ${border}`,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
      letterSpacing: '-0.02em',
    }}>{c}</div>
  )
}

/* ── Cycle card ── */
const CYCLE_MOVES = [
  { k: 'F', label: 'FEINT',  beats: 'STRIKE',  loses: 'GUARD'  },
  { k: 'G', label: 'GUARD',  beats: 'RUSH',    loses: 'GRAB'   },
  { k: 'S', label: 'STRIKE', beats: 'GRAB',    loses: 'FEINT'  },
  { k: 'R', label: 'RUSH',   beats: 'GUARD',   loses: 'STRIKE' },
  { k: 'A', label: 'GRAB',   beats: 'FEINT',   loses: 'RUSH'   },
]

function CycleCard({ k, size = 48 }: { k: string; size?: number }) {
  const move = CYCLE_MOVES.find(m => m.k === k)
  return (
    <div style={{
      width: size, height: Math.round(size * 1.35),
      border: '1.5px solid var(--ink)', background: 'var(--bone)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4,
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.42, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{k}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: size * 0.13, marginTop: 2, color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{move?.label}</span>
    </div>
  )
}

/* ── Drop cell ── */
function DropCell({ fill, hidden, size = 36 }: { fill?: 'you' | 'opp'; hidden?: boolean; size?: number }) {
  return (
    <div style={{ width: size, height: size, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: size * 0.78, height: size * 0.78, borderRadius: '50%',
        background: fill === 'you' ? 'var(--bone)' : fill === 'opp' ? 'var(--alarm)' : hidden ? 'transparent' : 'var(--concrete-2)',
        border: hidden ? '1.5px dashed rgba(239,237,228,0.5)' : 'none',
      }} />
    </div>
  )
}

/* ── CARD DUEL content ── */
function CardDuelContent() {
  const cardSteps = [
    {
      n: '01', title: 'BUILD HAND', desc: 'Three rocks, three papers, three scissors. Always the same. No surprises.',
      viz: <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
        {['R','R','R','P','P','P','S','S','S'].map((c,i) => <Slot key={i} c={c} />)}
      </div>,
    },
    {
      n: '02', title: 'LOCK SEQUENCE', desc: 'Arrange your nine moves blind. Your opponent does the same. No peeking.',
      viz: <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
        {Array.from({length:9}).map((_,i) => <Slot key={i} sealed />)}
      </div>,
    },
    {
      n: '03', title: 'REVEAL · WIN', desc: 'Slots resolve one by one. Most slot wins takes the pot. Tie → sudden death.',
      viz: <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
        <div style={{ display: 'flex', gap: 4 }}>{['P','R','S','P','R','S','P','R','S'].map((c,i) => <Slot key={i} c={c} win={i%3===0} />)}</div>
        <div style={{ display: 'flex', gap: 4 }}>{['R','P','R','S','S','R','S','P','P'].map((c,i) => <Slot key={i} c={c} loss={i%3===0} />)}</div>
      </div>,
    },
  ]
  return (
    <>
      <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>DISCIPLINE 01 · CLASSIC</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 144, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.85 }}>
        CARD<br />DUEL.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.45, marginTop: 24, maxWidth: 520, color: 'var(--ink-soft)' }}>
        Sealed sequential rock paper scissors. Each player gets nine moves — three rocks, three papers, three scissors. Lock your sequence blind. Reveal slot by slot.
      </p>
      <StatBar stats={[['1V1','FORMAT'],['60s','PER ROUND'],['0','RANDOMNESS', true]]} />
      <div style={{ marginTop: 64, paddingBottom: 8, borderBottom: '2px solid var(--ink)', marginBottom: 24 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>HOW IT PLAYS</div>
      </div>
      <StepGrid steps={cardSteps} />
    </>
  )
}

/* ── CYCLEDUEL content ── */
function CycleDuelContent() {
  const cycleSteps = [
    {
      n: '01', title: 'FIVE TYPES', desc: 'Feint, Guard, Strike, Rush, Grab. Each beats two, loses to two. Two of each in your hand.',
      viz: <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
        {['F','G','S','R','A'].map(k => <CycleCard key={k} k={k} size={40} />)}
      </div>,
    },
    {
      n: '02', title: 'PEEK', desc: 'Each block, both players reveal one card to each other before sealing. Position stays secret.',
      viz: <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, alignItems: 'center' }}>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>THEY SHOW YOU</div>
        <CycleCard k="S" size={44} />
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>YOUR MOVE: FEINT BEATS STRIKE</div>
      </div>,
    },
    {
      n: '03', title: 'LOCK · WIN', desc: '3 blocks of 3 rounds. Lock your sequence after peeking. Most points after 9 rounds wins.',
      viz: <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
        {[['F','G','S'],['R','A','F'],['G','S','R']].map((block, bi) => (
          <div key={bi} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ ...s.mono, fontSize: 8, color: 'var(--ink-faint)', width: 16 }}>B{bi+1}</span>
            {block.map((k, ki) => <CycleCard key={ki} k={k} size={32} />)}
          </div>
        ))}
      </div>,
    },
  ]
  return (
    <>
      <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>DISCIPLINE 02 · CLASSIC</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 144, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.85 }}>
        CYCLE<br />DUEL.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.45, marginTop: 24, maxWidth: 520, color: 'var(--ink-soft)' }}>
        Five-type cycle with information reveals. Each block you see one of your opponent&apos;s cards before locking your sequence. Pure mind games — knowing one card doesn&apos;t tell you the position.
      </p>
      <StatBar stats={[['1V1','FORMAT'],['90s','PER BLOCK'],['0','RANDOMNESS', true]]} />
      <div style={{ marginTop: 64, paddingBottom: 8, borderBottom: '2px solid var(--ink)', marginBottom: 24 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>HOW IT PLAYS</div>
      </div>
      <StepGrid steps={cycleSteps} />
    </>
  )
}

/* ── DROPDUEL content ── */
const DROP_BOARD = [
  ['','','','','','',''],
  ['','','','','','',''],
  ['','','','','','',''],
  ['','','','o','','',''],
  ['','','y','y','o','',''],
  ['','o','y','o','y','','o'],
]

function DropDuelContent() {
  const dropSteps = [
    {
      n: '01', title: 'PLACE BLOCK', desc: 'Both players secretly place one blocked cell simultaneously. Revealed when the match starts.',
      viz: <div style={{ background: 'var(--ink)', padding: 6, display: 'inline-block' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 28px)', gap: 3 }}>
          {Array.from({length:6}).flatMap((_, r) =>
            Array.from({length:7}).map((_, c) => (
              <DropCell key={`${r}-${c}`}
                fill={r===5&&c===2?'you':r===5&&c===5?'opp':undefined}
                hidden={r===3&&c===4}
                size={28}
              />
            ))
          )}
        </div>
      </div>,
    },
    {
      n: '02', title: 'DROP', desc: 'Take turns dropping pieces into columns. 8 seconds per move. Board fills from the bottom.',
      viz: <div style={{ background: 'var(--ink)', padding: 6, display: 'inline-block' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 28px)', gap: 3 }}>
          {DROP_BOARD.flatMap((row, r) => row.map((c, k) => (
            <DropCell key={`${r}-${k}`} fill={c==='y'?'you':c==='o'?'opp':undefined} hidden={r===2&&k===5} size={28} />
          )))}
        </div>
      </div>,
    },
    {
      n: '03', title: 'FOUR IN A ROW', desc: 'First to connect four wins the pot. Board fills with no winner — overflow column unlocks. Still tied — threat score decides. True tie — full refund.',
      viz: <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', width: '100%', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 120, color: 'var(--money)', letterSpacing: '-0.04em', lineHeight: 1 }}>4</div>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.14em', textAlign: 'center' }}>IN A ROW</div>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.10em', textAlign: 'center' }}>HORIZONTAL · VERTICAL · DIAGONAL</div>
      </div>,
    },
  ]
  return (
    <>
      <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>DISCIPLINE 03 · BLOCK</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 144, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.85 }}>
        DROP<br />DUEL.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.45, marginTop: 24, maxWidth: 520, color: 'var(--ink-soft)' }}>
        Connect Four with one twist. Before the match starts, both players place a hidden block anywhere on the board simultaneously. Neither of you knows where the other placed until you collide.
      </p>
      <StatBar stats={[['1V1','FORMAT'],['8s','PER MOVE'],['0','RANDOMNESS', true]]} />
      <div style={{ marginTop: 64, paddingBottom: 8, borderBottom: '2px solid var(--ink)', marginBottom: 24 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>HOW IT PLAYS</div>
      </div>
      <StepGrid steps={dropSteps} />
    </>
  )
}

/* ── PAGE ── */
export default async function GameDetailPage({ params }: { params: Promise<{ game: string }> }) {
  const { game: slug } = await params
  const detail = getGameDetail(slug)
  if (!detail) notFound()

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav activePage="games" />

      <section style={{ padding: `32px ${s.px}` }}>
        <div style={{ ...s.mono, fontSize: 11, letterSpacing: '0.10em', color: 'var(--ink-faint)' }}>
          GAMES / {detail.name}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 64, alignItems: 'start', marginTop: 16 }}>
          <div>
            {slug === 'cycleduel' ? <CycleDuelContent /> :
             slug === 'dropduel'  ? <DropDuelContent  /> :
                                    <CardDuelContent   />}
          </div>
          <RoomsPanel slug={slug} stakeRooms={detail.stakeRooms} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
