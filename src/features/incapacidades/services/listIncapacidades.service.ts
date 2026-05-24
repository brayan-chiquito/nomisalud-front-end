import { http } from '@/services/http'
import type { IncapacidadesListResponse } from '../types/listIncapacidades'

/** Filtros compartidos entre listado paginado y exportación XLSX (SCRUM-215). */
export type IncapacidadesFilterParams = Readonly<{
  estado?: string
  tipo?: string
  /** Búsqueda libre: colaborador (nombre, correo, documento), entidad, radicado, etc. */
  q?: string
  /** Filtro por nombre de entidad (conciliación / selección exacta). */
  entidad?: string
  urgencia?: string
  /** `true` → solo trámites marcados por el job diario (SCRUM-194). */
  pagoRetrasado?: boolean
}>

export type ListIncapacidadesParams = IncapacidadesFilterParams &
  Readonly<{
    page?: number
    signal?: AbortSignal
  }>

/** Serializa filtros activos hacia query params (sin `page`). */
export function buildIncapacidadesFilterQuery(
  params: IncapacidadesFilterParams,
): Record<string, string> {
  const q: Record<string, string> = {}
  if (params.estado?.trim()) q.estado = params.estado.trim()
  if (params.tipo?.trim()) q.tipo = params.tipo.trim()
  if (params.q?.trim()) q.q = params.q.trim()
  if (params.entidad?.trim()) q.entidad = params.entidad.trim()
  if (params.urgencia?.trim()) q.urgencia = params.urgencia.trim().toLowerCase()
  if (params.pagoRetrasado === true) q.pago_retrasado = 'true'
  return q
}

function buildListQuery(
  params: Omit<ListIncapacidadesParams, 'signal'>,
): Record<string, string | number> {
  return { page: params.page ?? 1, ...buildIncapacidadesFilterQuery(params) }
}

export async function listIncapacidades(
  params: ListIncapacidadesParams = {},
): Promise<IncapacidadesListResponse> {
  const { signal, ...rest } = params
  const { data } = await http.get<IncapacidadesListResponse>('/incapacidades', {
    params: buildListQuery(rest),
    signal,
  })
  return data
}
