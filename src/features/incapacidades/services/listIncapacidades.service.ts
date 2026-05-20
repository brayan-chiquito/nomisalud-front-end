import { http } from '@/services/http'
import type { IncapacidadesListResponse } from '../types/listIncapacidades'

export type ListIncapacidadesParams = Readonly<{
  page?: number
  estado?: string
  tipo?: string
  entidad?: string
  urgencia?: string
  signal?: AbortSignal
}>

function buildQuery(
  params: Omit<ListIncapacidadesParams, 'signal'>,
): Record<string, string | number> {
  const q: Record<string, string | number> = { page: params.page ?? 1 }
  if (params.estado?.trim()) q.estado = params.estado.trim()
  if (params.tipo?.trim()) q.tipo = params.tipo.trim()
  if (params.entidad?.trim()) q.entidad = params.entidad.trim()
  if (params.urgencia?.trim()) q.urgencia = params.urgencia.trim().toLowerCase()
  return q
}

export async function listIncapacidades(
  params: ListIncapacidadesParams = {},
): Promise<IncapacidadesListResponse> {
  const { signal, ...rest } = params
  const { data } = await http.get<IncapacidadesListResponse>('/incapacidades', {
    params: buildQuery(rest),
    signal,
  })
  return data
}
