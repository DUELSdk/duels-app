import { createSupabaseServerClient } from '@/lib/supabase-server'
import { TIERS } from '@/lib/tiers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const body = await request.json()
  const { game, tierId, stakeKr } = body as { game: string; tierId: string; stakeKr: number }

  if (!game || !tierId || !stakeKr) {
    return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })
  }

  // Derive fee math from authoritative tier table (client cannot fake this)
  const tier = TIERS.find(t => t.id === tierId && t.stakeKr === stakeKr)
  if (!tier) return NextResponse.json({ error: 'INVALID_TIER' }, { status: 400 })

  const entryFeeOre = tier.entryFee * 100        // per player, in øre
  const purseOre    = tier.winnerGets * 100       // total payout, in øre

  const { data, error } = await supabase.rpc('rpc_join_queue', {
    p_game:          game,
    p_tier_id:       tierId,
    p_stake_kr:      stakeKr,
    p_entry_fee_ore: entryFeeOre,
    p_purse_ore:     purseOre,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (data?.error) return NextResponse.json({ error: data.error }, { status: 400 })

  return NextResponse.json(data)
}
