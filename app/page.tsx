import Link from 'next/link'
import { BroadcastNav, StadiumStrip, LiveTicker } from '@/components/BroadcastNav'
import { HowItPlays } from '@/components/HowItPlays'
import { Footer } from '@/components/Footer'
import { getNews, getGames, type NewsItem, type GameRow } from '@/lib/mock-data'

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

/* ── HERO ── */
function Hero() {
  return (
    <section style={{ padding: `64px ${px} 40px`, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'end' }}>
      <div>
        <div style={{ ...mono, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          47 MATCHES IN PROGRESS · 12 IN QUEUE · 1.247 SETTLED TODAY
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
        <Link href="/play" style={{
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

/* ── JUMBOTRON ── */
type Move = 'P' | 'R' | 'S' | null
const MOVES_LEFT:  Move[] = ['P','R','S','S','R', null, null, null, null]
const MOVES_RIGHT: Move[] = ['R','P','R','P','S', null, null, null, null]

function slotResult(a: Move, b: Move): 'win' | 'loss' | 'tie' | null {
  if (!a || !b) return null
  if (a === b) return 'tie'
  if ((a==='R'&&b==='S')||(a==='P'&&b==='R')||(a==='S'&&b==='P')) return 'win'
  return 'loss'
}

function Slot({ move, result }: { move: Move; result: ReturnType<typeof slotResult> }) {
  const revealed = move !== null
  let bg = 'transparent', fg = 'var(--ink)', border = 'var(--ink)'
  if (!revealed) { bg = 'var(--ink)'; fg = 'transparent' }
  else if (result === 'win')  { bg = 'var(--money)'; fg = '#fff'; border = 'var(--money)' }
  else if (result === 'loss') { bg = 'var(--alarm)';  fg = '#fff'; border = 'var(--alarm)' }
  return (
    <div style={{
      width: 32, height: 44, border: `1.5px solid ${border}`,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
    }}>
      {revealed ? move : ''}
    </div>
  )
}

function Jumbotron() {
  const scoreL = MOVES_LEFT.filter((m, i) => slotResult(m, MOVES_RIGHT[i]) === 'win').length
  const scoreR = MOVES_RIGHT.filter((m, i) => slotResult(m, MOVES_LEFT[i]) === 'win').length
  return (
    <section style={{ padding: `40px ${px}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ ...mono, fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          JUMBOTRON · WATCH IT HAPPEN
        </div>
        <span style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)' }}>SHOWING THE BIGGEST LIVE POT</span>
      </div>
      <div style={{ border: '1.5px solid var(--ink)', background: 'var(--bone-2)', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ ...mono, fontSize: 11 }}>
            <span className="live-dot" style={{ marginRight: 8 }} />
            LIVE NOW · MATCH 4F2A · CARD DUEL · 250 KR ROOM
          </span>
          <span style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)' }}>SLOT 6 OF 9 · 234 WATCHING</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>OPPONENT</div>
            <div style={{ ...display(56), lineHeight: 0.9 }}>LASERHAWK</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
              {MOVES_LEFT.map((m, i) => <Slot key={i} move={m} result={slotResult(m, MOVES_RIGHT[i])} />)}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>POT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 88, letterSpacing: '-0.03em', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>450</div>
            <div style={{ ...display(18), marginTop: -4, letterSpacing: '0.02em' }}>KR</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, marginTop: 14 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, fontVariantNumeric: 'tabular-nums' }}>{scoreL}</span>
              <span style={{ ...mono, fontSize: 14, color: 'var(--ink-faint)' }}>—</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--alarm)', fontVariantNumeric: 'tabular-nums' }}>{scoreR}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>CHALLENGER</div>
            <div style={{ ...display(56), lineHeight: 0.9 }}>NOVASTRIKE</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 14, justifyContent: 'flex-end' }}>
              {MOVES_RIGHT.map((m, i) => <Slot key={i} move={m} result={slotResult(m, MOVES_LEFT[i])} />)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(13,13,13,0.22)' }}>
          <div style={{ ...mono, fontSize: 11, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="thinking"><span /><span /><span /></span>
            NOVASTRIKE locking slot 6
          </div>
          <button className="btn primary sm">WATCH LIVE →</button>
        </div>
      </div>
    </section>
  )
}

/* ── TODAY'S BOARD ── */
function TodaysBoard() {
  return (
    <section style={{ padding: `40px ${px}`, background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <h2 style={display(72)}>TODAY&apos;S BOARD</h2>
        <span style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)' }}>SETTLED 00:00–NOW · UPDATES LIVE</span>
      </div>
      <div style={{ display: 'flex', gap: 48, alignItems: 'stretch' }}>
        <BoardColumn label="BIGGEST POTS" rows={[
          ['01','k_8821 vs grimreef',  'CARD · 250 ROOM',   '5.420'],
          ['02','sandman vs reef',     'CYCLE · 500 ROOM',  '4.500'],
          ['03','NovaStrike vs anon#9','CARD · 250 ROOM',   '4.500'],
          ['04','mads_kbh vs viper99', 'DROP · 100 ROOM',   '1.800'],
          ['05','siren vs iso_9001',   'CARD · 50 ROOM',    '900'],
        ]} />
        <div style={{ width: 1, background: 'var(--rule-soft)', alignSelf: 'stretch' }} />
        <BoardColumn label="LONGEST STREAK" rows={[
          ['01','NovaStrike',  'CARD · ACTIVE',        '7'],
          ['02','k_8821',      'CARD · BROKEN 12:18',  '6'],
          ['03','sandman',     'CYCLE · ACTIVE',       '5'],
          ['04','piloto',      'CYCLE · BROKEN 11:42', '4'],
          ['05','reef',        'CYCLE · ACTIVE',       '3'],
        ]} />
        <div style={{ width: 1, background: 'var(--rule-soft)', alignSelf: 'stretch' }} />
        <BoardColumn label="BIGGEST DAY (KR)" rows={[
          ['01','k_8821',     '11 MATCHES · 9W 2L', '8.420'],
          ['02','NovaStrike', '8 MATCHES · 7W 1L',  '6.250'],
          ['03','sandman',    '14 MATCHES · 9W 5L', '4.180'],
          ['04','reef',       '6 MATCHES · 5W 1L',  '3.100'],
          ['05','mads_kbh',   '12 MATCHES · 7W 5L', '2.450'],
        ]} />
      </div>
    </section>
  )
}

function BoardColumn({ label, rows }: { label: string; rows: string[][] }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', marginBottom: 6, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ height: 2, background: 'var(--alarm)' }} />
      {rows.map(([rank, who, what, num], i) => (
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
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: i === 0 ? 40 : 28, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{num}</span>
        </div>
      ))}
    </div>
  )
}

/* ── FROM THE FLOOR ── */
const NEWS = [
  { time: '12 MIN', head: 'k_8821 takes 5.420 KR pot', body: 'Card Duel · 250 KR room. Eight-slot sweep. Largest pot of the day so far.' },
  { time: '38 MIN', head: 'NovaStrike on 4-match streak', body: 'Climbed three rooms in two hours. Now sitting in the 250 KR room waiting on a challenger.' },
  { time: '1 HR',   head: 'CycleDuel queue at all-time high', body: '127 simultaneous matches — first time the game has crossed 100. Old record set last Saturday.' },
  { time: '2 HR',   head: 'DropDuel beta opens 100 KR room', body: 'Stake range was 25–50 since launch. 100 KR room unlocked at 18:00. First match settled in 9 minutes.' },
]

const FIXTURES = [
  { time: '20:00', label: "TONIGHT'S MARQUEE",  room: '500 KR ROOM', game: 'CARD DUEL',  status: 'OPEN' },
  { time: '20:30', label: 'WEEKLY OPEN',         room: '50 KR ROOM',  game: 'CYCLEDUEL',  status: 'OPEN' },
  { time: '21:00', label: 'KING OF THE BLOCK',   room: '100 KR ROOM', game: 'DROPDUEL',   status: 'OPEN' },
  { time: '22:00', label: 'LATE WINDOW',         room: '25 KR ROOM',  game: 'CARD DUEL',  status: 'OPEN' },
  { time: '23:30', label: 'NIGHT OWL',           room: '10 KR ROOM',  game: 'CARD DUEL',  status: 'WAITLIST' },
]

function FromTheFloor() {
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
          <div style={{ ...mono, fontSize: 10, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.18em' }}>● LEAD · 12 MIN AGO</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 52, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.9, marginTop: 10 }}>{NEWS[0].head}.</h3>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 16 }}>{NEWS[0].body}</p>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 12 }}>
            The room had been quiet for forty minutes when grimreef paired in. Two slots later it was over — k_8821 sealed five reads in a row and the board didn&apos;t see another fight on that stake until past nine.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn sm">REPLAY</button>
            <button className="btn ghost sm">QUEUE THE 250</button>
          </div>
        </article>

        {/* Filed tonight */}
        <div style={{ borderRight: '1px solid rgba(13,13,13,0.18)', paddingRight: 28 }}>
          <div style={{ ...mono, fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>FILED TONIGHT</div>
          <div style={{ height: 2, background: 'var(--alarm)', marginBottom: 14 }} />
          {NEWS.slice(1).map((n, i, a) => (
            <article key={i} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: i < a.length - 1 ? '1px solid rgba(13,13,13,0.22)' : 'none' }}>
              <div style={{ ...mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>{n.time} AGO</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.1, marginTop: 4 }}>{n.head}</h4>
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
function Disciplines({ games }: { games: GameRow[] }) {
  return (
    <section style={{ padding: `0 ${px} 56px` }}>
      <div style={{ height: 2, background: 'var(--alarm)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '24px 0 16px' }}>
        <h2 style={display(56)}>3 DISCIPLINES.</h2>
        <span style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)' }}>MORE COMING</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {games.map((g, i) => (
          <div key={g.slug} style={{ flex: 1, border: '1.5px solid var(--ink)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...mono, fontSize: 11, color: 'var(--ink-faint)' }}>0{i + 1}</span>
              <span style={{ ...mono, fontSize: 11, color: 'var(--money)' }}>● {g.liveCount} LIVE</span>
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
export default function Home() {
  const games = getGames()

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)' }}>
      <StadiumStrip />
      <BroadcastNav activePage="live" loggedOut />
      <Hero />
      <LiveTicker />
      <Jumbotron />
      <TodaysBoard />
      <FromTheFloor />
      <section style={{ padding: `56px ${px}` }}>
        <HowItPlays />
      </section>
      <Disciplines games={games} />
      <Footer />
    </div>
  )
}
