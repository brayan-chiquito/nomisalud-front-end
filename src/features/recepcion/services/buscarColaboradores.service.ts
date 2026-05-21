import { http } from '@/services/http'
import type {
  ColaboradorBusquedaItem,
  ColaboradoresBuscarResponse,
} from '../types/colaboradorBusqueda'

export type BuscarColaboradoresParams = Readonly<{
  q: string
  limit?: number
  signal?: AbortSignal
}>

export async function buscarColaboradores(
  params: BuscarColaboradoresParams,
): Promise<readonly ColaboradorBusquedaItem[]> {
  const q = params.q.trim()
  if (q.length < 2) return []

  const { data } = await http.get<ColaboradoresBuscarResponse>('/colaboradores/buscar', {
    params: { q, limit: params.limit ?? 10 },
    signal: params.signal,
  })
  return data.items ?? []
}
