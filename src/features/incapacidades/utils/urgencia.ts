import type { UrgenciaNivel } from '../types/urgencia'
import type { IncapacidadListItem } from '../types/listIncapacidades'

const PRIORIDAD: Readonly<Record<UrgenciaNivel, number>> = {
  rojo: 0,
  amarillo: 1,
  verde: 2,
}

export function normalizarUrgencia(raw: string | null | undefined): UrgenciaNivel | null {
  const v = raw?.trim().toLowerCase()
  if (v === 'verde' || v === 'amarillo' || v === 'rojo') return v
  return null
}

export function prioridadUrgencia(raw: string | null | undefined): number {
  const nivel = normalizarUrgencia(raw)
  if (!nivel) return 99
  return PRIORIDAD[nivel]
}

export function labelUrgencia(raw: string | null | undefined): string {
  const nivel = normalizarUrgencia(raw)
  if (nivel === 'rojo') return 'Urgente'
  if (nivel === 'amarillo') return 'Alerta'
  if (nivel === 'verde') return 'En plazo'
  return 'Sin dato'
}

/** Ordena con rojo primero, luego amarillo, verde y sin urgencia al final. */
export function ordenarPorUrgenciaDesc(
  items: readonly IncapacidadListItem[],
): IncapacidadListItem[] {
  return [...items].sort((a, b) => prioridadUrgencia(a.urgencia) - prioridadUrgencia(b.urgencia))
}
