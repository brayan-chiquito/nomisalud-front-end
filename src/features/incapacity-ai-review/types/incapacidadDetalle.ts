/**
 * Registro de `historial_estados` en detalle (ver docs/README.md).
 */
export type HistorialEstadoRecord = Readonly<{
  id?: string
  estado_anterior?: string | null
  estado_nuevo?: string
  /** Alias tolerado si el backend envía solo `estado` */
  estado?: string
  timestamp: string
  user_id?: string | null
  usuario_nombre?: string | null
  observacion?: string | null
}>

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
  updated_at?: string
  colaborador_nombre?: string | null
  colaborador_email?: string | null
  archivo_url?: string | null
  documentacion_faltante?: string[] | null
  /** Días hábiles restantes para entregar documentación (si la API los expone). */
  dias_habiles_restantes?: number | null
  /** Plazo máximo en días hábiles (si la API lo expone). */
  plazo_maximo_dias_habiles?: number | null
  /** Fecha límite ISO para completar documentación. */
  fecha_vencimiento_documentacion?: string | null
  historial_estados?: HistorialEstadoRecord[] | null
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

/** Cuerpo de `PATCH /incapacidades/{id}/estado` (ver docs/README.md). */
export type PatchIncapacidadEstadoPayload = Readonly<{
  estado: string
  observacion?: string
}>

export type PatchIncapacidadEstadoResponse = Readonly<{
  id: string
  radicado: string
  estado: string
  estado_anterior: string
}>
