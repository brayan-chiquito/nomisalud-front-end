import type { AuditoriaAccesoItem } from '../types/auditoriaAcceso'

export type UsuarioAuditoriaOption = Readonly<{
  id: string
  email: string
  nombre?: string
  label: string
}>

export function usuarioAuditoriaOptionLabel(email: string, nombre?: string | null): string {
  const e = email.trim()
  const n = nombre?.trim()
  if (n && e) return `${n} · ${e}`
  return e || n || ''
}

export function matchesAuditoriaUsuarioRow(row: AuditoriaAccesoItem, term: string): boolean {
  const q = term.trim().toLowerCase()
  if (!q) return true
  const hay = (value?: string | null) => value?.toLowerCase().includes(q) ?? false
  return hay(row.usuario_email) || hay(row.usuario_nombre) || hay(row.user_id)
}

export function pickUniqueUsuarioAuditoriaOption(
  options: readonly UsuarioAuditoriaOption[],
  term: string,
): UsuarioAuditoriaOption | null {
  const lower = term.trim().toLowerCase()
  if (!lower) return null

  const exactEmail = options.filter((o) => o.email.toLowerCase() === lower)
  if (exactEmail.length === 1) return exactEmail[0]

  if (options.length === 1) return options[0]

  const partial = options.filter(
    (o) =>
      o.email.toLowerCase().includes(lower) || (o.nombre?.toLowerCase().includes(lower) ?? false),
  )
  if (partial.length === 1) return partial[0]
  return null
}
