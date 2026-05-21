import type { AuditoriaAccesoItem } from '../types/auditoriaAcceso'

export function usuarioAuditoriaLabel(row: AuditoriaAccesoItem): string {
  const nombre = row.usuario_nombre?.trim()
  if (nombre) return nombre
  const email = row.usuario_email?.trim()
  if (email) return email
  return row.user_id
}

export function usuarioAuditoriaTooltip(row: AuditoriaAccesoItem): string {
  const parts: string[] = []
  if (row.usuario_nombre?.trim()) parts.push(row.usuario_nombre.trim())
  if (row.usuario_email?.trim()) parts.push(row.usuario_email.trim())
  parts.push(`ID: ${row.user_id}`)
  return parts.join(' · ')
}

export function formatAuditoriaTimestamp(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Convierte `YYYY-MM-DD` del date input a ISO inicio/fin de día (UTC local). */
export function dateInputToIsoStart(date: string): string | undefined {
  const trimmed = date.trim()
  if (!trimmed) return undefined
  const d = new Date(`${trimmed}T00:00:00`)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

export function dateInputToIsoEnd(date: string): string | undefined {
  const trimmed = date.trim()
  if (!trimmed) return undefined
  const d = new Date(`${trimmed}T23:59:59.999`)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}
