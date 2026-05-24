import type { Location } from 'react-router-dom'

export type NavigationReturnState = Readonly<{
  returnTo?: string
}>

/** Ruta interna segura (misma app, sin protocolo externo). */
export function sanitizeReturnTo(path: string | null | undefined): string | null {
  if (!path?.trim()) return null
  const trimmed = path.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null
  return trimmed
}

export function currentAppPath(location: Pick<Location, 'pathname' | 'search' | 'hash'>): string {
  return `${location.pathname}${location.search}${location.hash}`
}

export function readReturnTo(state: unknown): string | null {
  if (!state || typeof state !== 'object') return null
  return sanitizeReturnTo((state as NavigationReturnState).returnTo)
}

export function navigationReturnState(returnTo: string): NavigationReturnState {
  const safe = sanitizeReturnTo(returnTo)
  return safe ? { returnTo: safe } : {}
}

/** Destino tras acciones exitosas en dashboard (banner `?success=`). */
export function isDashboardReturnPath(path: string | null | undefined): boolean {
  if (!path) return false
  return path === '/dashboard' || path.startsWith('/dashboard?')
}
