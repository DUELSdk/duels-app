'use client'

import { useState, useTransition } from 'react'
import type { CardType } from '@/types/game'
import { CardPiece, EmptySlot } from './CardPiece'

// TODO: wire to /api/card-duel/lock — old server action deleted (queried non-existent games table)
async function submitSequence(_gameId: string, _sequence: CardType[]): Promise<void> {
  throw new Error('SequenceBuilder not wired to real API yet — use match page inline implementation')
}

const INITIAL_HAND: CardType[] = [
  'rock', 'rock', 'rock',
  'scissors', 'scissors', 'scissors',
  'paper', 'paper', 'paper',
]

interface SequenceBuilderProps {
  gameId: string
  onLocked: () => void
}

export function SequenceBuilder({ gameId, onLocked }: SequenceBuilderProps) {
  const [sequence, setSequence] = useState<(CardType | null)[]>(Array(9).fill(null))
  const [hand, setHand] = useState<CardType[]>(INITIAL_HAND)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const filled = sequence.filter(Boolean).length

  function placeCard(card: CardType, handIndex: number) {
    const nextSlot = sequence.findIndex(s => s === null)
    if (nextSlot === -1) return
    setSequence(prev => {
      const next = [...prev]
      next[nextSlot] = card
      return next
    })
    setHand(prev => {
      const next = [...prev]
      next.splice(handIndex, 1)
      return next
    })
  }

  function removeCard(slotIndex: number) {
    const card = sequence[slotIndex]
    if (!card) return
    setSequence(prev => {
      const next = [...prev]
      next[slotIndex] = null
      return next
    })
    setHand(prev => [...prev, card])
  }

  function lock() {
    if (filled < 9) return
    setError(null)
    startTransition(async () => {
      try {
        await submitSequence(gameId, sequence as CardType[])
        onLocked()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to submit')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Your sequence</p>
        <div className="flex gap-2 flex-wrap">
          {sequence.map((card, i) =>
            card
              ? <CardPiece key={i} card={card} onClick={() => removeCard(i)} />
              : <EmptySlot key={i} index={i} />
          )}
        </div>
        <p className="text-xs text-white/30 mt-2">{filled}/9 placed — click a card to remove it</p>
      </div>

      <div>
        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Hand</p>
        <div className="flex gap-2 flex-wrap">
          {hand.map((card, i) => (
            <CardPiece
              key={`${card}-${i}`}
              card={card}
              onClick={() => placeCard(card, i)}
              disabled={filled >= 9}
            />
          ))}
          {hand.length === 0 && (
            <p className="text-white/30 text-sm">All cards placed</p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        onClick={lock}
        disabled={filled < 9 || isPending}
        className="
          self-start px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest
          bg-amber-500 text-black transition-all
          hover:bg-amber-400 active:scale-95
          disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100
        "
      >
        {isPending ? 'Locking in…' : 'Lock In'}
      </button>
    </div>
  )
}
