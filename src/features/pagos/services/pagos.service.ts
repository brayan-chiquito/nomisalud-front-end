import { http } from '@/services/http'
import type { CreatePagoPayload, PagosListResponse, PagoListItem } from '../types/pago'

export type ListPagosParams = Readonly<{
  page?: number
  entidad?: string
  estado?: string
  fecha_desde?: string
  fecha_hasta?: string
  signal?: AbortSignal
}>

function buildQuery(params: Omit<ListPagosParams, 'signal'>): Record<string, string | number> {
  const q: Record<string, string | number> = { page: params.page ?? 1 }
  if (params.entidad?.trim()) q.entidad = params.entidad.trim()
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

export async function createPago(
  payload: CreatePagoPayload,
  signal?: AbortSignal,
): Promise<PagoListItem> {
  const { data } = await http.post<PagoListItem>('/pagos', payload, { signal })
  return data
}
