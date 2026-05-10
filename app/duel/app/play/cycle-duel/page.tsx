import GameDetailPage from '../[game]/page'

export default function CycleDuelPage() {
  return <GameDetailPage params={Promise.resolve({ game: 'cycleduel' })} />
}
