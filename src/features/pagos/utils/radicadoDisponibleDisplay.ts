import type { RadicadoDisponible } from '../types/radicadoDisponible'

export function radicadoDisponibleSubtitle(row: RadicadoDisponible): string {
  const parts: string[] = []
  if (row.colaborador_nombre?.trim()) parts.push(row.colaborador_nombre.trim())
  else if (row.colaborador_email?.trim()) parts.push(row.colaborador_email.trim())
  if (row.entidad_nombre?.trim()) parts.push(row.entidad_nombre.trim())
  return parts.join(' · ')
}

export const EMPTY_DISPONIBLES_CONTABILIDAD =
  'No hay radicados pendientes de liquidar. Cuando RRHH marque trámites como cobrada, aparecerán aquí.'

export const EMPTY_DISPONIBLES_RRHH =
  'No hay radicados pendientes de liquidar. Marca trámites como cobrada en Cobro ante entidad antes de registrar el pago.'
