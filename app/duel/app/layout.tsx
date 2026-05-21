import type { Metadata } from 'next'
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google'
import { TournamentNotch } from '@/components/TournamentNotch'
import { TournamentProvider } from '@/components/TournamentContext'
import { ActiveMatchProvider } from '@/components/ActiveMatchContext'
import { ActiveMatchNotch } from '@/components/ActiveMatchNotch'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'DUELS',
  description: '1v1 skill games for real money. No luck. No license.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="da"
      className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div style={{
          background: '#92400e',
          color: '#fef3c7',
          padding: '7px 20px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          position: 'sticky',
          top: 0,
          zIndex: 9999,
        }}>
          TEST MODE · PLAY MONEY ONLY · NO REAL TRANSACTIONS
        </div>
        <ActiveMatchProvider>
          <TournamentProvider>
            {children}
            <TournamentNotch />
            <ActiveMatchNotch />
          </TournamentProvider>
        </ActiveMatchProvider>
      </body>
    </html>
  )
}
