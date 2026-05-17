'use client'

import { useRouter } from 'next/navigation'
import { clearAuth } from '@/lib/auth'
import { s } from '@/lib/styles'

export function SignOutButton() {
  const router = useRouter()

  function handleSignOut() {
    clearAuth()
    router.push('/auth')
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        ...s.mono, fontSize: 10, color: 'var(--ink-faint)',
        background: 'none', border: '1px solid rgba(13,13,13,0.2)',
        padding: '8px 16px', cursor: 'pointer',
      }}
    >
      SIGN OUT
    </button>
  )
}
