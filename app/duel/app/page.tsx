import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer as SharedFooter } from '@/components/Footer'
import {
  getStatsStrip,
  getBoard,
  getFixtures,
  getNews,
  getGames,
  getTicker,
  type StatsStrip,
  type Board,
  type Fixture,
  type NewsItem,
  type GameRow,
  type TickerItem,
} from '@/lib/mock-data'

const px = '56px'
const s = {
  mono: { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em' } as React.CSSProperties,
  display: (size: number): React.CSSProperties => ({
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: size,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    lineHeight: 0.88,
  }),
  rule: { height: 1, background: 'var(--ink)' } as React.CSSProperties,
  ruleSoft: { width: 1, background: 'var(--rule-soft)', alignSelf: 'stretch' } as React.CSSProperties,
}

/* ── STADIUM STRIP ── */
function StadiumStrip({ data }: { data: StatsStrip }) {
  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--bone-on-dark)',
      padding: '6px 56px', display: 'flex', justifyContent: 'space-between',
    }}>
      <span style={{ ...s.mono, color: 'var(--bone-faint)', fontSize: 10 }}>
        DUEL · SKILL COMPETITION PLATFORM · BETA
      </span>
      <span style={{ ...s.mono, color: 'var(--bone-faint)', fontSize: 10 }}>
        {data.settledToday > 0
          ? `${data.settledToday.toLocaleString('da-DK')} SETTLED TODAY · ${data.totalPaidToday} KR PAID`
          : 'BOT MATCHES AVAILABLE · REAL MATCHMAKING COMING SOON'}
      </span>
    </div>
  )
}

/* ── LIVE TICKER ── */
function LiveTicker({ items }: { items: TickerItem[] }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)', overflow: 'hidden', height: 36 }}>
      <div className="ticker-track" style={{ alignItems: 'center', height: '100%' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            ...s.mono, padding: '0 24px', whiteSpace: 'nowrap',
            borderRight: '1px solid var(--rule-soft)',
            height: '100%', display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ color: 'var(--ink-faint)' }}>{item.game}</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── HERO ── */
function Hero() {
  return (
    <section style={{
      padding: `64px ${px} 48px`,
      display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'end',
    }}>
      <div>
        <div style={{ ...s.mono, fontSize: 12, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          BOT MATCHES · OPEN NOW
        </div>
        <h1 style={{ ...s.display(220), lineHeight: 0.85 }}>DUEL.</h1>
        <p style={{ fontSize: 20, lineHeight: 1.4, marginTop: 24, maxWidth: 540, color: 'var(--ink-soft)' }}>
          1v1 skill games for real money.{' '}
          <span style={{ color: 'var(--ink-faint)' }}>No luck. No license. Just you and them.</span>
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/play" style={{
          display: 'block', textAlign: 'center',
          background: 'var(--ink)', color: 'var(--bone)',
          border: '1.5px solid var(--ink)', padding: '18px 28px',
          fontFamily: 'var(--font-inter)', fontWeight: 700, fontSize: 15,
          width: '100%', textDecoration: 'none',
        }}>
          FIND ME A FIGHT →
        </Link>
        <Link href="/play" style={{
          display: 'block', textAlign: 'center',
          border: '1.5px solid var(--ink)', padding: '14px 28px',
          fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 14,
          width: '100%', background: 'transparent', textDecoration: 'none',
          color: 'var(--ink)',
        }}>
          SEE THE GAMES →
        </Link>
        <p style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 4 }}>
          18+ · PLAY WITHIN MEANS · SPILLELOVEN EXEMPT
        </p>
      </div>
    </section>
  )
}

/* ── JUMBOTRON ── */
function Jumbotron() {
  return (
    <section style={{ padding: `0 ${px} 40px` }}>
      <div style={{ ...s.mono, fontSize: 11, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="live-dot" /> JUMBOTRON · BIGGEST LIVE POT
        <span style={{ color: 'var(--ink-faint)', marginLeft: 'auto' }}>UPDATES IN REAL TIME</span>
      </div>
      <div style={{
        border: '1.5px solid var(--ink)', background: 'var(--bone-2)',
        padding: '56px 32px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 180,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--ink-ghost)', textTransform: 'uppercase' }}>
          NO LIVE MATCH RIGHT NOW
        </div>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>
          THE BIGGEST ACTIVE MATCH WILL APPEAR HERE
        </div>
        <Link href="/play" style={{
          ...s.mono, fontSize: 11, fontWeight: 600,
          border: '1.5px solid var(--ink)', padding: '10px 20px',
          textDecoration: 'none', color: 'var(--ink)', marginTop: 8,
        }}>
          START A MATCH →
        </Link>
      </div>
    </section>
  )
}

/* ── TODAY'S BOARD ── */
function BoardCol({ label, rows }: { label: string; rows: Board['biggestPots'] }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>{label}</div>
      <div style={s.rule} />
      {rows.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center' }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>NO DATA YET</div>
        </div>
      ) : rows.map((row, i) => (
        <div key={row.rank} style={{
          display: 'grid', gridTemplateColumns: '28px 1fr auto',
          alignItems: 'baseline', gap: 10,
          padding: '14px 0', borderBottom: '1px solid var(--rule-soft)',
        }}>
          <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>{row.rank}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: i === 0 ? 15 : 13 }}>{row.who}</div>
            <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{row.what}</div>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: i === 0 ? 28 : 22,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
          }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

function TodaysBoard({ board }: { board: Board }) {
  return (
    <section style={{ padding: `40px ${px}`, background: 'var(--bone-2)', borderTop: '1.5px solid var(--ink)', borderBottom: '1.5px solid var(--ink)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <h2 style={s.display(72)}>TODAY&apos;S BOARD</h2>
        <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>SETTLED 00:00–NOW · UPDATES LIVE</span>
      </div>
      <div style={{ display: 'flex', gap: 40 }}>
        <BoardCol label="BIGGEST POTS"    rows={board.biggestPots}    />
        <div style={s.ruleSoft} />
        <BoardCol label="LONGEST STREAK"  rows={board.longestStreaks}  />
        <div style={s.ruleSoft} />
        <BoardCol label="BIGGEST DAY (KR)" rows={board.biggestDays}   />
      </div>
    </section>
  )
}


/* ── FROM THE FLOOR ── */
function FromTheFloor({ items, fixtures }: { items: NewsItem[]; fixtures: Fixture[] }) {
  const feature   = items[0]
  const secondary = items.slice(1)
  return (
    <section style={{ padding: `40px ${px} 56px`, background: 'var(--bone-2)', borderTop: '1.5px solid var(--ink)' }}>

      {/* Masthead */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <h2 style={s.display(72)}>FROM THE FLOOR.</h2>
        <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)' }}>EDITORIAL · NOT BETTING ADVICE</span>
      </div>
      <div style={{ height: 3, background: 'var(--ink)', marginBottom: 0 }} />
      <div style={{ height: 1, background: 'var(--ink)', marginTop: 3, marginBottom: 0 }} />

      {/* Tonight's card */}
      <div style={{ padding: '20px 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ ...s.mono, fontSize: 10, letterSpacing: '0.1em' }}>TONIGHT&apos;S CARD</span>
          <Link href="/tournaments" style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', textDecoration: 'none' }}>ALL TOURNAMENTS →</Link>
        </div>
        <div style={{ height: 1, background: 'var(--rule-soft)', marginBottom: 0 }} />
        {fixtures.length === 0 ? (
          <div style={{ padding: '16px 0', display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: 'var(--ink-ghost)' }}>No events scheduled tonight.</span>
            <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>CHECK BACK FOR UPCOMING TOURNAMENTS</span>
          </div>
        ) : fixtures.map((f, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 1fr 160px 140px 80px', alignItems: 'center', gap: 24, padding: '12px 0', borderBottom: '1px solid var(--rule-soft)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>{f.time}</span>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, textTransform: 'uppercase' }}>{f.label}</span>
              <span style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginLeft: 12 }}>{f.game} · {f.who}</span>
            </div>
            <span style={{ ...s.mono, fontSize: 11 }}>{f.roomKr} KR ROOM</span>
            <span style={{ ...s.mono, fontSize: 10, color: f.status === 'OPEN' ? 'var(--money)' : 'var(--alarm)' }}>● {f.status === 'OPEN' ? 'OPEN ENTRY' : f.status}</span>
            <Link href="/tournaments" style={{ ...s.mono, border: '1.5px solid var(--ink)', padding: '5px 10px', fontSize: 10, fontWeight: 600, textDecoration: 'none', color: 'var(--ink)' }}>ENTER →</Link>
          </div>
        ))}
      </div>

      {/* Section rule before editorial */}
      <div style={{ height: 1, background: 'var(--ink)', margin: '28px 0 0' }} />

      {/* Feature story */}
      {feature && (
        <article style={{ padding: '28px 0 24px', borderBottom: '1px solid var(--ink)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>{feature.category}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 3.5vw, 52px)', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.92, marginTop: 10 }}>
              {feature.headline}
            </h3>
          </div>
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 20 }}>{feature.body}</p>
            <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)' }}>— {feature.ago} AGO</span>
          </div>
        </article>
      )}

      {/* Secondary stories */}
      {secondary.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${secondary.length}, 1fr)` }}>
          {secondary.map((n, i) => (
            <article key={i} style={{
              padding: '24px 0',
              paddingRight: i < secondary.length - 1 ? 32 : 0,
              paddingLeft: i > 0 ? 32 : 0,
              borderRight: i < secondary.length - 1 ? '1px solid var(--rule-soft)' : 'none',
            }}>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>{n.category}</span>
              <div style={{ height: 1, background: 'var(--rule-soft)', margin: '8px 0 12px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.0, marginBottom: 12 }}>
                {n.headline}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{n.body}</p>
              <span style={{ ...s.mono, fontSize: 10, color: 'var(--ink-ghost)', display: 'block', marginTop: 16 }}>— {n.ago} AGO</span>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

/* ── 3 DISCIPLINES ── */
function Disciplines({ games }: { games: GameRow[] }) {
  return (
    <section style={{ padding: `40px ${px} 56px` }}>
      <div style={s.rule} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '24px 0 20px' }}>
        <h2 style={s.display(56)}>{games.length} DISCIPLINES.</h2>
        <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>MORE COMING</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {games.map(g => (
          <div key={g.slug} style={{ flex: 1, border: '1.5px solid var(--ink)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>{g.num}</span>
              <span style={{ ...s.mono, color: 'var(--ink-ghost)' }}>● BOT ONLY</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, textTransform: 'uppercase', marginTop: 16 }}>{g.name}</div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.45 }}>{g.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 12, borderTop: '1px solid var(--rule-soft)', alignItems: 'center' }}>
              <span style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)' }}>{g.roomRange}</span>
              <Link href={`/play/${g.slug}`} style={{ ...s.mono, fontSize: 11, fontWeight: 600, textDecoration: 'none', color: 'var(--ink)' }}>
                ENTER →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() { return <SharedFooter /> }

/* ── PAGE ── */
export default function Home() {
  const stats    = getStatsStrip()
  const board    = getBoard()
  const fixtures = getFixtures()
  const news     = getNews()
  const games    = getGames()
  const ticker   = getTicker()

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)' }}>
      <StadiumStrip data={stats} />
      <BroadcastNav activePage="live" />
      <Hero />
      <LiveTicker items={ticker} />
      <Jumbotron />
      <TodaysBoard board={board} />
      <FromTheFloor items={news} fixtures={fixtures} />
      <Disciplines games={games} />
      <Footer />
    </div>
  )
}
