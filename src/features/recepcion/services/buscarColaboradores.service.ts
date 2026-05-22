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

function pickStringField(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string') return value
  }
  return ''
}

function mapColaboradorRow(row: unknown): ColaboradorBusquedaItem | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  const id = pickStringField(r, 'id')
  if (!id) return null
  return {
    id,
    nombre_completo: pickStringField(r, 'nombre_completo', 'nombre'),
    numero_documento: pickStringField(r, 'numero_documento', 'documento'),
    email: pickStringField(r, 'email'),
  }
}

function normalizeColaboradorItems(data: unknown): readonly ColaboradorBusquedaItem[] {
  const raw = extractRawItems(data)
  return raw.map(mapColaboradorRow).filter((item): item is ColaboradorBusquedaItem => item !== null)
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
