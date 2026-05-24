import { http } from '@/services/http'
import { listSearchQueryVariants } from '@/features/incapacidades/utils/listSearchQuery'
import { RADICADOS_DISPONIBLES_API_PATH } from '@/features/auth/utils/financialModuleAccess'
import type { CreatePagoPayload, PagosListResponse, PagoListItem } from '../types/pago'
import type { RadicadosDisponiblesResponse } from '../types/radicadoDisponible'

export type ListPagosParams = Readonly<{
  page?: number
  /** Búsqueda libre: entidad, referencia, monto (SCRUM-216). */
  q?: string
  /** Legacy: subcadena en entidad_origen. */
  entidad?: string
  estado?: string
  fecha_desde?: string
  fecha_hasta?: string
  signal?: AbortSignal
}>

function buildQuery(params: Omit<ListPagosParams, 'signal'>): Record<string, string | number> {
  const q: Record<string, string | number> = { page: params.page ?? 1 }
  const search = params.q?.trim()
  if (search) q.q = search
  else if (params.entidad?.trim()) q.entidad = params.entidad.trim()
  if (params.estado?.trim()) q.estado = params.estado.trim().toLowerCase()
  if (params.fecha_desde?.trim()) q.fecha_desde = params.fecha_desde.trim()
  if (params.fecha_hasta?.trim()) q.fecha_hasta = params.fecha_hasta.trim()
  return q
}

export async function listPagos(params: ListPagosParams = {}): Promise<PagosListResponse> {
  const { signal, ...rest } = params
  const { data } = await http.get<PagosListResponse>('/pagos', {
    params: buildQuery(rest),
    signal,
  })
  return data
}

/** Listado de pagos con `q` y reintentos por variante de correo. */
export async function listPagosWithTextSearch(
  params: Omit<ListPagosParams, 'q' | 'entidad'>,
  searchTerm: string,
): Promise<PagosListResponse> {
  const term = searchTerm.trim()
  if (!term) return listPagos(params)

  const variants = listSearchQueryVariants(term)
  for (let i = 0; i < variants.length; i++) {
    const res = await listPagos({ ...params, q: variants[i] })
    if (res.items.length > 0 || res.total > 0 || i === variants.length - 1) return res
  }
  return listPagos({ ...params, q: term })
}

export type ListRadicadosDisponiblesParams = Readonly<{
  page?: number
  /** Búsqueda libre: radicado, colaborador, entidad (SCRUM-216). */
  q?: string
  /** Legacy: subcadena en nombre de entidad. */
  entidad?: string
  signal?: AbortSignal
}>

function buildRadicadosQuery(
  params: Omit<ListRadicadosDisponiblesParams, 'signal'>,
): Record<string, string | number> {
  const q: Record<string, string | number> = { page: params.page ?? 1 }
  const search = params.q?.trim()
  if (search) q.q = search
  else if (params.entidad?.trim()) q.entidad = params.entidad.trim()
  return q
}

export async function listRadicadosDisponibles(
  params: ListRadicadosDisponiblesParams = {},
): Promise<RadicadosDisponiblesResponse> {
  const { signal, ...rest } = params
  const { data } = await http.get<RadicadosDisponiblesResponse>(RADICADOS_DISPONIBLES_API_PATH, {
    params: buildRadicadosQuery(rest),
    signal,
  })
  return data
}

/** Radicados disponibles con `q` y reintentos por variante de correo. */
export async function listRadicadosDisponiblesWithTextSearch(
  params: Omit<ListRadicadosDisponiblesParams, 'q' | 'entidad'>,
  searchTerm: string,
): Promise<RadicadosDisponiblesResponse> {
  const term = searchTerm.trim()
  if (!term) return listRadicadosDisponibles(params)

  const variants = listSearchQueryVariants(term)
  for (let i = 0; i < variants.length; i++) {
    const res = await listRadicadosDisponibles({ ...params, q: variants[i] })
    if (res.items.length > 0 || res.total > 0 || i === variants.length - 1) return res
  }
  return listRadicadosDisponibles({ ...params, q: term })
}

export async function createPago(
  payload: CreatePagoPayload,
  signal?: AbortSignal,
): Promise<PagoListItem> {
  const { data } = await http.post<PagoListItem>('/pagos', payload, { signal })
  return data
}
