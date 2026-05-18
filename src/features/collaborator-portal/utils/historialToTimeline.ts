import type { StatusTimelineRecord, StatusTimelinePhase } from '../components/StatusTimeline'
import { labelEstadoIncapacidad } from '@/features/incapacidades/utils/estadoBadge'
import type { HistorialEstadoRecord } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

function pickEstadoLabel(entry: HistorialEstadoRecord): string {
  const raw = entry.estado_nuevo ?? entry.estado ?? ''
  return labelEstadoIncapacidad(raw)
}

function pickUsuario(entry: HistorialEstadoRecord): string {
  const nombre = entry.usuario_nombre?.trim()
  if (nombre) return nombre
  return 'Sistema'
}

/**
 * Convierte el historial del detalle en entradas para {@link StatusTimeline}.
 * El último evento que coincide con `estadoActual` se marca como `current`; el resto, `completed`.
 */
export function historialToTimelineRecords(
  historial: readonly HistorialEstadoRecord[],
  estadoActual: string,
): StatusTimelineRecord[] {
  if (historial.length === 0) {
    return [
      {
        id: `actual-${estadoActual}`,
        estadoLabel: labelEstadoIncapacidad(estadoActual),
        phase: 'current',
        usuarioNombre: 'Sistema',
        occurredAtIso: new Date().toISOString(),
      },
    ]
  }

  const sorted = [...historial].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  const lastIndex = sorted.length - 1

  return sorted.map((entry, index) => {
    const estado = entry.estado_nuevo ?? entry.estado ?? ''
    const isLast = index === lastIndex
    const phase: StatusTimelinePhase = isLast ? 'current' : 'completed'

    return {
      id: entry.id ?? `${entry.timestamp}-${estado}`,
      estadoLabel: pickEstadoLabel(entry),
      phase,
      usuarioNombre: pickUsuario(entry),
      occurredAtIso: entry.timestamp,
    }
  })
}
