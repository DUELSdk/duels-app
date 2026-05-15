import type { CardType, RoundOutcome } from '@/types/game'
import { CardPiece } from './CardPiece'

interface RoundResultsProps {
  mySequence: CardType[]
  opponentSequence: CardType[]
  results: RoundOutcome[]
  myScore: number
  opponentScore: number
  iAmPlayer1: boolean
  winnerId: string | null
  myId: string
}

const OUTCOME_LABEL: Record<RoundOutcome, string> = {
  player1: 'W',
  player2: 'L',
  tie: 'T',
}

const OUTCOME_COLOR: Record<RoundOutcome, string> = {
  player1: 'text-emerald-400',
  player2: 'text-red-400',
  tie: 'text-yellow-400',
}

export function RoundResults({
  mySequence,
  opponentSequence,
  results,
  myScore,
  opponentScore,
  iAmPlayer1,
  winnerId,
  myId,
}: RoundResultsProps) {
  const myResults = results.map(r =>
    r === 'tie' ? 'tie' : (r === 'player1') === iAmPlayer1 ? 'player1' : 'player2'
  ) as RoundOutcome[]

  const won = winnerId === myId
  const lost = winnerId !== null && winnerId !== myId

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className={`text-3xl font-bold ${won ? 'text-emerald-400' : lost ? 'text-red-400' : 'text-yellow-400'}`}>
          {won ? 'You Win' : lost ? 'You Lose' : 'Draw'}
        </p>
        <p className="text-white/50 mt-1">
          {iAmPlayer1 ? myScore : opponentScore} – {iAmPlayer1 ? opponentScore : myScore}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm w-full border-collapse">
          <thead>
            <tr className="text-white/40 text-xs uppercase tracking-widest">
              <td className="pb-2 pr-3">Round</td>
              <td className="pb-2 pr-3">Opponent</td>
              <td className="pb-2 pr-3">You</td>
              <td className="pb-2">Result</td>
            </tr>
          </thead>
          <tbody>
            {results.map((_, i) => {
              const myCard = mySequence[i]
              const oppCard = opponentSequence[i]
              const outcome = myResults[i]
              return (
                <tr key={i} className="border-t border-white/10">
                  <td className="py-2 pr-3 text-white/30">{i + 1}</td>
                  <td className="py-2 pr-3">
                    <CardPiece card={oppCard} size="sm" />
                  </td>
                  <td className="py-2 pr-3">
                    <CardPiece card={myCard} size="sm" />
                  </td>
                  <td className={`py-2 font-bold ${OUTCOME_COLOR[outcome]}`}>
                    {OUTCOME_LABEL[outcome]}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
