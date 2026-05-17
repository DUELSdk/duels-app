const AUTH_KEY = 'duel_auth'

export type AuthUser = {
  username: string
  joinedAt: number
}

export function getAuth(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const v = localStorage.getItem(AUTH_KEY)
  return v ? (JSON.parse(v) as AuthUser) : null
}

export function setAuth(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isLoggedIn(): boolean {
  return getAuth() !== null
}
