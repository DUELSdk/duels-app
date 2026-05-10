'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'
import { motion } from 'framer-motion'

function FindingContent({ game }: { game: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') ?? 'serious'

  const gameLabel = game === 'card-duel' ? 'CARD DUEL'
    : game === 'cycleduel' ? 'CYCLEDUEL'
    : 'DROPDUEL'

  useEffect(() => {
    const t = setTimeout(() => {
      router.push(`/play/${game}/match?tier=${tier}`)
    }, 3000)
    return () => clearTimeout(t)
  }, [game, tier, router])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4 }}
      style={{ background: '#000000', color: 'rgba(255,255,255,0.88)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}
    >
      {/* Pulsing search indicator */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 64, height: 64, border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '50%' }}
      />

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          {gameLabel}
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 72, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0 }}
        >
          FINDING<br />OPPONENT.
        </motion.h1>
      </div>

      {/* Scanning bar */}
      <div style={{ width: 240, height: 1, background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)' }}
        />
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
        NO DECLINE ONCE PAIRED
      </div>
    </motion.div>
  )
}

export default function FindingPage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = use(params)
  return (
    <Suspense fallback={<div style={{ background: '#000000', minHeight: '100vh' }} />}>
      <FindingContent game={game} />
    </Suspense>
  )
}
