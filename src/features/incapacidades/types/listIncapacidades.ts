import type { UrgenciaNivel } from './urgencia'

/**
 * Ítem de `GET /incapacidades` (ver `docs/README.md`).
 * `datos_extraidos` opcional conserva compatibilidad con respuestas antiguas.
 */
export type DatosExtraidosListado = Readonly<{
  colaborador?: Readonly<{ nombre?: string; nombres?: string; nombre_completo?: string }>
  incapacidad?: Readonly<{ tipo?: string }>
  entidad?: Readonly<{ nombre?: string }>
}>

export type IncapacidadListItem = Readonly<{
  id: string
  radicado: string
  estado: string
  colaborador_id: string
  archivo_tipo: string
  fecha_recepcion: string
  colaborador_nombre?: string | null
  colaborador_email?: string | null
  entidad_nombre?: string | null
  entidad_tipo?: string | null
  entidad_nit?: string | null
  entidad_ciudad?: string | null
  incapacidad_tipo_extraido?: string | null
  /** Semáforo calculado por plazos de entidad (SCRUM-176/177). */
  urgencia?: UrgenciaNivel | string | null
  /** `true` si superó `dias_promedio_pago` sin liquidar tras `cobrada` (SCRUM-193/194). */
  pago_retrasado?: boolean
  /** Respuesta legacy; preferir `colaborador_nombre` */
  nombre_colaborador?: string | null
  datos_extraidos?: DatosExtraidosListado | null
}>

export type IncapacidadesListResponse = Readonly<{
  items: IncapacidadListItem[]
  total: number
  pages: number
}>
