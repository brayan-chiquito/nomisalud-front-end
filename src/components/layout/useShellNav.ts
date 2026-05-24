import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/** Estado del menú lateral en viewports móviles (< lg). */
export function useShellNav() {
  const { pathname } = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const timer = globalThis.setTimeout(() => setMobileNavOpen(false), 0)
    return () => globalThis.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  const openMobileNav = useCallback(() => setMobileNavOpen(true), [])
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])
  const toggleMobileNav = useCallback(() => setMobileNavOpen((o) => !o), [])

  return {
    mobileNavOpen,
    openMobileNav,
    closeMobileNav,
    toggleMobileNav,
  }
}
