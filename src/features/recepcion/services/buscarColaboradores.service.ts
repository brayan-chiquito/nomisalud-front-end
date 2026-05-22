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

function extractRawItems(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  const record = data as Record<string, unknown>
  if (Array.isArray(record.items)) return record.items
  if (Array.isArray(record.results)) return record.results
  return []
}

function normalizeColaboradorItems(data: unknown): readonly ColaboradorBusquedaItem[] {
  const raw = extractRawItems(data)
  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const r = row as Record<string, unknown>
      const id = typeof r.id === 'string' ? r.id : ''
      const nombre =
        typeof r.nombre_completo === 'string'
          ? r.nombre_completo
          : typeof r.nombre === 'string'
            ? r.nombre
            : ''
      const documento =
        typeof r.numero_documento === 'string'
          ? r.numero_documento
          : typeof r.documento === 'string'
            ? r.documento
            : ''
      const email = typeof r.email === 'string' ? r.email : ''
      if (!id) return null
      return {
        id,
        nombre_completo: nombre,
        numero_documento: documento,
        email,
      } satisfies ColaboradorBusquedaItem
    })
    .filter((item): item is ColaboradorBusquedaItem => item !== null)
}

export async function buscarColaboradores(
  params: BuscarColaboradoresParams,
): Promise<readonly ColaboradorBusquedaItem[]> {
  const q = params.q.trim()
  if (q.length < 2) return []

  const { data } = await http.get<ColaboradoresBuscarResponse | ColaboradorBusquedaItem[]>(
    '/colaboradores/buscar',
    {
      params: { q, limit: params.limit ?? 10 },
      signal: params.signal,
    },
  )
  return normalizeColaboradorItems(data)
}
