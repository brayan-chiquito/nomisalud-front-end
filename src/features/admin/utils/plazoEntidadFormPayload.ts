import type {
  CreatePlazoEntidadPayload,
  PlazoEntidadItem,
  UpdatePlazoEntidadPayload,
} from '../types/plazoEntidad'

export type PlazoEntidadFormValues = Readonly<{
  entidad_nombre: string
  tipo_incapacidad: string
  valor_limite: string
  unidad_limite: string
  dias_alerta: string
  dias_promedio_pago: string
}>

export function emptyPlazoEntidadFormValues(): PlazoEntidadFormValues {
  return {
    entidad_nombre: '',
    tipo_incapacidad: 'general',
    valor_limite: '',
    unidad_limite: 'dias',
    dias_alerta: '',
    dias_promedio_pago: '',
  }
}

export function plazoEntidadFormValuesFromItem(item: PlazoEntidadItem): PlazoEntidadFormValues {
  return {
    entidad_nombre: item.entidad_nombre,
    tipo_incapacidad: item.tipo_incapacidad,
    valor_limite: String(item.valor_limite),
    unidad_limite: item.unidad_limite,
    dias_alerta: String(item.dias_alerta),
    dias_promedio_pago: item.dias_promedio_pago == null ? '' : String(item.dias_promedio_pago),
  }
}

function parsePositiveInt(raw: string, fieldLabel: string): number {
  const n = Number.parseInt(raw.trim(), 10)
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`${fieldLabel} debe ser un entero mayor que cero.`)
  }
  return n
}

function parseOptionalPositiveInt(raw: string): number | null | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return null
  return parsePositiveInt(trimmed, 'Días promedio de pago')
}

export function buildCreatePlazoEntidadPayload(
  values: PlazoEntidadFormValues,
): CreatePlazoEntidadPayload {
  const entidad = values.entidad_nombre.trim()
  if (!entidad) throw new Error('Indica el nombre de la entidad.')

  const pagoProm = parseOptionalPositiveInt(values.dias_promedio_pago)
  const payload = {
    entidad_nombre: entidad,
    tipo_incapacidad: values.tipo_incapacidad,
    valor_limite: parsePositiveInt(values.valor_limite, 'Plazo límite'),
    unidad_limite: values.unidad_limite,
    dias_alerta: parsePositiveInt(values.dias_alerta, 'Días de alerta'),
    ...(pagoProm == null ? {} : { dias_promedio_pago: pagoProm }),
  } satisfies CreatePlazoEntidadPayload

  return payload
}

export function buildUpdatePlazoEntidadPayload(
  values: PlazoEntidadFormValues,
  original: PlazoEntidadItem,
): UpdatePlazoEntidadPayload {
  const payload: {
    entidad_nombre?: string
    tipo_incapacidad?: string
    valor_limite?: number
    unidad_limite?: string
    dias_alerta?: number
    dias_promedio_pago?: number | null
  } = {}
  const entidad = values.entidad_nombre.trim()
  if (!entidad) throw new Error('Indica el nombre de la entidad.')
  if (entidad !== original.entidad_nombre) payload.entidad_nombre = entidad
  if (values.tipo_incapacidad !== original.tipo_incapacidad) {
    payload.tipo_incapacidad = values.tipo_incapacidad
  }

  const valor = parsePositiveInt(values.valor_limite, 'Plazo límite')
  if (valor !== original.valor_limite) payload.valor_limite = valor
  if (values.unidad_limite !== original.unidad_limite) payload.unidad_limite = values.unidad_limite

  const alerta = parsePositiveInt(values.dias_alerta, 'Días de alerta')
  if (alerta !== original.dias_alerta) payload.dias_alerta = alerta

  const pagoProm = parseOptionalPositiveInt(values.dias_promedio_pago)
  const originalPago = original.dias_promedio_pago ?? null
  if (pagoProm !== originalPago && pagoProm !== undefined) payload.dias_promedio_pago = pagoProm

  if (Object.keys(payload).length === 0) {
    throw new Error('No hay cambios para guardar.')
  }

  return payload
}
