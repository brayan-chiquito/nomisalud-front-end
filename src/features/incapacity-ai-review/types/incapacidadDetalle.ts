/**
 * Respuesta de `GET /incapacidades/{id}` (ver docs/README.md).
 * `datos_extraidos` es JSON flexible según extracción IA.
 */
export type ExtraccionIaDetalle = Readonly<{
  datos_extraidos?: Record<string, unknown> | null
  calidad_doc?: number | string | null
  validaciones?: unknown
}>

export type IncapacidadDetalle = Readonly<{
  id: string
  radicado: string
  estado: string
  archivo_tipo: string
  fecha_recepcion?: string
  colaborador_nombre?: string | null
  colaborador_email?: string | null
  archivo_url?: string | null
  extraccion_ia: ExtraccionIaDetalle | null
}>

export type VerificarIncapacidadPayload = Readonly<{
  accion: 'confirmar' | 'rechazar'
  motivo_rechazo?: string
  datos_extraidos?: Record<string, unknown>
}>

export type VerificarIncapacidadResponse = Readonly<{
  id: string
  radicado: string
  estado: string
}>
