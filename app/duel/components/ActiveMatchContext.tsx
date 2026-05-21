'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface ActiveMatchInfo {
  matchId: string
  game: string
  stakeKr: number
  opponentHandle: string
}

interface ActiveMatchContextValue {
  activeMatch: ActiveMatchInfo | null
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const ActiveMatchContext = createContext<ActiveMatchContextValue>({
  activeMatch: null,
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
})

export function ActiveMatchProvider({ children }: { children: React.ReactNode }) {
  const [activeMatch, setActiveMatch] = useState<ActiveMatchInfo | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const openDrawer  = useCallback(() => setDrawerOpen(true),  [])

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function fetchActiveMatch() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setActiveMatch(null); return }

      const { data: match } = await supabase
        .from('matches')
        .select('id, game, stake_kr, player1_id, player2_id')
        .eq('status', 'active')
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!match) { setActiveMatch(null); return }

      const opponentId = match.player1_id === user.id ? match.player2_id : match.player1_id
      const { data: opponent } = await supabase
        .from('profiles')
        .select('handle')
        .eq('id', opponentId)
        .maybeSingle()

      setActiveMatch({
        matchId: match.id,
        game: match.game,
        stakeKr: match.stake_kr,
        opponentHandle: opponent?.handle ?? '???',
      })

      // subscribe to this match's status changes
      channel = supabase
        .channel(`active-match-notch-${match.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${match.id}`,
        }, (payload) => {
          if ((payload.new as { status: string }).status !== 'active') {
            setActiveMatch(null)
            setDrawerOpen(false)
          }
        })
        .subscribe()
    }

    fetchActiveMatch()
    const poll = setInterval(fetchActiveMatch, 30_000)

    return () => {
      clearInterval(poll)
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  return (
    <ActiveMatchContext.Provider value={{ activeMatch, drawerOpen, openDrawer, closeDrawer }}>
      {children}
    </ActiveMatchContext.Provider>
  )
}

export function useActiveMatch() {
  return useContext(ActiveMatchContext)
}
