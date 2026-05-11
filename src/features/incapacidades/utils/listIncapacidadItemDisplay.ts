import type { IncapacidadListItem } from '../types/listIncapacidades'

function pickFirstNonEmpty(...values: (string | undefined | null)[]): string {
  for (const v of values) {
    const t = typeof v === 'string' ? v.trim() : ''
    if (t) return t
  }
  return ''
}

/**
 * Texto para la columna Colaborador: `colaborador_nombre`, si falta `colaborador_email`
 * (según API), luego datos extraídos legacy.
 */
export function colaboradorNombreLegible(row: IncapacidadListItem): string {
  const nombre = pickFirstNonEmpty(row.colaborador_nombre, row.nombre_colaborador)
  if (nombre) return nombre
  const email = pickFirstNonEmpty(row.colaborador_email)
  if (email) return email
  const c = row.datos_extraidos?.colaborador
  return pickFirstNonEmpty(c?.nombre, c?.nombres, c?.nombre_completo)
}

/** Tooltip: nombre, correo e id cuando aplica. */
export function colaboradorTooltipLista(row: IncapacidadListItem): string {
  const parts: string[] = []
  const nombre = pickFirstNonEmpty(row.colaborador_nombre, row.nombre_colaborador)
  const email = pickFirstNonEmpty(row.colaborador_email)
  if (nombre) parts.push(nombre)
  if (email && email !== nombre) parts.push(email)
  if (!nombre && !email) {
    const c = row.datos_extraidos?.colaborador
    const legacy = pickFirstNonEmpty(c?.nombre, c?.nombres, c?.nombre_completo)
    if (legacy) parts.push(legacy)
  }
  parts.push(`ID: ${row.colaborador_id}`)
  return parts.join(' · ')
}

/** Tipo de **documento** adjunto (`archivo_tipo`: pdf, jpg, png), no el tipo clínico de incapacidad. */
export function tipoArchivoLegible(row: IncapacidadListItem): string {
  const t = row.archivo_tipo?.trim()
  return t ? t.toUpperCase() : '—'
}

export function entidadNombreLegible(row: IncapacidadListItem): string {
  return pickFirstNonEmpty(row.entidad_nombre, row.datos_extraidos?.entidad?.nombre)
}

/** Texto secundario para tooltip (tipo EPS, NIT, ciudad). */
export function entidadDetalleTooltip(row: IncapacidadListItem): string {
  return [row.entidad_tipo, row.entidad_nit, row.entidad_ciudad]
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .join(' · ')
}
