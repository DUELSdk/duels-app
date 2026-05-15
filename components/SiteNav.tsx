import Link from 'next/link'

export function SiteNav() {
  return (
    <nav className="border-b border-white/[0.06] bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="w-full px-6 lg:px-12 h-12 flex items-center justify-between">
        <Link href="/" className="font-black text-base tracking-tighter text-white hover:text-red-500 transition-colors">
          DUEL
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/play" className="text-sm text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-white/5">
            Games
          </Link>
          <Link href="/tournaments" className="text-sm text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-white/5">
            Tournaments
          </Link>
          <div className="w-px h-4 bg-white/[0.08] mx-2" />
          <Link href="/wallet" className="flex items-center gap-2 border border-white/[0.08] rounded px-3 py-1 hover:border-white/15 transition-colors">
            <span className="text-xs text-white/25">Balance</span>
            <span className="text-sm font-bold text-white/70">1.000 kr</span>
          </Link>
          <Link href="/profile" className="ml-1 w-7 h-7 rounded border border-white/[0.08] flex items-center justify-center text-xs text-white/30 hover:border-white/15 hover:text-white/50 transition-colors">
            SD
          </Link>
        </div>
      </div>
    </nav>
  )
}
