'use client'

import { useEffect, useRef } from 'react'

const MESSAGE = 'Leave this match? Your opponent may be awarded the win.'

export function useNavigationGuard(active: boolean) {
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    // Push a guard entry so back button fires popstate instead of leaving immediately
    history.pushState(null, '', location.href)

    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!activeRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }

    function onPopState() {
      if (!activeRef.current) return
      // Re-push to reverse the back navigation
      history.pushState(null, '', location.href)
      const confirmed = window.confirm(MESSAGE)
      if (confirmed) {
        activeRef.current = false
        // go(-2): back past the re-pushed entry + the original guard entry
        history.go(-2)
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])
}
