import GameDetailPage from '../[game]/page'

export default function CardDuelPage() {
  return <GameDetailPage params={Promise.resolve({ game: 'card-duel' })} />
}
