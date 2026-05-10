import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'
import { getGameDetail, type StakeRoom } from '@/lib/mock-data'

function StakeRoomRow({ room, gameSlug }: { room: StakeRoom; gameSlug: string }) {
  const isLive = room.liveCount > 0
  return (
    <Link
      href={`/play/${gameSlug}/lobby?room=${room.kr}`}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 0', borderBottom: '1px solid var(--rule-soft)',
        textDecoration: 'none', color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, fontVariantNumeric: 'tabular-nums' }}>
          {room.kr}
        </span>
        <span style={{ ...s.mono, color: 'var(--ink-faint)' }}>KR</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ ...s.mono, fontSize: 10, color: isLive ? 'var(--alarm)' : 'var(--ink-ghost)' }}>
          {isLive ? `● ${room.liveCount} LIVE` : '● EMPTY'}
        </span>
        <span style={{ ...s.mono, fontSize: 12, color: 'var(--ink-faint)' }}>→</span>
      </div>
    </Link>
  )
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ game: string }>
}) {
  const { game: slug } = await params
  const detail = getGameDetail(slug)
  if (!detail) notFound()

  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh' }}>
      <BroadcastNav balance="2.450" activePage="games" />

      {/* Breadcrumb */}
      <div style={{ padding: `16px ${s.px} 0`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/play" style={{ ...s.mono, color: 'var(--ink-faint)', textDecoration: 'none', fontSize: 11 }}>
          GAMES
        </Link>
        <span style={{ ...s.mono, color: 'var(--ink-ghost)' }}>/</span>
        <span style={{ ...s.mono, fontSize: 11 }}>{detail.name}</span>
      </div>

      {/* Main content — two column */}
      <section style={{
        padding: `40px ${s.px} 56px`,
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: 64, alignItems: 'start',
      }}>
        {/* Left — game info */}
        <div>
          <div style={{ ...s.mono, color: 'var(--ink-faint)', fontSize: 10, marginBottom: 16 }}>
            DISCIPLINE {detail.num} · {detail.category}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 96, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.85 }}>
            {detail.name.split(' ').map((word, i) => (
              <span key={i} style={{ display: 'block' }}>{word}.</span>
            ))}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, marginTop: 24, maxWidth: 520, color: 'var(--ink-soft)' }}>
            {detail.desc}
          </p>

          {/* Format pills */}
          <div style={{ display: 'flex', gap: 24, marginTop: 24, alignItems: 'center' }}>
            {detail.format.split(' · ').map(f => (
              <span key={f} style={{ ...s.mono, fontSize: 12, fontWeight: 600 }}>{f}</span>
            ))}
            <span style={{ ...s.mono, fontSize: 12, color: 'var(--ink-ghost)' }}>
              {detail.waiters > 0 ? `${detail.waiters} WAITING` : '0 WAITERS'}
            </span>
          </div>

          {/* How it plays */}
          <div style={{ marginTop: 56 }}>
            <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 16 }}>HOW IT PLAYS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {detail.howItPlays.map(step => (
                <div key={step.step} style={{
                  border: '1.5px solid var(--ink)', padding: 20,
                }}>
                  <div style={{ ...s.mono, fontSize: 22, fontWeight: 700, color: 'var(--ink-ghost)', marginBottom: 12 }}>
                    {step.step}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', marginBottom: 10 }}>
                    {step.title}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Themes */}
          {detail.themes.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>
                SAME ENGINE · DIFFERENT SKIN
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {detail.themes.map(t => (
                  <span key={t} style={{
                    ...s.mono, fontSize: 11,
                    border: '1px solid var(--rule-soft)',
                    padding: '5px 10px', color: 'var(--ink-faint)',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — stake rooms */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 8 }}>
            STAKE ROOMS · LIVE
          </div>
          <div style={s.rule} />
          {detail.stakeRooms.map(room => (
            <StakeRoomRow key={room.kr} room={room} gameSlug={slug} />
          ))}
          <div style={{ marginTop: 20 }}>
            <Link
              href={`/play/${slug}/lobby`}
              style={{
                display: 'block', width: '100%',
                background: 'var(--ink)', color: 'var(--bone)',
                border: '1.5px solid var(--ink)', padding: '16px 20px',
                fontFamily: 'var(--font-inter)', fontWeight: 700, fontSize: 14,
                textAlign: 'center', textDecoration: 'none',
              }}
            >
              OPEN LOBBY →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
