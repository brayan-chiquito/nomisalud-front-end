export type ConciliacionPendienteItem = Readonly<{
  id: string
  radicado: string
  colaborador_nombre?: string | null
  entidad_nombre?: string | null
  incapacidad_tipo_extraido?: string | null
  fecha_recepcion: string
  fecha_cobrada: string
}>

export type ConciliacionDetalleItem = Readonly<{
  id: string
  radicado: string
  estado: string
  colaborador_nombre?: string | null
  entidad_nombre?: string | null
  incapacidad_tipo_extraido?: string | null
  fecha_recepcion: string
  monto_pagado?: string | null
  referencia_pago?: string | null
  liquidado: boolean
}>

export type ConciliacionResponse = Readonly<{
  entidad: string
  mes: number
  anio: number
  total_cobrado: string
  total_pagado: string
  diferencia: string
  cantidad_cobrada_periodo: number
  cantidad_pendiente_pago: number
  pendientes: readonly ConciliacionPendienteItem[]
  detalle: readonly ConciliacionDetalleItem[]
}>

export type GetConciliacionParams = Readonly<{
  entidad: string
  mes: number
  anio: number
  signal?: AbortSignal
}>

export type ExportConciliacionParams = Readonly<{
  mes: number
  anio: number
  entidad?: string
  signal?: AbortSignal
}>
