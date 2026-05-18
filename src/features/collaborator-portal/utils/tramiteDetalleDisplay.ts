import type { IncapacidadDetalle } from '@/features/incapacity-ai-review/types/incapacidadDetalle'

function pickString(...values: (string | undefined | null)[]): string {
  for (const v of values) {
    const t = typeof v === 'string' ? v.trim() : ''
    if (t) return t
  }
  return '—'
}

function readIncapacidadCampo(
  datos: Record<string, unknown> | null | undefined,
  key: string,
): string | undefined {
  if (!datos) return undefined
  const inc = datos.incapacidad
  if (inc && typeof inc === 'object' && key in inc) {
    const val = (inc as Record<string, unknown>)[key]
    if (typeof val === 'string' && val.trim()) return val.trim()
    if (typeof val === 'number') return String(val)
  }
  return undefined
}

export type TramiteDetalleDisplay = Readonly<{
  tipoIncapacidad: string
  entidadNombre: string
  diasIncapacidad: string
  fechaCarga: string
}>

export function tramiteDetalleToDisplay(detail: IncapacidadDetalle): TramiteDetalleDisplay {
  const datos = detail.extraccion_ia?.datos_extraidos ?? null
  const entidadObj =
    datos && typeof datos.entidad === 'object' && datos.entidad !== null
      ? (datos.entidad as Record<string, unknown>)
      : null

  const tipo = pickString(
    readIncapacidadCampo(datos, 'origen'),
    readIncapacidadCampo(datos, 'tipo'),
    detail.extraccion_ia ? undefined : null,
  )

  const dias = pickString(readIncapacidadCampo(datos, 'dias'))
  const diasLabel =
    dias !== '—' && !dias.endsWith('días') && !dias.endsWith('día') ? `${dias} días` : dias

  const entidad = pickString(typeof entidadObj?.nombre === 'string' ? entidadObj.nombre : undefined)

  const fecha = detail.fecha_recepcion
    ? new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(detail.fecha_recepcion))
    : '—'

  return {
    tipoIncapacidad: tipo,
    entidadNombre: entidad,
    diasIncapacidad: diasLabel,
    fechaCarga: fecha,
  }
}
