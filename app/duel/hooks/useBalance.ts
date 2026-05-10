'use client'

import { useState, useEffect, useCallback } from 'react'
import { getBalance, adjustBalance as _adjust, addTransaction } from '@/lib/balance'

export function useBalance() {
  const [balance, setBalance] = useState<number | null>(null)

  const refresh = useCallback(() => {
    setBalance(getBalance())
  }, [])

  useEffect(() => {
    refresh()
    const handler = () => refresh()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [refresh])

  const adjust = useCallback((delta: number, desc: string): number => {
    const next = _adjust(delta)
    addTransaction(desc, delta)
    setBalance(next)
    return next
  }, [])

  return { balance, refresh, adjust }
}
