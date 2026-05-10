import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'
import { CycleDemoGame } from '@/components/cycle-duel/CycleDemoGame'

export default function CycleDuelDemo() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <SiteNav />
      <main className="max-w-2xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/play/cycle-duel" className="text-white/30 text-sm hover:text-white/60 transition-colors">
              ← CycleDuel
            </Link>
            <h1 className="text-2xl font-bold tracking-tight mt-2">Demo vs Bot</h1>
            <p className="text-white/40 text-sm mt-1">3 blocks of 3 rounds. See bot's first card before each block.</p>
          </div>
          <span className="shrink-0 text-xs bg-white/5 text-white/40 border border-white/10 rounded-full px-3 py-1.5 mt-6">
            Bot: random
          </span>
        </div>
        <CycleDemoGame />
      </main>
    </div>
  )
}
