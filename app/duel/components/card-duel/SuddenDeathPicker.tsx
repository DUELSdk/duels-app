'use client'

import { useState, useTransition } from 'react'
import type { CardType } from '@/types/game'

async function submitSuddenDeathPick(matchId: string, pick: CardType): Promise<void> {
  const res = await fetch('/api/card-duel/sudden-death', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, card: pick }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error ?? 'Failed to submit')
}
import { CardPiece } from './CardPiece'

const ALL_CARDS: CardType[] = ['rock', 'scissors', 'paper']

interface SuddenDeathPickerProps {
  gameId: string
  roundNumber: number
  onPicked: () => void
}

export function SuddenDeathPicker({ gameId, roundNumber, onPicked }: SuddenDeathPickerProps) {
  const [selected, setSelected] = useState<CardType | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function confirm() {
    if (!selected) return
    setError(null)
    startTransition(async () => {
      try {
        await submitSuddenDeathPick(gameId, selected)
        onPicked()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to submit')
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">Sudden Death</p>
        <p className="text-white/50 text-sm mt-1">Round {roundNumber} — pick one card</p>
      </div>

      <div className="flex gap-4">
        {ALL_CARDS.map(card => (
          <div
            key={card}
            onClick={() => !isPending && setSelected(card)}
            className={`rounded-xl p-0.5 transition-all cursor-pointer ${
              selected === card
                ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <CardPiece card={card} />
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={confirm}
        disabled={!selected || isPending}
        className="
          px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest
          bg-amber-500 text-black transition-all
          hover:bg-amber-400 active:scale-95
          disabled:opacity-30 disabled:cursor-not-allowed
        "
      >
        {isPending ? 'Confirming…' : 'Confirm Pick'}
      </button>
    </div>
  )
}
