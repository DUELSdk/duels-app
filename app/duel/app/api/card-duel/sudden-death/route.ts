import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const VALID_CARDS = new Set(['rock', 'scissors', 'paper'])

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const { matchId, card } = await request.json() as { matchId: string; card: string }
  if (!matchId || !VALID_CARDS.has(card)) {
    return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('rpc_submit_sudden_death', {
    p_match_id: matchId,
    p_card:     card,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (data?.error) return NextResponse.json({ error: data.error }, { status: 400 })

  return NextResponse.json({ ok: true })
}
