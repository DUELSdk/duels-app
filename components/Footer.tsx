import Link from 'next/link'
import { s } from '@/lib/styles'

const GAMES_LINKS = [
  { label: 'Card Duel', href: '/play/card-duel' },
  { label: 'CycleDuel', href: '/play/cycleduel'  },
  { label: 'DropDuel',  href: '/play/dropduel'   },
]

const PLATFORM_LINKS = [
  { label: 'Tournaments', href: '/tournaments' },
  { label: 'Standings',   href: '/leaderboard' },
  { label: 'Wallet',      href: '/wallet'      },
  { label: 'Profile',     href: '/profile'     },
]

export function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--bone-on-dark)' }}>
      <div style={{ padding: `48px ${s.px} 40px`, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            DUELS
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--bone-faint)', marginTop: 6 }}>
            DK · EST. 2025
          </div>
          <p style={{ fontSize: 12, color: 'var(--bone-faint)', lineHeight: 1.6, marginTop: 16, maxWidth: 320 }}>
            1v1 skill gaming for real money. 100% skill. Zero randomness. Spilleloven-exempt.
          </p>
        </div>

        {/* Games */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', color: 'var(--bone-faint)', marginBottom: 16 }}>GAMES</div>
          {GAMES_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 13, color: 'var(--bone-on-dark)', textDecoration: 'none', marginBottom: 10, opacity: 0.8 }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Platform */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', color: 'var(--bone-faint)', marginBottom: 16 }}>PLATFORM</div>
          {PLATFORM_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 13, color: 'var(--bone-on-dark)', textDecoration: 'none', marginBottom: 10, opacity: 0.8 }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(240,237,228,0.12)',
        padding: `16px ${s.px}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--bone-faint)' }}>
          © 2025 DUELS APS · CVR 45XXXXXX · 18+
        </span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="https://www.stopspillet.dk" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--bone-faint)', textDecoration: 'none' }}>
            STOPSPILLET.DK
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--bone-faint)' }}>
            +45 70 22 28 25
          </span>
        </div>
      </div>
    </footer>
  )
}
