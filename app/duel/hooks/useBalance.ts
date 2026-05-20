'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useBalance() {
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    let userId: string | null = null
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setBalance(null); return }
      userId = user.id

      const { data } = await supabase
        .from('wallets')
        .select('id, balance_ore')
        .eq('user_id', user.id)
        .single()

      if (!data) { setBalance(null); return }
      setBalance(data.balance_ore / 100)

      // Live balance updates via Realtime
      channel = supabase
        .channel(`wallet-${data.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `id=eq.${data.id}` },
          (payload) => {
            const row = payload.new as { balance_ore: number }
            setBalance(row.balance_ore / 100)
          }
        )
        .subscribe()
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setBalance(null)
      if (event === 'SIGNED_IN') init()
    })

    return () => {
      channel?.unsubscribe()
      subscription.unsubscribe()
    }
  }, [])

  return { balance }
}
