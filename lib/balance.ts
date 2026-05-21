const BAL_KEY = 'duel_balance'
const TXN_KEY = 'duel_txns'
const STARTING_BALANCE = 500

export function getBalance(): number {
  if (typeof window === 'undefined') return STARTING_BALANCE
  const v = localStorage.getItem(BAL_KEY)
  if (v === null) {
    localStorage.setItem(BAL_KEY, String(STARTING_BALANCE))
    return STARTING_BALANCE
  }
  return Math.max(0, parseFloat(v) || 0)
}

export function setBalance(n: number): void {
  localStorage.setItem(BAL_KEY, Math.max(0, n).toFixed(0))
}

export function adjustBalance(delta: number): number {
  const next = getBalance() + delta
  setBalance(next)
  return next
}

export type Txn = {
  id: string
  ts: number
  desc: string
  amount: number
}

export function getTransactions(): Txn[] {
  if (typeof window === 'undefined') return []
  const v = localStorage.getItem(TXN_KEY)
  return v ? JSON.parse(v) : []
}

export function addTransaction(desc: string, amount: number): void {
  const txns = getTransactions()
  const id = Math.random().toString(36).slice(2, 10).toUpperCase()
  txns.unshift({ id, ts: Date.now(), desc, amount })
  localStorage.setItem(TXN_KEY, JSON.stringify(txns.slice(0, 100)))
}
