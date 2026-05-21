import { supabase } from '@/lib/supabase'

// Returns balance in KR (converted from øre stored in DB).
// Returns null if not logged in or wallet not found.
export async function getBalance(): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('wallets')
    .select('balance_ore')
    .eq('user_id', user.id)
    .single()
  return data ? data.balance_ore / 100 : null
}

// ── Stubs for wallet UI pages (no real money on test site) ───────────────────
// These pages (deposit, withdraw) show UI only — actual balance changes
// happen server-side via Supabase RPCs. Remove stubs when wiring real payments.

export type Txn = { id: string; ts: number; desc: string; amount: number }

export function getTransactions(): Txn[] { return [] }
export function adjustBalance(_delta: number): number { return 0 }
export function addTransaction(_desc: string, _amount: number): void {}
