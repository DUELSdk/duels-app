export type Tier = {
  id: string
  label: string
  stakeKr: number   // total paid per player (stake + entry fee)
  entryFee: number  // platform cut per player
  winnerGets: number
}

// 10% rake on total pot. entryFee = stakeKr × 0.1 (per player).
export const TIERS: Tier[] = [
  { id: 'starter',  label: 'STARTER',  stakeKr: 10,  entryFee: 1,  winnerGets: 18  },
  { id: 'standard', label: 'STANDARD', stakeKr: 25,  entryFee: 3,  winnerGets: 45  },
  { id: 'serious',  label: 'SERIOUS',  stakeKr: 50,  entryFee: 5,  winnerGets: 90  },
  { id: 'high',     label: 'HIGH',     stakeKr: 100, entryFee: 10, winnerGets: 180 },
  { id: 'elite',    label: 'ELITE',    stakeKr: 250, entryFee: 25, winnerGets: 450 },
  { id: 'max',      label: 'MAX',      stakeKr: 500, entryFee: 50, winnerGets: 900 },
]

export const DEFAULT_TIER = TIERS[2] // SERIOUS

export function getTierById(id: string): Tier | undefined {
  return TIERS.find(t => t.id === id)
}

export function customTier(stakeKr: number): Tier {
  const rake = Math.round(stakeKr * 2 * 0.1)
  return {
    id: 'custom',
    label: 'CUSTOM',
    stakeKr,
    entryFee: Math.round(rake / 2),
    winnerGets: stakeKr * 2 - rake,
  }
}

export function tierFromKr(kr: number): Tier {
  return TIERS.find(t => t.stakeKr === kr) ?? customTier(kr)
}
