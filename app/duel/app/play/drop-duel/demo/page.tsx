import Link from 'next/link'
import { SiteNav } from '@/components/SiteNav'
import { DropDemoGame } from '@/components/drop-duel/DropDemoGame'

export default function DropDuelDemo() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <SiteNav />
      <main className="max-w-2xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/play/drop-duel" className="text-white/30 text-sm hover:text-white/60 transition-colors">
              ← DropDuel
            </Link>
            <h1 className="text-2xl font-bold tracking-tight mt-2">Demo vs Bot</h1>
            <p className="text-white/40 text-sm mt-1">Place a hidden block, then play Connect Four on the modified board.</p>
          </div>
          <span className="shrink-0 text-xs bg-white/5 text-white/40 border border-white/10 rounded-full px-3 py-1.5 mt-6">
            Bot: smart
          </span>
        </div>
        <DropDemoGame />
      </main>
    </div>
  )
}
