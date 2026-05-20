import { createSupabaseServerClient } from '@/lib/supabase-server'
import { validateSequence } from '@/lib/card-duel/engine'
import type { CardType } from '@/types/game'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const { matchId, sequence } = await request.json() as { matchId: string; sequence: CardType[] }
  if (!matchId || !Array.isArray(sequence)) {
    return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })
  }

  // Validate sequence server-side — anti-cheat
  if (!validateSequence(sequence)) {
    return NextResponse.json({ error: 'INVALID_SEQUENCE' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('rpc_submit_sequence', {
    p_match_id: matchId,
    p_sequence: sequence,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (data?.error) return NextResponse.json({ error: data.error }, { status: 400 })

  return NextResponse.json({ ok: true })
}
