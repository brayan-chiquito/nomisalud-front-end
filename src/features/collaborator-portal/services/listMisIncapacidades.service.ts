import { http } from '@/services/http'
import type { MisIncapacidadesResponse } from '../types/misIncapacidades'

export type ListMisIncapacidadesParams = Readonly<{
  page?: number
  signal?: AbortSignal
}>

/**
 * GET `/incapacidades/mias` — trámites del colaborador autenticado (rol colaborador).
 */
export async function listMisIncapacidades(
  params: ListMisIncapacidadesParams = {},
): Promise<MisIncapacidadesResponse> {
  const { signal, page = 1 } = params
  const { data } = await http.get<MisIncapacidadesResponse>('/incapacidades/mias', {
    params: { page },
    signal,
  })
  return data
}
