import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import {
  getLibraryCategories,
  getLibraryThemes,
  getLiveMatchCount,
  getTicker,
  type LibraryGame,
} from '@/lib/mock-data'

function LiveTicker({ items }: { items: { game: string; text: string }[] }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ borderBottom: '1px solid var(--ink)', overflow: 'hidden', height: 36 }}>
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

function GameRow({ game }: { game: LibraryGame }) {
  const isLive = game.liveCount > 0
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '28px 1fr auto auto auto',
      alignItems: 'center', gap: 24,
      padding: '24px 0', borderBottom: '1px solid var(--rule-soft)',
    }}>
      {/* Number */}
      <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>{game.num}</span>

      {/* Name + desc */}
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          {game.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, maxWidth: 480 }}>{game.desc}</div>
      </div>

      {/* Format */}
      <span style={{ ...s.mono, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>{game.format}</span>

      {/* Live + today counts */}
      <div style={{ textAlign: 'right', minWidth: 120 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: 'flex-end' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
            color: isLive ? 'var(--alarm)' : 'var(--ink-ghost)',
            fontVariantNumeric: 'tabular-nums',
          }}>{game.liveCount}</span>
          <span style={{ ...s.mono, color: 'var(--ink-faint)', fontSize: 9 }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{game.todayCount}</span>
          <span style={{ ...s.mono, color: 'var(--ink-faint)', fontSize: 9 }}>TODAY</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/play/${game.slug}`}
        style={{
          ...s.mono,
          border: '1.5px solid var(--ink)',
          padding: '10px 18px',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        ENTER →
      </Link>
    </div>
  )
}

export default function Library() {
  const categories = getLibraryCategories()
  const themes     = getLibraryThemes()
  const counts     = getLiveMatchCount()
  const ticker     = getTicker()

  const totalGames = categories.reduce((n, c) => n + c.games.length, 0)

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav balance="2.450" activePage="games" />
      <LiveTicker items={ticker} />

      {/* Header */}
      <section style={{ padding: `56px ${s.px} 32px` }}>
        <div style={{ ...s.mono, fontSize: 11, color: 'var(--ink-faint)', marginBottom: 20 }}>
          FIXTURES · LIVE NOW
        </div>
        <h1 style={{ ...s.display(96), lineHeight: 0.85 }}>{totalGames} GAMES.</h1>
        <p style={{ fontSize: 18, lineHeight: 1.45, marginTop: 20, maxWidth: 560, color: 'var(--ink-soft)' }}>
          All 1v1. All sealed plans. Walk into any stake room — the timer doesn&apos;t care who you are.
        </p>
        <div style={{ ...s.mono, fontSize: 12, marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" />
          {counts.live} MATCHES IN PROGRESS · {counts.settledToday.toLocaleString('da-DK')} SETTLED TODAY
        </div>
      </section>

      {/* Game rows by category */}
      <section style={{ padding: `0 ${s.px} 16px` }}>
        {categories.map(cat => (
          <div key={cat.label} style={{ marginBottom: 40 }}>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 0 }}>
              {cat.label} · {cat.games.length} {cat.games.length === 1 ? 'GAME' : 'GAMES'}
            </div>
            <div style={s.rule} />
            {cat.games.map(g => <GameRow key={g.slug} game={g} />)}
          </div>
        ))}
      </section>

      {/* Themes strip */}
      <section style={{
        padding: `24px ${s.px}`,
        borderTop: '1px solid var(--ink)',
        background: 'var(--bone-2)',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <div style={{ ...s.mono, color: 'var(--ink-faint)', fontSize: 10 }}>
          BUILT ON {themes.engine} ENGINE · {themes.themes.length} MORE
        </div>
        <div style={{ ...s.mono, fontSize: 11 }}>
          {themes.themes.join(' · ')}{' '}
          <span style={{ color: 'var(--ink-faint)' }}>— SAME ENGINE, DIFFERENT SKIN</span>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
