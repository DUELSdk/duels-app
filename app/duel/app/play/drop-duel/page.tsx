import GameDetailPage from '../[game]/page'

export default function DropDuelPage() {
  return <GameDetailPage params={Promise.resolve({ game: 'dropduel' })} />
}
