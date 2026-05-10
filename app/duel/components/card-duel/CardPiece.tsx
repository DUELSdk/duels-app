import type { CardType } from '@/types/game'

const CARD_META: Record<CardType, { emoji: string; label: string; bg: string; border: string }> = {
  rock:     { emoji: '🪨', label: 'Rock',     bg: 'bg-stone-700',  border: 'border-stone-500' },
  scissors: { emoji: '✂️', label: 'Scissors', bg: 'bg-red-800',    border: 'border-red-600'   },
  paper:    { emoji: '📄', label: 'Paper',    bg: 'bg-blue-800',   border: 'border-blue-600'  },
}

interface CardPieceProps {
  card: CardType
  size?: 'sm' | 'md'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function CardPiece({ card, size = 'md', onClick, disabled, className = '' }: CardPieceProps) {
  const meta = CARD_META[card]
  const sizeClasses = size === 'sm'
    ? 'w-10 h-14 text-lg'
    : 'w-14 h-[72px] text-2xl'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 font-medium
        transition-all duration-150 select-none
        ${meta.bg} ${meta.border}
        ${onClick && !disabled ? 'cursor-pointer hover:brightness-125 active:scale-95' : 'cursor-default'}
        ${disabled ? 'opacity-40' : ''}
        ${sizeClasses} ${className}
      `}
    >
      <span>{meta.emoji}</span>
      <span className="text-xs text-white/70">{meta.label}</span>
    </button>
  )
}

export function EmptySlot({
  index,
  onClick,
  size = 'md',
}: {
  index: number
  onClick?: () => void
  size?: 'sm' | 'md'
}) {
  const sizeClasses = size === 'sm' ? 'w-10 h-14' : 'w-14 h-[72px]'

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center rounded-lg border-2 border-dashed
        border-white/20 text-white/30 text-xs transition-colors
        ${onClick ? 'cursor-pointer hover:border-white/40' : 'cursor-default'}
        ${sizeClasses}
      `}
    >
      {index + 1}
    </button>
  )
}

export function HiddenCard({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-10 h-14' : 'w-14 h-[72px]'
  return (
    <div className={`flex items-center justify-center rounded-lg border-2 border-white/10 bg-white/5 text-white/20 text-xl ${sizeClasses}`}>
      ?
    </div>
  )
}
