'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface TournamentInfo {
  id: string
  label: string
  game: string
  time: string
  entryKr: number
  seats: number
  filled: number
  purseKr: number
  prizeFirst: number
}

interface TournamentContextValue {
  tournament: TournamentInfo | null
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const TournamentContext = createContext<TournamentContextValue>({
  tournament: null,
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
})

// Mock — replace with real session data when auth/Supabase wired up
const MOCK_ACTIVE: TournamentInfo = {
  id: 't1',
  label: "TONIGHT'S MARQUEE",
  game: 'CARD DUEL',
  time: '20:00',
  entryKr: 250,
  seats: 16,
  filled: 14,
  purseKr: 3600,
  prizeFirst: 2520,
}

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const openDrawer  = useCallback(() => setDrawerOpen(true),  [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  return (
    <TournamentContext.Provider value={{ tournament: MOCK_ACTIVE, drawerOpen, openDrawer, closeDrawer }}>
      {children}
    </TournamentContext.Provider>
  )
}

export function useTournament() {
  return useContext(TournamentContext)
}
