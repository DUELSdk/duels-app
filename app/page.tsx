import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { HowItPlays } from '@/components/HowItPlays'
import { Footer } from '@/components/Footer'
import { Jumbotron } from '@/components/Jumbotron'
import { getNews } from '@/lib/mock-data'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const px = '56px'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.06em',
}

function display(size: number): React.CSSProperties {
  return {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: size,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    lineHeight: 0.88,
  }
}

function fmtKr(ore: number) {
  return Math.round(ore / 100).toLocaleString('da-DK')
}

function fmtRank(n: number) {
  return String(n).padStart(2, '0')
}

/* ── HERO ── */
function Hero({ live, settled }: { live: number; settled: number }) {
  return (
    <section style={{ padding: `64px ${px} 40px`, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'end' }}>
      <div>
        <div style={{ ...mono, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          {live} MATCHES IN PROGRESS · {settled.toLocaleString('da-DK')} SETTLED TODAY
        </div>
        <h1 style={{ ...display(240), lineHeight: 0.85, marginTop: 24 }}>DUELS.</h1>
        <p style={{ fontSize: 22, lineHeight: 1.35, marginTop: 24, maxWidth: 560 }}>
          1v1 skill games for real money.{' '}
          <span style={{ color: 'var(--ink-faint)' }}>No luck. No license. Just you and them.</span>
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/play" style={{
          display: 'block', textAlign: 'center',
          background: 'var(--ink)', color: 'var(--bone)',
          border: '1.5px solid var(--ink)', padding: '18px 28px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
          textTransform: 'uppercase', letterSpacing: '-0.01em', textDecoration: 'none',
        }}>
          FIND ME A FIGHT →
        </Link>
        <Link href="/play/card-duel" style={{
          display: 'block', textAlign: 'center',
          border: '1.5px solid var(--ink)', padding: '14px 28px',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          textTransform: 'uppercase', letterSpacing: '-0.01em',
          background: 'transparent', textDecoration: 'none', color: 'var(--ink)',
        }}>
          WATCH ONE FIRST
        </Link>
        <p style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 4 }}>
          18+ · PLAY WITHIN MEANS · SPILLELOVEN EXEMPT
        </p>
      </div>
    </section>
  )
}

/* ── TODAY'S BOARD ── */
type BoardEntry = { rank: string; who: string; what: string; value: string }

function TodaysBoard({ pots, streaks, days }: {
  pots: BoardEntry[]
  streaks: BoardEntry[]
  days: BoardEntry[]
}) {
  return (
    <section style={{ padding: `40px ${px}`, background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <h2 style={display(72)}>TODAY&apos;S BOARD</h2>
        <span style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)' }}>SETTLED 00:00–NOW · UPDATES LIVE</span>
      </div>
      <div style={{ display: 'flex', gap: 48, alignItems: 'stretch' }}>
        <BoardColumn label="BIGGEST POTS"    rows={pots}    />
        <div style={{ width: 1, background: 'var(--rule-soft)', alignSelf: 'stretch' }} />
        <BoardColumn label="LONGEST STREAK"  rows={streaks} />
        <div style={{ width: 1, background: 'var(--rule-soft)', alignSelf: 'stretch' }} />
        <BoardColumn label="BIGGEST DAY (KR)" rows={days}   />
      </div>
    </section>
  )
}

function BoardColumn({ label, rows }: { label: string; rows: BoardEntry[] }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', marginBottom: 6, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ height: 2, background: 'var(--alarm)' }} />
      {rows.length === 0 ? (
        <div style={{ ...mono, fontSize: 10, color: 'var(--ink-ghost)', padding: '20px 0' }}>NO DATA YET</div>
      ) : rows.map(({ rank, who, what, value }, i) => (
        <div key={rank} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          padding: i === 0 ? '20px 0' : '14px 0',
          borderBottom: '1px solid rgba(13,13,13,0.22)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ ...mono, fontSize: i === 0 ? 14 : 11, color: 'var(--ink-faint)', width: 28 }}>{rank}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: i === 0 ? 24 : 18, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{who}</div>
              <div style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{what}</div>
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: i === 0 ? 40 : 28, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

/* ── FROM THE FLOOR — stays mock (no news table) ── */
const FIXTURES = [
  { time: '20:00', label: "TONIGHT'S MARQUEE",  room: '500 KR ROOM', game: 'CARD DUEL',  status: 'OPEN' },
  { time: '20:30', label: 'WEEKLY OPEN',         room: '50 KR ROOM',  game: 'CYCLEDUEL',  status: 'OPEN' },
  { time: '21:00', label: 'KING OF THE BLOCK',   room: '100 KR ROOM', game: 'DROPDUEL',   status: 'OPEN' },
  { time: '22:00', label: 'LATE WINDOW',         room: '25 KR ROOM',  game: 'CARD DUEL',  status: 'OPEN' },
  { time: '23:30', label: 'NIGHT OWL',           room: '10 KR ROOM',  game: 'CARD DUEL',  status: 'WAITLIST' },
]

function FromTheFloor() {
  const news = getNews()
  return (
    <section style={{ padding: `40px ${px}`, background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9 }}>FROM THE FLOOR.</h2>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>EDITORIAL · NOT BETTING ADVICE</div>
          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>EVENING EDITION · CET</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 32, marginTop: 24 }}>
        {/* Lead */}
        <article style={{ borderRight: '1px solid rgba(13,13,13,0.18)', paddingRight: 28 }}>
          <div style={{ ...mono, fontSize: 10, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.18em' }}>● {news[0].category} · {news[0].ago} AGO</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 52, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9, marginTop: 10 }}>{news[0].headline}.</h3>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 16 }}>{news[0].body}</p>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 12 }}>
            The room had been quiet for forty minutes when grimreef paired in. Two slots later it was over — k_8821 sealed five reads in a row and the board didn&apos;t see another fight on that stake until past nine.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Link href="/play/card-duel" className="btn sm" style={{ textDecoration: 'none' }}>REPLAY</Link>
            <Link href="/play/card-duel/lobby?kr=250" className="btn ghost sm" style={{ textDecoration: 'none' }}>QUEUE THE 250</Link>
          </div>
        </article>

        {/* Filed tonight */}
        <div style={{ borderRight: '1px solid rgba(13,13,13,0.18)', paddingRight: 28 }}>
          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>FILED TONIGHT</div>
          <div style={{ height: 2, background: 'var(--alarm)', marginBottom: 14 }} />
          {news.slice(1).map((n, i, a) => (
            <article key={i} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: i < a.length - 1 ? '1px solid rgba(13,13,13,0.22)' : 'none' }}>
              <div style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>{n.ago} AGO</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.1, marginTop: 4 }}>{n.headline}</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 6 }}>{n.body}</p>
            </article>
          ))}
        </div>

        {/* Tonight's card */}
        <aside>
          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>TONIGHT&apos;S CARD · CET</div>
          <div style={{ height: 2, background: 'var(--alarm)', marginBottom: 0 }} />
          {FIXTURES.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(13,13,13,0.22)', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{f.time}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.15 }}>{f.label}</div>
                <div style={{ ...mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 3, letterSpacing: '0.08em' }}>{f.game} · {f.room}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ ...mono, fontSize: 9, color: f.status === 'OPEN' ? 'var(--money)' : 'var(--alarm)', letterSpacing: '0.08em' }}>
                    {f.status === 'OPEN' ? '● OPEN' : '● WAITLIST'}
                  </span>
                  <span style={{ ...mono, fontSize: 10, fontWeight: 600 }}>ENTER →</span>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  )
}

/* ── 3 DISCIPLINES ── */
const GAME_DEFS = [
  { slug: 'card-duel',  name: 'Card Duel',  desc: 'Sequential mind games. Lock your sequence, read your opponent.',  roomRange: '10–500 KR' },
  { slug: 'cycle-duel', name: 'CycleDuel',  desc: '5-type cycle. One peek per block. Pure deduction.',              roomRange: '10–500 KR' },
  { slug: 'drop-duel',  name: 'DropDuel',   desc: 'Modified Connect Four. One blind block each — then play.',        roomRange: '10–500 KR' },
]

function Disciplines({ liveCounts }: { liveCounts: Record<string, number> }) {
  return (
    <section style={{ padding: `0 ${px} 56px` }}>
      <div style={{ height: 2, background: 'var(--alarm)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '24px 0 16px' }}>
        <h2 style={display(56)}>3 DISCIPLINES.</h2>
        <span style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)' }}>MORE COMING</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {GAME_DEFS.map((g, i) => (
          <div key={g.slug} style={{ flex: 1, border: '1.5px solid var(--ink)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)' }}>0{i + 1}</span>
              <span style={{ ...mono, fontSize: 11, color: 'var(--money)' }}>● {liveCounts[g.slug] ?? 0} LIVE</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, textTransform: 'uppercase', letterSpacing: '-0.01em', marginTop: 16 }}>{g.name}</div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.45 }}>{g.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 32, paddingTop: 12, borderTop: '1px solid rgba(13,13,13,0.22)' }}>
              <span style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{g.roomRange}</span>
              <Link href={`/play/${g.slug}`} style={{ ...mono, fontSize: 11, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>ENTER →</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── PAGE ── */
export default async function Home() {
  const supabaseServer = await createSupabaseServerClient()

  const [countsRes, boardRes, gameCountsRes] = await Promise.all([
    supabaseServer.rpc('rpc_get_live_counts'),
    supabaseServer.rpc('rpc_get_board'),
    supabaseServer.rpc('rpc_get_game_live_counts'),
  ])

  const counts = countsRes.data as { live: number; settled_today: number } | null
  const board  = boardRes.data  as {
    biggest_pots:    Array<{ rank: number; who: string; what: string; value_ore: number }>
    longest_streaks: Array<{ rank: number; handle: string; streak: number }>
    biggest_days:    Array<{ rank: number; handle: string; match_count: number; wins: number; losses: number; net_ore: number }>
  } | null

  const gameCounts = gameCountsRes.data as Array<{ game: string; live_count: number; today_count: number }> | null

  // Adapt board data to BoardEntry shape
  const potRows: BoardEntry[] = (board?.biggest_pots ?? []).map(r => ({
    rank:  fmtRank(r.rank),
    who:   r.who,
    what:  r.what.replace('CARD-DUEL', 'CARD DUEL').replace('CYCLE-DUEL', 'CYCLEDUEL').replace('DROP-DUEL', 'DROPDUEL'),
    value: fmtKr(r.value_ore),
  }))

  const streakRows: BoardEntry[] = (board?.longest_streaks ?? []).map(r => ({
    rank:  fmtRank(r.rank),
    who:   r.handle,
    what:  'WIN STREAK',
    value: String(r.streak),
  }))

  const dayRows: BoardEntry[] = (board?.biggest_days ?? []).map(r => ({
    rank:  fmtRank(r.rank),
    who:   r.handle,
    what:  `${r.wins}W · ${r.losses}L`,
    value: (r.net_ore >= 0 ? '+' : '') + fmtKr(Math.abs(r.net_ore)) + (r.net_ore < 0 ? '' : ''),
  }))

  // Live counts per game slug
  const liveByGame: Record<string, number> = {}
  for (const g of gameCounts ?? []) {
    liveByGame[g.game] = g.live_count
  }

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)' }}>
      <BroadcastNav activePage="live" />
      <Hero live={counts?.live ?? 0} settled={counts?.settled_today ?? 0} />
      <Jumbotron px={px} />
      <TodaysBoard pots={potRows} streaks={streakRows} days={dayRows} />
      <FromTheFloor />
      <section style={{ padding: `56px ${px}` }}>
        <HowItPlays />
      </section>
      <Disciplines liveCounts={liveByGame} />
      <Footer />
    </div>
  )
}
