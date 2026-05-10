export type Tier = {
  id: string
  label: string
  stakeKr: number   // total paid per player (stake + entry fee)
  entryFee: number  // platform cut per player
  winnerGets: number
}

export const TIERS: Tier[] = [
  { id: 'starter',  label: 'STARTER',  stakeKr: 10,  entryFee: 1,  winnerGets: 18  },
  { id: 'standard', label: 'STANDARD', stakeKr: 25,  entryFee: 3,  winnerGets: 44  },
  { id: 'serious',  label: 'SERIOUS',  stakeKr: 50,  entryFee: 4,  winnerGets: 92  },
  { id: 'high',     label: 'HIGH',     stakeKr: 100, entryFee: 6,  winnerGets: 188 },
  { id: 'elite',    label: 'ELITE',    stakeKr: 250, entryFee: 10, winnerGets: 480 },
  { id: 'max',      label: 'MAX',      stakeKr: 500, entryFee: 15, winnerGets: 970 },
]

export const DEFAULT_TIER = TIERS[2] // SERIOUS

export function getTierById(id: string): Tier | undefined {
  return TIERS.find(t => t.id === id)
}

export function customTier(stakeKr: number): Tier {
  const entryFee = Math.max(1, Math.ceil(stakeKr * 0.03))
  return {
    id: 'custom',
    label: 'CUSTOM',
    stakeKr,
    entryFee,
    winnerGets: stakeKr * 2 - entryFee * 2,
  }
}
