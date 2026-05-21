import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const { queueId } = await request.json() as { queueId: string }
  if (!queueId) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })

  const { error } = await supabase.rpc('rpc_cancel_queue', { p_queue_id: queueId })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
