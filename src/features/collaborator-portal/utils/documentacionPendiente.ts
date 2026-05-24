import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

export type DocumentacionPendienteData = Readonly<{
  documentos: readonly string[]
  diasHabilesRestantes: number | null
  plazoMaximoDiasHabiles: number | null
  fechaVencimientoIso: string | null
}>

function pickNumber(obj: Record<string, unknown>, key: string): number | null {
  const v = obj[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v)
  return null
}

function pickString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key]
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

function plazoFromDetalle(
  detail: IncapacidadDetalle,
): Pick<
  DocumentacionPendienteData,
  'diasHabilesRestantes' | 'plazoMaximoDiasHabiles' | 'fechaVencimientoIso'
> {
  const raw = detail as Record<string, unknown>
  const diasRestantes = detail.dias_habiles_restantes ?? pickNumber(raw, 'dias_habiles_restantes')
  const plazoMax = detail.plazo_maximo_dias_habiles ?? pickNumber(raw, 'plazo_maximo_dias_habiles')
  const fecha =
    detail.fecha_vencimiento_documentacion ??
    pickString(raw, 'fecha_vencimiento_documentacion') ??
    pickString(raw, 'fecha_limite_documentacion')

  return {
    diasHabilesRestantes: diasRestantes,
    plazoMaximoDiasHabiles: plazoMax,
    fechaVencimientoIso: fecha,
  }
}

/**
 * Deriva datos del banner desde el detalle (`GET /incapacidades/{id}`).
 * Solo aplica si el estado es `doc_incompleta` y hay documentos en `documentacion_faltante`.
 */
export function documentacionPendienteFromDetalle(
  detail: IncapacidadDetalle | null | undefined,
): DocumentacionPendienteData | null {
  if (!detail || detail.estado !== 'doc_incompleta') return null
  const documentos = (detail.documentacion_faltante ?? []).map((d) => d.trim()).filter(Boolean)
  if (documentos.length === 0) return null

  return {
    documentos,
    ...plazoFromDetalle(detail),
  }
}

export function formatFechaVencimiento(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/** Texto de plazo para el banner (días hábiles y/o fecha límite). */
export function formatPlazoDocumentacion(data: DocumentacionPendienteData): string | null {
  const parts: string[] = []

  if (data.plazoMaximoDiasHabiles != null && data.plazoMaximoDiasHabiles > 0) {
    const n = data.plazoMaximoDiasHabiles
    parts.push(`Plazo máximo: ${n} día${n === 1 ? '' : 's'} hábil${n === 1 ? '' : 'es'}`)
  }

  if (data.diasHabilesRestantes != null && data.diasHabilesRestantes >= 0) {
    const n = data.diasHabilesRestantes
    parts.push(`Te quedan ${n} día${n === 1 ? '' : 's'} hábil${n === 1 ? '' : 'es'}`)
  }

  if (data.fechaVencimientoIso) {
    parts.push(`Vence el ${formatFechaVencimiento(data.fechaVencimientoIso)}`)
  }

  if (parts.length === 0) return null
  return parts.join(' — ')
}
