/** Ruta tras login según rol (ver docs/README.md). */
export function postLoginPathForRole(role: string): string {
  const normalized = role.trim().toLowerCase()
  if (normalized === 'colaborador') return '/portal/mi-tramite'
  if (normalized === 'recepcion') return '/recepcion/radicar'
  return '/dashboard'
}

export function getPostLoginPathFromToken(token: string): string {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return '/dashboard'
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64)) as Record<string, unknown>
    const role = payload.role
    return typeof role === 'string' ? postLoginPathForRole(role) : '/dashboard'
  } catch {
    return '/dashboard'
  }
}
